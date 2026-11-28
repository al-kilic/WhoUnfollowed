import { describe, expect, it, vi } from 'vitest';
import { capFromEnv, createSpendCap, resetsAt, startOfUtcDay, type SpendSource } from './spendCap';

const at = (iso: string) => new Date(iso);

// An in-memory stand-in for ai_usage_log.
function fakeSource(rows: { userId: string; usd: number; at: Date }[] = []) {
  const source: SpendSource & { calls: number } = {
    calls: 0,
    async total(since) { source.calls++; return rows.filter((r) => r.at >= since).reduce((s, r) => s + r.usd, 0); },
    async forUser(userId, since) { return rows.filter((r) => r.userId === userId && r.at >= since).reduce((s, r) => s + r.usd, 0); },
  };
  return { source, add: (userId: string, usd: number, when: Date) => rows.push({ userId, usd, at: when }) };
}

describe('global daily cap', () => {
  it('never pauses without a cap', async () => {
    const { source, add } = fakeSource();
    add('a', 1000, at('2026-11-16T09:00:00Z'));
    const cap = createSpendCap({ cap: null, userCap: null, source, onReached: vi.fn() });
    expect(await cap.check('a', at('2026-11-16T10:00:00Z'))).toBe('ok');
  });

  it('counts spend already in the database, so a restart does not reset it', async () => {
    const { source, add } = fakeSource();
    add('a', 6, at('2026-11-16T08:00:00Z'));
    const onReached = vi.fn();
    const fresh = createSpendCap({ cap: 5, userCap: null, source, onReached });
    expect(await fresh.check('b', at('2026-11-16T10:00:00Z'))).toBe('paused');
    expect(onReached).toHaveBeenCalledTimes(1);
  });

  it('adds recorded calls between reads, alerts once, and resets at UTC midnight', async () => {
    const { source } = fakeSource();
    const onReached = vi.fn();
    const cap = createSpendCap({ cap: 5, userCap: null, source, onReached, ttlMs: 60_000 });
    expect(await cap.check('a', at('2026-11-16T10:00:00Z'))).toBe('ok');
    cap.record(3, at('2026-11-16T10:00:10Z'));
    cap.record(2.5, at('2026-11-16T10:00:20Z'));
    expect(await cap.check('a', at('2026-11-16T10:00:30Z'))).toBe('paused');
    cap.record(1, at('2026-11-16T10:00:40Z'));
    expect(onReached).toHaveBeenCalledTimes(1);
    expect(await cap.check('a', at('2026-11-17T00:00:01Z'))).toBe('ok');
  });

  it('reads the database at most once per cache window', async () => {
    const { source } = fakeSource();
    const cap = createSpendCap({ cap: 5, userCap: null, source, onReached: vi.fn(), ttlMs: 30_000 });
    await cap.check('a', at('2026-11-16T10:00:00Z'));
    await cap.check('a', at('2026-11-16T10:00:10Z'));
    expect(source.calls).toBe(1);
    await cap.check('a', at('2026-11-16T10:00:31Z'));
    expect(source.calls).toBe(2);
  });

  it('ignores unknown or negative costs', async () => {
    const { source } = fakeSource();
    const cap = createSpendCap({ cap: 1, userCap: null, source, onReached: vi.fn(), ttlMs: 60_000 });
    await cap.check('a', at('2026-11-16T10:00:00Z'));
    cap.record(null, at('2026-11-16T10:00:01Z'));
    cap.record(-4, at('2026-11-16T10:00:01Z'));
    expect(await cap.check('a', at('2026-11-16T10:00:02Z'))).toBe('ok');
  });
});

describe('per-user daily cap', () => {
  it('stops only the member who reached it, until midnight UTC', async () => {
    const { source, add } = fakeSource();
    add('heavy', 0.6, at('2026-11-16T09:00:00Z'));
    add('heavy', 0.45, at('2026-11-16T11:00:00Z'));
    add('light', 0.1, at('2026-11-16T11:00:00Z'));
    add('light', 5, at('2026-11-15T23:59:00Z'));
    const cap = createSpendCap({ cap: 25, userCap: 1, source, onReached: vi.fn() });
    expect(await cap.check('heavy', at('2026-11-16T12:00:00Z'))).toBe('fair_use');
    expect(await cap.check('light', at('2026-11-16T12:00:00Z'))).toBe('ok');
    expect(await cap.check('heavy', at('2026-11-17T00:00:01Z'))).toBe('ok');
  });

  it('the global pause wins over the per-user limit', async () => {
    const { source, add } = fakeSource();
    add('a', 30, at('2026-11-16T09:00:00Z'));
    const cap = createSpendCap({ cap: 25, userCap: 1, source, onReached: vi.fn() });
    expect(await cap.check('a', at('2026-11-16T10:00:00Z'))).toBe('paused');
  });

  it('lets the call through when the database read fails', async () => {
    const source: SpendSource = { total: () => Promise.reject(new Error('down')), forUser: () => Promise.reject(new Error('down')) };
    const cap = createSpendCap({ cap: 25, userCap: 1, source, onReached: vi.fn() });
    expect(await cap.check('a', at('2026-11-16T10:00:00Z'))).toBe('ok');
  });
});

describe('capFromEnv', () => {
  it('falls back to the default when unset, and "0" stops everything', () => {
    expect(capFromEnv('25', 10)).toBe(25);
    expect(capFromEnv(undefined, 25)).toBe(25);
    expect(capFromEnv('', 1)).toBe(1);
    expect(capFromEnv('abc', 25)).toBe(25);
    expect(capFromEnv('-1', 25)).toBe(25);
    expect(capFromEnv('0', 25)).toBe(0);
  });
});

describe('UTC day helpers', () => {
  it('finds the start of the day and the next reset', () => {
    expect(startOfUtcDay(at('2026-11-16T23:30:00Z')).toISOString()).toBe('2026-11-16T00:00:00.000Z');
    expect(resetsAt(at('2026-11-16T23:30:00Z')).toISOString()).toBe('2026-11-17T00:00:00.000Z');
  });
});
