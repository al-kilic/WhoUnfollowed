import type { MetadataRoute } from 'next';
import { BLOG_POSTS } from './blog/posts';
import { COMPARISONS } from './compare/comparisons';
import { routing } from '@/i18n/routing';
import { getPathname } from '@/i18n/navigation';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

// Paths that exist in all three locales — mirrors i18n/localizedPaths.ts
// (kept as a separate list here because each entry also needs a priority and
// changeFrequency, which that shared list doesn't carry). Each gets one
// sitemap entry per locale, all sharing the same reciprocal hreflang
// alternates block.
const LOCALIZED_STATIC_PAGES: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
}> = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/pricing', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/compare', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/what-is-whounfollowed', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/how-to-export', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/accessibility', priority: 0.3, changeFrequency: 'yearly' },
];

// Still English-only: not yet migrated under app/[locale].
const STATIC_PAGES: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
}> = [
  { path: '/blog', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/author/alan-kilic', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/changelog', priority: 0.4, changeFrequency: 'weekly' },
  { path: '/privacy', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/cookies', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/refund', priority: 0.3, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const localizedEntries: MetadataRoute.Sitemap = LOCALIZED_STATIC_PAGES.flatMap((page) => {
    const languages = Object.fromEntries(
      routing.locales.map((l) => [l, `${SITE_URL}${getPathname({ href: page.path, locale: l })}`]),
    );
    return routing.locales.map((locale) => ({
      url: `${SITE_URL}${getPathname({ href: page.path, locale })}`,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: { languages },
    }));
  });

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

  const compareEntries: MetadataRoute.Sitemap = COMPARISONS.flatMap((comparison) => {
    const languages = Object.fromEntries(
      routing.locales.map((l) => [l, `${SITE_URL}${getPathname({ href: `/compare/${comparison.slug}`, locale: l })}`]),
    );
    return routing.locales.map((locale) => ({
      url: `${SITE_URL}${getPathname({ href: `/compare/${comparison.slug}`, locale })}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: { languages },
    }));
  });

  return [...localizedEntries, ...staticEntries, ...blogEntries, ...compareEntries];
}
