import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { validateRequest } from '@/lib/auth/session';
import { isPaidFeaturesEnabled, isPaidSubscriber } from '@/lib/flags';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing, type AppLocale } from '@/i18n/routing';
import { getPathname } from '@/i18n/navigation';
import { OG_LOCALE, ogAlternateLocales } from '@/i18n/ogLocale';
import { PricingClient } from './PricingClient';
import { getAuthState } from '@/lib/auth/getAuthState';
import '@/styles/home-base.css';
import '@/styles/home-header.css';
import '@/styles/home-page.css';
import '@/styles/pricing.css';
import { SiteHeader } from '@/components/site/SiteHeader';
import { HomeFooter } from '@/components/home/HomeFooter';
import { getHomeCopy } from '@/components/home/copy';
import { HM_FONTS } from '@/components/home/fonts';
import { getPricingFaq } from './faq';
import { getPricingContent } from './content';
import { getPricingMore } from './pricingMore.content';
import { PRO_AI_PRICE_SUMMARY } from '@/lib/pricing';
import { getLifetimeAvailability } from '@/lib/lifetimeSeats';
import { isLifetimeMember } from '@/lib/flags';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

const SEO_META: Record<AppLocale, { title: string; description: string; ogDescription: string; home: string; pricing: string }> = {
  en: {
    title: 'Pricing',
    description: `Free to check who doesn't follow you back, no account needed. Pro AI (${PRO_AI_PRICE_SUMMARY}) adds a coach that remembers your account and shows exactly who unfollowed you. Cancel any time.`,
    ogDescription: `Free forever, no account needed. Pro AI is ${PRO_AI_PRICE_SUMMARY}, with a coach that remembers your account. Cancel any time.`,
    home: 'Home',
    pricing: 'Pricing',
  },
  es: {
    title: 'Precios',
    description: `Gratis para siempre, sin necesidad de cuenta. Pro AI (${PRO_AI_PRICE_SUMMARY}) suma un coach que recuerda tu cuenta y muestra exactamente quién te dejó de seguir. Cancela cuando quieras.`,
    ogDescription: `Gratis para siempre, sin necesidad de cuenta. Pro AI cuesta ${PRO_AI_PRICE_SUMMARY}, con un coach que recuerda tu cuenta. Cancela cuando quieras.`,
    home: 'Inicio',
    pricing: 'Precios',
  },
  pt: {
    title: 'Preços',
    description: `Grátis para sempre, sem necessidade de conta. O Pro AI (${PRO_AI_PRICE_SUMMARY}) traz um coach que lembra da sua conta e mostra exatamente quem deixou de te seguir. Cancele quando quiser.`,
    ogDescription: `Grátis para sempre, sem necessidade de conta. O Pro AI custa ${PRO_AI_PRICE_SUMMARY}, com um coach que lembra da sua conta. Cancele quando quiser.`,
    home: 'Início',
    pricing: 'Preços',
  },
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const meta = SEO_META[locale];
  const canonical = getPathname({ href: '/pricing', locale });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, getPathname({ href: '/pricing', locale: l })]),
  );

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical, languages: { ...languages, 'x-default': languages.en } },
    openGraph: {
      type: 'website',
      title: meta.title,
      description: meta.ogDescription,
      url: `${SITE_URL}${canonical}`,
      siteName: 'WhoUnfollowed',
      locale: OG_LOCALE[locale],
      alternateLocale: ogAlternateLocales(locale),
    },
  };
}

export default async function PricingPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  // Lets locale-aware Links read the locale without request headers (static rendering).
  setRequestLocale(locale);

  const { user } = await validateRequest();
  const paymentsEnabled = isPaidFeaturesEnabled();
  const isPro = await isPaidSubscriber();
  const auth = await getAuthState();
  const availability = await getLifetimeAvailability();
  // Only what the card needs; the Stripe price ID stays on the server.
  const lifetime = availability.status === 'open' ? { status: 'open' as const, offer: availability.offer } : availability;
  const lifetimeMember = await isLifetimeMember();
  const meta = SEO_META[locale];
  const faq = getPricingFaq(locale);
  const content = getPricingContent(locale);
  const canonicalPath = getPathname({ href: '/pricing', locale });

  // FAQPage markup is generated from the same faq array the page renders, so
  // the structured data can never drift from the visible on-page text.
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: meta.home, item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: meta.pricing, item: `${SITE_URL}${canonicalPath}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className={`hm hm-page pr-page ${HM_FONTS}`} id="hm">
      <SiteHeader />
      <PricingClient
        userEmail={user?.email ?? null}
        paymentsEnabled={paymentsEnabled}
        isPro={isPro}
        isLegacyPro={auth.isLegacyPro}
        lifetime={lifetime}
        isLifetimeMember={lifetimeMember}
        content={content}
        more={getPricingMore(locale)}
        faq={faq}
        locale={locale}
      />
      <HomeFooter c={getHomeCopy(locale).footer} />
      </div>
    </>
  );
}
