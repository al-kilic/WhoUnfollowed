'use client';

import { useEffect, type CSSProperties } from 'react';
import Link from 'next/link';
import { T } from '@/components/landing/tokens';
import { trackLockedView, trackUpgradeClick } from '@/lib/analytics';

// Style applied to the underlying content so a Pro feature is teased (visible
// shape) but unreadable/uninteractive for free users. Pair with <ProLockOverlay>.
export const lockedContentStyle: CSSProperties = {
  filter: 'blur(7px)',
  pointerEvents: 'none',
  userSelect: 'none',
};

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// Centered "Unlock with Pro" card that floats over blurred Pro content. Render
// it as a sibling of the blurred element inside a position:relative wrapper.
export function ProLockOverlay({
  title,
  description,
  cta = 'Upgrade to Pro',
  href = '/pricing',
  feature = 'unknown',
}: {
  title: string;
  description: string;
  cta?: string;
  href?: string;
  // Identifies which Pro surface this lock guards, for analytics.
  feature?: string;
}) {
  useEffect(() => { trackLockedView(feature); }, [feature]);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '96px 16px 16px',
        zIndex: 20,
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 96,
          maxWidth: 420,
          width: '100%',
          textAlign: 'center',
          background: T.bgCard,
          border: `1px solid ${T.border2}`,
          borderRadius: 20,
          padding: '32px 28px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 13,
            margin: '0 auto 16px',
            background: T.tealGlow,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: T.tealLight,
          }}
        >
          <LockIcon />
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: T.tealLight, fontFamily: T.mono, textTransform: 'uppercase', marginBottom: 10 }}>
          Pro feature
        </div>
        <h2 style={{ fontFamily: T.serif, fontSize: 24, fontWeight: 400, color: T.ink, letterSpacing: '-0.01em', marginBottom: 10 }}>
          {title}
        </h2>
        <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.55, marginBottom: 22 }}>
          {description}
        </p>
        <Link
          href={href}
          onClick={() => trackUpgradeClick(feature)}
          style={{
            display: 'inline-block',
            padding: '12px 26px',
            borderRadius: 11,
            background: T.teal,
            color: T.cream,
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600,
            fontFamily: T.sans,
            boxShadow: '0 8px 24px rgba(2,136,143,0.35)',
          }}
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}
