'use client';

import { RefreshCw } from 'lucide-react';
import type { ParsedSnapshot } from '@ig-tracker/core';
import { PlatformIcon } from '@/components/PlatformIcon';
import { PLATFORM_NAME, snapshotPlatform } from '@/lib/platform';
import { newerPlatform } from '@/lib/newerPlatform';
import { useShownPlatform } from '@/hooks/useShownPlatform';
import { useStudio } from '../StudioContext';
import { getScopeContent } from '../platformScope.content';

// Today opens on Instagram. When another platform has a newer export, say so
// once in a quiet line with a one-click switch (nothing changes on its own).
export function TodayNewer({ snapshot }: { snapshot: ParsedSnapshot }) {
  const { locale, userId } = useStudio();
  const t = getScopeContent(locale);
  const shown = useShownPlatform(userId);
  if (shown.sample) return null;
  const here = snapshotPlatform(snapshot);
  const newer = newerPlatform(new Map([...shown.newest].map(([p, r]) => [p, r.data.exportedAt])), here, snapshot.exportedAt);
  if (!newer) return null;
  const name = PLATFORM_NAME[newer];
  const target = newer;
  return (
    <div className="s-nextci" role="note" style={{ marginBottom: 12 }}>
      <PlatformIcon platform={target} size={15} />
      <span style={{ flex: 1 }}>{t.newer(name)}</span>
      <button type="button" className="s-btn sec xs" onClick={() => shown.switchTo(target)}><RefreshCw size={13} />{t.show(name)}</button>
    </div>
  );
}
