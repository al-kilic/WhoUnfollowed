'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SiteNav } from '@/components/landing/SiteNav';
import { T } from '@/components/landing/tokens';

interface Props {
  userEmail: string | null;
  paymentsEnabled: boolean;
  isPro?: boolean;
}

const FEATURES = [
  'Unlimited snapshot history',
  'Cloud sync (AES-256 encrypted)',
  'Unfollower tracking over time',
  'Follower growth charts',
  'Ghost follower detection',
  'CSV export',
  'Multi-device access',
  'Email alerts (coming soon)',
];

export function PricingClient({ userEmail, paymentsEnabled, isPro = false }: Props) {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribe() {
    if (!paymentsEnabled) {
      window.location.href = userEmail ? '/history' : '/signup';
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billing }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const monthlyPrice = 4.99;
  const yearlyPrice = 29;
  const yearlyMonthly = (yearlyPrice / 12).toFixed(2);
  const saving = Math.round((1 - yearlyPrice / (monthlyPrice * 12)) * 100);

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <SiteNav userEmail={userEmail} isPro={isPro} />

      <main style={{ maxWidth: 560, margin: '0 auto', padding: '64px 24px' }}>

        {!paymentsEnabled && (
          <div style={{
            background: T.tealGlow,
            border: `1px solid ${T.teal}`,
            borderRadius: 10,
            padding: '12px 16px',
            marginBottom: 40,
            fontSize: 13,
            color: T.teal,
          }}>
            Free during beta. Sign up now and get full access at no cost until we launch paid plans.
          </div>
        )}

        <h1 style={{ fontFamily: T.serif, fontSize: 36, fontWeight: 400, marginBottom: 8 }}>
          One plan. Full access.
        </h1>
        <p style={{ color: T.inkDim, fontSize: 15, marginBottom: 40, lineHeight: 1.6 }}>
          No feature tiers, no tracking limits. Everything included.
        </p>

        {/* Billing toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 32,
          background: T.surface1,
          borderRadius: 10,
          padding: 4,
          width: 'fit-content',
        }}>
          {(['monthly', 'yearly'] as const).map((b) => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              style={{
                padding: '6px 16px',
                borderRadius: 7,
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
                background: billing === b ? T.teal : 'transparent',
                color: billing === b ? T.cream : T.inkDim,
                transition: 'all 0.15s',
              }}
            >
              {b === 'monthly' ? 'Monthly' : `Yearly (save ${saving}%)`}
            </button>
          ))}
        </div>

        {/* Pricing card */}
        <div style={{
          background: T.bgCard,
          border: `1px solid ${T.border1}`,
          borderRadius: 16,
          padding: 32,
          marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
            <span style={{ fontFamily: T.serif, fontSize: 48, fontWeight: 400 }}>
              ${billing === 'monthly' ? monthlyPrice : yearlyMonthly}
            </span>
            <span style={{ color: T.inkMute, fontSize: 14 }}>/ month</span>
          </div>

          {billing === 'yearly' && (
            <p style={{ color: T.inkDim, fontSize: 13, marginBottom: 16 }}>
              Billed as ${yearlyPrice}/year
            </p>
          )}

          <div style={{ borderTop: `1px solid ${T.border2}`, margin: '24px 0' }} />

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FEATURES.map((f) => (
              <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: T.inkDim }}>
                <span style={{ color: T.teal, fontSize: 16, lineHeight: 1 }}>✓</span>
                {f}
              </li>
            ))}
          </ul>

          {error && (
            <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>{error}</p>
          )}

          <button
            onClick={handleSubscribe}
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px 24px',
              borderRadius: 10,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              background: T.teal,
              color: T.cream,
              fontSize: 15,
              fontWeight: 600,
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.15s',
            }}
          >
            {loading
              ? 'Redirecting...'
              : paymentsEnabled
                ? `Subscribe ${billing === 'yearly' ? 'yearly' : 'monthly'}`
                : userEmail
                  ? 'Go to dashboard'
                  : 'Get started free'}
          </button>

          {!paymentsEnabled && (
            <p style={{ fontSize: 12, color: T.inkMute, textAlign: 'center', marginTop: 10 }}>
              No credit card required during beta.
            </p>
          )}
        </div>

        <p style={{ fontSize: 13, color: T.inkMute, textAlign: 'center' }}>
          Cancel any time. No questions asked.{' '}
          <Link href="/refund" style={{ color: T.inkDim, textDecoration: 'underline' }}>
            Refund policy
          </Link>
        </p>

        {/* FAQ */}
        <div style={{ marginTop: 56 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Common questions</h2>
          {[
            {
              q: 'What happens when I cancel?',
              a: 'You keep access for 14 days after cancellation. After that, your account and all cloud-synced data are deleted. Local snapshots on your device stay forever.',
            },
            {
              q: 'Is my Instagram data safe?',
              a: 'Yes. ZIP parsing happens entirely in your browser. Cloud-synced snapshots are encrypted with your passphrase before leaving your device. We store only ciphertext.',
            },
            {
              q: 'Do I need to give you my Instagram password?',
              a: 'Never. You download your own data from Instagram official settings and upload the ZIP here. We never touch Instagram on your behalf.',
            },
            {
              q: 'Can I switch between monthly and yearly?',
              a: 'Yes. You can upgrade to yearly at any time from your billing portal. The difference is prorated.',
            },
          ].map(({ q, a }) => (
            <div key={q} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${T.border2}` }}>
              <p style={{ fontWeight: 500, fontSize: 14, marginBottom: 6 }}>{q}</p>
              <p style={{ color: T.inkDim, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{a}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
