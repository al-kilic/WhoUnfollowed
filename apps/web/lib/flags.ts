import { validateRequest } from '@/lib/auth/session';
import { db } from '@/lib/db/index';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export function isPaidFeaturesEnabled(): boolean {
  return process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === 'true';
}

export type SubscriptionStatus = 'active' | 'grace' | 'cancelled' | 'none';

// Returns the user's subscription status. 'none' = not logged in.
export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  const { user } = await validateRequest();
  if (!user) return 'none';

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, user.id),
  });

  return profile?.subscriptionStatus ?? 'none';
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

// True only for a genuine paying subscriber: an active status backed by a real
// Stripe subscription. Signup seeds every profile as 'active' (beta grants Pro
// *access* to all logged-in users), so 'active' alone does not mean paid — the
// presence of a Stripe subscription is the reliable signal. Use this for the PRO
// badge and billing UI; use isProUser() for feature access (which stays open
// during beta).
export async function isPaidSubscriber(): Promise<boolean> {
  const { user } = await validateRequest();
  if (!user) return false;

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, user.id),
    columns: { subscriptionStatus: true, stripeSubscriptionId: true },
  });

  return profile?.subscriptionStatus === 'active' && !!profile.stripeSubscriptionId;
}
