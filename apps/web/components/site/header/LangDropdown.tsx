'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { routing, type AppLocale } from '@/i18n/routing';
import { Ic } from '@/components/home/icons';
import { useLangHref } from './useLangHref';

const NAME: Record<AppLocale, string> = { en: 'English', es: 'Español', pt: 'Português' };

// The compact language picker: globe, current code, a small glass menu.
export function LangDropdown({ label }: { label: string }) {
  const locale = useLocale() as AppLocale;
  const { href, remember } = useLangHref();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); } };
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('click', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);
  return (
    <div ref={box} className={`lang-dd${open ? ' open' : ''}`}>
      <button ref={btn} className="lang-b" type="button" aria-haspopup="true" aria-expanded={open} aria-label={label} onClick={() => setOpen((o) => !o)}>
        <Ic n="globe" s={15} /><span className="lang-cur">{locale.toUpperCase()}</span><Ic n="ch" s={12} className="chev" />
      </button>
      <div className="lang-m" role="menu">
        {routing.locales.map((l) => (
          <a key={l} className="lang-o" role="menuitemradio" aria-checked={l === locale} href={href(l)} hrefLang={l} onClick={() => remember(l)}>
            {NAME[l]}<span>{l.toUpperCase()}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

// The phone menu's three buttons.
export function LangButtons({ label }: { label: string }) {
  const locale = useLocale() as AppLocale;
  const { href, remember } = useLangHref();
  return (
    <div className="lang" role="group" aria-label={label}>
      {routing.locales.map((l) => (
        <a key={l} href={href(l)} hrefLang={l} aria-current={l === locale ? 'true' : undefined} data-on={l === locale} onClick={() => remember(l)}>{l.toUpperCase()}</a>
      ))}
    </div>
  );
}
