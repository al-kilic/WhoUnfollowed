import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { ThemeProvider } from 'next-themes';
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
    default: 'WhoUnfollowed - See who unfollowed you',
    template: '%s | WhoUnfollowed',
  },
  description:
    "Upload your Instagram data export and see who unfollowed you, who doesn't follow back, and track changes over time. Nothing leaves your browser.",
  keywords: [
    'instagram unfollow tracker',
    'instagram followers',
    'who unfollowed me instagram',
    'instagram data export',
    'privacy instagram tool',
    'local-first instagram analytics',
  ],
  authors: [{ name: 'WhoUnfollowed' }],
  creator: 'WhoUnfollowed',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'WhoUnfollowed',
    title: 'WhoUnfollowed - See who unfollowed you',
    description:
      "Upload your Instagram export. See who unfollowed you, who doesn't follow back, and track changes over time. Nothing leaves your browser.",
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
    title: 'WhoUnfollowed - See who unfollowed you',
    description:
      'Upload your Instagram export. See who unfollowed you. Nothing leaves your browser.',
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const auth = await getAuthState();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
