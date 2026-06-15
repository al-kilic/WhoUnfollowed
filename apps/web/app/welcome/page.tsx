'use client';

import { useSearchParams } from 'next/navigation';
import { useActionState, Suspense } from 'react';
import Link from 'next/link';
import { setPasswordAction } from './actions';

function WelcomeForm() {
  const params = useSearchParams();
  const sessionId = params.get('session_id') ?? '';

  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => setPasswordAction(formData),
    null,
  );

  if (!sessionId) {
    return (
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Invalid link. Please check your email or contact support.
        </p>
        <Link href="/pricing" className="underline text-sm">
          Back to pricing
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="sessionId" value={sessionId} />

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">
          Choose a password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
      >
        {pending ? 'Setting up your account...' : 'Set password and get started'}
      </button>
    </form>
  );
}

export default function WelcomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-2">Welcome to WhoUnfollowed</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Your subscription is active. Set a password to access your account.
        </p>

        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
          <WelcomeForm />
        </Suspense>

        <p className="text-xs text-muted-foreground mt-6 text-center">
          Already set your password?{' '}
          <Link href="/login" className="underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
