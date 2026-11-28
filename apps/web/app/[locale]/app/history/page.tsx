import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getAuthState } from '@/lib/auth/getAuthState';
import { getSubscriptionStatus } from '@/lib/flags';
import { getGracePeriodEnd } from '@/lib/gracePeriod';
import { StudioHistory } from '@/components/studio/StudioHistory';
import { PageHead } from '@/components/studio/PageHead';
import { getStudioContent } from '@/components/studio/studio.content';
import { getStudioPagesContent } from '@/components/studio/studioPages.content';

// Studio > History: the same history as /history, inside the Studio frame.
export default async function StudioHistoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [auth, status] = await Promise.all([getAuthState(), getSubscriptionStatus()]);
  const gracePeriodEndsAt = await getGracePeriodEnd(auth.userId, status);
  return (
    <>
      <PageHead title={getStudioContent(locale).nav.history} sub={getStudioPagesContent(locale).historySub} />
      <StudioHistory locale={locale} userId={auth.userId} userEmail={auth.userEmail} isPro={auth.isPro}
        subscriptionStatus={status} gracePeriodEndsAt={gracePeriodEndsAt} />
    </>
  );
}
