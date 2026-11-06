'use client';

import { useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import type { UnfollowPlan } from '@ig-tracker/core';
import { db, type PlanRecord } from '@/lib/db';
import type { Platform } from '@/lib/platform';

// The saved unfollow plan for one user and platform (undefined while loading,
// null when there is none).
export function usePlan(owner: string | null, platform: Platform) {
  const plan = useLiveQuery(
    async () => (owner ? (await db.plans.get([owner, platform])) ?? null : null),
    [owner, platform],
    undefined as PlanRecord | null | undefined,
  );

  const savePlan = useCallback(async (p: UnfollowPlan) => {
    if (!owner) return;
    const now = Date.now();
    await db.plans.put({ owner, platform, pace: p.pace, batches: p.batches, done: [], createdAt: now, updatedAt: now });
  }, [owner, platform]);

  const toggleDone = useCallback(async (username: string) => {
    if (!owner) return;
    await db.transaction('rw', db.plans, async () => {
      const cur = await db.plans.get([owner, platform]);
      if (!cur) return;
      const done = cur.done.includes(username) ? cur.done.filter(u => u !== username) : [...cur.done, username];
      await db.plans.update([owner, platform], { done, updatedAt: Date.now() });
    });
  }, [owner, platform]);

  const markBatchDone = useCallback(async (usernames: string[]) => {
    if (!owner) return;
    await db.transaction('rw', db.plans, async () => {
      const cur = await db.plans.get([owner, platform]);
      if (!cur) return;
      await db.plans.update([owner, platform], { done: [...new Set([...cur.done, ...usernames])], updatedAt: Date.now() });
    });
  }, [owner, platform]);

  const deletePlan = useCallback(async () => {
    if (owner) await db.plans.delete([owner, platform]);
  }, [owner, platform]);

  return { plan, savePlan, toggleDone, markBatchDone, deletePlan };
}
