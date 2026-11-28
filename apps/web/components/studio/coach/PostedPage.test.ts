import { describe, expect, it } from 'vitest';
import { formatAverages, short } from './postedMath';

const item = (format: string | null, newFollowers?: number) => ({
  id: Math.random().toString(), format, hook: 'h', score: null, createdAt: '2026-11-01', postedAt: '2026-11-02',
  results: newFollowers === undefined ? null : { newFollowers },
});

describe('formatAverages', () => {
  it('averages new followers per format, best first', () => {
    const r = formatAverages([item('reel', 40), item('reel', 20), item('photo', 10), item('carousel', 50)]);
    expect(r.map((x) => [x.format, x.avg, x.n])).toEqual([['carousel', 50, 1], ['reel', 30, 2], ['photo', 10, 1]]);
  });
  it('skips posts without results or with an unknown format', () => {
    expect(formatAverages([item('reel'), item(null, 5), item('tiktok', 9)])).toEqual([]);
  });
});

describe('short', () => {
  it('keeps short text as is', () => expect(short('Night walks')).toBe('Night walks'));
  it('cuts at a word and adds an ellipsis', () => expect(short('Five frames from one street after midnight')).toBe('Five frames from one street after…'));
});

import { bestPost, resultsDue, streakWeeks, weekdayAverages, type PostedItem } from './postedMath';

const NOW = new Date('2026-11-26T12:00:00Z'); // a Thursday
const p = (postedAt: string | null, results: Record<string, number> | null = null): PostedItem => ({ id: `${postedAt}-${Math.random()}`, format: 'reel', hook: 'h', score: null, createdAt: postedAt ?? '2026-11-01', postedAt, results });

describe('resultsDue', () => {
  it('asks for posts 2 to 21 days old without results, oldest first', () => {
    const due = resultsDue([p('2026-11-25T10:00:00Z'), p('2026-11-20T10:00:00Z'), p('2026-11-10T10:00:00Z'), p('2026-10-01T10:00:00Z'), p('2026-11-21T10:00:00Z', { likes: 3 })], NOW);
    expect(due.map((x) => x.postedAt)).toEqual(['2026-11-10T10:00:00Z', '2026-11-20T10:00:00Z']);
  });
});

describe('weekdayAverages', () => {
  it('groups results by weekday, Monday first', () => {
    const w = weekdayAverages([p('2026-11-23T10:00:00Z', { newFollowers: 4 }), p('2026-11-16T10:00:00Z', { newFollowers: 2 }), p('2026-11-26T10:00:00Z', { likes: 30 })]);
    expect(w[0]).toEqual({ day: 0, n: 2, avg: 30 });
    expect(w[3]).toEqual({ day: 3, n: 1, avg: 30 });
    expect(w[6]!.n).toBe(0);
  });
});

describe('streakWeeks', () => {
  it('counts weeks in a row with a post, allowing this week to be empty', () => {
    expect(streakWeeks([p('2026-11-18T10:00:00Z'), p('2026-11-11T10:00:00Z'), p('2026-10-20T10:00:00Z')], NOW)).toBe(2);
    expect(streakWeeks([p('2026-11-25T10:00:00Z'), p('2026-11-18T10:00:00Z')], NOW)).toBe(2);
    expect(streakWeeks([], NOW)).toBe(0);
  });
});

describe('bestPost', () => {
  it('prefers new followers, then saves and shares', () => {
    const a = p('2026-11-01T10:00:00Z', { newFollowers: 5 });
    const b = p('2026-11-02T10:00:00Z', { likes: 40 });
    expect(bestPost([b, a])).toBe(a);
    expect(bestPost([p('2026-11-03T10:00:00Z')])).toBeNull();
  });
});
