// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import type { ContentFormat } from '../contentFormats.js';
import type { ExportContentItem } from '../exportContent.js';
import type { ExportInsights, InsightsPost, InsightsStory, PlaceShare } from '../exportInsights.js';
import { captionBody, countHashtags, median } from './captionSignals.js';

// What Instagram's own numbers say, summed up for the coach. Worked out in the
// browser from exportInsights; numbers, dates and the audience's top countries
// and cities only. Nothing here names a person.

export interface InsightsPostRow {
  date: string; // YYYY-MM-DD
  format: ContentFormat;
  reach: number | null;
  plays: number | null;
  likes: number | null;
  comments: number | null;
  saves: number | null;
  shares: number | null;
  follows: number | null;
}

export interface InsightsFormatRow {
  format: ContentFormat;
  posts: number;
  medianReach: number | null;
  medianLikes: number | null;
  medianSaves: number | null;
  medianShares: number | null;
  medianFollows: number | null;
}

export interface InsightsStoryMonth { month: string; stories: number; medianReach: number | null }

export interface InsightsStoriesSummary {
  total: number;
  last90: number;
  last365: number;
  medianReach90: number | null; // last 90 days
  medianReachBefore: number | null; // days 91 to 365, to compare with
  exitPct90: number | null; // median share of impressions that left, in %
  repliesPer100: number | null; // replies per 100 accounts reached, last 90 days
  visitsPer100: number | null; // profile visits per 100 reached, last 90 days
  weekdayReach: (number | null)[]; // median reach by weekday, last 365 days, Monday first
  byMonth: InsightsStoryMonth[]; // last 24 months, oldest first
}

export interface InsightsAccountSummary {
  range: string | null;
  followers: number | null;
  followersDeltaPct: number | null;
  follows: number | null;
  unfollows: number | null;
  reached: number | null;
  reachedDeltaPct: number | null;
  nonFollowerReachPct: number | null;
  profileVisits: number | null;
  linkTaps: number | null;
  interactionsDeltaPct: number | null;
  storyInteractions: number | null;
  postInteractions: number | null;
  reelsInteractions: number | null;
  engagedNonFollowerPct: number | null;
  activityPeak: number | null; // weekday 0 = Monday with the most follower activity
  activityLiftPct: number | null; // how far that day is above the weekly average, in %
  topAge: string | null;
  topAgePct: number | null;
  womenPct: number | null;
  menPct: number | null;
  countries: PlaceShare[]; // top 3
  cities: PlaceShare[]; // top 3
}

// Detector 16: how the captions of the best-reached posts compare with the
// last five posts. Only when at least 6 posts have reach and a caption.
export interface CaptionDrift {
  winners: number; // posts in the top third by reach
  winnerChars: number;
  winnerTags: number;
  recentChars: number;
  recentTags: number;
}

export interface InsightsStats {
  posts: InsightsPostRow[]; // newest first, at most 30
  captionDrift: CaptionDrift | null;
  formats: InsightsFormatRow[];
  stories: InsightsStoriesSummary | null;
  account: InsightsAccountSummary | null;
  lives: number;
}

const DAY = 86_400;
const day = (ts: number) => new Date(ts * 1000).toISOString().slice(0, 10);
const r1 = (n: number | null) => (n === null ? null : Math.round(n * 10) / 10);
const med = (xs: readonly (number | null)[]) => r1(median(xs.filter((x): x is number => x !== null)));

function monthsBack(now: number, n: number): string[] {
  const d = new Date(now * 1000);
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - i, 1)).toISOString().slice(0, 7));
  return out;
}

// A post's format from the content list, matched by its timestamp (same second,
// or within a minute); Reels are always 'reel'.
function formatOf(p: InsightsPost, byTime: Map<number, ContentFormat>, items: readonly ExportContentItem[]): ContentFormat {
  if (p.kind === 'reel') return 'reel';
  const exact = byTime.get(p.at);
  if (exact) return exact;
  const near = items.find((i) => Math.abs(i.date - p.at) <= 60);
  return near?.format ?? 'photo';
}

function storiesSummary(all: readonly InsightsStory[], now: number, offset: number): InsightsStoriesSummary | null {
  const s = all.filter((x) => x.at > 0 && x.at <= now);
  if (!s.length) return null;
  const recent = s.filter((x) => x.at > now - 90 * DAY);
  const before = s.filter((x) => x.at <= now - 90 * DAY && x.at > now - 365 * DAY);
  const year = s.filter((x) => x.at > now - 365 * DAY);
  const reach90 = recent.reduce((t, x) => t + (x.reach ?? 0), 0);
  const per100 = (k: 'replies' | 'profileVisits') => (reach90 > 0 ? r1((recent.reduce((t, x) => t + (x[k] ?? 0), 0) / reach90) * 100) : null);
  const weekday: (number | null)[][] = Array.from({ length: 7 }, () => []);
  for (const x of year) weekday[(new Date((x.at + offset) * 1000).getUTCDay() + 6) % 7]!.push(x.reach);
  const months = monthsBack(now, 24);
  const byMonth = months.map((m) => {
    const inMonth = s.filter((x) => new Date((x.at + offset) * 1000).toISOString().slice(0, 7) === m);
    return { month: m, stories: inMonth.length, medianReach: med(inMonth.map((x) => x.reach)) };
  });
  return {
    total: s.length,
    last90: recent.length,
    last365: year.length,
    medianReach90: med(recent.map((x) => x.reach)),
    medianReachBefore: med(before.map((x) => x.reach)),
    exitPct90: med(recent.map((x) => (x.exited !== null && x.impressions ? (x.exited / x.impressions) * 100 : null))),
    repliesPer100: per100('replies'),
    visitsPer100: per100('profileVisits'),
    weekdayReach: weekday.map(med),
    byMonth,
  };
}

