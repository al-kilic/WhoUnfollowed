'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { HeartHandshake, UserPlus, Users } from 'lucide-react';

// The three numbers at the top of Results: each in its own colour, counting
// up once, with a small meter that says how it compares.

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

export interface StatTile { label: string; value: number; meter: number; note: string; extra?: string | null | undefined; extraTitle?: string | undefined }

const LOOK = [
  { Ic: Users, c: 'var(--accent)' },
  { Ic: UserPlus, c: '#8ab4ff' },
  { Ic: HeartHandshake, c: 'var(--good)' },
];

function Tile({ s, i, locale }: { s: StatTile; i: number; locale: string }) {
  const n = useCount(s.value);
  const { Ic, c } = LOOK[i]!;
  return (
    <div className="s-rstat" style={{ '--tc': c, animationDelay: `${i * 80}ms` } as CSSProperties}>
      <span className="s-rstat-ic"><Ic size={15} /></span>
      <b>{n.toLocaleString(locale)}</b>
      <span>{s.label}</span>
      <i className="s-rstat-m" aria-hidden="true"><i style={{ width: `${Math.max(3, Math.min(100, s.meter))}%`, animationDelay: `${200 + i * 80}ms` }} /></i>
      <small>{s.extra ? <em title={s.extraTitle}>{s.extra}</em> : s.note}</small>
    </div>
  );
}

export function ResultsStats({ tiles, locale }: { tiles: StatTile[]; locale: string }) {
  return <div className="s-rstats">{tiles.map((s, i) => <Tile key={s.label} s={s} i={i} locale={locale} />)}</div>;
}
