import 'server-only';
import Stripe from 'stripe';

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

export type Billing = 'monthly' | 'yearly';

// Resolves the Stripe Price id for the chosen billing interval. Returns null if
// the corresponding price env var is not configured.
export function priceIdForBilling(billing: Billing): string | null {
  return billing === 'yearly'
    ? (process.env.STRIPE_PRICE_YEARLY ?? null)
    : (process.env.STRIPE_PRICE_MONTHLY ?? null);
}

// One-time unlock durations. 'monthly'/'yearly' name the two SKUs (30 vs 365
// days), not a recurring interval — these are one-off Stripe Prices in
// `payment` mode, never `subscription` mode.
export type UnlockDuration = 'monthly' | 'yearly';

export const UNLOCK_DURATION_DAYS: Record<UnlockDuration, number> = {
  monthly: 30,
  yearly: 365,
};

export function priceIdForUnlock(duration: UnlockDuration): string | null {
  return duration === 'yearly'
    ? (process.env.STRIPE_PRICE_UNLOCK_YEARLY ?? null)
    : (process.env.STRIPE_PRICE_UNLOCK_MONTHLY ?? null);
}
