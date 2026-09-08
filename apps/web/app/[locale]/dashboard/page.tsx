import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { validateRequest } from '@/lib/auth/session';
import { isProUser } from '@/lib/flags';
import { isUserVerified } from '@/lib/auth/verification';
import type { Metadata } from 'next';
import { redirect } from '@/i18n/navigation';
import { routing, type AppLocale } from '@/i18n/routing';
import { getDashboardContent } from './content';
import { DashboardClient } from './DashboardClient';

// Public (works for anonymous visitors with a local snapshot too, showing a
// blurred Pro teaser) but reads per-request session/subscription state via
// cookies, so it must never get swept into the [locale] layout's static
// generation.
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ locale: string }>;
}

// robots.ts already disallows this route, but the meta tag also covers
// crawlers that fetch the page directly and ignore robots.txt.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return { title: getDashboardContent(locale).metaTitle, robots: { index: false, follow: false } };
}

export default async function DashboardPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const { user } = await validateRequest();
  if (user && !(await isUserVerified(user.id))) redirect({ href: '/verify-email', locale: locale as AppLocale });
  const isPro = await isProUser();
  return (
    <DashboardClient
      locale={locale as AppLocale}
      account={{ userId: user?.id ?? null, userEmail: user?.email ?? null, isPro }}
    />
  );
}
