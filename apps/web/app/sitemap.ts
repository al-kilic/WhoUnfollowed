import type { MetadataRoute } from 'next';
import { BLOG_POSTS } from './blog/posts';
import { COMPARISONS } from './compare/comparisons';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

// Static, indexable marketing/legal pages. Private app + auth routes are
// intentionally excluded (and disallowed in robots.ts).
const STATIC_PAGES: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
}> = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: '/how-to-export', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/what-is-whounfollowed', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/pricing', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/compare', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/changelog', priority: 0.4, changeFrequency: 'weekly' },
  { path: '/contact', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/privacy', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/cookies', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/refund', priority: 0.3, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((page) => ({
    url: `${SITE_URL}${page.path}`,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => {
    const parsed = new Date(post.date);
    return {
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: Number.isNaN(parsed.getTime()) ? undefined : parsed,
      changeFrequency: 'monthly',
      priority: 0.7,
    };
  });

  const compareEntries: MetadataRoute.Sitemap = COMPARISONS.map((comparison) => ({
    url: `${SITE_URL}/compare/${comparison.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries, ...compareEntries];
}
