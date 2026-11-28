'use client';

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { quarterWrap } from '@ig-tracker/core';
import { hasPendingRequests } from '@/lib/platform';
import { getDashboardContent } from '@/app/[locale]/dashboard/content';
import {
  RadarModal, DATE_FNS_LOCALES,
} from '@/components/radar/RadarModal';
import { StarsCard } from '@/components/tools/StarsCard';
import { UnfollowPlannerCard } from '@/components/tools/UnfollowPlannerCard';
import { ToolStudio } from '@/components/tools/ToolCard';
import { QuarterWrap } from '@/components/wrap/QuarterWrap';
import { getWrapContent } from '@/components/wrap/wrap.content';
import { useWrapAutoplay } from '@/hooks/useWrapAutoplay';
import { useStars } from '@/hooks/useStars';
import { useStudio } from '../StudioContext';
import { LockBar } from '../Lock';
import { PageHead } from '../PageHead';
import { ComingLater } from '../StudioStates';
import { RadarGate, type RadarData } from './RadarGate';
import { StudioOverview } from './StudioOverview';
import { FixesSummary, PeopleSummary } from './Summaries';
import { StudioFixes } from './StudioFixes';
import { StudioGrowth } from './StudioGrowth';
import { PeopleCards, PendingCard } from './PeopleCards';
import { getRadarPagesContent } from './radarPages.content';

const stack = { display: 'flex', flexDirection: 'column' as const, gap: 16 };

function Overview({ d }: { d: RadarData }) {
  const { locale, userId, hasPro } = useStudio();
  const dc = getDashboardContent(locale);
  const [about, setAbout] = useState(false);
  const wrap = useMemo(
    () => quarterWrap({ current: d.snapshot, previous: d.previousSnapshot, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }),
    [d.snapshot, d.previousSnapshot],
  );
  const wrapState = useWrapAutoplay(userId, d.snapshot.exportedAt, wrap !== null, wrap ? wrap.arrived + wrap.followsMade : 0);
  const dateLocale = DATE_FNS_LOCALES[locale];
  return (
    <>
      {about && <RadarModal c={dc} onClose={() => setAbout(false)} />}
      {wrapState.open && wrap && (
        <QuarterWrap w={wrap} current={d.snapshot} previous={d.previousSnapshot} locale={locale} isPro={hasPro} onClose={wrapState.close} />
      )}
      <StudioOverview
        current={d.snapshot} previous={d.previousSnapshot} locale={locale}
        dateLabel={format(new Date(d.snapshot.exportedAt * 1000), 'MMM d, yyyy', dateLocale && { locale: dateLocale })}
        aboutLabel={dc.header.whatIsRadar} onAbout={() => setAbout(true)}
        {...(wrap ? { wrapLabel: getWrapContent(locale).chip, onWrap: wrapState.openManually, wrapRange: new Intl.DateTimeFormat(locale, { month: 'short' }).formatRange(new Date(wrap.start * 1000), new Date(wrap.end * 1000)) } : {})}
      />
    </>
  );
}

export function RadarOverviewPage() {
  const { c, locale } = useStudio();
  return <RadarGate title={c.nav.radar} sub={getRadarPagesContent(locale).sub.overview}>{(d) => <Overview d={d} />}</RadarGate>;
}

export function RadarFixesPage() {
  const { c, locale } = useStudio();
  return (
    <RadarGate title={c.nav.fixes} sub={getRadarPagesContent(locale).sub.fixes}>
      {(d) => <div style={stack}><FixesSummary d={d} /><StudioFixes d={d} /></div>}
    </RadarGate>
  );
}

export function RadarGrowthPage() {
  const { c, locale } = useStudio();
  return (
    <RadarGate title={c.nav.growth} sub={getRadarPagesContent(locale).sub.growth}>
      {(d) => <StudioGrowth d={d} />}
    </RadarGate>
  );
}

function People({ d }: { d: RadarData }) {
  const { locale, hasPro, userId } = useStudio();
  const p = getRadarPagesContent(locale);
  const { stars, toggleStar } = useStars(userId, d.platform);
  const locked = !hasPro;
  return (
    <div style={stack}>
      <PeopleSummary d={d} />
      {locked && <LockBar feature="radar" text={p.lock.people} />}
      <PeopleCards d={d} />
      {/* These list real usernames, so they only render when unlocked. */}
      {!locked && (
        <ToolStudio value>
        <div className="s-grid s-g2 s-pp-tools">
          <StarsCard mutuals={d.mutuals} current={d.snapshot} previous={d.previousSnapshot} stars={stars} onToggle={toggleStar} locale={locale} />
          <UnfollowPlannerCard owner={userId} platform={d.platform} oneWay={d.nonFollowers} starred={stars} locale={locale} />
        </div>
        </ToolStudio>
      )}
      {hasPendingRequests(d.platform) && <PendingCard d={d} locked={locked} />}
    </div>
  );
}

export function RadarPeoplePage() {
  const { c, locale } = useStudio();
  return <RadarGate title={c.nav.people} sub={getRadarPagesContent(locale).sub.people}>{(d) => <People d={d} />}</RadarGate>;
}

export function RadarLaterPage({ which }: { which: 'why' | 'bench' }) {
  const { c, locale } = useStudio();
  const t = getRadarPagesContent(locale)[which];
  return (
    <>
      <PageHead title={which === 'why' ? c.nav.whyLeft : c.nav.benchmarks} />
      <ComingLater title={t.title} body={t.body} points={t.points} />
    </>
  );
}
