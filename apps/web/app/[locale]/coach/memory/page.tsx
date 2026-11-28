import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { redirect } from '@/i18n/navigation';
import { validateRequest } from '@/lib/auth/session';
import { getProAiAccess } from '@/lib/ai/access';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { T } from '@/components/landing/tokens';
import { getCoachContent } from '../content';
import { MemoryEditor } from './MemoryEditor';

export const dynamic = 'force-dynamic';

interface PageProps { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return { title: getCoachContent(locale).memory.title, robots: { index: false, follow: false } };
}

// Pro AI home. Signed-out visitors go to login (middleware), signed-in people
// without Pro AI go to pricing.
export default async function CoachMemoryPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const { user } = await validateRequest();
  if (!user) redirect({ href: '/login', locale });
  if (!(await getProAiAccess(user!.id))) redirect({ href: '/pricing', locale });

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <SiteHeader />
      <main className="px-4 sm:px-8 py-8 sm:py-10" style={{ maxWidth: 820, margin: '0 auto' }}>
        <MemoryEditor locale={locale} />
      </main>
      <SiteFooter />
    </div>
  );
}
