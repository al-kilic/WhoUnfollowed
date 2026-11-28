import path from 'path';
import { fileURLToPath } from 'url';
import createNextIntlPlugin from 'next-intl/plugin';
import { buildCsp } from './lib/security/csp-policy.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

// Disable anonymous telemetry at build + runtime
process.env.NEXT_TELEMETRY_DISABLED = '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // A second local server (e.g. a staging-gate check next to the main dev
  // server) can use its own build folder: NEXT_DIST_DIR=.next-staging.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // A build in its own folder can point at its own (gitignored) tsconfig, so
  // `next build` never rewrites the tracked tsconfig.json (e2e: tsconfig.e2e.json).
  typescript: { tsconfigPath: process.env.NEXT_TSCONFIG_PATH || 'tsconfig.json' },
  // Don't advertise the framework in every response.
  poweredByHeader: false,
  transpilePackages: ['@ig-tracker/core'],
  // Weekly briefs are read from disk at request time (lib/briefs.ts), so the
  // standalone build must ship the folder.
  outputFileTracingIncludes: {
    '/[locale]/app/plan/brief': ['./content/briefs/**/*'],
    '/[locale]/instagram-updates': ['./content/briefs/**/*'],
    '/[locale]/instagram-updates/[date]': ['./content/briefs/**/*'],
    '/sitemap.xml': ['./content/briefs/**/*'],
    '/feeds/instagram-updates.xml': ['./content/briefs/**/*'],
    '/llms-full.txt': ['./content/briefs/**/*'],
  },
  turbopack: {
    root: path.resolve(__dirname, '../..'),
  },
  // Self-hosted guide videos are versioned by filename (export-guide-v1.mp4),
  // so they can be cached for a year. Next serves public/ uncached by default.
  async headers() {
    // Report-only CSP (see lib/security/csp-policy.mjs). Production only: the dev
    // server needs eval for hot reload. The other security headers come from
    // Caddy (ops/Caddyfile).
    const csp = process.env.NODE_ENV === 'production'
      ? [{ source: '/:path*', headers: [{ key: 'Content-Security-Policy-Report-Only', value: buildCsp() }] }]
      : [];
    return [
      ...csp,
      {
        source: '/video/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
  async redirects() {
    return [
      // Retired 2026-07-26: the "compare two lists" post chased a weak,
      // technical query and taught the DIY workaround. 301 to the pillar so
      // the already-indexed URL never 404s.
      {
        source: '/blog/how-to-compare-two-instagram-follower-lists',
        destination: '/blog/how-to-see-who-unfollowed-you-on-instagram',
        permanent: true,
      },
      // Merged 2026-11-06: overlapping posts chasing the same search intent were
      // folded into one stronger page each (Google indexed none of them while
      // they competed). 301 so old links and any indexed copies carry over.
      { source: '/blog/can-you-see-who-unfollowed-you-on-instagram', destination: '/blog/how-to-see-who-unfollowed-you-on-instagram', permanent: true },
      { source: '/blog/instagram-unfollow-checker', destination: '/blog/how-to-see-who-unfollowed-you-on-instagram', permanent: true },
      { source: '/blog/how-to-see-who-unfollowed-you-without-them-knowing', destination: '/blog/how-to-see-who-unfollowed-you-on-instagram', permanent: true },
      { source: '/blog/how-to-see-who-unfollowed-you-on-instagram-from-your-phone', destination: '/blog/how-to-see-who-unfollowed-you-on-instagram', permanent: true },
      { source: '/blog/how-to-see-who-unfollowed-you-on-instagram-on-a-computer', destination: '/blog/how-to-see-who-unfollowed-you-on-instagram', permanent: true },
      { source: '/blog/who-unfollowed-me-on-instagram-or-threads-quick-answers', destination: '/blog/how-to-see-who-unfollowed-you-on-instagram', permanent: true },
      { source: '/blog/is-there-a-free-app-to-see-who-unfollowed-you-on-instagram', destination: '/blog/best-app-to-see-who-unfollowed-me-on-instagram-without-password', permanent: true },
      { source: '/blog/do-instagram-unfollow-apps-actually-work', destination: '/blog/best-app-to-see-who-unfollowed-me-on-instagram-without-password', permanent: true },
      { source: '/blog/instagram-follower-tracker-without-login', destination: '/blog/best-app-to-see-who-unfollowed-me-on-instagram-without-password', permanent: true },
      { source: '/blog/can-you-see-who-unfollowed-you-on-threads-for-free', destination: '/blog/how-to-see-who-unfollowed-you-on-threads', permanent: true },
      { source: '/blog/what-is-a-good-follower-to-following-ratio-on-instagram', destination: '/blog/instagram-follow-ratio-what-it-means-how-to-improve-it', permanent: true },
      // Launch 2026-11-28: the pre-launch waitlist page is gone; its links and
      // any indexed copy go to sign-up (free accounts, same as the waitlist made).
      { source: '/waitlist', destination: '/signup', permanent: true },
      { source: '/es/waitlist', destination: '/es/signup', permanent: true },
      { source: '/pt/waitlist', destination: '/pt/signup', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
