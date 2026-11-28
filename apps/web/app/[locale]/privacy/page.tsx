import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { LegalDoc, MailLink } from '@/components/site/LegalDoc';
import { routing, type AppLocale } from '@/i18n/routing';
import { getPathname } from '@/i18n/navigation';
import { OG_LOCALE, ogAlternateLocales } from '@/i18n/ogLocale';
import { getPrivacyContent } from './content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

const SEO_META: Record<AppLocale, { title: string; description: string }> = {
  en: { title: 'Privacy Policy', description: 'Privacy Policy for WhoUnfollowed. How we handle your data and our relationship with Instagram, Threads, and Meta.' },
  es: { title: 'Política de Privacidad', description: 'Política de Privacidad de WhoUnfollowed. Cómo manejamos tus datos y nuestra relación con Instagram, Threads y Meta.' },
  pt: { title: 'Política de Privacidade', description: 'Política de Privacidade do WhoUnfollowed. Como tratamos seus dados e nossa relação com o Instagram, o Threads e a Meta.' },
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const meta = SEO_META[locale];
  const canonical = getPathname({ href: '/privacy', locale });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, getPathname({ href: '/privacy', locale: l })]),
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

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  // Lets locale-aware Links read the locale without request headers (static rendering).
  setRequestLocale(locale);
  const c = getPrivacyContent(locale);

  const never = locale === 'en' ? 'NEVER' : 'NUNCA';

  return (
    <LegalDoc locale={locale} eyebrow={c.eyebrow} title={c.headline} dates={c.dates} backLabel={c.backToHome}
      intro={<>
        <div className="lg-box"><p><strong>{c.disclaimerBold}</strong> {c.disclaimerRest}</p></div>
        <div className="lg-box acc"><p className="lg-eyebrow">{c.tldrLabel}</p><p>{c.tldrBody}</p></div>
      </>}
      sections={[
        { title: c.s1Title, body: <p>{c.s1Body}</p> },
        { title: c.s2Title, body: <>
          <p>{c.s2Intro}</p>
          <ul className="lg-list">{c.legalBases.map((item) => <li key={item.label}><span><strong>{item.label}:</strong> {item.text}</span></li>)}</ul>
        </> },
        { title: c.s3Title, body: <><p>{c.s3Body1}</p><p>{c.s3Body2}</p></> },
        { title: c.s4Title, body: <ul className="lg-never">{c.neverCollect.map((item) => <li key={item}><b>{never}</b><span>{item}</span></li>)}</ul> },
        { title: c.s5Title, body: <><p>{c.s5Body1}</p><p>{c.s5Body2}</p><p>{c.s5Body3}</p><p>{c.s5Body4}</p><p>{c.s5BodyAi}</p></> },
        { title: c.s6Title, body: <><p>{c.s6Body1}</p><p>{c.s6Body2}</p></> },
        { title: c.s7Title, body: <><p>{c.s7Body1}</p><p>{c.s7Body2}</p></> },
        { title: c.s8Title, body: <><p><strong>{c.s8FreeLabel}</strong> {c.s8FreeBody}</p><p><strong>{c.s8ProLabel}</strong> {c.s8ProBody}</p></> },
        { title: c.s9Title, body: <>
          <p>{c.s9Intro}</p>
          <ul className="lg-list">{c.gdprRights.map((r) => <li key={r}><span>{r}</span></li>)}</ul>
          <p>{c.s9Outro}</p>
        </> },
        { title: c.s10Title, body: <p>{c.s10Body}</p> },
        { title: c.s11Title, body: <p>{c.s11Body}</p> },
        { title: c.s12Title, body: <><p>{c.s12Intro}<br /><MailLink /></p><p className="lg-small">{c.s12Footer}</p></> },
      ]} />
  );
}
