import 'server-only';
import { and, eq, gte, sql } from 'drizzle-orm';
import { db } from '@/lib/db/index';
import { aiAllowance, aiUsageLog } from '@/lib/db/schema';
import { sendTelegramMessage } from '@/lib/telegram';
import { calendarPeriodKey, startOfNextMonthUtc } from './creditMath';
import { isSubscriberPlan, type ProAiAccess } from './access';
import {
  ALERT_USD_30D, MONTHLY_ALLOWANCE_USD, REFILL_USD,
  allowanceView, availableUsd, canBuyRefill as canBuyRefillOf, checkAllowance, holdParts, refillExpiry, refillsHeld as refillsHeldOf, releaseParts, splitCharge,
  type AllowanceCheck, type AllowanceView, type Grant, type GrantKind,
} from './allowanceMath';

// Pro AI usage allowance, the database part (the rules are in allowanceMath.ts).

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

// Plans that pay monthly for the coach: they get a month grant and may use refills.
// Pro AI subscribers only (founder, 2026-11-27; see access.ts).
export const hasPaidPlan = (access: ProAiAccess | null): boolean => isSubscriberPlan(access);

async function grantsFor(exec: Tx | typeof db, userId: string): Promise<Grant[]> {
  const rows = await exec.select({
    id: aiAllowance.id, kind: aiAllowance.kind, usd: aiAllowance.usd, usedUsd: aiAllowance.usedUsd, expiresAt: aiAllowance.expiresAt, createdAt: aiAllowance.createdAt,
  }).from(aiAllowance).where(eq(aiAllowance.userId, userId));
  return rows.map((r) => ({ ...r, kind: r.kind as GrantKind }));
}

