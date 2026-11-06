import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing, type AppLocale } from '@/i18n/routing';
import { OG_LOCALE, ogAlternateLocales } from '@/i18n/ogLocale';
import { getPathname } from '@/i18n/navigation';
import { TikTokContent } from './TikTokContent';
import { getTikTokPageContent } from './content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

// Title mirrors the H1 and stays under 60 characters, the range Google
// rewrites least.
const SEO_META: Record<AppLocale, { title: string; description: string }> = {
  en: {
    title: 'Who Unfollowed You on TikTok? Check Free',
    description: "See who doesn't follow you back on TikTok from your official data download. Open-source, processed in your browser. No password, no login.",
  },
  es: {
    title: '¿Quién te dejó de seguir en TikTok?',
    description: 'Descubre quién no te sigue de vuelta en TikTok con tu descarga oficial de datos. Código abierto, procesado en tu navegador. Sin contraseña, sin inicio de sesión.',
  },
  pt: {
    title: 'Quem Deixou de te Seguir no TikTok?',
    description: 'Veja quem não te segue de volta no TikTok com seu download oficial de dados. Código aberto, processado no seu navegador. Sem senha, sem login.',
  },
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const meta = SEO_META[locale];
  const canonical = getPathname({ href: '/tiktok', locale });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, getPathname({ href: '/tiktok', locale: l })]),
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
    twitter: { title: meta.title, description: meta.description },
  };
}

export default async function TikTokPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  // Lets locale-aware Links read the locale without request headers (static rendering).
  setRequestLocale(locale);
  const content = getTikTokPageContent(locale as AppLocale);
  const canonical = `${SITE_URL}${getPathname({ href: '/tiktok', locale })}`;

  // Both schemas are built from the same content the page renders, so they
  // can't drift from what readers see.
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: content.stepsHeadline,
    description: content.intro,
    totalTime: 'PT2M',
    tool: [{ '@type': 'HowToTool', name: 'TikTok app' }],
    step: content.steps.map((step, i) => ({
      '@type': 'HowToStep',
      name: step.title,
      text: step.body,
      url: `${canonical}#step${i + 1}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <TikTokContent content={content} />
    </>
  );
}
