import type { CSSProperties } from 'react';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { eq } from 'drizzle-orm';
import { validateRequest } from '@/lib/auth/session';
import { db } from '@/lib/db/index';
import { profiles, syncSettings } from '@/lib/db/schema';
import { isPaidFeaturesEnabled, isProUser } from '@/lib/flags';
import { isUserVerified } from '@/lib/auth/verification';
import { isDevProPreview, devPreviewProfile } from '@/lib/auth/devProPreview';
import { proAiPricesAt } from '@/lib/pricing';
import { SiteHeader } from '@/components/site/SiteHeader';
import { StudioFrame } from '@/components/studio/StudioFrame';
import { SiteFooter } from '@/components/site/SiteFooter';
import { T } from '@/components/landing/tokens';
import { Link, getPathname, redirect } from '@/i18n/navigation';
import { routing, type AppLocale } from '@/i18n/routing';
import { UpgradeLink } from '@/app/account/UpgradeLink';
import { ChangePassword } from './ChangePassword';
import { SyncSetup } from './SyncSetup';
import { DeleteAccountButton } from './DeleteAccountButton';
import { MarketingConsent } from './MarketingConsent';
import { ReminderToggle } from './ReminderToggle';
import { getReminderStateForUser } from '@/lib/reminders/store';
import { getAccountContent } from './content';
import { AccountProAi } from './AccountProAi';
import { getProAiAccess } from '@/lib/ai/access';

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

function fmtDate(d: Date | null | undefined, locale: string): string | null {
  if (!d) return null;
  return new Date(d).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
}

