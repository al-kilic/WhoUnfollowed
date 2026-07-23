'use client';

import { useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { format } from 'date-fns';
import type { ParsedSnapshot } from '@ig-tracker/core';
import { db, type SnapshotRecord } from '@/lib/db';
import { getOrCreateAnonSessionId, isOwnedByCurrentViewer } from '@/lib/localOwnership';
export type { SnapshotRecord };

export const FREE_SNAPSHOT_LIMIT = 1;

// One-time backfill for snapshots saved before ownership scoping existed
// (both ownerUserId and anonSessionId are `undefined`, not `null`). Assigns
// them to whoever is currently using the browser, logged in or anonymous, so
// existing users don't lose sight of their own pre-existing history the
// moment this ships. Safe to call on every load: it's a no-op once every
// record has been tagged.
async function migrateLegacyOwnership(currentUserId: string | null): Promise<void> {
  const legacy = await db.snapshots
    .filter(r => r.ownerUserId === undefined && r.anonSessionId === undefined)
    .toArray();
  if (legacy.length === 0) return;
  const anonId = getOrCreateAnonSessionId();
  await Promise.all(
    legacy.map(r =>
      r.id != null
        ? db.snapshots.update(r.id, currentUserId
            ? { ownerUserId: currentUserId, anonSessionId: null }
            : { ownerUserId: null, anonSessionId: anonId })
        : Promise.resolve(),
    ),
  );
}

// Called once right when a login/signup completes in the current browser
// session. Anonymous snapshots created earlier in this same session (before
// the account existed) become permanently owned by the new account, so the
// "upload, then sign up" flow doesn't lose the work. Anonymous data from any
// other session never matches (different anonSessionId), so it's never
// claimed by someone else logging in later.
export async function claimAnonymousSnapshots(userId: string): Promise<number> {
  const anonId = getOrCreateAnonSessionId();
  const unclaimed = await db.snapshots
    .filter(r => r.ownerUserId == null && r.anonSessionId === anonId)
    .toArray();
  await Promise.all(
    unclaimed.map(r =>
      r.id != null ? db.snapshots.update(r.id, { ownerUserId: userId, anonSessionId: null }) : Promise.resolve(),
    ),
  );
  return unclaimed.length;
}

export function useSnapshotList(currentUserId: string | null): SnapshotRecord[] {
  // The one-time legacy backfill MUST run outside the liveQuery querier below.
  // Dexie 4 throws ReadOnlyError ("Readwrite transaction in liveQuery context")
  // if any write happens inside a live query, which white-screened the homepage
  // for every returning user who had pre-ownership snapshots. Run it imperatively
  // instead; its writes still trigger the liveQuery below to re-run and surface
  // the now-tagged records.
  useEffect(() => {
    void migrateLegacyOwnership(currentUserId).catch(() => {});
  }, [currentUserId]);

  return useLiveQuery(
    async () => {
      // Read-only: never write here (see migrateLegacyOwnership note above).
      // Defensive fallback keeps a Dexie failure from crashing the whole page.
      try {
        const all = await db.snapshots.orderBy('exportedAt').reverse().toArray();
        return all.filter(r => isOwnedByCurrentViewer(r, currentUserId));
      } catch {
        return [] as SnapshotRecord[];
      }
    },
    [currentUserId],
    [],
  ) ?? [];
}

// True once the local snapshot store has been read at least once.
// useLiveQuery returns `undefined` until its first query resolves, which lets
// callers tell "still loading" apart from "loaded and genuinely empty".
export function useSnapshotsLoaded(currentUserId: string | null): boolean {
  return useLiveQuery(
    async () => {
      const all = await db.snapshots.toArray();
      return all.filter(r => isOwnedByCurrentViewer(r, currentUserId)).length;
    },
    [currentUserId],
  ) !== undefined;
}

export async function saveSnapshot(data: ParsedSnapshot, currentUserId: string | null, label?: string): Promise<number> {
  const autoLabel = `Upload ${format(new Date(data.exportedAt * 1000), 'MMM d, yyyy HH:mm')}`;
  return db.snapshots.add({
    label: label ?? autoLabel,
    exportedAt: data.exportedAt,
    savedAt: Math.floor(Date.now() / 1000),
    data,
    ownerUserId: currentUserId,
    anonSessionId: currentUserId ? null : getOrCreateAnonSessionId(),
  });
}

export async function deleteSnapshot(id: number, currentUserId: string | null): Promise<void> {
  const record = await db.snapshots.get(id);
  if (!record || !isOwnedByCurrentViewer(record, currentUserId)) return;
  return db.snapshots.delete(id);
}

// Ownership-checked: returns undefined (not someone else's data) if the
// record isn't owned by whoever is currently using the browser, even if the
// numeric id is guessed or reused from an old URL (e.g. /diff?old=1&current=2).
export async function getSnapshot(id: number, currentUserId: string | null): Promise<SnapshotRecord | undefined> {
  const record = await db.snapshots.get(id);
  if (!record || !isOwnedByCurrentViewer(record, currentUserId)) return undefined;
  return record;
}

export async function updateSnapshotLabel(id: number, label: string, currentUserId: string | null): Promise<void> {
  const record = await db.snapshots.get(id);
  if (!record || !isOwnedByCurrentViewer(record, currentUserId)) return;
  await db.snapshots.update(id, { label });
}

export async function redateSnapshot(id: number, oldExportedAt: number, newExportedAt: number, currentUserId: string | null): Promise<void> {
  const record = await db.snapshots.get(id);
  if (!record || !isOwnedByCurrentViewer(record, currentUserId)) return;
  await db.transaction('rw', db.snapshots, db.triageStates, async () => {
    await db.snapshots.update(id, { exportedAt: newExportedAt });
    const records = await db.triageStates.where('snapshotKey').equals(oldExportedAt).toArray();
    for (const r of records) {
      if (r.id != null) await db.triageStates.update(r.id, { snapshotKey: newExportedAt });
    }
  });
}

export async function setSnapshotCloudId(id: number, cloudId: string): Promise<void> {
  await db.snapshots.update(id, { cloudId });
}

// Pulls a snapshot that exists in cloud storage but not in this browser's local
// IndexedDB (e.g. same account opened in a different browser, or local storage
// was cleared) back into the local store. Sets cloudId immediately so it isn't
// offered for restore again and won't get re-uploaded as a duplicate. Cloud
// restore always happens while logged in (cloud sync is Pro/account-gated),
// so the restored record is owned outright, not anonymous.
export async function restoreSnapshot(
  data: ParsedSnapshot,
  label: string,
  exportedAt: number,
  cloudId: string,
  currentUserId: string,
): Promise<number> {
  return db.snapshots.add({
    label,
    exportedAt,
    savedAt: Math.floor(Date.now() / 1000),
    data,
    cloudId,
    ownerUserId: currentUserId,
    anonSessionId: null,
  });
}
