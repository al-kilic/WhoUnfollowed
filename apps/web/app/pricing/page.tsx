import type { Metadata } from 'next';
import { validateRequest } from '@/lib/auth/session';
import { isPaidFeaturesEnabled, isPaidSubscriber } from '@/lib/flags';
import { PricingClient } from './PricingClient';
import { PRICING_FAQ } from './faq';
import { UNLOCK_PRICE_SUMMARY } from '@/lib/pricing';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    `Free forever, no account needed. Pro is a one-time unlock (${UNLOCK_PRICE_SUMMARY}) that adds snapshot history, cloud sync, and trends. No auto-renewal.`,
  alternates: { canonical: '/pricing' },
  openGraph: {
    type: 'website',
    title: 'Pricing',
    description:
      `Free forever, no account needed. Pro is a one-time unlock (${UNLOCK_PRICE_SUMMARY}). No subscription, no auto-renewal.`,
    url: `${SITE_URL}/pricing`,
    siteName: 'WhoUnfollowed',
  },
};

// FAQPage markup is generated from the same PRICING_FAQ array the page renders,
// so the structured data can never drift from the visible on-page text.
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: PRICING_FAQ.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Pricing', item: `${SITE_URL}/pricing` },
  ],
};

export default async function PricingPage() {
  const { user } = await validateRequest();
  const paymentsEnabled = isPaidFeaturesEnabled();
  const isPro = await isPaidSubscriber();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PricingClient
        userEmail={user?.email ?? null}
        paymentsEnabled={paymentsEnabled}
        isPro={isPro}
      />
    </>
  );
}
