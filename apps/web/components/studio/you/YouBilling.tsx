'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarCheck, Check, ExternalLink, Gift, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { openBillingPortal, syncAfterPortal } from '@/lib/billingPortalClient';
import { startCheckout } from '@/lib/checkoutClient';
import type { AiPlan } from '@/lib/ai/config';
import { useStudio } from '../StudioContext';
import { getYouContent } from './you.content';
import { UsageBar, useAllowance } from './CreditsView';

export interface BillingInfo {
  plan: AiPlan | null; isSubscriber: boolean; periodEnd: string | null; cancelAt: string | null; proUntil: string | null; isInsider: boolean;
  prices: { monthly: number; yearly: number }; refillPrice: number;
}

// You > Settings > Plan and billing: the plan card on the left; the yearly
// offer, what you pay for and the billing buttons on the right. No credit or
// usage numbers anywhere (usage model, 2026-11-24). Prices come from
// lib/pricing.ts via the page.
export function YouBilling({ b }: { b: BillingInfo }) {
  const { c, locale, openUpgrade } = useStudio();
  const t = getYouContent(locale);
  const k = t.bill;
  const usage = useAllowance();
  const [opening, setOpening] = useState(false);
  const [failed, setFailed] = useState(false);
  const router = useRouter();
  // Back from Stripe's billing portal: show the new state straight away.
  useEffect(() => { void syncAfterPortal(() => router.refresh()); }, [router]);
  const fmt = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }) : null);
  const portal = async () => { setOpening(true); setFailed(false); if (!(await openBillingPortal(locale))) { setOpening(false); setFailed(true); } };
  const insider = async () => { setOpening(true); setFailed(false); if (!(await startCheckout({ plan: 'pro_ai_monthly', placement: 'studio', locale }))) { setOpening(false); setFailed(true); } };

  // Early Lifetime (bought before the coach existed): every Pro feature, a
  // thank-you gift of coach use, and Pro AI monthly at the Insider price.
  if (b.plan === 'earlyLifetime') {
    return (
      <div className="s-pad s-bill">
        <div className="s-planc2">
          <span className="s-badge"><Sparkles size={12} />{k.earlyLifetime}</span>
          <span className="s-sub-t" style={{ fontSize: 12.5 }}>{k.noRenew}</span>
          {usage?.gift.left && <span className="s-row" style={{ gap: 8, fontSize: 13 }}><Gift size={14} />{k.giftNote}</span>}
          {usage && <UsageBar v={usage} />}
        </div>
        <div className="s-col" style={{ gap: 10 }}>
          <div className="s-yrup"><CalendarCheck size={18} /><div className="s-grow"><b>{k.insiderTitle}</b><span className="s-sub-t">{k.insiderBody}</span></div>
            <button type="button" className="s-btn acc xs" disabled={opening} onClick={() => void insider()}>{k.insiderCta}</button></div>
          {failed && <span role="alert" style={{ color: 'var(--bad)', fontSize: 13 }}>{t.billingError}</span>}
        </div>
      </div>
    );
  }

  // Old one-time Pro: their Pro features until the end date, a small trial of
  // the coach, and the way to Pro AI. Not a Pro AI plan, so no "generous use".
  if (b.plan === 'legacy') {
    return (
      <div className="s-pad s-bill">
        <div className="s-planc2">
          <span className="s-badge"><Sparkles size={12} />{k.legacy}</span>
          <span className="s-sub-t" style={{ fontSize: 12.5 }}>{k.legacyBody(fmt(b.proUntil && new Date(b.proUntil) > new Date() ? b.proUntil : null))}</span>
          {usage?.gift.left && <span className="s-row" style={{ gap: 8, fontSize: 13 }}><Gift size={14} />{k.trialNote}</span>}
          {usage && <UsageBar v={usage} />}
        </div>
        <div className="s-col" style={{ gap: 10, justifyContent: 'center' }}>
          <button type="button" className="s-btn acc" style={{ alignSelf: 'flex-start' }} onClick={() => openUpgrade('coach')}><Sparkles size={14} />{t.upgrade}</button>
        </div>
      </div>
    );
  }

  if (!b.plan) {
    return (
      <div className="s-pad s-bill">
        <div className="s-planc2">
          <span className="s-badge"><Sparkles size={12} />{k.freeTitle}</span>
          <b className="s-pprice">${b.prices.monthly}<small>/mo</small></b>
          <span className="s-sub-t" style={{ fontSize: 12.5 }}>{k.freePrice(String(b.prices.monthly), String(b.prices.yearly))}</span>
          <div className="s-inc">{[k.generous, ...k.includes].map((x) => <span key={x}><Check size={14} />{x}</span>)}</div>
          <button type="button" className="s-btn acc" style={{ alignSelf: 'flex-start' }} onClick={() => openUpgrade('coach')}><Sparkles size={14} />{t.upgrade}</button>
        </div>
        <div className="s-col" style={{ gap: 10, justifyContent: 'center' }}><span className="s-sub-t">{t.freeBody}</span></div>
      </div>
    );
  }

  // A subscription wins over an old Lifetime purchase: an early Lifetime
  // member who subscribed sees their monthly plan, not "Lifetime".
  const lifetime = b.plan === 'lifetime';
  const name = lifetime ? k.lifetime : b.plan === 'yearly' ? k.yearly : k.monthly;
  const end = fmt(b.periodEnd ?? b.proUntil);
  const ends = fmt(b.cancelAt);
  const save = (b.prices.monthly * 12 - b.prices.yearly).toFixed(2);
  const paid = b.plan === 'monthly' || b.plan === 'yearly' || b.plan === 'lifetime';
  const rows: [string, string][] = [
    [k.youPay, `${c.plan.proAi} · ${name}`],
    ...(paid ? [[k.refills, k.refillsVal(`$${b.refillPrice}`)] as [string, string]] : []),
    [k.reads, k.readsVal],
    ...(b.isSubscriber ? [[k.cancel, ends ? k.cancelledVal(ends) : k.cancelVal(end)] as [string, string]] : []),
  ];
  return (
    <div className="s-pad s-bill">
      <div className="s-planc2">
        <div className="s-row" style={{ justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
          <span className="s-badge"><Sparkles size={12} />{c.plan.proAi} · {name}</span>
          <span className="s-sub-t" style={{ fontSize: 12.5 }}>{b.isSubscriber && ends ? k.endsOn(ends) : b.isSubscriber && end ? k.renewsOn(end) : lifetime ? k.noRenew : end ?? ''}</span>
        </div>
        <span style={{ fontWeight: 600 }}>{b.plan === 'lifetime' ? k.lifetimeBase : k.generous}</span>
        <div className="s-inc">{k.includes.map((x) => <span key={x}><Check size={14} />{x}</span>)}</div>
        {usage && <UsageBar v={usage} />}
        <Link href="/app/you/credits" className="s-crline"><Sparkles size={14} />{t.usage}<span>{t.openUsage}</span></Link>
      </div>
      <div className="s-col" style={{ gap: 12 }}>
        {b.plan === 'monthly' && b.isSubscriber && !ends && (
          <div className="s-yrup"><CalendarCheck size={18} /><div className="s-grow"><b>{k.yearlyUp(String(b.prices.yearly))}</b><span className="s-sub-t">{k.yearlyBody(save)}</span></div>
            <button type="button" className="s-btn xs" disabled={opening} onClick={() => void portal()}>{k.switchYearly}</button></div>
        )}
        <div className="s-paytbl">{rows.map(([l, v]) => <div key={l}><span className="s-sub-t">{l}</span><b>{v}</b></div>)}</div>
        {b.isSubscriber && (
          <div className="s-row" style={{ gap: 8, flexWrap: 'wrap' }}>
            <button type="button" className="s-btn sec" disabled={opening} onClick={() => void portal()}><ExternalLink size={14} />{opening ? t.opening : t.manage}</button>
            {ends
              ? <button type="button" className="s-btn acc" disabled={opening} onClick={() => void portal()}>{k.keepPlan}</button>
              : <button type="button" className="s-btn sec" disabled={opening} onClick={() => void portal()}>{k.cancelBtn}</button>}
          </div>
        )}
        {failed && <span role="alert" style={{ color: 'var(--bad)', fontSize: 13 }}>{t.billingError}</span>}
      </div>
    </div>
  );
}
