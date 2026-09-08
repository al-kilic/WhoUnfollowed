import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import type { Metadata } from 'next';
import { redirect } from '@/i18n/navigation';
import { validateRequest } from '@/lib/auth/session';
import { routing, type AppLocale } from '@/i18n/routing';
import { ForgotPasswordForm } from './ForgotPasswordForm';

const TITLES: Record<AppLocale, string> = {
  en: 'Reset your password',
  es: 'Restablece tu contraseña',
  pt: 'Redefina sua senha',
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

// Auth surface: nothing here belongs in a search index.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return { title: TITLES[locale], robots: { index: false, follow: false } };
}

export default async function ForgotPasswordPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const { user } = await validateRequest();
  if (user) redirect({ href: '/account', locale: locale as AppLocale });

  return <ForgotPasswordForm locale={locale as AppLocale} />;
}
