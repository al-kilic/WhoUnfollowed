'use client';

import { useCallback, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type StarRecord } from '@/lib/db';
import type { Platform } from '@/lib/platform';

// Starred accounts for one user and platform, live from IndexedDB.
export function useStars(owner: string | null, platform: Platform) {
  const records = useLiveQuery(
    () => (owner ? db.stars.where('[owner+platform]').equals([owner, platform]).toArray() : Promise.resolve([] as StarRecord[])),
    [owner, platform],
    [] as StarRecord[],
  );
  const stars = useMemo(() => new Set(records.map(r => r.username)), [records]);

  const toggleStar = useCallback(async (username: string) => {
    if (!owner) return;
    const existing = await db.stars.where('[owner+platform+username]').equals([owner, platform, username]).first();
    if (existing?.id != null) await db.stars.delete(existing.id);
    else await db.stars.add({ owner, platform, username, createdAt: Date.now() });
  }, [owner, platform]);

  return { stars, toggleStar };
}
