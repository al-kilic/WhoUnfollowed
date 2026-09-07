import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import type { Metadata } from 'next';
import { routing, type AppLocale } from '@/i18n/routing';
import { getResultsContent } from './content';
import { ResultsClient } from './ResultsClient';

interface PageProps {
  params: Promise<{ locale: string }>;
}

// Private, per-visitor surface driven entirely by client-side snapshot state.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return { title: getResultsContent(locale).metaTitle, robots: { index: false, follow: false } };
}

export default async function ResultsPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return <ResultsClient locale={locale as AppLocale} />;
}
