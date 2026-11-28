import { describe, expect, it } from 'vitest';
import type { InsightsPostRow } from '@ig-tracker/core';
import { resultsFromInsights } from './insightsResults';

const row = (date: string, format: InsightsPostRow['format'], likes: number | null, follows: number | null = 2): InsightsPostRow =>
  ({ date, format, reach: 100, plays: null, likes, comments: 1, saves: 3, shares: 0, follows });
const posted = (id: string, format: string, at: string, results: string | null = null) => ({ id, format, postedAt: new Date(at), results });

describe('resultsFromInsights', () => {
  it('fills one clear match per post, same kind, near the posted day', () => {
    const out = resultsFromInsights(
      [posted('a', 'carousel', '2026-03-02T18:00:00Z'), posted('b', 'reel', '2026-03-10T09:00:00Z')],
      [row('2026-03-01', 'photo', 50), row('2026-03-10', 'reel', 90, null)],
    );
    expect(out).toEqual([
      { id: 'a', results: { likes: 50, saves: 3, shares: 0, comments: 1, newFollowers: 2 } },
      { id: 'b', results: { likes: 90, saves: 3, shares: 0, comments: 1 } },
    ]);
  });

  it('skips typed results, stories, far dates, wrong kind and real ties', () => {
    const out = resultsFromInsights(
      [
        posted('typed', 'photo', '2026-03-02T12:00:00Z', '{"likes":5}'),
        posted('story', 'story', '2026-03-02T12:00:00Z'),
        posted('far', 'photo', '2026-04-20T12:00:00Z'),
        posted('kind', 'reel', '2026-03-02T12:00:00Z'),
        posted('tie', 'photo', '2026-05-02T12:00:00Z'),
      ],
      [row('2026-03-02', 'photo', 10), row('2026-05-01', 'photo', 1), row('2026-05-03', 'photo', 2)],
    );
    expect(out).toEqual([]);
  });

  it('prefers the same format, then the closest day', () => {
    const out = resultsFromInsights(
      [posted('c', 'carousel', '2026-05-02T12:00:00Z'), posted('p', 'photo', '2026-06-10T20:00:00Z')],
      [row('2026-05-01', 'photo', 1), row('2026-05-02', 'carousel', 2), row('2026-06-08', 'photo', 3), row('2026-06-10', 'photo', 4)],
    );
    expect(out.map((o) => [o.id, o.results.likes])).toEqual([['c', 2], ['p', 4]]);
  });

  it('uses each export post once', () => {
    const out = resultsFromInsights(
      [posted('first', 'photo', '2026-03-02T08:00:00Z'), posted('second', 'photo', '2026-03-02T20:00:00Z')],
      [row('2026-03-02', 'photo', 10)],
    );
    expect(out.map((o) => o.id)).toEqual(['first']);
  });
});
