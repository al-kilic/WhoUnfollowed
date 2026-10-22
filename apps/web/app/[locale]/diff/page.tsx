import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import type { Metadata } from 'next';
import { routing, type AppLocale } from '@/i18n/routing';
import { AuthProvider } from '@/components/AuthProvider';
import { getAuthState } from '@/lib/auth/getAuthState';
import { DiffContent } from './DiffContent';

// Private, per-visitor surface driven entirely by client-side snapshot state.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return { robots: { index: false, follow: false } };
}

export default async function DiffPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  // Lets locale-aware Links read the locale without request headers (static rendering).
  setRequestLocale(locale);

  return (
    // Per-visitor page: server-rendered login state avoids a flash of the
    // free-plan UI for Pro users while the client fetch would resolve.
    <AuthProvider value={await getAuthState()}>
      <DiffContent locale={locale as AppLocale} />
    </AuthProvider>
  );
}
