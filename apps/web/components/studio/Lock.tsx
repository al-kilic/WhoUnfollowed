'use client';

import { useEffect } from 'react';
import { Lock as LockIcon, Sparkles } from 'lucide-react';
import { trackLockedView } from '@/lib/analytics';
import { useStudio } from './StudioContext';
import type { SheetFeature } from './studio.content';

// Studio locks never cover a whole page. A chip marks what is paid before
// anyone clicks it, and a bar inside the locked section explains what unlocks
// it. Both open the same upgrade sheet, and only on click.

// Pro (the old one-time unlock) is no longer sold, so every lock names Pro AI.
export function LockChip({ feature }: { feature: SheetFeature; needs?: 'pro' | 'proAi' }) {
  const { c, openUpgrade } = useStudio();
  return (
    <button type="button" className="s-badge acc" onClick={() => openUpgrade(feature)}>
      <LockIcon size={11} />{c.lock.proAi}
    </button>
  );
}

export function LockBar({ feature, text, cta }: { feature: SheetFeature; text: string; cta?: string }) {
  const { c, openUpgrade } = useStudio();
  useEffect(() => { trackLockedView(`studio-${feature}`); }, [feature]);
  return (
    <div className="s-lockbar">
      <LockIcon size={16} />
      <span style={{ flex: '1 1 220px' }}>{text}</span>
      <button type="button" className="s-btn xs acc" onClick={() => openUpgrade(feature)}><Sparkles size={14} />{cta ?? c.lock.cta}</button>
    </div>
  );
}
