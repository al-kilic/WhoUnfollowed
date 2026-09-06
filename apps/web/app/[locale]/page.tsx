import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { LandingPage } from '@/components/landing/LandingPage';
import { validateRequest } from '@/lib/auth/session';
import { isProUser } from '@/lib/flags';
import { getStats } from '@/lib/stats';
import { UNLOCK_PRICE_USD, UNLOCK_PRICE_SUMMARY } from '@/lib/pricing';
import { routing, type AppLocale } from '@/i18n/routing';
import { getPathname } from '@/i18n/navigation';
import { getHomeContent } from './homeContent';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

// No "| WhoUnfollowed" suffix here: the root layout's title.template already
// appends it. Baking the suffix into these strings too (as the original
// static homepage metadata did, since it used title.default and bypassed the
// template) doubles up once this page defines its own generateMetadata.
const SEO_META: Record<AppLocale, { title: string; description: string; appDescription: string }> = {
  en: {
    title: 'Who Unfollowed You on Instagram? Check Free',
    description:
      'See who doesn\'t follow you back on Instagram by uploading your official data export. Open-source, processed entirely in your browser. No password, no login.',
    appDescription:
      'Privacy-first, open-source Instagram follower analysis. Upload your official data export to see who doesn\'t follow you back. Save snapshots over time to see who unfollowed. No password or login required.',
  },
  es: {
    title: '¿Quién te dejó de seguir en Instagram? Compruébalo gratis',
    description:
      'Descubre quién no te sigue de vuelta en Instagram subiendo tu export oficial de datos. Código abierto, procesado por completo en tu navegador. Sin contraseña, sin inicio de sesión.',
    appDescription:
      'Análisis de seguidores de Instagram que respeta tu privacidad, de código abierto. Sube tu export oficial de datos para ver quién no te sigue de vuelta. Guarda snapshots con el tiempo para ver quién te dejó de seguir. Sin contraseña ni inicio de sesión.',
  },
  pt: {
    title: 'Quem Deixou de te Seguir no Instagram? Confira Grátis',
    description:
      'Veja quem não te segue de volta no Instagram enviando seu export oficial de dados. Código aberto, processado inteiramente no seu navegador. Sem senha, sem login.',
    appDescription:
      'Análise de seguidores do Instagram com privacidade em primeiro lugar, de código aberto. Envie seu export oficial de dados para ver quem não te segue de volta. Guarde snapshots ao longo do tempo para ver quem deixou de te seguir. Sem senha ou login necessários.',
  },
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const meta = SEO_META[locale];
  const canonical = getPathname({ href: '/', locale });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, getPathname({ href: '/', locale: l })]),
  );

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical, languages: { ...languages, 'x-default': languages.en } },
    openGraph: {
      title: meta.title,
      description: meta.description,
      locale,
    },
    twitter: {
      title: meta.title,
      description: meta.description,
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const { user } = await validateRequest();
  const [isPro, initialStats] = await Promise.all([isProUser(), getStats()]);
  const content = getHomeContent(locale);
  const meta = SEO_META[locale];

  // FAQPage markup mirrors the visible homepage FAQ (content.faq.items), so
  // the structured data can never drift from what's actually on the page.
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: Object.values(content.faq.items)
      .flat()
      .map(([question, answer]) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer.replace('{price}', UNLOCK_PRICE_SUMMARY) },
      })),
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'WhoUnfollowed',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    url: SITE_URL,
    inLanguage: locale,
    description: meta.appDescription,
    offers: [
      { '@type': 'Offer', name: 'Free',          price: '0',    priceCurrency: 'USD' },
      { '@type': 'Offer', name: 'Pro (30 days)',  price: String(UNLOCK_PRICE_USD.monthly), priceCurrency: 'USD' },
      { '@type': 'Offer', name: 'Pro (365 days)', price: String(UNLOCK_PRICE_USD.yearly),  priceCurrency: 'USD' },
    ],
    featureList: [
      'Open-source web app (AGPL-3.0), auditable on GitHub',
      'Open-source parser (MPL-2.0)',
      'No Instagram password required',
      'Client-side processing. Data never leaves your browser.',
      'Follower diff and comparison',
      'CSV export',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <LandingPage userEmail={user?.email ?? null} isPro={isPro} initialStats={initialStats} content={content} />
    </>
  );
}
