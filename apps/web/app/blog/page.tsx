import type { Metadata } from 'next';
import { BlogIndex } from './BlogIndex';
import { BLOG_POSTS } from './posts';

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

// Blog + ItemList markup so answer engines can enumerate the full guide library
// from the hub page instead of discovering posts one at a time. Ordered newest
// first to match what the page renders.
const sortedPosts = [...BLOG_POSTS].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

const blogJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  '@id': `${SITE_URL}/blog#blog`,
  name: 'WhoUnfollowed Blog',
  description:
    'Guides on seeing who unfollowed you on Instagram, exporting your own data, tracker privacy, and account health.',
  url: `${SITE_URL}/blog`,
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'en',
  blogPost: sortedPosts.map((post) => {
    const published = new Date(post.date);
    return {
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.metaDescription,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: Number.isNaN(published.getTime()) ? undefined : published.toISOString(),
      author: {
        '@type': 'Person',
        '@id': `${SITE_URL}/author/alan-kilic#person`,
        name: 'Alan Kilic',
      },
    };
  }),
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
  ],
};

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BlogIndex />
    </>
  );
}
