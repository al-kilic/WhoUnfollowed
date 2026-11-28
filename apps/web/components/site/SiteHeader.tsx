'use client';

import '@/styles/home-base.css';
import '@/styles/home-header.css';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { useTheme } from 'next-themes';
import { Link } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';
import { HM_FONTS } from '@/components/home/fonts';
import { Ic } from '@/components/home/icons';
import { getHomeCopy } from '@/components/home/copy';
import { NavMenus, type MenuId } from './header/NavMenus';
import { LangDropdown } from './header/LangDropdown';
import { StudioButton } from './header/StudioButton';
import { HeaderAccount } from './header/HeaderAccount';
import { MobileNav } from './header/MobileNav';
import { GITHUB } from './header/links';

// The site header (Nov 2026, borderless liquid glass): the homepage, pricing
// and account pages. Brings its own scoped styles (.hm) and fonts, so it works
// inside or outside <StudioFrame>.
export function SiteHeader() {
  const locale = useLocale() as AppLocale;
  const c = getHomeCopy(locale).nav;
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menu, setMenu] = useState<MenuId>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 8);
    const onDoc = () => setMenu(null);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMenu(null); setMobile(false); } };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const dark = !mounted || resolvedTheme !== 'light';
  return (
    <div className={`hm hm-hdr ${HM_FONTS}`}>
      <header className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="wrap">
          <Link className="brand" href="/"><Image src="/logo.png" alt="" width={26} height={26} />WhoUnfollowed</Link>
          <NavMenus c={c} open={menu} setOpen={setMenu} />
          <div className="nav-r">
            <a className="icon-b gh-b" href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label={c.github}><Ic n="gh" s={17} /></a>
            <LangDropdown label={c.language} />
            <button className="icon-b" type="button" aria-label={c.theme} onClick={() => setTheme(dark ? 'light' : 'dark')}><Ic n={dark ? 'sun' : 'moon'} s={17} /></button>
            <HeaderAccount c={c} />
            <StudioButton label={c.openStudio} />
            <button className="icon-b burger" type="button" aria-label={c.menu} aria-expanded={mobile} aria-controls="mnav" onClick={() => setMobile((o) => !o)}><Ic n="menu" s={20} /></button>
          </div>
        </div>
      </header>
      <MobileNav c={c} open={mobile} close={() => setMobile(false)} />
    </div>
  );
}
