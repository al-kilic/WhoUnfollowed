import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { BriefPage, briefMetadata } from '../BriefPage';

interface PageProps { params: Promise<{ locale: string; date: string }> }

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, date } = await params;
  if (!hasLocale(routing.locales, locale) || !DATE.test(date)) notFound();
  return briefMetadata(locale, date);
}

// One week's free brief, kept at a stable dated URL.
export default async function InstagramUpdatesDatePage({ params }: PageProps) {
  const { locale, date } = await params;
  if (!hasLocale(routing.locales, locale) || !DATE.test(date)) notFound();
  setRequestLocale(locale);
  const page = await BriefPage({ locale, date });
  if (!page) notFound();
  return page;
}
