// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

// Instagram's own numbers from a full export ("All information"), read in the
// browser: logged_information/past_instagram_insights/*.json. Per-post numbers
// (Instagram keeps them for only some posts), every story with its reach and
// taps, and the last 90 days for the whole account (followers, reach, follower
// activity per weekday, age, gender, top countries and cities).
//
// Only numbers, timestamps and place names are read. Captions and thumbnails
// in these files are skipped. Labels are matched in English, the way Meta
// writes them in the JSON; a label we don't know reads as null.
//
// Known shape (checked against a real export, Nov 2026):
//   posts.json      { organic_insights_posts:   [{ string_map_data: { "Creation Timestamp": { timestamp }, "Accounts reached": { value: "1,234" }, … } }] }
//   reels.json      { organic_insights_reels:   [{ string_map_data: { "Upload Timestamp", "Instagram Plays", "Instagram Likes", … } }] }
//   stories.json    { organic_insights_stories: [{ string_map_data: { "Creation Timestamp", "Accounts reached", "Exited", … } }] }
//   live_videos.json, audience_insights.json, profiles_reached.json, content_interactions.json

export interface InsightsPost {
  at: number; // Unix seconds
  kind: 'post' | 'reel';
  reach: number | null;
  impressions: number | null;
  plays: number | null; // Reels only
  likes: number | null;
  comments: number | null;
  saves: number | null;
  shares: number | null;
  follows: number | null;
  profileVisits: number | null;
}

export interface InsightsStory {
  at: number;
  reach: number | null;
  impressions: number | null;
  forward: number | null;
  back: number | null;
  next: number | null;
  exited: number | null;
  replies: number | null;
  shares: number | null;
  profileVisits: number | null;
}

export interface PlaceShare { name: string; pct: number }
export interface AgeShare { bucket: string; pct: number }

// The account over Instagram's last insights window (usually 90 days).
export interface InsightsAccount {
  range: string | null; // as Meta writes it, e.g. "Aug 21 - Nov 18"
  followers: number | null;
  followersDeltaPct: number | null; // vs the window before
  follows: number | null; // people who followed in the window
  unfollows: number | null;
  reached: number | null;
  reachedDeltaPct: number | null;
  followerReachPct: number | null; // share of reach that already followed
  nonFollowerReachPct: number | null;
  impressions: number | null;
  profileVisits: number | null;
  linkTaps: number | null;
  interactions: number | null;
  interactionsDeltaPct: number | null;
  postInteractions: number | null;
  storyInteractions: number | null;
  reelsInteractions: number | null;
  engaged: number | null;
  engagedNonFollowerPct: number | null;
  weekdayActivity: (number | null)[]; // Monday first, 7 values
  ages: AgeShare[];
  menPct: number | null;
  womenPct: number | null;
  countries: PlaceShare[];
  cities: PlaceShare[];
}

export interface ExportInsights {
  posts: InsightsPost[]; // newest first, posts and Reels together
  stories: InsightsStory[]; // newest first
  lives: number;
  account: InsightsAccount | null;
}

export type InsightsFile = 'posts' | 'reels' | 'stories' | 'live_videos' | 'audience_insights' | 'profiles_reached' | 'content_interactions';
const FILES: readonly InsightsFile[] = ['posts', 'reels', 'stories', 'live_videos', 'audience_insights', 'profiles_reached', 'content_interactions'];
const FILE = /(^|\/)past_instagram_insights\/([a-z_]+)\.json$/;

export function insightsFileOf(path: string): InsightsFile | null {
  const name = FILE.exec(path)?.[2];
  return name && (FILES as readonly string[]).includes(name) ? (name as InsightsFile) : null;
}

type Cell = { value?: unknown; timestamp?: unknown };
type Row = Record<string, Cell>;

// "1,234" → 1234, "12.5%" → 12.5, "+1.2% vs May 23 - Aug 20" → 1.2, "--" → null.
export function insightNumber(v: unknown): number | null {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v !== 'string') return null;
  const m = /^\s*([+-]?)(\d[\d,]*(?:\.\d+)?)\s*%?/.exec(v);
  if (!m) return null;
  const n = Number(m[2]!.replace(/,/g, ''));
  return Number.isFinite(n) ? (m[1] === '-' ? -n : n) : null;
}

