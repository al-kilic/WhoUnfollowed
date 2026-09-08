import { routing, type AppLocale } from './routing';

// A pure, server-safe equivalent of `getPathname` from i18n/navigation, for
// code that must NOT import that module: it's built on next-intl's
// createNavigation(), which bundles in client-side Link/router code that
// Vitest (running plain Node module resolution, not Next's bundler) cannot
// resolve — importing it from a route handler or a server-only lib file
// breaks that file's test suite even though it works fine under Next itself.
// Only correct for our routing config (localePrefix: 'as-needed'); if that
// config ever changes, this needs to change with it.
export function localizedPathname(href: string, locale: AppLocale): string {
  if (locale === routing.defaultLocale) return href;
  return href === '/' ? `/${locale}` : `/${locale}${href}`;
}
