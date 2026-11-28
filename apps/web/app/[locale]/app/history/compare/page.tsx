import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { DiffContent } from '@/app/[locale]/diff/DiffContent';

// Studio > History > Compare: two exports side by side. Free users get the
// reveal (real counts, most names hidden), same as /diff.
export default async function StudioComparePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return <DiffContent locale={locale} inStudio />;
}
