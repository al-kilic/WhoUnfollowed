import { snapshotPlatform, type ParsedSnapshot, type Platform } from '@ig-tracker/core';

export { snapshotPlatform };
export type { Platform };

// Brand names, never translated.
export const PLATFORM_NAME: Record<Platform, string> = {
  instagram: 'Instagram',
  threads: 'Threads',
  tiktok: 'TikTok',
};

// Only Instagram exports carry the follow requests you sent.
export function hasPendingRequests(platform: Platform): boolean {
  return platform === 'instagram';
}

// Triage states are keyed by a snapshot's exportedAt. An Instagram and a
// Threads export from the same day share that timestamp (and usually the same
// usernames), so each platform gets its own number range without a Dexie
// schema migration: Instagram keeps exportedAt (positive), Threads uses the
// negated value (down to about -4.3e9 for any 32-bit timestamp), and TikTok is
// shifted below that, at -(exportedAt + 1e10).
const TIKTOK_KEY_OFFSET = 1e10;

export function triageKeyOf(snapshot: Pick<ParsedSnapshot, 'exportedAt' | 'platform'>): number {
  const p = snapshotPlatform(snapshot);
  if (p === 'threads') return -snapshot.exportedAt;
  if (p === 'tiktok') return -(snapshot.exportedAt + TIKTOK_KEY_OFFSET);
  return snapshot.exportedAt;
}

export function platformOfTriageKey(key: number): Platform {
  if (key <= -TIKTOK_KEY_OFFSET) return 'tiktok';
  return key < 0 ? 'threads' : 'instagram';
}

// Which app a profile link points to. Account rows only carry the href, so
// this lets shared list components label links without extra props.
export function platformOfHref(href: string): Platform {
  if (/^https:\/\/www\.tiktok\.com\//i.test(href)) return 'tiktok';
  return /^https:\/\/www\.threads\.(?:com|net)\//i.test(href) ? 'threads' : 'instagram';
}

// Fills the `{app}` placeholder used in platform-neutral copy.
export function withApp(text: string, platform: Platform): string {
  return text.replaceAll('{app}', PLATFORM_NAME[platform]);
}

// Profile link for a bare username (for lists that only stored usernames).
export function profileHref(platform: Platform, username: string): string {
  const u = encodeURIComponent(username);
  if (platform === 'tiktok') return `https://www.tiktok.com/@${u}`;
  if (platform === 'threads') return `https://www.threads.com/@${u}`;
  return `https://www.instagram.com/${u}`;
}
