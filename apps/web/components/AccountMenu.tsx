'use client';

import { useState, useEffect, type CSSProperties } from 'react';
import Link from 'next/link';
import { T } from './landing/tokens';

interface Props {
  userEmail: string | null;
  isPro: boolean;
  /** 'bar' = PRO badge + dropdown (default). 'mobile' = flat list for drawers. */
  variant?: 'bar' | 'mobile';
}

const userIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const logoutIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const menuItemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 9,
  padding: '9px 10px',
  borderRadius: 9,
  fontSize: 13,
  color: T.inkDim,
  textDecoration: 'none',
  transition: 'background 0.15s',
};

function AccountBadge({ userEmail, isPro }: { userEmail: string; isPro: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 9px 6px 12px',
          borderRadius: 100,
          cursor: 'pointer',
          fontFamily: T.sans,
          fontSize: 11.5,
          fontWeight: 700,
          letterSpacing: '0.05em',
          color: isPro ? T.cream : T.inkDim,
          background: isPro ? T.teal : 'transparent',
          border: isPro ? `1px solid rgba(2,136,143,0.5)` : `1px solid ${T.border3}`,
          transition: 'all 0.15s',
        }}
      >
        {isPro ? 'PRO' : 'FREE'}
        <svg
          width="9"
          height="9"
          viewBox="0 0 10 10"
          fill="none"
          style={{ opacity: 0.7, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
        >
          <path d="M2 3.5 L5 6.5 L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <>
          {/* click-away backdrop */}
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 150 }} />
          <div
            role="menu"
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 8,
              width: 224,
              borderRadius: 14,
              background: T.overlay,
              border: `1px solid ${T.overlayBorder}`,
              boxShadow: '0 16px 48px rgba(0,0,0,0.22)',
              padding: 6,
              zIndex: 200,
            }}
          >
            <div style={{ padding: '8px 10px 10px', borderBottom: `1px solid ${T.border1}`, marginBottom: 4 }}>
              <div style={{ fontSize: 10, fontFamily: T.mono, letterSpacing: '0.1em', color: T.inkMute, marginBottom: 3 }}>
                {isPro ? 'PRO MEMBER' : 'ACCOUNT'}
              </div>
              <div style={{ fontSize: 12.5, color: T.ink, fontWeight: 500, wordBreak: 'break-all', lineHeight: 1.3 }}>
                {userEmail}
              </div>
            </div>

            <Link
              href="/account"
              role="menuitem"
              onClick={() => setOpen(false)}
              style={menuItemStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = T.surface2;
                e.currentTarget.style.color = T.ink;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = T.inkDim;
              }}
            >
              <span style={{ color: T.tealMid, lineHeight: 0 }}>{userIcon}</span>
              Account &amp; billing
            </Link>

            <form action="/logout" method="POST">
              <button
                type="submit"
                role="menuitem"
                style={{ ...menuItemStyle, width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: T.terra, fontFamily: T.sans }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(168,75,47,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ lineHeight: 0 }}>{logoutIcon}</span>
                Log out
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export function AccountMenu({ userEmail, isPro, variant = 'bar' }: Props) {
  // Logged out
  if (!userEmail) {
    if (variant === 'mobile') {
      return (
        <>
          <Link href="/login" style={{ fontSize: 16, color: T.inkDim, textDecoration: 'none' }}>
            Log in
          </Link>
          <Link href="/signup" style={{ fontSize: 16, fontWeight: 600, color: T.tealLight, textDecoration: 'none' }}>
            Sign up
          </Link>
        </>
      );
    }
    return (
      <>
        <Link href="/login" style={{ fontSize: 13, color: T.inkDim, textDecoration: 'none' }}>
          Log in
        </Link>
        <Link
          href="/signup"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: T.cream,
            textDecoration: 'none',
            padding: '7px 14px',
            borderRadius: 9,
            background: T.teal,
            border: `1px solid rgba(2,136,143,0.5)`,
          }}
        >
          Sign up
        </Link>
      </>
    );
  }

  // Logged in, mobile drawer: flat list (no floating dropdown)
  if (variant === 'mobile') {
    return (
      <>
        <Link href="/account" style={{ fontSize: 16, color: T.inkDim, textDecoration: 'none' }}>
          Account &amp; billing
        </Link>
        <form action="/logout" method="POST">
          <button
            type="submit"
            style={{ fontSize: 16, color: T.terra, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: T.sans }}
          >
            Log out
          </button>
        </form>
      </>
    );
  }

  // Logged in, bar: PRO badge + dropdown
  return <AccountBadge userEmail={userEmail} isPro={isPro} />;
}
