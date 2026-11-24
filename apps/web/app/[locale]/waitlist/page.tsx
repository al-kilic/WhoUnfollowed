import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { validateRequest } from '@/lib/auth/session';
import { isOnCreatorWaitlist } from '@/lib/reminders/store';
import { SiteNav } from '@/components/landing/SiteNav';
import { T } from '@/components/landing/tokens';
import { getWaitlistContent } from './content';
import { WaitlistForm } from './WaitlistForm';

// Per visitor: the form differs for signed-in accounts and for people
// already on the list, so this must never be served from a static prerender.
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ locale: string }>;
}

// A short-lived launch page: kept out of the index so it never competes with
// the guides for "who unfollowed me" searches.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const c = getWaitlistContent(locale);
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    robots: { index: false, follow: true },
    openGraph: { title: c.metaTitle, description: c.metaDescription },
  };
}

const ICONS = [
  // chat bubble, sparkle grid, radar, rising line
  <path key="a" d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />,
  <path key="b" d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M6.3 17.7l2.8-2.8M14.9 9.1l2.8-2.8" />,
  <><circle key="c1" cx="12" cy="12" r="9" /><circle key="c2" cx="12" cy="12" r="4.5" /><path key="c3" d="M12 12 18.5 5.5" /></>,
  <path key="d" d="M3 17l6-6 4 4 8-8M15 7h6v6" />,
];

export default async function WaitlistPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const c = getWaitlistContent(locale);

  const { user } = await validateRequest();
  const alreadyJoined = user ? await isOnCreatorWaitlist(user.email).catch(() => false) : false;

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans, position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden style={{ position: 'absolute', top: -240, right: -200, width: 720, height: 720, borderRadius: '50%', background: `radial-gradient(circle, ${T.tealGlow} 0%, transparent 65%)`, pointerEvents: 'none' }} />
      <SiteNav />
      <main className="mx-auto grid max-w-[1120px] gap-12 px-4 pb-24 pt-12 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pt-20" style={{ position: 'relative' }}>
        <section style={{ display: 'grid', gap: 28, alignContent: 'start' }}>
          <div style={{ display: 'grid', gap: 16 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: T.mono, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.terraText, fontWeight: 500 }}>
              <span aria-hidden style={{ width: 7, height: 7, borderRadius: '50%', background: T.terra }} />
              {c.eyebrow}
            </span>
            <h1 style={{ margin: 0, fontFamily: T.serif, fontWeight: 400, fontSize: 'clamp(40px, 6vw, 64px)', lineHeight: 1.02, letterSpacing: '-0.025em' }}>{c.title}</h1>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: T.inkDim, maxWidth: 560 }}>{c.lead}</p>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {c.features.map((f, i) => (
              <li key={f.title} style={{ display: 'grid', gap: 8, padding: '18px 18px 16px', borderRadius: 16, background: T.surface1, border: `1px solid ${T.border1}` }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.tealMid} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  {ICONS[i % ICONS.length]}
                </svg>
                <strong style={{ fontSize: 15, fontWeight: 600, color: T.ink }}>{f.title}</strong>
                <span style={{ fontSize: 13.5, lineHeight: 1.5, color: T.inkDim }}>{f.body}</span>
              </li>
            ))}
          </ul>

          <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px', listStyle: 'none', margin: 0, padding: 0 }}>
            {c.trust.map((t) => (
              <li key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, color: T.inkDim }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.tealMid} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="20 6 9 17 4 12" /></svg>
                {t}
              </li>
            ))}
          </ul>
        </section>

        <section aria-label={c.formTitle} className="lg:sticky lg:top-28" style={{ alignSelf: 'start', padding: '28px 24px 24px', borderRadius: 20, background: T.bgPanel, border: `1px solid ${T.border2}`, boxShadow: '0 24px 60px -32px rgba(11,36,38,0.35)' }}>
          <WaitlistForm locale={locale} signedInEmail={user?.email ?? null} alreadyJoined={alreadyJoined} />
        </section>
      </main>
    </div>
  );
}
