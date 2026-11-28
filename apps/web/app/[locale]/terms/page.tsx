import { Link } from '@/i18n/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { LegalDoc, MailLink } from '@/components/site/LegalDoc';
import { routing, type AppLocale } from '@/i18n/routing';
import { getPathname } from '@/i18n/navigation';
import { OG_LOCALE, ogAlternateLocales } from '@/i18n/ogLocale';
import { getTermsContent } from './content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

const SEO_META: Record<AppLocale, { title: string; description: string }> = {
  en: { title: 'Terms of Service', description: 'The terms and conditions for using WhoUnfollowed.' },
  es: { title: 'Términos de Servicio', description: 'Los términos y condiciones para usar WhoUnfollowed.' },
  pt: { title: 'Termos de Serviço', description: 'Os termos e condições para usar o WhoUnfollowed.' },
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const meta = SEO_META[locale];
  const canonical = getPathname({ href: '/terms', locale });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, getPathname({ href: '/terms', locale: l })]),
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

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  // Lets locale-aware Links read the locale without request headers (static rendering).
  setRequestLocale(locale);
  const c = getTermsContent(locale);

  return (
    <LegalDoc locale={locale} eyebrow={c.eyebrow} title={c.headline} dates={c.lastUpdated} backLabel={c.backToHome} sections={[
      { title: c.s1Title, body: <p>{c.s1Body}</p> },
      { title: c.s2Title, body: <p>{c.s2Body}</p> },
      { title: c.s3Title, body: <p>{c.s3Body}</p> },
      { title: c.s4Title, body: <p>{c.s4Pre} <Link href="/privacy">{c.s4LinkLabel}</Link> {c.s4Post}</p> },
      { title: c.s5Title, body: <p>{c.s5Pre} <Link href="/refund">{c.s5LinkLabel}</Link> {c.s5Post}</p> },
      { title: c.s6Title, body: <p>{c.s6Body}</p> },
      { title: c.s7Title, body: <p>{c.s7Body}</p> },
      { title: c.s8Title, body: <p>{c.s8Body}</p> },
      { title: c.s9Title, body: <p>{c.s9Pre} <MailLink />.</p> },
    ]} />
  );
}
