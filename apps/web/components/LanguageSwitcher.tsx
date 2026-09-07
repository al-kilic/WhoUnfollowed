'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { routing, type AppLocale } from '@/i18n/routing';
import { LOCALIZED_PATHS } from '@/i18n/localizedPaths';
import { Check, ChevronDown } from 'lucide-react';
import { T } from '@/components/landing/tokens';

const LOCALE_FLAG: Record<AppLocale, string> = { en: '🇺🇸', es: '🇪🇸', pt: '🇧🇷' };

// Always visible, on every page (including ones with no translation yet —
// most of the site). Flags only, no text labels, per design. When the
// current page isn't in LOCALIZED_PATHS (not translated), switching locale
// falls back to that locale's homepage instead of linking to a 404.
export function LanguageSwitcher({ mobile = false }: { mobile?: boolean } = {}) {
  const pathname = usePathname();
  const activeLocale = useLocale() as AppLocale;
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const targetPath = LOCALIZED_PATHS.includes(pathname) ? pathname : '/';

  function hrefFor(locale: AppLocale): string {
    if (locale === routing.defaultLocale) return targetPath;
    return targetPath === '/' ? `/${locale}` : `/${locale}${targetPath}`;
  }

  const size = mobile ? 16 : 13;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t('language')}
        aria-expanded={open}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: mobile ? '6px 10px' : '6px 9px',
          borderRadius: 9, border: `1px solid ${T.border3}`,
          background: 'transparent', color: T.ink, cursor: 'pointer',
          fontSize: size, lineHeight: 1,
        }}
      >
        <span style={{ fontSize: size + 2 }}>{LOCALE_FLAG[activeLocale]}</span>
        <ChevronDown size={12} style={{ opacity: 0.6, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute', top: '100%', marginTop: 6, zIndex: 200,
            right: mobile ? undefined : 0, left: mobile ? 0 : undefined,
            display: 'flex', flexDirection: 'column', gap: 2,
            padding: 6, borderRadius: 12, minWidth: 52,
            background: T.overlay, border: `1px solid ${T.overlayBorder}`,
            boxShadow: '0 16px 48px rgba(0,0,0,0.22)',
            animation: 'fade-in 0.15s ease both',
          }}
        >
          {routing.locales.map((locale) => {
            const active = locale === activeLocale;
            return (
              <a
                key={locale}
                href={hrefFor(locale)}
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                  padding: '7px 9px', borderRadius: 8, textDecoration: 'none',
                  background: active ? 'rgba(2,136,143,0.1)' : 'transparent',
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = T.surface2; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ fontSize: size + 2 }}>{LOCALE_FLAG[locale]}</span>
                {active && <Check size={12} color={T.tealMid} />}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
