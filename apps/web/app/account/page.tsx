import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { eq } from 'drizzle-orm';
import { validateRequest } from '@/lib/auth/session';
import { db } from '@/lib/db/index';
import { profiles, syncSettings } from '@/lib/db/schema';
import { isPaidFeaturesEnabled, isProUser } from '@/lib/flags';
import { NavBarClient } from '@/components/NavBarClient';
import { LandingFooter } from '@/components/landing/FinalCTA';
import { T } from '@/components/landing/tokens';
import { SyncSetup } from '@/app/settings/SyncSetup';
import { DeleteAccountButton } from '@/app/settings/DeleteAccountButton';
import { ManageBillingButton } from './ManageBillingButton';

export const metadata: Metadata = {
  title: 'Account — WhoUnfollowed',
  description: 'Manage your plan, billing, and data.',
};

const PRO_FEATURES = [
  'Unlimited snapshot history',
  'Cloud sync (AES-256 encrypted)',
  'Unfollower tracking over time',
  'Follower growth charts',
  'Ghost follower detection',
  'CSV export',
  'Multi-device access',
  'Email alerts (coming soon)',
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

  const [profile, syncRow, isPro] = await Promise.all([
    db.query.profiles.findFirst({ where: eq(profiles.userId, user.id) }),
    db.query.syncSettings.findFirst({ where: eq(syncSettings.userId, user.id) }),
    isProUser(),
  ]);

  const paymentsEnabled = isPaidFeaturesEnabled();
  const status = profile?.subscriptionStatus ?? 'active';
  const statusLabel = paymentsEnabled
    ? status === 'active'
      ? 'Pro'
      : status === 'grace'
        ? 'Cancelled (grace period)'
        : 'Cancelled'
    : 'Pro (Free during beta)';
  const memberSince = fmtDate(profile?.createdAt);
  const graceEnds = fmtDate(profile?.gracePeriodEndsAt);
  const canManageBilling = paymentsEnabled && !!profile?.stripeCustomerId;
  const hasSyncSetup = !!syncRow;

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
      <NavBarClient userEmail={user.email} isPro={isPro} />

      <main style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px 80px' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontFamily: T.serif, fontSize: 22, color: T.ink }}>{isPro ? 'Pro' : 'Free'}</span>
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
              {canManageBilling && <ManageBillingButton />}
            </div>

            {!paymentsEnabled && (
              <div style={{ background: T.tealGlow, border: `1px solid ${T.teal}`, borderRadius: 10, padding: '12px 14px', marginTop: 16, fontSize: 13, color: T.teal, lineHeight: 1.5 }}>
                Free during beta. You have full Pro access at no cost until we launch paid plans. No billing yet.
              </div>
            )}

            <div style={{ marginTop: 18, fontSize: 13 }}>
              <Row label="Email" value={user.email} />
              <Row label="Status" value={statusLabel} />
              {memberSince && <Row label="Member since" value={memberSince} />}
            </div>
          </div>
        </section>

        {/* What's included */}
        <section style={{ marginBottom: 28 }}>
          <div style={sectionLabel}>What&apos;s included</div>
          <div style={card}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px 18px' }}>
              {PRO_FEATURES.map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13.5, color: T.inkDim }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.tealMid} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cloud sync */}
        <section style={{ marginBottom: 28 }}>
          <div style={sectionLabel}>Cloud sync</div>
          <SyncSetup hasSyncSetup={hasSyncSetup} passphraseSetAt={syncRow?.passphraseSetAt ?? null} />
        </section>

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
