import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import type { Metadata } from 'next';
import { routing, type AppLocale } from '@/i18n/routing';
import { ResetPasswordForm } from './ResetPasswordForm';

const TITLES: Record<AppLocale, string> = {
  en: 'Set a new password',
  es: 'Establece una nueva contraseña',
  pt: 'Defina uma nova senha',
};

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}

// Auth surface: nothing here belongs in a search index.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return { title: TITLES[locale], robots: { index: false, follow: false } };
}

export default async function ResetPasswordPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const { token } = await searchParams;

  return <ResetPasswordForm token={token ?? ''} locale={locale as AppLocale} />;
}