// One member's allowance operations run one at a time.
async function lockUser(tx: Tx, userId: string): Promise<void> {
  await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${'ai-allowance:' + userId}))`);
}

async function insertGrant(values: typeof aiAllowance.$inferInsert): Promise<boolean> {
  const rows = await db.insert(aiAllowance).values(values).onConflictDoNothing().returning({ id: aiAllowance.id });
  return rows.length > 0;
}

// The month grant for the current billing month. Monthly subscriptions: one per
// Stripe period, expiring when it ends. Yearly, $499 Lifetime and the dev
// preview: one per calendar month. Idempotent (unique user + period key).
export function monthGrantFor(access: ProAiAccess, now: Date): { periodKey: string; expiresAt: Date } | null {
  if (!hasPaidPlan(access)) return null;
  if (access.plan === 'monthly' && access.periodEnd) return { periodKey: `sub:${access.periodEnd.toISOString()}`, expiresAt: access.periodEnd };
  return { periodKey: calendarPeriodKey(`month-${access.plan}`, now), expiresAt: startOfNextMonthUtc(now) };
}

// Grants the month allowance for the current billing month to a Pro AI
// subscriber. Nothing else is granted automatically (no gifts or trials until
// the founder announces them). Safe on every request.
// At most ONE month grant may be live at a time: a plan change or a new
// subscription inside a running month never stacks a second $2.50.
export async function ensureGrants(userId: string, access: ProAiAccess, now: Date = new Date()): Promise<void> {
  const month = monthGrantFor(access, now);
  if (!month) return;
  await db.transaction(async (tx) => {
    await lockUser(tx, userId);
    const live = (await grantsFor(tx, userId)).some((g) => g.kind === 'month' && (!g.expiresAt || g.expiresAt.getTime() > now.getTime()));
    if (live) return;
    await tx.insert(aiAllowance).values({ userId, kind: 'month', usd: MONTHLY_ALLOWANCE_USD, periodKey: month.periodKey, expiresAt: month.expiresAt }).onConflictDoNothing();
  });
}

// A refill bought through Stripe. Keyed on the session id: a retried webhook
// grants nothing the second time. Returns whether it was added.
export async function grantRefill(userId: string, sourceId: string, now: Date = new Date()): Promise<boolean> {
  return insertGrant({ userId, kind: 'refill', usd: REFILL_USD, source: sourceId, expiresAt: refillExpiry(now) });
}

// A gift or trial that never expires. Idempotent on sourceId.
export async function grantGift(userId: string, kind: 'gift' | 'trial', usd: number, sourceId: string): Promise<boolean> {
  return insertGrant({ userId, kind, usd, source: sourceId, expiresAt: null });
}

export async function refillsHeld(userId: string, now: Date = new Date()): Promise<number> {
  return refillsHeldOf(await grantsFor(db, userId), now);
}

// At most MAX_REFILLS_HELD refills with use left, and only on a paid plan.
// The checkout route must call this before creating a refill session.
export async function canBuyRefill(userId: string, access: ProAiAccess | null, now: Date = new Date()): Promise<boolean> {
  return canBuyRefillOf(await grantsFor(db, userId), now, hasPaidPlan(access));
}

const sum = sql<number>`coalesce(sum(${aiUsageLog.costUsd}), 0)::float8`;
const dayStart = (now: Date) => new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

async function usedSinceUsd(userId: string, since: Date): Promise<number> {
  const [row] = await db.select({ v: sum }).from(aiUsageLog).where(and(eq(aiUsageLog.userId, userId), gte(aiUsageLog.createdAt, since)));
  return Number(row?.v ?? 0);
}

export async function available(userId: string, access: ProAiAccess | null, now: Date = new Date()): Promise<number> {
  return availableUsd(await grantsFor(db, userId), now, { refillsUsable: hasPaidPlan(access) });
}

// Before every AI call. A failed read blocks the call rather than risk an
// unknown bill ('empty').
export async function checkUse(userId: string, access: ProAiAccess | null, now: Date = new Date()): Promise<AllowanceCheck> {
  try {
    const [left, today] = await Promise.all([available(userId, access, now), usedSinceUsd(userId, dayStart(now))]);
    return checkAllowance(left, today);
  } catch (err) {
    console.error(`[ai] allowance check failed: ${err instanceof Error ? err.message : 'unknown'}`);
    return 'empty';
  }
}

export interface Hold { userId: string; usd: number; parts: { id: string; add: number }[] }

// Before every AI call: takes the call's worst-case cost (costGuard.ts) from
// the allowance at once, under the member's lock, so two calls at the same
// time can never both use the last of it. 'empty' or 'pace' means the call
// must not run. A failed read also refuses ('empty') rather than risk a bill.
export async function reserve(userId: string, access: ProAiAccess | null, usd: number, now: Date = new Date()): Promise<Hold | 'empty' | 'pace'> {
  if (!hasPaidPlan(access) || !(usd > 0) || !Number.isFinite(usd)) return 'empty';
  try {
    return await db.transaction(async (tx) => {
      await lockUser(tx, userId);
      const grants = await grantsFor(tx, userId);
      const opts = { refillsUsable: true };
      const [today] = await tx.select({ v: sum }).from(aiUsageLog).where(and(eq(aiUsageLog.userId, userId), gte(aiUsageLog.createdAt, dayStart(now))));
      const check = checkAllowance(availableUsd(grants, now, opts), Number(today?.v ?? 0), usd);
      if (check !== 'ok') return check;
      const parts = holdParts(grants, usd, now, opts);
      if (!parts) return 'empty';
      for (const p of parts) {
        await tx.update(aiAllowance).set({ usedUsd: sql`${aiAllowance.usedUsd} + ${p.add}` }).where(eq(aiAllowance.id, p.id));
      }
      return { userId, usd, parts };
    });
  } catch (err) {
    console.error(`[ai] reserve failed: ${err instanceof Error ? err.message : 'unknown'}`);
    return 'empty';
  }
}

// After the call: the real cost replaces the hold. Unknown cost keeps the whole
// hold (we may have been billed). A real cost above the hold should never
// happen (the hold is an upper bound); it is charged as far as anything is
// left and the founder is told, so the estimate can be fixed.
export async function settle(hold: Hold, realUsd: number | null, now: Date = new Date()): Promise<void> {
  const real = typeof realUsd === 'number' && Number.isFinite(realUsd) && realUsd >= 0 ? realUsd : hold.usd;
  if (Math.abs(real - hold.usd) < 1e-9) return;
  await db.transaction(async (tx) => {
    await lockUser(tx, hold.userId);
    if (real < hold.usd) {
      for (const r of releaseParts(hold.parts, hold.usd - real)) {
        await tx.update(aiAllowance).set({ usedUsd: sql`greatest(0, ${aiAllowance.usedUsd} - ${r.sub})` }).where(eq(aiAllowance.id, r.id));
      }
      return;
    }
    for (const p of splitCharge(await grantsFor(tx, hold.userId), real - hold.usd, now, { refillsUsable: true })) {
      await tx.update(aiAllowance).set({ usedUsd: sql`${aiAllowance.usedUsd} + ${p.add}` }).where(eq(aiAllowance.id, p.id));
    }
  });
  if (real > hold.usd) {
    await sendTelegramMessage(`⚠️ AI cost above its worst-case estimate: $${real.toFixed(4)} vs $${hold.usd.toFixed(4)} (user ${hold.userId.slice(0, 8)}). Check lib/ai/costGuard.ts.`).catch(() => null);
  }
}

// After every billed call: the real cost, split over the grants in use order.
export async function charge(userId: string, access: ProAiAccess | null, usd: number | null, now: Date = new Date()): Promise<void> {
  if (typeof usd !== 'number' || !Number.isFinite(usd) || usd <= 0) return;
  await db.transaction(async (tx) => {
    await lockUser(tx, userId);
    const parts = splitCharge(await grantsFor(tx, userId), usd, now, { refillsUsable: hasPaidPlan(access) });
    for (const p of parts) {
      await tx.update(aiAllowance).set({ usedUsd: sql`${aiAllowance.usedUsd} + ${p.add}` }).where(eq(aiAllowance.id, p.id));
    }
  });
  void alertIfHeavy(userId, now).catch(() => undefined);
}

// One Telegram alert per account per 30 days once its real cost passes
// ALERT_USD_30D (in memory, so a restart may alert once more).
const alerted = new Map<string, number>();
const WINDOW = 30 * 86_400_000;
async function alertIfHeavy(userId: string, now: Date): Promise<void> {
  const last = alerted.get(userId);
  if (last && now.getTime() - last < WINDOW) return;
  const used = await usedSinceUsd(userId, new Date(now.getTime() - WINDOW));
  if (used < ALERT_USD_30D) return;
  alerted.set(userId, now.getTime());
  await sendTelegramMessage(`AI use: one account passed $${ALERT_USD_30D} in 30 days ($${used.toFixed(2)}). User ${userId.slice(0, 8)}.`);
}

// For the screens: no dollar amounts, only a share for a bar and flags.
export async function allowanceFor(userId: string, access: ProAiAccess | null, now: Date = new Date()): Promise<AllowanceView> {
  const grants = await grantsFor(db, userId);
  const month = access ? monthGrantFor(access, now) : null;
  return allowanceView(grants, now, { refillsUsable: hasPaidPlan(access), hasPaidPlan: hasPaidPlan(access), resetsAt: month?.expiresAt ?? null });
}
