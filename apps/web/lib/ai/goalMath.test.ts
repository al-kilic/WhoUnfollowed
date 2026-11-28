import { describe, expect, it } from 'vitest';
import { goalProgress, habitProgress, nextCheckinAt, type Goal } from './goalMath';

const d = (s: string) => new Date(`${s}T00:00:00Z`);
const goal: Goal = { target: 3000, by: d('2027-05-01'), startFollowers: 2000, setAt: d('2026-11-01') };

describe('goalProgress', () => {
  it('has no data until an export arrives after the goal was set', () => {
    const p = goalProgress(goal, [{ at: d('2026-10-20'), followers: 1990 }], d('2026-11-05'));
    expect(p.status).toBe('no_data');
    expect(p.current).toBe(1990);
  });

  it('measures progress and the weekly pace needed for the deadline', () => {
    const p = goalProgress(goal, [{ at: d('2026-11-29'), followers: 2100 }], d('2026-11-29'));
    expect(p.gained).toBe(100);
    expect(p.left).toBe(900);
    expect(p.pct).toBe(10);
    expect(p.perWeekSoFar).toBe(25);
    // 21.9 weeks left -> 42 a week needed: behind.
    expect(p.perWeekNeeded).toBe(42);
    expect(p.status).toBe('behind');
  });

  it('is ahead when the pace beats what is needed, and done at the target', () => {
    expect(goalProgress(goal, [{ at: d('2026-11-29'), followers: 2400 }], d('2026-11-29')).status).toBe('ahead');
    const done = goalProgress(goal, [{ at: d('2027-01-10'), followers: 3050 }], d('2027-01-10'));
    expect(done.status).toBe('done');
    expect(done.pct).toBe(100);
    expect(done.left).toBe(0);
  });

  it('reports no deadline without a date', () => {
    expect(goalProgress({ ...goal, by: null }, [{ at: d('2026-12-01'), followers: 2050 }], d('2026-12-01')).status).toBe('no_deadline');
  });
});

describe('nextCheckinAt', () => {
  it('is weekly or every two weeks from the last check-in, and null when off', () => {
    expect(nextCheckinAt('off', null, d('2026-11-01'))).toBeNull();
    expect(nextCheckinAt('weekly', null, d('2026-11-01'))).toEqual(d('2026-11-08'));
    expect(nextCheckinAt('biweekly', d('2026-11-10'), d('2026-11-01'))).toEqual(d('2026-11-24'));
  });
});

describe('check-in schedule options', () => {
  it('supports monthly and a chosen weekday', () => {
    expect(nextCheckinAt('monthly', null, d('2026-11-15'))).toEqual(d('2026-12-15'));
    // 2026-11-08 is a Sunday; Monday (1) moves it to the 9th.
    expect(nextCheckinAt('weekly', null, d('2026-11-01'), 1)).toEqual(d('2026-11-09'));
    expect(nextCheckinAt('weekly', null, d('2026-11-01'), 0)).toEqual(d('2026-11-08'));
  });
});

describe('habitProgress', () => {
  const now = d('2026-11-20');
  const posts = [{ at: d('2026-11-19'), newFollowers: 30 }, { at: d('2026-11-16'), newFollowers: 10 }, { at: d('2026-11-01'), newFollowers: null }];
  it('counts posts in the last 7 days', () => {
    expect(habitProgress('posts_week', 3, posts, now)).toEqual({ current: 2, pct: 67, status: 'behind' });
    expect(habitProgress('posts_week', 2, posts, now).status).toBe('done');
  });
  it('averages new followers over the latest results', () => {
    expect(habitProgress('per_post', 25, posts, now)).toEqual({ current: 20, pct: 80, status: 'on_track' });
    expect(habitProgress('per_post', 25, [], now).status).toBe('no_data');
  });
});
