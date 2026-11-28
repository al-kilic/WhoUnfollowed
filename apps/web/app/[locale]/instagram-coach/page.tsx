import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing, type AppLocale } from '@/i18n/routing';
import { OG_LOCALE, ogAlternateLocales } from '@/i18n/ogLocale';
import { getPathname } from '@/i18n/navigation';
import { PRICE_INCREASE_AT, PRO_AI_PRICE_USD, isLaunchPricing } from '@/lib/pricing';
import { CoachPageView } from './CoachPageView';
import { getCoachPageContent } from './content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';
const PATH = '/instagram-coach';

interface PageProps { params: Promise<{ locale: string }> }

function contentFor(locale: AppLocale) {
  return getCoachPageContent(locale, { monthly: `$${PRO_AI_PRICE_USD.monthly}`, yearly: `$${PRO_AI_PRICE_USD.yearly}` });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const { meta } = contentFor(locale);
  const canonical = getPathname({ href: PATH, locale });
  const languages = Object.fromEntries(routing.locales.map((l) => [l, getPathname({ href: PATH, locale: l })]));
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical, languages: { ...languages, 'x-default': languages.en } },
    openGraph: { title: meta.title, description: meta.description, url: `${SITE_URL}${canonical}`, locale: OG_LOCALE[locale], alternateLocale: ogAlternateLocales(locale), images: [{ url: `/og/coach/${locale}`, width: 1200, height: 630, alt: meta.title }] },
    twitter: { title: meta.title, description: meta.description, images: [`/og/coach/${locale}`] },
  };
}

// The public page for the Pro AI coach. Studio itself is noindex, so this is
// what search and AI answer engines read about the coach.
export default async function InstagramCoachPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const c = contentFor(locale as AppLocale);
  const canonical = `${SITE_URL}${getPathname({ href: PATH, locale })}`;
  const priceValid = isLaunchPricing()
    ? { priceValidUntil: new Date(PRICE_INCREASE_AT.getTime() - 1).toISOString().slice(0, 10) }
    : {};

  // Built from the content the page renders, so they can't drift.
  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: c.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    {
      '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'WhoUnfollowed Pro AI', url: canonical,
      isPartOf: { '@id': `${SITE_URL}/#software` }, applicationCategory: 'BusinessApplication', operatingSystem: 'Web',
      inLanguage: locale, description: c.meta.description,
      featureList: [...c.why, ...c.do].map((i) => i.t),
      offers: [
        { '@type': 'Offer', name: 'Pro AI (monthly subscription)', price: String(PRO_AI_PRICE_USD.monthly), priceCurrency: 'USD', ...priceValid },
        { '@type': 'Offer', name: 'Pro AI (yearly subscription)', price: String(PRO_AI_PRICE_USD.yearly), priceCurrency: 'USD', ...priceValid },
      ],
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'WhoUnfollowed', item: `${SITE_URL}${getPathname({ href: '/', locale })}` },
        { '@type': 'ListItem', position: 2, name: c.meta.title, item: canonical },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CoachPageView c={c} />
    </>
  );
}
