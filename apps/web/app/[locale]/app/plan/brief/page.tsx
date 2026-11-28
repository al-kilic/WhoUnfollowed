import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getAuthState } from '@/lib/auth/getAuthState';
import { getBrief, listBriefDates } from '@/lib/briefs';
import { BriefView } from '@/components/studio/coach/BriefView';

// Studio > Today > Weekly brief: the latest brief, or ?d=YYYY-MM-DD.
export default async function BriefPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ d?: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [{ d }, auth, dates] = await Promise.all([searchParams, getAuthState(), listBriefDates()]);
  const date = d && dates.includes(d) ? d : dates[0];
  const brief = date ? await getBrief(date, locale, auth.hasProAi) : null;
  return <BriefView brief={brief} dates={dates} />;
}
