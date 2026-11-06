// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import type { Account, ParsedSnapshot } from '../schemas.js';

// The 3-month wrap: what happened in the three calendar months up to an
// export, from the follow dates already inside it (one export is enough).
// With a previous export it also counts who left since then. Aggregates
// only, never a username, so the whole wrap is safe to show and share free.

export const WRAP_MONTHS = 3;
// A wrap auto-plays again once an export is at least this much newer than the
// one the last wrap was shown for.
export const WRAP_REPLAY_DAYS = 80;

const DAY = 86400;

export interface QuarterWrap {
  start: number; // epoch seconds, inclusive
  end: number; // epoch seconds (the export date), exclusive
  arrived: number; // current followers who followed you inside the window
  arrivedBefore: number; // same, for the 3 months before the window
  arrivedMutual: number; // of `arrived`, how many you follow back
  weeks: number[]; // arrivals per week across the window, oldest first
  bestWeek: { start: string; count: number } | null; // start as YYYY-MM-DD
  followsMade: number; // accounts you followed inside the window (still followed)
  followsBack: number; // of those, how many follow you
  spree: { date: string; count: number } | null; // busiest follow day, 5+
  // Only with a previous export of the same platform.
  sincePrevious?: { date: string; gained: number; lost: number } | undefined;
}

export interface QuarterWrapInput {
  current: Pick<ParsedSnapshot, 'followers' | 'following' | 'exportedAt'>;
  previous?: Pick<ParsedSnapshot, 'followers' | 'exportedAt'> | undefined;
  timeZone?: string;
}

// Same day of month, `months` earlier, in UTC (clamped to the month's end).
export function monthsBefore(ts: number, months: number): number {
  const d = new Date(ts * 1000);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() - months;
  const last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  return Date.UTC(y, m, Math.min(d.getUTCDate(), last), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()) / 1000;
}

export function shouldAutoPlayWrap(seenExportedAt: number | null, exportedAt: number): boolean {
  return seenExportedAt === null || exportedAt >= seenExportedAt + WRAP_REPLAY_DAYS * DAY;
}

const inWindow = (a: Account, start: number, end: number): a is Account & { followedAt: number } =>
  a.followedAt !== null && a.followedAt >= start && a.followedAt < end;

export function quarterWrap({ current, previous, timeZone = 'UTC' }: QuarterWrapInput): QuarterWrap | null {
  let tz = timeZone;
  try { new Intl.DateTimeFormat('en-CA', { timeZone: tz }); } catch { tz = 'UTC'; }
  const toDay = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' });
  const day = (ts: number) => toDay.format(new Date(ts * 1000));

  const end = current.exportedAt;
  const start = monthsBefore(end, WRAP_MONTHS);
  const before = monthsBefore(start, WRAP_MONTHS);
  const followerSet = new Set(current.followers.map(a => a.username));
  const followingSet = new Set(current.following.map(a => a.username));

  const arrivedList = current.followers.filter(a => inWindow(a, start, end));
  const arrivedBefore = current.followers.filter(a => inWindow(a, before, start)).length;
  const madeList = current.following.filter(a => inWindow(a, start, end));

  let sincePrevious: QuarterWrap['sincePrevious'];
  if (previous && previous.exportedAt < current.exportedAt) {
    const prev = new Set(previous.followers.map(a => a.username));
    sincePrevious = {
      date: day(previous.exportedAt),
      gained: [...followerSet].filter(u => !prev.has(u)).length,
      lost: [...prev].filter(u => !followerSet.has(u)).length,
    };
  }

  if (arrivedList.length === 0 && madeList.length === 0 && !sincePrevious) return null;

  const nWeeks = Math.ceil((end - start) / (7 * DAY));
  const weeks = new Array<number>(nWeeks).fill(0);
  for (const a of arrivedList) weeks[Math.min(nWeeks - 1, Math.floor((a.followedAt - start) / (7 * DAY)))]!++;
  const top = Math.max(...weeks);
  const bestWeek = top > 0 ? { start: day(start + weeks.indexOf(top) * 7 * DAY), count: top } : null;

  const byDay = new Map<string, number>();
  for (const a of madeList) { const d = day(a.followedAt); byDay.set(d, (byDay.get(d) ?? 0) + 1); }
  let spree: QuarterWrap['spree'] = null;
  for (const [date, count] of byDay) if (count >= 5 && (!spree || count > spree.count || (count === spree.count && date < spree.date))) spree = { date, count };

  return {
    start,
    end,
    arrived: arrivedList.length,
    arrivedBefore,
    arrivedMutual: arrivedList.filter(a => followingSet.has(a.username)).length,
    weeks,
    bestWeek,
    followsMade: madeList.length,
    followsBack: madeList.filter(a => followerSet.has(a.username)).length,
    spree,
    sincePrevious,
  };
}
