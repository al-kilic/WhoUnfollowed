'use client';

import { useEffect } from 'react';
import type { SnapshotComparison } from '@ig-tracker/core';
import { T } from '@/components/landing/tokens';
import { UnfollowerReveal } from '@/components/UnfollowerReveal';
import { getUnfollowerRevealContent } from '@/components/unfollowerReveal.content';
import type { AppLocale } from '@/i18n/routing';

// Shown when a free user uploads a second export: the comparison with their
// last one, mostly blurred, instead of the old "delete or upgrade" dialog.
export function RevealDialog({ comparison, sinceLabel, locale, onContinueFree, onClose, onCheckoutStart }: {
  comparison: SnapshotComparison;
  sinceLabel: string;
  locale: AppLocale;
  onContinueFree: () => void;
  onClose: () => void;
  onCheckoutStart: () => void;
}) {
  const c = getUnfollowerRevealContent(locale);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  const none = comparison.lostFollowers.length === 0;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="unfollower-reveal-title"
      style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div aria-hidden onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }} />
      <div style={{
        position: 'relative', width: '100%', maxWidth: 440, maxHeight: 'calc(100vh - 32px)', overflowY: 'auto',
        borderRadius: 20, background: T.bgCard, border: '1px solid var(--t-border2)', padding: '24px 22px 20px',
        boxShadow: '0 40px 100px rgba(0,0,0,0.6)', animation: 'ig-scale-in 0.25s cubic-bezier(0.16,1,0.3,1) both',
      }}>
        <button onClick={onClose} aria-label={c.close}
          style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: 9, border: 'none', background: T.surface1, color: T.inkDim, cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden><path d="M2 2 L10 10 M10 2 L2 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>
        <UnfollowerReveal
          lostFollowers={comparison.lostFollowers}
          newFollowersCount={comparison.newFollowers.length}
          sinceLabel={sinceLabel}
          locale={locale}
          placement="reveal"
          onCheckoutStart={onCheckoutStart}
        >
          <div style={{ display: 'grid', gap: 4, justifyItems: 'center', paddingTop: 6, borderTop: `1px solid ${T.border1}` }}>
            <button onClick={onContinueFree}
              style={{ background: 'none', border: 'none', padding: '8px 0 0', fontSize: 13, fontWeight: 600, color: none ? T.tealMid : T.inkDim, fontFamily: T.sans, cursor: 'pointer' }}>
              {none ? c.noneCta : c.continueFree}
            </button>
            {!none && <span style={{ fontSize: 11.5, color: T.inkMute, textAlign: 'center' }}>{c.continueFreeNote}</span>}
          </div>
        </UnfollowerReveal>
      </div>
    </div>
  );
}
