'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { T } from '@/components/landing/tokens';

interface Props {
  hasSyncSetup: boolean;
  passphraseSetAt: Date | null;
  // Pro feature access. Free users see a locked upgrade card instead of the
  // live sync status, since cloud sync is a Pro feature.
  isPro: boolean;
}

const card: CSSProperties = {
  background: T.surface1,
  border: `1px solid ${T.border1}`,
  borderRadius: 16,
  padding: 24,
};

function LockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// Cloud sync no longer needs a separate passphrase. The encryption key is
// derived from the account password at login and cached for the session, so for
// Pro users this is an informational status panel. Free users get a locked
// upgrade card instead.
export function SyncSetup({ hasSyncSetup, passphraseSetAt, isPro }: Props) {
  if (!isPro) {
    return (
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ color: T.inkMute, lineHeight: 0 }}><LockIcon /></span>
          <span style={{ fontFamily: T.serif, fontSize: 18, color: T.ink }}>Cloud sync</span>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', padding: '3px 8px', borderRadius: 100, color: T.tealLight, background: T.tealGlow }}>
            PRO
          </span>
        </div>
        <p style={{ fontSize: 13.5, color: T.inkDim, lineHeight: 1.5, marginBottom: 16 }}>
          Back up your snapshots, encrypted with a key derived from your password,
          and pick up your history on any device. Included with Pro.
        </p>
        <Link
          href="/pricing"
          style={{
            display: 'inline-block', padding: '10px 18px', borderRadius: 10,
            background: T.teal, color: T.cream, textDecoration: 'none',
            fontSize: 13.5, fontWeight: 600, fontFamily: T.sans,
          }}
        >
          Upgrade to Pro
        </Link>
      </div>
    );
  }

  return (
    <div style={card}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', flexShrink: 0, boxShadow: '0 0 8px rgba(34,197,94,0.6)' }} />
        <span style={{ fontFamily: T.serif, fontSize: 18, color: T.ink }}>Cloud sync is on</span>
      </div>
      <p style={{ fontSize: 13.5, color: T.inkDim, lineHeight: 1.5 }}>
        Your snapshots are encrypted in your browser with a key derived from your
        account password before they are stored. We never see your unencrypted
        data. Nothing to set up or remember.
        {hasSyncSetup && passphraseSetAt
          ? ` Enabled ${passphraseSetAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.`
          : ''}
      </p>
    </div>
  );
}
