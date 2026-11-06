'use client';

import { useMemo, useState } from 'react';
import { growthTimeline, type ParsedSnapshot, type TimelineMonth } from '@ig-tracker/core';
import { T } from '@/components/landing/tokens';
import type { AppLocale } from '@/i18n/routing';
import { getGrowthTimelineContent } from './growthTimeline.content';
import { ToolCard, ToolLabel, ToolSub, ToolTitle, fill, fmt, toolButton } from './ToolCard';

const W = 960;
const H = 150;
const GAP = 2;

function monthLabel(key: string, locale: AppLocale, short = false): string {
  return new Intl.DateTimeFormat(locale, { month: short ? 'short' : 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${key}-15T12:00:00Z`));
}

function Bars({ months, locale, tooltip, label }: { months: TimelineMonth[]; locale: AppLocale; tooltip: string; label: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...months.map(m => m.followers));
  const slot = W / months.length;
  const bw = Math.max(1, slot - GAP);
  const h = hover !== null ? months[hover] : undefined;
  // Year ticks on January (and the first month), so long ranges stay legible.
  const firstJan = months.findIndex(m => m.month.endsWith('-01'));
  // The first month gets a label only when the first January is far enough
  // away that the two labels can't collide.
  const ticks = months.map((m, i) => ({ m, i })).filter(({ m, i }) => m.month.endsWith('-01') || (i === 0 && (firstJan === -1 || firstJan * slot > 60)));

  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${W} ${H + 22}`} width="100%" role="img" aria-label={label} style={{ display: 'block', overflow: 'visible' }} onMouseLeave={() => setHover(null)}>
        <line x1={0} x2={W} y1={H} y2={H} stroke="var(--t-border2)" strokeWidth={1} />
        {months.map((m, i) => {
          const bh = m.followers === 0 ? 0 : Math.max(2, (m.followers / max) * (H - 8));
          const r = Math.min(4, bw / 2, bh);
          const x = i * slot + GAP / 2;
          const y = H - bh;
          return (
            <g key={m.month}>
              {bh > 0 && (
                <path
                  d={`M${x},${H} V${y + r} Q${x},${y} ${x + r},${y} H${x + bw - r} Q${x + bw},${y} ${x + bw},${y + r} V${H} Z`}
                  fill={hover === i ? 'var(--t-tealLight)' : 'var(--t-tealMid)'}
                />
              )}
              {/* Hit target taller and wider than the bar. */}
              <rect x={i * slot} y={0} width={slot} height={H} fill="transparent" tabIndex={0}
                aria-label={`${monthLabel(m.month, locale)}: ${fill(tooltip, { count: fmt(m.followers, locale) })}`}
                onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} onBlur={() => setHover(null)} />
            </g>
          );
        })}
        {ticks.map(({ m, i }) => (
          <text key={m.month} x={i * slot + 1} y={H + 16} fontSize={11} fill="var(--t-inkMute)" fontFamily="inherit">{m.month.slice(0, 4)}</text>
        ))}
      </svg>
      {h && hover !== null && (
        <div role="status" style={{
          position: 'absolute', top: 0, left: `${Math.min(80, Math.max(0, (hover / months.length) * 100))}%`,
          background: 'var(--t-bgCard)', border: '1px solid var(--t-border2)', borderRadius: 8, padding: '6px 10px',
          fontSize: 12, color: T.ink, pointerEvents: 'none', whiteSpace: 'nowrap', boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
        }}>
          <div style={{ color: T.inkMute, fontSize: 11 }}>{monthLabel(h.month, locale)}</div>
          <div style={{ fontWeight: 600 }}>{fill(tooltip, { count: fmt(h.followers, locale) })}</div>
        </div>
      )}
    </div>
  );
}

export function GrowthTimelineCard({ snapshot, locale, pro }: { snapshot: ParsedSnapshot; locale: AppLocale; pro?: string | undefined }) {
  const c = getGrowthTimelineContent(locale);
  const t = useMemo(() => growthTimeline(snapshot), [snapshot]);
  const [all, setAll] = useState(false);
  const [table, setTable] = useState(false);
  const months = all ? t.months : t.months.slice(-36);

  return (
    <ToolCard>
      <ToolLabel pro={pro}>{c.label}</ToolLabel>
      <ToolTitle>{c.title}</ToolTitle>
      <ToolSub>{c.sub}</ToolSub>
      {t.months.length === 0 ? (
        <p style={{ fontSize: 13.5, color: T.inkMute }}>{c.empty}</p>
      ) : (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px', fontSize: 13, color: T.ink, marginBottom: 14 }}>
            {t.best && <strong style={{ fontWeight: 600 }}>{fill(c.best, { month: monthLabel(t.best.month, locale), count: fmt(t.best.followers, locale) })}</strong>}
            <span style={{ color: T.inkDim }}>{fill(c.lastYear, { pct: Math.round(t.lastYearShare * 100) })}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            {t.months.length > 36 && (
              <button type="button" style={{ ...toolButton, padding: '5px 11px', fontSize: 12 }} onClick={() => setAll(a => !a)} aria-pressed={all}>
                {all ? c.range3y : c.rangeAll}
              </button>
            )}
            <button type="button" style={{ ...toolButton, padding: '5px 11px', fontSize: 12 }} onClick={() => setTable(v => !v)} aria-pressed={table}>
              {table ? c.showChart : c.showTable}
            </button>
          </div>
          {table ? (
            <div style={{ maxHeight: 260, overflowY: 'auto' }}>
              <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
                <thead><tr style={{ textAlign: 'left', color: T.inkMute }}><th style={{ padding: 6, fontWeight: 500 }}>{c.colMonth}</th><th style={{ padding: 6, fontWeight: 500, textAlign: 'right' }}>{c.colFollowers}</th></tr></thead>
                <tbody>
                  {[...months].reverse().map(m => (
                    <tr key={m.month} style={{ borderTop: '1px solid var(--t-border1)' }}>
                      <td style={{ padding: 6, color: T.ink }}>{monthLabel(m.month, locale, true)}</td>
                      <td style={{ padding: 6, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt(m.followers, locale)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Bars months={months} locale={locale} tooltip={c.tooltip} label={c.chartLabel} />
          )}
          {t.undated > 0 && <p style={{ fontSize: 12, color: T.inkMute, marginTop: 10 }}>{fill(c.undated, { count: fmt(t.undated, locale) })}</p>}
        </>
      )}
    </ToolCard>
  );
}
