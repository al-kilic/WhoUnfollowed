'use client';

import { useActionState } from 'react';
import { Link } from '@/i18n/navigation';
import { forgotPasswordAction } from './actions';
import { AuthShell, AuthField, AuthError, AuthButton } from '@/components/auth/AuthShell';
import { T } from '@/components/landing/tokens';
import { getForgotPasswordContent, type ForgotPasswordErrorCode } from './content';
import type { AppLocale } from '@/i18n/routing';

export function ForgotPasswordForm({ locale }: { locale: AppLocale }) {
  const c = getForgotPasswordContent(locale);
  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => forgotPasswordAction(formData),
    null,
  );

  const sent = state && 'ok' in state && state.ok;
  const errorCode = state && 'error' in state ? (state.error as ForgotPasswordErrorCode) : null;
  const error = errorCode ? c.errors[errorCode] : null;

  if (sent) {
    return (
      <AuthShell
        title={c.sentTitle}
        subtitle={c.sentSubtitle}
        footer={
          <Link href="/login" style={{ color: T.tealMid, fontWeight: 600, textDecoration: 'none' }}>
            {c.backToLogIn}
          </Link>
        }
      >
        <p style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.6 }}>
          {c.didntGetIt}
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={c.title}
      subtitle={c.subtitle}
      footer={
        <>
          {c.rememberedPre}{' '}
          <Link href="/login" style={{ color: T.tealMid, fontWeight: 600, textDecoration: 'none' }}>
            {c.logIn}
          </Link>
        </>
      }
    >
      <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input type="hidden" name="locale" value={locale} />
        <AuthField label={c.emailLabel} id="email" name="email" type="email" required autoComplete="email" />
        {error && <AuthError>{error}</AuthError>}
        <AuthButton pending={pending}>{pending ? c.sending : c.sendResetLink}</AuthButton>
      </form>
    </AuthShell>
  );
}
