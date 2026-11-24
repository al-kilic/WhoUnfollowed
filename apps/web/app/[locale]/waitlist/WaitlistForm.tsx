'use client';

import { useActionState, useState, useTransition } from 'react';
import { Link, useRouter } from '@/i18n/navigation';
import { signupAction } from '../signup/actions';
import { getSignupContent, type SignupErrorCode } from '../signup/content';
import { joinWaitlistAction } from './actions';
import { getWaitlistContent } from './content';
import { deriveAndStoreSyncKey } from '@/lib/syncKey';
import { AuthField, AuthError, AuthButton } from '@/components/auth/AuthShell';
import { ANNOUNCE_STORAGE_KEY } from '@/components/announcementBar.content';
import { T } from '@/components/landing/tokens';
import { track, Events } from '@/lib/analytics';
import type { AppLocale } from '@/i18n/routing';

// Joined: the strip has done its job, so hide it from here on.
function hideAnnouncement() {
  try { localStorage.setItem(ANNOUNCE_STORAGE_KEY, 'off'); } catch { /* storage blocked */ }
}

const linkStyle = { color: T.tealMid, fontWeight: 600, textDecoration: 'none' } as const;

// The form card on /waitlist. Signed out: email + password creates a free
// account that is on the waitlist (signupAction with waitlist=on). Signed in:
// one button. Already on the list: the done state.
export function WaitlistForm({ locale, signedInEmail, alreadyJoined }: {
  locale: AppLocale;
  signedInEmail: string | null;
  alreadyJoined: boolean;
}) {
  const c = getWaitlistContent(locale);
  const signup = getSignupContent(locale);
  const router = useRouter();
  const [done, setDone] = useState(alreadyJoined);
  const [joinFailed, setJoinFailed] = useState(false);
  const [joining, startJoin] = useTransition();

  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const password = (formData.get('password') as string) ?? '';
      const res = await signupAction(formData);
      if (res && 'ok' in res && res.ok) {
        try { await deriveAndStoreSyncKey(password, res.saltB64); } catch { /* never blocks signup */ }
        hideAnnouncement();
        track(Events.waitlistJoin, { mode: 'signup' });
        if (res.needsVerification) router.replace('/verify-email');
        else setDone(true);
      }
      return res;
    },
    null,
  );

  const errorCode = state && 'error' in state ? (state.error as SignupErrorCode) : null;

  if (done) {
    return (
      <div role="status" style={{ display: 'grid', gap: 10 }}>
        <h2 style={{ margin: 0, fontFamily: T.serif, fontWeight: 400, fontSize: 30, lineHeight: 1.1, color: T.ink }}>{c.doneTitle}</h2>
        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: T.inkDim }}>{c.doneBody}</p>
        <Link href="/" style={{ ...linkStyle, marginTop: 6, fontSize: 14.5 }}>{c.doneCta} →</Link>
      </div>
    );
  }

  const heading = (
    <div style={{ display: 'grid', gap: 6, marginBottom: 18 }}>
      <h2 style={{ margin: 0, fontFamily: T.serif, fontWeight: 400, fontSize: 30, lineHeight: 1.1, color: T.ink }}>{c.formTitle}</h2>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: T.inkDim }}>{c.formSubtitle}</p>
    </div>
  );

  if (signedInEmail) {
    const join = () => startJoin(async () => {
      const res = await joinWaitlistAction(locale);
      if ('ok' in res) {
        hideAnnouncement();
        track(Events.waitlistJoin, { mode: 'account' });
        setDone(true);
      } else {
        setJoinFailed(true);
      }
    });
    return (
      <div>
        {heading}
        <p style={{ margin: '0 0 14px', fontSize: 13.5, color: T.inkDim }}>
          {c.signedInAs} <strong style={{ color: T.ink, fontWeight: 600 }}>{signedInEmail}</strong>
        </p>
        <form action={join} style={{ display: 'grid', gap: 10 }}>
          {joinFailed && <AuthError>{c.joinError}</AuthError>}
          <AuthButton pending={joining}>{joining ? c.joining : c.join}</AuthButton>
          <span style={{ fontSize: 12, color: T.inkDim, textAlign: 'center' }}>{c.consent}</span>
        </form>
      </div>
    );
  }

  return (
    <div>
      {heading}
      <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="waitlist" value="on" />
        <AuthField label={signup.emailLabel} id="email" name="email" type="email" required autoComplete="email" />
        <AuthField
          label={signup.passwordLabel}
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          hint={signup.passwordHint}
        />
        {errorCode && (
          <AuthError>
            {errorCode === 'email_taken' ? (
              <>{c.emailTaken} <Link href="/login" style={linkStyle}>{c.logIn}</Link></>
            ) : signup.errors[errorCode]}
          </AuthError>
        )}
        <AuthButton pending={pending}>{pending ? c.submitting : c.submit}</AuthButton>
        <span style={{ fontSize: 12, color: T.inkDim, textAlign: 'center', marginTop: -6 }}>{c.consent}</span>
      </form>
      <p style={{ margin: '18px 0 0', fontSize: 13.5, color: T.inkDim, textAlign: 'center' }}>
        {c.haveAccountPre} <Link href="/login" style={linkStyle}>{c.logIn}</Link>
      </p>
    </div>
  );
}
