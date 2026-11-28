'use client';

import { useMemo } from 'react';
import { useSnapshotStore } from '@/lib/store';
import { useSnapshotList } from '@/hooks/useSnapshots';
import { snapshotPlatform, type Platform } from '@/lib/platform';
import { useSampleOn } from '@/lib/sample/sampleMode';

// The platform Studio is showing right now (the export on screen, Instagram
// when none), which platforms have a saved export, and a one-click switch.
// Everything here is local: snapshots never leave the browser.
export function useShownPlatform(userId: string | null) {
  const sample = useSampleOn();
  const current = useSnapshotStore((s) => s.currentSnapshot);
  const setSnapshot = useSnapshotStore((s) => s.setSnapshot);
  const saved = useSnapshotList(userId);
  const platform: Platform = sample || !current ? 'instagram' : snapshotPlatform(current);
  const withData = useMemo(() => new Set(saved.map((s) => snapshotPlatform(s.data))), [saved]);
  // The newest export of each platform (snapshots come newest first).
  const newest = useMemo(() => {
    const m = new Map<Platform, (typeof saved)[number]>();
    for (const s of saved) { const p = snapshotPlatform(s.data); if (!m.has(p)) m.set(p, s); }
    return m;
  }, [saved]);
  const switchTo = (p: Platform) => { const s = newest.get(p); if (s) setSnapshot(s.data); };
  return { platform, sample, hasData: (p: Platform) => sample ? p === 'instagram' : withData.has(p), newest, switchTo };
}
