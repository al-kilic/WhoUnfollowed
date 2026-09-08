'use client';

import { useActionState } from 'react';
import { Link, useRouter } from '@/i18n/navigation';
import { loginAction } from './actions';
import { deriveAndStoreSyncKey } from '@/lib/syncKey';
import { AuthShell, AuthField, AuthError, AuthButton } from '@/components/auth/AuthShell';
import { T } from '@/components/landing/tokens';
import { getLoginContent, type LoginErrorCode } from './content';
import type { AppLocale } from '@/i18n/routing';

export function LoginForm({ locale }: { locale: AppLocale }) {
  const c = getLoginContent(locale);
  const router = useRouter();
  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const password = (formData.get('password') as string) ?? '';
      const res = await loginAction(formData);
      if (res && 'ok' in res && res.ok) {
        // Derive + cache the cloud-sync key from the password, then navigate.
        try {
          await deriveAndStoreSyncKey(password, res.saltB64);
        } catch {
          // sync key derivation must never block login
        }
        // replace (not push) so the browser Back button can't return to the
        // login form after a successful login.
        if ('needsVerification' in res && res.needsVerification) {
          router.replace('/verify-email');
        } else {
          router.replace('/history');
        }
      }
      return res;
    },
    null,
  );

  const errorCode = state && 'error' in state ? (state.error as LoginErrorCode) : null;
  const error = errorCode ? c.errors[errorCode] : null;

  return (
    <AuthShell
      title={c.title}
      subtitle={c.subtitle}
      footer={
        <>
          {c.noAccountPre}{' '}
          <Link href="/signup" style={{ color: T.tealMid, fontWeight: 600, textDecoration: 'none' }}>
            {c.signUpFree}
          </Link>
        </>
      }
    >
      <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input type="hidden" name="locale" value={locale} />
        <AuthField label={c.emailLabel} id="email" name="email" type="email" required autoComplete="email" />
        <AuthField
          label={c.passwordLabel}
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />

        <div style={{ marginTop: -6, textAlign: 'right' }}>
          <Link href="/forgot-password" style={{ fontSize: 12, color: T.tealMid, textDecoration: 'none' }}>
            {c.forgotPassword}
          </Link>
        </div>

        {error && <AuthError>{error}</AuthError>}

        <AuthButton pending={pending}>{pending ? c.loggingIn : c.logIn}</AuthButton>
      </form>
    </AuthShell>
  );
}
