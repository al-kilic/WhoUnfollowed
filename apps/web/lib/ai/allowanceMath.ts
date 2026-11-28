// Pro AI usage allowance (replaces credits), the pure part. Spec:
// .claude/reference/usage-allowance-spec.md (founder, 2026-11-24).
//
// Members get a monthly allowance measured in what their AI calls really cost
// us (ai_usage_log), never shown as a number. Each call is checked before it
// runs and charged its real cost after. Grants are used in this order:
//   1. the month grant (expires with the billing month),
//   2. gift and trial (never expire; NOT in use since 2026-11-27: only Pro AI
//      subscribers reach AI, see access.ts),
//   3. refills, oldest expiry first (12 months, at most 2 held).
// One limit only: nothing else may block a member who still has allowance,
// except the daily pace (a third of the month in one UTC day) and the global
// emergency brake in spendCap.ts.

export const MONTHLY_ALLOWANCE_USD = 2.5;
export const REFILL_USD = 2.5;
export const REFILL_VALID_MONTHS = 12;
export const MAX_REFILLS_HELD = 2;
export const EARLY_LIFETIME_GIFT_USD = 7.5;
export const LEGACY_TRIAL_USD = 1;
export const PACE_SHARE = 1 / 3;
export const PACE_USD = MONTHLY_ALLOWANCE_USD * PACE_SHARE;
// Lifetime bought before this was the $19.99 to $99 ladder, before AI existed:
// no month allowance, a one-time gift and 60% off monthly Pro AI instead.
export const EARLY_LIFETIME_BEFORE = new Date('2026-11-11T00:00:00Z');
// Telegram alert when one account passes this much real cost in 30 days.
export const ALERT_USD_30D = 2;
export const NEAR_LIMIT_SHARE = 0.9;

// Launch offers (old yearly Pro discount) run LAUNCH_OFFER_DAYS from launch.
export const DEFAULT_LAUNCH_DATE = '2026-12-01';
export const LAUNCH_OFFER_DAYS = 90;
const DAY = 86_400_000;

export function launchDate(value: string | undefined = process.env.PRO_AI_LAUNCH_DATE): Date {
  const v = value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : DEFAULT_LAUNCH_DATE;
  return new Date(`${v}T00:00:00Z`);
}

export function launchOfferEndsAt(launch: Date = launchDate()): Date {
  return new Date(launch.getTime() + LAUNCH_OFFER_DAYS * DAY);
}

export function isEarlyLifetime(lifetimePurchasedAt: Date | null | undefined): boolean {
  return !!lifetimePurchasedAt && lifetimePurchasedAt.getTime() < EARLY_LIFETIME_BEFORE.getTime();
}

export type GrantKind = 'month' | 'refill' | 'gift' | 'trial';
export interface Grant { id: string; kind: GrantKind; usd: number; usedUsd: number; expiresAt: Date | null; createdAt: Date }

export interface UseOptions {
  // Refills only work with a paid plan (subscription or $499 Lifetime).
  refillsUsable: boolean;
}

export const leftOf = (g: Grant): number => Math.max(0, g.usd - g.usedUsd);
const notExpired = (g: Grant, now: Date) => !g.expiresAt || g.expiresAt.getTime() > now.getTime();
const RANK: Record<GrantKind, number> = { month: 0, gift: 1, trial: 1, refill: 2 };
const time = (d: Date | null) => (d ? d.getTime() : Number.POSITIVE_INFINITY);

// The grants a call may draw from, in use order.
export function usable(grants: readonly Grant[], now: Date, opts: UseOptions): Grant[] {
  return grants
    .filter((g) => notExpired(g, now) && leftOf(g) > 0 && (g.kind !== 'refill' || opts.refillsUsable))
    .sort((a, b) => RANK[a.kind] - RANK[b.kind] || time(a.expiresAt) - time(b.expiresAt) || a.createdAt.getTime() - b.createdAt.getTime());
}

export function availableUsd(grants: readonly Grant[], now: Date, opts: UseOptions): number {
  return usable(grants, now, opts).reduce((s, g) => s + leftOf(g), 0);
}

// How a charge is split over the grants, never below zero. Calls reserve their
// worst case first (holdParts), so a real charge never exceeds what is left.
export function splitCharge(grants: readonly Grant[], usd: number, now: Date, opts: UseOptions): { id: string; add: number }[] {
  if (!(usd > 0)) return [];
  let rest = usd;
  const out: { id: string; add: number }[] = [];
  for (const g of usable(grants, now, opts)) {
    if (rest <= 0) break;
    const add = Math.min(leftOf(g), rest);
    out.push({ id: g.id, add });
    rest -= add;
  }
  return out;
}

