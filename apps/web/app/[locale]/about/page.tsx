import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing, type AppLocale } from '@/i18n/routing';
import { getPathname } from '@/i18n/navigation';
import { AboutContent } from './AboutContent';
import { getAboutContent } from './content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

const SEO_META: Record<AppLocale, { title: string; description: string; ogDescription: string; twitterDescription: string }> = {
  en: {
    title: 'About WhoUnfollowed and Alan Kilic',
    description: 'WhoUnfollowed is an independent, open-source product built by Alan Kilic under Alcatraz Studio. No VC funding, no team of twenty, no app that asks for your Instagram password.',
    ogDescription: 'An independent product built by Alan Kilic under Alcatraz Studio. Every app ships open-source (AGPL-3.0), asks for the least access it needs, and never wants your password.',
    twitterDescription: 'The independent, privacy-first story behind WhoUnfollowed.',
  },
  es: {
    title: 'Acerca de WhoUnfollowed y Alan Kilic',
    description: 'WhoUnfollowed es un producto independiente y de código abierto construido por Alan Kilic bajo Alcatraz Studio. Sin financiación de inversores, sin equipo de veinte personas, sin una app que pida tu contraseña de Instagram.',
    ogDescription: 'Un producto independiente construido por Alan Kilic bajo Alcatraz Studio. Cada app se lanza de código abierto (AGPL-3.0), pide el mínimo acceso que necesita y nunca quiere tu contraseña.',
    twitterDescription: 'La historia independiente y de privacidad ante todo detrás de WhoUnfollowed.',
  },
  pt: {
    title: 'Sobre o WhoUnfollowed e Alan Kilic',
    description: 'O WhoUnfollowed é um produto independente e de código aberto construído por Alan Kilic sob a Alcatraz Studio. Sem investimento de capital de risco, sem equipe de vinte pessoas, sem um app que pede sua senha do Instagram.',
    ogDescription: 'Um produto independente construído por Alan Kilic sob a Alcatraz Studio. Cada app é lançado de código aberto (AGPL-3.0), pede o mínimo de acesso necessário e nunca quer sua senha.',
    twitterDescription: 'A história independente e com privacidade em primeiro lugar por trás do WhoUnfollowed.',
  },
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const meta = SEO_META[locale];
  const canonical = getPathname({ href: '/about', locale });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, getPathname({ href: '/about', locale: l })]),
  );

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical, languages: { ...languages, 'x-default': languages.en } },
    openGraph: {
      type: 'profile',
      title: meta.title,
      description: meta.ogDescription,
      url: `${SITE_URL}${canonical}`,
      siteName: 'WhoUnfollowed',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.twitterDescription,
    },
  };
}

// ProfilePage + Person: a resolvable author entity so blog Article schema can
// point author.url here. This is the E-E-A-T anchor for both Google and AI
// engines, kept in English (the /author/alan-kilic page it points to isn't
// translated in this phase).
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  mainEntity: {
    '@type': 'Person',
    '@id': `${SITE_URL}/author/alan-kilic#person`,
    name: 'Alan Kilic',
    url: `${SITE_URL}/author/alan-kilic`,
    jobTitle: 'Founder and developer',
    description:
      'Product builder and photographer who builds privacy-first software under the name Alcatraz Studio.',
    sameAs: ['https://github.com/al-kilic'],
    worksFor: { '@id': `${SITE_URL}/#organization` },
  },
};

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AboutContent content={getAboutContent(locale)} />
    </>
  );
}
