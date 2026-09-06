import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

// Two i18n patterns coexist on purpose: shared sitewide chrome (nav, footer,
// the FinalCTA block) uses these message catalogs via useTranslations(),
// since it's short, repeated UI text. Page-level prose (pricing, and future
// pages) uses its own locale-keyed content file instead, like
// app/[locale]/pricing/content.ts, so long-form copy lives next to the
// other content modules in this codebase rather than as deeply-nested JSON.
//
// This config also makes getLocale() work everywhere, including the root
// layout's <html lang>, which sits above the [locale] segment and has no
// route param of its own; pages outside the migrated set (see
// i18n/localizedPaths.ts) fall back to the default locale, matching their
// current English-only behavior.
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const messages = (await import(`../messages/${locale}.json`)).default;
  return { locale, messages };
});
