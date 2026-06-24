'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginAction } from './actions';
import { deriveAndStoreSyncKey } from '@/lib/syncKey';
import { AuthShell, AuthField, AuthError, AuthButton } from '@/components/auth/AuthShell';
import { T } from '@/components/landing/tokens';

export function LoginForm() {
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

  const error = state && 'error' in state ? state.error : null;

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

        <div style={{ marginTop: -6, textAlign: 'right' }}>
          <Link href="/forgot-password" style={{ fontSize: 12, color: T.tealMid, textDecoration: 'none' }}>
            Forgot password?
          </Link>
        </div>

        {error && <AuthError>{error}</AuthError>}

        <AuthButton pending={pending}>{pending ? 'Logging in...' : 'Log in'}</AuthButton>
      </form>
    </AuthShell>
  );
}
