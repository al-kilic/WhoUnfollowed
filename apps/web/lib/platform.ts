import { snapshotPlatform, type ParsedSnapshot, type Platform } from '@ig-tracker/core';

export { snapshotPlatform };
export type { Platform };

// Brand names, never translated.
export const PLATFORM_NAME: Record<Platform, string> = {
  instagram: 'Instagram',
  threads: 'Threads',
};

// Triage states are keyed by a snapshot's exportedAt. An Instagram and a
// Threads export from the same day share that timestamp (and usually the same
// usernames), so Threads snapshots use the negated value to keep their triage
// separate without a Dexie schema migration.
export function triageKeyOf(snapshot: Pick<ParsedSnapshot, 'exportedAt' | 'platform'>): number {
  return snapshotPlatform(snapshot) === 'threads' ? -snapshot.exportedAt : snapshot.exportedAt;
}

export function platformOfTriageKey(key: number): Platform {
  return key < 0 ? 'threads' : 'instagram';
}

// Which app a profile link points to. Account rows only carry the href, so
// this lets shared list components label links without extra props.
export function platformOfHref(href: string): Platform {
  return /^https:\/\/www\.threads\.(?:com|net)\//i.test(href) ? 'threads' : 'instagram';
}

// Fills the `{app}` placeholder used in platform-neutral copy.
export function withApp(text: string, platform: Platform): string {
  return text.replaceAll('{app}', PLATFORM_NAME[platform]);
}
