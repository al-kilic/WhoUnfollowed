// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import type { ParsedSnapshot } from '../schemas.js';
import { growthTimeline } from '../tools/growthTimeline.js';
import { median } from './captionSignals.js';
import type { ContentStats } from './contentStats.js';
import type { InsightsStats } from './insightsStats.js';

// The moments in an account's story that the exports already show: the best
// month, months that spiked or went quiet, a week of mass following, and a
// drop in followers between two exports. Numbers and dates only (the same
// rule as Radar facts), so the list can be saved and sent to the coach.
//
// Monthly counts come from the follow dates of today's followers, so they are
// "when today's audience arrived": people who later left aren't counted.

export type MomentKind = 'spike' | 'drop' | 'follow_spree' | 'quiet_month' | 'best_month'
  // From the full export (content history and Instagram's own numbers):
  | 'best_post' | 'story_best_month' | 'busiest_month' | 'long_break';

export interface Moment {
  kind: MomentKind;
  at: string; // YYYY-MM or YYYY-MM-DD
  params: Record<string, number | string>;
}

type Snap = Pick<ParsedSnapshot, 'followers' | 'following' | 'exportedAt'>;

const DAY = 86_400;
const day = (ts: number) => new Date(ts * 1000).toISOString().slice(0, 10);

export const MOMENT_RULES = {
  bestMin: 10, // a best month needs at least this many arrivals
  spikeMin: 10,
  spikeTimes: 3, // a spike is 3x the usual month or more
  quietTypicalMin: 4, // quiet months only count when a usual month has 4+
  quietShare: 0.25, // and the month had a quarter of that or less
  spreeMin: 25, // accounts followed within 7 days
  dropMin: 10, // followers lost, net, between two exports
  dropShare: 0.02,
  maxEach: 3,
} as const;

function spree(s: Snap): Moment | null {
  const times = s.following.map((a) => a.followedAt).filter((t): t is number => t !== null).sort((a, b) => a - b);
  let best = { count: 0, start: 0 };
  for (let i = 0, j = 0; j < times.length; j++) {
    while (times[j]! - times[i]! >= 7 * DAY) i++;
    if (j - i + 1 > best.count) best = { count: j - i + 1, start: times[i]! };
  }
  if (best.count < MOMENT_RULES.spreeMin) return null;
  const followers = new Set(s.followers.map((a) => a.username));
  const inWeek = s.following.filter((a) => a.followedAt !== null && a.followedAt >= best.start && a.followedAt < best.start + 7 * DAY);
  return { kind: 'follow_spree', at: day(best.start), params: { count: inWeek.length, followedBack: inWeek.filter((a) => followers.has(a.username)).length } };
}

function drops(sorted: readonly Snap[]): Moment[] {
  const out: Moment[] = [];
  for (let k = 1; k < sorted.length; k++) {
    const from = sorted[k - 1]!.followers.length, to = sorted[k]!.followers.length;
    const lost = from - to;
    if (lost >= Math.max(MOMENT_RULES.dropMin, Math.ceil(from * MOMENT_RULES.dropShare))) {
      out.push({ kind: 'drop', at: day(sorted[k]!.exportedAt), params: { from, to, net: -lost, since: day(sorted[k - 1]!.exportedAt) } });
    }
  }
  return out;
}

export function exportMoments(snapshots: readonly Snap[]): Moment[] {
  if (!snapshots.length) return [];
  const sorted = [...snapshots].sort((a, b) => a.exportedAt - b.exportedAt);
  const latest = sorted[sorted.length - 1]!;
  const out: Moment[] = [];
  const tl = growthTimeline(latest);
  const current = day(latest.exportedAt).slice(0, 7);
  // Whole months only: the export month is still running.
  const months = tl.months.filter((m) => m.month < current);

  if (tl.best && tl.best.followers >= MOMENT_RULES.bestMin) out.push({ kind: 'best_month', at: tl.best.month, params: { followers: tl.best.followers } });

  const spikes: Moment[] = [];
  const quiet: Moment[] = [];
  months.forEach((m, i) => {
    const prior = months.slice(Math.max(0, i - 12), i).map((x) => x.followers);
    if (prior.length < 6) return;
    const typical = median(prior)!;
    if (m.followers >= MOMENT_RULES.spikeMin && m.followers >= typical * MOMENT_RULES.spikeTimes && m.month !== tl.best?.month) {
      spikes.push({ kind: 'spike', at: m.month, params: { followers: m.followers, typical: Math.round(typical) } });
    }
  });
  // Quiet months: the last 12 whole months, against the median of those 12.
  const last12 = months.slice(-12);
  const typical12 = median(last12.map((m) => m.followers)) ?? 0;
  if (last12.length >= 6 && typical12 >= MOMENT_RULES.quietTypicalMin) {
    for (const m of last12) {
      if (m.followers <= typical12 * MOMENT_RULES.quietShare) quiet.push({ kind: 'quiet_month', at: m.month, params: { followers: m.followers, typical: Math.round(typical12) } });
    }
  }
  out.push(...spikes.slice(-MOMENT_RULES.maxEach), ...quiet.slice(-MOMENT_RULES.maxEach));

  const s = spree(latest);
  if (s) out.push(s);
  out.push(...drops(sorted).slice(-MOMENT_RULES.maxEach));
  return out.sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0));
}

// Moments from the full export: the post Instagram counted the most reach
// for, the month stories reached the most people, the busiest posting month
// and the longest break in the last year. Numbers and dates only; a format is
// a code (1 photo, 2 carousel, 3 Reel, 4 video), as in the blind spots.
const FORMAT_CODE: Record<string, number> = { photo: 1, carousel: 2, reel: 3, video: 4 };

export function exportContentMoments(content: ContentStats | null, insights: InsightsStats | null): Moment[] {
  const out: Moment[] = [];
  const best = insights?.posts.filter((p) => p.reach !== null).sort((a, b) => b.reach! - a.reach!)[0];
  if (best && (insights?.posts.length ?? 0) >= 3) out.push({ kind: 'best_post', at: best.date, params: { reach: best.reach!, format: FORMAT_CODE[best.format] ?? 1, ...(best.follows !== null ? { follows: best.follows } : {}) } });
  const months = insights?.stories?.byMonth.filter((m) => m.stories >= 4 && m.medianReach !== null) ?? [];
  const top = months.sort((a, b) => b.medianReach! - a.medianReach!)[0];
  if (top && months.length >= 3) out.push({ kind: 'story_best_month', at: top.month, params: { reach: Math.round(top.medianReach!), stories: top.stories } });
  const busiest = content?.byMonth.map((m) => ({ month: m.month, posts: m.photo + m.carousel + m.reel + m.video })).sort((a, b) => b.posts - a.posts)[0];
  if (busiest && busiest.posts >= 4) out.push({ kind: 'busiest_month', at: busiest.month, params: { posts: busiest.posts } });
  if (content?.longestGapFrom && (content.longestGapDays ?? 0) >= 21) out.push({ kind: 'long_break', at: content.longestGapFrom, params: { days: content.longestGapDays! } });
  return out.sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0));
}
