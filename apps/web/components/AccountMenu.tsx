'use client';

import { useState, useEffect, type CSSProperties } from 'react';
import Link from 'next/link';
import { T } from './landing/tokens';

interface Props {
  userEmail: string | null;
  isPro: boolean;
  /** 'bar' = button + dropdown (default). 'mobile' = flat list for drawers. */
  variant?: 'bar' | 'mobile';
}

// Gold "gifted" palette for the earned PRO badge (intentionally distinct from
// the teal brand CTA, so being Pro feels like a reward, not another button).
const GOLD = {
  grad: 'linear-gradient(135deg, #F7DC8A 0%, #E6B954 48%, #C9952F 100%)',
  ink: '#3a2a05',
  border: 'rgba(201,149,47,0.65)',
  glow: '0 2px 12px rgba(214,165,70,0.45)',
};

const sparkle = (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden style={{ flexShrink: 0 }}>
    <path d="M12 2l1.9 5.6L19.5 9.5 13.9 11.4 12 17l-1.9-5.6L4.5 9.5l5.6-1.9L12 2z" />
  </svg>
);

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

const goProStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 13,
  fontWeight: 600,
  fontFamily: T.sans,
  color: T.cream,
  textDecoration: 'none',
  padding: '7px 15px',
  borderRadius: 9,
  background: T.teal,
  border: '1px solid rgba(2,136,143,0.5)',
  whiteSpace: 'nowrap',
};

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

  const badgeStyle: CSSProperties = isPro
    ? {
        color: GOLD.ink,
        background: GOLD.grad,
        border: `1px solid ${GOLD.border}`,
        boxShadow: GOLD.glow,
      }
    : {
        color: T.inkDim,
        background: 'transparent',
        border: `1px solid ${T.border3}`,
      };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          padding: '6px 11px',
          borderRadius: 100,
          cursor: 'pointer',
          fontFamily: T.sans,
          fontSize: 11.5,
          fontWeight: 800,
          letterSpacing: '0.06em',
          transition: 'transform 0.15s, box-shadow 0.15s',
          ...badgeStyle,
        }}
      >
        {isPro && sparkle}
        {isPro ? 'PRO' : 'ACCOUNT'}
        <svg
          width="9"
          height="9"
          viewBox="0 0 10 10"
          fill="none"
          style={{ opacity: 0.65, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
        >
          <path d="M2 3.5 L5 6.5 L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 150 }} />
          <div
            role="menu"
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 8,
              width: 230,
              borderRadius: 14,
              background: T.overlay,
              border: `1px solid ${T.overlayBorder}`,
              boxShadow: '0 16px 48px rgba(0,0,0,0.22)',
              padding: 6,
              zIndex: 200,
            }}
          >
            <div style={{ padding: '8px 10px 10px', borderBottom: `1px solid ${T.border1}`, marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                {isPro && <span style={{ color: '#C9952F', lineHeight: 0 }}>{sparkle}</span>}
                <span style={{ fontSize: 10, fontFamily: T.mono, letterSpacing: '0.1em', color: isPro ? '#C9952F' : T.inkMute }}>
                  {isPro ? 'PRO MEMBER' : 'ACCOUNT'}
                </span>
              </div>
              <div style={{ fontSize: 12.5, color: T.ink, fontWeight: 500, wordBreak: 'break-all', lineHeight: 1.3 }}>
                {userEmail}
              </div>
            </div>

            {!isPro && (
              <Link
                href="/pricing"
                role="menuitem"
                onClick={() => setOpen(false)}
                style={{ ...menuItemStyle, color: GOLD.ink, background: GOLD.grad, fontWeight: 700, marginBottom: 2 }}
              >
                <span style={{ lineHeight: 0 }}>{sparkle}</span>
                Go Pro
              </Link>
            )}

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
  // Logged out: a single "Go Pro" CTA (the upgrade door). Login lives on the
  // destination page, so the nav never pushes "create an account".
  if (!userEmail) {
    if (variant === 'mobile') {
      return (
        <>
          <Link href="/pricing" style={{ ...goProStyle, justifyContent: 'center' }}>
            {sparkle} Go Pro
          </Link>
          <Link href="/login" style={{ fontSize: 15, color: T.inkDim, textDecoration: 'none' }}>
            Log in
          </Link>
        </>
      );
    }
    return (
      <Link href="/pricing" style={goProStyle}>
        {sparkle} Go Pro
      </Link>
    );
  }

  // Logged in, mobile drawer: flat list
  if (variant === 'mobile') {
    return (
      <>
        {!isPro && (
          <Link href="/pricing" style={{ ...goProStyle, justifyContent: 'center', color: GOLD.ink, background: GOLD.grad, border: `1px solid ${GOLD.border}` }}>
            {sparkle} Go Pro
          </Link>
        )}
        <Link href="/account" style={{ fontSize: 15, color: T.inkDim, textDecoration: 'none' }}>
          Account &amp; billing
        </Link>
        <form action="/logout" method="POST">
          <button
            type="submit"
            style={{ fontSize: 15, color: T.terra, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: T.sans }}
          >
            Log out
          </button>
        </form>
      </>
    );
  }

  // Logged in, bar: gold PRO badge (or ACCOUNT chip) + dropdown
  return <AccountBadge userEmail={userEmail} isPro={isPro} />;
}
