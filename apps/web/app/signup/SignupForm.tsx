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
        // replace (not push) so Back can't return to the signup form.
        if ('needsVerification' in res && res.needsVerification) {
          router.replace('/verify-email');
        } else {
          router.replace('/history?welcome=1');
        }
      }
      return res;
    },
    null,
  );

  const error = state && 'error' in state ? state.error : null;

  return (
    <AuthShell
      title="Create your account"
      subtitle="Takes 10 seconds. No credit card, ever, unless you choose Pro."
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" style={{ color: T.tealMid, fontWeight: 600, textDecoration: 'none' }}>
            Log in
          </Link>
        </>
      }
    >
      <div style={{ marginBottom: 20, padding: '14px 16px', borderRadius: 12, background: T.surface1, border: `1px solid ${T.border1}`, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.tealLight} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span style={{ fontSize: 13, color: T.ink, fontWeight: 500, lineHeight: 1.45 }}>
          Unlimited CSV exports of every list, non-followers, fans, and mutuals
        </span>
      </div>

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