// A hold for one call's worst-case cost (costGuard.ts), split over the grants
// in use order. null when less than that is left: the call must not run, so a
// member's real cost can never pass what they have.
export function holdParts(grants: readonly Grant[], usd: number, now: Date, opts: UseOptions): { id: string; add: number }[] | null {
  if (!(usd > 0) || !Number.isFinite(usd)) return null;
  if (availableUsd(grants, now, opts) + 1e-9 < usd) return null;
  return splitCharge(grants, usd, now, opts);
}

// What to give back from a hold when the call cost less: taken from the last
// grant first, never more than was held on each.
export function releaseParts(parts: readonly { id: string; add: number }[], giveBack: number): { id: string; sub: number }[] {
  let rest = Math.max(0, giveBack);
  const out: { id: string; sub: number }[] = [];
  for (const p of [...parts].reverse()) {
    if (rest <= 0) break;
    const take = Math.min(p.add, rest);
    if (take > 0) out.push({ id: p.id, sub: take });
    rest -= take;
  }
  return out;
}

export type AllowanceCheck = 'ok' | 'empty' | 'pace';

// pendingUsd: the worst case of the call about to run. It must fit in what is
// left, and in today's pace, before the call is allowed.
export function checkAllowance(available: number, usedTodayUsd: number, pendingUsd = 0): AllowanceCheck {
  if (!(available > 0) || available + 1e-9 < pendingUsd) return 'empty';
  if (usedTodayUsd >= PACE_USD || usedTodayUsd + pendingUsd > PACE_USD + 1e-9) return 'pace';
  return 'ok';
}

export function refillsHeld(grants: readonly Grant[], now: Date): number {
  return grants.filter((g) => g.kind === 'refill' && notExpired(g, now) && leftOf(g) > 0).length;
}

export function canBuyRefill(grants: readonly Grant[], now: Date, hasPaidPlan: boolean): boolean {
  return hasPaidPlan && refillsHeld(grants, now) < MAX_REFILLS_HELD;
}

export function refillExpiry(paidAt: Date): Date {
  const d = new Date(paidAt);
  d.setUTCMonth(d.getUTCMonth() + REFILL_VALID_MONTHS);
  return d;
}

// What the screens get: a share for a bar with no numbers, never dollars.
export interface AllowanceView {
  usedShare: number;
  nearLimit: boolean;
  empty: boolean;
  resetsAt: string | null;
  refills: { held: number; canBuy: boolean; expiresAt: string[] };
  gift: { left: boolean };
}

export function allowanceView(grants: readonly Grant[], now: Date, opts: UseOptions & { hasPaidPlan: boolean; resetsAt: Date | null }): AllowanceView {
  // The bar covers this month's grant (even when used up) plus whatever extra
  // is still there; used-up extras drop out.
  const current = grants.filter((g) => notExpired(g, now) && (g.kind === 'month' || leftOf(g) > 0) && (g.kind !== 'refill' || opts.refillsUsable));
  const total = current.reduce((s, g) => s + g.usd, 0);
  const used = current.reduce((s, g) => s + Math.min(g.usd, g.usedUsd), 0);
  const usedShare = total > 0 ? Math.min(1, used / total) : 1;
  const empty = !(availableUsd(grants, now, opts) > 0);
  const refills = grants.filter((g) => g.kind === 'refill' && notExpired(g, now) && leftOf(g) > 0);
  return {
    usedShare: Math.round(usedShare * 100) / 100,
    nearLimit: !empty && usedShare >= NEAR_LIMIT_SHARE,
    empty,
    resetsAt: opts.resetsAt ? opts.resetsAt.toISOString() : null,
    refills: { held: refills.length, canBuy: canBuyRefill(grants, now, opts.hasPaidPlan), expiresAt: refills.map((g) => g.expiresAt!.toISOString()).sort() },
    gift: { left: grants.some((g) => (g.kind === 'gift' || g.kind === 'trial') && leftOf(g) > 0) },
  };
}

// Margin check used in tests: what we keep after Stripe (about 3.4% + $0.39 a
// charge), and the share left after a member uses everything.
export const netAfterStripe = (usd: number): number => Math.max(0, usd * 0.966 - 0.39);
export const marginAtFullUse = (keptPerMonth: number, aiUsd: number): number => 1 - aiUsd / keptPerMonth;
