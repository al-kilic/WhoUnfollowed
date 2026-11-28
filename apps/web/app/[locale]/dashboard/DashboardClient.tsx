'use client';

import { useMemo, useEffect, useRef, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { format } from 'date-fns';
import { SiteFooter } from '@/components/site/SiteFooter';
import { T } from '@/components/landing/tokens';
import { platforms as allPlatforms } from '@ig-tracker/core';
import { hasPendingRequests } from '@/lib/platform';
import { useRadarData } from '@/hooks/useRadarData';
import { PlatformEmptyPanel } from './PlatformEmptyPanel';
import { PlatformSwitcher } from '@/components/PlatformSwitcher';
import { SiteHeader } from '@/components/site/SiteHeader';
import { Tutorial } from '@/components/Tutorial';
import { ProLockOverlay } from '@/components/ProLockOverlay';
import { FeedbackWidget } from '@/components/FeedbackWidget';
import type { AppLocale } from '@/i18n/routing';
import { getDashboardContent } from './content';
import { getFeedbackWidgetContent } from '@/components/feedbackWidget.content';
import { GrowthTimelineCard } from '@/components/tools/GrowthTimelineCard';
import { StarsCard } from '@/components/tools/StarsCard';
import { UnfollowPlannerCard } from '@/components/tools/UnfollowPlannerCard';
import { RadarFreeZone } from '@/components/radar/RadarFreeZone';
import { RadarSweep } from '@/components/radar/RadarSweep';
import { RadarSection, SectionHead, SectionNav } from '@/components/radar/RadarSection';
import { getRadarPageContent } from '@/components/radar/radar.content';
import {
  AudienceBreakdown, FollowRatioCard, FollowAgeCard, PendingRequestsCard, RecentlyUnfollowedCard,
  GrowthChart, RadarModal, maskAccounts, DATE_FNS_LOCALES, type SnapshotSummary,
} from '@/components/radar/RadarDataCards';
import { QuarterWrap } from '@/components/wrap/QuarterWrap';
import { getWrapContent } from '@/components/wrap/wrap.content';
import { useWrapAutoplay } from '@/hooks/useWrapAutoplay';
import { quarterWrap } from '@ig-tracker/core';
import { useStars } from '@/hooks/useStars';
import { Events, track } from '@/lib/analytics';

interface DashboardClientProps {
  locale: AppLocale;
  account: { userId: string | null; userEmail: string | null; isPro: boolean };
}

export function DashboardClient({ locale, account }: DashboardClientProps) {
  const c = getDashboardContent(locale);
  const rc = getRadarPageContent(locale);
  const feedbackC = getFeedbackWidgetContent(locale);
  const dateLocale = DATE_FNS_LOCALES[locale];
  const {
    loading, snapshot, snapshotsLoaded, platform, platformSnapshots, previousSnapshot,
    emptyPlatforms, switchPlatform, onPlatformWithData, nonFollowers, fans, mutuals,
  } = useRadarData(account.userId);
  const [radarModalOpen, setRadarModalOpen] = useState(false);

  // Free users see the real Radar blurred behind an upgrade overlay (a teaser of
  // their own data), rather than the full feature.
  const locked = !account.isPro;
  const { stars, toggleStar } = useStars(account.userId, platform);

  // The 3-month wrap that plays before the Radar (free, counts only).
  const wrap = useMemo(
    () => (snapshot ? quarterWrap({ current: snapshot, previous: previousSnapshot, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }) : null),
    [snapshot, previousSnapshot],
  );
  const wrapState = useWrapAutoplay(account.userId, onPlatformWithData && snapshot ? snapshot.exportedAt : null, wrap !== null, wrap ? wrap.arrived + wrap.followsMade : 0);

  // One radar-view per export shown, so "saw the Radar -> upgrade" is countable.
  const viewedExport = onPlatformWithData && snapshot ? snapshot.exportedAt : null;
  const hasPrevious = previousSnapshot !== undefined;
  // Opened from the wrap email with nothing saved on this device: say why.
  const [fromWrapEmail, setFromWrapEmail] = useState(false);
  useEffect(() => { setFromWrapEmail(new URLSearchParams(window.location.search).get('wrap') === '1'); }, []);

  const lastViewed = useRef<string | null>(null);
  useEffect(() => {
    // Wait for saved history, or has_previous would read false on a fresh load.
    if (viewedExport === null || !snapshotsLoaded) return;
    const key = `${platform}:${viewedExport}`;
    if (lastViewed.current === key) return; // history loading late must not count twice
    lastViewed.current = key;
    track(Events.radarView, { platform, pro: account.isPro, has_previous: hasPrevious });
  }, [viewedExport, snapshotsLoaded, platform, account.isPro, hasPrevious]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 13, color: T.inkMute, fontFamily: T.mono }}>{c.loadingRadar}</div>
    </div>
  );

  // No snapshot in memory and none in local history — nothing to scan yet.
  if (!snapshot) return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <SiteHeader />

      <main style={{ maxWidth: 520, margin: '0 auto', padding: '88px 24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: '50%', background: T.surface2, border: `1px solid ${T.border2}`, marginBottom: 24 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={T.tealMid} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19.07 4.93A10 10 0 1 1 4.93 19.07" />
            <path d="M15.54 8.46A5 5 0 1 0 8.46 15.54" />
            <circle cx="12" cy="12" r="1.5" fill={T.tealMid} stroke="none" />
          </svg>
        </div>
        <h1 style={{ fontFamily: T.serif, fontSize: 28, fontWeight: 400, letterSpacing: '-0.02em', marginBottom: 12, lineHeight: 1.15 }}>
          {c.emptyState.title}
        </h1>
        <p style={{ fontSize: 14.5, color: T.inkDim, lineHeight: 1.6, marginBottom: 28 }}>
          {c.emptyState.body}
        </p>
        {fromWrapEmail && (
          <p style={{ fontSize: 14, color: T.ink, lineHeight: 1.6, margin: '-12px 0 28px', padding: '12px 16px', borderRadius: 10, background: T.surface2, border: `1px solid ${T.border2}` }}>
            {c.emptyState.wrapNote}
          </p>
        )}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{ fontSize: 14, fontWeight: 600, color: T.onTeal, textDecoration: 'none', padding: '11px 20px', borderRadius: 10, background: T.teal, border: '1px solid rgba(2,136,143,0.5)' }}
          >
            {c.emptyState.uploadExport}
          </Link>
          <Link
            href="/how-to-export"
            style={{ fontSize: 14, fontWeight: 500, color: T.inkDim, textDecoration: 'none', padding: '11px 20px', borderRadius: 10, border: `1px solid ${T.border3}` }}
          >
            {c.emptyState.howToExport}
          </Link>
        </div>
      </main>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <SiteHeader />

      {radarModalOpen && <RadarModal c={c} onClose={() => setRadarModalOpen(false)} />}
      {wrapState.open && wrap && onPlatformWithData && (
        <QuarterWrap w={wrap} current={snapshot} previous={previousSnapshot} locale={locale} isPro={account.isPro} onClose={wrapState.close} />
      )}
      {!locked && !wrapState.open && <Tutorial
        storageKey="ig-tracker:tutorial-radar"
        labels={c.tutorialLabels}
        steps={c.tutorial
          .map((step, i) => ({
            ...step,
            targetSelector: ['#tutorial-health', '#tutorial-growth', '#tutorial-audience', '#tutorial-follow-age', '#tutorial-pending', '#tutorial-pending'][i]!,
          }))
          // Step 5 is the Instagram-only pending-requests card.
          .filter((_, i) => hasPendingRequests(platform) || i !== 4)}
      />}

      {/* Platform switcher sits outside the Pro-lock area so free users can
          switch the preview too. */}
      <div className="px-4 sm:px-8 flex flex-col items-start gap-3 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center" style={{ maxWidth: 1100, margin: '0 auto', paddingTop: 28 }}>
        <div>
          {!emptyPlatforms.includes(platform) && (
            <Link href="/results" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: T.inkDim, textDecoration: 'none', padding: '8px 14px', borderRadius: 999, border: `1px solid ${T.border2}`, background: 'var(--t-surface1)' }}>
              <span aria-hidden="true">←</span>{c.backToResults}
            </Link>
          )}
        </div>
        <div className="self-center">
        <PlatformSwitcher
          options={allPlatforms}
          active={platform}
          onChange={switchPlatform}
          ariaLabel={c.header.platformSwitcherLabel}
          empty={emptyPlatforms}
        />
        </div>
      </div>

      {!emptyPlatforms.includes(platform) && (
        <SectionNav
          label={rc.nav.label}
          items={[
            { id: 'overview', label: rc.nav.overview },
            { id: 'curiosities', label: rc.nav.curiosities },
            { id: 'verdict', label: rc.nav.verdict },
            { id: 'radar', label: rc.nav.radar },
            { id: 'data', label: rc.nav.data },
          ]}
        />
      )}

      {emptyPlatforms.includes(platform) ? <PlatformEmptyPanel platform={platform} c={c} /> : (<>
      {/* Free zone: overview, curiosities and the verdict are aggregates
          only, so they sit above the Pro-locked radar and data. */}
      <div className="px-4 sm:px-8" style={{ maxWidth: 1100, margin: '0 auto', paddingTop: 24 }}>
        <RadarFreeZone
          current={snapshot} previous={previousSnapshot} locale={locale} c={rc}
          dateLabel={format(new Date(snapshot.exportedAt * 1000), 'MMM d, yyyy', dateLocale && { locale: dateLocale })}
          aboutLabel={c.header.whatIsRadar}
          onAbout={() => setRadarModalOpen(true)}
          {...(wrap ? { wrapLabel: getWrapContent(locale).chip, onWrap: wrapState.openManually } : {})}
        />
      </div>
      <div style={{ position: 'relative' }}>
      <main className="px-4 sm:px-8 pb-20" style={{ maxWidth: 1100, margin: '0 auto' }}>
        <RadarSection id="radar">
          <SectionHead {...rc.sections.radar} />
          <RadarSweep current={snapshot} previous={previousSnapshot} locale={locale} c={rc} locked={locked} />
        </RadarSection>

        <RadarSection id="data" style={{ marginBottom: 0 }}>
        <SectionHead {...rc.sections.data} />

        {/* Growth timeline from follow dates: works with one export, so it leads */}
        <div style={{ marginBottom: 16 }}>
          <GrowthTimelineCard snapshot={snapshot} locale={locale} />
        </div>

        {/* Growth chart */}
        <div id="tutorial-growth" style={{ marginBottom: 16 }}>
          <GrowthChart snapshots={platformSnapshots as SnapshotSummary[]} c={c} dateLocale={dateLocale} locked={locked} />
        </div>

        {/* Row 1: Audience donut + Follow ratio */}
        <div id="tutorial-audience" className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 16, marginBottom: 16 }}>
          <AudienceBreakdown
            followers={snapshot.followers.length}
            mutuals={mutuals.length}
            fans={fans.length}
            nonFollowers={nonFollowers.length}
            c={c}
            locked={locked}
          />
          <FollowRatioCard
            followers={snapshot.followers.length}
            following={snapshot.following.length}
            snapshots={platformSnapshots as SnapshotSummary[]}
            c={c}
            dateLocale={dateLocale}
            locked={locked}
          />
        </div>

        {/* Follow age full width */}
        <div id="tutorial-follow-age" style={{ marginBottom: 16 }}>
          <FollowAgeCard nonFollowers={locked ? maskAccounts(nonFollowers) : nonFollowers} c={c} locked={locked} />
        </div>

        {/* Stars and the unfollow planner list real usernames, so they only
            render for Pro (the locked preview never puts names in the page). */}
        {!locked && (
          <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 16, marginBottom: 16 }}>
            <StarsCard mutuals={mutuals} current={snapshot} previous={previousSnapshot} stars={stars} onToggle={toggleStar} locale={locale} />
            <UnfollowPlannerCard owner={account.userId} platform={platform} oneWay={nonFollowers} starred={stars} locale={locale} />
          </div>
        )}

        {/* Pending + Recently unfollowed */}
        {/* Threads exports have no "requests you sent" list, so the pending
            card is Instagram-only. */}
        <div id="tutorial-pending" className={hasPendingRequests(platform) ? 'grid grid-cols-1 md:grid-cols-2' : 'grid grid-cols-1'} style={{ gap: 16 }}>
          {hasPendingRequests(platform) && <PendingRequestsCard accounts={locked ? maskAccounts(snapshot.pendingRequests ?? []) : snapshot.pendingRequests ?? []} c={c} locked={locked} />}
          <RecentlyUnfollowedCard accounts={locked ? maskAccounts(snapshot.recentlyUnfollowed ?? []) : snapshot.recentlyUnfollowed ?? []} c={c} dateLocale={dateLocale} locked={locked} />
        </div>
        </RadarSection>
      </main>
      {locked && (
        <ProLockOverlay
          feature="radar"
          eyebrow={c.proLock.eyebrow}
          title={c.proLock.title}
          description={c.proLock.description}
          cta={c.proLock.cta}
        />
      )}
      </div>
      </>)}

      <SiteFooter />
      <FeedbackWidget content={feedbackC} />
    </div>
  );
}
