import { defineRouting } from 'next-intl/routing';

// Phase 1 of i18n: only /pricing lives under [locale] so far (see
// app/[locale]/pricing). English stays unprefixed at its existing indexed
// URLs (localePrefix 'as-needed'); es/pt get a URL prefix so each language
// has its own crawlable, canonical page.
export const routing = defineRouting({
  locales: ['en', 'es', 'pt'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  // No auto-redirect on Accept-Language: there's no language switcher on most
  // of the site yet (only the small, growing set of pages in
  // LOCALIZED_PATHS), so guessing wrong would trap a visitor with no way
  // back to their preferred language. Revisit once the switcher covers
  // enough of the site to make redirecting safe.
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
