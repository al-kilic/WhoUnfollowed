import { redirect } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { validateRequest } from '@/lib/auth/session';
import type { Metadata } from 'next';
import { routing, type AppLocale } from '@/i18n/routing';
import { LoginForm } from './LoginForm';

const TITLES: Record<AppLocale, string> = { en: 'Log in', es: 'Iniciar sesión', pt: 'Entrar' };

interface PageProps {
  params: Promise<{ locale: string }>;
}

// Auth surface: nothing here belongs in a search index.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return { title: TITLES[locale], robots: { index: false, follow: false } };
}

export default async function LoginPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Already logged in? Don't show the login form again — send them to history.
  const { user } = await validateRequest();
  if (user) {
    redirect('/history');
  }

  return <LoginForm locale={locale} />;
}
