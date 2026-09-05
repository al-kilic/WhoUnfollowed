import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { ThemeProvider } from 'next-themes';
import { getLocale } from 'next-intl/server';
import { FontLoader } from '@/components/FontLoader';
import { AuthProvider } from '@/components/AuthProvider';
import { getAuthState } from '@/lib/auth/getAuthState';
import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

// Self-hosted Umami analytics (cookieless, privacy-friendly). No data leaves our VPS.
const UMAMI_SRC =
  process.env.NEXT_PUBLIC_UMAMI_SRC ?? 'https://analytics.whounfollowed.co/script.js';
const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ?? '380314e5-fc79-480f-9483-d5ddded7ad59';
// Session recorder (heatmaps + replays), also self-hosted on our VPS.
const UMAMI_RECORDER_SRC =
  process.env.NEXT_PUBLIC_UMAMI_RECORDER_SRC ?? 'https://analytics.whounfollowed.co/recorder.js';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f0e8' },
    { media: '(prefers-color-scheme: dark)', color: '#0b2426' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Who Unfollowed You on Instagram? Check Free | WhoUnfollowed',
    template: '%s | WhoUnfollowed',
  },
  description:
    'See who doesn\'t follow you back on Instagram by uploading your official data export. Open-source, processed entirely in your browser. No password, no login.',
  keywords: [
    'instagram unfollow tracker',
    'instagram followers',
    'who unfollowed me instagram',
    'instagram data export',
    'privacy instagram tool',
    'local-first instagram analytics',
    'open source instagram tracker',
  ],
  authors: [{ name: 'WhoUnfollowed' }],
  creator: 'WhoUnfollowed',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'WhoUnfollowed',
    title: 'Who Unfollowed You on Instagram? Check Free',
    description:
      'See who doesn\'t follow you back on Instagram by uploading your official data export. Open-source, processed entirely in your browser. No password, no login.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'WhoUnfollowed - See who unfollowed you. Privately.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Who Unfollowed You on Instagram? Check Free',
    description:
      'See who doesn\'t follow you back on Instagram by uploading your official data export. Open-source, processed entirely in your browser. No password, no login.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Sitewide entity graph. Anchors WhoUnfollowed as a resolvable Organization for
// Google and AI answer engines, and links the brand to its open-source repo.
const orgJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'WhoUnfollowed',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
      description:
        'Privacy-first, open-source Instagram follower analysis. AGPL-3.0 web app, MPL-2.0 parser, no password required, processed in your browser.',
      sameAs: ['https://github.com/al-kilic/WhoUnfollowed'],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'WhoUnfollowed',
      url: SITE_URL,
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en',
    },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [auth, locale] = await Promise.all([getAuthState(), getLocale()]);
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {/* Google Fonts - landing page design system */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* Fontshare - app pages */}
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.fontshare.com" />
        {/*
          Self-heal malformed UTM links that use a `#` fragment instead of a
          `?` query string (e.g. a Reddit campaign link shared as
          /#utm_source=Reddit&utm_medium=Comment...). Fragments never reach
          the server and Umami's tracking script only reads location.search,
          so links like that land real visitors but silently drop all
          campaign attribution. This runs synchronously before the Umami
          script below, so its very first pageview sees the corrected URL.
          Scoped to hashes containing "utm_" so it never touches real
          in-page anchors like #upload.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var h=window.location.hash;if(h&&h.indexOf('utm_')!==-1&&!window.location.search){window.history.replaceState(null,'',window.location.pathname+'?'+h.slice(1));}}catch(e){}})();`,
          }}
        />
        {/*
          Remembers the first external referrer (or utm_source) seen this tab
          session, so a later Pro purchase can be attributed to where the
          visitor actually came from. Runs once per tab: sessionStorage means
          in-site navigation (results -> pricing -> checkout) never overwrites
          it with our own domain. Read at checkout time (see PricingClient)
          and sent through Stripe metadata, because the purchase-confirmation
          event now fires server-side from the webhook (for reliability) and
          so no longer carries Umami's own in-browser session/referrer data.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var K='wu:acq_source';if(!sessionStorage.getItem(K)){var src='direct';var p=new URLSearchParams(location.search);var u=p.get('utm_source');if(u){src=u;}else if(document.referrer){try{var h=new URL(document.referrer).hostname;if(h&&h.indexOf('whounfollowed.co')===-1){src=h;}}catch(e){}}sessionStorage.setItem(K,src);}}catch(e){}})();`,
          }}
        />
        {UMAMI_WEBSITE_ID ? (
          <Script
            defer
            src={UMAMI_SRC}
            data-website-id={UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        ) : null}
        {UMAMI_WEBSITE_ID ? (
          <Script
            defer
            src={UMAMI_RECORDER_SRC}
            data-website-id={UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        ) : null}
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider value={auth}>
            <FontLoader />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
