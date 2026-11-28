import 'server-only';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/index';
import { profiles } from '@/lib/db/schema';
import type { SubscriptionStatus } from '@/lib/flags';

// When a lapsed subscription in its grace period stops working, as an ISO
// string for client components. Null outside a grace period.
export async function getGracePeriodEnd(userId: string | null, status: SubscriptionStatus): Promise<string | null> {
  if (status !== 'grace' || !userId) return null;
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, userId),
    columns: { gracePeriodEndsAt: true },
  });
  return profile?.gracePeriodEndsAt?.toISOString() ?? null;
}
