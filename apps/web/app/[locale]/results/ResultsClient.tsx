'use client';

import { useMemo, useState, useEffect } from 'react';
import { Link, useRouter as useLocaleRouter } from '@/i18n/navigation';
import { format } from 'date-fns';
import { es, pt } from 'date-fns/locale';
import type { Locale as DateFnsLocale } from 'date-fns';
import { analyzeSnapshot } from '@ig-tracker/core';
import type { Account } from '@ig-tracker/core';
import { useSnapshotStore } from '@/lib/store';
import { useAuth } from '@/components/AuthProvider';
import { AccountList } from '@/components/AccountList';
import { TriageList } from './TriageList';
import { LandingFooter } from '@/components/landing/FinalCTA';
import { T } from '@/components/landing/tokens';
import { useTriage } from '@/hooks/useTriage';
import { SiteNav } from '@/components/landing/SiteNav';
import { Tutorial } from '@/components/Tutorial';
import { FeedbackWidget } from '@/components/FeedbackWidget';
import { UpgradeLink } from '@/app/account/UpgradeLink';
import { trackLockedView } from '@/lib/analytics';
import type { AppLocale } from '@/i18n/routing';
import { getResultsContent, type ResultsContent } from './content';
import { getListToolbarContent } from '@/components/listToolbar.content';
import { getTriageListContent } from './triageList.content';
import { getFeedbackWidgetContent } from '@/components/feedbackWidget.content';

const DATE_FNS_LOCALES: Partial<Record<AppLocale, DateFnsLocale>> = { es, pt };

// ─── Stat card ───────────────────────────────────────────────────────────────

