import { describe, expect, it } from 'vitest';
import { cleanResults, MAX_IMPORT, parsePostAdd, parsePostImport, postedMeta } from './postedInput';

const NOW = new Date('2026-11-26T12:00:00Z');

describe('parsePostAdd', () => {
  it('keeps a valid post with platform, past date and results', () => {
    const p = parsePostAdd({ format: 'reel', title: '  Night walk  in Lisbon ', platform: 'threads', date: '2026-11-20', results: { likes: 40, saves: 3, bogus: 9 } }, NOW);
    expect(p).toMatchObject({ format: 'reel', title: 'Night walk in Lisbon', platform: 'threads', results: { likes: 40, saves: 3 }, source: 'manual' });
    expect(p?.postedAt?.toISOString().slice(0, 10)).toBe('2026-11-20');
  });
  it('defaults the platform to Instagram and refuses unknown formats or short titles', () => {
    expect(parsePostAdd({ format: 'photo', title: 'Hi there' }, NOW)?.platform).toBe('instagram');
    expect(parsePostAdd({ format: 'tweet', title: 'Hello' }, NOW)).toBeNull();
    expect(parsePostAdd({ format: 'photo', title: 'x' }, NOW)).toBeNull();
  });
  it('drops dates in the future or older than a year', () => {
    expect(parsePostAdd({ format: 'photo', title: 'Hello', date: '2027-01-10' }, NOW)?.postedAt).toBeNull();
    expect(parsePostAdd({ format: 'photo', title: 'Hello', date: '2025-01-10' }, NOW)?.postedAt).toBeNull();
  });
});

describe('cleanResults', () => {
  it('keeps only known, whole, non-negative numbers', () => {
    expect(cleanResults({ likes: 5, reach: 1200, newFollowers: -1, saves: 2.5, comments: '3' })).toEqual({ likes: 5, reach: 1200 });
    expect(cleanResults({})).toBeNull();
    expect(cleanResults(null)).toBeNull();
  });
});

describe('parsePostImport', () => {
  it('marks imports as insights, keeps keys and caps the batch', () => {
    const one = { format: 'carousel', title: 'Market morning', key: 'ig:1731000000', results: { reach: 900 } };
    const out = parsePostImport(Array.from({ length: 12 }, () => one), NOW);
    expect(out).toHaveLength(MAX_IMPORT);
    expect(out[0]).toMatchObject({ source: 'insights', key: 'ig:1731000000' });
    expect(parsePostImport({ not: 'an array' }, NOW)).toEqual([]);
  });
  it('drops unsafe keys', () => {
    expect(parsePostImport([{ format: 'photo', title: 'Hello', key: "x'; drop" }], NOW)[0]?.key).toBeNull();
  });
});

describe('postedMeta', () => {
  it('tells checks, plan days, manual and insights rows apart', () => {
    expect(postedMeta('check', '{}')).toEqual({ source: 'check', planDay: null });
    expect(postedMeta('post', JSON.stringify({ planId: 'p1', day: 12 }))).toEqual({ source: 'plan', planDay: 12 });
    expect(postedMeta('post', JSON.stringify({ manual: true }))).toEqual({ source: 'manual', planDay: null });
    expect(postedMeta('post', JSON.stringify({ source: 'insights' }))).toEqual({ source: 'insights', planDay: null });
    expect(postedMeta('post', 'not json')).toEqual({ source: 'manual', planDay: null });
  });
});
