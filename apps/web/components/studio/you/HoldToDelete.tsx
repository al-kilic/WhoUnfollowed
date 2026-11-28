'use client';

import { useEffect, useRef, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteAccountAction } from '@/app/[locale]/account/actions';
import { useStudio } from '../StudioContext';
import { getYouContent } from './you.content';

const HOLD_MS = 3000;

// Account deletion without a dialog: press and hold the button (mouse, touch,
// or Space/Enter) while a bar fills. Letting go early stops it.
export function HoldToDelete({ errorText }: { errorText: string }) {
  const { locale } = useStudio();
  const t = getYouContent(locale);
  const [p, setP] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const raf = useRef<number | null>(null);
  const start = useRef(0);

  const stop = () => { if (raf.current) cancelAnimationFrame(raf.current); raf.current = null; if (!busy) setP(0); };
  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  async function fire() {
    setBusy(true); setError(false);
    try { await deleteAccountAction(); } catch { setBusy(false); setP(0); setError(true); }
  }
  const begin = () => {
    if (busy || raf.current) return;
    start.current = performance.now();
    const tick = (now: number) => {
      const x = Math.min(1, (now - start.current) / HOLD_MS);
      setP(x);
      if (x >= 1) { raf.current = null; void fire(); return; }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  return (
    <div className="s-col" style={{ gap: 8 }}>
      <button
        type="button" className={`s-hold${p > 0 ? ' on' : ''}`} disabled={busy} aria-describedby="s-hold-hint"
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); begin(); }} onPointerUp={stop} onPointerCancel={stop} onPointerLeave={stop}
        onKeyDown={(e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); begin(); } }} onKeyUp={(e) => { if (e.key === ' ' || e.key === 'Enter') stop(); }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <i style={{ transform: `scaleX(${p})` }} aria-hidden="true" />
        <span><Trash2 size={14} />{busy ? t.deleting : t.hold}</span>
      </button>
      <span id="s-hold-hint" className="s-sub-t" style={{ fontSize: 12 }}>{t.holdHint}</span>
      {error && <span role="alert" style={{ color: 'var(--bad)', fontSize: 13 }}>{errorText}</span>}
    </div>
  );
}
