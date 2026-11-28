import { describe, expect, it } from 'vitest';
import { exportStats, type ExportStats } from '@ig-tracker/core';
import { detectBlindSpots, rankBlindSpots, type BlindSpotInput } from './blindSpots';
import { answerCard, emptyState, pickCard, SNOOZE } from './blindSpotState';
import { getSampleSnapshots } from '@/lib/sample/sampleSnapshot';
import { SAMPLE_PREFS, sampleResponses } from '@/lib/sample/coach';

const DAY = 86_400_000;
const NOW = new Date('2026-11-23T12:00:00Z');

function stats(over: Partial<ExportStats> = {}, facts: { id: string; params: Record<string, number | string> }[] = []): ExportStats {
  return {
    platform: 'instagram', exportedAt: Math.floor(NOW.getTime() / 1000) - 3 * 86400, followers: 1000, following: 900, mutuals: 700,
    nonFollowers: 200, fans: 300, newFollowersByMonth: {}, followBackRate12m: null, followBackRatePrev12m: null, pendingRequests: null,
    facts, ...over,
  } as ExportStats;
}
const ids = (i: BlindSpotInput) => detectBlindSpots({ now: NOW, ...i }).map((b) => b.detector);

describe('detectors', () => {
  it('stale_pending fires, stronger with two exports, quiet when falling', () => {
    const f = (count: number) => ({ id: 'fix.stale_pending', params: { count, months: 7 } });
    const one = detectBlindSpots({ stats: [stats({}, [f(20)])], now: NOW })[0]!;
    expect(one.detector).toBe('stale_pending');
    expect(one.confidence).toBeLessThan(0.9);
    expect(detectBlindSpots({ stats: [stats({}, [f(20)]), stats({}, [f(18)])], now: NOW })[0]!.confidence).toBeGreaterThan(0.9);
    expect(ids({ stats: [stats({}, [f(10)]), stats({}, [f(30)])] })).not.toContain('stale_pending');
    expect(ids({ stats: [stats()] })).not.toContain('stale_pending');
  });

  it('posting_below_plan needs a plan or a posting habit', () => {
    const posted = [{ postedAt: new Date(NOW.getTime() - 5 * DAY).toISOString(), results: null }];
    expect(ids({ stats: [stats()], postingDays: [1, 3, 5], posted })).toContain('posting_below_plan');
    expect(ids({ stats: [stats()], postingDays: [1, 3, 5] })).not.toContain('posting_below_plan');
    const many = Array.from({ length: 10 }, (_, i) => ({ postedAt: new Date(NOW.getTime() - i * 2 * DAY).toISOString(), results: null }));
    expect(ids({ stats: [stats()], postingDays: [1, 3, 5], posted: many })).not.toContain('posting_below_plan');
  });

  it('goal_pace_drift fires only when well behind', () => {
    const progress = (soFar: number) => ({ current: 1300, gained: 50, left: 700, pct: 7, perWeekNeeded: 40, perWeekSoFar: soFar, status: 'behind' as const });
    expect(ids({ stats: [stats()], goal: { target: 2000, progress: progress(10) } })).toContain('goal_pace_drift');
    expect(ids({ stats: [stats()], goal: { target: 2000, progress: progress(35) } })).not.toContain('goal_pace_drift');
  });

  it('follow_back_drop compares the two years', () => {
    expect(ids({ stats: [stats({ followBackRate12m: 0.3, followBackRatePrev12m: 0.5 })] })).toContain('follow_back_drop');
    expect(ids({ stats: [stats({ followBackRate12m: 0.45, followBackRatePrev12m: 0.5 })] })).not.toContain('follow_back_drop');
  });

  it('spree_didnt_work needs a real spree with few follow-backs', () => {
    const burst = (count: number, back: number) => [{ id: 'fix.follow_burst', params: { date: '2022-03-03', count, followedBack: back } }];
    expect(ids({ stats: [stats({}, burst(41, 3))] })).toContain('spree_didnt_work');
    expect(ids({ stats: [stats({}, burst(41, 20))] })).not.toContain('spree_didnt_work');
    expect(ids({ stats: [stats({}, burst(6, 0))] })).not.toContain('spree_didnt_work');
  });

  it('quiet_season finds the same low month two years running', () => {
    const months: Record<string, number> = {};
    for (let k = 1; k <= 24; k++) {
      const d = new Date(Date.UTC(2026, 10 - k, 1));
      months[`${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`] = d.getUTCMonth() === 11 ? 1 : 20; // December quiet
    }
    const s = detectBlindSpots({ stats: [stats({ newFollowersByMonth: months })], now: NOW }).find((b) => b.detector === 'quiet_season');
    expect(s?.params.month).toBe(12);
    expect(s?.impact).toBe(60); // December is next month
  });

  it('best_month_unexplained is quiet once the month was talked about', () => {
    const st = [stats({}, [{ id: 'fact.best_month', params: { month: '2026-10', count: 72 } }])];
    expect(ids({ stats: st })).toContain('best_month_unexplained');
    expect(ids({ stats: st, notesText: 'In 2026-10 I posted the Alfama series' })).not.toContain('best_month_unexplained');
    expect(ids({ stats: [stats({}, [{ id: 'fact.best_month', params: { month: '2023-11', count: 3 } }])] })).not.toContain('best_month_unexplained');
  });

  it('results_never_logged needs 4 posted and no results', () => {
    const p = (r: Record<string, number> | null) => Array.from({ length: 4 }, () => ({ postedAt: NOW.toISOString(), results: r }));
    expect(ids({ stats: [stats()], posted: p(null) })).toContain('results_never_logged');
    expect(ids({ stats: [stats()], posted: p({ newFollowers: 3 }) })).not.toContain('results_never_logged');
  });

  it('stale_numbers only after 45 days, and only when nothing else ranks', () => {
    const old = stats({ exportedAt: Math.floor((NOW.getTime() - 60 * DAY) / 1000), followBackRate12m: 0.2, followBackRatePrev12m: 0.5 });
    const spots = detectBlindSpots({ stats: [old], now: NOW });
    expect(spots.map((s) => s.detector)).toContain('stale_numbers');
    expect(rankBlindSpots(spots, {}, NOW.getTime())[0]!.detector).toBe('follow_back_drop');
    const alone = detectBlindSpots({ stats: [stats({ exportedAt: old.exportedAt })], now: NOW });
    expect(rankBlindSpots(alone, {}, NOW.getTime())[0]!.detector).toBe('stale_numbers');
  });

  it('params never carry text, only numbers and dates', () => {
    const bad = [{ id: 'fix.follow_burst', params: { date: '@someone', count: 40, followedBack: 1 } }];
    for (const s of detectBlindSpots({ stats: [stats({}, bad)], now: NOW })) {
      for (const v of Object.values(s.params)) expect(typeof v === 'number' || /^\d{4}-\d{2}(-\d{2})?$/.test(v)).toBe(true);
    }
  });
});

