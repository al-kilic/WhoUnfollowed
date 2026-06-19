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

const FREE_BULLETS = [
  'See who unfollowed you',
  'Full non-followers list',
  'One snapshot at a time',
  'CSV export',
  'No account needed',
];

const PRO_BULLETS = [
  { label: 'Unlimited snapshot history', note: '' },
  { label: 'Track who unfollowed you over time', note: '' },
  { label: 'Cloud sync across your devices', note: 'encrypted in your browser' },
  { label: 'Follower growth charts', note: '' },
  { label: 'Ghost follower detection', note: '' },
  { label: 'Email alerts when someone drops', note: 'coming soon' },
];

const PRIVACY = [
  'Your ZIP is parsed entirely in your browser. Nothing is uploaded to analyze.',
  'Cloud snapshots are encrypted in your browser before they ever leave your device.',
  'EU-based servers. Open-source core. No ads, no data brokers.',
];

const FAQ = [
  {
    q: 'Is it really free?',
    a: 'Yes. The core app — see who unfollowed you, who doesn\'t follow back, CSV export — is free forever and needs no account. Pro is optional and adds history, cloud sync, and trends.',
  },
  {
    q: 'Why charge for Pro at all?',
    a: 'To keep the lights on. Pro covers servers and storage so the free app stays free, fast, and independent — no ads, no investors, no selling your data.',
  },
  {
    q: 'Do I need to give you my Instagram password?',
    a: 'Never. You download your own data from Instagram and upload the ZIP here. We have no connection to Instagram whatsoever.',
  },
  {
    q: 'Is my Instagram data safe?',
    a: 'Yes. ZIP parsing happens entirely in your browser — nothing is sent to us. Cloud-synced snapshots are encrypted in your browser before leaving your device. We store only blobs we cannot read.',
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
        : 'Try Pro free';

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <SiteNav userEmail={userEmail} isPro={isPro} />

      <main style={{ maxWidth: 1160, margin: '0 auto', padding: '44px 28px 88px' }}>

        {/* Beta badge — the single, intentional "free during beta" callout */}
        {!paymentsEnabled && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 26 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '7px 16px', borderRadius: 100,
              background: T.tealGlow, border: '1px solid rgba(2,136,143,0.3)',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.tealLight, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: T.tealLight, fontWeight: 600 }}>
                Pro is free during beta — try everything for now.
              </span>
            </div>
          </div>
        )}

        {/* Slogan / value header */}
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 48px' }}>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(36px, 5.5vw, 60px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.04, marginBottom: 18 }}>
            Always free.<br />Pro helps keep it alive.
          </h1>
          <p style={{ color: T.inkDim, fontSize: 16, lineHeight: 1.7, margin: '0 auto', maxWidth: 580 }}>
            WhoUnfollowed is free and open source. See who unfollowed you with no account,
            no password, and nothing leaving your browser. Pro adds memory and depth — history,
            trends, and alerts — and keeps the servers running so the free app stays free.
          </p>
        </div>

        {/* Free + Pro, side by side */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24, alignItems: 'stretch', maxWidth: 880, margin: '0 auto',
        }}>

          {/* FREE card */}
          <div style={{
            background: T.surface1, border: `1px solid ${T.border2}`, borderRadius: 20,
            padding: '30px 28px', display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 6, padding: '4px 11px', borderRadius: 100, background: T.tealGlow, marginBottom: 14 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.tealLight, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.tealLight, fontFamily: T.mono }}>Free forever</span>
            </div>
            <div style={{ fontFamily: T.serif, fontSize: 50, lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 4 }}>$0</div>
            <div style={{ fontSize: 13, color: T.inkMute, marginBottom: 22 }}>no sign up required</div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 11, flex: 1 }}>
              {FREE_BULLETS.map((f) => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: T.ink }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.tealMid, flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>

            <Link href="/" style={{
              display: 'block', width: '100%', padding: '13px 24px', borderRadius: 12,
              border: `1px solid ${T.border3}`, textAlign: 'center', textDecoration: 'none',
              fontSize: 15, fontWeight: 600, fontFamily: T.sans, color: T.ink, boxSizing: 'border-box',
            }}>
              Use it free
            </Link>
          </div>

          {/* PRO card */}
          <div style={{
            position: 'relative',
            background: `linear-gradient(180deg, rgba(2,136,143,0.12) 0%, rgba(2,136,143,0.03) 100%)`,
            border: `1px solid ${T.tealMid}`, borderRadius: 20,
            padding: '30px 28px', display: 'flex', flexDirection: 'column',
            boxShadow: '0 18px 50px rgba(2,136,143,0.14)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.tealLight, fontFamily: T.mono }}>Pro</div>

              {/* Animated monthly / yearly toggle */}
              <div style={{ position: 'relative', display: 'inline-flex', background: T.surface2, borderRadius: 9, padding: 3 }}>
                <div style={{
                  position: 'absolute', top: 3, bottom: 3, left: 3, width: 'calc(50% - 3px)',
                  background: T.teal, borderRadius: 6,
                  transform: billing === 'yearly' ? 'translateX(100%)' : 'translateX(0)',
                  transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
                }} />
                {(['monthly', 'yearly'] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => setBilling(b)}
                    style={{
                      position: 'relative', zIndex: 1, width: 74, textAlign: 'center',
                      padding: '6px 0', border: 'none', background: 'transparent', cursor: 'pointer',
                      fontSize: 12, fontWeight: 600, fontFamily: T.sans,
                      color: billing === b ? T.cream : T.inkDim, transition: 'color 0.2s',
                    }}
                  >
                    {b === 'monthly' ? 'Monthly' : `Yearly`}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
              <span style={{ fontFamily: T.serif, fontSize: 50, fontWeight: 400, lineHeight: 1 }}>
                ${billing === 'monthly' ? monthlyPrice : yearlyMonthly}
              </span>
              <span style={{ color: T.inkMute, fontSize: 14 }}>/ month</span>
            </div>
            <div style={{ fontSize: 13, color: T.inkDim, marginBottom: 22, minHeight: 18 }}>
              {billing === 'yearly' ? `Billed $${yearlyPrice}/year · save ${saving}%` : `or $${yearlyMonthly}/mo billed yearly`}
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 22px', display: 'flex', flexDirection: 'column', gap: 11, flex: 1 }}>
              {PRO_BULLETS.map(({ label, note }) => (
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

            {error && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>{error}</p>}

            {!userEmail ? (
              <Link href="/signup" style={{
                display: 'block', width: '100%', padding: '13px 24px', borderRadius: 12,
                background: T.teal, color: T.cream, textDecoration: 'none',
                fontSize: 15, fontWeight: 600, fontFamily: T.sans, textAlign: 'center', boxSizing: 'border-box',
              }}>
                {paymentsEnabled ? 'Sign up now' : 'Try Pro free'}
              </Link>
            ) : (
              <button onClick={handleSubscribe} disabled={loading} style={{
                width: '100%', padding: '13px 24px', borderRadius: 12, border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer', background: T.teal, color: T.cream,
                fontSize: 15, fontWeight: 600, fontFamily: T.sans, opacity: loading ? 0.7 : 1,
              }}>
                {ctaLabel}
              </button>
            )}

            <p style={{ fontSize: 12, color: T.inkMute, textAlign: 'center', marginTop: 10 }}>
              {paymentsEnabled ? 'Cancel any time.' : 'No credit card required during beta.'}
            </p>
          </div>
        </div>

        {/* Privacy / why-different — value, not sales */}
        <div style={{
          maxWidth: 760, margin: '40px auto 0',
          background: T.tealGlow, border: '1px solid rgba(1,105,111,0.2)', borderRadius: 14,
          padding: '20px 22px',
        }}>
          <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.12em', marginBottom: 10 }}>WHY PEOPLE TRUST IT</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PRIVACY.map((line) => (
              <li key={line} style={{ fontSize: 14, color: T.teal, lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ flexShrink: 0, marginTop: 1 }}>·</span>
                {line}
              </li>
            ))}
          </ul>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 720, margin: '48px auto 0' }}>
          <div style={{ fontSize: 11, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.12em', marginBottom: 18 }}>COMMON QUESTIONS</div>
          {FAQ.map(({ q, a }) => (
            <div key={q} style={{ marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${T.border1}` }}>
              <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, color: T.ink }}>{q}</p>
              <p style={{ color: T.inkDim, fontSize: 14, lineHeight: 1.65, margin: 0 }}>{a}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
