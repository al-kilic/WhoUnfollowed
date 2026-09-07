import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getComparison, COMPARISONS, resolveComparison } from '@/app/compare/comparisons';
import { routing, type AppLocale } from '@/i18n/routing';
import { getPathname } from '@/i18n/navigation';
import { CompareDetailContent } from './CompareDetailContent';
import { getCompareDetailUiContent } from './detailContent';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

const HOME_LABEL: Record<AppLocale, string> = { en: 'Home', es: 'Inicio', pt: 'Início' };
const COMPARE_LABEL: Record<AppLocale, string> = { en: 'Compare', es: 'Comparar', pt: 'Comparar' };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => COMPARISONS.map((c) => ({ locale, slug: c.slug })));
}

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const c = getComparison(slug);
  if (!c) return { title: 'Comparison not found' };
  const resolved = resolveComparison(c, locale);

  const canonical = getPathname({ href: `/compare/${slug}`, locale });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, getPathname({ href: `/compare/${slug}`, locale: l })]),
  );

  return {
    title: resolved.metaTitle,
    description: resolved.metaDescription,
    alternates: { canonical, languages: { ...languages, 'x-default': languages.en } },
    openGraph: {
      type: 'article',
      title: resolved.metaTitle,
      description: resolved.metaDescription,
      url: `${SITE_URL}${canonical}`,
      siteName: 'WhoUnfollowed',
    },
    twitter: {
      card: 'summary_large_image',
      title: resolved.metaTitle,
      description: resolved.metaDescription,
    },
  };
}

export default async function ComparePage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const c = getComparison(slug);
  if (!c) notFound();

  const resolved = resolveComparison(c, locale);
  const others = COMPARISONS.filter((x) => x.slug !== c.slug).map((x) => resolveComparison(x, locale));
  const ui = getCompareDetailUiContent(locale);

  const canonical = getPathname({ href: `/compare/${slug}`, locale });
  const compareIndexPath = getPathname({ href: '/compare', locale });
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: HOME_LABEL[locale], item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: COMPARE_LABEL[locale], item: `${SITE_URL}${compareIndexPath}` },
      { '@type': 'ListItem', position: 3, name: resolved.title, item: `${SITE_URL}${canonical}` },
    ],
  };

  // Mirrors the visible feature-comparison table exactly, row for row, so the
  // structured data can never claim something the page itself doesn't show.
  const comparisonJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: resolved.title,
    description: resolved.verdict,
    itemListElement: resolved.rows.map((row, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: row.feature,
      description: `WhoUnfollowed: ${row.us ? 'Yes' : 'No'}. ${resolved.competitorName}: ${row.them ? 'Yes' : 'No'}.`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonJsonLd) }} />
      <CompareDetailContent c={resolved} others={others} ui={ui} />
    </>
  );
}
