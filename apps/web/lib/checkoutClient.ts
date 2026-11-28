'use client';

import { track, Events, trackFunnel } from '@/lib/analytics';
import type { AppLocale } from '@/i18n/routing';
import { openBillingPortal } from '@/lib/billingPortalClient';

// pro_ai_*: the Pro AI subscription. yearly/monthly: the old one-time unlock,
// kept for links that still use it.
export type CheckoutPlan = 'pro_ai_yearly' | 'pro_ai_monthly' | 'topup' | 'yearly' | 'monthly' | 'lifetime';
export type CheckoutPlacement = 'results' | 'pricing' | 'reveal' | 'diff' | 'home' | 'studio';

// Starts a Stripe Checkout from any page (pricing, results offer card, the
// unfollower reveal) and sends the browser there. Returns false if checkout
// couldn't start, so the caller can show its own error.
export async function startCheckout(opts: {
  plan: CheckoutPlan;
  placement: CheckoutPlacement;
  locale: AppLocale;
  marketingOptIn?: boolean;
}): Promise<boolean> {
  trackFunnel('Upgrade CTA Clicked', { placement: opts.placement });
  const billing = opts.plan === 'topup' ? 'topup' : opts.plan === 'lifetime' ? 'lifetime' : opts.plan.startsWith('pro_ai') ? opts.plan.replace(/_/g, '-') : `unlock-${opts.plan}`;
  track(Events.checkoutStart, { billing, placement: opts.placement });

  let acquisitionSource: string | undefined;
  try { acquisitionSource = sessionStorage.getItem('wu:acq_source') ?? undefined; } catch {}

  const body = opts.plan === 'topup'
    ? { plan: 'topup', locale: opts.locale }
    : opts.plan === 'lifetime'
    ? { plan: 'lifetime', marketingOptIn: opts.marketingOptIn === true, acquisitionSource, locale: opts.locale }
    : opts.plan === 'pro_ai_yearly' || opts.plan === 'pro_ai_monthly'
      ? { plan: 'pro_ai', billing: opts.plan === 'pro_ai_yearly' ? 'yearly' : 'monthly', acquisitionSource, locale: opts.locale }
      : { mode: 'unlock', billing: opts.plan, acquisitionSource, locale: opts.locale };

  try {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as { url?: string; error?: string };
    // Already on Pro AI: open their billing page instead of a second plan
    // (signed out with a known email: sign in first to manage it).
    if (res.status === 409 && data.error === 'already_subscribed') {
      if (await openBillingPortal(opts.locale)) return true;
      window.location.href = opts.locale === 'en' ? '/login' : `/${opts.locale}/login`;
      return true;
    }
    if (!data.url) return false;
    window.location.href = data.url;
    return true;
  } catch {
    return false;
  }
}
