'use client';

import { useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import type { UnfollowPlan } from '@ig-tracker/core';
import { db, type PlanRecord } from '@/lib/db';
import type { Platform } from '@/lib/platform';
import { isSampleOn, useSampleOn, useSampleStore } from '@/lib/sample/sampleMode';

// Sample mode: change the in-memory plan instead of IndexedDB, and say so.
function inSample(fn: (cur: PlanRecord | null) => PlanRecord | null): boolean {
  if (!isSampleOn()) return false;
  const st = useSampleStore.getState();
  st.setPlan(fn(st.plan));
  return true;
}

// The saved unfollow plan for one user and platform (undefined while loading,
// null when there is none). In sample mode the plan lives in memory only.
export function usePlan(owner: string | null, platform: Platform) {
  const sample = useSampleOn();
  const samplePlan = useSampleStore((s) => s.plan);
  const savedPlan = useLiveQuery(
    async () => (owner ? (await db.plans.get([owner, platform])) ?? null : null),
    [owner, platform],
    undefined as PlanRecord | null | undefined,
  );
  const plan = sample ? samplePlan : savedPlan;

  const savePlan = useCallback(async (p: UnfollowPlan) => {
    const now = Date.now();
    if (inSample(() => ({ owner: 'sample', platform, pace: p.pace, cadence: 'off', batches: p.batches, done: [], createdAt: now, updatedAt: now }))) return;
    if (!owner) return;
    await db.plans.put({ owner, platform, pace: p.pace, cadence: 'weekly', batches: p.batches, done: [], createdAt: now, updatedAt: now });
  }, [owner, platform]);

  const toggleDone = useCallback(async (username: string) => {
    if (inSample((cur) => cur && { ...cur, done: cur.done.includes(username) ? cur.done.filter(u => u !== username) : [...cur.done, username] })) return;
    if (!owner) return;
    await db.transaction('rw', db.plans, async () => {
      const cur = await db.plans.get([owner, platform]);
      if (!cur) return;
      const done = cur.done.includes(username) ? cur.done.filter(u => u !== username) : [...cur.done, username];
      await db.plans.update([owner, platform], { done, updatedAt: Date.now() });
    });
  }, [owner, platform]);

  const markBatchDone = useCallback(async (usernames: string[]) => {
    if (inSample((cur) => cur && { ...cur, done: [...new Set([...cur.done, ...usernames])] })) return;
    if (!owner) return;
    await db.transaction('rw', db.plans, async () => {
      const cur = await db.plans.get([owner, platform]);
      if (!cur) return;
      await db.plans.update([owner, platform], { done: [...new Set([...cur.done, ...usernames])], updatedAt: Date.now() });
    });
  }, [owner, platform]);

  const setCadence = useCallback(async (cadence: 'weekly' | 'daily' | 'off') => {
    if (inSample((cur) => cur && { ...cur, cadence })) return;
    if (owner) await db.plans.update([owner, platform], { cadence, updatedAt: Date.now() });
  }, [owner, platform]);

  const deletePlan = useCallback(async () => {
    if (inSample(() => null)) return;
    if (owner) await db.plans.delete([owner, platform]);
  }, [owner, platform]);

  return { plan, savePlan, toggleDone, markBatchDone, setCadence, deletePlan };
}
