'use client';

import type { ReactNode } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';
import { getAuthShellContent } from './authShell.content';

// Re-exported so every account page keeps importing from one place.
export { AuthField, AuthError, AuthButton } from './AuthControls';

// Layout for every account page (login, signup, password reset, verify email,
// welcome, unsubscribe). Wide screens get a side panel with the privacy
// promise and the launch waitlist; phones get the form alone. `compact`
// drops the panel for pages where a pitch would be out of place.
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  compact = false,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  compact?: boolean;
}) {
  const locale = useLocale() as AppLocale;
  const c = getAuthShellContent(locale);

  return (
    <div className={`wu-auth${compact ? ' wu-auth--compact' : ''}`}>
      {!compact && (
        <aside className="wu-auth-aside" aria-label={c.eyebrow}>
          <div aria-hidden className="wu-auth-orbit">
            <span /><span /><span />
          </div>
          <Brand label={c.home} />
          <div className="wu-auth-aside-body">
            <p className="wu-auth-eyebrow"><span aria-hidden className="wu-auth-dot" />{c.eyebrow}</p>
            <p className="wu-auth-headline">{c.headline}</p>
            <ul className="wu-auth-points">
              {c.points.map((p) => (
                <li key={p}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="20 6 9 17 4 12" /></svg>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <Link href="/waitlist" className="wu-auth-teaser">
            <span className="wu-auth-teaser-badge">{c.teaserBadge}</span>
            <span className="wu-auth-teaser-text">{c.teaserText}</span>
            <span className="wu-auth-teaser-cta">{c.teaserCta} <span aria-hidden>→</span></span>
          </Link>
        </aside>
      )}

      <main className="wu-auth-main">
        <div className="wu-auth-column">
          <div className="wu-auth-mobile-brand"><Brand label={c.home} /></div>
          <div className="wu-auth-card">
            <h1 className="wu-auth-title">{title}</h1>
            {subtitle && <p className="wu-auth-subtitle">{subtitle}</p>}
            {children}
          </div>
          {footer && <div className="wu-auth-footer">{footer}</div>}
        </div>
      </main>
    </div>
  );
}

function Brand({ label }: { label: string }) {
  return (
    <Link href="/" aria-label={label} className="wu-auth-brand">
      {/* eslint-disable-next-line @next/next/no-img-element -- tiny static logo, same as the old shell */}
      <img src="/logo.png" alt="" width={30} height={30} />
      <span>WhoUnfollowed</span>
    </Link>
  );
}
