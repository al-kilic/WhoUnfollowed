'use client';

import { usePathname } from '@/i18n/navigation';
import { routing, type AppLocale } from '@/i18n/routing';
import { LOCALIZED_PATHS } from '@/i18n/localizedPaths';

// Same rules as the site's LanguageSwitcher: pages without a translation send
// you to that language's homepage, and the choice is saved in NEXT_LOCALE so
// the middleware doesn't redirect back.
export function useLangHref() {
  const pathname = usePathname();
  const target = LOCALIZED_PATHS.includes(pathname) ? pathname : '/';
  const href = (l: AppLocale) => (l === routing.defaultLocale ? target : target === '/' ? `/${l}` : `/${l}${target}`);
  const remember = (l: AppLocale) => { document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000; SameSite=Lax`; };
  return { href, remember };
}
