import { describe, expect, it } from 'vitest';
import type { Account, ParsedSnapshot } from '../schemas.js';
import { runHealthChecks } from './healthChecks.js';
import { growthTimeline } from './growthTimeline.js';
import { ARCHETYPE_IDS, eligibleArchetypes, pickVerdict, verdictStats } from './verdict.js';
import { buildPlan, daysAtEachPace, planProgress } from './unfollowPlanner.js';

const NOW = Date.UTC(2026, 10, 1) / 1000; // 2026-11-01
const DAY = 86400;
const acc = (username: string, daysAgo: number | null = 10): Account => ({
  username, href: `https://www.instagram.com/${username}`, followedAt: daysAgo === null ? null : NOW - daysAgo * DAY,
});
const names = (prefix: string, n: number, daysAgo: number | null = 10) => Array.from({ length: n }, (_, i) => acc(`${prefix}${i}`, daysAgo));
const snap = (followers: Account[], following: Account[], extra: Partial<ParsedSnapshot> = {}): ParsedSnapshot => ({
  exportedAt: NOW, followers, following, format: 'json', platform: 'instagram', ...extra,
});
const ids = (s: ParsedSnapshot, prev?: ParsedSnapshot) => runHealthChecks({ current: s, previous: prev, now: NOW }).map(f => f.id);

describe('runHealthChecks', () => {
  it('asks for a second export when there is no previous one', () => {
    expect(ids(snap([acc('a')], [acc('a')]))).toEqual(['second_export']);
  });

  it('finds old pending requests', () => {
    const f = runHealthChecks({ current: snap([], [], { pendingRequests: [acc('p1', 200), acc('p2', 400), acc('p3', 20)] }), now: NOW });
    const pending = f.find(x => x.id === 'stale_pending')!;
    expect(pending.params).toEqual({ count: 2, months: 13 });
    expect(pending.accounts.map(a => a.username)).toEqual(['p1', 'p2']);
  });

  it('finds the follow year with the worst follow-back rate', () => {
    const y2019 = names('old', 20, 2500); // followed ~2019, none follow back
    const recent = names('new', 20, 30);
    const f = runHealthChecks({ current: snap(recent, [...y2019, ...recent]), now: NOW }).find(x => x.id === 'follow_back_gap_year')!;
    expect(f.params).toMatchObject({ total: 20, count: 20, pct: 100 });
    // old_one_way points at the same 20 accounts, so it is dropped as a duplicate.
    expect(ids(snap(recent, [...y2019, ...recent]))).not.toContain('old_one_way');
  });

  it('keeps old_one_way when it covers different accounts', () => {
    const spread = [...names('a', 8, 800), ...names('b', 8, 1200), ...names('c', 8, 1700)];
    expect(ids(snap([], spread))).toContain('old_one_way');
  });

  it('flags a sudden drop and lost mutuals against the previous export', () => {
    const shared = names('m', 100);
    const prev = snap(shared, shared, { exportedAt: NOW - 14 * DAY });
    const cur = snap(shared.slice(10), shared);
    const found = runHealthChecks({ current: cur, previous: prev, now: NOW });
    expect(found.map(f => f.id)).toEqual(expect.arrayContaining(['sudden_drop', 'mutuals_lost']));
    expect(found.find(f => f.id === 'sudden_drop')!.params).toEqual({ count: 10, pct: 10, days: 14 });
    expect(found).not.toContainEqual(expect.objectContaining({ id: 'second_export' }));
  });

  it('ignores a previous export from another platform', () => {
    const prev = snap(names('m', 100), [], { platform: 'threads' });
    expect(ids(snap([], []), prev)).toContain('second_export');
  });

  it('finds a follow burst day', () => {
    const burst = names('b', 35, 100);
    const f = runHealthChecks({ current: snap(burst.slice(0, 5), burst), now: NOW }).find(x => x.id === 'follow_burst')!;
    expect(f.params).toMatchObject({ count: 35, followedBack: 5 });
    expect(f.accounts).toHaveLength(30);
  });

  it('flags the following cap and ratio imbalance', () => {
    const following = names('f', 7000, null);
    const found = ids(snap(names('x', 100, null), following));
    expect(found).toContain('following_limit');
    expect(found).toContain('ratio_imbalance');
  });

  it('flags recent fans you did not follow back', () => {
    expect(ids(snap(names('fan', 5, 3), []))).toContain('fans_unanswered');
  });

  it('ranks findings by impact', () => {
    const found = runHealthChecks({ current: snap(names('x', 100, null), names('f', 7000, null)), now: NOW });
    const impacts = found.map(f => f.impact);
    expect([...impacts].sort((a, b) => b - a)).toEqual(impacts);
  });
});

