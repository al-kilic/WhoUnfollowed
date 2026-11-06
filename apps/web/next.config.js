import path from 'path';
import { fileURLToPath } from 'url';
import createNextIntlPlugin from 'next-intl/plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

// Disable anonymous telemetry at build + runtime
process.env.NEXT_TELEMETRY_DISABLED = '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@ig-tracker/core'],
  turbopack: {
    root: path.resolve(__dirname, '../..'),
  },
  // Self-hosted guide videos are versioned by filename (export-guide-v1.mp4),
  // so they can be cached for a year. Next serves public/ uncached by default.
  async headers() {
    return [
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
    ];
  },
};

export default withNextIntl(nextConfig);
