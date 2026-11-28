'use client';

import { useState } from 'react';
import { getPathname } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';
import { proAiPricesAt, isLaunchPricing, STANDARD_PRO_AI_PRICE_USD, TOPUP_PRICE_USD, TOPUP_VALID_MONTHS, type LifetimeOffer } from '@/lib/pricing';
import { startCheckout, type CheckoutPlan } from '@/lib/checkoutClient';
import { openBillingPortal } from '@/lib/billingPortalClient';
import { getStudioContent } from '@/components/studio/studio.content';
import { getYouContent } from '@/components/studio/you/you.content';
import type { PricingContent } from './content';
import type { PricingMore } from './pricingMore.content';
import { fillTemplate } from './fill';
import { FreeCard, ProCard, type Billing } from './PricingCards';
import { LifetimeCard } from './LifetimeCard';
import { PricingPrivacy, PricingFaq } from './PricingExtras';
import { PricingPerks } from './PricingPerks';
import { PricingCompare } from './PricingCompare';
import { PricingSticky } from './PricingSticky';

interface Props {
  userEmail: string | null;
  paymentsEnabled: boolean;
  // A Pro AI subscriber: Manage billing instead of the buy button.
  isPro?: boolean;
  // Old one-time Pro unlock still running: show the upgrade note.
  isLegacyPro?: boolean;
  lifetime: { status: 'open'; offer: LifetimeOffer } | { status: 'sold_out' } | { status: 'off' };
  isLifetimeMember?: boolean;
  content: PricingContent;
  more: PricingMore;
  faq: { q: string; a: string }[];
  locale: AppLocale;
}

export { fillTemplate };

// /pricing in the homepage's look (Nov 2026): Free, Pro AI (monthly or
// yearly) and Lifetime. Prices come from lib/pricing.ts at render time in the
// browser, so the switch to standard prices on Jan 1 needs no deploy.
export function PricingClient({ userEmail, paymentsEnabled, isPro = false, isLegacyPro = false, lifetime, isLifetimeMember = false, content, more, faq, locale }: Props) {
  const [billing, setBilling] = useState<Billing>('yearly');
  const [loading, setLoading] = useState<CheckoutPlan | 'portal' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const prices = proAiPricesAt();
  const launch = isLaunchPricing();
  const savePct = Math.round((1 - prices.yearly / (prices.monthly * 12)) * 100);
  const showLifetime = paymentsEnabled && lifetime.status !== 'off';

  async function buy() {
    const plan: CheckoutPlan = billing === 'yearly' ? 'pro_ai_yearly' : 'pro_ai_monthly';
    if (!paymentsEnabled) { window.location.href = getPathname({ href: userEmail ? '/app' : '/signup', locale }); return; }
    setLoading(plan); setError(null);
    if (!(await startCheckout({ plan, placement: 'pricing', locale }))) { setError(content.errorGeneric); setLoading(null); }
  }
  async function manage() {
    setLoading('portal'); setError(null);
    if (!(await openBillingPortal(locale))) { setError(content.errorGeneric); setLoading(null); }
  }

  const up = getStudioContent(locale).upgradePro;
  // Perk buttons and the phone bar only for people who can buy Pro AI here.
  const canBuy = !isPro && !isLifetimeMember;
  const refill = fillTemplate(content.topupNoteTemplate, { price: `$${TOPUP_PRICE_USD}`, months: TOPUP_VALID_MONTHS });
  return (
    <main id="top">
      <section className="sec pr-sec">
        <div className="wrap">
          <div className="sec-head c">
            {!paymentsEnabled && <span className="pill acc">{content.betaBadge}</span>}
            {isLegacyPro && <span className="pill acc pr-wrap">{up.title}. {getYouContent(locale).upgradeProBody}</span>}
            {paymentsEnabled && launch && <span className="pill warn pr-wrap">{fillTemplate(content.launchBanner, { std: `$${STANDARD_PRO_AI_PRICE_USD.yearly}` })}</span>}
            <h1 className="pr-h1">{content.headline}</h1>
            <p>{content.subhead}</p>
          </div>
          {paymentsEnabled && (
            <div className="bill" role="group" aria-label={content.proLabel}>
              {(['monthly', 'yearly'] as const).map((b) => (
                <button key={b} type="button" aria-pressed={billing === b} onClick={() => setBilling(b)}>
                  {b === 'yearly' ? content.yearly : content.monthly}
                  {b === 'yearly' && savePct > 0 && <span className="save">{fillTemplate(content.savePctTemplate, { pct: savePct })}</span>}
                </button>
              ))}
            </div>
          )}
          <div id="plans" className={`plans${showLifetime ? ' three' : ''}`}>
            <FreeCard c={content} m={more} />
            <ProCard
              c={content} m={more} billing={billing} paymentsEnabled={paymentsEnabled} userEmail={userEmail} isPro={isPro}
              isLifetimeMember={isLifetimeMember} loading={loading} error={error} onBuy={() => void buy()} onManage={() => void manage()}
            />
            {showLifetime && <LifetimeCard lifetime={lifetime} content={content.lifetime} m={more} errorGeneric={content.errorGeneric} ctaRedirecting={content.ctaRedirecting} isLifetimeMember={isLifetimeMember} locale={locale} />}
          </div>
        </div>
      </section>
      <PricingPerks m={more} cta={content.ctaProAi} onBuy={() => void buy()} showBuy={canBuy} />
      <PricingCompare m={more} footnote={content.lifetime.bullets[3] ?? ''} refill={refill} />
      <PricingPrivacy c={content} />
      <PricingFaq title={content.faqTitle} faq={faq} />
      {canBuy && paymentsEnabled && (
        <PricingSticky label={content.ctaProAi} price={`$${billing === 'yearly' ? prices.yearly : prices.monthly} ${billing === 'yearly' ? content.perYearShort : content.perMonthShort}`}
          note={more.stickyNote} disabled={loading !== null} onBuy={() => void buy()} />
      )}
    </main>
  );
}
