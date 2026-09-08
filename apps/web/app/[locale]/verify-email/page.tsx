import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import type { Metadata } from 'next';
import { redirect } from '@/i18n/navigation';
import { validateRequest } from '@/lib/auth/session';
import { isUserVerified } from '@/lib/auth/verification';
import { routing, type AppLocale } from '@/i18n/routing';
import { VerifyEmailForm } from './VerifyEmailForm';

const TITLES: Record<AppLocale, string> = {
  en: 'Verify your email',
  es: 'Verifica tu correo',
  pt: 'Verifique seu email',
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

export default async function VerifyEmailPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const l = locale as AppLocale;

  const { user } = await validateRequest();
  // next-intl's redirect() isn't typed `never` (unlike next/navigation's), so
  // an explicit `return` after each call is needed for `user` to narrow below.
  if (!user) {
    redirect({ href: '/login', locale: l });
    return;
  }
  if (await isUserVerified(user.id)) {
    redirect({ href: '/history', locale: l });
    return;
  }

  return <VerifyEmailForm email={user.email} locale={l} />;
}
