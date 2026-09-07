import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { redirect as nextRedirect, notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { eq } from 'drizzle-orm';
import { validateRequest } from '@/lib/auth/session';
import { db } from '@/lib/db/index';
import { profiles, syncSettings } from '@/lib/db/schema';
import { isPaidFeaturesEnabled, isProUser } from '@/lib/flags';
import { isUserVerified } from '@/lib/auth/verification';
import { UNLOCK_PRICE_USD, UNLOCK_DAYS_LABEL } from '@/lib/pricing';
import { SiteNav } from '@/components/landing/SiteNav';
import { LandingFooter } from '@/components/landing/FinalCTA';
import { T } from '@/components/landing/tokens';
import { Link, getPathname, redirect } from '@/i18n/navigation';
import { routing, type AppLocale } from '@/i18n/routing';
import { UpgradeLink } from '@/app/account/UpgradeLink';
import { ChangePassword } from './ChangePassword';
import { SyncSetup } from './SyncSetup';
import { DeleteAccountButton } from './DeleteAccountButton';
import { getAccountContent } from './content';

// Personalized, auth-gated content (session, subscription, billing). Never
// let this get swept into the [locale] layout's static generation.
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ locale: string }>;
}

// Auth surface: nothing here belongs in a search index.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const c = getAccountContent(locale);
  return { title: c.metaTitle, description: c.metaDescription, robots: { index: false, follow: false } };
}

function fmtDate(d: Date | null | undefined): string | null {
  if (!d) return null;
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '9px 0', borderTop: `1px solid ${T.border1}` }}>
      <span style={{ color: T.inkMute }}>{label}</span>
      <span style={{ color: T.ink, fontWeight: 500, textAlign: 'right', wordBreak: 'break-all' }}>{value}</span>
    </div>
  );
}

