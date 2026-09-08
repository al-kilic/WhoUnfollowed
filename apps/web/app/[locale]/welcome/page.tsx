import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import type { Metadata } from 'next';
import { routing, type AppLocale } from '@/i18n/routing';
import { WelcomeContent } from './WelcomeContent';

const TITLES: Record<AppLocale, string> = {
  en: 'Set your password',
  es: 'Elige tu contraseña',
  pt: 'Defina sua senha',
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

// Auth surface: nothing here belongs in a search index. This is the
// post-purchase set-a-password step, reached by link (Stripe checkout's
// success_url).
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return { title: TITLES[locale], robots: { index: false, follow: false } };
}

export default async function WelcomePage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return <WelcomeContent locale={locale as AppLocale} />;
}
