'use client';

import { Link } from '@/i18n/navigation';
import { proAiPricesAt, isLaunchPricing, perMonth, STANDARD_PRO_AI_PRICE_USD } from '@/lib/pricing';
import type { CheckoutPlan } from '@/lib/checkoutClient';
import { track } from '@/lib/analytics';
import { Ic } from '@/components/home/icons';
import { PlanMark, PriceNum } from '@/components/home/PlanMark';
import type { PricingContent } from './content';
import type { PricingMore } from './pricingMore.content';
import { fillTemplate } from './fill';

export type Billing = 'yearly' | 'monthly';

// Plan cards (Nov 2026, v2). Every card has the same six slots: head, price,
// who it is for, the action, four points, the foot. On wide screens the cards
// share one grid (subgrid), so prices, buttons and points line up exactly.
export function Points({ items }: { items: string[] }) {
  return <ul className="pr-pts">{items.map((f) => <li key={f}><Ic n="check" s={13} /><span>{f}</span></li>)}</ul>;
}

export function CompareLink({ label }: { label: string }) {
  return <a href="#compare" className="see-all pr-cmp" onClick={() => track('pricing-see-everything-clicked')}>{label}<Ic n="arrow" s={13} /></a>;
}

export function PlanHead({ kind, name, tag }: { kind: 'free' | 'pro' | 'life'; name: string; tag?: string }) {
  return <div className="pt"><span className="pt-n"><PlanMark kind={kind} /><b>{name}</b></span>{tag && <span className="pt-tag">{tag}</span>}</div>;
}

export function FreeCard({ c, m }: { c: PricingContent; m: PricingMore }) {
  return (
    <div className="plan pf-free">
      <PlanHead kind="free" name={c.freeLabel} tag={c.freeNoSignup} />
      <div className="price"><span className="p num"><PriceNum n={0} /></span><span className="pu">{c.freeBadge}</span></div>
      <div className="pr-for"><p>{m.freeFor}</p></div>
      <div className="pr-act"><Link href="/" className="btn pbtn" onClick={() => track('pricing-use-free-clicked')}>{c.freeCta}</Link></div>
      <Points items={m.freeTop} />
      <div className="pr-foot-s"><CompareLink label={m.compareLink} /></div>
    </div>
  );
}

export function ProCard({ c, m, billing, paymentsEnabled, userEmail, isPro, isLifetimeMember, loading, error, onBuy, onManage }: {
  c: PricingContent; m: PricingMore; billing: Billing; paymentsEnabled: boolean; userEmail: string | null; isPro: boolean; isLifetimeMember: boolean;
  loading: CheckoutPlan | 'portal' | null; error: string | null; onBuy: () => void; onManage: () => void;
}) {
  const prices = proAiPricesAt(), launch = isLaunchPricing();
  const price = billing === 'yearly' ? prices.yearly : prices.monthly;
  const std = billing === 'yearly' ? STANDARD_PRO_AI_PRICE_USD.yearly : STANDARD_PRO_AI_PRICE_USD.monthly;
  const cta = loading ? c.ctaRedirecting : !paymentsEnabled ? (userEmail ? c.ctaGoToDashboard : c.ctaTryProFree) : c.ctaProAi;
  return (
    <div className="plan hl">
      <PlanHead kind="pro" name={c.proLabel} tag={c.proBadge} />
      <div className="price">
        {/* key: the number fades in again when the period changes */}
        <span className="p num" key={billing}><PriceNum n={price} /></span>
        <span className="pu">{billing === 'yearly' ? c.perYearShort : c.perMonthShort}</span>
        {launch && <s className="pr-std" aria-label={`$${std}`}>${std}</s>}
      </div>
      <div className="pr-for">
        {billing === 'yearly' && <p className="pr-pm">{fillTemplate(c.perMonthTemplate, { price: `$${perMonth(prices.yearly)}` })}</p>}
        <p>{m.proFor}</p>
        {launch && <p className="pr-launch"><i aria-hidden="true" />{fillTemplate(c.launchNoteTemplate, { std: `$${std}` })}</p>}
        <p className="pr-small">{c.proBetaNote}</p>
      </div>
      <div className="pr-act">
        {error && <p className="pr-err" role="alert">{error}</p>}
        {isPro ? (
          <>
            <button type="button" className="btn pbtn pri2" disabled={loading !== null} onClick={onManage}>{loading === 'portal' ? c.ctaRedirecting : c.manageBilling}</button>
            <p className="pr-small">{c.subscriberNote}</p>
          </>
        ) : !isLifetimeMember && (
          <>
            <button type="button" className="btn pbtn pri2" disabled={loading !== null} onClick={onBuy}>{cta}</button>
            <p className="pr-small">{paymentsEnabled ? c.onetimeNote : c.betaNote}</p>
          </>
        )}
      </div>
      <Points items={m.proTop} />
      <div className="pr-foot-s"><CompareLink label={m.compareLink} /></div>
    </div>
  );
}
