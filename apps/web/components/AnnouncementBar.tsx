'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { track, Events } from '@/lib/analytics';
import { ANNOUNCE_STORAGE_KEY, announcementTarget, getAnnouncementBarContent } from './announcementBar.content';

// Sitewide "something big is coming" strip, rendered by the root layout above
// every page. Closing it is remembered in localStorage; an inline script in
// the root layout reads that before first paint (html[data-announce="off"]),
// so a closed strip never flashes back in on the next page load.
export function AnnouncementBar() {
  const target = announcementTarget(usePathname() ?? '/');
  if (!target) return null;
  const { locale, href } = target;
  const c = getAnnouncementBarContent(locale);

  function dismiss() {
    try { localStorage.setItem(ANNOUNCE_STORAGE_KEY, 'off'); } catch { /* storage blocked: hide for this view only */ }
    document.documentElement.setAttribute('data-announce', 'off');
  }

  return (
    <div className="wu-announce" role="region" aria-label={c.badge}>
      <NextLink
        href={href}
        className="wu-announce__link"
        onClick={() => track(Events.announceClick, { locale })}
      >
        <span className="wu-announce__badge">
          <span className="wu-announce__dot" aria-hidden />
          {c.badge}
        </span>
        <span className="wu-announce__text wu-announce__text--long">{c.text}</span>
        <span className="wu-announce__text wu-announce__text--short">{c.textShort}</span>
        <span className="wu-announce__cta">
          {c.cta}
          <span aria-hidden> →</span>
        </span>
      </NextLink>
      <button type="button" className="wu-announce__close" aria-label={c.dismiss} onClick={dismiss}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
