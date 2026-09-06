import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing, type AppLocale } from '@/i18n/routing';
import { getPathname } from '@/i18n/navigation';
import { HowToExportContent } from './HowToExportContent';
import { getHowToExportContent } from './content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

const SEO_META: Record<AppLocale, { title: string; description: string }> = {
  en: {
    title: 'How to Export Instagram Followers & Following Data - Step-by-Step Guide (2026)',
    description: 'Step-by-step guide to downloading your Instagram followers and following list as a ZIP. Takes under 5 minutes. No third-party app, no password needed.',
  },
  es: {
    title: 'Cómo Exportar tus Seguidores y Seguidos de Instagram: Guía Paso a Paso (2026)',
    description: 'Guía paso a paso para descargar tu lista de seguidores y seguidos de Instagram como un ZIP. Toma menos de 5 minutos. Sin apps de terceros, sin contraseña.',
  },
  pt: {
    title: 'Como Exportar Seguidores e Seguindo do Instagram: Guia Passo a Passo (2026)',
    description: 'Guia passo a passo para baixar sua lista de seguidores e seguindo do Instagram como um ZIP. Leva menos de 5 minutos. Sem app de terceiros, sem senha.',
  },
};

// HowTo mirrors the visible "Download to device" step flow so search and AI
// engines can surface the export steps directly. Kept in a function (not a
// flat constant) so its text pulls from the same locale content the page
// renders — schema can't drift from what's on the page.
function buildHowToJsonLd(locale: AppLocale) {
  const content = getHowToExportContent(locale);
  const canonical = getPathname({ href: '/how-to-export', locale });
  const d = content.device;
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: content.headline,
    description: content.intro,
    totalTime: 'PT5M',
    tool: [{ '@type': 'HowToTool', name: 'Instagram Accounts Center' }],
    step: [
      { '@type': 'HowToStep', name: d.step1.title, text: d.step1.hint, url: `${SITE_URL}${canonical}#step1` },
      { '@type': 'HowToStep', name: d.step2.title, text: d.step2.nav.join(' → '), url: `${SITE_URL}${canonical}#step2` },
      { '@type': 'HowToStep', name: d.step3.title, text: d.step3.hint, url: `${SITE_URL}${canonical}#step3` },
      { '@type': 'HowToStep', name: d.step4.title, text: d.step4.hint, url: `${SITE_URL}${canonical}#step4` },
      { '@type': 'HowToStep', name: d.step5.title, text: d.step5.hint, url: `${SITE_URL}${canonical}#step5` },
      { '@type': 'HowToStep', name: d.step6.title, text: d.step6.hint, url: `${SITE_URL}${canonical}#step6` },
    ],
  };
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const meta = SEO_META[locale];
  const canonical = getPathname({ href: '/how-to-export', locale });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, getPathname({ href: '/how-to-export', locale: l })]),
  );

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical, languages: { ...languages, 'x-default': languages.en } },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}${canonical}`,
    },
  };
}

export default async function HowToExportPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const content = getHowToExportContent(locale);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.items.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildHowToJsonLd(locale)) }}
      />
      <HowToExportContent content={content} />
    </>
  );
}
