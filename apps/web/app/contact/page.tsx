import type { Metadata } from 'next';
import { ContactContent } from './ContactContent';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

export const metadata: Metadata = {
  title: 'Contact WhoUnfollowed',
  description:
    'Bug reports, feature requests, privacy questions, or press. One person reads every email and usually replies within 24 hours.',
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    type: 'website',
    title: 'Contact WhoUnfollowed',
    description:
      'One person reads every email and usually replies within 24 hours.',
    url: `${SITE_URL}/contact`,
    siteName: 'WhoUnfollowed',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact WhoUnfollowed',
    description: 'One person reads every email. Usually a reply within 24 hours.',
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
