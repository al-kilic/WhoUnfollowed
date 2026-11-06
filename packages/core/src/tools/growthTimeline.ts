// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import type { Account, ParsedSnapshot } from '../schemas.js';

// When your current followers arrived, month by month, from the follow dates
// already in one export. It only counts people who still follow you (the
// export has no record of those who left), so it is "when today's audience
// found you", not a full history. HTML exports have no dates and return an
// empty timeline.

export interface TimelineMonth {
  month: string; // "2024-07"
  followers: number; // current followers who followed you that month
  following: number; // accounts you followed that month (still followed)
}

export interface GrowthTimeline {
  months: TimelineMonth[]; // continuous, oldest first, no gaps
  best: TimelineMonth | null;
  dated: number; // followers with a follow date
  undated: number; // followers without one
  // Share of today's followers who arrived in the last 12 months (0-1).
  lastYearShare: number;
}

const monthKey = (ts: number) => new Date(ts * 1000).toISOString().slice(0, 7);

function nextMonth(key: string): string {
  const [y, m] = key.split('-').map(Number) as [number, number];
  return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`;
}

function countByMonth(accounts: Account[]): Map<string, number> {
  const out = new Map<string, number>();
  for (const a of accounts) {
    if (a.followedAt === null) continue;
    const k = monthKey(a.followedAt);
    out.set(k, (out.get(k) ?? 0) + 1);
  }
  return out;
}

export function growthTimeline(snapshot: Pick<ParsedSnapshot, 'followers' | 'following' | 'exportedAt'>): GrowthTimeline {
  const f = countByMonth(snapshot.followers);
  const g = countByMonth(snapshot.following);
  const dated = snapshot.followers.filter(a => a.followedAt !== null).length;
  const undated = snapshot.followers.length - dated;
  const keys = [...f.keys(), ...g.keys()].sort();
  if (keys.length === 0) return { months: [], best: null, dated, undated, lastYearShare: 0 };

  const end = monthKey(snapshot.exportedAt);
  const last = keys[keys.length - 1]! > end ? keys[keys.length - 1]! : end;
  const months: TimelineMonth[] = [];
  // Capped at 25 years of months so a bogus 1970 date can't build a huge array.
  for (let k = keys[0]!, i = 0; k <= last && i < 300; k = nextMonth(k), i++) {
    months.push({ month: k, followers: f.get(k) ?? 0, following: g.get(k) ?? 0 });
  }

  let best: TimelineMonth | null = null;
  for (const m of months) if (m.followers > 0 && (!best || m.followers > best.followers)) best = m;

  const yearAgo = snapshot.exportedAt - 365 * 86400;
  const recent = snapshot.followers.filter(a => a.followedAt !== null && a.followedAt >= yearAgo).length;
  return { months, best, dated, undated, lastYearShare: dated === 0 ? 0 : recent / dated };
}
