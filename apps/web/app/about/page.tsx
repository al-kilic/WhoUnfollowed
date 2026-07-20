import type { Metadata } from 'next';
import { AboutContent } from './AboutContent';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

export const metadata: Metadata = {
  title: 'About WhoUnfollowed and Alan Kilic',
  description:
    'WhoUnfollowed is an independent, open-source product built by Alan Kilic under Alcatraz Studio. No VC funding, no team of twenty, no app that asks for your Instagram password.',
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    type: 'profile',
    title: 'About WhoUnfollowed and Alan Kilic',
    description:
      'An independent product built by Alan Kilic under Alcatraz Studio. Every app ships open-source (AGPL-3.0), asks for the least access it needs, and never wants your password.',
    url: `${SITE_URL}/about`,
    siteName: 'WhoUnfollowed',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About WhoUnfollowed and Alan Kilic',
    description: 'The independent, privacy-first story behind WhoUnfollowed.',
  },
};

// ProfilePage + Person: a resolvable author entity so blog Article schema can
// point author.url here. This is the E-E-A-T anchor for both Google and AI engines.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  mainEntity: {
    '@type': 'Person',
    '@id': `${SITE_URL}/author/alan-kilic#person`,
    name: 'Alan Kilic',
    url: `${SITE_URL}/author/alan-kilic`,
    jobTitle: 'Founder and developer',
    description:
      'Product builder and photographer who builds privacy-first software under the name Alcatraz Studio.',
    sameAs: ['https://github.com/al-kilic'],
    worksFor: { '@id': `${SITE_URL}/#organization` },
  },
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AboutContent />
    </>
  );
}
