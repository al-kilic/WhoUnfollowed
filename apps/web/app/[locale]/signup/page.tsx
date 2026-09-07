import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { validateRequest } from '@/lib/auth/session';
import type { Metadata } from 'next';
import { redirect } from '@/i18n/navigation';
import { routing, type AppLocale } from '@/i18n/routing';
import { SignupForm } from './SignupForm';

const TITLES: Record<AppLocale, string> = { en: 'Sign up', es: 'Registrarse', pt: 'Cadastre-se' };

interface PageProps {
  params: Promise<{ locale: string }>;
}

// Auth surface: nothing here belongs in a search index.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return { title: TITLES[locale], robots: { index: false, follow: false } };
}

export default async function SignupPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Already logged in? Skip the signup form.
  const { user } = await validateRequest();
  if (user) {
    redirect({ href: '/history', locale: locale as AppLocale });
  }

  return <SignupForm locale={locale} />;
}
