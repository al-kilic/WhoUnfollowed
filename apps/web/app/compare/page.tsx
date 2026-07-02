import type { Metadata } from 'next';
import { CompareIndexContent } from './CompareIndexContent';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

export const metadata: Metadata = {
  title: 'WhoUnfollowed vs Every Instagram Follower Tracker',
  description:
    'Every other Instagram tracker asks for your password. WhoUnfollowed does not. Compare privacy, ban risk, features, and pricing across the top unfollower apps.',
  alternates: { canonical: `${SITE_URL}/compare` },
  openGraph: {
    type: 'website',
    title: 'WhoUnfollowed vs Every Instagram Follower Tracker',
    description:
      'Every other Instagram tracker asks for your password. WhoUnfollowed does not. See the full breakdown of privacy, ban risk, features, and pricing.',
    url: `${SITE_URL}/compare`,
    siteName: 'WhoUnfollowed',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WhoUnfollowed vs Every Instagram Follower Tracker',
    description:
      'Every other Instagram tracker asks for your password. WhoUnfollowed does not. See the full breakdown.',
  },
};

export default function ComparePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Compare', item: `${SITE_URL}/compare` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CompareIndexContent />
    </>
  );
}
