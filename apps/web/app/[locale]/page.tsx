import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { HomePage as HomeView } from '@/components/home/HomePage';
import type { PricingFacts } from '@/components/home/HomePricing';
import { faqItems } from '@/components/home/HomeFaq';
import { getHomeCopy } from '@/components/home/copy';
import { isProUser } from '@/lib/flags';
import { getStats } from '@/lib/stats';
import {
  PRO_AI_PRICE_USD, STANDARD_PRO_AI_PRICE_USD, PRICE_INCREASE_AT,
  TOPUP_PRICE_USD, TOPUP_VALID_MONTHS, isLaunchPricing,
} from '@/lib/pricing';
import { routing, type AppLocale } from '@/i18n/routing';
import { getPathname } from '@/i18n/navigation';
import { OG_LOCALE, ogAlternateLocales } from '@/i18n/ogLocale';
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
      'See who doesn\'t follow you back on Instagram, Threads or TikTok from your official data export. Open source, read in your browser. No password, no login.',
    appDescription:
      'Privacy-first, open-source follower analysis for Instagram, Threads and TikTok. Upload your official data export to see who doesn\'t follow you back, free and without an account. Save snapshots over time to see who unfollowed. Pro AI adds a coach that remembers your account, drafts posts in your voice, checks a post before you share it and plans your week. No password required.',
  },
  es: {
    title: '¿Quién te dejó de seguir en Instagram? Compruébalo gratis',
    description:
      'Descubre quién no te sigue de vuelta en Instagram, Threads o TikTok con tu export oficial de datos. Código abierto, procesado en tu navegador. Sin contraseña.',
    appDescription:
      'Análisis de seguidores de Instagram, Threads y TikTok que respeta tu privacidad, de código abierto. Sube tu export oficial de datos para ver quién no te sigue de vuelta, gratis y sin cuenta. Guarda snapshots con el tiempo para ver quién te dejó de seguir. Pro AI añade un coach que recuerda tu cuenta, escribe borradores con tu voz, revisa un post antes de publicarlo y planifica tu semana. Sin contraseña.',
  },
  pt: {
    title: 'Quem Deixou de te Seguir no Instagram? Confira Grátis',
    description:
      'Veja quem não te segue de volta no Instagram, no Threads ou no TikTok com seu export oficial de dados. Código aberto, processado no seu navegador. Sem senha.',
    appDescription:
      'Análise de seguidores do Instagram, do Threads e do TikTok com privacidade em primeiro lugar, de código aberto. Envie seu export oficial de dados para ver quem não te segue de volta, grátis e sem conta. Guarde snapshots ao longo do tempo para ver quem deixou de te seguir. O Pro AI adiciona um coach que lembra da sua conta, escreve rascunhos com a sua voz, revisa um post antes de você publicar e planeja a sua semana. Sem senha.',
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
      locale: OG_LOCALE[locale],
      alternateLocale: ogAlternateLocales(locale),
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
  // Lets locale-aware Links read the locale without request headers (static rendering).
  setRequestLocale(locale);

  const [isPro, stats] = await Promise.all([isProUser(), getStats()]);
  const copy = getHomeCopy(locale);
  // The last day of launch prices, e.g. "Dec 31".
  const lastLaunchDay = new Date(PRICE_INCREASE_AT.getTime() - 1)
    .toLocaleDateString(locale, { day: 'numeric', month: 'short', timeZone: 'UTC' }).replace('.', '');
  const pricing: PricingFacts = {
    price: PRO_AI_PRICE_USD,
    standard: isLaunchPricing() ? STANDARD_PRO_AI_PRICE_USD : null,
    increaseOn: lastLaunchDay,
    savePct: Math.round((1 - PRO_AI_PRICE_USD.yearly / (PRO_AI_PRICE_USD.monthly * 12)) * 100),
    topup: { price: TOPUP_PRICE_USD, months: TOPUP_VALID_MONTHS },
  };
  // The FAQPage markup below is built from the same answers the page shows.
  const faq = faqItems(copy.faq, {});
  const meta = SEO_META[locale];
  // Launch prices end with PRICE_INCREASE_AT, so search engines don't keep
  // showing them afterwards. Static pages pick up the new prices on the next
  // deploy (see lib/pricing.ts).
  const priceValid = isLaunchPricing()
    ? { priceValidUntil: new Date(PRICE_INCREASE_AT.getTime() - 1).toISOString().slice(0, 10) }
    : {};

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: Object.values(faq)
      .flat()
      .map(([question, answer]) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${SITE_URL}/#software`,
    name: 'WhoUnfollowed',
    provider: { '@id': `${SITE_URL}/#organization` },
    isAccessibleForFree: true,
    license: 'https://www.gnu.org/licenses/agpl-3.0.html',
    sameAs: ['https://github.com/al-kilic/WhoUnfollowed'],
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    url: SITE_URL,
    inLanguage: locale,
    description: meta.appDescription,
    offers: [
      { '@type': 'Offer', name: 'Free',          price: '0',    priceCurrency: 'USD' },
      { '@type': 'Offer', name: 'Pro AI (monthly subscription)', price: String(PRO_AI_PRICE_USD.monthly), priceCurrency: 'USD', ...priceValid },
      { '@type': 'Offer', name: 'Pro AI (yearly subscription)',  price: String(PRO_AI_PRICE_USD.yearly),  priceCurrency: 'USD', ...priceValid },
    ],
    featureList: [
      'Open-source web app (AGPL-3.0), auditable on GitHub',
      'Open-source parser (MPL-2.0)',
      'Works with Instagram, Threads and TikTok data exports',
      'No Instagram, Threads or TikTok password required',
      'Client-side processing. Your export is read in your browser.',
      'Who doesn\'t follow you back, free and without an account',
      'Follower diff and comparison: who unfollowed you between exports',
      'CSV export',
      'Pro AI: a coach that remembers your account',
      'Pro AI: drafts captions and carousels in your voice',
      'Pro AI: checks a post before you share it',
      'Pro AI: a posting plan around your best days, with reminders',
      'A free weekly brief on what changed on Instagram, Threads and TikTok',
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
      <HomeView locale={locale} isPro={isPro} stats={stats} legacy={getHomeContent(locale)} pricing={pricing} faq={faq} />
    </>
  );
}
