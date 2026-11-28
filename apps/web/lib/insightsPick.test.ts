import { describe, expect, it } from 'vitest';
import { autoPick, NO_NUMS, numbersFor, rankPosts, scoreOf, type Candidate, type PostNums } from './insightsPick';

const n = (p: Partial<PostNums>): PostNums => ({ ...NO_NUMS, ...p });

describe('numbersFor', () => {
  const rows = [
    { at: 1000, reach: 500, likes: 40, comments: 2, saves: 5, shares: 1 },
    { at: 9000, reach: 90, likes: 9, comments: 0, saves: 0, shares: 0 },
  ];
  it('matches the closest row within an hour', () => {
    expect(numbersFor(1030, rows).reach).toBe(500);
    expect(numbersFor(9000 + 3000, rows).reach).toBe(90);
  });
  it('gives nothing when no row is close', () => {
    expect(numbersFor(50_000, rows)).toEqual(NO_NUMS);
  });
});

describe('scoreOf', () => {
  it('prefers reach, then a weighted engagement score', () => {
    expect(scoreOf(n({ reach: 700, likes: 5 }))).toBe(700);
    expect(scoreOf(n({ likes: 10, comments: 2, saves: 3, shares: 1 }))).toBe(20);
    expect(scoreOf(NO_NUMS)).toBeNull();
  });
});

describe('autoPick', () => {
  const cands: Candidate[] = Array.from({ length: 12 }, (_, i) => ({ idx: i, date: 1000 - i, nums: n({ reach: (i + 1) * 100 }) }));
  it('takes the strongest and the weakest, newest first', () => {
    const picked = autoPick(cands, 8);
    expect(picked).toHaveLength(8);
    // reach grows with idx: top 4 are idx 11..8, bottom 4 are idx 0..3.
    expect(new Set(picked)).toEqual(new Set([11, 10, 9, 8, 0, 1, 2, 3]));
    expect(picked[0]).toBe(0); // newest first
  });
  it('falls back to the newest posts without numbers', () => {
    const bare = cands.map((c) => ({ ...c, nums: NO_NUMS }));
    expect(autoPick(bare, 3)).toEqual([0, 1, 2]);
  });
});

describe('rankPosts', () => {
  it('ranks by score and compares with the median', () => {
    const r = rankPosts([n({ reach: 200 }), n({ reach: 100 }), NO_NUMS, n({ reach: 50 })]);
    expect(r.map((x) => x.rank)).toEqual([1, 2, null, 3]);
    expect(r[0]).toMatchObject({ post: 'P1', times: 2 });
    expect(r[2]!.times).toBeNull();
  });
});
