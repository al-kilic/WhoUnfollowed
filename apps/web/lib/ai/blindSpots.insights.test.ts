import { describe, expect, it } from 'vitest';
import type { AiInsightsStats, ContentStats, ExportStats } from '@ig-tracker/core';
import { detectBlindSpots } from './blindSpots';
import { getSampleInsights } from '@/lib/sample/learned';
import { blindSpotFmt, getBlindSpotContent } from '@/components/studio/coach/todayBlindSpot.content';

// Detector 4 (a format missing for a year) and the two that read Instagram's
// own numbers from the export: story reach falling, reach that stays home.

const stats = [{ platform: 'instagram', exportedAt: Math.floor(Date.parse('2026-11-20T10:00:00Z') / 1000), followers: 1000, following: 900, mutuals: 700, fans: 300, notFollowingBack: 200, newFollowersByMonth: {}, followBackRate12m: null, followBackRatePrev12m: null, facts: [] } as unknown as ExportStats];
const content = (mix365: ContentStats['mix365'], posts365 = 40) => ({ posts365, mix365, mix90: mix365, currentGapDays: 2, medianGapDays: 4 } as unknown as ContentStats);
const ins = (o: { stories?: Partial<NonNullable<AiInsightsStats['stories']>>; account?: Partial<NonNullable<AiInsightsStats['account']>> }): AiInsightsStats => {
  const s = getSampleInsights();
  return { ...s, stories: { ...s.stories!, ...o.stories }, account: { ...s.account!, ...o.account } };
};
const spots = (i: Parameters<typeof detectBlindSpots>[0]) => detectBlindSpots(i);

describe('format_never_tried', () => {
  it('no Reel in a year of regular posting, then no carousel', () => {
    expect(spots({ stats, content: content({ photo: 0.6, carousel: 0.4, reel: 0, video: 0 }) }).find((b) => b.detector === 'format_never_tried'))
      .toMatchObject({ key: 'format_never_tried:reel', params: { format: 3, posts: 40 } });
    expect(spots({ stats, content: content({ photo: 0.7, carousel: 0, reel: 0.3, video: 0 }) }).find((b) => b.detector === 'format_never_tried')?.key).toBe('format_never_tried:carousel');
    expect(spots({ stats, content: content({ photo: 1, carousel: 0, reel: 0, video: 0 }, 6) }).some((b) => b.detector === 'format_never_tried')).toBe(false);
  });
});

describe('story_reach_drop', () => {
  it('fires on a drop of a quarter or more with enough stories', () => {
    const b = spots({ stats, insights: ins({ stories: { medianReach90: 150, medianReachBefore: 220, last90: 30 } }) }).find((x) => x.detector === 'story_reach_drop');
    expect(b?.params).toEqual({ now: 150, before: 220, pct: 32 });
    expect(spots({ stats, insights: ins({ stories: { medianReach90: 200, medianReachBefore: 220, last90: 30 } }) }).some((x) => x.detector === 'story_reach_drop')).toBe(false);
    expect(spots({ stats, insights: ins({ stories: { medianReach90: 100, medianReachBefore: 220, last90: 4 } }) }).some((x) => x.detector === 'story_reach_drop')).toBe(false);
  });

  it('the sample shows it (her stories drifted down)', () => {
    expect(spots({ stats, insights: getSampleInsights() }).some((x) => x.detector === 'story_reach_drop')).toBe(true);
  });
});

describe('reach_stays_home', () => {
  it('fires when under 15% of a real reach is new people', () => {
    expect(spots({ stats, insights: ins({ account: { nonFollowerReachPct: 8.5, reached: 12000 } }) }).find((x) => x.detector === 'reach_stays_home')?.params).toEqual({ pct: 9, reached: 12000 });
    expect(spots({ stats, insights: ins({ account: { nonFollowerReachPct: 30, reached: 12000 } }) }).some((x) => x.detector === 'reach_stays_home')).toBe(false);
    expect(spots({ stats, insights: ins({ account: { nonFollowerReachPct: 5, reached: 200 } }) }).some((x) => x.detector === 'reach_stays_home')).toBe(false);
  });
});

