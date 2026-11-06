'use client';

import { useMemo } from 'react';
import { runHealthChecks, type ParsedSnapshot } from '@ig-tracker/core';
import type { AppLocale } from '@/i18n/routing';
import { PLATFORM_NAME, snapshotPlatform } from '@/lib/platform';
import { useVerdict } from '@/hooks/useVerdict';
import { OverviewCover } from './OverviewCover';
import { CuriositiesGrid } from './CuriositiesGrid';
import { VerdictPoster } from './VerdictPoster';
import { RadarSection, SectionHead } from './RadarSection';
import type { RadarPageContent } from './radar.content';

// The free top of the Radar: overview, curiosities, verdict. Aggregates only,
// so it renders unlocked for everyone, above the Pro-locked radar and data.
export function RadarFreeZone({ current, previous, locale, c, dateLabel, aboutLabel, onAbout, wrapLabel, onWrap }: {
  current: ParsedSnapshot; previous?: ParsedSnapshot | undefined; locale: AppLocale; c: RadarPageContent;
  dateLabel: string; aboutLabel: string; onAbout: () => void;
  wrapLabel?: string | undefined; onWrap?: (() => void) | undefined;
}) {
  const v = useVerdict(current, previous, locale, 'radar');
  // Only the count is used here; the findings themselves live in the radar.
  const fixCount = useMemo(
    () => runHealthChecks({ current, previous }).filter(f => f.id !== 'second_export').length,
    [current, previous],
  );

  return (
    <>
      <RadarSection id="overview" style={{ marginBottom: 72 }}>
        <OverviewCover
          stats={v.stats} c={c} locale={locale}
          eyebrow={c.cover.eyebrow(PLATFORM_NAME[snapshotPlatform(current)], dateLabel)}
          archetype={v.name} fixCount={fixCount} onAbout={onAbout} aboutLabel={aboutLabel} wrapLabel={wrapLabel} onWrap={onWrap}
        />
      </RadarSection>
      <RadarSection id="curiosities">
        <SectionHead {...c.sections.curiosities} />
        <CuriositiesGrid current={current} previous={previous} locale={locale} c={c} />
      </RadarSection>
      <RadarSection id="verdict">
        <SectionHead {...c.sections.verdict} />
        <VerdictPoster v={v} />
      </RadarSection>
    </>
  );
}
