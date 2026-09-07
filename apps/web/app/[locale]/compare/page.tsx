import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { CompareIndexContent } from './CompareIndexContent';
import { getCompareIndexContent } from './indexContent';
import { COMPARISONS, resolveComparison } from '@/app/compare/comparisons';
import { routing, type AppLocale } from '@/i18n/routing';
import { OG_LOCALE, ogAlternateLocales } from '@/i18n/ogLocale';
import { getPathname } from '@/i18n/navigation';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

const SEO_META: Record<AppLocale, { title: string; description: string; ogDescription: string; twitterDescription: string; home: string; compare: string }> = {
  en: {
    title: 'WhoUnfollowed vs Every Instagram Follower Tracker',
    description: 'Every other Instagram tracker asks for your password. WhoUnfollowed does not. Compare privacy, ban risk, features, and pricing across the top unfollower apps.',
    ogDescription: 'Every other Instagram tracker asks for your password. WhoUnfollowed does not. See the full breakdown of privacy, ban risk, features, and pricing.',
    twitterDescription: 'Every other Instagram tracker asks for your password. WhoUnfollowed does not. See the full breakdown.',
    home: 'Home', compare: 'Compare',
  },
  es: {
    title: 'WhoUnfollowed vs Todos los Rastreadores de Seguidores de Instagram',
    description: 'Todos los demás rastreadores de Instagram piden tu contraseña. WhoUnfollowed no. Compara privacidad, riesgo de baneo, funciones y precios entre las principales apps.',
    ogDescription: 'Todos los demás rastreadores de Instagram piden tu contraseña. WhoUnfollowed no. Ve el desglose completo de privacidad, riesgo de baneo, funciones y precios.',
    twitterDescription: 'Todos los demás rastreadores de Instagram piden tu contraseña. WhoUnfollowed no. Ve el desglose completo.',
    home: 'Inicio', compare: 'Comparar',
  },
  pt: {
    title: 'WhoUnfollowed vs Todos os Rastreadores de Seguidores do Instagram',
    description: 'Todos os outros rastreadores do Instagram pedem sua senha. O WhoUnfollowed não. Compare privacidade, risco de banimento, recursos e preços entre os principais apps.',
    ogDescription: 'Todos os outros rastreadores do Instagram pedem sua senha. O WhoUnfollowed não. Veja o detalhamento completo de privacidade, risco de banimento, recursos e preços.',
    twitterDescription: 'Todos os outros rastreadores do Instagram pedem sua senha. O WhoUnfollowed não. Veja o detalhamento completo.',
    home: 'Início', compare: 'Comparar',
  },
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const meta = SEO_META[locale];
  const canonical = getPathname({ href: '/compare', locale });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, getPathname({ href: '/compare', locale: l })]),
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
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.twitterDescription,
    },
  };
}

export default async function ComparePage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const meta = SEO_META[locale];
  const canonical = getPathname({ href: '/compare', locale });
  const content = getCompareIndexContent(locale);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: meta.home, item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: meta.compare, item: `${SITE_URL}${canonical}` },
    ],
  };

  // Mirrors the "more comparisons" links this page actually renders.
  const comparisonsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${meta.compare} - WhoUnfollowed`,
    itemListElement: COMPARISONS.map((c, i) => {
      const resolved = resolveComparison(c, locale);
      return {
        '@type': 'ListItem',
        position: i + 1,
        name: resolved.title,
        url: `${SITE_URL}${getPathname({ href: `/compare/${c.slug}`, locale })}`,
      };
    }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonsJsonLd) }} />
      <CompareIndexContent content={content} />
    </>
  );
}
