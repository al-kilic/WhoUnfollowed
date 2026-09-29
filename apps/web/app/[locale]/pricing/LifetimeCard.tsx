'use client';

import { useState } from 'react';
import { T } from '@/components/landing/tokens';
import { track, Events, trackFunnel } from '@/lib/analytics';
import { LIFETIME_PRICE_USD } from '@/lib/pricing';
import type { AppLocale } from '@/i18n/routing';
import type { PricingContent } from './content';

interface Props {
  content: PricingContent['lifetime'];
  errorGeneric: string;
  ctaRedirecting: string;
  isLifetimeMember: boolean;
  locale: AppLocale;
}

export function LifetimeCard({ content, errorGeneric, ctaRedirecting, isLifetimeMember, locale }: Props) {
  const [optIn, setOptIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy() {
    trackFunnel('Upgrade CTA Clicked', { placement: 'pricing' });
    track(Events.checkoutStart, { billing: 'lifetime' });
    setLoading(true);
    setError(null);
    try {
      let acquisitionSource: string | undefined;
      try { acquisitionSource = sessionStorage.getItem('wu:acq_source') ?? undefined; } catch {}

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'lifetime', marketingOptIn: optIn, acquisitionSource, locale }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(errorGeneric);
      }
    } catch {
      setError(errorGeneric);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      position: 'relative', background: T.surface1, border: `1px solid ${T.terra}`, borderRadius: 20,
      padding: '30px 28px', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.terra, fontFamily: T.mono }}>
          {content.badge}
        </div>
        <div style={{ background: T.terra, color: '#fff', fontSize: 9, fontWeight: 800, letterSpacing: '0.05em', padding: '3px 8px', borderRadius: 100, whiteSpace: 'nowrap' }}>
          {content.limitedNote}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
        <span style={{ fontFamily: T.serif, fontSize: 50, fontWeight: 400, lineHeight: 1 }}>${LIFETIME_PRICE_USD}</span>
        <span style={{ color: T.inkMute, fontSize: 14 }}>{content.oneTime}</span>
      </div>
      <div style={{ fontSize: 13, color: T.inkDim, marginBottom: 22, lineHeight: 1.5 }}>{content.desc}</div>

      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 22px', display: 'flex', flexDirection: 'column', gap: 11, flex: 1 }}>
        {content.bullets.map((b) => (
          <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: T.ink, lineHeight: 1.45 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.terra} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {b}
          </li>
        ))}
      </ul>

      {isLifetimeMember ? (
        <p style={{ fontSize: 14, fontWeight: 600, color: T.terra, textAlign: 'center', margin: 0 }}>{content.alreadyMember}</p>
      ) : (
        <>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: T.inkDim, lineHeight: 1.5, marginBottom: 14, cursor: 'pointer' }}>
            <input type="checkbox" checked={optIn} onChange={(e) => setOptIn(e.target.checked)} style={{ marginTop: 2 }} />
            {content.consentLabel}
          </label>

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
          <p style={{ fontSize: 12, color: T.inkMute, textAlign: 'center', marginTop: 10 }}>{content.note}</p>
        </>
      )}
    </div>
  );
}
