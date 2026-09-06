'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { routing, type AppLocale } from '@/i18n/routing';
import { LOCALIZED_PATHS } from '@/i18n/localizedPaths';
import { T } from '@/components/landing/tokens';

const LOCALE_LABEL: Record<AppLocale, string> = { en: 'EN', es: 'ES', pt: 'PT' };

// Only rendered on pages that actually exist in all three locales (see
// LOCALIZED_PATHS) — showing it elsewhere would link to a 404, since most of
// the site is still English-only during the phased i18n rollout.
//
// Builds hrefs by hand with plain next/link rather than the i18n Link's
// `locale` override: that override always adds a prefix (even for English),
// which would send visitors to /en/pricing instead of the canonical,
// unprefixed /pricing that the sitemap and hreflang tags advertise.
export function LanguageSwitcher({ mobile = false }: { mobile?: boolean } = {}) {
  const pathname = usePathname();
  const activeLocale = useLocale();
  const t = useTranslations('nav');

  if (!LOCALIZED_PATHS.includes(pathname)) return null;

  return (
    <div
      role="group"
      aria-label={t('language')}
      style={{ display: 'inline-flex', alignItems: 'center', gap: mobile ? 12 : 4, fontSize: mobile ? 16 : 13 }}
    >
      {routing.locales.map((locale) => {
        const href = locale === routing.defaultLocale ? pathname : `/${locale}${pathname}`;
        return (
          <Link
            key={locale}
            href={href}
            hrefLang={locale}
            style={{
              color: locale === activeLocale ? T.ink : T.inkMute,
              fontWeight: locale === activeLocale ? 700 : 400,
              textDecoration: 'none',
            }}
          >
            {LOCALE_LABEL[locale]}
          </Link>
        );
      })}
    </div>
  );
}
