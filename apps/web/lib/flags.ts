import { validateRequest } from '@/lib/auth/session';
import { db } from '@/lib/db/index';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export function isPaidFeaturesEnabled(): boolean {
  return process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === 'true';
}

export type SubscriptionStatus = 'active' | 'grace' | 'cancelled' | 'none';

// Returns the user's subscription status. 'none' = not logged in.
//
// A one-time unlock purchase (see UNLOCK_DURATION_DAYS) sets subscriptionStatus
// to 'active' with subscriptionExpiresAt set. A real recurring Stripe
// subscription leaves subscriptionExpiresAt null — Stripe webhooks flip status
// directly instead, there's nothing to expire locally. So: 'active' with a
// past subscriptionExpiresAt means an unlock that ran out, treated as 'none'.
export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  const { user } = await validateRequest();
  if (!user) return 'none';

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, user.id),
  });
  if (!profile) return 'none';

  if (
    profile.subscriptionStatus === 'active' &&
    profile.subscriptionExpiresAt &&
    profile.subscriptionExpiresAt.getTime() <= Date.now()
  ) {
    return 'none';
  }

  return profile.subscriptionStatus;
}

// Active = full Pro access. Grace = logged in but sync blocked.
// During beta (PAYMENTS_ENABLED=false), everyone is treated as active.
export async function isProUser(): Promise<boolean> {
  if (!isPaidFeaturesEnabled()) {
    const { user } = await validateRequest();
    return !!user;
  }
  const status = await getSubscriptionStatus();
  return status === 'active';
}

// True only for a genuine paying customer: an active status backed by either a
// real Stripe subscription or an unexpired one-time unlock purchase. Signup
// seeds every profile as 'active' (beta grants Pro *access* to all logged-in
// users), so 'active' alone does not mean paid — a Stripe subscription or a
// still-valid unlock is the reliable signal. Use this for the PRO badge and
// billing UI; use isProUser() for feature access (which stays open during beta).
export async function isPaidSubscriber(): Promise<boolean> {
  const { user } = await validateRequest();
  if (!user) return false;

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, user.id),
    columns: { subscriptionStatus: true, stripeSubscriptionId: true, subscriptionExpiresAt: true },
  });
  if (!profile || profile.subscriptionStatus !== 'active') return false;

  if (profile.stripeSubscriptionId) return true;
  return !!profile.subscriptionExpiresAt && profile.subscriptionExpiresAt.getTime() > Date.now();
}
