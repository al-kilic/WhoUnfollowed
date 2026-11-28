'use client';

import type { ReactNode } from 'react';
import { platforms as allPlatforms } from '@ig-tracker/core';
import { PlatformSwitcher } from '@/components/PlatformSwitcher';
import { getDashboardContent } from '@/app/[locale]/dashboard/content';
import { PlatformEmptyPanel } from '@/app/[locale]/dashboard/PlatformEmptyPanel';
import { useRadarData } from '@/hooks/useRadarData';
import type { ParsedSnapshot } from '@ig-tracker/core';
import { useStudio } from '../StudioContext';
import { PageHead } from '../PageHead';
import { StudioEmpty, StudioLoading } from '../StudioStates';

export type RadarData = ReturnType<typeof useRadarData> & { snapshot: ParsedSnapshot };

// Every Radar page: loads the export on screen, handles the empty and loading
// states and the platform switcher, then renders the page body.
export function RadarGate({ title, sub, children }: { title: string; sub: string; children: (d: RadarData) => ReactNode }) {
  const { userId, locale } = useStudio();
  const data = useRadarData(userId);
  const dc = getDashboardContent(locale);

  // The header stays put while the export loads, so switching between pages
  // of a section (Results > List and History) never shifts the layout.
  if (data.loading) return <><PageHead title={title} sub={sub} /><StudioLoading /></>;
  if (!data.snapshot) return <StudioEmpty />;

  const switcher = (
    <PlatformSwitcher options={allPlatforms} active={data.platform} onChange={data.switchPlatform}
      ariaLabel={dc.header.platformSwitcherLabel} empty={data.emptyPlatforms} />
  );
  return (
    <>
      <PageHead title={title} sub={sub} actions={switcher} />
      {data.emptyPlatforms.includes(data.platform)
        ? <PlatformEmptyPanel platform={data.platform} c={dc} />
        : children({ ...data, snapshot: data.snapshot })}
    </>
  );
}
