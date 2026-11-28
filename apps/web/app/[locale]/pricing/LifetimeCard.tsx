'use client';

import { useState } from 'react';
import { startCheckout } from '@/lib/checkoutClient';
import type { LifetimeOffer } from '@/lib/pricing';
import type { AppLocale } from '@/i18n/routing';
import { PriceNum } from '@/components/home/PlanMark';
import type { PricingContent } from './content';
import type { PricingMore } from './pricingMore.content';
import { CompareLink, PlanHead, Points } from './PricingCards';

interface Props {
  lifetime: { status: 'open'; offer: LifetimeOffer } | { status: 'sold_out' } | { status: 'off' };
  content: PricingContent['lifetime'];
  m: PricingMore;
  errorGeneric: string;
  ctaRedirecting: string;
  isLifetimeMember: boolean;
  locale: AppLocale;
}

const fill = (t: string, v: Record<string, string>) => Object.entries(v).reduce((acc, [k, x]) => acc.replaceAll(`{${k}}`, x), t);

// Lifetime ("Insider"): a one-time purchase with a limited number of seats.
// The optional email opt-in sits above the button (it only counts if ticked
// before buying); the seats meter lives in the card's foot.
export function LifetimeCard({ lifetime, content, m, errorGeneric, ctaRedirecting, isLifetimeMember, locale }: Props) {
  const [optIn, setOptIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function buy() {
    setLoading(true); setError(null);
    if (!(await startCheckout({ plan: 'lifetime', placement: 'pricing', locale, marketingOptIn: optIn }))) { setError(errorGeneric); setLoading(false); }
  }

  const head = <PlanHead kind="life" name={content.badge} />;
  if (lifetime.status !== 'open') {
    return (
      <div className="plan pr-life sold">
        {head}
        <b className="pr-sold">{content.soldOutTitle}</b>
        <div className="pr-for"><p>{content.soldOutBody}</p></div>
      </div>
    );
  }
  const { offer } = lifetime;
  return (
    <div className="plan pr-life">
      {head}
      <div className="price"><span className="p num"><PriceNum n={offer.price} /></span><span className="pu">{content.once}</span></div>
      <div className="pr-for">
        <p>{m.lifeFor}</p>
        {!isLifetimeMember && <label className="pr-opt"><input type="checkbox" checked={optIn} onChange={(e) => setOptIn(e.target.checked)} /><span>{content.consentLabel}</span></label>}
      </div>
      <div className="pr-act">
        {isLifetimeMember ? <p className="pr-member">{content.alreadyMember}</p> : (
          <>
            {error && <p className="pr-err" role="alert">{error}</p>}
            <button type="button" className="btn pbtn" onClick={() => void buy()} disabled={loading}>{loading ? ctaRedirecting : content.cta}</button>
            <p className="pr-small">{content.note}</p>
          </>
        )}
      </div>
      <Points items={m.lifeTop} />
      <div className="pr-foot-s">
        <div className="pr-seats">
          <div className="pr-seats-h"><span>{content.seatsLeftTemplate}</span><b>{offer.pctLeft}%</b></div>
          <div className="meter" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={offer.pctLeft} aria-label={`${content.seatsLeftTemplate}: ${offer.pctLeft}%`}>
            <i style={{ width: `${offer.pctLeft}%` }} />
          </div>
          <span className="pr-note">{offer.nextPrice !== null ? fill(content.nextPriceTemplate, { price: `$${offer.nextPrice}` }) : content.lastStep}</span>
        </div>
        <CompareLink label={m.compareLink} />
      </div>
    </div>
  );
}
