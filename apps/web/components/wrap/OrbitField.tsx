'use client';

import { useEffect, useRef } from 'react';

export type OrbitMode = 'orbit' | 'highlight' | 'weeks' | 'ring' | 'dim';

interface Dot { kind: 0 | 1 | 2; hot: boolean; week: number; slot: number; age: number; a: number; r1: number; r2: number; x: number; y: number; al: number; k: number }

// Big accounts are drawn with at most this many dots (each dot = several accounts).
const MAX_DOTS = 700;
const TAU = Math.PI * 2;
const COLORS = ['63,184,189', '194,174,124', '224,122,85']; // mutual, fan, one-way
const HOT = '244,240,232';

function build(mutuals: number, fans: number, oneWay: number, hot: number, weeks: number[]): Dot[] {
  const total = mutuals + fans + oneWay;
  const scale = total > MAX_DOTS ? MAX_DOTS / total : 1;
  let seed = 11;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const dots: Dot[] = [];
  const add = (kind: 0 | 1 | 2, n: number) => { for (let i = 0; i < Math.round(n * scale); i++) dots.push({ kind, hot: false, week: -1, slot: 0, age: rnd(), a: rnd() * TAU, r1: rnd(), r2: rnd(), x: 0, y: 0, al: 0, k: 0.035 + rnd() * 0.05 }); };
  add(0, mutuals); add(1, fans); add(2, oneWay);
  // The newest followers light up; they come from mutuals and fans alike.
  const followers = dots.filter(d => d.kind !== 2).sort((a, b) => a.r2 - b.r2);
  const nHot = Math.min(followers.length, hot > 0 ? Math.max(1, Math.round(hot * scale)) : 0);
  const sum = weeks.reduce((s, n) => s + n, 0) || 1;
  let i = 0;
  weeks.forEach((n, w) => {
    const take = Math.round((n / sum) * nHot);
    for (let j = 0; j < take && i < nHot; j++, i++) Object.assign(followers[i]!, { hot: true, week: w, slot: j });
  });
  for (; i < nHot; i++) Object.assign(followers[i]!, { hot: true, week: Math.max(0, weeks.length - 1), slot: 0 });
  return dots;
}

// The wrap's living background: every account as a dot circling "you". The
// same dots light up for new followers, stack into weekly columns, and turn
// into a ring with one-way follows drifting off like ghosts.
export function OrbitField({ mutuals, fans, oneWay, hot, weeks, mode }: {
  mutuals: number; fans: number; oneWay: number; hot: number; weeks: number[]; mode: OrbitMode;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dots = build(mutuals, fans, oneWay, hot, weeks);
    const maxWeek = Math.max(1, ...weeks);
    let W = 0, H = 0, raf = 0;
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const target = (d: Dot, t: number) => {
      const wide = W >= 760;
      const S = wide ? { x0: W * 0.46, x1: W * 0.94, y0: H * 0.14, y1: H * 0.86 } : { x0: 16, x1: W - 16, y0: H * 0.08, y1: H * 0.44 };
      const cx = (S.x0 + S.x1) / 2, cy = (S.y0 + S.y1) / 2, R = Math.min(S.x1 - S.x0, S.y1 - S.y0) / 2;
      const m = modeRef.current;
      let x: number, y: number, al = 0.85, size = 1.7, col = COLORS[d.kind]!;
      if (m === 'weeks' && d.hot) {
        const n = weeks.length, cw = (S.x1 - S.x0) / n, gap = Math.min(cw * 0.8, (S.y1 - S.y0) / (maxWeek + 2));
        x = S.x0 + cw * (d.week + 0.5); y = S.y1 - gap * (d.slot + 0.5); col = HOT; size = Math.min(2.6, gap * 0.42); al = 1;
      } else if (m === 'ring') {
        if (d.kind === 2) {
          const prog = (t * (0.03 + d.r2 * 0.03) + d.r1) % 1;
          x = S.x0 + d.r2 * (S.x1 - S.x0) + Math.sin(t * 1.3 + d.r1 * 20) * 14; y = S.y1 + 40 - prog * (S.y1 - S.y0) * 1.5;
          al = 0.5 * Math.sin(prog * Math.PI); size = 2;
        } else { const ang = d.a + t * 0.08; const r = R * (0.72 + (d.r2 - 0.5) * 0.12); x = cx + Math.cos(ang) * r; y = cy + Math.sin(ang) * r; al = 0.7; }
      } else {
        const r = R * (d.kind === 0 ? 0.14 + 0.28 * d.age : d.kind === 1 ? 0.46 + 0.36 * d.age : 0.56 + 0.46 * d.age);
        const sq = d.kind === 2 ? 0.66 + d.r2 * 0.2 : 1;
        const ang = d.a + t * (0.16 / (r / R + 0.35)) * (d.kind === 2 ? -0.6 : 1);
        x = cx + Math.cos(ang) * r; y = cy + Math.sin(ang) * r * sq;
        if (d.kind === 2) al = 0.45 + 0.3 * Math.sin(t * 2 + d.r1 * 9);
        if (m === 'highlight') { if (d.hot) { col = HOT; size = 2.6; al = 1; } else al *= 0.3; }
        if (m === 'dim' || (m === 'weeks' && !d.hot)) { al *= 0.18; size = 1.2; }
      }
      return { x, y, al, size, col };
    };

    for (const d of dots) { const g = target(d, 0); d.x = g.x; d.y = g.y; d.al = g.al; }
    const t0 = performance.now();
    const frame = (now: number) => {
      const t = reduce ? 0 : (now - t0) / 1000;
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      for (const d of dots) {
        const g = target(d, t), k = reduce ? 1 : d.k;
        d.x += (g.x - d.x) * k; d.y += (g.y - d.y) * k; d.al += (g.al - d.al) * 0.1;
        ctx.fillStyle = `rgba(${g.col},${Math.max(0, d.al).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(d.x, d.y, Math.max(0.6, g.size), 0, TAU); ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [mutuals, fans, oneWay, hot, weeks]);

  return <canvas ref={ref} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />;
}
