'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SiteNav } from '@/components/landing/SiteNav';
import { GridBg, ProfileCard } from '@/components/landing/atoms';
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

// Core perks shown by default, plus more revealed on "See everything in Pro".
// Outcome-led copy, kept honest (no fluff, no em dashes).
const PRO_CORE = [
  { label: 'Keep every snapshot forever', note: 'unlimited history' },
  { label: 'See exactly who unfollowed you, and when', note: '' },
  { label: 'Cloud sync across all your devices', note: 'encrypted in your browser' },
  { label: 'Watch your follower count trend over time', note: '' },
  { label: 'Catch the ghosts who never engage', note: '' },
];

const PRO_MORE = [
  { label: 'Get alerted the moment someone drops', note: 'email alerts, soon' },
  { label: 'See pending follow requests, and how long they\'ve been waiting', note: '' },
  { label: 'Compare any two snapshots side by side', note: '' },
  { label: 'Surface restricted, blocked, and close-friends lists', note: '' },
  { label: 'Clean up fast: batch-open everyone who left', note: '' },
  { label: 'Mobile app included', note: 'iOS + Android, soon' },
  { label: 'Keep the app free and independent', note: 'no ads, no investors' },
];

const PRIVACY = [
  'Your ZIP is parsed entirely in your browser. Nothing is uploaded to analyze.',
  'Cloud snapshots are encrypted in your browser before they ever leave your device.',
  'EU-based servers. Open-source core. No ads, no data brokers.',
];

const FAQ = [
  {
    q: 'Is it really free?',
    a: 'Yes. The core app (see who unfollowed you, who doesn\'t follow back, CSV export) is free forever and needs no account. Pro is optional and adds history, cloud sync, and trends.',
  },
  {
    q: 'Why charge for Pro at all?',
    a: 'To keep the lights on. Pro covers servers and storage so the free app stays free, fast, and independent. No ads, no investors, no selling your data.',
  },
  {
    q: 'Do I need to give you my Instagram password?',
    a: 'Never. You download your own data from Instagram and upload the ZIP here. We have no connection to Instagram whatsoever.',
  },
  {
    q: 'Is my Instagram data safe?',
    a: 'Yes. ZIP parsing happens entirely in your browser, so nothing is sent to us. Cloud-synced snapshots are encrypted in your browser before leaving your device. We store only blobs we cannot read.',
  },
];

function Perk({ label, note }: { label: string; note: string }) {
  return (
    <li style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.tealMid} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <span style={{ fontSize: 14, color: T.ink, lineHeight: 1.45 }}>
        {label}
        {note && <span style={{ fontSize: 12, color: T.inkMute, marginLeft: 6 }}>({note})</span>}
      </span>
    </li>
  );
}

export function PricingClient({ userEmail, paymentsEnabled, isPro = false }: Props) {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [showAll, setShowAll] = useState(false);
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
    <div style={{ position: 'relative', minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans, overflow: 'hidden' }}>
      {/* Decorative background — same grid, glow, and floating cards as the landing page */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <GridBg opacity={0.05} />
        <div style={{
          position: 'absolute', left: '50%', top: '34%', transform: 'translate(-50%,-50%)',
          width: 620, height: 620, borderRadius: '50%',
          background: `radial-gradient(circle, ${T.tealGlow} 0%, transparent 60%)`, filter: 'blur(40px)',
        }} />
        <div className="hidden lg:block" style={{ position: 'absolute', left: 36, top: 150, animation: 'drift-1 6s ease-in-out infinite', opacity: 0.5 }}>
          <ProfileCard handle="@alex.studio" status="not_following_back" small />
        </div>
        <div className="hidden lg:block" style={{ position: 'absolute', right: 44, top: 184, animation: 'drift-3 6.5s ease-in-out infinite', opacity: 0.5 }}>
          <ProfileCard handle="@marco.visuals" status="mutual" small />
        </div>
        <div className="hidden xl:block" style={{ position: 'absolute', left: 70, bottom: 130, animation: 'drift-2 7.5s ease-in-out infinite', opacity: 0.4 }}>
          <ProfileCard handle="@nova.frames" status="fan" small />
        </div>
        <div className="hidden xl:block" style={{ position: 'absolute', right: 74, bottom: 160, animation: 'drift-4 8s ease-in-out infinite', opacity: 0.4 }}>
          <ProfileCard handle="@sarah_creates" status="not_following_back" small />
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <SiteNav userEmail={userEmail} isPro={isPro} />

      <main style={{ maxWidth: 1160, margin: '0 auto', padding: '26px 28px 72px' }}>

        {/* Beta badge: the single, intentional "free during beta" callout */}
        {!paymentsEnabled && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '7px 16px', borderRadius: 100,
              background: T.tealGlow, border: '1px solid rgba(2,136,143,0.3)',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.tealLight, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: T.tealLight, fontWeight: 600 }}>
                Pro is free during beta. Try everything for now.
              </span>
            </div>
          </div>
        )}

        {/* Slogan / value header */}
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 28px' }}>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(30px, 4.5vw, 46px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 12 }}>
            Always free. Pro helps keep it alive.
          </h1>
          <p style={{ color: T.inkDim, fontSize: 14.5, lineHeight: 1.6, margin: '0 auto', maxWidth: 560 }}>
            See when someone unfollows you, who never follows back, and how your audience
            shifts over time. WhoUnfollowed is free, open source, and runs entirely in your
            browser. Pro adds memory and depth (history, trends, and alerts) and keeps the
            servers running so the free app stays free.
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

              {/* Animated monthly / yearly toggle with a pulsing savings badge */}
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
                      position: 'relative', zIndex: 1, width: 78, textAlign: 'center',
                      padding: '6px 0', border: 'none', background: 'transparent', cursor: 'pointer',
                      fontSize: 12, fontWeight: 600, fontFamily: T.sans,
                      color: billing === b ? T.cream : T.inkDim, transition: 'color 0.2s',
                    }}
                  >
                    {b === 'monthly' ? 'Monthly' : 'Yearly'}
                  </button>
                ))}
                {/* Savings badge floating over the Yearly side: terra accent + pulse */}
                <div style={{
                  position: 'absolute', top: -11, right: -9, zIndex: 2,
                  background: T.terra, color: '#fff',
                  fontSize: 8.5, fontWeight: 800, letterSpacing: '0.05em',
                  padding: '3px 7px', borderRadius: 100, fontFamily: T.sans, whiteSpace: 'nowrap',
                  animation: 'save-pulse 2.2s ease-in-out infinite',
                }}>
                  SAVE {saving}%
                </div>
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

            <div style={{ flex: 1, marginBottom: 22 }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
                {PRO_CORE.map((p) => <Perk key={p.label} {...p} />)}
              </ul>

              {showAll && (
                <ul style={{ listStyle: 'none', padding: 0, margin: '11px 0 0', display: 'flex', flexDirection: 'column', gap: 11, animation: 'fade-in 0.3s ease both' }}>
                  {PRO_MORE.map((p) => <Perk key={p.label} {...p} />)}
                </ul>
              )}

              {!showAll && (
                <button
                  onClick={() => setShowAll(true)}
                  style={{
                    marginTop: 14, background: 'transparent', border: 'none', cursor: 'pointer',
                    color: T.tealMid, fontSize: 13, fontWeight: 600, fontFamily: T.sans,
                    display: 'inline-flex', alignItems: 'center', gap: 6, padding: 0,
                  }}
                >
                  See everything you get
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 4.5 L6 8 L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </div>

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

        {/* Privacy / why-different: value, not sales */}
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
    </div>
  );
}
