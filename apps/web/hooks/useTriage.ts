'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type TriageState, type TriageRecord } from '@/lib/db';
import { readOwnedSnapshots } from '@/hooks/useSnapshots';
import { platformOfTriageKey, snapshotPlatform, triageKeyOf } from '@/lib/platform';
import { useSampleStore } from '@/lib/sample/sampleMode';

export type { TriageState };

export type TriageMap = Map<string, TriageState>;

export function useTriage(snapshotKey: number) {
  const records = useLiveQuery(
    () => db.triageStates.where('snapshotKey').equals(snapshotKey).toArray(),
    [snapshotKey],
    [] as TriageRecord[],
  );

  // Sample mode: marks live in memory only, never in IndexedDB.
  const sample = useSampleStore(s => s.on);
  const sampleMarks = useSampleStore(s => s.marks);
  const markSample = useSampleStore(s => s.mark);
  const triage: TriageMap = sample ? sampleMarks : new Map(records.map(r => [r.username, r.state]));

  const setTriageState = useCallback(
    async (username: string, state: TriageState | null) => {
      if (sample) { markSample(username, state); return; }
      if (state === null) {
        await db.triageStates
          .where('[snapshotKey+username]')
          .equals([snapshotKey, username])
          .delete();
      } else {
        const existing = await db.triageStates
          .where('[snapshotKey+username]')
          .equals([snapshotKey, username])
          .first();
        if (existing?.id != null) {
          await db.triageStates.update(existing.id, { state, updatedAt: Date.now() });
        } else {
          await db.triageStates.add({ snapshotKey, username, state, updatedAt: Date.now() });
        }
      }
    },
    [snapshotKey, sample, markSample],
  );

  const bulkImportTriage = useCallback(
    async (entries: { username: string; state: TriageState }[]) => {
      if (sample) { for (const e of entries) markSample(e.username, e.state); return; }
      const now = Date.now();
      const toAdd: TriageRecord[] = [];
      const toUpdate: { id: number; state: TriageState }[] = [];

      for (const { username, state } of entries) {
        const existing = await db.triageStates
          .where('[snapshotKey+username]')
          .equals([snapshotKey, username])
          .first();
        if (existing?.id != null) {
          toUpdate.push({ id: existing.id, state });
        } else {
          toAdd.push({ snapshotKey, username, state, updatedAt: now });
        }
      }

      await db.transaction('rw', db.triageStates, async () => {
        if (toAdd.length) await db.triageStates.bulkAdd(toAdd);
        for (const { id, state } of toUpdate) {
          await db.triageStates.update(id, { state, updatedAt: now });
        }
      });
    },
    [snapshotKey, sample, markSample],
  );

  return { triage, setTriageState, bulkImportTriage };
}

export interface PriorSnapshotOption {
  snapshotKey: number;
  label: string;
  matchCount: number;
}

export function usePreviousTriage(
  currentSnapshotKey: number,
  usernames: Set<string>,
  currentUserId: string | null,
) {
  const [options, setOptions]           = useState<PriorSnapshotOption[]>([]);
  const [selectedKey, setSelectedKey]   = useState<number | null>(null);
  const [matches, setMatches]           = useState<Map<string, TriageState>>(new Map());
  const [loading, setLoading]           = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);

  // Load all prior snapshots with their match counts
  useEffect(() => {
    if (usernames.size === 0) { setLoading(false); return; }

    async function loadOptions() {
      const owned = await readOwnedSnapshots(currentUserId);
      // Only offer snapshots from the same platform: Instagram and Threads
      // share usernames, but triage decisions don't carry over between them.
      const platform = platformOfTriageKey(currentSnapshotKey);
      const priors = owned.filter(
        s => snapshotPlatform(s.data) === platform && triageKeyOf(s.data) !== currentSnapshotKey,
      );
      if (!priors.length) { setLoading(false); return; }

      const opts: PriorSnapshotOption[] = await Promise.all(
        priors.map(async s => {
          const key = triageKeyOf(s.data);
          const records = await db.triageStates.where('snapshotKey').equals(key).toArray();
          const matchCount = records.filter(r => usernames.has(r.username)).length;
          return { snapshotKey: key, label: s.label, matchCount };
        }),
      );

      const withMatches = opts.filter(o => o.matchCount > 0);
      setOptions(withMatches);
      if (withMatches.length > 0) setSelectedKey(withMatches[0]!.snapshotKey);
      setLoading(false);
    }

    void loadOptions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSnapshotKey, currentUserId]);

  // Load matches whenever selected snapshot changes
  useEffect(() => {
    if (selectedKey === null) { setMatches(new Map()); return; }
    setLoadingMatches(true);

    db.triageStates.where('snapshotKey').equals(selectedKey).toArray().then(records => {
      const map = new Map<string, TriageState>();
      for (const r of records) {
        if (usernames.has(r.username)) map.set(r.username, r.state);
      }
      setMatches(map);
      setLoadingMatches(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey]);

  return { options, selectedKey, setSelectedKey, matches, loading, loadingMatches };
}
