'use client';

import type { CSSProperties } from 'react';
import type { Curiosity } from '@ig-tracker/core';
import { Download, RefreshCw, Share2 } from 'lucide-react';
import { fill, fmt } from '@/components/tools/ToolCard';
import { curiosityParams } from '@/components/radar/CuriositiesGrid';
import type { RadarPageContent } from '@/components/radar/radar.content';
import type { VerdictState } from '@/hooks/useVerdict';
import type { AppLocale } from '@/i18n/routing';
import { Ring } from '../Ring';
import { PhotoCredit, type useCardPhoto } from './WrapCard';

// Pieces of Radar > Overview, drawn like the prototype: the who-is-who
// ribbon, the "things you didn't know" cards with a small chart each, and the
// verdict card.

export function Ribbon({ mutuals, oneWay, fans, c, locale, big = true }: { mutuals: number; oneWay: number; fans: number; c: RadarPageContent; locale: AppLocale; big?: boolean }) {
  const n = (x: number) => fmt(x, locale);
  const total = Math.max(1, mutuals + oneWay + fans);
  const parts = [['mut', c.cover.mutuals, mutuals], ['one', c.cover.oneWay, oneWay], ['fan', c.cover.fans, fans]] as const;
  return (
    <div className={`s-rib${big ? ' big' : ''}`} role="img" aria-label={c.cover.ribbonAria(n(mutuals), n(oneWay), n(fans))}>
      {parts.filter(([, , v]) => v > 0).map(([k, label, v]) => (
        <span key={k} className={`s-rb ${k}`} style={{ flex: `${v} 1 0` }}>
          <i />
          {big && <><b>{n(v)}</b><small>{label}</small></>}
          <span className="s-tip"><b>{n(v)}</b>{label} · {Math.round((v / total) * 100)}%</span>
        </span>
      ))}
    </div>
  );
}

function Visual({ cu }: { cu: Curiosity }) {
  const p = cu.params;
  const num = (k: string) => Number(p[k] ?? 0);
  if (cu.id === 'since_last') {
    const g = num('gained'), l = num('lost'), mx = Math.max(1, g, l);
    return <div className="s-cv bars2"><i style={{ height: `${Math.max(6, (g / mx) * 100)}%` }} /><i className="neg" style={{ height: `${Math.max(6, (l / mx) * 100)}%` }} /></div>;
  }
  if (cu.series?.length) {
    const mx = Math.max(1, ...cu.series);
    return <div className="s-cv bars">{cu.series.map((v, i) => <i key={i} className={i === cu.highlight ? 'hi' : undefined} style={{ height: `${Math.max(5, (v / mx) * 100)}%`, animationDelay: `${i * 35}ms` }} />)}</div>;
  }
  if (cu.id === 'first_follower') return <div className="s-cv tline"><i /><b /><span>{String(p.date ?? '').match(/\d{4}/)?.[0] ?? ''}</span><span>{String(p.todayLabel ?? '')}</span></div>;
  if (cu.id === 'longest_wait') return <div className="s-cv"><div className="s-meter" style={{ height: 6, width: '100%' }}><i style={{ width: `${Math.min(100, (num('days') / 3650) * 100)}%`, background: 'var(--bad)' }} /></div></div>;
  if (cu.id === 'recent_share') return <div className="s-cv"><Ring pct={num('pct')} size={40} stroke={5} /></div>;
  if (cu.id === 'fans') {
    const on = Math.round(num('pct') / 5);
    return <div className="s-cv waf">{Array.from({ length: 20 }, (_, i) => <i key={i} className={i < on ? 'on' : undefined} style={{ animationDelay: `${i * 30}ms` }} />)}</div>;
  }
  return <div className="s-cv" />;
}

export function CurCard({ cu, c, locale, i, today }: { cu: Curiosity; c: RadarPageContent; locale: AppLocale; i: number; today: string }) {
  const copy = c.curiosities[cu.id];
  const p = curiosityParams(cu, locale);
  return (
    <section className="s-card s-cur s-glow" style={{ '--dl': `${i * 50}ms` } as CSSProperties}>
      <span className="s-lab">{copy.label}</span>
      <b style={{ textTransform: cu.id === 'best_month' || cu.id === 'arrival_weekday' ? 'capitalize' : undefined }}>{fill(copy.value, p)}</b>
      <Visual cu={{ ...cu, params: { ...cu.params, todayLabel: today } }} />
      <span className="s-sub-t">{fill(copy.line, p)}</span>
    </section>
  );
}

export function VerdictCard({ v, ribbon, title, sub, photo }: { v: VerdictState; ribbon: React.ReactNode; title: string; sub: string; photo: ReturnType<typeof useCardPhoto> }) {
  return (
    <section className={`s-card s-verdict${photo.ok ? ' s-onphoto ph' : ''}`} style={photo.ok ? { backgroundImage: `var(--s-scrim-l), url(${photo.src})` } : undefined}>
      <div className="s-vpost">
        <span className="s-vk">{v.c.typeLabel}</span>
        <h2 key={v.name}>{v.name}</h2>
        <p>&ldquo;{v.line}&rdquo;</p>
        {ribbon}
        <div className="s-vst">{v.statRow.map((s) => <span key={s.label}><b>{s.value}</b>{s.label}</span>)}</div>
      </div>
      <div className="s-pad s-col s-vside">
        <h3 className="s-h3">{title}</h3>
        <span className="s-sub-t">{sub}</span>
        <div className="s-row" style={{ gap: 8, flexWrap: 'wrap' }}>
          {v.canShare && <button type="button" className="s-btn onph" disabled={v.busy} onClick={() => void v.share()}><Share2 size={14} />{v.c.share}</button>}
          <button type="button" className={v.canShare ? 's-btn ghost' : 's-btn onph'} disabled={v.busy} onClick={() => void v.save()}><Download size={14} />{v.saved ? v.c.saved : v.c.save}</button>
          <button type="button" className="s-btn ghost" onClick={v.another}><RefreshCw size={14} />{v.c.another}</button>
        </div>
      </div>
      {photo.ok && <PhotoCredit credit={photo.credit} />}
    </section>
  );
}
