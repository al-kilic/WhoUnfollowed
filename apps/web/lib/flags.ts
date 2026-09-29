import { validateRequest } from '@/lib/auth/session';
import { db } from '@/lib/db/index';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { isDevProPreview } from '@/lib/auth/devProPreview';

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
  if (isDevProPreview()) return 'active';
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

// True only for a genuine paying customer: an active status backed by a real
// Stripe subscription, an unexpired one-time unlock purchase, or a Lifetime
// purchase (profiles.lifetimePurchasedAt). Signup seeds every profile as
// 'active' with a null subscriptionExpiresAt (beta grants Pro *access* to all
// logged-in users), which is the SAME null-expiry shape a Lifetime purchase
// has — so 'active' alone, or null expiry alone, never means paid.
// lifetimePurchasedAt is the only valid signal for "this is a genuine
// Lifetime purchase," checked explicitly below rather than inferred from the
// null expiry it shares with an ordinary free signup.
// Use this for the PRO/Founding-Member badge and billing UI; use isProUser()
// for feature access (which stays open during beta).
export async function isPaidSubscriber(): Promise<boolean> {
  if (isDevProPreview()) return true;
  const { user } = await validateRequest();
  if (!user) return false;

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, user.id),
    columns: { subscriptionStatus: true, stripeSubscriptionId: true, subscriptionExpiresAt: true, lifetimePurchasedAt: true },
  });
  if (!profile || profile.subscriptionStatus !== 'active') return false;

  if (profile.lifetimePurchasedAt) return true;
  if (profile.stripeSubscriptionId) return true;
  return !!profile.subscriptionExpiresAt && profile.subscriptionExpiresAt.getTime() > Date.now();
}

// True only for a genuine Lifetime ("Founding Member") purchase. Drives the
// Founding Member badge/title; unlike isPaidSubscriber() it is false for a
// dated unlock or a plain free signup.
export async function isLifetimeMember(): Promise<boolean> {
  // Dev preview is a Pro user; DEV_LIFETIME_PREVIEW=1 also makes it a Founding Member.
  if (isDevProPreview()) return process.env.DEV_LIFETIME_PREVIEW === '1';
  const { user } = await validateRequest();
  if (!user) return false;

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, user.id),
    columns: { subscriptionStatus: true, lifetimePurchasedAt: true },
  });
  return profile?.subscriptionStatus === 'active' && !!profile.lifetimePurchasedAt;
}
