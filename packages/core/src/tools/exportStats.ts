import { analyzeSnapshot } from '../diff.js';
import { snapshotPlatform, type ParsedSnapshot } from '../schemas.js';
import type { ExportStats } from '../aiSchemas.js';
import { radarFacts } from './radarFacts.js';

// Reduces one export to numbers for the Pro AI stats ledger. Runs in the
// browser; the result is the only thing about an export that reaches the
// server. No usernames, no per-account dates.

const DAY = 86_400;

function monthKey(sec: number): string {
  const d = new Date(sec * 1000);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

// Share of accounts you followed in [from, to) that follow you back. Null when
// there were fewer than 5 such follows: too few to say anything.
function followBackRate(snapshot: ParsedSnapshot, followerSet: Set<string>, from: number, to: number): number | null {
  const followed = snapshot.following.filter((a) => a.followedAt !== null && a.followedAt >= from && a.followedAt < to);
  if (followed.length < 5) return null;
  const back = followed.filter((a) => followerSet.has(a.username)).length;
  return Math.round((back / followed.length) * 1000) / 1000;
}

// `previous`: the export before this one (same platform), for the facts that
// compare two exports.
export function exportStats(snapshot: ParsedSnapshot, previous?: ParsedSnapshot): ExportStats {
  const a = analyzeSnapshot(snapshot);
  const followerSet = new Set(snapshot.followers.map((f) => f.username));
  const end = snapshot.exportedAt;
  const since = end - 730 * DAY;

  const newFollowersByMonth: Record<string, number> = {};
  for (const f of snapshot.followers) {
    if (f.followedAt === null || f.followedAt < since || f.followedAt > end) continue;
    const k = monthKey(f.followedAt);
    newFollowersByMonth[k] = (newFollowersByMonth[k] ?? 0) + 1;
  }

  return {
    platform: snapshotPlatform(snapshot),
    exportedAt: end,
    followers: a.totalFollowers,
    following: a.totalFollowing,
    mutuals: a.mutuals.length,
    nonFollowers: a.nonFollowers.length,
    fans: a.fans.length,
    newFollowersByMonth,
    followBackRate12m: followBackRate(snapshot, followerSet, end - 365 * DAY, end + 1),
    followBackRatePrev12m: followBackRate(snapshot, followerSet, end - 730 * DAY, end - 365 * DAY),
    pendingRequests: snapshot.pendingRequests ? snapshot.pendingRequests.length : null,
    facts: radarFacts(snapshot, previous, end),
  };
}
