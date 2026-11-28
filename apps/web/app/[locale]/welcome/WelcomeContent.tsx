'use client';

import { useSearchParams } from 'next/navigation';
import { useActionState, Suspense } from 'react';
import { Link } from '@/i18n/navigation';
import { setPasswordAction } from './actions';
import { AuthShell, AuthField, AuthError, AuthButton } from '@/components/auth/AuthShell';
import { T } from '@/components/landing/tokens';
import { getWelcomeContent, type WelcomeErrorCode } from './content';
import type { AppLocale } from '@/i18n/routing';

function WelcomeForm({ locale }: { locale: AppLocale }) {
  const c = getWelcomeContent(locale);
  const params = useSearchParams();
  const sessionId = params.get('session_id') ?? '';

  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => setPasswordAction(formData),
    null,
  );

  const errorCode = state && 'error' in state ? (state.error as WelcomeErrorCode) : null;
  const error = errorCode ? c.errors[errorCode] : null;

  if (!sessionId) {
    return (
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: T.inkDim, marginBottom: 14, lineHeight: 1.5 }}>
          {c.invalidLink}
        </p>
        <Link href="/pricing" style={{ fontSize: 13, color: T.tealMid, fontWeight: 600, textDecoration: 'none' }}>
          {c.backToPricing}
        </Link>
      </div>
    );
  }

  return (
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* subscribe-complete is now tracked server-side from the Stripe webhook (lib/umamiServer.ts). */}
      <input type="hidden" name="sessionId" value={sessionId} />
      <input type="hidden" name="locale" value={locale} />

      <AuthField
        label={c.newPasswordLabel}
        id="password"
        name="password"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
      />
      <AuthField
        label={c.confirmPasswordLabel}
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
      />

      {error && <AuthError>{error}</AuthError>}

      <AuthButton pending={pending}>
        {pending ? c.settingUp : c.setPasswordAndStart}
      </AuthButton>
    </form>
  );
}

export function WelcomeContent({ locale }: { locale: AppLocale }) {
  const c = getWelcomeContent(locale);
  return (
    <AuthShell
      title={c.title}
      subtitle={c.subtitle}
      footer={
        <>
          {c.alreadySetPre}{' '}
          <Link href="/login" style={{ color: T.tealMid, fontWeight: 600, textDecoration: 'none' }}>
            {c.logIn}
          </Link>
        </>
      }
    >
      <Suspense fallback={<p style={{ fontSize: 14, color: T.inkDim }}>{c.loading}</p>}>
        <WelcomeForm locale={locale} />
      </Suspense>
    </AuthShell>
  );
}