function accountSummary(i: ExportInsights['account']): InsightsAccountSummary | null {
  if (!i) return null;
  const act = i.weekdayActivity.map((v, k) => ({ v, k })).filter((x): x is { v: number; k: number } => x.v !== null);
  const avg = act.length === 7 ? act.reduce((t, x) => t + x.v, 0) / 7 : 0;
  const peak = act.length === 7 ? act.reduce((m, x) => (x.v > m.v ? x : m)) : null;
  const age = i.ages.reduce<{ bucket: string; pct: number } | null>((m, a) => (!m || a.pct > m.pct ? a : m), null);
  const top3 = (xs: PlaceShare[]) => [...xs].sort((a, b) => b.pct - a.pct).slice(0, 3);
  return {
    range: i.range,
    followers: i.followers, followersDeltaPct: i.followersDeltaPct,
    follows: i.follows, unfollows: i.unfollows,
    reached: i.reached, reachedDeltaPct: i.reachedDeltaPct, nonFollowerReachPct: i.nonFollowerReachPct,
    profileVisits: i.profileVisits, linkTaps: i.linkTaps,
    interactionsDeltaPct: i.interactionsDeltaPct,
    storyInteractions: i.storyInteractions, postInteractions: i.postInteractions, reelsInteractions: i.reelsInteractions,
    engagedNonFollowerPct: i.engagedNonFollowerPct,
    activityPeak: peak && avg > 0 ? peak.k : null,
    activityLiftPct: peak && avg > 0 ? Math.round(((peak.v - avg) / avg) * 100) : null,
    topAge: age?.bucket ?? null, topAgePct: age?.pct ?? null,
    womenPct: i.womenPct, menPct: i.menPct,
    countries: top3(i.countries), cities: top3(i.cities),
  };
}

function captionDrift(ins: ExportInsights, items: readonly ExportContentItem[]): CaptionDrift | null {
  const byTime = new Map(items.map((i) => [i.date, i.caption] as const));
  const scored = ins.posts
    .map((p) => ({ reach: p.reach, caption: byTime.get(p.at) ?? items.find((i) => Math.abs(i.date - p.at) <= 60)?.caption ?? null }))
    .filter((x): x is { reach: number; caption: string } => x.reach !== null && !!x.caption);
  if (scored.length < 6) return null;
  const top = [...scored].sort((a, b) => b.reach - a.reach).slice(0, Math.max(2, Math.floor(scored.length / 3)));
  const recent = [...items].filter((i) => i.caption).sort((a, b) => b.date - a.date).slice(0, 5);
  if (recent.length < 5) return null;
  const chars = (cs: string[]) => Math.round(median(cs.map((c) => captionBody(c).length)) ?? 0);
  const tags = (cs: string[]) => Math.round(median(cs.map(countHashtags)) ?? 0);
  return {
    winners: top.length,
    winnerChars: chars(top.map((x) => x.caption)), winnerTags: tags(top.map((x) => x.caption)),
    recentChars: chars(recent.map((x) => x.caption)), recentTags: tags(recent.map((x) => x.caption)),
  };
}

export function insightsStats(ins: ExportInsights, items: readonly ExportContentItem[], opts: { now: number; utcOffsetMinutes?: number }): InsightsStats {
  const offset = (opts.utcOffsetMinutes ?? 0) * 60;
  const byTime = new Map(items.map((i) => [i.date, i.format] as const));
  const rows: InsightsPostRow[] = ins.posts
    .filter((p) => p.at > 0 && p.at <= opts.now)
    .map((p) => ({ date: day(p.at + offset), format: formatOf(p, byTime, items), reach: p.reach, plays: p.plays, likes: p.likes, comments: p.comments, saves: p.saves, shares: p.shares, follows: p.follows }));
  const formats: InsightsFormatRow[] = (['photo', 'carousel', 'reel', 'video'] as ContentFormat[])
    .map((f) => {
      const list = rows.filter((r) => r.format === f);
      return {
        format: f, posts: list.length,
        medianReach: med(list.map((r) => r.reach)), medianLikes: med(list.map((r) => r.likes)),
        medianSaves: med(list.map((r) => r.saves)), medianShares: med(list.map((r) => r.shares)), medianFollows: med(list.map((r) => r.follows)),
      };
    })
    .filter((f) => f.posts > 0);
  return {
    posts: rows.slice(0, 30),
    captionDrift: captionDrift(ins, items),
    formats,
    stories: storiesSummary(ins.stories, opts.now, offset),
    account: accountSummary(ins.account),
    lives: ins.lives,
  };
}
