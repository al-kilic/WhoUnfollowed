import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing, type AppLocale } from '@/i18n/routing';
import { getPathname } from '@/i18n/navigation';
import { WhatIsContent } from './WhatIsContent';
import { getWhatIsContent } from './content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

const SEO_META: Record<AppLocale, { title: string; description: string; twitterTitle: string; twitterDescription: string }> = {
  en: {
    title: 'What Is WhoUnfollowed? See Who Unfollowed You Without a Password',
    description: "WhoUnfollowed is open-source and reads the data export Instagram already gives you, showing who doesn't follow you back in your browser in 2 seconds. No password, no server.",
    twitterTitle: 'What Is WhoUnfollowed?',
    twitterDescription: "See who doesn't follow you back on Instagram without giving anyone your password.",
  },
  es: {
    title: '¿Qué es WhoUnfollowed? Ve quién te dejó de seguir sin contraseña',
    description: 'WhoUnfollowed es de código abierto y lee el export de datos que Instagram ya te da, mostrando quién no te sigue de vuelta en tu navegador en 2 segundos. Sin contraseña, sin servidor.',
    twitterTitle: '¿Qué es WhoUnfollowed?',
    twitterDescription: 'Ve quién no te sigue de vuelta en Instagram sin darle tu contraseña a nadie.',
  },
  pt: {
    title: 'O Que É o WhoUnfollowed? Veja Quem Deixou de te Seguir Sem Senha',
    description: 'O WhoUnfollowed é de código aberto e lê o export de dados que o Instagram já te dá, mostrando quem não te segue de volta no seu navegador em 2 segundos. Sem senha, sem servidor.',
    twitterTitle: 'O Que É o WhoUnfollowed?',
    twitterDescription: 'Veja quem não te segue de volta no Instagram sem dar sua senha a ninguém.',
  },
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const meta = SEO_META[locale];
  const canonical = getPathname({ href: '/what-is-whounfollowed', locale });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, getPathname({ href: '/what-is-whounfollowed', locale: l })]),
  );

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical, languages: { ...languages, 'x-default': languages.en } },
    openGraph: {
      type: 'website',
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}${canonical}`,
      siteName: 'WhoUnfollowed',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.twitterTitle,
      description: meta.twitterDescription,
    },
  };
}

export default async function WhatIsWhoUnfollowedPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const content = getWhatIsContent(locale);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <WhatIsContent content={content} />
    </>
  );
}