function isInsiderProfile(profile: { subscriptionStatus: string; lifetimePurchasedAt: Date | null } | undefined): boolean {
  return profile?.subscriptionStatus === 'active' && !!profile.lifetimePurchasedAt;
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
  // Lets locale-aware Links read the locale without request headers (static rendering).
  setRequestLocale(locale);
  const c = getAccountContent(locale);
  const pricingHref = getPathname({ href: '/pricing', locale: locale as AppLocale });

  const { user } = await validateRequest();
  if (!user) {
    redirect({ href: '/login', locale: locale as AppLocale });
    return;
  }
  if (!isDevProPreview() && !(await isUserVerified(user.id))) redirect({ href: '/verify-email', locale: locale as AppLocale });

  // hasProAccess = real Pro (active subscription: paid or grandfathered). Drives
  // the plan card, badge, and Pro-feature gating (cloud sync etc.).
  const preview = isDevProPreview();
  const [profile, syncRow, hasProAccess] = await Promise.all([
    preview ? Promise.resolve(devPreviewProfile()) : db.query.profiles.findFirst({ where: eq(profiles.userId, user.id) }),
    preview ? Promise.resolve(undefined) : db.query.syncSettings.findFirst({ where: eq(syncSettings.userId, user.id) }),
    isProUser(),
  ]);
  const reminderRow = preview ? undefined : await getReminderStateForUser(user.id, user.email).catch(() => undefined);
  const reminderNextAt = reminderRow?.reminderNextAt && !reminderRow.reminderOptedOutAt ? reminderRow.reminderNextAt.toISOString() : null;
  const isPro = hasProAccess;
  // Lifetime purchase (lifetimePurchasedAt) is the only Insider signal.
  const isInsider = isInsiderProfile(profile);
  // Pro AI (subscription, Lifetime or a running legacy unlock).
  const proAi = preview ? { plan: 'yearly' as const, periodEnd: null } : await getProAiAccess(user.id).catch(() => null);
  const isSubscriber = !!profile?.stripeSubscriptionId && (proAi?.plan === 'monthly' || proAi?.plan === 'yearly');

  const paymentsEnabled = isPaidFeaturesEnabled();
  const status = profile?.subscriptionStatus ?? 'none';
  const memberSince = fmtDate(profile?.createdAt, locale);
  const graceEnds = fmtDate(profile?.gracePeriodEndsAt, locale);
  const hasSyncSetup = !!syncRow;
  // Functions cannot be passed to the SyncSetup client component, so resolve the
  // "Enabled {date}." text here and strip the function from its content.
  const { enabledOn, ...syncSetupContent } = c.syncSetup;
  const syncEnabledText = syncRow ? enabledOn(fmtDate(syncRow.passphraseSetAt, locale) ?? '') : '';

  // Every purchase is a one-time unlock, so "renewal" just means the expiry date.
  const renewal =
    paymentsEnabled && profile?.subscriptionExpiresAt
      ? { label: c.proUntil(fmtDate(profile.subscriptionExpiresAt, locale) ?? ''), amount: '' }
      : null;

  // The clean Studio look (styles/studio.css), like Studio and /pricing.
  const card: CSSProperties = { background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, padding: 20 };
  const sectionLabel: CSSProperties = { fontSize: 15, fontWeight: 600, color: 'var(--ink)', marginBottom: 10, letterSpacing: '-.01em' };
  const proAiPrices = proAiPricesAt();
  const planName = proAi ? 'Pro AI' : isPro ? c.pro : c.free;

  return (
    <StudioFrame>
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <SiteHeader />

      <main style={{ maxWidth: 920, margin: '0 auto', padding: '48px 24px 80px' }}>
        <h1 style={{ fontSize: 'clamp(26px, 4vw, 34px)', fontWeight: 600, letterSpacing: '-0.03em', marginBottom: 8, lineHeight: 1.1 }}>
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
                  <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: T.ink }}>{planName}</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      padding: '4px 10px',
                      borderRadius: 100,
                      color: isPro ? T.onTeal : T.inkDim,
                      background: isInsider ? T.terra : isPro ? T.teal : 'transparent',
                      border: isInsider ? `1px solid ${T.terra}` : isPro ? '1px solid rgba(2,136,143,0.5)' : `1px solid ${T.border3}`,
                    }}
                  >
                    {isInsider ? c.insiderBadge : isSubscriber ? c.proAiBadge : isPro ? c.proBadge : c.freeBadge}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.5 }}>
                  {isInsider
                    ? c.insiderSince(fmtDate(profile?.lifetimePurchasedAt, locale) ?? '')
                    : isSubscriber
                    ? c.subscriberLine(proAi?.plan === 'yearly')
                    : renewal
                    ? `${renewal.label}${renewal.amount ? ` · ${renewal.amount}` : ''}`
                    : isPro
                      ? c.complimentaryAccess
                      : c.onFreePlan}
                </div>
              </div>
              {/* Everyone without Pro AI (Free, old Pro, comped, early Lifetime) gets the way to it. */}
              {paymentsEnabled && !proAi ? (
                <UpgradeLink source="account-plan" href={pricingHref} style={{ fontSize: 13, fontWeight: 600, fontFamily: T.sans, color: T.onTeal, textDecoration: 'none', padding: '9px 18px', borderRadius: 10, background: T.teal, whiteSpace: 'nowrap' }}>
                  {c.upgradeToPro}
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

        {proAi && (
          <AccountProAi locale={locale as AppLocale} isSubscriber={isSubscriber} periodEnd={isSubscriber ? (profile?.currentPeriodEnd?.toISOString() ?? null) : null} cancelAt={isSubscriber ? (profile?.cancelAt?.toISOString() ?? null) : null} />
        )}

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
                  <strong style={{ color: T.ink }}>${proAiPrices.monthly}</strong>{' '}
                  {c.pricingLine(String(proAiPrices.yearly))}
                </span>
                <UpgradeLink source="account-features" href={pricingHref} style={{ fontSize: 13, fontWeight: 600, fontFamily: T.sans, color: T.onTeal, textDecoration: 'none', padding: '10px 20px', borderRadius: 10, background: T.teal }}>
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
            <SyncSetup hasSyncSetup={hasSyncSetup} passphraseSetAt={syncRow?.passphraseSetAt ?? null} isPro={hasProAccess} enabledOnText={syncEnabledText} c={syncSetupContent} />
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

        <section style={{ marginBottom: 28 }}>
          <div style={sectionLabel}>{c.reminders.title}</div>
          <div style={card}>
            <ReminderToggle nextAt={reminderNextAt} locale={locale} c={c.reminders} />
          </div>
        </section>

        {isInsider && (
          <section style={{ marginBottom: 28 }}>
            <div style={sectionLabel}>{c.marketingConsent.title}</div>
            <div style={card}>
              <MarketingConsent optedIn={profile?.marketingOptIn ?? false} c={c.marketingConsent} />
            </div>
          </section>
        )}

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

      <SiteFooter />
    </div>
    </StudioFrame>
  );
}
