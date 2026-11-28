'use client';

import { useEffect, useMemo, useState } from 'react';
import { platforms as allPlatforms } from '@ig-tracker/core';
import { useSnapshotStore } from '@/lib/store';
import { useSnapshotList, useSnapshotsLoaded } from '@/hooks/useSnapshots';
import { snapshotPlatform, type Platform } from '@/lib/platform';
import { useSampleOn } from '@/lib/sample/sampleMode';
import { getSampleRecords, getSampleSnapshot } from '@/lib/sample/sampleSnapshot';

// The export on screen plus everything Radar, Results and History derive from
// it. Shared by the old /dashboard page and Studio (/app), so both read the
// same local snapshots the same way. Nothing here leaves the browser.
export function useRadarData(userId: string | null) {
  const sample = useSampleOn();
  const storeSnapshot = useSnapshotStore(s => s.currentSnapshot);
  const setSnapshot = useSnapshotStore(s => s.setSnapshot);
  const savedSnapshots = useSnapshotList(userId);
  // Sample mode shows the made-up account's own three exports, never the
  // member's saved ones, so the two are never compared or mixed.
  const snapshots = useMemo(() => (sample ? getSampleRecords() : savedSnapshots), [sample, savedSnapshots]);
  const snapshotsLoaded = useSnapshotsLoaded(userId);
  const [loading, setLoading] = useState(!storeSnapshot);

  // If no in-memory snapshot, load the most recent one from local storage.
  useEffect(() => {
    if (sample || storeSnapshot) { setLoading(false); return; }
    if (!snapshotsLoaded) return; // local store not read yet: keep loading
    // Instagram first: open on the newest Instagram export when there is one,
    // whatever was uploaded last (the switcher shows the other platforms).
    const latest = snapshots.find(s => snapshotPlatform(s.data) === 'instagram') ?? snapshots[0];
    if (latest) setSnapshot(latest.data);
    setLoading(false); // resolved: either we loaded the latest, or there are none
  }, [sample, storeSnapshot, snapshots, snapshotsLoaded, setSnapshot]);

  const snapshot = sample ? getSampleSnapshot() : storeSnapshot;

  // The switcher can select a platform with no data yet (shows an empty
  // panel); otherwise the platform is whatever snapshot is on screen.
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const platform: Platform = selectedPlatform ?? (snapshot ? snapshotPlatform(snapshot) : 'instagram');

  // History-based cards only compare snapshots from the platform on screen.
  const platformSnapshots = useMemo(
    () => snapshots.filter(s => snapshotPlatform(s.data) === platform),
    [snapshots, platform],
  );
  // The newest saved export of this platform that is older than the one on
  // screen, for checks that compare two exports.
  const previousSnapshot = useMemo(() => {
    if (!snapshot) return undefined;
    return platformSnapshots
      .filter(s => s.data.exportedAt < snapshot.exportedAt)
      .sort((a, b) => b.data.exportedAt - a.data.exportedAt)[0]?.data;
  }, [platformSnapshots, snapshot]);

  const emptyPlatforms = allPlatforms.filter(p =>
    !snapshots.some(s => snapshotPlatform(s.data) === p) && !(snapshot && snapshotPlatform(snapshot) === p),
  );
  const switchPlatform = (p: Platform) => {
    setSelectedPlatform(p);
    if (sample) return;
    const latest = snapshots.find(s => snapshotPlatform(s.data) === p);
    if (latest) setSnapshot(latest.data);
  };

  const lists = useMemo(() => {
    if (!snapshot) return { nonFollowers: [], fans: [], mutuals: [] };
    const followerSet = new Set(snapshot.followers.map(f => f.username));
    const followingSet = new Set(snapshot.following.map(f => f.username));
    return {
      nonFollowers: snapshot.following.filter(f => !followerSet.has(f.username)),
      fans: snapshot.followers.filter(f => !followingSet.has(f.username)),
      mutuals: snapshot.following.filter(f => followerSet.has(f.username)),
    };
  }, [snapshot]);

  return {
    loading: sample ? false : loading, snapshot, snapshots, snapshotsLoaded, platform, platformSnapshots, previousSnapshot,
    emptyPlatforms, switchPlatform, onPlatformWithData: !!snapshot && !emptyPlatforms.includes(platform),
    ...lists,
  };
}
