import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { redirect } from '@/i18n/navigation';
import { routing, type AppLocale } from '@/i18n/routing';

// Settings has been merged into the unified /account page.
export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  redirect({ href: '/account', locale: locale as AppLocale });
}
