import 'server-only';
import { cache } from 'react';
import { validateRequest } from '@/lib/auth/session';
import { isProUser, isLifetimeMember } from '@/lib/flags';
import { getProAiAccess } from '@/lib/ai/access';
import { getProfileRow } from '@/lib/auth/profileRow';

export interface AuthState {
  userId: string | null;
  userEmail: string | null;
  isPro: boolean;
  // Lifetime purchase ("Insider"): drives the nav badge label.
  isInsider: boolean;
  // Pro AI (subscription, Lifetime or a running legacy unlock): the results
  // page sends export numbers to the coach only when this is true.
  hasProAi: boolean;
  // An old one-time Pro unlock that is still running: coach access on a
  // one-off 30 trial credits, and the upgrade offer to the Pro AI plan.
  isLegacyPro: boolean;
  // Optional name from You > profile (Today greets with it).
  displayName: string | null;
}

// Resolved once per request (React cache dedupes). Served to the client-side
// AuthProvider by /api/auth/state, and passed straight in by per-visitor pages
// (results, diff), so the root layout never reads the session cookie and
// marketing pages stay static. In production (payments
// always on) isPro = an active subscription status, i.e. a real Pro user (paid
// or grandfathered) — new signups start Free, so this no longer over-grants.
//
// userId is also used client-side to scope local IndexedDB snapshots per
// account, so two people sharing a browser never see each other's data.
export const getAuthState = cache(async (): Promise<AuthState> => {
  const { user } = await validateRequest();
  const isPro = user ? await isProUser() : false;
  // Only worth the extra lookup for users who already have Pro access.
  const isInsider = isPro ? await isLifetimeMember() : false;
  // Checked for every signed-in member, not only active Pro: a lapsed old-Pro
  // buyer with the never-expiring trial left still has the coach.
  const access = user ? await getProAiAccess(user.id).catch(() => null) : null;
  const named = user ? await getProfileRow(user.id).catch(() => null) : null;
  return { userId: user?.id ?? null, userEmail: user?.email ?? null, isPro, isInsider, hasProAi: !!access, isLegacyPro: access?.plan === 'legacy', displayName: named?.displayName ?? null };
});
