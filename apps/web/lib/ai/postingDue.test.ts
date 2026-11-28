import { describe, expect, it } from 'vitest';
import type { AiPlanCalendarItem } from '@ig-tracker/core';
import { postingDue, utcDay } from './postingDue';

// Plan created Wed 2026-11-18, so it starts Mon 2026-11-23 (day 0).
const plan = (calendar: AiPlanCalendarItem[]) => ({ createdAt: new Date('2026-11-18T10:00:00Z'), calendar });
const thu = new Date('2026-11-26T06:00:00Z'); // day 3, a Thursday

describe('postingDue', () => {
  it('returns the planned post for today', () => {
    const due = postingDue({ now: thu, days: [], plan: plan([{ day: 3, format: 'carousel', idea: 'Blue hour', hook: '', posted: false }]) });
    expect(due).toEqual({ post: { format: 'carousel', idea: 'Blue hour' } });
  });
  it('skips a planned post already marked as posted', () => {
    expect(postingDue({ now: thu, days: [3], plan: plan([{ day: 3, format: 'reel', idea: 'x', hook: '', posted: true }]) })).toBeNull();
  });
  it('falls back to the posting days when the plan has nothing today', () => {
    expect(postingDue({ now: thu, days: [3], plan: plan([{ day: 1, format: 'reel', idea: 'x', hook: '', posted: false }]) })).toEqual({ post: null });
    expect(postingDue({ now: thu, days: [3], plan: null })).toEqual({ post: null });
  });
  it('looks at tomorrow for the day-before reminder', () => {
    const p = plan([{ day: 4, format: 'reel', idea: 'Friday reel', hook: '', posted: false }]);
    expect(postingDue({ now: thu, days: [], plan: p, ahead: 1 })).toEqual({ post: { format: 'reel', idea: 'Friday reel' } });
    expect(postingDue({ now: thu, days: [], plan: p })).toBeNull();
    // Friday is weekday 4: the posting-days fallback also moves a day ahead.
    expect(postingDue({ now: thu, days: [4], plan: null, ahead: 1 })).toEqual({ post: null });
  });
  it('is not due on other days', () => {
    expect(postingDue({ now: thu, days: [0, 2], plan: null })).toBeNull();
    expect(postingDue({ now: thu, days: [], plan: null })).toBeNull();
  });
  it('uses the UTC day', () => {
    expect(utcDay(new Date('2026-11-26T23:30:00Z'))).toBe('2026-11-26');
  });
});
