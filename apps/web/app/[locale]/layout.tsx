import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { chromeMessagesFor, STATIC_INTL_CONFIG } from '@/lib/i18n/chromeMessages';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Guards against app/[locale] matching an arbitrary first path segment (e.g.
// /xyz/pricing would otherwise render with locale="xyz"). Nested under the
// root layout, so no <html>/<body> here.
export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  if (locale === routing.defaultLocale) return children;
  // The root layout renders English chrome and <html lang="en"> so it never
  // has to read the request. Swap both here; the script runs during parsing,
  // before first paint. The locale is one of our fixed codes, never input.
  return (
    <NextIntlClientProvider locale={locale} messages={chromeMessagesFor(locale)} {...STATIC_INTL_CONFIG}>
      <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(locale)};` }} />
      {children}
    </NextIntlClientProvider>
  );
}
