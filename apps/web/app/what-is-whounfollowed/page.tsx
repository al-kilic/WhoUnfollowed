import type { Metadata } from 'next';
import { WhatIsContent } from './WhatIsContent';
import { faqItems } from './faqData';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

export const metadata: Metadata = {
  title: 'What Is WhoUnfollowed? See Who Unfollowed You Without a Password',
  description:
    "WhoUnfollowed is open-source and reads the data export Instagram already gives you, showing who doesn't follow you back in your browser in 2 seconds. No password, no server.",
  alternates: { canonical: `${SITE_URL}/what-is-whounfollowed` },
  openGraph: {
    type: 'website',
    title: 'What Is WhoUnfollowed? See Who Unfollowed You Without a Password',
    description:
      "WhoUnfollowed is open-source and reads the data export Instagram already gives you, showing who doesn't follow you back in your browser in 2 seconds. No password, no server.",
    url: `${SITE_URL}/what-is-whounfollowed`,
    siteName: 'WhoUnfollowed',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What Is WhoUnfollowed?',
    description:
      "See who doesn't follow you back on Instagram without giving anyone your password.",
  },
};

export default function WhatIsWhoUnfollowedPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <WhatIsContent />
    </>
  );
}