function StatCard({ label, value, badge, accent = false }: {
  label: string;
  value: string | number;
  badge?: { text: string; title: string } | undefined;
  accent?: boolean;
}) {
  return (
    <div style={{
      padding: '16px 18px', borderRadius: 14,
      background: accent ? 'rgba(2,136,143,0.08)' : 'var(--t-surface1)',
      border: `1px solid ${accent ? 'rgba(2,136,143,0.25)' : 'var(--t-border1)'}`,
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{ fontSize: 12, color: accent ? T.tealMid : T.inkDim, fontFamily: T.mono, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontFamily: T.serif, fontSize: 36, lineHeight: 1, letterSpacing: '-0.03em', color: accent ? T.tealLight : T.ink }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {badge && (
          <span title={badge.title} style={{
            fontSize: 13, fontFamily: T.mono, color: T.terra,
            whiteSpace: 'nowrap', lineHeight: 1,
          }}>
            {badge.text}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────

interface Tab { id: string; label: string; description: string; count: number; accounts: Account[]; csvFilename: string; emptyMessage: string }

function InfoTooltip({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, opacity: 0.5 }}>
        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M7 6.5 V10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="7" cy="4.5" r="0.7" fill="currentColor"/>
      </svg>
      {visible && (
        <span style={{
          position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
          marginBottom: 8, width: 200, padding: '8px 12px', borderRadius: 8,
          background: 'rgba(20,20,20,0.97)', border: '1px solid var(--t-border2)',
          fontSize: 12, color: 'rgba(244,240,232,0.75)', lineHeight: 1.5,
          whiteSpace: 'normal', textAlign: 'left', pointerEvents: 'none', zIndex: 100,
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        }}>
          {text}
        </span>
      )}
    </span>
  );
}

function TabBar({ tabs, activeId, onChange }: { tabs: Tab[]; activeId: string; onChange: (id: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 14, background: 'var(--t-surface1)', border: '1px solid var(--t-border1)' }}>
      {tabs.map(tab => {
        const active = tab.id === activeId;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '10px 16px', borderRadius: 10,
              background: active ? 'rgba(2,136,143,0.12)' : 'transparent',
              border: `1px solid ${active ? 'rgba(2,136,143,0.3)' : 'transparent'}`,
              color: active ? T.ink : T.inkDim,
              fontSize: 13, fontWeight: active ? 600 : 400,
              fontFamily: T.sans, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
            <InfoTooltip text={tab.description} />
            <span style={{
              fontSize: 11, padding: '2px 7px', borderRadius: 20, fontFamily: T.mono,
              background: active ? T.tealMid : 'var(--t-border1)',
              color: active ? T.cream : T.inkMute,
            }}>
              {tab.count.toLocaleString()}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Radar teaser ─────────────────────────────────────────────────────────────
// The only page every free visitor actually sees. Locked-feature nudges on
// Radar/cloud sync only reach people who already made an account and went
// looking for them, so this is the highest-reach place to surface Pro.

function CheckItem({ label }: { label: string }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: T.ink }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.tealMid} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {label}
    </span>
  );
}

// Small live "Radar preview" built from the visitor's own numbers, not demo
// data, so it reads as their report rather than a generic ad.
function RadarPreviewCard({ mutualsCount, nonFollowersCount, totalFollowing, c }: {
  mutualsCount: number;
  nonFollowersCount: number;
  totalFollowing: number;
  c: ResultsContent;
}) {
  const followBackRate = totalFollowing > 0 ? Math.round((mutualsCount / totalFollowing) * 100) : 0;

  return (
    <div style={{
      background: '#060e10',
      border: `1px solid ${T.tealMid}`,
      borderRadius: 16,
      padding: '18px 20px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
      flexShrink: 0,
      width: '100%',
    }}>
      {/* Window chrome, matches the homepage's product preview style */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f57' }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
        <span style={{ marginLeft: 6, fontSize: 10, color: 'rgba(244,240,232,0.35)', fontFamily: T.mono, letterSpacing: '0.06em' }}>{c.radarTeaser.previewLabel}</span>
      </div>

      <div style={{ marginBottom: 4 }}>
        <span style={{ fontFamily: T.serif, fontSize: 40, lineHeight: 1, letterSpacing: '-0.03em', color: '#5fc4c8' }}>{followBackRate}%</span>
      </div>
      <div style={{ fontSize: 11, color: 'rgba(244,240,232,0.45)', marginBottom: 14, fontFamily: T.mono }}>{c.radarTeaser.followBackRate}</div>

      {/* Real proportion bar: mutuals vs non-followers, out of everyone you follow */}
      <div style={{ display: 'flex', height: 8, borderRadius: 5, overflow: 'hidden', marginBottom: 8 }}>
        <div style={{ width: `${followBackRate}%`, background: '#5fc4c8' }} />
        <div style={{ width: `${100 - followBackRate}%`, background: '#a84b2f' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(244,240,232,0.5)', fontFamily: T.mono, marginBottom: 18 }}>
        <span>{c.radarTeaser.mutualsLabel(mutualsCount.toLocaleString())}</span>
        <span>{c.radarTeaser.dontFollowBackLabel(nonFollowersCount.toLocaleString())}</span>
      </div>

      {/* Timeline hint: this is the one number we can't show yet, it needs a second export */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 14, borderTop: '1px solid rgba(244,240,232,0.08)' }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#5fc4c8', flexShrink: 0 }} />
        <div style={{ flex: 1, height: 1, background: 'repeating-linear-gradient(90deg, rgba(95,196,200,0.4) 0 4px, transparent 4px 8px)' }} />
        <span style={{ width: 7, height: 7, borderRadius: '50%', border: '1px dashed rgba(244,240,232,0.35)', flexShrink: 0 }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(244,240,232,0.35)', fontFamily: T.mono, marginTop: 6 }}>
        <span>{c.radarTeaser.today}</span>
        <span>{c.radarTeaser.nextExport}</span>
      </div>
    </div>
  );
}

function RadarTeaser({ isPro, mutualsCount, nonFollowersCount, totalFollowing, c }: {
  isPro: boolean;
  mutualsCount: number;
  nonFollowersCount: number;
  totalFollowing: number;
  c: ResultsContent;
}) {
  useEffect(() => { if (!isPro) trackLockedView('results-radar-teaser'); }, [isPro]);
  if (isPro) return null;

  return (
    <section
      className="grid grid-cols-1 sm:grid-cols-[1fr_300px]"
      style={{
        marginTop: 48,
        gap: 28,
        alignItems: 'center',
        padding: '28px 26px',
        borderRadius: 20,
        background: 'linear-gradient(180deg, rgba(2,136,143,0.10) 0%, rgba(2,136,143,0.02) 100%)',
        border: `1px solid ${T.tealMid}`,
      }}
    >
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: T.tealLight, fontFamily: T.mono, textTransform: 'uppercase', marginBottom: 10 }}>
          {c.radarTeaser.eyebrow}
        </div>
        <h2 style={{ fontFamily: T.serif, fontSize: 24, fontWeight: 400, color: T.ink, letterSpacing: '-0.01em', marginBottom: 10, maxWidth: 460 }}>
          {c.radarTeaser.headline(mutualsCount)}
        </h2>
        <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.6, marginBottom: 20, maxWidth: 480 }}>
          {c.radarTeaser.body}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 22px', marginBottom: 22 }}>
          {c.radarTeaser.checks.map((label) => <CheckItem key={label} label={label} />)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <UpgradeLink
            source="results-radar"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              borderRadius: 11,
              background: T.teal,
              color: T.cream,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: T.sans,
              boxShadow: '0 8px 24px rgba(2,136,143,0.35)',
            }}
          >
            {c.radarTeaser.ctaPrimary}
          </UpgradeLink>
          <Link
            href="/dashboard"
            style={{ fontSize: 13, color: T.tealLight, fontWeight: 600, textDecoration: 'none' }}
          >
            {c.radarTeaser.ctaSecondary}
          </Link>
        </div>
      </div>

      <RadarPreviewCard mutualsCount={mutualsCount} nonFollowersCount={nonFollowersCount} totalFollowing={totalFollowing} c={c} />
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function RadarPulse({ trigger, c }: { trigger: boolean; c: ResultsContent }) {
  const [phase, setPhase] = useState<'hidden' | 'in' | 'visible' | 'out'>('hidden');
  const [anchor, setAnchor] = useState<{ top: number; left: number; arrowLeft: number } | null>(null);

  useEffect(() => {
    if (!trigger) return;
    try { if (sessionStorage.getItem('ig-tracker:radar-pulse')) return; } catch {}

    // Measure Radar button position. Keyed off a data attribute rather than
    // the href, since that's locale-prefixed for es/pt.
    const radarBtn = document.querySelector<HTMLElement>('[data-radar-nav-link]');
    if (radarBtn) {
      const r = radarBtn.getBoundingClientRect();
      const popupW = 320;
      const idealLeft = r.left + r.width / 2 - popupW / 2;
      const left = Math.max(12, Math.min(idealLeft, window.innerWidth - popupW - 12));
      setAnchor({ top: r.bottom + 10, left, arrowLeft: r.left + r.width / 2 - left - 7 });
    }

    const t1 = setTimeout(() => setPhase('in'), 1200);
    const t2 = setTimeout(() => setPhase('visible'), 1700);
    const t3 = setTimeout(() => setPhase('out'), 9000);
    const t4 = setTimeout(() => setPhase('hidden'), 9600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [trigger]);

  function dismiss() {
    try { sessionStorage.setItem('ig-tracker:radar-pulse', '1'); } catch {}
    setPhase('out');
    setTimeout(() => setPhase('hidden'), 500);
  }

  if (phase === 'hidden') return null;

  const pos = anchor ?? { top: 64, left: window.innerWidth / 2 - 160, arrowLeft: 153 };

  return (
    <div style={{
      position: 'fixed',
      top: pos.top,
      left: pos.left,
      width: 320,
      zIndex: 500,
      background: '#060e10',
      border: `1px solid ${T.tealMid}`,
      borderRadius: 12,
      padding: '10px 14px',
      boxShadow: `0 8px 32px rgba(0,0,0,0.55), 0 0 20px rgba(2,136,143,0.2)`,
      display: 'flex', alignItems: 'center', gap: 10,
      opacity: phase === 'visible' ? 1 : 0,
      transform: `translateY(${phase === 'visible' ? '0' : '-6px'})`,
      transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)',
    }}>
      {/* Arrow pointing up to Radar button */}
      <div style={{
        position: 'absolute', top: -7, left: Math.max(12, Math.min(pos.arrowLeft, 296)),
        width: 14, height: 7, overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 2, left: 1,
          width: 12, height: 12,
          background: '#060e10',
          border: `1px solid ${T.tealMid}`,
          transform: 'rotate(45deg)',
          transformOrigin: 'center',
        }} />
      </div>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.tealLight, flexShrink: 0, animation: 'glow-soft 2s ease-in-out infinite' }} />
      <span style={{ fontSize: 12, color: '#f4f0e8', fontFamily: T.sans, flex: 1 }}>
        {c.radarPulse.prefix}{' '}
        <Link href="/dashboard" onClick={dismiss} style={{ color: T.tealLight, fontWeight: 700, textDecoration: 'none' }}>{c.radarPulse.linkText}</Link>
      </span>
      <button onClick={dismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(244,240,232,0.3)', fontSize: 15, lineHeight: 1, padding: '0 2px', flexShrink: 0 }}>×</button>
    </div>
  );
}

export function ResultsClient({ locale }: { locale: AppLocale }) {
  const c            = getResultsContent(locale);
  const toolbar      = getListToolbarContent(locale);
  const triageC       = getTriageListContent(locale);
  const feedbackC     = getFeedbackWidgetContent(locale);
  const dateLocale    = DATE_FNS_LOCALES[locale];
  const localeRouter = useLocaleRouter();
  const snapshot     = useSnapshotStore(s => s.currentSnapshot);
  const { isPro }    = useAuth();
  const [activeTabId, setActiveTabId] = useState('non-followers');
  const [tutorialDone, setTutorialDone] = useState(false);

  useEffect(() => { if (!snapshot) localeRouter.replace('/'); }, [snapshot, localeRouter]);
  useEffect(() => { localeRouter.prefetch('/dashboard'); }, [localeRouter]);

  const analysis = useMemo(() => snapshot ? analyzeSnapshot(snapshot) : null, [snapshot]);
  const { triage } = useTriage(snapshot?.exportedAt ?? 0);
  const unfollowedCount = useMemo(
    () => [...triage.values()].filter(s => s === 'done').length,
    [triage],
  );

  if (!snapshot || !analysis) return null;

  const exportedDate = format(new Date(snapshot.exportedAt * 1000), 'MMM d, yyyy', dateLocale && { locale: dateLocale });

  const tabs: Tab[] = [
    { id: 'non-followers', label: c.tabs.nonFollowers.label, description: c.tabs.nonFollowers.description, count: analysis.nonFollowers.length, accounts: analysis.nonFollowers, csvFilename: `non-followers-${snapshot.exportedAt}.csv`, emptyMessage: c.tabs.nonFollowers.emptyMessage },
    { id: 'fans',          label: c.tabs.fans.label,          description: c.tabs.fans.description,          count: analysis.fans.length,         accounts: analysis.fans,         csvFilename: `fans-${snapshot.exportedAt}.csv`,          emptyMessage: c.tabs.fans.emptyMessage },
    { id: 'mutuals',       label: c.tabs.mutuals.label,       description: c.tabs.mutuals.description,       count: analysis.mutuals.length,      accounts: analysis.mutuals,      csvFilename: `mutuals-${snapshot.exportedAt}.csv`,       emptyMessage: c.tabs.mutuals.emptyMessage },
  ];

  const activeTab = tabs.find(t => t.id === activeTabId) ?? tabs[0]!;

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <RadarPulse trigger={tutorialDone} c={c} />
      <Tutorial
        storageKey="ig-tracker:tutorial-results"
        onDismiss={() => setTutorialDone(true)}
        labels={c.tutorialLabels}
        steps={c.tutorial.map((step, i) => ({
          ...step,
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
      <SiteNav />

      <main className="px-4 sm:px-8 py-10 sm:py-12" style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em' }}>{c.eyebrow}</span>
            <span style={{ fontSize: 11, color: T.inkMute, fontFamily: T.mono }}>{c.exportFrom(exportedDate)}</span>
          </div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink }}>
            <span style={{ color: T.tealLight }}>{analysis.nonFollowers.length.toLocaleString()}</span>{' '}
            {c.headlineSuffix(analysis.nonFollowers.length)}
          </h1>
          <p style={{ fontSize: 15, color: T.inkDim, marginTop: 10 }}>
            {c.outOfAccounts(analysis.totalFollowing.toLocaleString())}
          </p>
          {snapshot.format === 'html' && (
            <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 12, background: 'rgba(2,136,143,0.06)', border: '1px solid rgba(2,136,143,0.2)', display: 'flex', alignItems: 'flex-start', gap: 10, maxWidth: 560 }}>
              <span style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.5 }}>
                {c.htmlFormatNotice}{' '}
                <Link href="/how-to-export" style={{ color: T.tealLight, fontWeight: 600, textDecoration: 'none' }}>
                  {c.seeHowToRequestJson}
                </Link>
              </span>
            </div>
          )}
        </div>

        {/* Stats grid */}
        <div id="tutorial-stats" className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: 10, marginBottom: 40 }}>
          <StatCard label={c.statFollowers} value={analysis.totalFollowers} />
          <StatCard
            label={c.statFollowing}
            value={analysis.totalFollowing}
            badge={unfollowedCount > 0 ? {
              text: c.nowApprox((analysis.totalFollowing - unfollowedCount).toLocaleString()),
              title: c.markedAsUnfollowed(unfollowedCount),
            } : undefined}
          />
          <StatCard label={c.statMutuals}       value={analysis.mutuals.length} />
          <StatCard label={c.statNonFollowers} value={analysis.nonFollowers.length} accent />
        </div>

        {/* Tabs + list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div id="tutorial-tabbar">
            <TabBar tabs={tabs} activeId={activeTabId} onChange={setActiveTabId} />
          </div>
          {activeTabId === 'non-followers' ? (
            <TriageList
              accounts={analysis.nonFollowers}
              snapshotKey={snapshot.exportedAt}
              csvFilename={activeTab.csvFilename}
              isPro={isPro}
              c={triageC}
              toolbar={toolbar}
            />
          ) : (
            <AccountList
              key={activeTabId}
              accounts={activeTab.accounts}
              csvFilename={activeTab.csvFilename}
              emptyMessage={activeTab.emptyMessage}
              content={toolbar}
            />
          )}
        </div>

        <RadarTeaser
          isPro={isPro}
          mutualsCount={analysis.mutuals.length}
          nonFollowersCount={analysis.nonFollowers.length}
          totalFollowing={analysis.totalFollowing}
          c={c}
        />
      </main>

      <LandingFooter />
      <FeedbackWidget content={feedbackC} />
    </div>
  );
}
