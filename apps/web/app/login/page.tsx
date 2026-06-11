'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { loginAction } from './actions';

export default function LoginPage() {
  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => loginAction(formData),
    null,
  );

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-6">Log in</h1>

        <form action={action} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
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
            {pending ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="text-sm text-muted-foreground mt-4 text-center">
          No account?{' '}
          <Link href="/signup" className="underline">
            Sign up free
          </Link>
        </p>
      </div>
    </main>
  );
}
