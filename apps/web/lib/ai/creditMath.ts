// Pure credit arithmetic, kept apart from the database so it can be tested
// without one. lib/ai/credits.ts applies it to the ledger rows.
//
// The ledger is append-only. Positive rows (grant, topup, refund) are buckets
// of credits that may expire; negative rows (spend) draw from the buckets that
// were still valid when the spend happened, soonest-expiring first. So the
// monthly allowance is used before a top-up, and an expired allowance never
// eats into a top-up.

export interface CreditRow {
  delta: number;
  expiresAt: Date | null;
  createdAt: Date;
}

interface Bucket { left: number; expiresAt: Date | null }

const expiry = (d: Date | null) => (d ? d.getTime() : Number.POSITIVE_INFINITY);

function replay(rows: readonly CreditRow[]): Bucket[] {
  const ordered = [...rows].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime() || b.delta - a.delta);
  const buckets: Bucket[] = [];
  for (const row of ordered) {
    if (row.delta > 0) {
      buckets.push({ left: row.delta, expiresAt: row.expiresAt });
      continue;
    }
    let need = -row.delta;
    const at = row.createdAt.getTime();
    const usable = buckets
      .filter((b) => b.left > 0 && expiry(b.expiresAt) > at)
      .sort((a, b) => expiry(a.expiresAt) - expiry(b.expiresAt));
    for (const b of usable) {
      if (need <= 0) break;
      const take = Math.min(b.left, need);
      b.left -= take;
      need -= take;
    }
  }
  return buckets;
}

// Credits the user can spend right now.
export function creditBalance(rows: readonly CreditRow[], now: Date = new Date()): number {
  return replay(rows)
    .filter((b) => expiry(b.expiresAt) > now.getTime())
    .reduce((sum, b) => sum + b.left, 0);
}

// When the soonest-expiring credits with something left run out, for the
// "resets on" line next to the balance. Null if nothing expires.
export function nextExpiry(rows: readonly CreditRow[], now: Date = new Date()): Date | null {
  const live = replay(rows).filter((b) => b.left > 0 && b.expiresAt && b.expiresAt.getTime() > now.getTime());
  if (live.length === 0) return null;
  return live.reduce((min, b) => (b.expiresAt!.getTime() < min.getTime() ? b.expiresAt! : min), live[0]!.expiresAt!);
}

// Period key for a calendar-month grant, e.g. 'lifetime:2026-11'.
// Subscriptions are keyed by their Stripe invoice id instead.
export function calendarPeriodKey(prefix: string, now: Date = new Date()): string {
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  return `${prefix}:${now.getUTCFullYear()}-${m}`;
}

// First moment of the next calendar month (UTC): when a calendar grant expires.
export function startOfNextMonthUtc(now: Date = new Date()): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
}