describe('copy', () => {
  for (const locale of ['en', 'es', 'pt'] as const) {
    it(`${locale}: every new card reads with numbers, no em dash`, () => {
      const t = getBlindSpotContent(locale), f = blindSpotFmt(locale);
      for (const [d, p] of [['format_never_tried', { format: 3, posts: 40 }], ['story_reach_drop', { now: 150, before: 220, pct: 32 }], ['reach_stays_home', { pct: 9, reached: 12000 }]] as const) {
        const c = t.spots[d];
        const text = `${c.title(p, f)} ${c.why(p, f)} ${c.step}`;
        expect(text).not.toContain('—');
        expect(text).not.toMatch(/undefined|NaN/);
      }
    });
  }
});

describe('free teaser (3E)', () => {
  it('near_following_cap fires under 300 left, and is in the free list', async () => {
    const { FREE_DETECTORS } = await import('./blindSpots');
    const near = [{ ...stats[0]!, facts: [{ id: 'fix.following_limit', params: { following: 7300, cap: 7500, left: 200, oneWay: 900 } }] } as unknown as ExportStats];
    expect(spots({ stats: near }).find((b) => b.detector === 'near_following_cap')?.params).toEqual({ left: 200, cap: 7500, oneWay: 900 });
    const far = [{ ...stats[0]!, facts: [{ id: 'fix.following_limit', params: { following: 6800, cap: 7500, left: 700, oneWay: 900 } }] } as unknown as ExportStats];
    expect(spots({ stats: far }).some((b) => b.detector === 'near_following_cap')).toBe(false);
    expect([...FREE_DETECTORS].sort()).toEqual(['follow_back_drop', 'near_following_cap', 'quiet_season', 'spree_didnt_work', 'stale_pending']);
  });

  it('every free card has copy in every language', () => {
    for (const locale of ['en', 'es', 'pt'] as const) {
      const t = getBlindSpotContent(locale), f = blindSpotFmt(locale);
      expect(t.ask).toBeTruthy();
      const c = t.spots.near_following_cap;
      expect(`${c.title({ left: 200, cap: 7500 }, f)} ${c.why({ oneWay: 900 }, f)}`).not.toMatch(/undefined|NaN|—/);
    }
  });
});

describe('drifted_from_winner (16)', () => {
  const withDrift = (d: AiInsightsStats['captionDrift']) => ({ ...getSampleInsights(), captionDrift: d });
  it('fires on captions twice as long, or 5+ hashtags apart', () => {
    expect(spots({ stats, insights: withDrift({ winners: 3, winnerChars: 60, winnerTags: 3, recentChars: 200, recentTags: 3 }) }).find((b) => b.detector === 'drifted_from_winner')?.params).toMatchObject({ kind: 1, recentChars: 200, winnerChars: 60 });
    expect(spots({ stats, insights: withDrift({ winners: 3, winnerChars: 80, winnerTags: 2, recentChars: 90, recentTags: 12 }) }).find((b) => b.detector === 'drifted_from_winner')?.params.kind).toBe(2);
    expect(spots({ stats, insights: withDrift({ winners: 3, winnerChars: 80, winnerTags: 3, recentChars: 100, recentTags: 5 }) }).some((b) => b.detector === 'drifted_from_winner')).toBe(false);
    expect(spots({ stats, insights: withDrift(null) }).some((b) => b.detector === 'drifted_from_winner')).toBe(false);
  });
  it('copy reads in every language', () => {
    for (const locale of ['en', 'es', 'pt'] as const) {
      const c = getBlindSpotContent(locale).spots.drifted_from_winner, f = blindSpotFmt(locale);
      for (const kind of [1, 2]) expect(`${c.title({ kind, recentChars: 200, winnerChars: 60, recentTags: 12, winnerTags: 2 }, f)} ${c.why({}, f)}`).not.toMatch(/undefined|NaN|—/);
    }
  });
});
