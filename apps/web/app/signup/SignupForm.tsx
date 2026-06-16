'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { signupAction } from './actions';
import { AuthShell, AuthField, AuthError, AuthButton } from '@/components/auth/AuthShell';
import { T } from '@/components/landing/tokens';

export function SignupForm() {
  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => signupAction(formData),
    null,
  );

  return (
    <AuthShell
      title="Create your account"
      subtitle="Free during beta. No credit card required."
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" style={{ color: T.tealMid, fontWeight: 600, textDecoration: 'none' }}>
            Log in
          </Link>
        </>
      }
    >
      <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <AuthField label="Email" id="email" name="email" type="email" required autoComplete="email" />
        <AuthField
          label="Password"
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          hint="Minimum 8 characters."
        />

        {state?.error && <AuthError>{state.error}</AuthError>}

        <AuthButton pending={pending}>{pending ? 'Creating account...' : 'Create account'}</AuthButton>
      </form>
    </AuthShell>
  );
}
