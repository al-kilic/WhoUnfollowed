'use client';

import { useEffect, type ReactNode } from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { proAiPricesAt } from '@/lib/pricing';
import { trackLockedView } from '@/lib/analytics';
import { useStudio } from '../StudioContext';
import { Ring } from '../Ring';
import type { SheetFeature } from '../studio.content';
import { getPreviewContent } from './preview.content';

// The Pro AI preview on locked coach pages: the shape of the result with the
// substance hidden. Text is blurred placeholder (never a fake result about the
// user), numbers show as "?", and a light sweeps over the card. One question, one button.

export function Blur({ children, w }: { children?: ReactNode; w?: string }) {
  return <span className="s-blur" aria-hidden="true" style={w ? { width: w, display: 'inline-block' } : undefined}>{children ?? 'Hidden until you unlock this'}</span>;
}

// Locked previews show "?" where a number would be. A number that kept
// changing read like a real (random) score about the visitor, so the ring and
// the number stay still. lo and hi are kept so callers keep their shape.
export function RollingRing({ size = 96 }: { lo: number; hi: number; size?: number; suffix?: string }) {
  return (
    <Ring pct={60} size={size} stroke={Math.round(size / 10)} color="var(--faint)">
      <b style={{ fontSize: Math.round(size / 4) }}>?</b>
    </Ring>
  );
}

// Props kept so callers keep their shape; the value is always "?".
export function RollingNumber(props: { lo: number; hi: number; prefix?: string }) {
  return <span data-range={`${props.lo}-${props.hi}`}>?</span>;
}

export function ProPreview({ feature, kind, visual, children, wide = false }: {
  feature: SheetFeature; kind: 'check' | 'goal' | 'posted' | 'plan' | 'ideas' | 'write' | 'insights';
  visual?: ReactNode; children?: ReactNode; wide?: boolean;
}) {
  const { locale, openUpgrade } = useStudio();
  const p = getPreviewContent(locale);
  const t = p[kind];
  useEffect(() => { trackLockedView(`studio-${kind}`); }, [kind]);
  return (
    <section className={`s-card s-pp${wide ? ' wide' : ''}`} aria-label={t.title}>
      <div className="s-pp-top">
        {visual}
        <div className="s-col" style={{ gap: 6, minWidth: 0 }}>
          <span className="s-badge acc" style={{ alignSelf: 'flex-start', cursor: 'default' }}><Sparkles size={12} />{p.badge}</span>
          <h2 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-.02em', margin: 0 }}>{t.title}</h2>
          <p className="s-sub-t" style={{ margin: 0, fontSize: 14 }}>{t.body}</p>
        </div>
      </div>
      {children && <div className="s-pp-body">{children}<span className="s-sr">{p.hidden}</span></div>}
      <div className="s-pp-foot">
        <button type="button" className="s-btn acc lg" onClick={() => openUpgrade(feature)}><Lock size={14} />{p.unlock}</button>
        <span className="s-sub-t" style={{ fontSize: 12.5 }}>{p.from(`$${proAiPricesAt().monthly}`)}</span>
      </div>
    </section>
  );
}
