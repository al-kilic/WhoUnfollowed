'use client';

import { useSearchParams } from 'next/navigation';
import { useActionState, Suspense } from 'react';
import Link from 'next/link';
import { setPasswordAction } from './actions';
import { AuthShell, AuthField, AuthError, AuthButton } from '@/components/auth/AuthShell';
import { T } from '@/components/landing/tokens';

function WelcomeForm() {
  const params = useSearchParams();
  const sessionId = params.get('session_id') ?? '';

  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => setPasswordAction(formData),
    null,
  );

  if (!sessionId) {
    return (
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: T.inkDim, marginBottom: 14, lineHeight: 1.5 }}>
          Invalid link. Please check your email or contact support.
        </p>
        <Link href="/pricing" style={{ fontSize: 13, color: T.tealMid, fontWeight: 600, textDecoration: 'none' }}>
          Back to pricing
        </Link>
      </div>
    );
  }

  return (
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* subscribe-complete is now tracked server-side from the Stripe webhook (lib/umamiServer.ts). */}
      <input type="hidden" name="sessionId" value={sessionId} />

      <AuthField
        label="Choose a password"
        id="password"
        name="password"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
      />
      <AuthField
        label="Confirm password"
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
      />

      {state?.error && <AuthError>{state.error}</AuthError>}

      <AuthButton pending={pending}>
        {pending ? 'Setting up your account...' : 'Set password and get started'}
      </AuthButton>
    </form>
  );
}

export default function WelcomePage() {
  return (
    <AuthShell
      title="Welcome to WhoUnfollowed"
      subtitle="Your payment is confirmed. Set a password to access your account."
      footer={
        <>
          Already set your password?{' '}
          <Link href="/login" style={{ color: T.tealMid, fontWeight: 600, textDecoration: 'none' }}>
            Log in
          </Link>
        </>
      }
    >
      <Suspense fallback={<p style={{ fontSize: 14, color: T.inkDim }}>Loading...</p>}>
        <WelcomeForm />
      </Suspense>
    </AuthShell>
  );
}
