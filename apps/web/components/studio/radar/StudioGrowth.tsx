'use client';

import { useMemo } from 'react';
import { growthTimeline } from '@ig-tracker/core';
import { ArrowRight, Award, TrendingUp, UserMinus, UserPlus } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useStudio } from '../StudioContext';
import { LockBar } from '../Lock';
import type { RadarData } from './RadarGate';
import { getRadarPagesContent } from './radarPages.content';

const W = 1000, H = 220;

// Followers at each saved export, plus gains and losses between them. Counts
// only; locked shows the shape with the numbers blurred.
export function StudioGrowth({ d }: { d: RadarData }) {
  const { locale, hasPro } = useStudio();
  const P = getRadarPagesContent(locale);
  const g = P.gr;
  const locked = !hasPro;
  const n = (v: number) => v.toLocaleString(locale);
  const sig = (v: number) => `${v > 0 ? '+' : v < 0 ? '-' : ''}${n(Math.abs(v))}`;
  const snaps = useMemo(() => [...d.platformSnapshots].sort((a, b) => a.exportedAt - b.exportedAt), [d.platformSnapshots]);
  const flow = useMemo(() => {
    let gained = 0, lost = 0, lastNew = 0, lastLeft = 0;
    for (let i = 1; i < snaps.length; i++) {
      const a = new Set(snaps[i - 1]!.data.followers.map((x) => x.username));
      const b = new Set(snaps[i]!.data.followers.map((x) => x.username));
      const add = [...b].filter((u) => !a.has(u)).length, gone = [...a].filter((u) => !b.has(u)).length;
      gained += add; lost += gone; lastNew = add; lastLeft = gone;
    }
    return { gained, lost, lastNew, lastLeft };
  }, [snaps]);
  const tl = useMemo(() => growthTimeline(d.snapshot), [d.snapshot]);
  const pts = snaps.map((s) => ({ t: s.exportedAt, v: s.data.followers.length }));
  const two = pts.length >= 2;
  const net = two ? pts[pts.length - 1]!.v - pts[0]!.v : 0;
  const fmtD = (t: number) => new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(new Date(t * 1000));
  const best = tl.best ? new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${tl.best.month}-15T12:00:00Z`)) : '–';

  // Chart: real exports when there are two or more, else the months your followers arrived.
  // Without two exports: today's total minus the people who arrived after each month.
  const months = tl.months.slice(-12);
  const series = two ? pts : months.map((m, i) => ({ t: Date.parse(`${m.month}-15T12:00:00Z`) / 1000, v: d.snapshot.followers.length - months.slice(i + 1).reduce((a, x) => a + x.followers, 0) }));
  const lo = Math.min(...series.map((p) => p.v)), hi = Math.max(...series.map((p) => p.v));
  const pad = Math.max(1, (hi - lo) * 0.15);
  const t0 = series[0]?.t ?? 0, t1 = series.at(-1)?.t ?? 1;
  const X = (t: number) => 56 + ((t - t0) / Math.max(1, t1 - t0)) * (W - 76);
  const Y = (v: number) => H - 30 - ((v - (lo - pad)) / Math.max(1, hi - lo + 2 * pad)) * (H - 50);
  const line = series.map((p, i) => `${i ? 'L' : 'M'}${X(p.t).toFixed(1)} ${Y(p.v).toFixed(1)}`).join('');
  const ticks = [lo, Math.round((lo + hi) / 2), hi].filter((v, i, a) => a.indexOf(v) === i);
  const following = d.snapshot.following.length, followers = d.snapshot.followers.length;
  const max = Math.max(followers, following, 1);
  // "2 for every follower" or "1 for every 3 followers", never "1 for every 0.5".
  const dec = (x: number) => (Math.round(x * 10) / 10).toLocaleString(locale, { maximumFractionDigits: 1 });
  const ratioText = !following || !followers ? '–' : following >= followers ? g.perEveryMore(dec(following / followers)) : g.perEvery(dec(followers / following));
  const B = ({ v }: { v: string }) => <b className={locked ? 's-blur' : ''}>{v}</b>;

  return (
    <div className="s-col" style={{ gap: 16 }}>
      {locked && <LockBar feature="radar" text={P.lock.growth} />}
      <section className="s-card s-glow">
        <div className="s-hd" style={{ flexWrap: 'wrap' }}>
          <h3 className="s-h3">{two ? g.title : g.arrived}</h3>
          <span className="s-row" style={{ gap: 10, flexWrap: 'wrap' }}>
            {two && <span className={`s-chip-up${net < 0 ? ' down' : ''}`}><TrendingUp size={13} /><span className={locked ? 's-blur' : ''}>{g.since(sig(net))}</span></span>}
            <span className="s-sub-t" style={{ fontSize: 12.5 }}>{g.exports(pts.length)}</span>
          </span>
        </div>
        {series.length >= 2 ? (
          <div className="s-pad s-chartw">
            <svg className="s-growth" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={g.title}>
              <defs><linearGradient id="s-gg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--accent)" stopOpacity=".22" /><stop offset="1" stopColor="var(--accent)" stopOpacity="0" /></linearGradient></defs>
              <g fontSize="12" fill="var(--faint)">
                {ticks.map((v) => <g key={v}><path d={`M56 ${Y(v).toFixed(1)}H${W - 20}`} stroke="var(--line)" /><text x="48" y={Y(v) + 4} textAnchor="end" className={locked ? 's-blur' : ''}>{n(v)}</text></g>)}
                {series.map((p, i) => (i === 0 || i === series.length - 1 || (series.length <= 8)) && <text key={p.t} x={X(p.t)} y={H - 8} textAnchor="middle">{fmtD(p.t)}</text>)}
              </g>
              <path className="s-fadein" d={`${line}L${X(t1)} ${H - 30}L${X(t0)} ${H - 30}Z`} fill="url(#s-gg)" />
              <path className="s-drawn" pathLength={1} d={line} fill="none" stroke="var(--accent)" strokeWidth={2.6} strokeLinejoin="round" strokeLinecap="round" />
              {series.map((p) => <circle key={p.t} cx={X(p.t)} cy={Y(p.v)} r={4} fill="var(--surface)" stroke="var(--accent)" strokeWidth={2}><title>{`${fmtD(p.t)}: ${locked ? '' : n(p.v)}`}</title></circle>)}
            </svg>
          </div>
        ) : <p className="s-pad s-sub-t" style={{ margin: 0 }}>{g.needTwo}</p>}
        <div className="s-kpis" style={{ borderTop: '1px solid var(--line)' }}>
          {([[g.gained, two ? `+${n(flow.gained)}` : '–', UserPlus], [g.lost, two ? `-${n(flow.lost)}` : '–', UserMinus], [g.net, two ? sig(net) : '–', TrendingUp], [g.best, best, Award]] as const).map(([l, v, Ic]) => (
            <div key={l} className="s-kpi"><span className="s-kl"><Ic size={13} />{l}</span><span className="s-kv"><B v={v} /></span></div>
          ))}
        </div>
      </section>
      <div className="s-grid s-g2" style={{ gap: 16 }}>
        <section className="s-card">
          <div className="s-hd"><h3 className="s-h3">{g.ratio}</h3><span className="s-sub-t" style={{ fontSize: 12.5 }}>{ratioText}</span></div>
          <div className="s-pad s-col" style={{ gap: 14 }}>
            {([[g.followers, followers, 'var(--accent)'], [g.following, following, 'var(--ink)']] as const).map(([l, v, c]) => (
              <div key={l} className="s-fbr" style={{ '--fi': c, gridTemplateColumns: '90px minmax(0,1fr) 64px' } as React.CSSProperties}><span>{l}</span><span className="tr"><i style={{ width: `${(v / max) * 100}%` }} /></span><B v={n(v)} /></div>
            ))}
            <span className="s-sub-t" style={{ fontSize: 13 }}>{tl.months.length ? g.arrivedLine(Math.round(tl.lastYearShare * 100)) : g.ratioLine(n(followers), n(following))}</span>
          </div>
        </section>
        <Link href="/app/radar/people" className="s-card s-glow" style={{ color: 'inherit', textDecoration: 'none' }}>
          <div className="s-hd"><h3 className="s-h3">{g.left}</h3><span className="s-lnk s-row" style={{ gap: 4, fontSize: 13 }}>{P.fx.people}<ArrowRight size={13} /></span></div>
          <div className="s-pad s-col" style={{ gap: 12 }}>
            <div className="s-row" style={{ gap: 24 }}>
              <div><b className={`s-big2${locked ? ' s-blur' : ''}`} style={{ color: two ? 'var(--good)' : 'var(--faint)' }}>{two ? `+${n(flow.lastNew)}` : '–'}</b><span className="s-sub-t">{g.newL}</span></div>
              <div><b className={`s-big2${locked ? ' s-blur' : ''}`} style={{ color: two ? 'var(--bad)' : 'var(--faint)' }}>{two ? `-${n(flow.lastLeft)}` : '–'}</b><span className="s-sub-t">{g.leftL}</span></div>
            </div>
            <span className="s-sub-t" style={{ fontSize: 13 }}>{two ? g.leftLine(flow.lastLeft, n(flow.lastLeft)) : g.needTwo}</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
