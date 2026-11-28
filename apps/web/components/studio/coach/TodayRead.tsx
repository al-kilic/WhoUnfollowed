'use client';

import { useEffect, useMemo, useState } from 'react';
import { analyzeSnapshot, growthTimeline, type ParsedSnapshot } from '@ig-tracker/core';
import { ArrowRight, ArrowUpRight, TrendingDown, TrendingUp, UserCheck, UserPlus, Users, UserX } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useStudio } from '../StudioContext';
import { dec, getTodayContent } from './today.content';

// The "Your read" widget: the fans split and four numbers, all computed in
// this browser from the user's own exports.

// Followers over time as an area. With a single point it still draws a flat
// line, so the card never looks empty.
function Area({ values }: { values: number[] }) {
  const v = values.length > 1 ? values : [values[0] ?? 0, values[0] ?? 0];
  const mn = Math.min(...v), mx = Math.max(...v), h = 40;
  const pts = v.map((x, i) => [(i / (v.length - 1)) * 100, h - 3 - ((x - mn) / (mx - mn || 1)) * (h - 10)] as const);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('');
  const last = pts[pts.length - 1]!;
  return (
    <svg className="s-spark" viewBox={`0 0 100 ${h}`} preserveAspectRatio="none" aria-hidden="true" style={{ height: h }}>
      <defs><linearGradient id="s-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--accent)" stopOpacity=".28" /><stop offset="1" stopColor="var(--accent)" stopOpacity="0" /></linearGradient></defs>
      <path d={`${line}L100 ${h}L0 ${h}Z`} fill="url(#s-area)" />
      <path d={line} fill="none" style={{ stroke: 'var(--accent)' }} strokeWidth={2} vectorEffect="non-scaling-stroke" className="s-draw1" pathLength={1} />
      <circle cx={last[0]} cy={last[1]} r={2.6} style={{ fill: 'var(--accent)' }} vectorEffect="non-scaling-stroke" className="s-dot" />
    </svg>
  );
}

// Counts up from 0 once, on mount.
function useCount(to: number, ms = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(to); return; }
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => { const k = Math.min(1, (t - t0) / ms); setV(Math.round(to * (1 - (1 - k) ** 3))); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, ms]);
  return v;
}

function Gauge({ pct }: { pct: number }) {
  const r = 30, len = Math.PI * r, p = Math.max(0, Math.min(100, pct));
  return (
    <svg className="s-gauge" viewBox="0 0 72 40" aria-hidden="true">
      <path d="M6 36 A30 30 0 0 1 66 36" fill="none" style={{ stroke: 'var(--sunk)' }} strokeWidth={7} strokeLinecap="round" />
      <path d="M6 36 A30 30 0 0 1 66 36" fill="none" style={{ stroke: 'var(--good)', ['--len' as string]: len, ['--off' as string]: len - (len * p) / 100 } as React.CSSProperties} strokeWidth={7} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len - (len * p) / 100} className="s-gsweep" />
    </svg>
  );
}

export function TodayRead({ snapshot, previous, dateLabel, children }: { snapshot: ParsedSnapshot; previous: ParsedSnapshot | undefined; dateLabel: string; children: React.ReactNode }) {
  const { locale } = useStudio();
  const t = getTodayContent(locale);
  const a = useMemo(() => analyzeSnapshot(snapshot), [snapshot]);
  const n = (x: number) => x.toLocaleString(locale);
  const followers = a.totalFollowers, following = a.totalFollowing, mutual = a.mutuals.length;
  const fans = Math.max(0, followers - mutual);
  const fanPct = followers ? Math.round((fans / followers) * 100) : 0;
  const noBack = a.nonFollowers.length;
  const noBackPct = following ? Math.round((noBack / following) * 100) : 0;
  const backRate = following ? Math.round((mutual / following) * 100) : 0;
  // Followers over time from the follow dates in this export (one export is enough).
  const tl = useMemo(() => growthTimeline(snapshot), [snapshot]);
  const curve = useMemo(() => { let acc = tl.undated; return tl.months.map((m) => (acc += m.followers)); }, [tl]);
  const firstMonth = tl.months[0] ? new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${tl.months[0].month}-15T12:00:00Z`)) : null;
  const delta = previous ? followers - previous.followers.length : null;
  const noBackN = useCount(noBack), rateN = useCount(backRate);

  // The read leads, as in the prototype; the four numbers sit under it.
  return (
    <section className="s-card s-wg s-glow" style={{ gridColumn: 'span 2' }}>
      <div className="s-read">
        <div className="s-row" style={{ justifyContent: 'space-between', gap: 10 }}>
          <span className="s-lab">{dateLabel}</span>
          <Link href="/app/radar" className="s-btn sec xs">{t.open}<ArrowRight size={13} /></Link>
        </div>
        <h2>{t.fans(fanPct)}</h2>
        <span style={{ fontSize: 15 }}>{t.postFor(n(noBack))}</span>
        {children}
      </div>
      <div className="s-kpis" style={{ borderTop: '1px solid var(--line)' }}>
        <div className="s-kpi">
          <span className="s-kl"><Users size={13} />{t.followers}</span>
          <span className="s-kv"><b>{n(followers)}</b>{delta !== null && delta !== 0 && <span className={delta > 0 ? 's-up' : 's-up dn'}>{delta > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{delta > 0 ? '+' : ''}{n(delta)}</span>}</span>
          <Area values={curve.length ? curve : [followers]} />
          {firstMonth && <span className="s-kf">{t.growthSince(firstMonth)}</span>}
        </div>
        <div className="s-kpi">
          <span className="s-kl"><UserPlus size={13} />{t.following}</span>
          <span className="s-kv"><b>{n(following)}</b></span>
          <div className="s-ratio"><i style={{ width: `${followers ? Math.min(100, (following / followers) * 100) : 0}%` }} /></div>
          {following > 0 && <span className="s-kf">{following > followers ? t.ratioMore(dec(following / Math.max(1, followers), locale)) : t.ratio(dec(followers / following, locale))}</span>}
        </div>
        <div className="s-kpi">
          <span className="s-kl"><UserX size={13} />{t.noBack}</span>
          <span className="s-kv"><b>{n(noBackN)}</b><Link href="/app/results" className="s-kgo">{t.review}<ArrowUpRight size={13} /></Link></span>
          <div className="s-waf" aria-hidden="true">{Array.from({ length: 20 }, (_, i) => <i key={i} className={i < Math.round(noBackPct / 5) ? 'on' : ''} style={{ animationDelay: `${i * 45}ms` }} />)}</div>
          <span className="s-kf">{t.shareOf(noBackPct)}</span>
        </div>
        <div className="s-kpi">
          <span className="s-kl"><UserCheck size={13} />{t.backRate}</span>
          <span className="s-kv"><b>{rateN}%</b></span>
          <span className="s-kf" style={{ order: 9 }}>{t.mutualOf}</span>
          <Gauge pct={backRate} />
        </div>
      </div>
    </section>
  );
}
