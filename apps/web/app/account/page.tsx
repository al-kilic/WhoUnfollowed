import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { eq } from 'drizzle-orm';
import { validateRequest } from '@/lib/auth/session';
import { db } from '@/lib/db/index';
import { profiles, syncSettings } from '@/lib/db/schema';
import { isPaidFeaturesEnabled, isProUser } from '@/lib/flags';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { isUserVerified } from '@/lib/auth/verification';
import { SiteNav } from '@/components/landing/SiteNav';
import { LandingFooter } from '@/components/landing/FinalCTA';
import { T } from '@/components/landing/tokens';
import { SyncSetup } from '@/app/settings/SyncSetup';
import { DeleteAccountButton } from '@/app/settings/DeleteAccountButton';
import { ManageBillingButton } from './ManageBillingButton';
import { ChangePassword } from './ChangePassword';

export const metadata: Metadata = {
  title: 'Account — WhoUnfollowed',
  description: 'Manage your plan, billing, and data.',
};

// Outcome-framed Pro features (what you get, not just the feature name).
const PRO_FEATURES: { title: string; desc: string }[] = [
  { title: 'Unlimited history', desc: 'Keep every export and watch your account evolve over time.' },
  { title: 'Compare snapshots', desc: 'See exactly who unfollowed you between any two exports.' },
  { title: 'Encrypted cloud sync', desc: 'Your snapshots backed up and on every device, end-to-end encrypted.' },
  { title: 'Full Radar', desc: 'Health score, growth charts, follow-age, and audience breakdown.' },
  { title: 'Triage that carries over', desc: 'Never re-triage the same accounts after a new export.' },
  { title: 'Ghost-follower radar', desc: 'Surface long-tenure accounts that never engage back.' },
  { title: 'Unlimited CSV export', desc: 'Pull any list, as often as you like.' },
  { title: 'Email alerts', desc: 'Get pinged when a new export reveals unfollowers. (soon)' },
];

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

export default async function AccountPage() {
  const { user } = await validateRequest();
  if (!user) redirect('/login');
  if (!(await isUserVerified(user.id))) redirect('/verify-email');

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
  const canManageBilling = paymentsEnabled && !!profile?.stripeCustomerId;
  const hasSyncSetup = !!syncRow;

  // For real subscribers, surface the next renewal / charge from Stripe.
  let renewal: { label: string; date: string; amount: string } | null = null;
  if (paymentsEnabled && isStripeConfigured() && profile?.stripeSubscriptionId) {
    try {
      const sub = await getStripe().subscriptions.retrieve(profile.stripeSubscriptionId);
      const item = sub.items.data[0];
      const periodEnd = item?.current_period_end;
      const unit = item?.price?.unit_amount ?? null;
      const interval = item?.price?.recurring?.interval ?? '';
      if (periodEnd) {
        renewal = {
          label: sub.cancel_at_period_end ? 'Cancels' : 'Renews',
          date: fmtDate(new Date(periodEnd * 1000)) ?? '',
          amount: unit != null ? `$${(unit / 100).toFixed(2)}/${interval === 'year' ? 'yr' : 'mo'}` : '',
        };
      }
    } catch {
      // Stripe unavailable — show no renewal line
    }
  }

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
          Account
        </h1>
        <p style={{ fontSize: 14, color: T.inkDim, marginBottom: 36 }}>Manage your plan, billing, and data.</p>

        {status === 'grace' && graceEnds && (
          <div style={{ background: 'rgba(168,75,47,0.08)', border: '1px solid rgba(168,75,47,0.25)', borderRadius: 12, padding: '14px 16px', marginBottom: 24 }}>
            <span style={{ fontSize: 13, color: T.terra, lineHeight: 1.5 }}>
              Your subscription has ended. Your account and cloud snapshots will be deleted on <strong>{graceEnds}</strong>.{' '}
              <Link href="/pricing" style={{ color: T.terra, fontWeight: 600 }}>Re-subscribe to keep your data.</Link>
            </span>
          </div>
        )}

        {/* Plan & billing */}
        <section style={{ marginBottom: 28 }}>
          <div style={sectionLabel}>Plan &amp; billing</div>
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                  <span style={{ fontFamily: T.serif, fontSize: 24, color: T.ink }}>{isPro ? 'Pro' : 'Free'}</span>
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
                    {isPro ? 'PRO' : 'FREE'}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.5 }}>
                  {renewal
                    ? `${renewal.label} ${renewal.date}${renewal.amount ? ` · ${renewal.amount}` : ''}`
                    : isPro
                      ? 'Complimentary access. Thanks for being here early.'
                      : 'You are on the free plan.'}
                </div>
              </div>
              {canManageBilling ? (
                <ManageBillingButton />
              ) : !isPro && paymentsEnabled ? (
                <Link href="/pricing" style={{ fontSize: 13, fontWeight: 600, fontFamily: T.sans, color: T.cream, textDecoration: 'none', padding: '9px 18px', borderRadius: 10, background: T.teal, whiteSpace: 'nowrap' }}>
                  Upgrade to Pro
                </Link>
              ) : null}
            </div>

            {!paymentsEnabled && (
              <div style={{ background: T.tealGlow, border: `1px solid ${T.teal}`, borderRadius: 10, padding: '12px 14px', marginTop: 16, fontSize: 13, color: T.teal, lineHeight: 1.5 }}>
                Free during beta. You have full Pro access at no cost until we launch paid plans. No billing yet.
              </div>
            )}

            <div style={{ marginTop: 18, fontSize: 13 }}>
              <Row label="Email" value={user.email} />
              {memberSince && <Row label="Member since" value={memberSince} />}
            </div>
          </div>
        </section>

        {/* What's included / Unlock with Pro */}
        <section style={{ marginBottom: 28 }}>
          <div style={sectionLabel}>{isPro ? "What's included" : 'Unlock with Pro'}</div>
          <div style={card}>
            {!isPro && (
              <p style={{ fontSize: 13.5, color: T.inkDim, lineHeight: 1.55, marginBottom: 18 }}>
                You&apos;re on Free: one snapshot, the full non-followers list, and one CSV export. Pro turns that one-off check into an ongoing picture of your account.
              </p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px 24px' }}>
              {PRO_FEATURES.map((f) => (
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
                  <strong style={{ color: T.ink }}>$4.99/mo</strong> or $39/yr · cancel anytime
                </span>
                <Link href="/pricing" style={{ fontSize: 13, fontWeight: 600, fontFamily: T.sans, color: T.cream, textDecoration: 'none', padding: '10px 20px', borderRadius: 10, background: T.teal }}>
                  Upgrade to Pro
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Cloud sync + Security side by side on wide screens */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 28, alignItems: 'start' }}>
          <section>
            <div style={sectionLabel}>Cloud sync</div>
            <SyncSetup hasSyncSetup={hasSyncSetup} passphraseSetAt={syncRow?.passphraseSetAt ?? null} isPro={hasProAccess} />
          </section>

          <section>
            <div style={sectionLabel}>Security</div>
            <div style={card}>
              <p style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.5, marginBottom: 16 }}>
                Change your password. Any cloud snapshots are re-encrypted under the new password automatically.
              </p>
              <ChangePassword />
            </div>
          </section>
        </div>

        {/* Danger zone */}
        <section>
          <div style={{ ...sectionLabel, color: T.terra }}>Danger zone</div>
          <div style={{ ...card, border: '1px solid rgba(168,75,47,0.3)' }}>
            <p style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.5, marginBottom: 14 }}>
              Deleting your account removes all your data permanently, including cloud snapshots. This cannot be undone.
            </p>
            <DeleteAccountButton />
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
