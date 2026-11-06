'use client';

import { useMemo, useState } from 'react';
import { runHealthChecks, type HealthFinding, type ParsedSnapshot } from '@ig-tracker/core';
import { T } from '@/components/landing/tokens';
import { lockedContentStyle } from '@/components/ProLockOverlay';
import type { AppLocale } from '@/i18n/routing';
import { PLATFORM_NAME, snapshotPlatform } from '@/lib/platform';
import { Events, track } from '@/lib/analytics';
import { getHealthCheckContent, type HealthCheckContent } from './healthCheck.content';
import { ToolCard, ToolLabel, ToolSub, ToolTitle, fill, fmt, toolButton } from './ToolCard';

const SHOW_MAX = 30;

export function FindingRow({ f, c, locale, app, locked, index, active = false, onHover, badge }: {
  f: HealthFinding; c: HealthCheckContent; locale: AppLocale; app: string; locked: boolean;
  // Numbered variant used by the radar: a numbered dot instead of the side bar.
  index?: number | undefined; active?: boolean; onHover?: ((on: boolean) => void) | undefined; badge?: string | undefined;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const params: Record<string, string | number> = { app };
  for (const [k, v] of Object.entries(f.params)) {
    params[k] = k === 'date' ? new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(`${v}T12:00:00Z`)) : k === 'year' || typeof v !== 'number' ? v : fmt(v, locale);
  }
  const copy = c.checks[f.id];
  // Stronger accent for the top of the list; everything else neutral.
  const bar = f.impact >= 60 ? T.terra : f.impact >= 35 ? T.tealMid : 'var(--t-border3)';

  const copyList = async () => {
    try {
      await navigator.clipboard.writeText(f.accounts.map(a => a.username).join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard blocked: nothing to do */ }
  };

  return (
    <li
      onMouseEnter={onHover && (() => onHover(true))}
      onMouseLeave={onHover && (() => onHover(false))}
      style={{ display: 'flex', gap: 14, padding: '14px 10px', margin: '0 -10px', borderTop: '1px solid var(--t-border1)', borderRadius: 10, background: active ? 'var(--t-surface2)' : 'transparent', transition: 'background 0.2s' }}
    >
      {index === undefined
        ? <span aria-hidden="true" style={{ width: 3, borderRadius: 2, background: bar, flexShrink: 0 }} />
        : <span aria-hidden="true" style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontFamily: T.mono, fontWeight: 600, color: '#F4F0E8', background: bar === 'var(--t-border3)' ? 'var(--t-inkMute)' : bar }}>{index}</span>}
      <div style={{ minWidth: 0, flex: 1 }}>
        {badge && <span style={{ display: 'inline-block', marginBottom: 6, fontSize: 10, fontFamily: T.mono, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.terraText, border: '1px solid var(--t-terra)', borderRadius: 999, padding: '2px 8px' }}>{badge}</span>}
        <div style={{ fontSize: 14.5, fontWeight: 600, color: T.ink, lineHeight: 1.4 }}>{fill(copy.title, params)}</div>
        <div style={{ fontSize: 13.5, color: T.inkDim, lineHeight: 1.55, marginTop: 4 }}>{fill(copy.action, params)}</div>
        {f.accounts.length > 0 && !locked && (
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            <button type="button" style={{ ...toolButton, padding: '5px 11px', fontSize: 12 }} aria-expanded={open} onClick={() => { if (!open) track(Events.healthOpened, { check: f.id }); setOpen(o => !o); }}>
              {open ? c.hideAccounts : c.showAccounts(f.accounts.length)}
            </button>
            <button type="button" style={{ ...toolButton, padding: '5px 11px', fontSize: 12 }} onClick={copyList}>
              {copied ? c.copied : c.copyList}
            </button>
          </div>
        )}
        {open && !locked && (
          <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10, listStyle: 'none', padding: 0 }}>
            {f.accounts.slice(0, SHOW_MAX).map(a => (
              <li key={a.username}>
                <a href={a.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontFamily: T.mono, color: T.tealLight, textDecoration: 'none', padding: '3px 8px', borderRadius: 8, border: '1px solid var(--t-border2)', display: 'inline-block' }}>
                  @{a.username}
                </a>
              </li>
            ))}
            {f.accounts.length > SHOW_MAX && <li style={{ fontSize: 12, color: T.inkMute, padding: '3px 4px' }}>{c.more(f.accounts.length - SHOW_MAX)}</li>}
          </ul>
        )}
      </div>
    </li>
  );
}

// Ranked, specific findings for the export on screen. `previous` is the
// prior export of the same platform, when there is one.
// `locked` (free preview): headlines only, never the usernames behind them.
export function HealthCheckCard({ current, previous, locale, pro, locked = false }: {
  current: ParsedSnapshot; previous?: ParsedSnapshot | undefined; locale: AppLocale; pro?: string | undefined; locked?: boolean;
}) {
  const c = getHealthCheckContent(locale);
  const findings = useMemo(() => runHealthChecks({ current, previous }), [current, previous]);
  const app = PLATFORM_NAME[snapshotPlatform(current)];
  const real = findings.filter(f => f.id !== 'second_export').length;

  return (
    <ToolCard id="tutorial-health">
      <ToolLabel pro={pro}>{c.label}</ToolLabel>
      <ToolTitle>{c.title}</ToolTitle>
      <ToolSub>{real > 0 ? `${c.summary(real)}. ${c.sub}` : c.allClear}</ToolSub>
      <ol style={{ listStyle: 'none', padding: 0, margin: 0, ...(locked ? lockedContentStyle : {}) }}>
        {findings.map(f => <FindingRow key={f.id} f={f} c={c} locale={locale} app={app} locked={locked} />)}
      </ol>
    </ToolCard>
  );
}
