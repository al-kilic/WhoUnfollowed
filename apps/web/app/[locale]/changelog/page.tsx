import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { T } from '@/components/landing/tokens';
import { SiteNav } from '@/components/landing/SiteNav';
import { LandingFooter } from '@/components/landing/FinalCTA';
import { validateRequest } from '@/lib/auth/session';
import { isProUser } from '@/lib/flags';
import { routing, type AppLocale } from '@/i18n/routing';
import { getPathname } from '@/i18n/navigation';
import { OG_LOCALE, ogAlternateLocales } from '@/i18n/ogLocale';
import { getChangelogContent } from './content';
import { CHANGELOG_ENTRIES } from './entries';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

const SEO_META: Record<AppLocale, { title: string; description: string }> = {
  en: { title: 'Changelog', description: 'What\'s new in WhoUnfollowed. Updates, fixes, and improvements.' },
  es: { title: 'Registro de cambios', description: 'Novedades de WhoUnfollowed. Actualizaciones, correcciones y mejoras.' },
  pt: { title: 'Changelog', description: 'Novidades do WhoUnfollowed. Atualizações, correções e melhorias.' },
};

const tagStyles: Record<string, { color: string; bg: string }> = {
  launch:      { color: T.tealLight,  bg: 'rgba(2,136,143,0.12)' },
  feature:     { color: '#a8d4b0',    bg: 'rgba(168,212,176,0.1)' },
  improvement: { color: T.inkDim,     bg: 'var(--t-border1)' },
  fix:         { color: '#e0a070',    bg: 'rgba(168,75,47,0.1)' },
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const meta = SEO_META[locale];
  const canonical = getPathname({ href: '/changelog', locale });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, getPathname({ href: '/changelog', locale: l })]),
  );

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical, languages: { ...languages, 'x-default': languages.en } },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}${canonical}`,
      locale: OG_LOCALE[locale],
      alternateLocale: ogAlternateLocales(locale),
    },
  };
}

export default async function ChangelogPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const c = getChangelogContent(locale);
  const { user } = await validateRequest();
  const isPro = await isProUser();

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <SiteNav userEmail={user?.email ?? null} isPro={isPro} />

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '56px 32px 80px' }}>
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', marginBottom: 14 }}>{c.eyebrow}</div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink, marginBottom: 12 }}>
            {c.headline}
          </h1>
          <p style={{ fontSize: 15, color: T.inkDim, lineHeight: 1.6 }}>
            {c.subhead}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {CHANGELOG_ENTRIES.map((entry, i) => {
            const style = tagStyles[entry.tag]!;
            const label = c.tagLabels[entry.tag];
            return (
              <div key={entry.version} style={{ display: 'flex', gap: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: T.tealMid, flexShrink: 0, marginTop: 6 }} />
                  {i < CHANGELOG_ENTRIES.length - 1 && (
                    <div style={{ flex: 1, width: 1, background: 'var(--t-border2)', minHeight: 32, marginTop: 6 }} />
                  )}
                </div>

                <div style={{ flex: 1, paddingBottom: 48 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: T.serif, fontSize: 22, color: T.ink, letterSpacing: '-0.01em' }}>
                      v{entry.version}
                    </span>
                    <span style={{ fontSize: 10, fontFamily: T.mono, padding: '3px 9px', borderRadius: 20, color: style.color, background: style.bg, letterSpacing: '0.06em' }}>
                      {label.toUpperCase()}
                    </span>
                    <span style={{ fontSize: 12, color: T.inkMute, fontFamily: T.mono, marginLeft: 'auto' }}>
                      {entry.date}
                    </span>
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {entry.items.map((item) => (
                      <li key={item} style={{ display: 'flex', gap: 10, fontSize: 14, color: T.inkDim, lineHeight: 1.6 }}>
                        <span style={{ color: T.tealMid, flexShrink: 0, marginTop: 2 }}>–</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 8, paddingTop: 32, borderTop: '1px solid var(--t-border1)' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.inkDim, textDecoration: 'none' }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11 7 H3 M3 7 L6 4 M3 7 L6 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {c.backToHome}
          </Link>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
