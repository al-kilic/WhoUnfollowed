import { validateRequest } from '@/lib/auth/session';
import { isPaidFeaturesEnabled, isProUser } from '@/lib/flags';
import { PricingClient } from './PricingClient';

export const metadata = {
  title: 'Pricing',
  description: 'Always free and open source. Pro adds history, trends, and alerts, and helps keep the app alive.',
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
