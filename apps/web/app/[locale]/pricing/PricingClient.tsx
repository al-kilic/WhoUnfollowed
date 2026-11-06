'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SiteNav } from '@/components/landing/SiteNav';
import { GridBg, ProfileCard } from '@/components/landing/atoms';
import { T } from '@/components/landing/tokens';
import { track } from '@/lib/analytics';
import { unlockPricesAt, isLaunchPricing, perMonth, STANDARD_UNLOCK_PRICE_USD, type LifetimeOffer } from '@/lib/pricing';
import { startCheckout, type CheckoutPlan } from '@/lib/checkoutClient';
import { CreatorAiTeaser } from '@/components/CreatorAiTeaser';
import { getPathname } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';
import type { PricingFaqItem } from './faq';
import type { PricingContent } from './content';
import { LifetimeCard } from './LifetimeCard';

interface Props {
  userEmail: string | null;
  paymentsEnabled: boolean;
  isPro?: boolean;
  // 'open' with the current seat-ladder step, 'sold_out', or 'off'.
  lifetime: { status: 'open'; offer: LifetimeOffer } | { status: 'sold_out' } | { status: 'off' };
  isLifetimeMember?: boolean;
  content: PricingContent;
  faq: PricingFaqItem[];
  locale: AppLocale;
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

export function PricingClient({ userEmail, paymentsEnabled, isPro = false, lifetime, isLifetimeMember = false, content, faq, locale }: Props) {
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState<CheckoutPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Prices are read at render time in the browser, so the switch on Jan 1
  // shows up without a deploy.
  const prices = unlockPricesAt();
  const launch = isLaunchPricing();
  const stdYearly = `$${STANDARD_UNLOCK_PRICE_USD.yearly}`;

  async function buy(plan: Exclude<CheckoutPlan, 'lifetime'>) {
    if (!paymentsEnabled) {
      window.location.href = getPathname({ href: userEmail ? '/history' : '/signup', locale });
      return;
    }
    setLoading(plan);
    setError(null);
    const ok = await startCheckout({ plan, placement: 'pricing', locale });
    if (!ok) {
      setError(content.errorGeneric);
      setLoading(null);
    }
  }

  const yearlyCta = loading === 'yearly'
    ? content.ctaRedirecting
    : !paymentsEnabled
      ? (userEmail ? content.ctaGoToDashboard : content.ctaTryProFree)
      : `${isPro ? content.ctaExtendYear : content.ctaYearly} · $${prices.yearly}`;
  const showLifetime = paymentsEnabled && lifetime.status !== 'off';

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

        {paymentsEnabled && launch && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 100,
              background: 'rgba(168,75,47,0.08)', border: '1px solid rgba(168,75,47,0.28)',
            }}>
              <span aria-hidden style={{ width: 6, height: 6, borderRadius: '50%', background: T.terra, flexShrink: 0, animation: 'save-pulse 2.2s ease-in-out infinite' }} />
              <span style={{ fontSize: 12.5, color: T.terraText, fontWeight: 600 }}>{fillTemplate(content.launchBanner, { std: stdYearly })}</span>
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
        <div className={`plan-grid ${showLifetime ? 'plan-grid-3' : 'plan-grid-2'}`}>

          {/* FREE card */}
          <div className="plan-card" style={{
            background: T.surface1, border: `1px solid ${T.border2}`, borderRadius: 20,
            padding: '30px 28px',
          }}>
            <div className="plan-head pc-1">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 11px', borderRadius: 100, background: T.tealGlow }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.tealLight, flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.tealLight, fontFamily: T.mono }}>{content.freeBadge}</span>
              </div>
            </div>
            <div className="pc-2" style={{ fontFamily: T.serif, fontSize: 50, lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 4 }}>$0</div>
            <div className="pc-3" style={{ fontSize: 13, color: T.inkMute, marginBottom: 22 }}>{content.freeNoSignup}</div>

