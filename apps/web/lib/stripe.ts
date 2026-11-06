import 'server-only';
import Stripe from 'stripe';
import { isLaunchPricing } from './pricing';

// Single Stripe API version used across checkout, portal, and webhook so event
// shapes and request behaviour stay consistent.
const STRIPE_API_VERSION = '2026-05-27.dahlia' as const;

let cached: Stripe | null = null;

export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

// Lazily constructs (and caches) the Stripe client. Throws if the key is missing,
// callers behind the payments flag should guard with isStripeConfigured() first.
export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  if (!cached) {
    cached = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: STRIPE_API_VERSION });
  }
  return cached;
}

// One-time unlock durations. 'monthly'/'yearly' name the two SKUs (30 vs 365
// days), not a recurring interval — these are one-off Stripe Prices in
// `payment` mode. There is no recurring/subscription pricing, every purchase
// on this site is one-time: a dated unlock (this union) or the separate,
// never-expiring Lifetime tier (priceIdForLifetime() below, not a
// UnlockDuration — it has no day count and doesn't fit extendUnlockExpiry()'s
// date-math/stacking shape).
export type UnlockDuration = 'monthly' | 'yearly';

export const UNLOCK_DURATION_DAYS: Record<UnlockDuration, number> = {
  monthly: 30,
  yearly: 365,
};

// Launch prices until PRICE_INCREASE_AT (lib/pricing.ts), then the
// *_STANDARD prices. Create the standard prices in Stripe ahead of time and
// set both env vars on the VPS, or checkout returns "not configured" after
// the switch instead of silently charging the old price.
export function priceIdForUnlock(duration: UnlockDuration, now: Date = new Date()): string | null {
  if (isLaunchPricing(now)) {
    return duration === 'yearly'
      ? (process.env.STRIPE_PRICE_UNLOCK_YEARLY ?? null)
      : (process.env.STRIPE_PRICE_UNLOCK_MONTHLY ?? null);
  }
  return duration === 'yearly'
    ? (process.env.STRIPE_PRICE_UNLOCK_YEARLY_STANDARD ?? null)
    : (process.env.STRIPE_PRICE_UNLOCK_MONTHLY_STANDARD ?? null);
}

// One Stripe price per step of the Lifetime seat ladder (LIFETIME_TIERS in
// lib/pricing.ts): $19.99, then $39, then $99. Unset STRIPE_PRICE_LIFETIME on
// the VPS to pull Lifetime from sale at any time, with no deploy.
const LIFETIME_PRICE_ENV = ['STRIPE_PRICE_LIFETIME', 'STRIPE_PRICE_LIFETIME_39', 'STRIPE_PRICE_LIFETIME_99'] as const;

export function priceIdForLifetimeTier(tierIndex: number): string | null {
  const key = LIFETIME_PRICE_ENV[tierIndex];
  return key ? (process.env[key] ?? null) : null;
}

// True while Lifetime is switched on at all (the opening price is set).
export function priceIdForLifetime(): string | null {
  return priceIdForLifetimeTier(0);
}

// Extends from the later of "now" and any unexpired unlock already on the
// profile, so buying another unlock before the current one runs out stacks
// instead of resetting the clock.
export function extendUnlockExpiry(currentExpiresAt: Date | null, duration: UnlockDuration, now: Date = new Date()): Date {
  const days = UNLOCK_DURATION_DAYS[duration];
  const base = currentExpiresAt && currentExpiresAt.getTime() > now.getTime() ? currentExpiresAt : now;
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
}
