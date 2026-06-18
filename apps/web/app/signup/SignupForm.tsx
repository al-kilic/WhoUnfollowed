'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signupAction } from './actions';
import { deriveAndStoreSyncKey } from '@/lib/syncKey';
import { AuthShell, AuthField, AuthError, AuthButton } from '@/components/auth/AuthShell';
import { T } from '@/components/landing/tokens';

export function SignupForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const password = (formData.get('password') as string) ?? '';
      const res = await signupAction(formData);
      if (res && 'ok' in res && res.ok) {
        // Derive + cache the cloud-sync key from the password, then navigate.
        try {
          await deriveAndStoreSyncKey(password, res.saltB64);
        } catch {
          // sync key derivation must never block signup
        }
        router.push('/history?welcome=1');
      }
      return res;
    },
    null,
  );

  const error = state && 'error' in state ? state.error : null;

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

        {error && <AuthError>{error}</AuthError>}

        <AuthButton pending={pending}>{pending ? 'Creating account...' : 'Create account'}</AuthButton>
      </form>
    </AuthShell>
  );
}
