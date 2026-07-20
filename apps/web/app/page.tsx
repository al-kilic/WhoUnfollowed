import { LandingPage } from '@/components/landing/LandingPage';
import { ITEMS as FAQ_ITEMS } from '@/components/landing/FAQSection';
import { validateRequest } from '@/lib/auth/session';
import { isProUser } from '@/lib/flags';
import { getStats } from '@/lib/stats';

// FAQPage schema mirrors the visible homepage FAQ (kept in sync via FAQSection).
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: Object.values(FAQ_ITEMS)
    .flat()
    .map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'WhoUnfollowed',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://whounfollowed.co',
  description:
    'Privacy-first, open-source Instagram follower analysis. Upload your official data export to see who doesn\'t follow you back. Save snapshots over time to see who unfollowed. No password or login required.',
  offers: [
    { '@type': 'Offer', name: 'Free', price: '0',    priceCurrency: 'USD' },
    { '@type': 'Offer', name: 'Pro',  price: '4.99', priceCurrency: 'USD', billingIncrement: 'P1M' },
  ],
  featureList: [
    'Open-source web app (AGPL-3.0), auditable on GitHub',
    'Open-source parser (MPL-2.0)',
    'No Instagram password required',
    'Client-side processing. Data never leaves your browser.',
    'Follower diff and comparison',
    'CSV export',
  ],
};

export default async function HomePage() {
  const { user } = await validateRequest();
  const [isPro, initialStats] = await Promise.all([isProUser(), getStats()]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <LandingPage userEmail={user?.email ?? null} isPro={isPro} initialStats={initialStats} />
    </>
  );
}
