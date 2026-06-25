import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Private app + auth surfaces only. Marketing pages like /compare and /blog
      // are intentionally crawlable.
      disallow: ['/history', '/results', '/dashboard', '/diff', '/account', '/settings', '/welcome'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
