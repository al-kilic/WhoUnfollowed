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

export function priceIdForUnlock(duration: UnlockDuration): string | null {
  return duration === 'yearly'
    ? (process.env.STRIPE_PRICE_UNLOCK_YEARLY ?? null)
    : (process.env.STRIPE_PRICE_UNLOCK_MONTHLY ?? null);
}

// Unset STRIPE_PRICE_LIFETIME on the VPS to pull the Lifetime tier from sale
// at any time, with no deploy: /pricing's lifetimeAvailable flag reads the
// same env var, so the two stay in sync automatically.
export function priceIdForLifetime(): string | null {
  return process.env.STRIPE_PRICE_LIFETIME ?? null;
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
