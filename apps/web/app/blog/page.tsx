import type { Metadata } from 'next';
import { BlogIndex } from './BlogIndex';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

export const metadata: Metadata = {
  title: 'Blog: Instagram, Privacy & Follower Tracking Guides',
  description: 'Honest guides on seeing who unfollowed you, finding non-followers and ghost followers, and tracking your Instagram safely. No growth hacks, no password required.',
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    type: 'website',
    title: 'WhoUnfollowed Blog',
    description: 'Honest guides on Instagram follower tracking, privacy, and account health.',
    url: `${SITE_URL}/blog`,
    siteName: 'WhoUnfollowed',
  },
};

export default function BlogPage() {
  return <BlogIndex />;
}
