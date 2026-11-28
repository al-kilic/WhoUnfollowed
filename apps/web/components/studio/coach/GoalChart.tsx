'use client';

import type { GoalView } from '@/lib/ai/goals';
import { useStudio } from '../StudioContext';
import { getGoalsContent } from './goals.content';

// The goal's follower line so far, the straight-line projection and the line
// needed to hit the date.

const DAY = 86_400_000;

export interface Pace { pts: { t: number; v: number }[]; perDay: number | null; neededPerDay: number | null; eta: number | null; end: number; daysLeft: number | null }

export function pace(view: GoalView, now = Date.now()): Pace | null {
  const g = view.goal;
  if (!g) return null;
  const start = { t: new Date(g.setAt).getTime(), v: g.startFollowers };
  const pts = [start, ...view.points.map((p) => ({ t: new Date(p.at).getTime(), v: p.followers })).filter((p) => p.t > start.t)];
  const last = pts[pts.length - 1]!;
  const days = (last.t - start.t) / DAY;
  const perDay = pts.length > 1 && days >= 1 ? (last.v - start.v) / days : null;
  const by = g.by ? new Date(`${g.by}T00:00:00Z`).getTime() : null;
  const left = Math.max(0, g.target - last.v);
  const daysLeft = by ? Math.max(0, Math.ceil((by - now) / DAY)) : null;
  const neededPerDay = by && left > 0 ? left / Math.max(1, (by - last.t) / DAY) : by ? 0 : null;
  const eta = left === 0 ? last.t : perDay && perDay > 0 ? last.t + (left / perDay) * DAY : null;
  const end = by ?? Math.max(start.t + 60 * DAY, eta ?? 0, last.t + 14 * DAY);
  return { pts, perDay, neededPerDay, eta, end: Math.min(end, start.t + 730 * DAY), daysLeft };
}

export function PaceChart({ view, p, label }: { view: GoalView; p: Pace; label: string }) {
  const { locale } = useStudio();
  const g = getGoalsContent(locale).g;
  const T = view.goal!.target;
  const W = 600, H = 220, L = 48, R = 578, top = 20, bot = 182;
  const last = p.pts[p.pts.length - 1]!;
  const proj = p.perDay !== null ? last.v + p.perDay * ((p.end - last.t) / DAY) : null;
  const vals = [...p.pts.map((x) => x.v), T, ...(proj !== null ? [proj] : [])];
  const lo = Math.floor(Math.min(...vals) * 0.98), hi = Math.ceil(Math.max(...vals) * 1.02);
  const t0 = p.pts[0]!.t;
  const X = (t: number) => L + ((t - t0) / Math.max(1, p.end - t0)) * (R - L);
  const Y = (v: number) => bot - ((v - lo) / Math.max(1, hi - lo)) * (bot - top);
  const line = p.pts.map((x, i) => `${i ? 'L' : 'M'}${X(x.t).toFixed(1)} ${Y(x.v).toFixed(1)}`).join(' ');
  const n = (v: number) => Math.round(v).toLocaleString(locale);
  const d = (t: number) => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(t));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} style={{ width: '100%', display: 'block', overflow: 'visible' }}>
      <defs><linearGradient id="s-pa" x1="0" x2="0" y1="0" y2="1"><stop offset="0" style={{ stopColor: 'var(--accent)', stopOpacity: 0.24 }} /><stop offset="1" style={{ stopColor: 'var(--accent)', stopOpacity: 0 }} /></linearGradient></defs>
      <g fontSize="11.5" style={{ fill: 'var(--faint)', fontFamily: 'var(--sans)' }}>
        {[0, 1, 2, 3].map((k) => { const v = lo + ((hi - lo) * k) / 3; return <g key={k}><path d={`M${L} ${Y(v).toFixed(1)}H${R}`} style={{ stroke: 'var(--line)' }} /><text x={L - 8} y={Y(v) + 4} textAnchor="end">{n(v)}</text></g>; })}
        <text x={L} y={206}>{d(t0)}</text><text x={R} y={206} textAnchor="end">{d(p.end)}</text>
      </g>
      {p.pts.length > 1 && <path d={`${line}L${X(last.t).toFixed(1)} ${bot}L${L} ${bot}Z`} fill="url(#s-pa)" />}
      {proj !== null && <path d={`M${X(last.t).toFixed(1)} ${Y(last.v).toFixed(1)}L${R} ${Y(proj).toFixed(1)}`} style={{ stroke: 'var(--faint)' }} strokeWidth={1.6} strokeDasharray="2 4" fill="none" />}
      {view.goal!.by && <path d={`M${X(last.t).toFixed(1)} ${Y(last.v).toFixed(1)}L${R} ${Y(T).toFixed(1)}`} style={{ stroke: 'var(--warn)' }} strokeWidth={1.6} strokeDasharray="6 5" fill="none" />}
      <path d={line} style={{ stroke: 'var(--accent)' }} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {p.pts.map((x) => <circle key={x.t} cx={X(x.t)} cy={Y(x.v)} r={3.5} style={{ fill: 'var(--surface)', stroke: 'var(--accent)' }} strokeWidth={2} />)}
      <g transform={`translate(${R} ${Y(T).toFixed(1)})`}>
        <circle r={5} style={{ fill: 'var(--surface)', stroke: 'var(--warn)' }} strokeWidth={2} />
        <text x={-10} y={-10} textAnchor="end" fontSize={12} fontWeight={600} style={{ fill: 'var(--ink)', fontFamily: 'var(--sans)' }}>{g.goalWord} {n(T)}</text>
      </g>
      <circle cx={X(last.t)} cy={Y(last.v)} r={4.5} style={{ fill: 'var(--accent)', stroke: 'var(--surface)' }} strokeWidth={2} />
    </svg>
  );
}
