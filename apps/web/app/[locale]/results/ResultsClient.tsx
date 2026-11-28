'use client';

import { useMemo, useEffect } from 'react';
import { Link, useRouter as useLocaleRouter } from '@/i18n/navigation';
import { PLATFORM_NAME, snapshotPlatform, withApp } from '@/lib/platform';
import { PlatformHero } from './PlatformHero';
import { TikTokCapNotice } from './TikTokCapNotice';
import { usePlatformTheme } from '@/hooks/usePlatformTheme';
import { format } from 'date-fns';
import { es, pt } from 'date-fns/locale';
import type { Locale as DateFnsLocale } from 'date-fns';
import { analyzeSnapshot } from '@ig-tracker/core';
import { useSnapshotStore } from '@/lib/store';
import { useAuth } from '@/components/AuthProvider';
import { SiteFooter } from '@/components/site/SiteFooter';
import { T } from '@/components/landing/tokens';
import { SiteHeader } from '@/components/site/SiteHeader';
import { StudioFrame } from '@/components/studio/StudioFrame';
import { Tutorial } from '@/components/Tutorial';
import { FeedbackWidget } from '@/components/FeedbackWidget';
import { NextCheckSection } from './NextCheckSection';
import { KeepExportCard } from './KeepExportCard';
import { StudioDoor } from './StudioDoor';
import { AccountTypeTap } from './AccountTypeTap';
import { ResultsLists } from './ResultsLists';
import { VerdictCard } from '@/components/tools/VerdictCard';
import { jumpToSection } from '@/components/radar/RadarSection';
import type { AppLocale } from '@/i18n/routing';
import { getResultsContent } from './content';
import { getFeedbackWidgetContent } from '@/components/feedbackWidget.content';

const DATE_FNS_LOCALES: Partial<Record<AppLocale, DateFnsLocale>> = { es, pt };


export function ResultsClient({ locale }: { locale: AppLocale }) {
  const c            = getResultsContent(locale);
  const feedbackC     = getFeedbackWidgetContent(locale);
  const dateLocale    = DATE_FNS_LOCALES[locale];
  const localeRouter = useLocaleRouter();
  const snapshot     = useSnapshotStore(s => s.currentSnapshot);
  const { isPro, userEmail } = useAuth();

  useEffect(() => { if (!snapshot) localeRouter.replace('/'); }, [snapshot, localeRouter]);
  useEffect(() => { localeRouter.prefetch('/app/radar'); }, [localeRouter]);
  usePlatformTheme(snapshot ? snapshotPlatform(snapshot) : null);

  const analysis = useMemo(() => snapshot ? analyzeSnapshot(snapshot) : null, [snapshot]);


  if (!snapshot || !analysis) return null;

  const platform = snapshotPlatform(snapshot);

  const exportedDate = format(new Date(snapshot.exportedAt * 1000), 'MMM d, yyyy', dateLocale && { locale: dateLocale });


  // The new look (styles/studio.css): the old tokens map onto its palette inside the frame.
  return (
    <StudioFrame>
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <Tutorial
        storageKey="ig-tracker:tutorial-results"
        labels={c.tutorialLabels}
        steps={c.tutorial.map((step, i) => ({
          title: withApp(step.title, platform),
          body: withApp(step.body, platform),
          targetSelector: [
            '#tutorial-stats',
            '#tutorial-tabbar',
            '#tutorial-export-csv',
            '#tutorial-ig-link',
            '#tutorial-triage-buttons',
            '#tutorial-triage-buttons',
            '#tutorial-triage-buttons',
            '#tutorial-triage-buttons',
            '#tutorial-whitelist',
          ][i]!,
        }))}
      />
      {/* Nav — shared site nav for a consistent experience (animated Radar,
          account menu, dropdowns). RadarPulse below targets its data-radar-nav-link attribute. */}
      <SiteHeader />

      <main className="px-4 sm:px-8 py-8 sm:py-10" style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <PlatformHero platform={platform} eyebrow={c.eyebrow} exportFrom={c.exportFrom(exportedDate)} />
          <h1 style={{ fontFamily: T.sans, fontSize: 'clamp(30px, 4.6vw, 46px)', fontWeight: 600, lineHeight: 1.08, letterSpacing: '-0.035em', color: T.ink }}>
            <span style={{ color: T.tealLight }}>{analysis.nonFollowers.length.toLocaleString()}</span>{' '}
            {c.headlineSuffix(analysis.nonFollowers.length, PLATFORM_NAME[platform])}
          </h1>
          {!isPro && (
            <p style={{ marginTop: 12, fontSize: 14, lineHeight: 1.55, color: T.inkDim, maxWidth: 620 }}>
              {c.todayHint.text}{' '}
              <a href="#radar-teaser" onClick={(e) => jumpToSection(e, 'radar-teaser')} style={{ color: T.tealLight, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>{c.todayHint.link} ↓</a>
            </p>
          )}
          <TikTokCapNotice snapshot={snapshot} locale={locale} />
          {snapshot.format === 'html' && !snapshot.followers.some(a => a.followedAt !== null) && (
            <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 12, background: 'rgba(var(--t-accent-rgb),0.06)', border: '1px solid rgba(var(--t-accent-rgb),0.2)', display: 'flex', alignItems: 'flex-start', gap: 10, maxWidth: 560 }}>
              <span style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.5 }}>
                {c.htmlFormatNotice}{' '}
                <Link href="/how-to-export" style={{ color: T.tealLight, fontWeight: 600, textDecoration: 'none' }}>
                  {c.seeHowToRequestJson}
                </Link>
              </span>
            </div>
          )}
        </div>

        <ResultsLists snapshot={snapshot} analysis={analysis} isPro={isPro} locale={locale} />

        {/* Free, shareable: only aggregate numbers, never usernames. */}
        <div style={{ marginTop: 32 }}>
          <VerdictCard current={snapshot} locale={locale} />
        </div>

        {/* Signed out: this export only lives in this tab session. */}
        {!userEmail && <KeepExportCard locale={locale} />}

        <NextCheckSection
          locale={locale}
          isPro={isPro}
          userEmail={userEmail}
          nonFollowersCount={analysis.nonFollowers.length}
        />

        {/* The one door into Studio: Radar, History and the coach live there. */}
        <AccountTypeTap locale={locale} />
        <StudioDoor locale={locale} />
      </main>

      <SiteFooter />
      <FeedbackWidget content={feedbackC} autoOpenAfterMs={150_000} />
    </div>
    </StudioFrame>
  );
}
