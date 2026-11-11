import type { ParsedSnapshot } from '@ig-tracker/core';
import { snapshotPlatform } from '@/lib/platform';

const DAY = 86_400;

// True when a new upload is the same export as one already saved. People
// often upload the same ZIP twice in a row; that should just reopen the
// results, not ask them to delete their saved snapshot or count as a new
// export.
//
// The export date comes from the ZIP's file name. A renamed file has no date,
// so the parser stamps "now" and the same file gets a new date on every
// upload. For that case: less than a day apart and identical lists.
export function isSameExport(a: ParsedSnapshot, b: ParsedSnapshot): boolean {
  if (snapshotPlatform(a) !== snapshotPlatform(b)) return false;
  if (a.followers.length !== b.followers.length || a.following.length !== b.following.length) return false;
  if (a.exportedAt === b.exportedAt) return true;
  return Math.abs(a.exportedAt - b.exportedAt) < DAY
    && sameUsernames(a.followers, b.followers)
    && sameUsernames(a.following, b.following);
}

function sameUsernames(a: { username: string }[], b: { username: string }[]): boolean {
  const set = new Set(a.map(x => x.username));
  return b.every(x => set.has(x.username));
}
