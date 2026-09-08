'use client';

import { useActionState, useState, useTransition } from 'react';
import { useRouter } from '@/i18n/navigation';
import { verifyEmailAction, resendVerificationAction } from './actions';
import { AuthShell, AuthField, AuthError, AuthButton } from '@/components/auth/AuthShell';
import { T } from '@/components/landing/tokens';
import { getVerifyEmailContent, type VerifyEmailErrorCode } from './content';
import type { AppLocale } from '@/i18n/routing';

export function VerifyEmailForm({ email, locale }: { email: string; locale: AppLocale }) {
  const c = getVerifyEmailContent(locale);
  const router = useRouter();
  const [resendMsg, setResendMsg] = useState<string | null>(null);
  const [resending, startResend] = useTransition();

  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const res = await verifyEmailAction(formData);
      if (res && 'ok' in res && res.ok) {
        router.replace('/history?welcome=1');
      }
      return res;
    },
    null,
  );

  const errorCode = state && 'error' in state ? (state.error as VerifyEmailErrorCode) : null;
  const error = errorCode ? c.errors[errorCode] : null;

  function handleResend() {
    setResendMsg(null);
    startResend(async () => {
      const res = await resendVerificationAction();
      setResendMsg(
        res && 'ok' in res && res.ok
          ? c.resendSuccess
          : (res && 'error' in res ? c.errors[res.error as VerifyEmailErrorCode] : c.errors.send_failed),
      );
    });
  }

  return (
    <AuthShell
      title={c.title}
      subtitle={c.subtitleTemplate(email)}
    >
      <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <AuthField
          label={c.codeLabel}
          id="code"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          required
          placeholder="000000"
          hint={c.codeHint}
        />

        {error && <AuthError>{error}</AuthError>}

        <AuthButton pending={pending}>{pending ? c.verifying : c.verifyEmail}</AuthButton>
      </form>

      <div style={{ marginTop: 18, textAlign: 'center', fontSize: 13, color: T.inkDim }}>
        {c.didntGetIt}{' '}
        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            color: T.tealMid,
            fontWeight: 600,
            cursor: resending ? 'default' : 'pointer',
            opacity: resending ? 0.6 : 1,
          }}
        >
          {resending ? c.resending : c.resendCode}
        </button>
        {resendMsg && <div style={{ marginTop: 8, color: T.inkMute }}>{resendMsg}</div>}
      </div>
    </AuthShell>
  );
}
