import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing, type AppLocale } from '@/i18n/routing';
import { OG_LOCALE, ogAlternateLocales } from '@/i18n/ogLocale';
import { getPathname } from '@/i18n/navigation';
import { ThreadsContent } from './ThreadsContent';
import { getThreadsPageContent } from './content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

// Title mirrors the H1 and stays under 60 characters, the range Google
// rewrites least.
const SEO_META: Record<AppLocale, { title: string; description: string }> = {
  en: {
    title: 'Who Unfollowed You on Threads? Check Free',
    description: "See who doesn't follow you back on Threads from your official data export. Open-source, processed in your browser. No password, no login.",
  },
  es: {
    title: '¿Quién te dejó de seguir en Threads? Compruébalo gratis',
    description: 'Descubre quién no te sigue de vuelta en Threads con tu export oficial de datos. Código abierto, procesado en tu navegador. Sin contraseña, sin inicio de sesión.',
  },
  pt: {
    title: 'Quem Deixou de te Seguir no Threads? Confira Grátis',
    description: 'Veja quem não te segue de volta no Threads com seu export oficial de dados. Código aberto, processado no seu navegador. Sem senha, sem login.',
  },
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const meta = SEO_META[locale];
  const canonical = getPathname({ href: '/threads', locale });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, getPathname({ href: '/threads', locale: l })]),
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

export default async function ThreadsPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const content = getThreadsPageContent(locale as AppLocale);
  const canonical = `${SITE_URL}${getPathname({ href: '/threads', locale })}`;

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
    totalTime: 'PT5M',
    tool: [{ '@type': 'HowToTool', name: 'Meta Accounts Center' }],
    step: content.steps.map((step, i) => ({
      '@type': 'HowToStep',
      name: step.title,
      text: step.body,
      url: `${canonical}#step${i + 1}`,
    })),
  };

  return (
    <>
      {/* Apply the Threads theme before first paint so visitors landing here
          from search don't see the cream theme flash to black on hydration.
          usePlatformTheme in ThreadsContent removes it on navigation. */}
      <script dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.platform='threads'" }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <ThreadsContent content={content} />
    </>
  );
}
