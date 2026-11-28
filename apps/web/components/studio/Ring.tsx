import type { ReactNode } from 'react';

// A progress ring (0 to 100) with something in the middle.
export function Ring({ pct, size, stroke, color = 'var(--accent)', children, label }: { pct: number; size: number; stroke: number; color?: string; children?: ReactNode; label?: string }) {
  const r = (size - stroke) / 2;
  const len = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(100, pct));
  return (
    <span className="s-ringw" style={{ width: size, height: size }} role={label ? 'img' : undefined} aria-label={label}>
      <svg width={size} height={size} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} style={{ stroke: 'var(--sunk)' }} />
        <circle className="bar" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} strokeDasharray={len} strokeDashoffset={len * (1 - p / 100)} style={{ stroke: color }} />
      </svg>
      <span>{children}</span>
    </span>
  );
}
