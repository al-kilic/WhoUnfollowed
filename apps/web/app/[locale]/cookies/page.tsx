import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { LegalDoc } from '@/components/site/LegalDoc';
import { routing, type AppLocale } from '@/i18n/routing';
import { getPathname } from '@/i18n/navigation';
import { OG_LOCALE, ogAlternateLocales } from '@/i18n/ogLocale';
import { getCookiesContent } from './content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

const SEO_META: Record<AppLocale, { title: string; description: string }> = {
  en: { title: 'Cookie Policy', description: 'How we use cookies and local storage on WhoUnfollowed.' },
  es: { title: 'Política de Cookies', description: 'Cómo usamos las cookies y el almacenamiento local en WhoUnfollowed.' },
  pt: { title: 'Política de Cookies', description: 'Como usamos cookies e armazenamento local no WhoUnfollowed.' },
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const meta = SEO_META[locale];
  const canonical = getPathname({ href: '/cookies', locale });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, getPathname({ href: '/cookies', locale: l })]),
  );

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical, languages: { ...languages, 'x-default': languages.en } },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}${canonical}`,
      locale: OG_LOCALE[locale],
      alternateLocale: ogAlternateLocales(locale),
    },
  };
}

export default async function CookiePage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  // Lets locale-aware Links read the locale without request headers (static rendering).
  setRequestLocale(locale);
  const c = getCookiesContent(locale);

  return (
    <LegalDoc locale={locale} eyebrow={c.eyebrow} title={c.headline} dates={c.lastUpdated} backLabel={c.backToHome} sections={[
      { title: c.s1Title, body: <p>{c.s1Body}</p> },
      { title: c.s2Title, body: <><p><strong>{c.s2Bold}</strong></p><p>{c.s2Body1}</p><p>{c.s2Body2}</p></> },
      { title: c.s3Title, body: <><p>{c.s3Body1}</p><p>{c.s3Body2Pre} <strong>{c.s3Bold}</strong> {c.s3Body2Post}</p></> },
      { title: c.s4Title, body: <p>{c.s4Body}</p> },
    ]} />
  );
}
