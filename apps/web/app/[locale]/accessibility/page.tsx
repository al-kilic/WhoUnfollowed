import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { LegalDoc, MailLink } from '@/components/site/LegalDoc';
import { routing, type AppLocale } from '@/i18n/routing';
import { getPathname } from '@/i18n/navigation';
import { OG_LOCALE, ogAlternateLocales } from '@/i18n/ogLocale';
import { getAccessibilityContent } from './content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

const SEO_META: Record<AppLocale, { title: string; description: string }> = {
  en: {
    title: 'Accessibility',
    description: 'Our commitment to making WhoUnfollowed usable for everyone, including people using screen readers, keyboards, or other assistive technology.',
  },
  es: {
    title: 'Accesibilidad',
    description: 'Nuestro compromiso de hacer WhoUnfollowed usable para todos, incluyendo personas que usan lectores de pantalla, teclado u otra tecnología de asistencia.',
  },
  pt: {
    title: 'Acessibilidade',
    description: 'Nosso compromisso de tornar o WhoUnfollowed utilizável para todos, incluindo pessoas que usam leitores de tela, teclado ou outra tecnologia assistiva.',
  },
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const meta = SEO_META[locale];
  const canonical = getPathname({ href: '/accessibility', locale });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, getPathname({ href: '/accessibility', locale: l })]),
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

export default async function AccessibilityPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  // Lets locale-aware Links read the locale without request headers (static rendering).
  setRequestLocale(locale);
  const content = getAccessibilityContent(locale);

  return (
    <LegalDoc locale={locale} eyebrow={content.eyebrow} title={content.headline} dates={content.lastUpdated} backLabel={content.backToHome} sections={[
      { title: content.sections[0]!.title, body: <p>{content.sections[0]!.body}</p> },
      { title: content.sections[1]!.title, body: <p>{content.sections[1]!.body}</p> },
      { title: content.catchingUpTitle, body: <><p><strong>{content.catchingUpBold}</strong></p><p>{content.catchingUpBody}</p></> },
      { title: content.sections[2]!.title, body: <p>{content.sections[2]!.body}</p> },
      { title: content.tellUsTitle, body: <p>{content.tellUsPrefix} <MailLink /> {content.tellUsSuffix}</p> },
    ]} />
  );
}
