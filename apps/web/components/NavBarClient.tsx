'use client';

import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { AccountMenu } from './AccountMenu';
import { T } from './landing/tokens';

interface Props {
  userEmail: string | null;
  isPro?: boolean;
}

export function NavBarClient({ userEmail, isPro = false }: Props) {
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
        <AccountMenu userEmail={userEmail} isPro={isPro} />
      </div>
    </nav>
  );
}
