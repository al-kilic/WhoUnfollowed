'use client';

import { useActionState, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { verifyEmailAction, resendVerificationAction } from './actions';
import { AuthShell, AuthField, AuthError, AuthButton } from '@/components/auth/AuthShell';
import { T } from '@/components/landing/tokens';

export function VerifyEmailForm({ email }: { email: string }) {
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

  const error = state && 'error' in state ? state.error : null;

  function handleResend() {
    setResendMsg(null);
    startResend(async () => {
      const res = await resendVerificationAction();
      setResendMsg(
        res && 'ok' in res && res.ok
          ? 'A new code is on its way.'
          : (res && 'error' in res ? res.error : 'Could not resend. Try again shortly.') ?? null,
      );
    });
  }

  return (
    <AuthShell
      title="Confirm your email"
      subtitle={`We sent a 6-digit code to ${email}. Enter it below to finish setting up your account.`}
    >
      <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <AuthField
          label="Verification code"
          id="code"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          required
          placeholder="000000"
          hint="The code expires in 15 minutes."
        />

        {error && <AuthError>{error}</AuthError>}

        <AuthButton pending={pending}>{pending ? 'Verifying...' : 'Verify email'}</AuthButton>
      </form>

      <div style={{ marginTop: 18, textAlign: 'center', fontSize: 13, color: T.inkDim }}>
        Didn&apos;t get it?{' '}
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
          {resending ? 'Sending...' : 'Resend code'}
        </button>
        {resendMsg && <div style={{ marginTop: 8, color: T.inkMute }}>{resendMsg}</div>}
      </div>
    </AuthShell>
  );
}
