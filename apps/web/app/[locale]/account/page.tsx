import { permanentRedirect, notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

// The old account page. Everything it had lives in Studio > You now, so old
// links, bookmarks and emails land on the plan section there.
export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  permanentRedirect(`${getPathname({ href: '/app/you', locale })}#billing`);
}
