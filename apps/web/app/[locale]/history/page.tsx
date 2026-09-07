import { redirect, notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { validateRequest } from '@/lib/auth/session';
import { isProUser, getSubscriptionStatus } from '@/lib/flags';
import { isUserVerified } from '@/lib/auth/verification';
import { db } from '@/lib/db/index';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { HistoryClient } from './HistoryClient';
import type { Metadata } from 'next';
import { AnalyticsEvent } from '@/components/AnalyticsEvent';
import { routing, type AppLocale } from '@/i18n/routing';
import { getHistoryContent } from './content';

// Personalized, auth-gated content (session, snapshots, subscription). Never
// let this get swept into the [locale] layout's static generation.
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ welcome?: string }>;
}

// Private, per-user surface. robots.ts already disallows it, but the meta tag
// also covers crawlers that fetch the page directly and ignore robots.txt.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return { title: getHistoryContent(locale).metaTitle, robots: { index: false, follow: false } };
}

export default async function HistoryPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

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
        locale={locale as AppLocale}
        userId={user?.id ?? null}
        userEmail={user?.email ?? null}
        isPro={isPro}
        subscriptionStatus={status}
        gracePeriodEndsAt={gracePeriodEndsAt}
      />
    </>
  );
}
