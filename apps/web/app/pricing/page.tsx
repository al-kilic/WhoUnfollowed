import { validateRequest } from '@/lib/auth/session';
import { isPaidFeaturesEnabled, isProUser } from '@/lib/flags';
import { PricingClient } from './PricingClient';

export const metadata = {
  title: 'Pricing — WhoUnfollowed',
  description: 'Simple, honest pricing. One plan, full access.',
};

export default async function PricingPage() {
  const { user } = await validateRequest();
  const paymentsEnabled = isPaidFeaturesEnabled();
  const isPro = await isProUser();

  return (
    <PricingClient
      userEmail={user?.email ?? null}
      paymentsEnabled={paymentsEnabled}
      isPro={isPro}
    />
  );
}
