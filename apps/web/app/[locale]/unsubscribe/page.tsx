import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { getUnsubscribeContent } from './content';
import { UnsubscribeForm } from './UnsubscribeForm';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return { title: getUnsubscribeContent(locale).metaTitle, robots: { index: false, follow: false } };
}

export default async function UnsubscribePage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return (
    <Suspense>
      <UnsubscribeForm c={getUnsubscribeContent(locale)} />
    </Suspense>
  );
}