describe('growthTimeline', () => {
  it('buckets followers by month with no gaps and finds the best month', () => {
    const t = growthTimeline(snap([acc('a', 100), acc('b', 100), acc('c', 40), acc('d', null)], []));
    expect(t.months.map(m => m.month)).toEqual(['2026-07', '2026-08', '2026-09', '2026-10', '2026-11']);
    expect(t.best).toMatchObject({ month: '2026-07', followers: 2 });
    expect(t.dated).toBe(3);
    expect(t.undated).toBe(1);
    expect(t.lastYearShare).toBe(1);
  });

  it('returns an empty timeline for undated exports', () => {
    expect(growthTimeline(snap([acc('a', null)], [])).months).toEqual([]);
  });
});

describe('verdict', () => {
  it('always has an archetype and is stable for the same export', () => {
    const s = verdictStats(snap(names('a', 50), names('a', 50)));
    expect(eligibleArchetypes(s)).toContain('loyal_magnet');
    expect(pickVerdict(s, NOW)).toEqual(pickVerdict(s, NOW));
  });

  it('falls back to steady when nothing matches', () => {
    expect(eligibleArchetypes(verdictStats(snap([], [])))).toEqual(['steady']);
  });

  it('a spin can change the pick, and every pick is a known archetype', () => {
    const s = verdictStats(snap(names('a', 600), names('b', 40)));
    const picks = new Set(Array.from({ length: 20 }, (_, i) => pickVerdict(s, NOW, i).archetype));
    expect(picks.size).toBeGreaterThan(1);
    for (const p of picks) expect(ARCHETYPE_IDS).toContain(p);
  });

  it('uses the previous export for lost and gained', () => {
    const prev = snap(names('a', 20), []);
    const s = verdictStats(snap(names('a', 20).slice(0, 5), []), prev);
    expect(s.lost).toBe(15);
    expect(eligibleArchetypes(s)).toContain('drama_magnet');
  });
});

describe('unfollow planner', () => {
  const list = [acc('new', 5), acc('old', 900), acc('mid', 300), acc('star', 1000), acc('nodate', null), acc('old', 900)];

  it('orders oldest first, skips starred and duplicates, and batches by pace', () => {
    const plan = buildPlan({ accounts: list, pace: 'gentle', starred: new Set(['star']) });
    expect(plan.batches).toEqual([['old', 'mid', 'new', 'nodate']]);
    expect(plan.skippedStarred).toBe(1);
    expect(plan.total).toBe(4);
  });

  it('splits big lists into daily batches', () => {
    const plan = buildPlan({ accounts: names('u', 1040), pace: 'steady' });
    expect(plan.batches).toHaveLength(26);
    expect(plan.batches[0]).toHaveLength(40);
    expect(daysAtEachPace(1040)).toEqual({ gentle: 52, steady: 26, quick: 13 });
  });

  it('tracks progress', () => {
    const plan = buildPlan({ accounts: names('u', 50), pace: 'gentle' });
    const done = new Set(plan.batches[0]!.concat(plan.batches[1]!.slice(0, 5)));
    expect(planProgress(plan, done)).toEqual({ done: 25, left: 25, daysLeft: 2, currentBatch: 1, currentBatchLeft: 15, pct: 50 });
    expect(planProgress(plan, new Set(plan.batches.flat())).currentBatch).toBe(-1);
  });
});
