'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { forgotPasswordAction } from './actions';
import { AuthShell, AuthField, AuthError, AuthButton } from '@/components/auth/AuthShell';
import { T } from '@/components/landing/tokens';

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => forgotPasswordAction(formData),
    null,
  );

  const sent = state && 'ok' in state && state.ok;
  const error = state && 'error' in state ? state.error : null;

  if (sent) {
    return (
      <AuthShell
        title="Check your email"
        subtitle="If an account exists for that address, we sent a link to reset your password. The link is valid for 1 hour."
        footer={
          <Link href="/login" style={{ color: T.tealMid, fontWeight: 600, textDecoration: 'none' }}>
            Back to log in
          </Link>
        }
      >
        <p style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.6 }}>
          Did not get it? Check your spam folder, or try again in a few minutes.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your account email and we'll send you a reset link."
      footer={
        <>
          Remembered it?{' '}
          <Link href="/login" style={{ color: T.tealMid, fontWeight: 600, textDecoration: 'none' }}>
            Log in
          </Link>
        </>
      }
    >
      <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <AuthField label="Email" id="email" name="email" type="email" required autoComplete="email" />
        {error && <AuthError>{error}</AuthError>}
        <AuthButton pending={pending}>{pending ? 'Sending...' : 'Send reset link'}</AuthButton>
      </form>
    </AuthShell>
  );
}
