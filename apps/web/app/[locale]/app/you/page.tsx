import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { validateRequest } from '@/lib/auth/session';
import { getAccountSummary } from '@/lib/account/accountSummary';
import { routing } from '@/i18n/routing';
import { YouSettings } from '@/components/studio/you/YouSettings';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const { user } = await validateRequest();
  const summary = user ? await getAccountSummary({ id: user.id, email: user.email }) : null;
  return <YouSettings locale={locale} a={summary} />;
}
