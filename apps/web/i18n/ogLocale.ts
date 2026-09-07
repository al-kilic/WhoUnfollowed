import type { AppLocale } from './routing';
import { routing } from './routing';

// Open Graph's og:locale wants IETF-ish language_TERRITORY codes (Facebook's
// crawler validates against a fixed list), not the bare 'en'/'es'/'pt' our
// own routing uses. es_LA (Latin America) and pt_BR (Brazil) match the
// dialect the translated copy is actually written in, not es_ES/pt_PT.
export const OG_LOCALE: Record<AppLocale, string> = {
  en: 'en_US',
  es: 'es_LA',
  pt: 'pt_BR',
};

// og:locale:alternate for every other locale a page has a translation in —
// the Open Graph analog of hreflang, so link-preview crawlers and AI
// scrapers that read OG tags (not <link rel="alternate">) still see the
// other language versions.
export function ogAlternateLocales(current: AppLocale): string[] {
  return routing.locales.filter((l) => l !== current).map((l) => OG_LOCALE[l]);
}
