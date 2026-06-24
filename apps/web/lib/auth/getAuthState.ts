import 'server-only';
import { cache } from 'react';
import { validateRequest } from '@/lib/auth/session';
import { isProUser } from '@/lib/flags';

export interface AuthState {
  userEmail: string | null;
  isPro: boolean;
}

// Resolved once per request (React cache dedupes), used by the root layout to
// feed the shared nav context so SiteNav reflects the real login state on every
// page without each page having to fetch auth itself.
export const getAuthState = cache(async (): Promise<AuthState> => {
  const { user } = await validateRequest();
  const isPro = user ? await isProUser() : false;
  return { userEmail: user?.email ?? null, isPro };
});