// "Istanbul: 9%, New York: 2.4%" → [{ name, pct }]. Names keep letters, spaces, dots, dashes and apostrophes only.
export function insightShares(v: unknown): PlaceShare[] {
  if (typeof v !== 'string') return [];
  const out: PlaceShare[] = [];
  for (const part of v.split(/,\s*(?=[^,]+:\s*\d)/)) {
    const m = /^\s*(.+?):\s*(\d+(?:\.\d+)?)%\s*$/.exec(part);
    if (!m) continue;
    const name = m[1]!.trim();
    if (!/^[\p{L}][\p{L}\p{M} .'-]{0,39}$/u.test(name)) continue;
    out.push({ name, pct: Number(m[2]) });
  }
  return out;
}

function rowsOf(raw: unknown): Row[] {
  if (!raw || typeof raw !== 'object') return [];
  const lists = Array.isArray(raw) ? [raw] : Object.values(raw as Record<string, unknown>).filter(Array.isArray);
  const out: Row[] = [];
  for (const list of lists as unknown[][]) {
    for (const item of list) {
      const smd = item && typeof item === 'object' ? (item as { string_map_data?: unknown }).string_map_data : null;
      if (smd && typeof smd === 'object') out.push(smd as Row);
    }
  }
  return out;
}

const n = (r: Row, k: string) => insightNumber(r[k]?.value);
const ts = (r: Row, ...keys: string[]) => {
  for (const k of keys) { const t = r[k]?.timestamp; if (typeof t === 'number' && t > 0) return t; }
  return 0;
};

function postsOf(raw: unknown): InsightsPost[] {
  return rowsOf(raw).map((r) => ({
    at: ts(r, 'Creation Timestamp'), kind: 'post' as const,
    reach: n(r, 'Accounts reached'), impressions: n(r, 'Impressions'), plays: null,
    likes: n(r, 'Likes'), comments: n(r, 'Comments'), saves: n(r, 'Saves'), shares: n(r, 'Shares'),
    follows: n(r, 'Follows'), profileVisits: n(r, 'Profile visits'),
  })).filter((p) => p.at);
}

function reelsOf(raw: unknown): InsightsPost[] {
  return rowsOf(raw).map((r) => ({
    at: ts(r, 'Upload Timestamp', 'Creation Timestamp'), kind: 'reel' as const,
    reach: n(r, 'Accounts reached'), impressions: null, plays: n(r, 'Instagram Plays'),
    likes: n(r, 'Instagram Likes'), comments: n(r, 'Instagram Comments'), saves: n(r, 'Instagram Saves'), shares: n(r, 'Instagram Shares'),
    follows: n(r, 'Follows'), profileVisits: n(r, 'Profile visits'),
  })).filter((p) => p.at);
}

function storiesOf(raw: unknown): InsightsStory[] {
  return rowsOf(raw).map((r) => ({
    at: ts(r, 'Creation Timestamp'),
    reach: n(r, 'Accounts reached'), impressions: n(r, 'Impressions'),
    forward: n(r, 'Forward'), back: n(r, 'Back'), next: n(r, 'Next story'), exited: n(r, 'Exited'),
    replies: n(r, 'Replies'), shares: n(r, 'Shares'), profileVisits: n(r, 'Profile visits'),
  })).filter((s) => s.at);
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function accountOf(audience: Row | undefined, reach: Row | undefined, inter: Row | undefined): InsightsAccount | null {
  if (!audience && !reach && !inter) return null;
  const a = audience ?? {}, r = reach ?? {}, i = inter ?? {};
  const range = [a, r, i].map((x) => x['Date Range']?.value).find((v): v is string => typeof v === 'string' && /^[\p{L}\d ,.-]{3,40}$/u.test(v)) ?? null;
  const engagedSplit = insightShares(i['Engaged Account By Follow Type']?.value);
  const ageText = a['Follower Percentage by Age for All Genders']?.value;
  const ages = typeof ageText === 'string'
    ? [...ageText.matchAll(/(\d{2}(?:-\d{2}|\+)):\s*(\d+(?:\.\d+)?)%/g)].map((m) => ({ bucket: m[1]!, pct: Number(m[2]) }))
    : [];
  return {
    range,
    followers: n(a, 'Followers'), followersDeltaPct: n(a, 'Followers Delta'),
    follows: n(a, 'Follows'), unfollows: n(a, 'Unfollows'),
    reached: n(r, 'Accounts Reached'), reachedDeltaPct: n(r, 'Accounts Reached Delta'),
    followerReachPct: n(r, 'Followers'), nonFollowerReachPct: n(r, 'Non-Followers'),
    impressions: n(r, 'Impressions'), profileVisits: n(r, 'Profile visits'), linkTaps: n(r, 'External link taps'),
    interactions: n(i, 'Content Interactions'), interactionsDeltaPct: n(i, 'Content Interactions Delta'),
    postInteractions: n(i, 'Post Interactions'), storyInteractions: n(i, 'Story Interactions'), reelsInteractions: n(i, 'Reels Interactions'),
    engaged: n(i, 'Accounts engaged'),
    engagedNonFollowerPct: engagedSplit.find((x) => /^non/i.test(x.name))?.pct ?? null,
    weekdayActivity: DAYS.map((d) => n(a, `${d} Follower Activity`)),
    ages,
    menPct: n(a, 'Total Follower Percentage for Men'), womenPct: n(a, 'Total Follower Percentage for Women'),
    countries: insightShares(a['Follower Percentage by Country']?.value),
    cities: insightShares(a['Follower Percentage by City']?.value),
  };
}

// Every insights file found, by name, parsed JSON. Missing files are fine.
export function insightsFromFiles(files: Partial<Record<InsightsFile, unknown>>): ExportInsights {
  const posts = [...postsOf(files.posts), ...reelsOf(files.reels)].sort((a, b) => b.at - a.at);
  const stories = storiesOf(files.stories).sort((a, b) => b.at - a.at);
  return {
    posts,
    stories,
    // Meta lists empty rows here (no start time, duration 0, reach "--"); count real lives only.
    lives: rowsOf(files.live_videos).filter((r) => (n(r, 'Duration') ?? 0) > 0 || (n(r, 'Accounts reached') ?? 0) > 0 || ts(r, 'Start Time') > 0).length,
    account: accountOf(rowsOf(files.audience_insights)[0], rowsOf(files.profiles_reached)[0], rowsOf(files.content_interactions)[0]),
  };
}

export const EMPTY_INSIGHTS: ExportInsights = { posts: [], stories: [], lives: 0, account: null };

export function hasInsights(i: ExportInsights): boolean {
  return i.posts.length > 0 || i.stories.length > 0 || i.lives > 0 || i.account !== null;
}
