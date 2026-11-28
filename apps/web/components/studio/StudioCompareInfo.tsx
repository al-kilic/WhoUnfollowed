'use client';

import type { AppLocale } from '@/i18n/routing';
import { InfoTip } from './InfoTip';
import { getGuideLabels, guideFor } from './guides.content';
import { useStudio } from './StudioContext';

// The guide button for Studio > History > Compare, whose title is drawn by the
// shared compare view rather than PageHead.
export function StudioCompareInfo({ locale }: { locale: AppLocale }) {
  const { c } = useStudio();
  const guide = guideFor('/app/history/compare', locale);
  if (!guide) return null;
  return (
    <span style={{ display: 'inline-flex', verticalAlign: 'middle', marginLeft: 10, fontSize: 14 }}>
      <InfoTip guide={guide} page={c.nav.history} labels={getGuideLabels(locale)} />
    </span>
  );
}
