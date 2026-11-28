'use client';

import { useActionState } from 'react';
import { Link } from '@/i18n/navigation';
import { clearSyncKey } from '@/lib/syncKey';
import { resetPasswordAction } from './actions';
import { AuthShell, AuthField, AuthError, AuthButton } from '@/components/auth/AuthShell';
import { T } from '@/components/landing/tokens';
import { getResetPasswordContent, type ResetPasswordErrorCode } from './content';
import type { AppLocale } from '@/i18n/routing';

export function ResetPasswordForm({ token, locale }: { token: string; locale: AppLocale }) {
  const c = getResetPasswordContent(locale);
  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const res = await resetPasswordAction(formData);
      if (res && 'ok' in res && res.ok) {
        // The old session and sync key are gone; clear any cached key locally.
        clearSyncKey();
      }
      return res;
    },
    null,
  );

  const done = state && 'ok' in state && state.ok;
  const errorCode = state && 'error' in state ? (state.error as ResetPasswordErrorCode) : null;
  const error = errorCode ? c.errors[errorCode] : null;

  if (!token) {
    return (
      <AuthShell
        title={c.invalidLinkTitle}
        subtitle={c.invalidLinkSubtitle}
        footer={
          <Link href="/forgot-password" style={{ color: T.tealMid, fontWeight: 600, textDecoration: 'none' }}>
            {c.requestNewLink}
          </Link>
        }
      >
        <p style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.6 }}>{c.expiresHint}</p>
      </AuthShell>
    );
  }

  if (done) {
    return (
      <AuthShell
        title={c.doneTitle}
        subtitle={c.doneSubtitle}
        footer={
          <Link href="/login" style={{ color: T.tealMid, fontWeight: 600, textDecoration: 'none' }}>
            {c.goToLogIn}
          </Link>
        }
      >
        <p style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.6 }}>
          {c.signedOutHint}
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={c.title}
      subtitle={c.subtitle}
    >
      <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input type="hidden" name="token" value={token} />
        <AuthField
          label={c.newPasswordLabel}
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          hint={c.minCharsHint}
        />
        <AuthField
          label={c.confirmPasswordLabel}
          id="confirm"
          name="confirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />

        <div style={{ display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 10, background: 'color-mix(in srgb, var(--warn) 8%, var(--surface))', border: '1px solid color-mix(in srgb, var(--warn) 35%, var(--line))' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <path d="M12 4 L21 20 H3 Z" stroke="var(--warn)" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M12 10 V14 M12 17 V17.5" stroke="var(--warn)" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <p style={{ fontSize: 13, color: 'var(--warn)', lineHeight: 1.5, margin: 0 }}>
            {c.cloudWarning}
          </p>
        </div>

        {error && <AuthError>{error}</AuthError>}

        <AuthButton pending={pending}>{pending ? c.updating : c.updatePassword}</AuthButton>
      </form>
    </AuthShell>
  );
}
