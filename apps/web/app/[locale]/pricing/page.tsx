import type { Metadata } from 'next';
import { validateRequest } from '@/lib/auth/session';
import { isPaidFeaturesEnabled, isPaidSubscriber } from '@/lib/flags';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing, type AppLocale } from '@/i18n/routing';
import { getPathname } from '@/i18n/navigation';
import { PricingClient } from './PricingClient';
import { getPricingFaq } from './faq';
import { getPricingContent } from './content';
import { UNLOCK_PRICE_SUMMARY } from '@/lib/pricing';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

const SEO_META: Record<AppLocale, { title: string; description: string; ogDescription: string; home: string; pricing: string }> = {
  en: {
    title: 'Pricing',
    description: `Free forever, no account needed. Pro is a one-time unlock (${UNLOCK_PRICE_SUMMARY}) that adds snapshot history, cloud sync, and trends. No auto-renewal.`,
    ogDescription: `Free forever, no account needed. Pro is a one-time unlock (${UNLOCK_PRICE_SUMMARY}). No subscription, no auto-renewal.`,
    home: 'Home',
    pricing: 'Pricing',
  },
  es: {
    title: 'Precios',
    description: `Gratis para siempre, sin necesidad de cuenta. Pro es un desbloqueo único (${UNLOCK_PRICE_SUMMARY}) que añade historial de snapshots, sincronización en la nube y tendencias. Sin renovación automática.`,
    ogDescription: `Gratis para siempre, sin necesidad de cuenta. Pro es un desbloqueo único (${UNLOCK_PRICE_SUMMARY}). Sin suscripción, sin renovación automática.`,
    home: 'Inicio',
    pricing: 'Precios',
  },
  pt: {
    title: 'Preços',
    description: `Grátis para sempre, sem necessidade de conta. O Pro é um desbloqueio único (${UNLOCK_PRICE_SUMMARY}) que adiciona histórico de snapshots, sincronização na nuvem e tendências. Sem renovação automática.`,
    ogDescription: `Grátis para sempre, sem necessidade de conta. O Pro é um desbloqueio único (${UNLOCK_PRICE_SUMMARY}). Sem assinatura, sem renovação automática.`,
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
      locale,
    },
  };
}

export default async function PricingPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const { user } = await validateRequest();
  const paymentsEnabled = isPaidFeaturesEnabled();
  const isPro = await isPaidSubscriber();
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
      <PricingClient
        userEmail={user?.email ?? null}
        paymentsEnabled={paymentsEnabled}
        isPro={isPro}
        content={content}
        faq={faq}
      />
    </>
  );
}
