'use client';

import { useEffect, useRef, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { useAuth } from '@/components/AuthProvider';
import { avatarSrc, useAvatar } from '@/hooks/useAvatar';
import { clearSyncKey } from '@/lib/syncKey';
import type { HomeCopy } from '@/components/home/copy';

type Nav = HomeCopy['nav'];

// Signed out: "Sign in". Signed in: your avatar (the one picked in Studio,
// kept in this browser) with a small glass menu. Same glass as the language menu.
export function HeaderAccount({ c }: { c: Nav }) {
  const auth = useAuth();
  if (!auth.ready) return <span className="acc-ph" aria-hidden="true" />;
  if (!auth.userEmail) return <Link className="lang-b acc-in" href="/login">{c.signIn}</Link>;
  return <AccountMenu c={c} email={auth.userEmail} seed={auth.userId ?? auth.userEmail} />;
}

function AccountMenu({ c, email, seed }: { c: Nav; email: string; seed: string }) {
  const { value } = useAvatar(seed);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); } };
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('click', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);
  return (
    <div ref={box} className={`lang-dd acc-dd${open ? ' open' : ''}`}>
      <button ref={btn} className="lang-b acc-b" type="button" aria-haspopup="true" aria-expanded={open} aria-label={c.accountMenu} onClick={() => setOpen((o) => !o)}>
        {/* eslint-disable-next-line @next/next/no-img-element -- a local SVG or a data URL from this browser */}
        <img src={avatarSrc(value)} alt="" width={24} height={24} />
      </button>
      <div className="lang-m acc-m" role="menu">
        <span className="acc-mail">{email}</span>
        <Link className="lang-o" role="menuitem" href="/app" onClick={() => setOpen(false)}>{c.studio}</Link>
        <Link className="lang-o" role="menuitem" href="/account" onClick={() => setOpen(false)}>{c.account}</Link>
        <form action="/logout" method="POST" onSubmit={() => clearSyncKey()}>
          <button className="lang-o" role="menuitem" type="submit">{c.signOut}</button>
        </form>
      </div>
    </div>
  );
}

// The phone menu's version: plain links.
export function MobileAccount({ c, close }: { c: Nav; close: () => void }) {
  const auth = useAuth();
  if (!auth.ready) return null;
  if (!auth.userEmail) return <Link href="/login" onClick={close}>{c.signIn}</Link>;
  return (
    <>
      <Link href="/account" onClick={close}>{c.account}</Link>
      <form action="/logout" method="POST" onSubmit={() => clearSyncKey()}><button className="m-out" type="submit">{c.signOut}</button></form>
    </>
  );
}