            <ul className="pc-4" style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 11 }}>
              {content.freeBullets.map((f) => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: T.ink }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.tealMid, flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/"
              className="pc-6"
              onClick={() => track('pricing-use-free-clicked')}
              style={{
                display: 'block', width: '100%', padding: '13px 24px', borderRadius: 12, alignSelf: 'end',
                border: `1px solid ${T.border3}`, textAlign: 'center', textDecoration: 'none',
                fontSize: 15, fontWeight: 600, fontFamily: T.sans, color: T.ink, boxSizing: 'border-box',
              }}
            >
              {content.freeCta}
            </Link>
          </div>

          {/* PRO card: one year is the main offer, 30 days is a small link */}
          <div className="plan-card" style={{
            position: 'relative',
            background: `linear-gradient(180deg, rgba(2,136,143,0.12) 0%, rgba(2,136,143,0.03) 100%)`,
            border: `1.5px solid ${T.tealMid}`, borderRadius: 20,
            padding: '30px 28px',
            boxShadow: '0 18px 50px rgba(2,136,143,0.16)',
          }}>
            <div className="plan-head pc-1">
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.tealLight, fontFamily: T.mono }}>{content.proLabel}</div>
              <div style={{ background: T.teal, color: T.cream, fontSize: 9, fontWeight: 800, letterSpacing: '0.05em', padding: '3px 8px', borderRadius: 100, whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
                {content.proBadge}
              </div>
            </div>

            <div className="pc-2" style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: T.serif, fontSize: 50, fontWeight: 400, lineHeight: 1 }}>${prices.yearly}</span>
              {launch && (
                <span style={{ fontFamily: T.serif, fontSize: 22, color: T.inkMute, textDecoration: 'line-through', lineHeight: 1 }}>{stdYearly}</span>
              )}
              <span style={{ color: T.inkMute, fontSize: 14 }}>{content.oneTime}</span>
            </div>
            <div className="pc-3" style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 13, color: T.inkDim, marginBottom: 6 }}>
                {fillTemplate(content.perMonthTemplate, { price: `$${perMonth(prices.yearly)}` })}
              </div>
              {launch && (
                <div style={{ fontSize: 12, color: T.terraText, fontWeight: 600 }}>
                  {fillTemplate(content.launchNoteTemplate, { std: stdYearly })}
                </div>
              )}
            </div>

            <div className="pc-4" style={{ marginBottom: 22 }}>
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

            <div className="pc-5">
              {error && <p role="alert" style={{ color: T.terraText, fontSize: 13, marginBottom: 12 }}>{error}</p>}
            </div>

            {!isLifetimeMember && (
              <button
                className="pc-6"
                onClick={() => void buy('yearly')}
                disabled={loading !== null}
                style={{
                  width: '100%', padding: '13px 24px', borderRadius: 12, border: 'none', alignSelf: 'end',
                  cursor: loading ? 'not-allowed' : 'pointer', background: T.teal, color: T.cream,
                  fontSize: 15, fontWeight: 600, fontFamily: T.sans, opacity: loading ? 0.7 : 1,
                }}
              >
                {yearlyCta}
              </button>
            )}

            {!isLifetimeMember && (
              <div className="pc-7" style={{ textAlign: 'center', marginTop: 10, minHeight: 32, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
                {paymentsEnabled && (
                  <button
                    onClick={() => void buy('monthly')}
                    disabled={loading !== null}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 13, color: T.tealMid, fontWeight: 600, fontFamily: T.sans, textDecoration: 'underline', textUnderlineOffset: 3 }}
                  >
                    {loading === 'monthly'
                      ? content.ctaRedirecting
                      : fillTemplate(isPro ? content.monthlyExtendTemplate : content.monthlyLinkTemplate, { price: `$${prices.monthly}` })}
                  </button>
                )}
                <p style={{ fontSize: 12, color: T.inkMute, margin: 0 }}>
                  {paymentsEnabled ? content.onetimeNote : content.betaNote}
                </p>
              </div>
            )}
          </div>

          {/* LIFETIME card: seat ladder, shown while STRIPE_PRICE_LIFETIME is set and payments are live */}
          {showLifetime && (
            <LifetimeCard
              lifetime={lifetime}
              content={content.lifetime}
              errorGeneric={content.errorGeneric}
              ctaRedirecting={content.ctaRedirecting}
              isLifetimeMember={isLifetimeMember}
              locale={locale}
            />
          )}
        </div>

        <div style={{ maxWidth: 880, margin: '40px auto 0' }}>
          <CreatorAiTeaser locale={locale} placement="pricing" defaultEmail={userEmail ?? undefined} />
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
