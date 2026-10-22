import type { AbstractIntlMessages } from 'next-intl';
import type { AppLocale } from '@/i18n/routing';
import en from '@/messages/en.json';
import es from '@/messages/es.json';
import pt from '@/messages/pt.json';

// Sitewide chrome (SiteNav, LandingFooter, FinalCTA) needs useTranslations()
// on every page, including ones outside app/[locale]. Only these namespaces
// are sent to the client; per-page prose (much larger) stays server-side in
// content files like app/[locale]/pricing/content.ts and is never part of
// this catalog.
//
// Loaded by static import rather than next-intl's getMessages(): in the root
// layout that call reads request headers, which makes every page dynamic.
const CHROME_NAMESPACES = ['nav', 'footer', 'cta'] as const;
const CATALOGS: Record<AppLocale, AbstractIntlMessages> = { en, es, pt };

export function chromeMessagesFor(locale: AppLocale): AbstractIntlMessages {
  const messages = CATALOGS[locale];
  return Object.fromEntries(
    CHROME_NAMESPACES.filter((ns) => ns in messages).map((ns) => [ns, messages[ns]!]),
  );
}

// Passed to every NextIntlClientProvider explicitly. Left out, the provider
// reads them from the request config, which reads request headers and makes
// the page dynamic. Nothing in the app formats dates through next-intl, so
// fixed values change no output.
export const STATIC_INTL_CONFIG = { formats: {}, timeZone: 'UTC', now: new Date(0) } as const;
