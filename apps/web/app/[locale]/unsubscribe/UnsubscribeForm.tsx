'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { AuthShell, AuthButton, AuthError } from '@/components/auth/AuthShell';
import { T } from '@/components/landing/tokens';
import { track } from '@/lib/analytics';
import type { UnsubscribeContent } from './content';

// A button rather than an automatic unsubscribe on page load: mail scanners
// open links in emails, and they must not unsubscribe anyone by doing so.
export function UnsubscribeForm({ c }: { c: UnsubscribeContent }) {
  const token = useSearchParams().get('t') ?? '';
  const [state, setState] = useState<'idle' | 'working' | 'done' | 'failed'>('idle');

  async function stop(e: React.FormEvent) {
    e.preventDefault();
    setState('working');
    try {
      const res = await fetch('/api/reminders/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      setState(res.ok ? 'done' : 'failed');
      if (res.ok) track('reminder-unsubscribed');
    } catch {
      setState('failed');
    }
  }

  const home = (
    <Link href="/" style={{ color: T.tealMid, fontWeight: 600, textDecoration: 'none' }}>{c.backHome}</Link>
  );

  if (state === 'done') {
    return (
      <AuthShell title={c.doneTitle} subtitle={c.doneBody} footer={home}>
        <div />
      </AuthShell>
    );
  }

  return (
    <AuthShell title={c.title} subtitle={c.body} footer={home}>
      {!token ? (
        <AuthError>{c.missing}</AuthError>
      ) : (
        <form onSubmit={stop} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {state === 'failed' && <AuthError>{c.failed}</AuthError>}
          <AuthButton pending={state === 'working'}>{state === 'working' ? c.working : c.button}</AuthButton>
        </form>
      )}
    </AuthShell>
  );
}
