import { eq } from 'drizzle-orm';
import { validateRequest } from '@/lib/auth/session';
import { isPaidFeaturesEnabled, isPaidSubscriber } from '@/lib/flags';
import { db } from '@/lib/db/index';
import { profiles } from '@/lib/db/schema';
import { PricingClient } from './PricingClient';

export const metadata = {
  title: 'Pricing',
  description: 'Always free and open source. Pro adds history, trends, and alerts, and helps keep the app alive.',
  alternates: { canonical: '/pricing' },
};

export default async function PricingPage() {
  const { user } = await validateRequest();
  const paymentsEnabled = isPaidFeaturesEnabled();
  // "Manage billing" should only show for real subscribers (they have a Stripe
  // customer); beta users with free access still see the subscribe CTA.
  const isPro = await isPaidSubscriber();

  // A legacy recurring subscriber sees "Manage billing" (cancel, payment
  // method). An unlock buyer sees the buy card again instead, so they can
  // extend their access, since there's no subscription to manage.
  let hasRecurringSubscription = false;
  if (user) {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, user.id),
      columns: { stripeSubscriptionId: true },
    });
    hasRecurringSubscription = !!profile?.stripeSubscriptionId;
  }

  return (
    <PricingClient
      userEmail={user?.email ?? null}
      paymentsEnabled={paymentsEnabled}
      isPro={isPro}
      hasRecurringSubscription={hasRecurringSubscription}
    />
  );
}
