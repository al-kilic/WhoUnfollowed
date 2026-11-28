import type { CSSProperties } from 'react';

// Your followers as a small network around you (the centre). Lines draw in,
// dots settle, then a few fade to a dashed outline: the ones who left. Two
// teal dots are new. Pure SVG and CSS: positions are fixed (no randomness at
// render time), so server and client draw the same picture.

type Kind = 'f' | 'left' | 'new';
interface Node { x: number; y: number; r: number; k: Kind }

const C = 200;
// Two loose rings, angles in degrees with a little per-node jitter.
const RINGS: { radius: number; n: number; start: number }[] = [
  { radius: 92, n: 10, start: 8 },
  { radius: 158, n: 16, start: 0 },
];
const JITTER = [6, -9, 4, -3, 11, -7, 2, 9, -5, 7, -11, 3, -2, 8, -6, 5];
const LEFT = new Set([3, 14, 21, 24]);
const NEW = new Set([7, 18]);

const NODES: Node[] = RINGS.flatMap((ring, ri) => Array.from({ length: ring.n }, (_, i) => {
  const idx = ri === 0 ? i : RINGS[0]!.n + i;
  const a = ((ring.start + (360 / ring.n) * i + JITTER[i % JITTER.length]!) * Math.PI) / 180;
  const rad = ring.radius + JITTER[(i + 5) % JITTER.length]! * 0.9;
  return {
    x: Math.round((C + Math.cos(a) * rad) * 10) / 10,
    y: Math.round((C + Math.sin(a) * rad) * 10) / 10,
    r: (ri === 0 ? 5.5 : 4) + (JITTER[(i + 2) % JITTER.length]! > 6 ? 1.5 : 0),
    k: LEFT.has(idx) ? 'left' : NEW.has(idx) ? 'new' : 'f',
  };
}));

// Far-off accounts: tiny, faint, unconnected. Depth, not data.
const DUST = Array.from({ length: 18 }, (_, i) => {
  const a = ((i * 20 + JITTER[i % JITTER.length]! * 2) * Math.PI) / 180;
  const rad = 188 + JITTER[(i + 3) % JITTER.length]!;
  return { x: Math.round((C + Math.cos(a) * rad) * 10) / 10, y: Math.round((C + Math.sin(a) * rad) * 10) / 10 };
});

// A few links between neighbours, so it reads as a network, not a clock face.
const LINKS: [number, number][] = [[0, 10], [1, 12], [2, 13], [4, 16], [5, 17], [6, 19], [8, 22], [9, 25], [0, 1], [5, 6], [11, 12], [19, 20]];

const delay = (i: number): CSSProperties => ({ ['--i' as string]: i } as CSSProperties);

export function AuthArt({ label }: { label: string }) {
  return (
    <svg className="a-art" viewBox="0 0 400 400" role="img" aria-label={label}>
      <defs>
        <radialGradient id="a-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={C} cy={C} r="120" fill="url(#a-halo)" />
      {RINGS.map((r) => <circle key={r.radius} className="a-ring" cx={C} cy={C} r={r.radius} />)}
      <g className="a-spin">
        {DUST.map((d, i) => <circle key={`d${i}`} className="a-dust" cx={d.x} cy={d.y} r="1.8" />)}
        {LINKS.map(([a, b], i) => <line key={`l${i}`} className="a-link" style={delay(i)} x1={NODES[a]!.x} y1={NODES[a]!.y} x2={NODES[b]!.x} y2={NODES[b]!.y} />)}
        {NODES.map((n, i) => <line key={`s${i}`} className={`a-spoke ${n.k}`} style={delay(i)} x1={C} y1={C} x2={n.x} y2={n.y} />)}
        {NODES.map((n, i) => <circle key={`n${i}`} className={`a-node ${n.k}`} style={delay(i)} cx={n.x} cy={n.y} r={n.r} />)}
      </g>
      <circle className="a-you-ring" cx={C} cy={C} r="22" />
      <circle className="a-you" cx={C} cy={C} r="13" />
    </svg>
  );
}
