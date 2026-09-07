import { defineRouting } from 'next-intl/routing';

// English stays unprefixed at its existing indexed URLs (localePrefix
// 'as-needed'); es/pt get a URL prefix so each language has its own
// crawlable, canonical page.
export const routing = defineRouting({
  locales: ['en', 'es', 'pt'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  // Auto-redirect on Accept-Language for first-time visitors. Safe now that
  // the language switcher (components/LanguageSwitcher.tsx) is permanent on
  // every page, including unmigrated ones, so a wrong guess is always one
  // click from being undone. Only fires for requests that actually reach
  // intlMiddleware — i.e. the paths in middleware.ts's matcher, which is
  // the same set as i18n/localizedPaths.ts. Persisted via next-intl's
  // NEXT_LOCALE cookie after the first detection or an explicit switch, so
  // it doesn't re-negotiate every visit.
  localeDetection: true,
});

export type AppLocale = (typeof routing.locales)[number];
