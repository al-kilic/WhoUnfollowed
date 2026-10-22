import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { redirect } from '@/i18n/navigation';
import { routing, type AppLocale } from '@/i18n/routing';

// Settings has been merged into the unified /account page.
export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  // Lets locale-aware Links read the locale without request headers (static rendering).
  setRequestLocale(locale);
  redirect({ href: '/account', locale: locale as AppLocale });
}
