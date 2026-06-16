'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { loginAction } from './actions';
import { AuthShell, AuthField, AuthError, AuthButton } from '@/components/auth/AuthShell';
import { T } from '@/components/landing/tokens';

export default function LoginPage() {
  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => loginAction(formData),
    null,
  );

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to your WhoUnfollowed account."
      footer={
        <>
          No account?{' '}
          <Link href="/signup" style={{ color: T.tealMid, fontWeight: 600, textDecoration: 'none' }}>
            Sign up free
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
          autoComplete="current-password"
        />

        {state?.error && <AuthError>{state.error}</AuthError>}

        <AuthButton pending={pending}>{pending ? 'Logging in...' : 'Log in'}</AuthButton>
      </form>
    </AuthShell>
  );
}
