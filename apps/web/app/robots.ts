import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Private app + auth surfaces only. Marketing pages like /compare and /blog
      // are intentionally crawlable.
      disallow: [
        '/history',
        '/results',
        '/dashboard',
        // Not a bare '/app': robots rules match by prefix, so that would also
        // block /apple-icon.png and any future /app-something page.
        '/app$',
        '/app/',
        '/diff',
        '/account',
        '/settings',
        '/welcome',
        '/login',
        '/signup',
        '/verify-email',
        '/forgot-password',
        '/reset-password',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
