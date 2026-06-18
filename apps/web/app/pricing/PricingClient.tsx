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
  { label: 'Unlimited snapshot history', note: '' },
  { label: 'Cloud sync', note: 'AES-256 encrypted on your device before upload' },
  { label: 'Unfollower tracking over time', note: '' },
  { label: 'Follower growth charts', note: '' },
  { label: 'Ghost follower detection', note: '' },
  { label: 'CSV export', note: '' },
  { label: 'Multi-device access', note: '' },
  { label: 'Email alerts', note: 'Coming soon' },
];

const FAQ = [
  {
    q: 'What happens when I cancel?',
    a: 'You keep access for 14 days after cancellation. After that, your account and all cloud-synced data are deleted. Local snapshots on your device stay forever.',
  },
  {
    q: 'Is my Instagram data safe?',
    a: 'Yes. ZIP parsing happens entirely in your browser — nothing is sent to us. Cloud-synced snapshots are encrypted with your own passphrase before leaving your device. We store only ciphertext we cannot read.',
  },
  {
    q: 'Do I need to give you my Instagram password?',
    a: 'Never. You download your own data directly from Instagram and upload the ZIP here. We have no connection to Instagram whatsoever.',
  },
  {
    q: 'Can I switch between monthly and yearly?',
    a: 'Yes, at any time from your billing portal. The difference is prorated.',
  },
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
  const yearlyPrice = 39;
  const yearlyMonthly = (yearlyPrice / 12).toFixed(2);
  const saving = Math.round((1 - yearlyPrice / (monthlyPrice * 12)) * 100);

  const ctaLabel = loading
    ? 'Redirecting...'
    : paymentsEnabled
      ? `Subscribe ${billing === 'yearly' ? 'yearly' : 'monthly'}`
      : userEmail
        ? 'Go to dashboard'
        : 'Get started free';

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <SiteNav userEmail={userEmail} isPro={isPro} />

      <main style={{ maxWidth: 980, margin: '0 auto', padding: '56px 32px 80px' }}>

        {/* Header row */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', marginBottom: 12 }}>PRICING</div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 12 }}>
            One plan. Full access.
          </h1>
          <p style={{ color: T.inkDim, fontSize: 15, lineHeight: 1.65, maxWidth: 480 }}>
            No feature tiers, no tracking limits. Everything included. Your data stays in your browser by default.
          </p>
        </div>

        {/* Two-column layout: card left, features right */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 380px) 1fr', gap: 32, alignItems: 'start' }}>

          {/* Left: pricing card */}
          <div>
            {/* Billing toggle */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              marginBottom: 20, background: T.surface1,
              borderRadius: 10, padding: 4, width: 'fit-content',
            }}>
              {(['monthly', 'yearly'] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setBilling(b)}
                  style={{
                    padding: '6px 16px', borderRadius: 7, border: 'none', cursor: 'pointer',
                    fontSize: 13, fontWeight: 500,
                    background: billing === b ? T.teal : 'transparent',
                    color: billing === b ? T.cream : T.inkDim,
                    transition: 'all 0.15s',
                    fontFamily: T.sans,
                  }}
                >
                  {b === 'monthly' ? 'Monthly' : `Yearly (save ${saving}%)`}
                </button>
              ))}
            </div>

            <div style={{
              background: T.bgCard,
              border: `1px solid ${T.border2}`,
              borderRadius: 18,
              padding: '28px 28px 24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
                <span style={{ fontFamily: T.serif, fontSize: 52, fontWeight: 400, lineHeight: 1 }}>
                  ${billing === 'monthly' ? monthlyPrice : yearlyMonthly}
                </span>
                <span style={{ color: T.inkMute, fontSize: 14 }}>/ month</span>
              </div>
              {billing === 'yearly' && (
                <p style={{ color: T.inkDim, fontSize: 13, marginBottom: 0 }}>Billed as ${yearlyPrice}/year</p>
              )}

              <div style={{ borderTop: `1px solid ${T.border2}`, margin: '20px 0' }} />

              {error && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>{error}</p>}

              {/* Primary CTA */}
              {!userEmail ? (
                <Link
                  href="/signup"
                  style={{
                    display: 'block', width: '100%', padding: '13px 24px', borderRadius: 12,
                    background: T.teal, color: T.cream, textDecoration: 'none',
                    fontSize: 15, fontWeight: 600, fontFamily: T.sans, textAlign: 'center',
                    boxSizing: 'border-box',
                  }}
                >
                  Sign up now
                </Link>
              ) : (
                <button
                  onClick={handleSubscribe}
                  disabled={loading}
                  style={{
                    width: '100%', padding: '13px 24px', borderRadius: 12,
                    border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                    background: T.teal, color: T.cream,
                    fontSize: 15, fontWeight: 600, fontFamily: T.sans,
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {ctaLabel}
                </button>
              )}

              {!paymentsEnabled && (
                <p style={{ fontSize: 12, color: T.inkMute, textAlign: 'center', marginTop: 10 }}>
                  No credit card required during beta.
                </p>
              )}

              <div style={{ borderTop: `1px solid ${T.border2}`, margin: '18px 0 14px' }} />

              {/* Login / account link */}
              {!userEmail ? (
                <Link
                  href="/login"
                  style={{
                    display: 'block', width: '100%', padding: '11px 24px', borderRadius: 12,
                    border: `1px solid ${T.border3}`, textAlign: 'center', textDecoration: 'none',
                    fontSize: 14, fontWeight: 500, fontFamily: T.sans, color: T.inkDim,
                    boxSizing: 'border-box',
                  }}
                >
                  Already a member? Log in
                </Link>
              ) : (
                <p style={{ fontSize: 13, color: T.inkDim, textAlign: 'center' }}>
                  <Link href="/account" style={{ color: T.tealMid, fontWeight: 600, textDecoration: 'none' }}>
                    View your account
                  </Link>
                </p>
              )}

              <p style={{ fontSize: 12, color: T.inkMute, textAlign: 'center', marginTop: 10 }}>
                Cancel any time.{' '}
                <Link href="/refund" style={{ color: T.inkDim, textDecoration: 'underline' }}>Refund policy</Link>
              </p>
            </div>
          </div>

          {/* Right: features + privacy + FAQ */}
          <div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 11, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.12em', marginBottom: 14 }}>WHAT'S INCLUDED</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
                {FEATURES.map(({ label, note }) => (
                  <li key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.tealMid} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span style={{ fontSize: 14, color: T.ink, lineHeight: 1.45 }}>
                      {label}
                      {note && <span style={{ fontSize: 12, color: T.inkMute, marginLeft: 6 }}>({note})</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Privacy callout */}
            <div style={{
              background: T.tealGlow,
              border: `1px solid rgba(1,105,111,0.2)`,
              borderRadius: 12,
              padding: '16px 18px',
              marginBottom: 32,
            }}>
              <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.12em', marginBottom: 8 }}>WHY OUR CLOUD IS DIFFERENT</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
                {[
                  'Your ZIP file is parsed entirely in your browser. Nothing is uploaded to us.',
                  'Snapshots are encrypted on your device before they leave. We store blobs we cannot read.',
                  'You hold the encryption key. We cannot recover your data even if we wanted to.',
                  'EU-based servers. Open-source parsing core (MIT). No ads, no brokers.',
                ].map((line) => (
                  <li key={line} style={{ fontSize: 13, color: T.teal, lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ flexShrink: 0, marginTop: 1 }}>·</span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQ */}
            <div>
              <div style={{ fontSize: 11, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.12em', marginBottom: 16 }}>COMMON QUESTIONS</div>
              {FAQ.map(({ q, a }) => (
                <div key={q} style={{ marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${T.border1}` }}>
                  <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 5, color: T.ink }}>{q}</p>
                  <p style={{ color: T.inkDim, fontSize: 13.5, lineHeight: 1.65, margin: 0 }}>{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
