// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { snapshotPlatform, type ParsedSnapshot } from './schemas.js';

export type DeltaReason =
  | 'small_counts'          // Signal B1: both follower+following counts suspiciously small
  | 'all_recent_timestamps' // Signal B2: all timestamps within last 14 days
  | 'massive_count_drop'    // Signal C: dropped 80%+ vs previous snapshot
  | 'limited_date_range';   // Signal D: no follower older than about a year

export interface DeltaDetectionResult {
  isDelta: boolean;
  reasons: DeltaReason[];
}

const SMALL_COUNT_THRESHOLD  = 50;
const RECENT_WINDOW_DAYS     = 14;
const DROP_THRESHOLD         = 0.80; // 80% drop triggers C
// Meta's export form offers Last week/month/3 months/6 months/year or All
// time, and the follower and following lists only contain follows made inside
// the chosen range. "Last year" plus a few days of slack for the export date.
const DATE_RANGE_WINDOW_DAYS = 370;
const DATE_RANGE_MIN_FOLLOWERS = 20;
// Real Threads accounts are often small and only recently active, so D needs
// a bigger list before it trusts a missing tail there (B1 skips Threads too).
const DATE_RANGE_MIN_FOLLOWERS_THREADS = 50;

export function detectDeltaExport(
  snapshot: ParsedSnapshot,
  previousSnapshot?: ParsedSnapshot,
): DeltaDetectionResult {
  const reasons: DeltaReason[] = [];
  // Measured from the export date, not today: people upload older ZIPs.
  const recentCutoff = snapshot.exportedAt - RECENT_WINDOW_DAYS * 86400;

  // Signal B1: follower count suspiciously small
  // Following can be large even in delta exports (Instagram sometimes sends the full
  // following list), so we check followers alone — a delta has only new followers.
  // Skipped for Threads: Threads accounts are routinely this small for real,
  // so the signal would fire on nearly every genuine full export.
  if (snapshotPlatform(snapshot) === 'instagram' && snapshot.followers.length < SMALL_COUNT_THRESHOLD) {
    reasons.push('small_counts');
  }

  // Signal B2: all follow timestamps are within the last 14 days
  // Only fires when there are enough entries to be meaningful (avoid triggering on empty lists)
  const withTimestamp = [
    ...snapshot.followers.filter(a => a.followedAt !== null),
    ...snapshot.following.filter(a => a.followedAt !== null),
  ];
  if (withTimestamp.length >= 3) {
    const allRecent = withTimestamp.every(a => (a.followedAt ?? 0) >= recentCutoff);
    if (allRecent) reasons.push('all_recent_timestamps');
  }

  // Signal D: no follower older than about a year. An export made with a
  // date range shorter than All time drops everyone who followed the user
  // before the cutoff, so they wrongly show up as not following back. Judged
  // on followers alone because a trimmed followers list causes the damage
  // whether or not the following list was trimmed too. Fully recent exports
  // are already covered by B2. A real account under a year old also trips
  // this; the warning lets them go on.
  const datedFollowers = snapshot.followers.filter(a => a.followedAt !== null);
  const minFollowers = snapshotPlatform(snapshot) === 'threads' ? DATE_RANGE_MIN_FOLLOWERS_THREADS : DATE_RANGE_MIN_FOLLOWERS;
  if (
    !reasons.includes('all_recent_timestamps') &&
    datedFollowers.length >= minFollowers &&
    datedFollowers.length >= snapshot.followers.length * 0.9
  ) {
    const oldest = datedFollowers.reduce((min, a) => Math.min(min, a.followedAt ?? Infinity), Infinity);
    if (snapshot.exportedAt - oldest <= DATE_RANGE_WINDOW_DAYS * 86400) {
      reasons.push('limited_date_range');
    }
  }

  // Signal C: count dropped 80%+ vs previous snapshot
  if (previousSnapshot) {
    const prevCount = previousSnapshot.followers.length;
    const newCount  = snapshot.followers.length;
    if (prevCount > 0 && newCount < prevCount * (1 - DROP_THRESHOLD)) {
      reasons.push('massive_count_drop');
    }
  }

  return { isDelta: reasons.length > 0, reasons };
}