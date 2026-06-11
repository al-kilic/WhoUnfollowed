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
