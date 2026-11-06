// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import type { Account, ParsedSnapshot } from '../schemas.js';
import { growthTimeline } from './growthTimeline.js';

// Curiosities: small, surprising facts pulled from one export (plus the
// previous one, when there is one). Aggregates only: counts, dates and
// percentages, never a username, so they are safe to show on the free view.
// Each fact only appears when the export has enough data to back it.

export type CuriosityId =
  | 'since_last'
  | 'best_month'
  | 'arrival_weekday'
  | 'first_follower'
  | 'longest_wait'
  | 'recent_share'
  | 'follow_spree'
  | 'fans';

export interface Curiosity {
  id: CuriosityId;
  params: Record<string, number | string>;
  // Optional mini chart: values in display order, plus the index to accent.
  series?: number[];
  highlight?: number;
}

export interface CuriosityInput {
  current: Pick<ParsedSnapshot, 'followers' | 'following' | 'exportedAt'>;
  previous?: Pick<ParsedSnapshot, 'followers'> | undefined;
  // IANA zone for day-based facts (weekday, busiest day). Defaults to UTC.
  timeZone?: string;
}

const DAY = 86400;
const SPARK_MONTHS = 36;
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function dayFormatter(timeZone: string) {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' });
}

function weekdayIndex(ts: number, fmt: Intl.DateTimeFormat): number {
  return WEEKDAYS.indexOf(fmt.format(new Date(ts * 1000)));
}

const dated = (list: Account[]) => list.filter((a): a is Account & { followedAt: number } => a.followedAt !== null);

export function curiosities({ current, previous, timeZone = 'UTC' }: CuriosityInput): Curiosity[] {
  const out: Curiosity[] = [];
  const followerSet = new Set(current.followers.map(a => a.username));
  const followingSet = new Set(current.following.map(a => a.username));
  const datedFollowers = dated(current.followers);
  let tz = timeZone;
  try { dayFormatter(tz); } catch { tz = 'UTC'; }
  const toDay = dayFormatter(tz);

  if (previous) {
    const prev = new Set(previous.followers.map(a => a.username));
    const lost = [...prev].filter(u => !followerSet.has(u)).length;
    const gained = [...followerSet].filter(u => !prev.has(u)).length;
    out.push({ id: 'since_last', params: { gained, lost, net: gained - lost } });
  }

  const timeline = growthTimeline(current);
  if (timeline.best && timeline.best.followers >= 2 && timeline.months.length >= 3) {
    const window = timeline.months.slice(-SPARK_MONTHS);
    const idx = window.findIndex(m => m.month === timeline.best!.month);
    out.push({
      id: 'best_month',
      params: { month: timeline.best.month, count: timeline.best.followers },
      series: window.map(m => m.followers),
      ...(idx >= 0 ? { highlight: idx } : {}),
    });
  }

  if (datedFollowers.length >= 20) {
    const fmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short' });
    const counts = [0, 0, 0, 0, 0, 0, 0];
    for (const a of datedFollowers) {
      const i = weekdayIndex(a.followedAt, fmt);
      if (i >= 0) counts[i]!++;
    }
    const top = counts.indexOf(Math.max(...counts));
    out.push({
      id: 'arrival_weekday',
      params: { weekday: top, pct: Math.round((counts[top]! / datedFollowers.length) * 100) },
      series: counts,
      highlight: top,
    });
  }

  if (datedFollowers.length > 0) {
    const first = datedFollowers.reduce((a, b) => (a.followedAt <= b.followedAt ? a : b));
    out.push({
      id: 'first_follower',
      params: { date: toDay.format(new Date(first.followedAt * 1000)), years: Math.floor((current.exportedAt - first.followedAt) / (365 * DAY)) },
    });
  }

  const waiting = dated(current.following.filter(a => !followerSet.has(a.username)));
  if (waiting.length > 0) {
    const oldest = Math.min(...waiting.map(a => a.followedAt));
    const days = Math.floor((current.exportedAt - oldest) / DAY);
    if (days >= 1) out.push({ id: 'longest_wait', params: { days, count: waiting.length } });
  }

  if (datedFollowers.length >= 10) {
    const yearAgo = current.exportedAt - 365 * DAY;
    const recent = datedFollowers.filter(a => a.followedAt >= yearAgo).length;
    out.push({ id: 'recent_share', params: { pct: Math.round((recent / datedFollowers.length) * 100), count: recent } });
  }

  const byDay = new Map<string, number>();
  for (const a of dated(current.following)) {
    const d = toDay.format(new Date(a.followedAt * 1000));
    byDay.set(d, (byDay.get(d) ?? 0) + 1);
  }
  let spree: [string, number] | null = null;
  for (const entry of byDay) if (!spree || entry[1] > spree[1] || (entry[1] === spree[1] && entry[0] < spree[0])) spree = entry;
  if (spree && spree[1] >= 10) out.push({ id: 'follow_spree', params: { date: spree[0], count: spree[1] } });

  const fans = current.followers.filter(a => !followingSet.has(a.username)).length;
  if (fans > 0 && current.followers.length > 0) {
    out.push({ id: 'fans', params: { count: fans, pct: Math.round((fans / current.followers.length) * 100) } });
  }

  return out;
}
