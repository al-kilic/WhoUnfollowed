import { describe, expect, it } from 'vitest';
import { insightsStats } from './insightsStats.js';
import { aiInsightsStatsSchema } from '../memorySchemas.js';
import { insightsFromFiles, type ExportInsights, type InsightsStory } from '../exportInsights.js';
import type { ExportContentItem } from '../exportContent.js';
import { AUDIENCE, INTERACTIONS, REACH } from '../exportInsights.fixtures.js';

const NOW = Date.UTC(2026, 10, 19) / 1000;
const DAY = 86_400;
const story = (daysAgo: number, reach: number, exited = 10, impressions = 100, replies = 1): InsightsStory =>
  ({ at: NOW - daysAgo * DAY, reach, impressions, forward: null, back: null, next: null, exited, replies, shares: 0, profileVisits: 2 });
const item = (date: number, format: ExportContentItem['format']): ExportContentItem => ({ date, caption: '', format, slides: format === 'carousel' ? 3 : 1, uris: [`m/${date}`] });

describe('insightsStats', () => {
  const ins: ExportInsights = {
    posts: [
      { at: NOW - 10 * DAY, kind: 'reel', reach: 900, impressions: null, plays: 1200, likes: 90, comments: 5, saves: 6, shares: 4, follows: null, profileVisits: null },
      { at: NOW - 20 * DAY, kind: 'post', reach: 400, impressions: 500, plays: null, likes: 60, comments: 2, saves: 1, shares: 0, follows: 2, profileVisits: 3 },
      { at: NOW - 30 * DAY + 30, kind: 'post', reach: 600, impressions: 700, plays: null, likes: 80, comments: 4, saves: 3, shares: 1, follows: 4, profileVisits: 5 },
      { at: NOW + DAY, kind: 'post', reach: 1, impressions: 1, plays: null, likes: 1, comments: 1, saves: 1, shares: 1, follows: 1, profileVisits: 1 },
    ],
    stories: [story(5, 100, 20), story(40, 120, 10), story(200, 200), story(300, 220), story(800, 999)],
    lives: 2,
    account: insightsFromFiles({ audience_insights: AUDIENCE, profiles_reached: REACH, content_interactions: INTERACTIONS }).account,
  };
  const items = [item(NOW - 20 * DAY, 'carousel'), item(NOW - 30 * DAY, 'photo')];
  const s = insightsStats(ins, items, { now: NOW });

  it('gives each post its format from the content list and skips future dates', () => {
    expect(s.posts.map((p) => [p.format, p.reach])).toEqual([['reel', 900], ['carousel', 400], ['photo', 600]]);
    expect(s.formats.map((f) => [f.format, f.posts, f.medianReach])).toEqual([['photo', 1, 600], ['carousel', 1, 400], ['reel', 1, 900]]);
  });

  it('sums up stories by window, exits, replies and weekday', () => {
    const st = s.stories!;
    expect([st.total, st.last90, st.last365]).toEqual([5, 2, 4]);
    expect(st.medianReach90).toBe(110);
    expect(st.medianReachBefore).toBe(210);
    expect(st.exitPct90).toBe(15);
    expect(st.repliesPer100).toBe(0.9);
    expect(st.weekdayReach).toHaveLength(7);
    expect(st.byMonth).toHaveLength(24);
    expect(st.byMonth.at(-1)?.stories).toBe(1);
  });

  it('sums up the account: peak activity day, top age, top places', () => {
    const a = s.account!;
    expect([a.activityPeak, a.activityLiftPct]).toEqual([5, 30]);
    expect([a.topAge, a.topAgePct]).toEqual(['25-34', 54.7]);
    expect(a.countries.map((c) => c.name)).toEqual(['Portugal', 'United States', 'Brazil']);
    expect(a.cities).toHaveLength(3);
  });

  it('passes the upload schema', () => {
    expect(aiInsightsStatsSchema.safeParse(s).success).toBe(true);
    expect(aiInsightsStatsSchema.safeParse(insightsStats({ posts: [], stories: [], lives: 0, account: null }, [], { now: NOW })).success).toBe(true);
  });

  it('rejects a handle smuggled in as a place', () => {
    const bad = { ...s, account: { ...s.account!, cities: [{ name: '@someone', pct: 3 }] } };
    expect(aiInsightsStatsSchema.safeParse(bad).success).toBe(false);
  });
});

describe('captionDrift (detector 16)', () => {
  const post = (at: number, reach: number) => ({ at, kind: 'post' as const, reach, impressions: null, plays: null, likes: null, comments: null, saves: null, shares: null, follows: null, profileVisits: null });
  const it2 = (date: number, caption: string): ExportContentItem => ({ date, caption, format: 'photo', slides: 1, uris: [`m/${date}`] });
  const short = 'Blue hour. #film #35mm';
  const long = 'A long caption about the morning, the walk, the light, the waiting, and the whole story of how this frame happened, step by step. #film';

  it('compares the top third by reach with the last five posts', () => {
    const items = [...[1, 2, 3, 4, 5, 6].map((k) => it2(NOW - (100 + k) * DAY, short)), ...[1, 2, 3, 4, 5].map((k) => it2(NOW - k * DAY, long))];
    const ins: ExportInsights = { posts: [1, 2, 3, 4, 5, 6].map((k) => post(NOW - (100 + k) * DAY, k * 100)), stories: [], lives: 0, account: null };
    const d = insightsStats(ins, items, { now: NOW }).captionDrift!;
    expect(d.winners).toBe(2);
    expect(d.winnerTags).toBe(2);
    expect(d.recentChars).toBeGreaterThan(2 * d.winnerChars);
  });

  it('is null with fewer than 6 posts that have reach and a caption', () => {
    const ins: ExportInsights = { posts: [1, 2, 3].map((k) => post(NOW - k * DAY, 100)), stories: [], lives: 0, account: null };
    expect(insightsStats(ins, [], { now: NOW }).captionDrift).toBeNull();
  });
});
