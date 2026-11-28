'use client';

import { useMemo, useState } from 'react';
import type { Account, ParsedSnapshot, analyzeSnapshot } from '@ig-tracker/core';
import { triageKeyOf } from '@/lib/platform';
import { AccountList } from '@/components/AccountList';
import { T } from '@/components/landing/tokens';
import { useTriage } from '@/hooks/useTriage';
import type { AppLocale } from '@/i18n/routing';
import { getListToolbarContent } from '@/components/listToolbar.content';
import { TriageList } from './TriageList';
import { getResultsContent } from './content';
import { getTriageListContent } from './triageList.content';

// The parsed lists: stat cards, tabs, the triage list and the plain lists.
// Shared by /results and Studio's Results page.

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
      background: accent ? 'rgba(var(--t-accent-rgb),0.08)' : 'var(--t-surface1)',
      border: `1px solid ${accent ? 'rgba(var(--t-accent-rgb),0.25)' : 'var(--t-border1)'}`,
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{ fontSize: 12, color: accent ? T.tealMid : T.inkDim, fontFamily: T.mono, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontFamily: T.sans, fontSize: 32, fontWeight: 600, lineHeight: 1, letterSpacing: '-0.035em', color: accent ? T.tealLight : T.ink }}>
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
          background: 'var(--ink)', border: '1px solid var(--line)',
          fontSize: 12, color: 'var(--bg)', lineHeight: 1.5,
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
            className="flex-col gap-1 px-1.5 text-[12px] sm:flex-row sm:gap-2 sm:px-3.5 sm:text-[13px]"
            style={{
              flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              paddingTop: 7, paddingBottom: 7, borderRadius: 10, whiteSpace: 'nowrap',
              background: active ? 'rgba(var(--t-accent-rgb),0.12)' : 'transparent',
              border: `1px solid ${active ? 'rgba(var(--t-accent-rgb),0.3)' : 'transparent'}`,
              color: active ? T.ink : T.inkDim,
              fontWeight: active ? 600 : 400,
              fontFamily: T.sans, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tab.label}</span>
            {/* Tooltips are hover-only, so they just cost width on phones */}
            <span className="hidden sm:inline-flex"><InfoTooltip text={tab.description} /></span>
            <span style={{
              fontSize: 11, padding: '2px 7px', borderRadius: 20, fontFamily: T.mono, flexShrink: 0,
              background: active ? T.tealMid : 'var(--t-border1)',
              color: active ? T.onTeal : T.inkMute,
            }}>
              {tab.count.toLocaleString()}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// studio: Studio's look (number tiles in one card, segmented tabs).
export function ResultsLists({ snapshot, analysis, isPro, locale, studio = false }: {
  snapshot: ParsedSnapshot; analysis: ReturnType<typeof analyzeSnapshot>; isPro: boolean; locale: AppLocale; studio?: boolean;
}) {
  const c = getResultsContent(locale);
  const toolbar = getListToolbarContent(locale);
  const triageC = getTriageListContent(locale);
  const [activeTabId, setActiveTabId] = useState('non-followers');
  const triageKey = triageKeyOf(snapshot);
  const { triage } = useTriage(triageKey);
  const unfollowedCount = useMemo(() => [...triage.values()].filter(s => s === 'done').length, [triage]);

  const tabs: Tab[] = [
    { id: 'non-followers', label: c.tabs.nonFollowers.label, description: c.tabs.nonFollowers.description, count: analysis.nonFollowers.length, accounts: analysis.nonFollowers, csvFilename: `non-followers-${snapshot.exportedAt}.csv`, emptyMessage: c.tabs.nonFollowers.emptyMessage },
    { id: 'fans', label: c.tabs.fans.label, description: c.tabs.fans.description, count: analysis.fans.length, accounts: analysis.fans, csvFilename: `fans-${snapshot.exportedAt}.csv`, emptyMessage: c.tabs.fans.emptyMessage },
    { id: 'mutuals', label: c.tabs.mutuals.label, description: c.tabs.mutuals.description, count: analysis.mutuals.length, accounts: analysis.mutuals, csvFilename: `mutuals-${snapshot.exportedAt}.csv`, emptyMessage: c.tabs.mutuals.emptyMessage },
  ];
  const activeTab = tabs.find(t => t.id === activeTabId) ?? tabs[0]!;

  const n = (x: number) => x.toLocaleString(locale);
  if (studio) {
    const tiles: [string, number][] = [[c.statFollowers, analysis.totalFollowers], [c.statFollowing, analysis.totalFollowing], [c.statMutuals, analysis.mutuals.length], [c.statNonFollowers, analysis.nonFollowers.length]];
    return (
      <>
        <section className="s-card s-kpis">
          {tiles.map(([l, v], i) => (
            <div key={l} className="s-kpi"><span className="s-kl">{l}</span><span className="s-kv"><b style={i === 3 ? { color: 'var(--accent)' } : undefined}>{n(v)}</b>{i === 1 && unfollowedCount > 0 && <span className="s-sub-t" title={c.markedAsUnfollowed(unfollowedCount)}>{c.nowApprox(n(analysis.totalFollowing - unfollowedCount))}</span>}</span></div>
          ))}
        </section>
        <div className="s-seg" role="tablist" style={{ alignSelf: 'flex-start' }}>
          {tabs.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={t.id === activeTabId} title={t.description} className={t.id === activeTabId ? 'on' : undefined} onClick={() => setActiveTabId(t.id)}>
              {t.label}<span className="s-badge" style={{ height: 18, padding: '0 6px' }}>{n(t.count)}</span>
            </button>
          ))}
        </div>
        {activeTabId === 'non-followers' ? (
          <TriageList accounts={analysis.nonFollowers} snapshotKey={triageKey} csvFilename={activeTab.csvFilename} isPro={isPro} c={triageC} toolbar={toolbar} />
        ) : (
          <AccountList key={activeTabId} accounts={activeTab.accounts} csvFilename={activeTab.csvFilename} emptyMessage={activeTab.emptyMessage} content={toolbar} />
        )}
      </>
    );
  }

  return (
    <>
      <div id="tutorial-stats" className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: 10, marginBottom: 24 }}>
        <StatCard label={c.statFollowers} value={analysis.totalFollowers} />
        <StatCard
          label={c.statFollowing}
          value={analysis.totalFollowing}
          badge={unfollowedCount > 0 ? {
            text: c.nowApprox((analysis.totalFollowing - unfollowedCount).toLocaleString()),
            title: c.markedAsUnfollowed(unfollowedCount),
          } : undefined}
        />
        <StatCard label={c.statMutuals} value={analysis.mutuals.length} />
        <StatCard label={c.statNonFollowers} value={analysis.nonFollowers.length} accent />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div id="tutorial-tabbar">
          <TabBar tabs={tabs} activeId={activeTabId} onChange={setActiveTabId} />
        </div>
        {activeTabId === 'non-followers' ? (
          <TriageList accounts={analysis.nonFollowers} snapshotKey={triageKey} csvFilename={activeTab.csvFilename} isPro={isPro} c={triageC} toolbar={toolbar} />
        ) : (
          <AccountList key={activeTabId} accounts={activeTab.accounts} csvFilename={activeTab.csvFilename} emptyMessage={activeTab.emptyMessage} content={toolbar} />
        )}
      </div>
    </>
  );
}
