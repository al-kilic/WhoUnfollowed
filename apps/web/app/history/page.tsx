import { redirect } from 'next/navigation';
import { validateRequest } from '@/lib/auth/session';
import { isProUser, getSubscriptionStatus } from '@/lib/flags';
import { isUserVerified } from '@/lib/auth/verification';
import { db } from '@/lib/db/index';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { HistoryClient } from './HistoryClient';
import { AnalyticsEvent } from '@/components/AnalyticsEvent';

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const { welcome } = await searchParams;
  const { user } = await validateRequest();
  if (user && !(await isUserVerified(user.id))) redirect('/verify-email');
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
    <>
      {welcome === '1' && <AnalyticsEvent event="signup" />}
      <HistoryClient
        userId={user?.id ?? null}
        userEmail={user?.email ?? null}
        isPro={isPro}
        subscriptionStatus={status}
        gracePeriodEndsAt={gracePeriodEndsAt}
      />
    </>
  );
}
