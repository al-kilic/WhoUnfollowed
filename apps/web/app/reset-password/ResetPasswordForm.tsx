'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { clearSyncKey } from '@/lib/syncKey';
import { resetPasswordAction } from './actions';
import { AuthShell, AuthField, AuthError, AuthButton } from '@/components/auth/AuthShell';
import { T } from '@/components/landing/tokens';

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const res = await resetPasswordAction(formData);
      if (res && 'ok' in res && res.ok) {
        // The old session and sync key are gone; clear any cached key locally.
        clearSyncKey();
      }
      return res;
    },
    null,
  );

  const done = state && 'ok' in state && state.ok;
  const error = state && 'error' in state ? state.error : null;

  if (!token) {
    return (
      <AuthShell
        title="Invalid reset link"
        subtitle="This link is missing or malformed. Request a new password reset to continue."
        footer={
          <Link href="/forgot-password" style={{ color: T.tealMid, fontWeight: 600, textDecoration: 'none' }}>
            Request a new link
          </Link>
        }
      >
        <p style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.6 }}>Reset links expire after 1 hour.</p>
      </AuthShell>
    );
  }

  if (done) {
    return (
      <AuthShell
        title="Password updated"
        subtitle="Your password has been changed. Log in with your new password."
        footer={
          <Link href="/login" style={{ color: T.tealMid, fontWeight: 600, textDecoration: 'none' }}>
            Go to log in
          </Link>
        }
      >
        <p style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.6 }}>
          For your security, all existing sessions were signed out.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a new password for your account."
    >
      <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input type="hidden" name="token" value={token} />
        <AuthField
          label="New password"
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          hint="Minimum 8 characters."
        />
        <AuthField
          label="Confirm new password"
          id="confirm"
          name="confirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />

        <p style={{ fontSize: 12, color: T.inkMute, lineHeight: 1.5 }}>
          Note: cloud snapshots are encrypted with a key based on your password. Resetting it removes
          any existing cloud snapshots, your local snapshots on this device are not affected.
        </p>

        {error && <AuthError>{error}</AuthError>}

        <AuthButton pending={pending}>{pending ? 'Updating...' : 'Update password'}</AuthButton>
      </form>
    </AuthShell>
  );
}
