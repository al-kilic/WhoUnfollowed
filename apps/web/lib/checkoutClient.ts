'use client';

import { track, Events, trackFunnel } from '@/lib/analytics';
import type { AppLocale } from '@/i18n/routing';

export type CheckoutPlan = 'yearly' | 'monthly' | 'lifetime';
export type CheckoutPlacement = 'results' | 'pricing' | 'reveal' | 'diff' | 'home';

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
  track(Events.checkoutStart, { billing: opts.plan === 'lifetime' ? 'lifetime' : `unlock-${opts.plan}`, placement: opts.placement });

  let acquisitionSource: string | undefined;
  try { acquisitionSource = sessionStorage.getItem('wu:acq_source') ?? undefined; } catch {}

  const body = opts.plan === 'lifetime'
    ? { plan: 'lifetime', marketingOptIn: opts.marketingOptIn === true, acquisitionSource, locale: opts.locale }
    : { mode: 'unlock', billing: opts.plan, acquisitionSource, locale: opts.locale };

  try {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as { url?: string };
    if (!data.url) return false;
    window.location.href = data.url;
    return true;
  } catch {
    return false;
  }
}
