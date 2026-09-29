// Single source of truth for the DISPLAY price of a Pro unlock, so a price
// change only needs editing here instead of hunting down every hardcoded
// "$1.99"/"$9.99" string across the site. Client-safe (no 'server-only'),
// unlike lib/stripe.ts. This must still be kept in sync BY HAND with whatever
// STRIPE_PRICE_UNLOCK_MONTHLY/YEARLY actually charge in Stripe's dashboard;
// nothing enforces that automatically.
import type { UnlockDuration } from './stripe';

export const UNLOCK_PRICE_USD: Record<UnlockDuration, number> = {
  monthly: 1.99,
  yearly: 9.99,
};

export const UNLOCK_DAYS_LABEL: Record<UnlockDuration, string> = {
  monthly: '30 days',
  yearly: '365 days',
};

// "$1.99 for 30 days, $9.99 for 365 days" — the sentence used in copy
// wherever both durations are mentioned together.
export const UNLOCK_PRICE_SUMMARY =
  `$${UNLOCK_PRICE_USD.monthly} for ${UNLOCK_DAYS_LABEL.monthly}, $${UNLOCK_PRICE_USD.yearly} for ${UNLOCK_DAYS_LABEL.yearly}`;

// The Lifetime ("Insider") tier: a separate one-time SKU, not part of
// the UnlockDuration union (no day count, never expires). Must be kept in
// sync BY HAND with STRIPE_PRICE_LIFETIME, same caveat as above.
export const LIFETIME_PRICE_USD = 19.99;

export const LIFETIME_PRICE_SUMMARY = `$${LIFETIME_PRICE_USD} once, for lifetime access`;
