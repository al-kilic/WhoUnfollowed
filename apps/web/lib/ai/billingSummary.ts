import 'server-only';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/index';
import { profiles } from '@/lib/db/schema';
import { isDevProPreview } from '@/lib/auth/devProPreview';
import { planFor } from '@/lib/ai/access';

// What the Pro AI billing panel needs: whether this is a Stripe subscription
// (so the billing portal applies) and when the current period ends.
export async function getBillingSummary(userId: string): Promise<{ isSubscriber: boolean; periodEnd: string | null }> {
  if (isDevProPreview()) return { isSubscriber: false, periodEnd: null };
  const profile = await db.query.profiles.findFirst({ where: eq(profiles.userId, userId) });
  const proAi = planFor(profile ?? undefined);
  const isSubscriber = !!profile?.stripeSubscriptionId && (proAi?.plan === 'monthly' || proAi?.plan === 'yearly');
  return { isSubscriber, periodEnd: isSubscriber ? (profile?.currentPeriodEnd?.toISOString() ?? null) : null };
}
