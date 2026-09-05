'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SiteNav } from '@/components/landing/SiteNav';
import { GridBg, ProfileCard } from '@/components/landing/atoms';
import { T } from '@/components/landing/tokens';
import { track, Events, trackFunnel } from '@/lib/analytics';
import { UNLOCK_PRICE_USD } from '@/lib/pricing';
import type { PricingFaqItem } from './faq';
import type { PricingContent } from './content';

interface Props {
  userEmail: string | null;
  paymentsEnabled: boolean;
  isPro?: boolean;
  content: PricingContent;
  faq: PricingFaqItem[];
}

function fillTemplate(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce(
    (acc, [key, value]) => acc.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

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

export function PricingClient({ userEmail, paymentsEnabled, isPro = false, content, faq }: Props) {
  const [duration, setDuration] = useState<'monthly' | 'yearly'>('monthly');
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUnlock() {
    trackFunnel('Upgrade CTA Clicked', { placement: 'pricing' });
    if (!paymentsEnabled) {
      window.location.href = userEmail ? '/history' : '/signup';
      return;
    }
    track(Events.checkoutStart, { billing: `unlock-${duration}` });
    setLoading(true);
    setError(null);
    try {
      let acquisitionSource: string | undefined;
      try { acquisitionSource = sessionStorage.getItem('wu:acq_source') ?? undefined; } catch {}

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'unlock', billing: duration, acquisitionSource }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(content.errorGeneric);
      }
    } catch {
      setError(content.errorGeneric);
    } finally {
      setLoading(false);
    }
  }

  // One-time unlocks, not recurring billing: $1.99 unlocks Pro for 30 days,
  // $9.99 for 365 days. The "save X%" figure compares the yearly unlock
  // against buying the 30-day one repeatedly for a year.
  const unlock30Price = UNLOCK_PRICE_USD.monthly;
  const unlock365Price = UNLOCK_PRICE_USD.yearly;
  const annualizedFromMonthly = unlock30Price * (365 / 30);
  const saving = Math.round((1 - unlock365Price / annualizedFromMonthly) * 100);
  const price = duration === 'yearly' ? unlock365Price : unlock30Price;
  const period = duration === 'yearly' ? content.periodYear : content.period30Days;

  const ctaLabel = loading
    ? content.ctaRedirecting
    : paymentsEnabled
      ? fillTemplate(content.ctaUnlockForTemplate, { period })
      : userEmail
        ? content.ctaGoToDashboard
        : content.ctaTryProFree;

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
                {content.betaBadge}
              </span>
            </div>
          </div>
        )}

        {/* Slogan / value header */}
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 28px' }}>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(30px, 4.5vw, 46px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 12 }}>
            {content.headline}
          </h1>
          <p style={{ color: T.inkDim, fontSize: 14.5, lineHeight: 1.6, margin: '0 auto', maxWidth: 560 }}>
            {content.subhead}
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
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.tealLight, fontFamily: T.mono }}>{content.freeBadge}</span>
            </div>
            <div style={{ fontFamily: T.serif, fontSize: 50, lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 4 }}>$0</div>
            <div style={{ fontSize: 13, color: T.inkMute, marginBottom: 22 }}>{content.freeNoSignup}</div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 11, flex: 1 }}>
              {content.freeBullets.map((f) => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: T.ink }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.tealMid, flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/"
              onClick={() => track('pricing-use-free-clicked')}
              style={{
                display: 'block', width: '100%', padding: '13px 24px', borderRadius: 12,
                border: `1px solid ${T.border3}`, textAlign: 'center', textDecoration: 'none',
                fontSize: 15, fontWeight: 600, fontFamily: T.sans, color: T.ink, boxSizing: 'border-box',
              }}
            >
              {content.freeCta}
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
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.tealLight, fontFamily: T.mono }}>{content.proLabel}</div>

              {/* Animated 30-day / 365-day toggle with a pulsing savings badge */}
              <div style={{ position: 'relative', display: 'inline-flex', background: T.surface2, borderRadius: 9, padding: 3 }}>
                <div style={{
                  position: 'absolute', top: 3, bottom: 3, left: 3, width: 'calc(50% - 3px)',
                  background: T.teal, borderRadius: 6,
                  transform: duration === 'yearly' ? 'translateX(100%)' : 'translateX(0)',
                  transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
                }} />
                {(['monthly', 'yearly'] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => { setDuration(b); track('pricing-duration-toggled', { duration: b }); }}
                    style={{
                      position: 'relative', zIndex: 1, width: 78, textAlign: 'center',
                      padding: '6px 0', border: 'none', background: 'transparent', cursor: 'pointer',
                      fontSize: 12, fontWeight: 600, fontFamily: T.sans,
                      color: duration === b ? T.cream : T.inkDim, transition: 'color 0.2s',
                    }}
                  >
                    {content.durationLabels[b]}
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
                  {fillTemplate(content.saveBadgeTemplate, { pct: saving })}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
              <span style={{ fontFamily: T.serif, fontSize: 50, fontWeight: 400, lineHeight: 1 }}>
                ${price}
              </span>
              <span style={{ color: T.inkMute, fontSize: 14 }}>{content.oneTime}</span>
            </div>
            <div style={{ fontSize: 13, color: T.inkDim, marginBottom: 22, minHeight: 18 }}>
              {duration === 'yearly' ? fillTemplate(content.unlockDescYearlyTemplate, { pct: saving }) : content.unlockDescMonthly}
            </div>

            <div style={{ flex: 1, marginBottom: 22 }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
                {content.proCore.map((p) => <Perk key={p.label} {...p} />)}
              </ul>

              {showAll && (
                <ul style={{ listStyle: 'none', padding: 0, margin: '11px 0 0', display: 'flex', flexDirection: 'column', gap: 11, animation: 'fade-in 0.3s ease both' }}>
                  {content.proMore.map((p) => <Perk key={p.label} {...p} />)}
                </ul>
              )}

              {!showAll && (
                <button
                  onClick={() => { setShowAll(true); track('pricing-see-everything-clicked'); }}
                  style={{
                    marginTop: 14, background: 'transparent', border: 'none', cursor: 'pointer',
                    color: T.tealMid, fontSize: 13, fontWeight: 600, fontFamily: T.sans,
                    display: 'inline-flex', alignItems: 'center', gap: 6, padding: 0,
                  }}
                >
                  {content.seeEverything}
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 4.5 L6 8 L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </div>

            {error && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>{error}</p>}

            <button
              onClick={handleUnlock}
              disabled={loading}
              style={{
                width: '100%', padding: '13px 24px', borderRadius: 12, border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer', background: T.teal, color: T.cream,
                fontSize: 15, fontWeight: 600, fontFamily: T.sans, opacity: loading ? 0.7 : 1,
              }}
            >
              {isPro
                ? (loading ? content.ctaRedirecting : fillTemplate(content.ctaExtendByTemplate, { period }))
                : ctaLabel}
            </button>

            <p style={{ fontSize: 12, color: T.inkMute, textAlign: 'center', marginTop: 10 }}>
              {paymentsEnabled ? content.onetimeNote : content.betaNote}
            </p>
          </div>
        </div>

        {/* Privacy / why-different: value, not sales */}
        <div style={{
          maxWidth: 760, margin: '40px auto 0',
          background: T.tealGlow, border: '1px solid rgba(1,105,111,0.2)', borderRadius: 14,
          padding: '20px 22px',
        }}>
          <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.12em', marginBottom: 10 }}>{content.privacyTitle}</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {content.privacy.map((line) => (
              <li key={line} style={{ fontSize: 14, color: T.teal, lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ flexShrink: 0, marginTop: 1 }}>·</span>
                {line}
              </li>
            ))}
          </ul>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 720, margin: '48px auto 0' }}>
          <div style={{ fontSize: 11, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.12em', marginBottom: 18 }}>{content.faqTitle}</div>
          {faq.map(({ q, a }) => (
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
