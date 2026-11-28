'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSampleStore } from '@/lib/sample/sampleMode';

// Profiles opened from a results list, per export, kept in this browser only.
// Same storage key as the original results page, so marks carry over.
const keyOf = (snapshotKey: number) => `ig-tracker:visited-rows:${snapshotKey}`;

export function useVisited(snapshotKey: number) {
  // Sample mode: kept in memory only.
  const sample = useSampleStore((s) => s.on);
  const sampleVisited = useSampleStore((s) => s.visited);
  const visitSample = useSampleStore((s) => s.visit);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  useEffect(() => {
    try { const raw = localStorage.getItem(keyOf(snapshotKey)); setVisited(raw ? new Set(JSON.parse(raw) as string[]) : new Set()); } catch { setVisited(new Set()); }
  }, [snapshotKey]);
  const mark = useCallback((username: string) => {
    if (sample) { visitSample(username); return; }
    setVisited((v) => {
      if (v.has(username)) return v;
      const next = new Set(v).add(username);
      try { localStorage.setItem(keyOf(snapshotKey), JSON.stringify([...next])); } catch { /* storage blocked */ }
      return next;
    });
  }, [snapshotKey, sample, visitSample]);
  return { visited: sample ? sampleVisited : visited, mark };
}
