'use client';

import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ExternalLink, Download, Search, ChevronDown, ChevronRight, ArrowUpDown, Calendar, CaseSensitive } from 'lucide-react';
import { format } from 'date-fns';
import type { Account } from '@ig-tracker/core';
import { Button } from '@/components/ui/button';
import { useCsvExport } from '@/hooks/useCsvExport';
import { trackUpgradeClick, trackFunnel } from '@/lib/analytics';
import { Link } from '@/i18n/navigation';
import { T } from '@/components/landing/tokens';
import { useTriage, usePreviousTriage, type TriageState } from '@/hooks/useTriage';
import { useAuth } from '@/components/AuthProvider';
import type { ListToolbarContent } from '@/components/listToolbar.content';
import type { TriageListContent, TriageOptionContent } from './triageList.content';

const ROW_HEIGHT = 64;

function visitedKey(snapshotKey: number) { return `ig-tracker:visited-rows:${snapshotKey}`; }

function loadVisited(snapshotKey: number): Set<string> {
  try {
    const raw = localStorage.getItem(visitedKey(snapshotKey));
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch { return new Set(); }
}
function saveVisited(snapshotKey: number, set: Set<string>) {
  try { localStorage.setItem(visitedKey(snapshotKey), JSON.stringify([...set])); } catch {}
}

// ─── Triage config ────────────────────────────────────────────────────────────

function stateConfig(options: TriageOptionContent[], state: TriageState): TriageOptionContent {
  return options.find(o => o.state === state) ?? options[0]!;
}

const OPTION_STYLE: Record<TriageState, { color: string; gradient?: string; bg: string; border: string }> = {
  not_a_fan: { color: T.terra, bg: 'rgba(168,75,47,0.12)', border: 'rgba(168,75,47,0.35)' },
  let_it_slide: { color: T.ink, bg: 'var(--t-surface2)', border: 'var(--t-border2)' },
  done: { color: '#C0392B', gradient: 'linear-gradient(to right, #8B1A1A, #C0392B)', bg: 'rgba(139,26,26,0.1)', border: 'rgba(192,57,43,0.35)' },
  check_later: { color: '#a0956b', bg: 'rgba(160,149,107,0.1)', border: 'rgba(160,149,107,0.3)' },
  deactivated: { color: '#6b7280', bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.3)' },
};

function pickWitty(wittys: string[], username: string): string {
  let hash = 0;
  for (let i = 0; i < username.length; i++) hash = (hash * 31 + username.charCodeAt(i)) >>> 0;
  return wittys[hash % wittys.length]!;
}

// ─── Info popover ────────────────────────────────────────────────────────────

function InfoIcon({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <svg width="12" height="12" viewBox="0 0 14 14" fill="none" style={{ opacity: 0.45, cursor: 'help' }}>
        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M7 6.5V10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="7" cy="4.5" r="0.7" fill="currentColor"/>
      </svg>
      {visible && (
        <span style={{
          position: 'absolute', bottom: '130%', left: '50%', transform: 'translateX(-50%)',
          width: 200, padding: '8px 12px', borderRadius: 8, zIndex: 300,
          background: 'rgba(20,20,20,0.95)', border: '1px solid rgba(255,255,255,0.1)',
          fontSize: 11, color: 'rgba(244,240,232,0.85)', lineHeight: 1.5,
          whiteSpace: 'normal', textAlign: 'left', pointerEvents: 'none',
          boxShadow: '0 6px 24px rgba(0,0,0,0.4)',
        }}>
          {text}
          <span style={{
            position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
            borderTop: '5px solid rgba(20,20,20,0.95)',
          }}/>
        </span>
      )}
    </span>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

interface ToastData { id: string; username: string }

function Toast({ toast, c, onUndo, onDismiss }: { toast: ToastData; c: TriageListContent; onUndo: () => void; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div style={{
      position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 18px', borderRadius: 12,
      background: T.overlay, border: '1px solid var(--t-border3)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      fontSize: 13, color: T.inkDim, fontFamily: T.sans,
      zIndex: 200, whiteSpace: 'nowrap',
      animation: 'toast-in 0.2s ease',
    }}>
      <span>
        <span style={{ color: T.ink }}>{c.toast.addedTo(toast.username)}</span>{' '}
        <span style={{ color: T.inkDim, fontStyle: 'italic' }}>{c.toast.whitelist}</span>
      </span>
      <button
        onClick={onUndo}
        style={{
          padding: '4px 12px', borderRadius: 8,
          border: '1px solid rgba(244,240,232,0.2)',
          background: 'transparent', color: T.ink,
          fontSize: 12, cursor: 'pointer', fontFamily: T.sans, fontWeight: 600,
        }}
      >
        {c.toast.undo}
      </button>
      <style>{`@keyframes toast-in { from { opacity:0; transform: translateX(-50%) translateY(8px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }`}</style>
    </div>
  );
}

// ─── Single row ───────────────────────────────────────────────────────────────

interface RowProps {
  account: Account;
  triageState: TriageState | undefined;
  isVisited: boolean;
  isFocused: boolean;
  c: TriageListContent;
  onTriage: (state: TriageState | null) => void;
  onVisit: () => void;
  onFocus: () => void;
}

function TriageRow({ account, triageState, isVisited, isFocused, c, onTriage, onVisit, onFocus }: RowProps) {
  const [hovered, setHovered] = useState(false);
  const cfg = triageState ? stateConfig(c.options, triageState) : null;
  const style = triageState ? OPTION_STYLE[triageState] : null;

  const isDone        = triageState === 'done';
  const isSlide       = triageState === 'let_it_slide';
  const isDeactivated = triageState === 'deactivated';

  // Actions are revealed on hover (desktop) or focus (tap, on mobile). Hiding
  // them with display:none rather than opacity is deliberate: opacity still
  // reserves the buttons' full width, which on mobile (no hover) permanently
  // squeezes the username to nothing and pushes the link off-screen.
  const showActions = hovered || isFocused || !!triageState;

  return (
    <div
      style={{
        height: ROW_HEIGHT,
        display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px',
        borderBottom: '1px solid var(--t-surface2)',
        borderLeft: isFocused
          ? `3px solid ${T.tealMid}`
          : isVisited
            ? '3px solid rgba(2,136,143,0.4)'
            : '3px solid transparent',
        background: style
          ? style.bg
          : isFocused
            ? 'rgba(2,136,143,0.04)'
            : hovered
              ? 'var(--t-surface1)'
              : 'transparent',
        opacity: isDone || isSlide || isDeactivated ? 0.45 : 1,
        transition: 'all 0.15s',
        cursor: 'default',
        userSelect: 'none',
      }}
      onMouseEnter={() => { setHovered(true); onFocus(); }}
      onMouseLeave={() => setHovered(false)}
      onClick={onFocus}
    >
      {/* Avatar */}
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: 'rgba(2,136,143,0.12)',
        border: '1px solid rgba(2,136,143,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 600, color: T.tealLight,
        flexShrink: 0,
      }}>
        {account.username[0]?.toUpperCase() ?? '?'}
      </div>

      {/* Username + date */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 14, fontWeight: 500, color: T.ink,
          textDecoration: isDone ? 'line-through' : 'none',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          @{account.username}
        </p>
        {account.followedAt && (
          <p style={{ fontSize: 11, color: T.inkMute, marginTop: 1 }}>
            {format(new Date(account.followedAt * 1000), 'MMM d, yyyy')}
          </p>
        )}
      </div>

      {/* Triage buttons - show on hover/focus (tap on mobile) or when triaged.
          display:none when hidden so they reserve no width (see showActions).
          When shown on a narrow screen they shrink and scroll internally so the
          Instagram link stays put and every action stays reachable. */}
      <div id="tutorial-triage-buttons" style={{
        display: showActions ? 'flex' : 'none',
        alignItems: 'center', gap: 6, minWidth: 0, overflowX: 'auto',
      }}>
        {triageState ? (
          // Show current state badge + witty line + clear button
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
              <span style={{
                fontSize: 11, fontFamily: 'monospace', padding: '3px 10px',
                borderRadius: 20, border: `1px solid ${style!.border}`,
                background: style!.bg, whiteSpace: 'nowrap',
                ...(style!.gradient
                  ? { backgroundImage: style!.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }
                  : { color: style!.color }),
              }}>
                {cfg!.label}
              </span>
              <span style={{ fontSize: 10, color: T.inkMute, fontStyle: 'italic', whiteSpace: 'nowrap' }}>
                {pickWitty(cfg!.wittys, account.username)}
              </span>
            </div>
            <button
              onClick={() => onTriage(null)}
              title={c.clear}
              style={{
                width: 22, height: 22, borderRadius: '50%',
                border: '1px solid var(--t-border3)',
                background: 'transparent', color: T.inkMute,
                fontSize: 14, lineHeight: 1, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              ×
            </button>
          </>
        ) : (
          // Show triage action buttons
          c.options.map((opt) => (
            <button
              key={opt.state}
              onClick={() => onTriage(opt.state)}
              style={{
                padding: '4px 10px', borderRadius: 8,
                border: `1px solid ${OPTION_STYLE[opt.state].border}`,
                background: OPTION_STYLE[opt.state].bg, color: OPTION_STYLE[opt.state].color,
                fontSize: 11, fontFamily: 'monospace',
                cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'opacity 0.1s',
              }}
            >
              {opt.label}
            </button>
          ))
        )}
      </div>

      {/* Visited badge */}
      {isVisited && !triageState && (
        <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(2,136,143,0.4)', flexShrink: 0 }}>
          {c.visited}
        </span>
      )}

      {/* Instagram link */}
      <a
        id="tutorial-ig-link"
        href={account.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={c.openOnInstagram(account.username)}
        onClick={onVisit}
        style={{
          flexShrink: 0, padding: 6, borderRadius: 8,
          color: T.inkMute, textDecoration: 'none',
          display: 'flex', alignItems: 'center',
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = T.tealLight)}
        onMouseLeave={e => (e.currentTarget.style.color = T.inkMute)}
      >
        <ExternalLink size={15} />
      </a>
    </div>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ done, total, c }: { done: number; total: number; c: TriageListContent }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const isComplete = pct === 100;

  const message =
    pct === 0   ? null :
    pct < 25    ? c.progress.gettingStarted :
    pct < 50    ? c.progress.gettingSomewhere :
    pct < 100   ? c.progress.halfwayThrough :
                  c.progress.listCleared;

  return (
    <div style={{
      padding: '14px 18px', borderRadius: 12,
      background: isComplete ? 'rgba(2,136,143,0.08)' : 'var(--t-surface1)',
      border: `1px solid ${isComplete ? 'rgba(2,136,143,0.3)' : 'var(--t-border1)'}`,
      transition: 'all 0.3s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontFamily: 'monospace', color: T.inkDim }}>
          {c.progress.triagedOf(done.toLocaleString(), total.toLocaleString())}
        </span>
        <span style={{ fontSize: 12, fontFamily: 'monospace', color: isComplete ? T.tealLight : T.inkMute }}>
          {pct}%
        </span>
      </div>
      <div style={{ height: 4, borderRadius: 4, background: 'var(--t-border1)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 4,
          background: isComplete ? T.tealLight : T.tealMid,
          width: `${pct}%`,
          transition: 'width 0.4s ease',
        }} />
      </div>
      {message && (
        <p style={{ fontSize: 11, color: isComplete ? T.tealLight : T.inkMute, marginTop: 8, fontStyle: 'italic' }}>
          {message}
        </p>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface TriageListProps {
  accounts: Account[];
  snapshotKey: number;
  csvFilename: string;
  // Pro gates the cross-snapshot carry-over (importing triage from a previous
  // export). Single-snapshot triage itself stays free.
  isPro?: boolean;
  c: TriageListContent;
  toolbar: ListToolbarContent;
}

export function TriageList({ accounts, snapshotKey, csvFilename, isPro = false, c, toolbar: tb }: TriageListProps) {
  const { userId } = useAuth();
  const { triage, setTriageState, bulkImportTriage } = useTriage(snapshotKey);

  const [search, setSearch]           = useState('');
  const [sortField, setSortField]     = useState<'username' | 'date'>('date');
  const [sortDir, setSortDir]         = useState<'asc' | 'desc'>('desc');
  const [filterState, setFilterState] = useState<TriageState | 'untriaged' | 'all'>('all');
  const [focusedIndex, setFocusedIdx] = useState<number>(-1);
  const [slideOpen, setSlideOpen]         = useState(false);
  const [deactivatedOpen, setDeactivatedOpen] = useState(false);
  const [visited, setVisited]         = useState<Set<string>>(() => new Set());
  const [toast, setToast]             = useState<ToastData | null>(null);
  const { requestExport, modal } = useCsvExport(csvFilename);
  const [importDismissed, setImportDismissed] = useState(false);
  const [importStates, setImportStates] = useState<Set<TriageState>>(
    new Set(['let_it_slide', 'check_later']),
  );
  const parentRef = useRef<HTMLDivElement>(null);

  const usernameSet = useMemo(() => new Set(accounts.map(a => a.username)), [accounts]);
  const {
    options: prevOptions, selectedKey: prevSelectedKey, setSelectedKey: setPrevSelectedKey,
    matches: prevMatches, loading: prevLoading, loadingMatches: prevLoadingMatches,
  } = usePreviousTriage(snapshotKey, usernameSet, userId);

  useEffect(() => { setVisited(loadVisited(snapshotKey)); }, [snapshotKey]);

  const handleImport = useCallback(async () => {
    const entries = [...prevMatches.entries()]
      .filter(([, state]) => importStates.has(state))
      .map(([username, state]) => ({ username, state }));
    if (entries.length) await bulkImportTriage(entries);
    setImportDismissed(true);
  }, [prevMatches, importStates, bulkImportTriage]);

  const handleTriage = useCallback((username: string, state: TriageState | null) => {
    void setTriageState(username, state);
    if (state === 'let_it_slide') {
      setToast({ id: username + Date.now(), username });
    }
  }, [setTriageState]);

  const markVisited = useCallback((username: string) => {
    setVisited(prev => {
      if (prev.has(username)) return prev;
      const next = new Set(prev);
      next.add(username);
      saveVisited(snapshotKey, next);
      return next;
    });
  }, [snapshotKey]);

  // Split into main queue vs let-it-slide vs deactivated, with search + filter + sort
  const { mainAccounts, slideAccounts, deactivatedAccounts } = useMemo(() => {
    const q = search.trim().toLowerCase();
    const searched = q ? accounts.filter(a => a.username.toLowerCase().includes(q)) : accounts;
    const main: Account[]        = [];
    const slide: Account[]       = [];
    const deactivated: Account[] = [];
    for (const a of searched) {
      const s = triage.get(a.username);
      if (s === 'let_it_slide') { slide.push(a); continue; }
      if (s === 'deactivated')  { deactivated.push(a); continue; }
      if (filterState === 'all') { main.push(a); continue; }
      if (filterState === 'untriaged' && !s) main.push(a);
      else if (filterState !== 'untriaged' && s === filterState) main.push(a);
    }
    const cmp = sortField === 'username'
      ? (a: Account, b: Account) => a.username.localeCompare(b.username)
      : (a: Account, b: Account) => (a.followedAt ?? 0) - (b.followedAt ?? 0);
    main.sort(sortDir === 'asc' ? cmp : (a, b) => -cmp(a, b));
    return { mainAccounts: main, slideAccounts: slide, deactivatedAccounts: deactivated };
  }, [accounts, triage, search, sortField, sortDir, filterState]);

  // Count non-let_it_slide / non-deactivated triaged
  const triaged = useMemo(
    () => accounts.filter(a => {
      const s = triage.get(a.username);
      return s !== undefined && s !== 'let_it_slide' && s !== 'deactivated';
    }).length,
    [accounts, triage],
  );
  const totalForProgress = accounts.length - slideAccounts.length - deactivatedAccounts.length;

  const listHeight = Math.min(560, Math.max(120, mainAccounts.length * ROW_HEIGHT));

  const virtualizer = useVirtualizer({
    count: mainAccounts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  });

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIdx(i => Math.min(i + 1, mainAccounts.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIdx(i => Math.max(i - 1, 0));
      } else if (['1','2','3','4','5'].includes(e.key) && focusedIndex >= 0) {
        const account = mainAccounts[focusedIndex];
        const opt = c.options[Number(e.key) - 1];
        if (account && opt) {
          void setTriageState(account.username, opt.state);
          setFocusedIdx(i => Math.min(i + 1, mainAccounts.length - 1));
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focusedIndex, mainAccounts, setTriageState, c.options]);

  // Scroll focused row into view
  useEffect(() => {
    if (focusedIndex >= 0) virtualizer.scrollToIndex(focusedIndex, { align: 'auto' });
  }, [focusedIndex, virtualizer]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Progress bar */}
      <ProgressBar done={triaged} total={totalForProgress} c={c} />

      {/* Pro teaser: carry-over across exports (shown to free users once they've
          actually triaged something, so the value lands at the right moment). */}
      {!isPro && !importDismissed && triage.size > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
          padding: '12px 16px', borderRadius: 12, marginBottom: 16,
          background: 'linear-gradient(180deg, rgba(2,136,143,0.10), rgba(2,136,143,0.03))',
          border: '1px solid rgba(2,136,143,0.25)',
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.tealLight, fontFamily: T.mono }}>{c.proTeaser.pro}</span>
          <span style={{ flex: 1, minWidth: 200, fontSize: 13, color: T.inkDim, lineHeight: 1.5 }}>
            {c.proTeaser.body}
          </span>
          <Link href="/pricing" onClick={() => { trackUpgradeClick('triage-carryover'); trackFunnel('Upgrade CTA Clicked', { placement: 'results' }); }} style={{ flexShrink: 0, fontSize: 12, fontWeight: 600, fontFamily: T.sans, color: T.cream, textDecoration: 'none', padding: '8px 16px', borderRadius: 9, background: T.teal }}>
            {c.proTeaser.upgradeToPro}
          </Link>
          <button onClick={() => setImportDismissed(true)} aria-label={c.proTeaser.dismissAria} style={{ flexShrink: 0, width: 26, height: 26, borderRadius: 7, border: '1px solid var(--t-border2)', background: 'transparent', color: T.inkMute, cursor: 'pointer', fontFamily: T.sans }}>×</button>
        </div>
      )}

      {/* Previous triage import banner (Pro: carry triage across snapshots) */}
      {isPro && !prevLoading && !importDismissed && triage.size === 0 && prevOptions.length > 0 && (() => {
        const availableCounts = c.importBanner.importable.map(o => ({
          ...o,
          count: [...prevMatches.values()].filter(s => s === o.state).length,
        })).filter(o => o.count > 0);

        const selectedCount = [...prevMatches.entries()]
          .filter(([, s]) => importStates.has(s)).length;

        return (
          <div style={{
            padding: '16px 20px', borderRadius: 14,
            background: 'rgba(2,136,143,0.05)',
            border: '1px solid rgba(2,136,143,0.2)',
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>
                  {c.importBanner.carryOverQuestion}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: T.inkDim, flexShrink: 0 }}>{c.importBanner.from}</span>
                  <select
                    value={prevSelectedKey ?? ''}
                    onChange={e => setPrevSelectedKey(Number(e.target.value))}
                    style={{
                      padding: '4px 10px', borderRadius: 8, fontSize: 12,
                      border: '1px solid var(--t-border3)',
                      background: 'var(--t-surface2)', color: T.ink,
                      fontFamily: T.sans, cursor: 'pointer', outline: 'none',
                    }}
                  >
                    {prevOptions.map(o => (
                      <option key={o.snapshotKey} value={o.snapshotKey}>
                        {o.label} ({o.matchCount} {c.importBanner.match(o.matchCount)})
                      </option>
                    ))}
                  </select>
                  {prevLoadingMatches && (
                    <span style={{ fontSize: 11, color: T.inkMute, fontStyle: 'italic' }}>{c.importBanner.loading}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setImportDismissed(true)}
                aria-label={c.importBanner.dismissAria}
                style={{ background: 'none', border: 'none', color: T.inkMute, cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 2, flexShrink: 0 }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {availableCounts.map(o => {
                const checked = importStates.has(o.state);
                return (
                  <button
                    key={o.state}
                    onClick={() => setImportStates(prev => {
                      const next = new Set(prev);
                      if (next.has(o.state)) next.delete(o.state); else next.add(o.state);
                      return next;
                    })}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 7,
                      padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
                      fontSize: 12, fontFamily: 'monospace',
                      border: `1px solid ${checked ? 'rgba(2,136,143,0.4)' : 'var(--t-border3)'}`,
                      background: checked ? 'rgba(2,136,143,0.1)' : 'transparent',
                      color: checked ? T.tealLight : T.inkDim,
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{
                      width: 14, height: 14, borderRadius: 4, flexShrink: 0,
                      border: `1.5px solid ${checked ? T.tealMid : 'rgba(244,240,232,0.25)'}`,
                      background: checked ? T.tealMid : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {checked && <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 4l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                    </span>
                    {o.label} ({o.count})
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => void handleImport()}
                disabled={selectedCount === 0}
                style={{
                  padding: '8px 18px', borderRadius: 10, cursor: selectedCount === 0 ? 'not-allowed' : 'pointer',
                  fontSize: 13, fontWeight: 600, fontFamily: T.sans,
                  background: selectedCount === 0 ? 'rgba(2,136,143,0.15)' : T.teal,
                  border: 'none', color: selectedCount === 0 ? T.inkMute : T.cream,
                  transition: 'all 0.15s',
                }}
              >
                {c.importBanner.importBtn(selectedCount)}
              </button>
              <button
                onClick={() => setImportDismissed(true)}
                style={{
                  padding: '8px 18px', borderRadius: 10, cursor: 'pointer',
                  fontSize: 13, fontFamily: T.sans,
                  background: 'transparent', border: '1px solid rgba(244,240,232,0.1)',
                  color: T.inkDim,
                }}
              >
                {c.importBanner.startFresh}
              </button>
            </div>
          </div>
        );
      })()}

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 160 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.inkMute, pointerEvents: 'none' }} />
          <input
            type="search"
            placeholder={tb.searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', paddingLeft: 36, paddingRight: 16, paddingTop: 8, paddingBottom: 8,
              borderRadius: 10, border: '1px solid var(--t-border3)',
              background: 'var(--t-surface1)', color: T.ink,
              fontSize: 13, outline: 'none', fontFamily: T.sans,
              boxSizing: 'border-box',
            }}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSortField(f => f === 'username' ? 'date' : 'username')}
          title={sortField === 'username' ? tb.sortingByNameTooltip : tb.sortingByDateTooltip}
        >
          {sortField === 'username' ? <CaseSensitive size={14} /> : <Calendar size={14} />}
          {sortField === 'username' ? tb.nameLabel : tb.dateLabel}
          <ChevronDown size={12} style={{ opacity: 0.5, marginLeft: -2 }} />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
          title={
            sortField === 'username'
              ? (sortDir === 'asc' ? tb.aToZTooltip : tb.zToATooltip)
              : (sortDir === 'asc' ? tb.oldestFirstTooltip : tb.newestFirstTooltip)
          }
        >
          <ArrowUpDown size={14} />
          {sortField === 'username'
            ? (sortDir === 'asc' ? tb.aToZ : tb.zToA)
            : (sortDir === 'asc' ? tb.oldest : tb.newest)}
          <ChevronDown size={12} style={{ opacity: 0.5, marginLeft: -2 }} />
        </Button>
        <Button
          id="tutorial-export-csv"
          variant="outline"
          size="sm"
          onClick={() => requestExport(mainAccounts)}
          disabled={mainAccounts.length === 0}
        >
          <Download size={14} />
          {tb.exportCsv}
        </Button>
      </div>
      {modal}

      {/* Filter pills */}
      {(() => {
        const allCount = accounts.filter(a => { const s = triage.get(a.username); return s !== 'let_it_slide' && s !== 'deactivated'; }).length;
        const untriagedColor = '#8b8fa8'; // muted blue-grey, neutral/pending feel
        const filters: { value: TriageState | 'untriaged' | 'all'; label: string; count: number; color: string; gradient?: string; border?: string; isAll?: boolean; info: string }[] = [
          { value: 'all',       label: c.filters.all,       count: allCount,                                                                            color: T.ink,         isAll: true,  info: c.filters.allInfo },
          { value: 'untriaged', label: c.filters.untriaged, count: accounts.filter(a => !triage.has(a.username)).length,                                color: untriagedColor,              info: c.filters.untriagedInfo },
          ...c.options.filter(o => o.state !== 'let_it_slide').map(o => ({
            value: o.state as TriageState | 'untriaged' | 'all',
            label: o.label,
            count: accounts.filter(a => triage.get(a.username) === o.state).length,
            color: OPTION_STYLE[o.state].color,
            border: OPTION_STYLE[o.state].border,
            info: o.description,
            ...(OPTION_STYLE[o.state].gradient ? { gradient: OPTION_STYLE[o.state].gradient } : {}),
          })),
        ];
        return (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {filters.map(f => {
              const active = filterState === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => setFilterState(f.value)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '5px 11px',
                    borderRadius: 20, fontSize: 12,
                    fontFamily: 'monospace', cursor: 'pointer',
                    fontWeight: f.isAll ? 600 : 400,
                    border: active
                      ? `1px solid ${f.border ?? f.color}`
                      : f.isAll
                        ? '1px solid var(--t-border3)'
                        : '1px solid var(--t-border2)',
                    background: active
                      ? f.isAll ? 'var(--t-border1)' : `${f.color}15`
                      : f.isAll ? 'var(--t-surface1)' : 'transparent',
                    transition: 'all 0.15s',
                    ...(active && f.gradient
                      ? { backgroundImage: f.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }
                      : { color: active ? f.color : f.isAll ? T.inkDim : T.inkMute }),
                  }}
                >
                  {f.label}
                  <span style={{
                    fontSize: 10, fontFamily: 'monospace',
                    padding: '1px 5px', borderRadius: 10,
                    background: active ? 'rgba(128,128,128,0.15)' : 'var(--t-border1)',
                    color: active ? 'inherit' : T.inkMute,
                  }}>
                    {f.count}
                  </span>
                  <InfoIcon text={f.info} />
                </button>
              );
            })}
          </div>
        );
      })()}

      {/* Count */}
      <p style={{ fontSize: 12, color: T.inkMute, fontFamily: 'monospace' }}>
        {mainAccounts.length === accounts.length - slideAccounts.length
          ? c.count.accounts(mainAccounts.length.toLocaleString())
          : c.count.ofTotal(mainAccounts.length.toLocaleString(), (accounts.length - slideAccounts.length).toLocaleString())}
      </p>

      {/* Main list */}
      {mainAccounts.length === 0 && slideAccounts.length === 0 ? (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 16, border: '1px dashed var(--t-border2)',
          padding: '64px 32px', color: T.inkMute, fontSize: 14,
        }}>
          {search ? tb.noResultsFor(search) : c.everyoneEarnedSpot}
        </div>
      ) : mainAccounts.length === 0 ? (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 16, border: `1px solid rgba(2,136,143,0.2)`,
          background: 'rgba(2,136,143,0.04)',
          padding: '48px 32px', color: T.tealLight, fontSize: 14, fontStyle: 'italic',
        }}>
          {c.progress.listCleared}
        </div>
      ) : (
        <div
          ref={parentRef}
          style={{
            height: listHeight, overflowY: 'auto', overflowX: 'hidden',
            borderRadius: 16, border: '1px solid var(--t-border1)',
            background: 'rgba(244,240,232,0.01)',
          }}
        >
          <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
            {virtualizer.getVirtualItems().map(item => {
              const account = mainAccounts[item.index]!;
              return (
                <div
                  key={account.username}
                  style={{ position: 'absolute', top: item.start, left: 0, right: 0, height: ROW_HEIGHT }}
                >
                  <TriageRow
                    account={account}
                    triageState={triage.get(account.username)}
                    isVisited={visited.has(account.username)}
                    isFocused={focusedIndex === item.index}
                    c={c}
                    onTriage={state => handleTriage(account.username, state)}
                    onVisit={() => markVisited(account.username)}
                    onFocus={() => setFocusedIdx(item.index)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <Toast
          toast={toast}
          c={c}
          onUndo={() => { void setTriageState(toast.username, null); setToast(null); }}
          onDismiss={() => setToast(null)}
        />
      )}

      {/* Deactivated section */}
      {deactivatedAccounts.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <button
            onClick={() => setDeactivatedOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, width: '100%',
              padding: '12px 16px', borderRadius: 12,
              background: 'var(--t-surface1)', border: '1px solid var(--t-border1)',
              color: T.inkDim, fontSize: 13, fontFamily: T.sans, cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            {deactivatedOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <span style={{ color: T.inkMute, fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.deactivatedSection.label}</span>
            <span style={{
              fontSize: 13, fontFamily: 'monospace', fontWeight: 700,
              padding: '2px 9px', borderRadius: 20,
              background: 'var(--t-border1)', color: T.ink,
            }}>
              {deactivatedAccounts.length}
            </span>
            <span style={{ fontSize: 11, color: T.inkMute, marginLeft: 'auto', fontStyle: 'italic' }}>
              {c.deactivatedSection.description}
            </span>
          </button>
          {deactivatedOpen && (
            <div style={{
              marginTop: 4, borderRadius: 12,
              border: '1px solid var(--t-border1)',
              background: 'rgba(244,240,232,0.01)',
              overflow: 'hidden',
            }}>
              {deactivatedAccounts.map(account => (
                <TriageRow
                  key={account.username}
                  account={account}
                  triageState="deactivated"
                  isVisited={visited.has(account.username)}
                  isFocused={false}
                  c={c}
                  onTriage={state => handleTriage(account.username, state)}
                  onVisit={() => markVisited(account.username)}
                  onFocus={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Whitelist section */}
      {slideAccounts.length > 0 && (
        <div id="tutorial-whitelist" style={{ marginTop: 8 }}>
          <button
            onClick={() => setSlideOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, width: '100%',
              padding: '12px 16px', borderRadius: 12,
              background: 'var(--t-surface1)', border: '1px solid var(--t-border1)',
              color: T.inkDim, fontSize: 13, fontFamily: T.sans, cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            {slideOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <span style={{ color: T.inkDim, fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.whitelistSection.label}</span>
            <span style={{
              fontSize: 13, fontFamily: 'monospace', fontWeight: 700,
              padding: '2px 9px', borderRadius: 20,
              background: 'var(--t-border1)', color: T.ink,
            }}>
              {slideAccounts.length}
            </span>
            <span style={{ fontSize: 11, color: T.inkMute, marginLeft: 'auto', fontStyle: 'italic' }}>
              {c.whitelistSection.description}
            </span>
          </button>

          {slideOpen && (
            <div style={{
              marginTop: 4, borderRadius: 12,
              border: '1px solid var(--t-border1)',
              background: 'rgba(244,240,232,0.01)',
              overflow: 'hidden',
            }}>
              {slideAccounts.map(account => (
                <TriageRow
                  key={account.username}
                  account={account}
                  triageState="let_it_slide"
                  isVisited={visited.has(account.username)}
                  isFocused={false}
                  c={c}
                  onTriage={state => handleTriage(account.username, state)}
                  onVisit={() => markVisited(account.username)}
                  onFocus={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
