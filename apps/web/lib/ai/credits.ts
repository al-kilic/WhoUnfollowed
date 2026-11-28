import 'server-only';
import { and, count, desc, eq, gte, ne, sql } from 'drizzle-orm';
import { db } from '@/lib/db/index';
import { aiCreditLedger } from '@/lib/db/schema';
import { creditBalance, nextExpiry, type CreditRow } from './creditMath';

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

async function rowsFor(exec: Tx | typeof db, userId: string): Promise<CreditRow[]> {
  return exec
    .select({ delta: aiCreditLedger.delta, expiresAt: aiCreditLedger.expiresAt, createdAt: aiCreditLedger.createdAt })
    .from(aiCreditLedger)
    .where(eq(aiCreditLedger.userId, userId));
}

// One user's credit operations run one at a time, so two AI requests at once
// can't both spend the last credits.
async function lockUser(tx: Tx, userId: string): Promise<void> {
  await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${'ai-credits:' + userId}))`);
}

export async function getCredits(userId: string, now: Date = new Date()): Promise<{ balance: number; resetsAt: Date | null }> {
  const rows = await rowsFor(db, userId);
  return { balance: creditBalance(rows, now), resetsAt: nextExpiry(rows, now) };
}

// Adds an allowance or a top-up. periodKey makes it idempotent: a retried
// webhook for the same invoice or month grants nothing the second time.
export async function grantCredits(opts: {
  userId: string;
  amount: number;
  reason: 'grant' | 'topup';
  periodKey: string;
  expiresAt: Date | null;
}): Promise<boolean> {
  const inserted = await db
    .insert(aiCreditLedger)
    .values({ userId: opts.userId, delta: opts.amount, reason: opts.reason, periodKey: opts.periodKey, expiresAt: opts.expiresAt })
    .onConflictDoNothing()
    .returning({ id: aiCreditLedger.id });
  return inserted.length > 0;
}

export type SpendResult = { ok: true; spendId: string; balance: number } | { ok: false; balance: number };

// Takes `cost` credits for `action` if the balance covers it.
export async function spendCredits(userId: string, action: string, cost: number, now: Date = new Date()): Promise<SpendResult> {
  if (cost <= 0) return { ok: true, spendId: '', balance: (await getCredits(userId, now)).balance };
  return db.transaction(async (tx) => {
    await lockUser(tx, userId);
    const balance = creditBalance(await rowsFor(tx, userId), now);
    if (balance < cost) return { ok: false, balance } as const;
    const [row] = await tx
      .insert(aiCreditLedger)
      .values({ userId, delta: -cost, reason: 'spend', action })
      .returning({ id: aiCreditLedger.id });
    return { ok: true, spendId: row!.id, balance: balance - cost } as const;
  });
}

// Included actions with a daily limit (Ask coach) leave a 0-credit row, so the
// limit holds across restarts without a table of its own.
export async function logFreeUse(userId: string, action: string): Promise<void> {
  await db.insert(aiCreditLedger).values({ userId, delta: 0, reason: 'spend', action });
}

// How many times `action` ran since `since` (spends and included uses, minus refunds).
export async function usedSince(userId: string, action: string, since: Date): Promise<number> {
  const rows = await db
    .select({ reason: aiCreditLedger.reason, n: count() })
    .from(aiCreditLedger)
    .where(and(eq(aiCreditLedger.userId, userId), eq(aiCreditLedger.action, action), gte(aiCreditLedger.createdAt, since)))
    .groupBy(aiCreditLedger.reason);
  const by = Object.fromEntries(rows.map((r) => [r.reason, r.n]));
  return Math.max(0, (by.spend ?? 0) - (by.refund ?? 0));
}

const dayStart = (now: Date) => new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
export const monthStart = (now: Date) => new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

export async function usedToday(userId: string, action: string, now: Date = new Date()): Promise<number> {
  return usedSince(userId, action, dayStart(now));
}

// Gives credits back when an AI call fails after they were taken. The refund
// expires with the soonest live bucket, so it can't outlive the allowance it
// came from.
export async function refundCredits(userId: string, spendId: string, now: Date = new Date()): Promise<void> {
  if (!spendId) return;
  await db.transaction(async (tx) => {
    await lockUser(tx, userId);
    const [spend] = await tx
      .select({ delta: aiCreditLedger.delta, action: aiCreditLedger.action })
      .from(aiCreditLedger)
      .where(and(eq(aiCreditLedger.id, spendId), eq(aiCreditLedger.userId, userId), eq(aiCreditLedger.reason, 'spend')));
    if (!spend) return;
    const expiresAt = nextExpiry(await rowsFor(tx, userId), now);
    await tx
      .insert(aiCreditLedger)
      .values({ userId, delta: -spend.delta, reason: 'refund', action: spend.action, periodKey: `refund:${spendId}`, expiresAt })
      .onConflictDoNothing();
  });
}

// The latest ledger rows for Studio > You: what was added and what was spent.
export async function creditHistory(userId: string, limit = 10) {
  return db
    .select({ delta: aiCreditLedger.delta, reason: aiCreditLedger.reason, action: aiCreditLedger.action, createdAt: aiCreditLedger.createdAt })
    .from(aiCreditLedger)
    .where(and(eq(aiCreditLedger.userId, userId), ne(aiCreditLedger.delta, 0)))
    .orderBy(desc(aiCreditLedger.createdAt))
    .limit(limit);
}