export default async function AccountPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const c = getAccountContent(locale);
  const pricingHref = getPathname({ href: '/pricing', locale: locale as AppLocale });

  const { user } = await validateRequest();
  if (!user) {
    redirect({ href: '/login', locale: locale as AppLocale });
    return;
  }
  // /verify-email isn't migrated under [locale] yet — plain redirect so it
  // isn't incorrectly locale-prefixed (which would 404 for es/pt).
  if (!(await isUserVerified(user.id))) nextRedirect('/verify-email');

  // hasProAccess = real Pro (active subscription: paid or grandfathered). Drives
  // the plan card, badge, and Pro-feature gating (cloud sync etc.).
  const [profile, syncRow, hasProAccess] = await Promise.all([
    db.query.profiles.findFirst({ where: eq(profiles.userId, user.id) }),
    db.query.syncSettings.findFirst({ where: eq(syncSettings.userId, user.id) }),
    isProUser(),
  ]);
  const isPro = hasProAccess;

  const paymentsEnabled = isPaidFeaturesEnabled();
  const status = profile?.subscriptionStatus ?? 'none';
  const memberSince = fmtDate(profile?.createdAt);
  const graceEnds = fmtDate(profile?.gracePeriodEndsAt);
  const hasSyncSetup = !!syncRow;

  // Every purchase is a one-time unlock, so "renewal" just means the expiry date.
  const renewal =
    paymentsEnabled && profile?.subscriptionExpiresAt
      ? { label: c.proUntil(fmtDate(profile.subscriptionExpiresAt) ?? ''), amount: '' }
      : null;

  const card: CSSProperties = {
    background: T.surface1,
    border: `1px solid ${T.border1}`,
    borderRadius: 16,
    padding: 24,
  };
  const sectionLabel: CSSProperties = {
    fontSize: 11,
    fontFamily: T.mono,
    letterSpacing: '0.12em',
    color: T.tealMid,
    marginBottom: 12,
    textTransform: 'uppercase',
  };

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <SiteNav userEmail={user.email} isPro={isPro} />

      <main style={{ maxWidth: 920, margin: '0 auto', padding: '48px 24px 80px' }}>
        <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 400, letterSpacing: '-0.02em', marginBottom: 8, lineHeight: 1.1 }}>
          {c.headline}
        </h1>
        <p style={{ fontSize: 14, color: T.inkDim, marginBottom: 36 }}>{c.subhead}</p>

        {status === 'grace' && graceEnds && (
          <div style={{ background: 'rgba(168,75,47,0.08)', border: '1px solid rgba(168,75,47,0.25)', borderRadius: 12, padding: '14px 16px', marginBottom: 24 }}>
            <span style={{ fontSize: 13, color: T.terra, lineHeight: 1.5 }}>
              {c.graceWarning(graceEnds)}{' '}
              <Link href="/pricing" style={{ color: T.terra, fontWeight: 600 }}>{c.resubscribe}</Link>
            </span>
          </div>
        )}

        {/* Plan & billing */}
        <section style={{ marginBottom: 28 }}>
          <div style={sectionLabel}>{c.planBilling}</div>
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                  <span style={{ fontFamily: T.serif, fontSize: 24, color: T.ink }}>{isPro ? c.pro : c.free}</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      padding: '4px 10px',
                      borderRadius: 100,
                      color: isPro ? T.cream : T.inkDim,
                      background: isPro ? T.teal : 'transparent',
                      border: isPro ? '1px solid rgba(2,136,143,0.5)' : `1px solid ${T.border3}`,
                    }}
                  >
                    {isPro ? c.proBadge : c.freeBadge}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.5 }}>
                  {renewal
                    ? `${renewal.label}${renewal.amount ? ` · ${renewal.amount}` : ''}`
                    : isPro
                      ? c.complimentaryAccess
                      : c.onFreePlan}
                </div>
              </div>
              {paymentsEnabled ? (
                <UpgradeLink source="account-plan" href={pricingHref} style={{ fontSize: 13, fontWeight: 600, fontFamily: T.sans, color: T.cream, textDecoration: 'none', padding: '9px 18px', borderRadius: 10, background: T.teal, whiteSpace: 'nowrap' }}>
                  {isPro ? c.extendPro : c.upgradeToPro}
                </UpgradeLink>
              ) : null}
            </div>

            {!paymentsEnabled && (
              <div style={{ background: T.tealGlow, border: `1px solid ${T.teal}`, borderRadius: 10, padding: '12px 14px', marginTop: 16, fontSize: 13, color: T.teal, lineHeight: 1.5 }}>
                {c.betaBanner}
              </div>
            )}

            <div style={{ marginTop: 18, fontSize: 13 }}>
              <Row label={c.emailLabel} value={user.email} />
              {memberSince && <Row label={c.memberSinceLabel} value={memberSince} />}
            </div>
          </div>
        </section>

        {/* What's included / Unlock with Pro */}
        <section style={{ marginBottom: 28 }}>
          <div style={sectionLabel}>{isPro ? c.whatsIncluded : c.unlockWithPro}</div>
          <div style={card}>
            {!isPro && (
              <p style={{ fontSize: 13.5, color: T.inkDim, lineHeight: 1.55, marginBottom: 18 }}>
                {c.freeSummary}
              </p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px 24px' }}>
              {c.proFeatures.map((f) => (
                <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.tealMid} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: T.ink, marginBottom: 2 }}>{f.title}</div>
                    <div style={{ fontSize: 12.5, color: T.inkMute, lineHeight: 1.45 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            {!isPro && paymentsEnabled && (
              <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', paddingTop: 18, borderTop: `1px solid ${T.border1}` }}>
                <span style={{ fontSize: 13, color: T.inkDim }}>
                  <strong style={{ color: T.ink }}>${UNLOCK_PRICE_USD.monthly}</strong>{' '}
                  {c.pricingLine(UNLOCK_DAYS_LABEL.monthly, String(UNLOCK_PRICE_USD.yearly))}
                </span>
                <UpgradeLink source="account-features" href={pricingHref} style={{ fontSize: 13, fontWeight: 600, fontFamily: T.sans, color: T.cream, textDecoration: 'none', padding: '10px 20px', borderRadius: 10, background: T.teal }}>
                  {c.upgradeToPro}
                </UpgradeLink>
              </div>
            )}
          </div>
        </section>

        {/* Cloud sync + Security side by side on wide screens */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 28, alignItems: 'start' }}>
          <section>
            <div style={sectionLabel}>{c.cloudSync}</div>
            <SyncSetup hasSyncSetup={hasSyncSetup} passphraseSetAt={syncRow?.passphraseSetAt ?? null} isPro={hasProAccess} c={c.syncSetup} />
          </section>

          <section>
            <div style={sectionLabel}>{c.security}</div>
            <div style={card}>
              <p style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.5, marginBottom: 16 }}>
                {c.securityDesc}
              </p>
              <ChangePassword c={c.changePassword} />
            </div>
          </section>
        </div>

        {/* Danger zone */}
        <section>
          <div style={{ ...sectionLabel, color: T.terra }}>{c.dangerZone}</div>
          <div style={{ ...card, border: '1px solid rgba(168,75,47,0.3)' }}>
            <p style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.5, marginBottom: 14 }}>
              {c.dangerDesc}
            </p>
            <DeleteAccountButton c={c.deleteAccount} />
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
