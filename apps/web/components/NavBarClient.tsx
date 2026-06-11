'use client';

import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { T } from './landing/tokens';

interface Props {
  userEmail: string | null;
}

export function NavBarClient({ userEmail }: Props) {
  return (
    <nav
      className="flex items-center justify-between px-4 sm:px-8 py-4 sticky top-0 z-50"
      style={{ borderBottom: `1px solid ${T.border1}`, backdropFilter: 'blur(14px)', background: T.navBg }}
    >
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <img src="/logo.png" alt="WhoUnfollowed" width={26} height={26} style={{ borderRadius: 7, objectFit: 'contain' }} />
        <span style={{ fontFamily: T.serif, fontSize: 17, color: T.ink }}>WhoUnfollowed</span>
      </Link>

      <div className="flex items-center gap-3 sm:gap-4" style={{ fontSize: 13 }}>
        <Link href="/history" style={{ color: T.inkDim, textDecoration: 'none' }} className="hidden sm:inline">History</Link>
        <Link href="/dashboard" style={{ color: T.inkDim, textDecoration: 'none' }} className="hidden sm:inline">Radar</Link>
        <ThemeToggle />

        {userEmail ? (
          <>
            <span className="hidden sm:inline" style={{ color: T.inkMute, fontSize: 12 }}>{userEmail}</span>
            <form action="/logout" method="POST">
              <button
                type="submit"
                style={{ fontSize: 13, color: T.inkDim, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Log out
              </button>
            </form>
          </>
        ) : (
          <>
            <Link
              href="/login"
              style={{ color: T.inkDim, textDecoration: 'none', fontSize: 13 }}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              style={{
                fontSize: 13, fontWeight: 600, color: T.cream, textDecoration: 'none',
                padding: '7px 14px', borderRadius: 9,
                background: T.teal, border: `1px solid rgba(2,136,143,0.5)`,
              }}
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
