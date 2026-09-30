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
    ];
  },
};

export default withNextIntl(nextConfig);
