import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getComparison, COMPARISONS } from '../comparisons';
import { CompareDetailContent } from './CompareDetailContent';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

export function generateStaticParams() {
  return COMPARISONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) return { title: 'Comparison not found' };

  const url = `${SITE_URL}/compare/${c.slug}`;
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: c.metaTitle,
      description: c.metaDescription,
      url,
      siteName: 'WhoUnfollowed',
    },
    twitter: {
      card: 'summary_large_image',
      title: c.metaTitle,
      description: c.metaDescription,
    },
  };
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) notFound();

  const url = `${SITE_URL}/compare/${c.slug}`;
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Compare', item: `${SITE_URL}/compare` },
      { '@type': 'ListItem', position: 3, name: c.title, item: url },
    ],
  };

  // Mirrors the visible feature-comparison table exactly, row for row, so the
  // structured data can never claim something the page itself doesn't show.
  const comparisonJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: c.title,
    description: c.verdict,
    itemListElement: c.rows.map((row, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: row.feature,
      description: `WhoUnfollowed: ${row.us ? 'Yes' : 'No'}. ${c.competitorName}: ${row.them ? 'Yes' : 'No'}.`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonJsonLd) }} />
      <CompareDetailContent c={c} />
    </>
  );
}
