import { defineRouting } from 'next-intl/routing';

// Phase 1 of i18n: only /pricing lives under [locale] so far (see
// app/[locale]/pricing). English stays unprefixed at its existing indexed
// URLs (localePrefix 'as-needed'); es/pt get a URL prefix so each language
// has its own crawlable, canonical page.
export const routing = defineRouting({
  locales: ['en', 'es', 'pt'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});

export type AppLocale = (typeof routing.locales)[number];
