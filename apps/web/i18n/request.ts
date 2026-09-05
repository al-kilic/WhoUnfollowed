import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

// No message catalogs yet: every locale-aware page today (see
// app/[locale]/pricing) picks translated content directly from its own
// locale-keyed content file rather than useTranslations(). This config exists
// so getLocale() works everywhere, including the root layout's <html lang>,
// which sits above the [locale] segment and has no route param of its own.
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  return { locale, messages: {} };
});