describe('ranking and cadence', () => {
  const spots = detectBlindSpots({ stats: [stats({ followBackRate12m: 0.2, followBackRatePrev12m: 0.5 }, [{ id: 'fix.stale_pending', params: { count: 30, months: 8 } }])], now: NOW });
  const t0 = NOW.getTime();

  it('ranks by impact × confidence and halves after each showing', () => {
    expect(rankBlindSpots(spots, {}, t0)[0]!.detector).toBe('stale_pending');
    expect(rankBlindSpots(spots, { stale_pending: { shown: 2 } }, t0)[0]!.detector).toBe('follow_back_drop');
  });

  it('keeps one card, waits 3 days for a new one, at most 2 a week and 2 per export', () => {
    const a = pickCard(spots, emptyState(), 'e1', t0);
    expect(a.spot?.key).toBe('stale_pending');
    expect(pickCard(spots, a.state, 'e1', t0 + DAY).spot?.key).toBe('stale_pending'); // same card until answered
    const after = answerCard(a.state, 'stale_pending', 'later', t0 + DAY);
    expect(pickCard(spots, after, 'e1', t0 + 2 * DAY).spot).toBeNull(); // under 3 days
    const b = pickCard(spots, after, 'e1', t0 + 3 * DAY);
    expect(b.spot?.key).toBe('follow_back_drop');
    const c = answerCard(b.state, 'follow_back_drop', 'know', t0 + 3 * DAY);
    expect(pickCard(spots, c, 'e1', t0 + 6 * DAY).spot).toBeNull(); // 2 this week already
    expect(pickCard(spots, c, 'e1', t0 + 20 * DAY).spot).toBeNull(); // 2 for this export already
    const d = pickCard(spots, c, 'e2', t0 + 20 * DAY);
    expect(d.spot?.key).toBe('stale_pending'); // snooze over, new export
    expect(t0 + DAY + SNOOZE).toBeLessThan(t0 + 20 * DAY);
  });

  it('"I know" hides a card for good', () => {
    const s = answerCard(emptyState(), 'stale_pending', 'know', t0);
    expect(rankBlindSpots(spots, s.history, t0 + 400 * DAY).map((x) => x.key)).not.toContain('stale_pending');
  });
});

describe('sample account', () => {
  it('Inês gets exactly one card, with zero calls', () => {
    const snaps = getSampleSnapshots();
    const newest = snaps[snaps.length - 1]!, prev = snaps[snaps.length - 2]!;
    const r = sampleResponses('en', NOW);
    const stats = [exportStats(newest, prev), exportStats(prev)];
    const spots = detectBlindSpots({
      stats, now: NOW, postingDays: [...SAMPLE_PREFS.days], hasPlan: true,
      posted: r.posted.items, goal: { target: r.goal.goal.target, progress: r.goal.progress },
    });
    const first = pickCard(spots, emptyState(), String(newest.exportedAt), NOW.getTime());
    expect(first.spot).not.toBeNull();
    expect(pickCard(spots, first.state, String(newest.exportedAt), NOW.getTime()).spot?.key).toBe(first.spot!.key);
  });
});
