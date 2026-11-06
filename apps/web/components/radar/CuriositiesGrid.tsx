'use client';

import { useMemo } from 'react';
import { curiosities, type Curiosity, type ParsedSnapshot } from '@ig-tracker/core';
import { T } from '@/components/landing/tokens';
import type { AppLocale } from '@/i18n/routing';
import { fill, fmt } from '@/components/tools/ToolCard';
import type { RadarPageContent } from './radar.content';

const MAX_SMALL = 4;
const MONDAY = Date.UTC(2024, 0, 1); // a Monday, for weekday names

function params(cu: Curiosity, locale: AppLocale): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(cu.params)) out[k] = typeof v === 'number' ? fmt(v, locale) : v;
  const p = cu.params;
  if (typeof p.month === 'string') out.monthName = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${p.month}-15T12:00:00Z`));
  if (typeof p.weekday === 'number') out.weekdayName = new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' }).format(new Date(MONDAY + p.weekday * 86400000));
  if (typeof p.date === 'string') {
    const d = new Date(`${p.date}T12:00:00Z`);
    out.date = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(d);
    out.year = p.date.slice(0, 4);
  }
  if (typeof p.net === 'number') out.netSigned = `${p.net > 0 ? '+' : p.net < 0 ? '−' : ''}${fmt(Math.abs(p.net), locale)}`;
  return out;
}

function Bars({ series, highlight, labels, height }: { series: number[]; highlight?: number | undefined; labels?: string[] | undefined; height: number }) {
  const max = Math.max(1, ...series);
  return (
    <div aria-hidden="true" style={{ display: 'flex', alignItems: 'flex-end', gap: series.length > 12 ? 2 : 6, height: height + (labels ? 18 : 0) }}>
      {series.map((v, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 0 }}>
          <div style={{
            width: '100%', height: Math.max(2, (v / max) * height), borderRadius: '3px 3px 1px 1px',
            background: i === highlight ? 'var(--t-terra)' : 'var(--t-tealMid)', opacity: i === highlight ? 1 : 0.35,
            transformOrigin: 'bottom', animation: `wu-bar 0.6s ${Math.min(i * 0.02, 0.6)}s cubic-bezier(.2,.7,.2,1) both`,
          }} />
          {labels && <span style={{ fontSize: 9.5, fontFamily: T.mono, color: i === highlight ? T.terraText : T.inkMute }}>{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
}

function Tile({ cu, c, locale, featured }: { cu: Curiosity; c: RadarPageContent; locale: AppLocale; featured: boolean }) {
  const copy = c.curiosities[cu.id];
  const p = params(cu, locale);
  const weekdayLabels = cu.id === 'arrival_weekday'
    ? Array.from({ length: 7 }, (_, i) => new Intl.DateTimeFormat(locale, { weekday: 'narrow', timeZone: 'UTC' }).format(new Date(MONDAY + i * 86400000)))
    : undefined;
  const showBars = cu.series && (featured || cu.id === 'arrival_weekday');

  return (
    <article className={featured ? 'sm:col-span-2 lg:row-span-2' : undefined} style={{
      position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0,
      padding: featured ? 'clamp(22px, 3vw, 32px)' : 20, borderRadius: 18,
      background: featured ? 'linear-gradient(150deg, rgba(1,105,111,0.16), rgba(1,105,111,0.03) 60%), var(--t-surface1)' : 'var(--t-surface1)',
      border: '1px solid var(--t-border1)',
    }}>
      <span style={{ fontSize: 10, fontFamily: T.mono, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.tealMid }}>{copy.label}</span>
      <span style={{
        fontFamily: T.serif, fontSize: featured ? 'clamp(40px, 5.5vw, 64px)' : 'clamp(30px, 3.2vw, 38px)', lineHeight: 1,
        letterSpacing: '-0.03em', color: T.ink, overflowWrap: 'anywhere', textTransform: cu.id === 'best_month' || cu.id === 'arrival_weekday' ? 'capitalize' : undefined,
      }}>{fill(copy.value, p)}</span>
      <p style={{ fontSize: featured ? 15 : 13, color: T.inkDim, lineHeight: 1.5, margin: 0 }}>{fill(copy.line, p)}</p>
      {showBars && <div style={{ marginTop: 'auto', paddingTop: 14 }}><Bars series={cu.series!} highlight={cu.highlight} labels={weekdayLabels} height={featured ? 96 : 40} /></div>}
    </article>
  );
}

// Free, aggregate-only facts from the export: the "huh, really?" layer.
export function CuriositiesGrid({ current, previous, locale, c }: {
  current: ParsedSnapshot; previous?: ParsedSnapshot | undefined; locale: AppLocale; c: RadarPageContent;
}) {
  const list = useMemo(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return curiosities({ current, previous, timeZone: tz });
  }, [current, previous]);

  if (list.length === 0) return <p style={{ fontSize: 14, color: T.inkMute, fontStyle: 'italic' }}>{c.noCuriosities}</p>;

  // The month chart makes the best hero; otherwise the first fact leads.
  const featured = list.find(x => x.id === 'best_month') ?? list[0]!;
  const rest = list.filter(x => x !== featured).slice(0, MAX_SMALL);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: 12, gridAutoRows: 'minmax(150px, auto)' }}>
      <style>{'@keyframes wu-bar { from { transform: scaleY(0) } to { transform: scaleY(1) } } @media (prefers-reduced-motion: reduce) { [style*="wu-bar"] { animation: none !important } }'}</style>
      <Tile cu={featured} c={c} locale={locale} featured />
      {rest.map(cu => <Tile key={cu.id} cu={cu} c={c} locale={locale} featured={false} />)}
    </div>
  );
}
