'use client';

import NextLink from 'next/link';
import { Link } from '@/i18n/navigation';
import type { HomeCopy } from '@/components/home/copy';
import { LangButtons } from './LangDropdown';
import { MobileAccount } from './HeaderAccount';
import { GITHUB, LEARN_PATHS, META_EXPORT } from './links';

// The phone menu under the header bar.
export function MobileNav({ c, open, close }: { c: HomeCopy['nav']; open: boolean; close: () => void }) {
  return (
    <div className={`mnav${open ? ' open' : ''}`} id="mnav">
      <span className="lab">{c.howItWorks}</span>
      <a href={META_EXPORT} target="_blank" rel="noopener noreferrer" onClick={close}>{c.mExport}</a>
      <Link href="/how-to-export" onClick={close}>{c.guideTitle}</Link>
      <Link href="/privacy" onClick={close}>{c.privTitle}</Link>
      <span className="lab">{c.guides}</span>
      {LEARN_PATHS.map((p, i) => <Link key={p} href={p} onClick={close}>{c.learnItems[i]}</Link>)}
      <NextLink href="/blog" onClick={close}>{c.allGuides}</NextLink>
      <span className="lab">WhoUnfollowed</span>
      <Link href="/#coach" onClick={close}>{c.mCoach}</Link>
      <Link href="/pricing" onClick={close}>{c.pricing}</Link>
      <Link href="/app" onClick={close}>{c.openStudio}</Link>
      <a href={GITHUB} target="_blank" rel="noopener noreferrer" onClick={close}>{c.mGithub}</a>
      <MobileAccount c={c} close={close} />
      <LangButtons label={c.language} />
    </div>
  );
}
