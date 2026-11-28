'use client';

import type { ReactNode } from 'react';
import { AtSign, Camera, Check, Music2 } from 'lucide-react';
import { snapshotPlatform } from '@ig-tracker/core';
import { Link, usePathname } from '@/i18n/navigation';
import { routing, type AppLocale } from '@/i18n/routing';
import { useSnapshotList } from '@/hooks/useSnapshots';
import { PLATFORM_NAME, type Platform } from '@/lib/platform';
import { useStudio } from '../StudioContext';
import { getYouContent } from './you.content';

// The client parts of You > Settings: things that read this browser (the
// exports), change the URL (language) or open Stripe (billing).

export function SetRow({ title, body, children }: { title: string; body?: ReactNode; children: ReactNode }) {
  return (
    <div className="s-set">
      <div><b>{title}</b>{body && <span className="s-sub-t">{body}</span>}</div>
      <div style={{ minWidth: 0 }}>{children}</div>
    </div>
  );
}

const ICON: Record<Platform, typeof Camera> = { instagram: Camera, threads: AtSign, tiktok: Music2 };

export function YouAccounts() {
  const { locale, userId } = useStudio();
  const t = getYouContent(locale);
  const list = useSnapshotList(userId);
  const fmt = (s: number) => new Date(s * 1000).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
  const shown: Platform[] = ['instagram', 'threads'];
  if (list.some((s) => snapshotPlatform(s.data) === 'tiktok')) shown.push('tiktok');
  return (
    <div className="s-col" style={{ gap: 8 }}>
      {shown.map((p) => {
        const mine = list.filter((s) => snapshotPlatform(s.data) === p);
        const last = mine[0];
        const Ic = ICON[p];
        return (
          <div key={p} className="s-acc">
            <Ic size={16} />
            <span className="s-grow"><b>{PLATFORM_NAME[p]}</b><span className="s-sub-t">{last ? `${t.lastExport(fmt(last.exportedAt))} · ${t.exports(mine.length)}` : t.noExport}</span></span>
            {last ? <span className="s-badge good"><Check size={12} />{t.added}</span> : <Link href={p === 'threads' ? '/threads' : '/'} className="s-btn sec xs">{t.add}</Link>}
          </div>
        );
      })}
    </div>
  );
}

const NAMES: Record<AppLocale, string> = { en: 'English', es: 'Español', pt: 'Português' };

export function YouLanguage() {
  const { locale } = useStudio();
  const path = usePathname();
  return (
    <div className="s-seg" role="group" aria-label={getYouContent(locale).language}>
      {routing.locales.map((l) => (
        <Link key={l} href={path} locale={l} className={l === locale ? 'on' : undefined} aria-current={l === locale ? 'true' : undefined}>{NAMES[l]}</Link>
      ))}
    </div>
  );
}
