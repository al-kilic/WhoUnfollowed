import 'server-only';
import { cache } from 'react';
import { validateRequest } from '@/lib/auth/session';
import { isProUser } from '@/lib/flags';

export interface AuthState {
  userId: string | null;
  userEmail: string | null;
  isPro: boolean;
}

// Resolved once per request (React cache dedupes), used by the root layout to
// feed the shared nav context so SiteNav reflects the real login state on every
// page without each page having to fetch auth itself. In production (payments
// always on) isPro = an active subscription status, i.e. a real Pro user (paid
// or grandfathered) — new signups start Free, so this no longer over-grants.
//
// userId is also used client-side to scope local IndexedDB snapshots per
// account, so two people sharing a browser never see each other's data.
export const getAuthState = cache(async (): Promise<AuthState> => {
  const { user } = await validateRequest();
  const isPro = user ? await isProUser() : false;
  return { userId: user?.id ?? null, userEmail: user?.email ?? null, isPro };
});
