import { describe, expect, it } from 'vitest';
import JSZip from 'jszip';
import { hasInsights, insightNumber, insightShares, insightsFileOf, insightsFromFiles } from './exportInsights.js';
import { readFullExport } from './exportFull.js';

import { AUDIENCE, INTERACTIONS, REACH, cell, post, reel, story } from './exportInsights.fixtures.js';

describe('insightNumber / insightShares', () => {
  it('reads Meta number strings', () => {
    expect(insightNumber('1,234')).toBe(1234);
    expect(insightNumber('12.5%')).toBe(12.5);
    expect(insightNumber('+1.2% vs May 23 - Aug 20')).toBe(1.2);
    expect(insightNumber('-99.9%')).toBe(-99.9);
    expect(insightNumber('--')).toBeNull();
    expect(insightNumber('')).toBeNull();
    expect(insightNumber(undefined)).toBeNull();
  });

  it('reads place shares and drops anything that is not a plain name', () => {
    expect(insightShares('Lisbon: 9%, New York: 2.4%, São Paulo: 1.5%')).toEqual([
      { name: 'Lisbon', pct: 9 }, { name: 'New York', pct: 2.4 }, { name: 'São Paulo', pct: 1.5 },
    ]);
    expect(insightShares('@handle: 5%, http://x.y: 3%, Porto: 1%')).toEqual([{ name: 'Porto', pct: 1 }]);
    expect(insightShares(null)).toEqual([]);
  });
});

describe('insightsFileOf', () => {
  it('knows the insights files, wrapped or not', () => {
    expect(insightsFileOf('logged_information/past_instagram_insights/stories.json')).toBe('stories');
    expect(insightsFileOf('wrap/logged_information/past_instagram_insights/audience_insights.json')).toBe('audience_insights');
    expect(insightsFileOf('logged_information/past_instagram_insights/unknown.json')).toBeNull();
    expect(insightsFileOf('your_instagram_activity/media/stories.json')).toBeNull();
  });
});

describe('insightsFromFiles', () => {
  it('reads posts, reels, stories, lives and the account, never captions', () => {
    const ins = insightsFromFiles({
      posts: { organic_insights_posts: [post(1_700_000_000, { 'Accounts reached': '468', Impressions: '1,531', Likes: '75', Comments: '3', Saves: '2', Shares: '1', Follows: '4', 'Profile visits': '5' })] },
      reels: { organic_insights_reels: [reel(1_710_000_000, { 'Accounts reached': '428', 'Instagram Plays': '514', 'Instagram Likes': '85', 'Instagram Comments': '6', 'Instagram Shares': '3', 'Instagram Saves': '4' })] },
      stories: { organic_insights_stories: [story(1_705_000_000, { 'Accounts reached': '138', Impressions: '145', Exited: '26', Replies: '1' }), story(1_706_000_000, { 'Accounts reached': '--' })] },
      live_videos: { organic_insights_live: [{ string_map_data: { 'Start Time': cell(''), Duration: cell('0'), 'Accounts reached': cell('--') } }, { string_map_data: { 'Start Time': cell('', 1_708_000_000), Duration: cell('12'), 'Accounts reached': cell('40') } }] },
      audience_insights: AUDIENCE, profiles_reached: REACH, content_interactions: INTERACTIONS,
    });
    expect(ins.posts.map((p) => [p.kind, p.at, p.reach, p.plays, p.likes, p.follows])).toEqual([
      ['reel', 1_710_000_000, 428, 514, 85, null], ['post', 1_700_000_000, 468, null, 75, 4],
    ]);
    expect(ins.stories.map((s) => [s.at, s.reach, s.exited])).toEqual([[1_706_000_000, null, null], [1_705_000_000, 138, 26]]);
    expect(ins.lives).toBe(1);
    const a = ins.account!;
    expect([a.range, a.followers, a.followersDeltaPct, a.follows, a.unfollows]).toEqual(['Aug 21 - Nov 18', 1500, 2.5, 200, 150]);
    expect([a.reached, a.reachedDeltaPct, a.nonFollowerReachPct, a.linkTaps, a.engagedNonFollowerPct]).toEqual([12000, -12.5, 8.5, 5, 4.8]);
    expect(a.weekdayActivity).toEqual([1000, 1000, 1000, 1000, 1000, 1300, 700]);
    expect(a.ages[2]).toEqual({ bucket: '25-34', pct: 54.7 });
    expect(a.ages.at(-1)).toEqual({ bucket: '65+', pct: 0.6 });
    expect(a.countries[0]).toEqual({ name: 'Portugal', pct: 30.5 });
    expect(JSON.stringify(ins)).not.toContain('@someone');
  });

  it('handles missing and broken files', () => {
    const ins = insightsFromFiles({ posts: 'junk', stories: [null, { string_map_data: null }] });
    expect(ins).toEqual({ posts: [], stories: [], lives: 0, account: null });
    expect(hasInsights(ins)).toBe(false);
  });
});

describe('readFullExport', () => {
  it('reads content and insights from one ZIP, inside a wrapping folder', async () => {
    const zip = new JSZip();
    zip.file('wrap/your_instagram_activity/media/posts_1.json', JSON.stringify([{ title: 'one', creation_timestamp: 1_700_000_000, media: [{ uri: 'media/posts/a.jpg' }] }]));
    zip.file('wrap/logged_information/past_instagram_insights/posts.json', JSON.stringify({ organic_insights_posts: [post(1_700_000_000, { 'Accounts reached': '10' })] }));
    zip.file('wrap/logged_information/past_instagram_insights/audience_insights.json', JSON.stringify(AUDIENCE));
    const full = await readFullExport(new Blob([(await zip.generateAsync({ type: 'uint8array' })).slice().buffer as ArrayBuffer]));
    expect(full.content.map((c) => c.caption)).toEqual(['one']);
    expect(full.insights.posts[0]?.reach).toBe(10);
    expect(full.insights.account?.followers).toBe(1500);
  });
});
