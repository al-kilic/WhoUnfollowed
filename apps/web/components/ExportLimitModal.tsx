'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { T } from '@/components/landing/tokens';
import { trackLockedView, trackUpgradeClick } from '@/lib/analytics';

// Shown when an anonymous user tries a second CSV export. Anonymous includes one
// free export; a free account lifts the limit entirely (Pro adds the rest).
export function ExportLimitModal({ onClose }: { onClose: () => void }) {
  useEffect(() => { trackLockedView('csv-limit'); }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(8,12,12,0.8)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative', background: 'rgba(14,18,18,0.98)',
          border: '1px solid rgba(244,240,232,0.1)', borderRadius: 20,
          padding: '32px 36px', maxWidth: 420, width: '100%', textAlign: 'center',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{ position: 'absolute', top: 14, right: 14, width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(244,240,232,0.12)', background: 'transparent', color: T.inkMute, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2 L10 10 M10 2 L2 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>
        <div style={{ fontSize: 10, color: T.tealLight, fontFamily: T.mono, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>Free account</div>
        <h2 style={{ fontFamily: T.serif, fontSize: 24, fontWeight: 400, letterSpacing: '-0.02em', color: T.ink, marginBottom: 10 }}>
          You&apos;ve used your free export
        </h2>
        <p style={{ fontSize: 13.5, color: T.inkDim, lineHeight: 1.55, marginBottom: 22 }}>
          Create a free account and export any list, as often as you like. No credit card.
        </p>
        <Link
          href="/signup"
          style={{ display: 'inline-block', padding: '12px 26px', borderRadius: 11, background: T.teal, color: T.cream, textDecoration: 'none', fontSize: 14, fontWeight: 600, fontFamily: T.sans, boxShadow: '0 8px 24px rgba(2,136,143,0.35)' }}
        >
          Create a free account
        </Link>
        <div style={{ marginTop: 14 }}>
          <Link
            href="/pricing"
            onClick={() => trackUpgradeClick('csv-limit')}
            style={{ fontSize: 12.5, color: T.inkMute, textDecoration: 'none', fontFamily: T.sans }}
          >
            Want history, alerts, and cloud sync too? See Pro →
          </Link>
        </div>
      </div>
    </div>
  );
}
