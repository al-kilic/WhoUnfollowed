import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('@/lib/db/index', () => ({ db: { execute: vi.fn(async () => { throw new Error('no db'); }) } }));

afterEach(() => vi.unstubAllEnvs());

describe('analysesOffset', () => {
  it('is 0 when unset or invalid', async () => {
    const { analysesOffset } = await import('./stats');
    vi.stubEnv('STATS_ANALYSES_OFFSET', '');
    expect(analysesOffset()).toBe(0);
    vi.stubEnv('STATS_ANALYSES_OFFSET', '-5');
    expect(analysesOffset()).toBe(0);
    vi.stubEnv('STATS_ANALYSES_OFFSET', 'abc');
    expect(analysesOffset()).toBe(0);
  });

  it('adds to the shown total but not to the average', async () => {
    const { seedStats } = await import('./stats');
    vi.stubEnv('STATS_ANALYSES_OFFSET', '');
    const base = seedStats();
    vi.stubEnv('STATS_ANALYSES_OFFSET', '6886');
    const shifted = seedStats();
    expect(shifted.snapshots).toBe(base.snapshots + 6886);
    expect(shifted.avgNonFollowers).toBe(base.avgNonFollowers);
  });
});
