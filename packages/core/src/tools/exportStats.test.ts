import { describe, expect, it } from 'vitest';
import { exportStats } from './exportStats.js';
import { exportStatsSchema } from '../aiSchemas.js';
import type { ParsedSnapshot } from '../schemas.js';

const T = Date.UTC(2026, 10, 1) / 1000; // 2026-11-01
const DAY = 86_400;
const acc = (username: string, daysAgo: number | null) =>
  ({ username, href: '', followedAt: daysAgo === null ? null : T - daysAgo * DAY });

function snap(): ParsedSnapshot {
  return {
    exportedAt: T,
    format: 'json',
    followers: [acc('a', 10), acc('b', 40), acc('c', 400), acc('d', null), acc('e', 20), acc('f', 30)],
    following: [acc('a', 15), acc('b', 50), acc('x', 60), acc('y', 70), acc('e', 80), acc('f', 90), acc('old1', 500), acc('old2', 510)],
  } as unknown as ParsedSnapshot;
}

describe('exportStats', () => {
  it('reduces an export to counts with no usernames', () => {
    const s = exportStats(snap());
    expect(s).toMatchObject({ followers: 6, following: 8, mutuals: 4, nonFollowers: 4, fans: 2, pendingRequests: null });
    expect(JSON.stringify(s)).not.toMatch(/"a"|old1/);
    expect(exportStatsSchema.safeParse(s).success).toBe(true);
  });

  it('counts new followers per month over the last two years', () => {
    const s = exportStats(snap());
    expect(Object.values(s.newFollowersByMonth).reduce((x, y) => x + y, 0)).toBe(5);
  });

  it('gives a follow-back rate only with at least 5 follows in the window', () => {
    const s = exportStats(snap());
    // Followed in the last year: a, b, x, y, e, f -> a, b, e, f follow back.
    expect(s.followBackRate12m).toBeCloseTo(4 / 6, 3);
    expect(s.followBackRatePrev12m).toBeNull();
  });
});
