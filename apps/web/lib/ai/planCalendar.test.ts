import { describe, expect, it } from 'vitest';
import type { AiPlan } from '@ig-tracker/core';
import { calendarFromPlan, dropPost, mergeCalendar, movePost, revisionCost } from './planCalendar';

const post = (day: string, idea: string) => ({ day, format: 'reel' as const, idea, hook: 'h' });
const plan = (weeks: AiPlan['weeks']): AiPlan => ({ summary: 's', principles: ['p'], weeks, memoryNotes: [] });

describe('calendarFromPlan', () => {
  it('places each post on its weekday within its week', () => {
    const items = calendarFromPlan(plan([
      { week: 1, theme: 't', posts: [post('tue', 'a'), post('sun', 'b')] },
      { week: 2, theme: 't', posts: [post('mon', 'c')] },
    ]));
    expect(items.map((i) => [i.day, i.idea])).toEqual([[1, 'a'], [6, 'b'], [7, 'c']]);
    expect(items.every((i) => !i.posted)).toBe(true);
  });

  it('moves a clash or an unreadable day to the next free day of that week', () => {
    const items = calendarFromPlan(plan([{ week: 1, theme: 't', posts: [post('tue', 'a'), post('tue', 'b'), post('someday', 'c')] }]));
    expect(items.map((i) => [i.day, i.idea])).toEqual([[0, 'c'], [1, 'a'], [2, 'b']]);
  });
});

describe('movePost', () => {
  const items = [{ day: 3, format: 'reel' as const, idea: 'a', hook: '', posted: false }, { day: 4, format: 'photo' as const, idea: 'b', hook: '', posted: false }];
  it('skips over days that already have a post', () => {
    expect(movePost(items, 3, 1).map((i) => i.day)).toEqual([4, 5]);
  });
  it('stays put at the edges of the plan', () => {
    expect(movePost([{ ...items[0]!, day: 0 }], 0, -1)[0]!.day).toBe(0);
    expect(movePost([{ ...items[0]!, day: 29 }], 29, 1)[0]!.day).toBe(29);
  });
});

describe('plan feedback rounds', () => {
  it('every round is included (usage allowance, no credit price)', () => {
    expect(revisionCost(0)).toBe(0);
    expect(revisionCost(4)).toBe(0);
  });
  it('keep posted posts on their day', () => {
    const before = [{ day: 2, format: 'reel', idea: 'old', hook: '', posted: true }, { day: 4, format: 'photo', idea: 'old2', hook: '', posted: false }] as const;
    const next = [{ day: 2, format: 'carousel', idea: 'new', hook: '', posted: false }, { day: 5, format: 'photo', idea: 'new2', hook: '', posted: false }] as const;
    expect(mergeCalendar([...next], [...before]).map((i) => `${i.day}:${i.idea}`)).toEqual(['2:old', '5:new2']);
  });
});

describe('dropPost', () => {
  const it2 = (day: number, idea: string, posted = false) => ({ day, format: 'reel' as const, idea, hook: '', posted });
  const items = [it2(1, 'a'), it2(3, 'b'), it2(5, 'c', true)];

  it('moves a post to an empty day', () => {
    const r = dropPost(items, 1, 2);
    expect(r?.kind).toBe('moved');
    expect(r?.items.map((i) => [i.day, i.idea])).toEqual([[2, 'a'], [3, 'b'], [5, 'c']]);
  });

  it('swaps with a post that is not posted yet', () => {
    const r = dropPost(items, 1, 3);
    expect(r?.kind).toBe('swapped');
    expect(r?.items.map((i) => [i.day, i.idea])).toEqual([[1, 'b'], [3, 'a'], [5, 'c']]);
  });

  it('never moves a posted post or lands on one', () => {
    expect(dropPost(items, 5, 6)).toBeNull();
    expect(dropPost(items, 1, 5)).toBeNull();
  });

  it('refuses no-ops and days outside the plan', () => {
    expect(dropPost(items, 1, 1)).toBeNull();
    expect(dropPost(items, 1, 30)).toBeNull();
    expect(dropPost(items, 1, -1)).toBeNull();
    expect(dropPost(items, 9, 2)).toBeNull();
  });

  it('keeps every post exactly once', () => {
    const r = dropPost(items, 3, 1)!;
    expect(new Set(r.items.map((i) => i.day)).size).toBe(items.length);
    expect(r.items.map((i) => i.idea).sort()).toEqual(['a', 'b', 'c']);
  });
});
