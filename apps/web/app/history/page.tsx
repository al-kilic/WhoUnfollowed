import { validateRequest } from '@/lib/auth/session';
import { isProUser, getSubscriptionStatus } from '@/lib/flags';
import { db } from '@/lib/db/index';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { HistoryClient } from './HistoryClient';

export default async function HistoryPage() {
  const { user } = await validateRequest();
  const [isPro, status] = await Promise.all([
    isProUser(),
    getSubscriptionStatus(),
  ]);

  let gracePeriodEndsAt: string | null = null;
  if (status === 'grace' && user) {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, user.id),
      columns: { gracePeriodEndsAt: true },
    });
    gracePeriodEndsAt = profile?.gracePeriodEndsAt?.toISOString() ?? null;
  }

  return (
    <HistoryClient
      userEmail={user?.email ?? null}
      isPro={isPro}
      subscriptionStatus={status}
      gracePeriodEndsAt={gracePeriodEndsAt}
    />
  );
}
