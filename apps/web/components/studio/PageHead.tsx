'use client';

import type { ReactNode } from 'react';
import { usePathname } from '@/i18n/navigation';
import { useStudio } from './StudioContext';
import { SectionTabs, activeSub, sectionOf } from './StudioNav';
import { InfoTip } from './InfoTip';
import { getGuideLabels, guideFor } from './guides.content';

// Title row at the top of every Studio page. Inside a section with sub-pages
// the title is the section's name and the tab bar sits under it, as in the
// prototype; `title` is used for pages outside a section.
// The old one-line description (`sub`) is no longer shown under the title:
// the info button next to it opens the page's guide instead (guides.content).
export function PageHead({ title, actions }: { title: string; sub?: string | undefined; actions?: ReactNode }) {
  const { c, locale } = useStudio();
  const path = usePathname();
  const section = sectionOf(path);
  const heading = section?.subs ? c.nav[section.key] : title;
  // The guide names the page on screen: the sub-page inside a section.
  const subItem = section?.subs ? activeSub(section, path) : undefined;
  const pageName = subItem && subItem.href !== section?.href ? `${heading} · ${c.nav[subItem.key]}` : heading;
  const guide = guideFor(path, locale);
  return (
    <>
      <header className="s-top">
        <div className="s-top-t">
          <h1>{heading}</h1>
          {guide && <InfoTip guide={guide} page={pageName} labels={getGuideLabels(locale)} />}
        </div>
        {actions && <div className="s-row" style={{ flexWrap: 'wrap' }}>{actions}</div>}
      </header>
      <SectionTabs />
    </>
  );
}
