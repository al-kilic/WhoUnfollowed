// The goal ring and the small trend line on Today. The ring draws in once on
// mount (CSS, skipped with reduced motion); the trend is a plain SVG line.

const SIZE = 76;
const STROKE = 7;

export function GoalArc({ pct, label }: { pct: number; label: string }) {
  const r = (SIZE - STROKE) / 2;
  const len = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(100, pct));
  return (
    <span className="s-g-arc" style={{ width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={r} strokeWidth={STROKE} className="trk" />
        <circle cx={SIZE / 2} cy={SIZE / 2} r={r} strokeWidth={STROKE} className="val"
          strokeDasharray={len} strokeDashoffset={len * (1 - p / 100)}
          style={{ ['--len' as string]: `${len}` }} />
      </svg>
      <b>{label}</b>
    </span>
  );
}

export function GoalTrend({ points, target, label }: { points: { at: string; followers: number }[]; target: number; label: string }) {
  const W = 240;
  const H = 44;
  const vals = points.map((p) => p.followers);
  // Scale to the counts themselves; the target line shows only when it's near.
  const top = Math.max(...vals);
  const lo = Math.min(...vals);
  const showTarget = target <= top + Math.max(1, top - lo) * 0.5;
  const hi = showTarget ? Math.max(top, target) : top;
  const span = Math.max(1, hi - lo);
  const x = (i: number) => (points.length === 1 ? W : (i / (points.length - 1)) * W);
  const y = (v: number) => H - 4 - ((v - lo) / span) * (H - 8);
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.followers).toFixed(1)}`).join(' ');
  const ty = y(target);
  return (
    <figure className="s-g-trend" aria-label={label}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
        {showTarget && <line x1="0" x2={W} y1={ty} y2={ty} className="tgt" />}
        <path d={`${d} L${W},${H} L0,${H} Z`} className="area" />
        <path d={d} className="ln" />
      </svg>
      <figcaption>{label}</figcaption>
    </figure>
  );
}
