'use client';

import type { MouseEvent } from 'react';
import NextLink from 'next/link';
import { Link } from '@/i18n/navigation';
import { Ic } from '@/components/home/icons';
import type { HomeCopy } from '@/components/home/copy';
import { LEARN_PATHS, META_EXPORT } from './links';

type Nav = HomeCopy['nav'];
export type MenuId = 'how' | 'guides' | null;

// The two drop-down menus in the header. They open on hover and focus (CSS)
// and on click (state), and close on an outside click or Escape.
export function NavMenus({ c, open, setOpen }: {
  c: Nav; open: MenuId; setOpen: (m: MenuId) => void;
}) {
  const toggle = (m: Exclude<MenuId, null>) => (e: MouseEvent) => { e.stopPropagation(); setOpen(open === m ? null : m); };
  const close = () => setOpen(null);
  return (
    <nav className="nav-links" aria-label="Main">
      <div className={`ni${open === 'how' ? ' open' : ''}`}>
        <button className="nb" type="button" aria-haspopup="true" aria-expanded={open === 'how'} onClick={toggle('how')}><span>{c.howItWorks}</span><Ic n="ch" className="ch" /></button>
        <div className="menu slim" role="menu">
          <a className="ml" role="menuitem" href={META_EXPORT} target="_blank" rel="noopener noreferrer" onClick={close}>{c.exportTitle} <span className="ext">↗</span></a>
          <Link className="ml" role="menuitem" href="/how-to-export" onClick={close}>{c.guideTitle}</Link>
          <Link className="ml" role="menuitem" href="/privacy" onClick={close}>{c.privTitle}</Link>
        </div>
      </div>
      <Link className="nb" href="/#coach"><span>{c.coach}</span><span className="chip">{c.proAi}</span></Link>
      <Link className="nb" href="/pricing">{c.pricing}</Link>
      <div className={`ni${open === 'guides' ? ' open' : ''}`}>
        <button className="nb" type="button" aria-haspopup="true" aria-expanded={open === 'guides'} onClick={toggle('guides')}><span>{c.guides}</span><Ic n="ch" className="ch" /></button>
        <div className="menu slim" role="menu">
          {LEARN_PATHS.map((p, i) => <Link key={p} className="ml" href={p} onClick={close}>{c.learnItems[i]}</Link>)}
          <NextLink className="ml all" href="/blog" onClick={close}>{c.allGuides}</NextLink>
        </div>
      </div>
    </nav>
  );
}
