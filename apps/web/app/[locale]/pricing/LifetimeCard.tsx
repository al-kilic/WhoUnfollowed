'use client';

import { useState } from 'react';
import { T } from '@/components/landing/tokens';
import { startCheckout } from '@/lib/checkoutClient';
import type { LifetimeOffer } from '@/lib/pricing';
import type { AppLocale } from '@/i18n/routing';
import type { PricingContent } from './content';

interface Props {
  lifetime: { status: 'open'; offer: LifetimeOffer } | { status: 'sold_out' } | { status: 'off' };
  content: PricingContent['lifetime'];
  errorGeneric: string;
  ctaRedirecting: string;
  isLifetimeMember: boolean;
  locale: AppLocale;
}

export function LifetimeCard({ lifetime, content, errorGeneric, ctaRedirecting, isLifetimeMember, locale }: Props) {
  const [optIn, setOptIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy() {
    setLoading(true);
    setError(null);
    const ok = await startCheckout({ plan: 'lifetime', placement: 'pricing', locale, marketingOptIn: optIn });
    if (!ok) {
      setError(errorGeneric);
      setLoading(false);
    }
  }

  if (lifetime.status !== 'open') {
    return (
      <div className="plan-card" style={{ background: T.surface1, border: `1px dashed ${T.border3}`, borderRadius: 20, padding: '30px 28px' }}>
        <div className="plan-head pc-1">
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.inkMute, fontFamily: T.mono }}>{content.badge}</div>
        </div>
        <div className="pc-2" style={{ fontFamily: T.serif, fontSize: 30, lineHeight: 1.1, marginBottom: 8 }}>{content.soldOutTitle}</div>
        <p className="pc-3" style={{ fontSize: 13.5, color: T.inkDim, lineHeight: 1.55, margin: 0 }}>{content.soldOutBody}</p>
      </div>
    );
  }

  const { offer } = lifetime;
  const fill = (template: string, values: Record<string, string>) =>
    Object.entries(values).reduce((acc, [k, v]) => acc.replaceAll(`{${k}}`, v), template);

  return (
    <div className="plan-card" style={{
      position: 'relative', background: T.surface1, border: `1px solid ${T.terra}`, borderRadius: 20,
      padding: '30px 28px', boxShadow: '0 18px 50px rgba(168,75,47,0.12)',
    }}>
      <div className="plan-head pc-1">
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.terra, fontFamily: T.mono }}>
          {content.badge}
        </div>

      </div>

      <div className="pc-2" style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
        <span style={{ fontFamily: T.serif, fontSize: 50, fontWeight: 400, lineHeight: 1 }}>${offer.price}</span>
        <span style={{ color: T.inkMute, fontSize: 14 }}>{content.oneTime}</span>
      </div>
      <div className="pc-3" style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 13, color: T.inkDim, marginBottom: 8, lineHeight: 1.5 }}>{content.desc}</div>
        {/* Seat meter: the share of this price step that's still available */}
        <div style={{ display: 'grid', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 12, fontWeight: 600, color: T.terraText }}>
            <span>{content.seatsLeftTemplate}</span>
            <span style={{ fontFamily: T.mono, fontVariantNumeric: 'tabular-nums' }}>{offer.pctLeft}%</span>
          </div>
          <div role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={offer.pctLeft} aria-label={`${content.seatsLeftTemplate}: ${offer.pctLeft}%`}
            style={{ height: 7, borderRadius: 99, background: 'rgba(168,75,47,0.14)', overflow: 'hidden' }}>
            <div style={{ width: `${offer.pctLeft}%`, height: '100%', borderRadius: 99, background: T.terra, transition: 'width 0.6s ease' }} />
          </div>
          <span style={{ fontSize: 12, color: T.inkDim }}>
            {offer.nextPrice !== null ? fill(content.nextPriceTemplate, { price: `$${offer.nextPrice}` }) : content.lastStep}
          </span>
        </div>
      </div>

      <ul className="pc-4" style={{ listStyle: 'none', padding: 0, margin: '0 0 22px', display: 'flex', flexDirection: 'column', gap: 11 }}>
        {content.bullets.map((b, i) => (
          <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: T.ink, lineHeight: 1.45, fontWeight: i === 0 ? 600 : 400 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.terra} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {b}
          </li>
        ))}
      </ul>

      {isLifetimeMember ? (
        <p className="pc-6" style={{ fontSize: 14, fontWeight: 600, color: T.terra, textAlign: 'center', margin: 0, alignSelf: 'end' }}>{content.alreadyMember}</p>
      ) : (
        <>
          <label className="pc-5" style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: T.inkDim, lineHeight: 1.5, marginBottom: 14, cursor: 'pointer' }}>
            <input type="checkbox" checked={optIn} onChange={(e) => setOptIn(e.target.checked)} style={{ marginTop: 2 }} />
            {content.consentLabel}
          </label>

          <div className="pc-6" style={{ alignSelf: 'end' }}>
            {error && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>{error}</p>}
            <button
              onClick={handleBuy}
              disabled={loading}
              style={{
                width: '100%', padding: '13px 24px', borderRadius: 12, border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer', background: T.terra, color: '#fff',
                fontSize: 15, fontWeight: 600, fontFamily: T.sans, opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? ctaRedirecting : content.cta}
            </button>
          </div>
          <p className="pc-7" style={{ fontSize: 12, color: T.inkMute, textAlign: 'center', marginTop: 10, minHeight: 32 }}>{content.note}</p>
        </>
      )}
    </div>
  );
}
