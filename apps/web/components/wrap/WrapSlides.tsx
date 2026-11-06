'use client';

import { useEffect, useState, type ReactNode } from 'react';
import type { QuarterWrap } from '@ig-tracker/core';
import { T } from '@/components/landing/tokens';
import type { AppLocale } from '@/i18n/routing';
import { fill, fmt } from '@/components/tools/ToolCard';
import type { OrbitMode } from './OrbitField';
import type { WrapContent } from './wrap.content';

export interface Slide { key: string; mode: OrbitMode; tint: string; dur: number; body: ReactNode }

const CREAM = '#F4F0E8';
export const pill: React.CSSProperties = { font: `600 14px ${T.sans}`, padding: '12px 20px', borderRadius: 999, cursor: 'pointer', border: '1px solid rgba(244,240,232,.3)', background: 'transparent', color: CREAM };
export const pillPrimary: React.CSSProperties = { ...pill, background: CREAM, color: '#0B2426', borderColor: CREAM };
const kicker: React.CSSProperties = { fontFamily: T.mono, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#7fc4c7' };
const huge = (size: string): React.CSSProperties => ({ fontFamily: T.serif, fontWeight: 400, fontSize: size, lineHeight: 0.9, letterSpacing: '-0.045em', margin: '14px 0 0', fontVariantNumeric: 'tabular-nums' });
const line: React.CSSProperties = { fontSize: 'clamp(16px, 1.8vw, 20px)', lineHeight: 1.45, color: 'rgba(244,240,232,.85)', margin: '16px 0 0', maxWidth: '32ch' };

function CountUp({ to, locale }: { to: number; locale: AppLocale }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(to); return; }
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => { const k = Math.min(1, (now - t0) / 1400); setN(Math.round(to * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{fmt(n, locale)}</>;
}

export function dayLabel(v: string | number, locale: AppLocale): string {
  const d = typeof v === 'number' ? new Date(v * 1000) : new Date(`${v}T12:00:00Z`);
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(d);
}

function ProButton({ label, hint, onClick }: { label: string; hint: string; onClick: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 26, flexWrap: 'wrap' }}>
      <button type="button" style={pill} onClick={onClick}>{label} →</button>
      <span style={{ fontFamily: T.mono, fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(244,240,232,.55)' }}>{hint}</span>
    </div>
  );
}

// The wrap's screens, built from the numbers; any screen without data is skipped.
export function buildSlides(o: {
  w: QuarterWrap; c: WrapContent; locale: AppLocale; app: string; isPro: boolean;
  verdict: { name: string; line: string }; onPro: (what: 'follows' | 'left') => void;
  onStart: () => void; onClose: () => void; onReplay: () => void; share: ReactNode;
}): Slide[] {
  const { w, c, locale, app, isPro } = o;
  const n = (x: number) => fmt(x, locale);
  const from = dayLabel(w.start, locale);
  const to = dayLabel(w.end, locale);
  const s: Slide[] = [];

  s.push({ key: 'intro', mode: 'orbit', tint: '#12484b', dur: 0, body: <>
    <div style={kicker}>{c.kicker(app)}</div>
    <h2 style={huge('clamp(52px, 8vw, 96px)')}>{c.introTitle}</h2>
    <p style={line}>{fill(c.introBody, { from })}</p>
    <p style={{ ...line, fontFamily: T.mono, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(244,240,232,.6)' }}>{c.range(from, to)}</p>
    <div style={{ display: 'flex', gap: 8, marginTop: 28, flexWrap: 'wrap' }}>
      <button type="button" style={pillPrimary} onClick={o.onStart}>▶ {c.start}</button>
      <button type="button" style={pill} onClick={o.onClose}>{c.skip}</button>
    </div>
  </> });

  if (w.arrived > 0) {
    const diff = w.arrived - w.arrivedBefore;
    s.push({ key: 'arrived', mode: 'highlight', tint: '#0f5a5e', dur: 5500, body: <>
      <div style={kicker}>{c.arrivedLabel}</div>
      <div style={huge('clamp(110px, 18vw, 220px)')}><CountUp to={w.arrived} locale={locale} /></div>
      <p style={line}>{c.arrivedLine} {diff > 0 ? fill(c.vsMore, { n: n(diff) }) : diff < 0 ? fill(c.vsLess, { n: n(-diff) }) : c.vsSame}</p>
    </> });
  }
  if (w.bestWeek && w.weeks.filter(x => x > 0).length > 1) {
    s.push({ key: 'week', mode: 'weeks', tint: '#5b2a1c', dur: 5500, body: <>
      <div style={kicker}>{c.bestWeekLabel}</div>
      <div style={huge('clamp(56px, 8vw, 104px)')}>{dayLabel(w.bestWeek.start, locale)}</div>
      <p style={line}>{fill(c.bestWeekLine, { date: dayLabel(w.bestWeek.start, locale), n: n(w.bestWeek.count) })}</p>
    </> });
  }
  if (w.arrived > 0 && w.arrivedMutual > 0) {
    s.push({ key: 'mutual', mode: 'highlight', tint: '#0e4d51', dur: 5000, body: <>
      <div style={kicker}>{c.mutualLabel}</div>
      <div style={huge('clamp(110px, 18vw, 220px)')}>{n(w.arrivedMutual)}</div>
      <p style={line}>{fill(c.mutualLine, { total: n(w.arrived) })}</p>
    </> });
  }
  if (w.followsMade > 0) {
    s.push({ key: 'follows', mode: 'dim', tint: '#4a2418', dur: 6500, body: <>
      <div style={kicker}>{c.followsLabel}</div>
      <div style={huge('clamp(110px, 18vw, 220px)')}>{n(w.followsMade)}</div>
      <p style={line}>{fill(c.followsLine, { made: n(w.followsMade), back: n(w.followsBack), pct: Math.round((w.followsBack / w.followsMade) * 100) })}</p>
      {w.followsBack < w.followsMade && <ProButton label={c.seeWhoNot} hint={isPro ? '' : c.proHint} onClick={() => o.onPro('follows')} />}
    </> });
  }
  if (w.spree) {
    s.push({ key: 'spree', mode: 'dim', tint: '#3d3522', dur: 5000, body: <>
      <div style={kicker}>{c.spreeLabel}</div>
      <div style={huge('clamp(110px, 18vw, 220px)')}>{n(w.spree.count)}</div>
      <p style={line}>{fill(c.spreeLine, { date: dayLabel(w.spree.date, locale) })}</p>
    </> });
  }
  if (w.sincePrevious) {
    const p = w.sincePrevious;
    s.push({ key: 'since', mode: 'dim', tint: '#2a2f2c', dur: 6500, body: <>
      <div style={kicker}>{fill(c.sinceLabel, { date: dayLabel(p.date, locale) })}</div>
      <div style={{ display: 'flex', gap: 'clamp(24px, 5vw, 56px)', flexWrap: 'wrap' }}>
        <div><div style={{ ...huge('clamp(88px, 13vw, 160px)'), color: '#7fd6da' }}>+{n(p.gained)}</div><p style={{ ...line, marginTop: 6 }}>{c.sinceGained}</p></div>
        <div><div style={{ ...huge('clamp(88px, 13vw, 160px)'), color: '#ec9575' }}>−{n(p.lost)}</div><p style={{ ...line, marginTop: 6 }}>{c.sinceLost}</p></div>
      </div>
      {p.lost > 0 && <ProButton label={c.seeWhoLeft} hint={isPro ? '' : c.proHint} onClick={() => o.onPro('left')} />}
    </> });
  }
  s.push({ key: 'verdict', mode: 'ring', tint: '#0b3133', dur: 9000, body: <>
    <div style={kicker}>{c.verdictLabel}</div>
    <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 26, color: 'rgba(244,240,232,.7)', marginTop: 14 }}>{c.youAre}</div>
    <h2 className="wu-reveal" style={huge('clamp(56px, 8.5vw, 108px)')}>{o.verdict.name}</h2>
    <p style={{ ...line, fontFamily: T.serif, fontStyle: 'italic', fontSize: 'clamp(19px, 2vw, 23px)' }}>&ldquo;{o.verdict.line}&rdquo;</p>
    {o.share}
  </> });
  s.push({ key: 'outro', mode: 'orbit', tint: '#12484b', dur: 0, body: <>
    <h2 style={huge('clamp(52px, 8vw, 96px)')}>{c.outroTitle}</h2>
    <p style={line}>{c.outroBody}</p>
    <div style={{ display: 'flex', gap: 8, marginTop: 28, flexWrap: 'wrap' }}>
      <button type="button" style={pillPrimary} onClick={o.onClose}>{c.openRadar}</button>
      <button type="button" style={pill} onClick={o.onReplay}>↻ {c.replay}</button>
    </div>
  </> });
  return s;
}
