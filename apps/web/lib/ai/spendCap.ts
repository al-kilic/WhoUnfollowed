// Two brakes on model spend per UTC day, both counted from what calls actually
// cost us (the ai_usage_log table), so a restart or deploy doesn't reset them:
//
// - Global: AI_DAILY_SPEND_CAP_USD (default 25). "0" STOPS ALL AI (a kill
//   switch); it can never be turned off. A call whose worst case would take
//   the day's total past it does not run; once reached, every AI action
//   pauses until midnight UTC and one alert goes out.
// - Per user: AI_USER_DAILY_SPEND_CAP_USD (default 1, "0" turns it off). A
//   member whose calls cost that much today waits until midnight UTC; nobody
//   else is affected.
//
// Pure logic with the database behind `SpendSource`, so it can be tested.

export const DEFAULT_DAILY_CAP_USD = 25;
export const DEFAULT_USER_DAILY_CAP_USD = 1;

export type SpendCheck = 'ok' | 'paused' | 'fair_use';

export interface SpendSource {
  // Total cost of all calls since `since`.
  total(since: Date): Promise<number>;
  // Cost of one member's calls since `since`.
  forUser(userId: string, since: Date): Promise<number>;
}

export interface SpendCap {
  // pendingUsd: the worst case of the call about to run (costGuard.ts).
  check(userId: string, now?: Date, pendingUsd?: number): Promise<SpendCheck>;
  // Call after each model call, once the cost is stored, so the cached total stays current.
  record(usd: number | null | undefined, now?: Date): void;
}

export function startOfUtcDay(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export function createSpendCap(opts: {
  cap: number | null;
  userCap: number | null;
  source: SpendSource;
  onReached: (spent: number, cap: number) => void;
  // How long the global total is trusted before it is read again.
  ttlMs?: number;
}): SpendCap {
  const ttl = opts.ttlMs ?? 30_000;
  let day = '';
  let spent = 0;
  let readAt = -Infinity;
  let alerted = false;

  const roll = (now: Date) => {
    const d = now.toISOString().slice(0, 10);
    if (d !== day) { day = d; spent = 0; readAt = -Infinity; alerted = false; }
  };
  const reached = () => {
    if (opts.cap !== null && spent >= opts.cap && !alerted) { alerted = true; opts.onReached(spent, opts.cap); }
  };

  return {
    async check(userId, now = new Date(), pendingUsd = 0) {
      roll(now);
      const since = startOfUtcDay(now);
      if (opts.cap !== null) {
        if (now.getTime() - readAt >= ttl) {
          // A failed read keeps the last known total rather than blocking everyone.
          try { spent = await opts.source.total(since); readAt = now.getTime(); } catch { /* keep last */ }
        }
        reached();
        if (spent >= opts.cap || spent + pendingUsd > opts.cap) return 'paused';
      }
      if (opts.userCap !== null) {
        const mine = await opts.source.forUser(userId, since).catch(() => 0);
        if (mine >= opts.userCap) return 'fair_use';
      }
      return 'ok';
    },
    record(usd, now = new Date()) {
      if (typeof usd !== 'number' || !Number.isFinite(usd) || usd <= 0) return;
      roll(now);
      spent += usd;
      reached();
    },
  };
}

// Unset or unreadable falls back to the default. "0" means zero: nothing may
// be spent. There is no way to turn a cap off (founder, 2026-11-27).
export function capFromEnv(value: string | undefined, fallback: number): number {
  if (value === undefined || value.trim() === '') return fallback;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return fallback;
  return n;
}

// When a paused or capped member can try again: the next midnight UTC.
export function resetsAt(now: Date = new Date()): Date {
  return new Date(startOfUtcDay(now).getTime() + 86_400_000);
}
