import { describe, expect, it } from 'vitest';
import { analyzeSnapshot, compareSnapshots, curiosities, growthTimeline } from '@ig-tracker/core';
import { getSampleRecords, getSampleSnapshot, getSampleSnapshots, isSampleSnapshot, SAMPLE_COUNTS, SAMPLE_EXPORTED_AT, SAMPLE_FLOW, SAMPLE_SPREE } from './sampleSnapshot';

describe('sample snapshot', () => {
  const s = getSampleSnapshot();
  const followers = new Set(s.followers.map((a) => a.username));
  const following = new Set(s.following.map((a) => a.username));

  it('is a well-formed export that the real analysis reads', () => {
    for (const a of [...s.followers, ...s.following]) {
      expect(typeof a.username).toBe('string');
      expect(typeof a.href).toBe('string');
      expect(a.followedAt === null || Number.isInteger(a.followedAt)).toBe(true);
    }
    const r = analyzeSnapshot(s);
    expect(r.nonFollowers).toHaveLength(SAMPLE_COUNTS.notBack);
    expect(r.mutuals).toHaveLength(SAMPLE_COUNTS.following - SAMPLE_COUNTS.notBack);
    expect(s.platform).toBe('instagram');
  });

  it('has the ordinary counts the copy promises', () => {
    expect(s.followers).toHaveLength(SAMPLE_COUNTS.followers);
    expect(s.following).toHaveLength(SAMPLE_COUNTS.following);
    expect(s.following.filter((a) => !followers.has(a.username))).toHaveLength(SAMPLE_COUNTS.notBack);
    expect(s.pendingRequests).toHaveLength(SAMPLE_COUNTS.pending);
    expect(s.recentlyUnfollowed).toHaveLength(SAMPLE_COUNTS.unfollowed);
  });

  it('has three exports whose comparisons match the numbers the coach quotes', () => {
    const [a, b, c] = getSampleSnapshots();
    expect([a, b, c].map((x) => x!.followers.length)).toEqual([...SAMPLE_FLOW.followers]);
    expect([a, b, c].map((x) => x!.following.length)).toEqual([...SAMPLE_FLOW.following]);
    const ab = compareSnapshots(a!, b!), bc = compareSnapshots(b!, c!);
    expect([ab.newFollowers.length, bc.newFollowers.length]).toEqual([...SAMPLE_FLOW.gained]);
    expect([ab.lostFollowers.length, bc.lostFollowers.length]).toEqual([...SAMPLE_FLOW.lost]);
    // Nobody who arrived after June has left (the coach says so).
    const newSinceJune = new Set(bc.newFollowers.map((x) => x.username));
    expect(bc.lostFollowers.some((x) => newSinceJune.has(x.username))).toBe(false);
    // None of the people who left are followed back (no lost mutuals).
    expect(bc.lostFollowers.some((x) => following.has(x.username))).toBe(false);
  });

  it('agrees with the coach: October is the best month, Thursday the arrival day', () => {
    const tl = growthTimeline(s);
    expect(tl.best?.month).toBe('2026-10');
    expect(tl.best?.followers).toBe(72);
    const day = curiosities({ current: s }).find((x) => x.id === 'arrival_weekday');
    expect(day?.params.weekday).toBe(3); // 0 = Monday
    expect(day?.params.pct).toBe(32);
    const first = curiosities({ current: s }).find((x) => x.id === 'first_follower');
    expect(first?.params.date).toBe('2017-02-14');
  });

  it('puts the 41-follow week of March 2022 among the accounts that do not follow back', () => {
    const spree = s.following.filter((a) => a.followedAt && a.followedAt >= SAMPLE_SPREE && a.followedAt < SAMPLE_SPREE + 7 * 86_400);
    expect(spree.length).toBe(41);
    expect(spree.filter((a) => !followers.has(a.username)).length).toBe(41);
  });

  it('only uses handles Instagram cannot register, with no tacked-on numbers', () => {
    const all = getSampleSnapshots().flatMap((x) => [...x.followers, ...x.following, ...(x.pendingRequests ?? []), ...(x.recentlyUnfollowed ?? [])]);
    expect(all.every((a) => a.username.includes('..'))).toBe(true);
    expect(all.some((a) => /\d$/.test(a.username))).toBe(false);
    expect(following.size).toBe(s.following.length); // no duplicates
  });

  it('is the same for every visitor and is recognisable as the sample', () => {
    expect(getSampleSnapshot()).toBe(s);
    expect(isSampleSnapshot(s)).toBe(true);
    expect(getSampleRecords().every((r) => isSampleSnapshot(r.data) && (r.id ?? 0) < 0)).toBe(true);
    expect(isSampleSnapshot({ exportedAt: SAMPLE_EXPORTED_AT + 1 })).toBe(false);
  });
});
