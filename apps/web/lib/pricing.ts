// Single source of truth for the DISPLAY price of a Pro unlock, so a price
// change only needs editing here instead of hunting down every hardcoded
// "$1.99"/"$9.99" string across the site. Client-safe (no 'server-only'),
// unlike lib/stripe.ts. This must still be kept in sync BY HAND with whatever
// the STRIPE_PRICE_UNLOCK_* env vars actually charge in Stripe's dashboard;
// nothing enforces that automatically.
import type { UnlockDuration } from './stripe';

// Launch prices end when Dec 31 ends. From this moment on, lib/stripe.ts
// switches checkout to the STRIPE_PRICE_UNLOCK_*_STANDARD price IDs, and the
// display prices below switch with it. Client components pick the change up
// on their own; statically rendered pages (homepage, llms.txt) only after the
// next deploy, so deploy once on or after Jan 1.
export const PRICE_INCREASE_AT = new Date('2027-01-01T00:00:00Z');

export const LAUNCH_UNLOCK_PRICE_USD: Record<UnlockDuration, number> = {
  monthly: 1.99,
  yearly: 9.99,
};

export const STANDARD_UNLOCK_PRICE_USD: Record<UnlockDuration, number> = {
  monthly: 2.99,
  yearly: 14.99,
};

export function isLaunchPricing(now: Date = new Date()): boolean {
  return now.getTime() < PRICE_INCREASE_AT.getTime();
}

export function unlockPricesAt(now: Date = new Date()): Record<UnlockDuration, number> {
  return isLaunchPricing(now) ? LAUNCH_UNLOCK_PRICE_USD : STANDARD_UNLOCK_PRICE_USD;
}

// The prices in effect when this module loaded.
export const UNLOCK_PRICE_USD: Record<UnlockDuration, number> = unlockPricesAt();

export const UNLOCK_DAYS_LABEL: Record<UnlockDuration, string> = {
  monthly: '30 days',
  yearly: '365 days',
};

// "$1.99 for 30 days, $9.99 for 365 days" — the sentence used in copy
// wherever both durations are mentioned together.
export const UNLOCK_PRICE_SUMMARY =
  `$${UNLOCK_PRICE_USD.monthly} for ${UNLOCK_DAYS_LABEL.monthly}, $${UNLOCK_PRICE_USD.yearly} for ${UNLOCK_DAYS_LABEL.yearly}`;

// Yearly price spread over 12 months, for "about $0.83 a month" copy.
export function perMonth(yearlyPrice: number): string {
  return (Math.floor((yearlyPrice / 12) * 100) / 100).toFixed(2);
}

// The Lifetime ("Insider") tier: a separate one-time SKU, not part of the
// UnlockDuration union (no day count, never expires). It sells in a fixed
// ladder of seats: once a step's seats are gone the price moves up, and after
// the last step Lifetime closes for good. Each step has its own Stripe price
// (see priceIdForLifetimeTier in lib/stripe.ts), kept in sync BY HAND.
//
// 2026-11-11: the $19.99 / $39 / $99 ladder was replaced by one $499 step.
// Seats already sold still count toward the 40, and Lifetime closes on
// LIFETIME_CLOSES_AT whatever is left.
export interface LifetimeTier {
  price: number;
  seats: number;
}

export const LIFETIME_TIERS: readonly LifetimeTier[] = [
  { price: 499, seats: 40 },
];

// Lifetime stops selling at this moment (end of Dec 31, 2026, UTC).
export const LIFETIME_CLOSES_AT = new Date('2027-01-01T00:00:00Z');

export function isLifetimeClosedByDate(now: Date = new Date()): boolean {
  return now.getTime() >= LIFETIME_CLOSES_AT.getTime();
}

export const LIFETIME_TOTAL_SEATS = LIFETIME_TIERS.reduce((sum, t) => sum + t.seats, 0);

export interface LifetimeOffer {
  tierIndex: number;
  price: number;
  seatsInTier: number;
  seatsLeftInTier: number;
  // Share of this price step still available, 0 to 100, for the seat meter.
  pctLeft: number;
  nextPrice: number | null;
}

// Which step of the ladder the next buyer lands on, given how many Lifetime
// seats are already sold. Null once every seat is gone.
export function lifetimeOfferForSold(sold: number): LifetimeOffer | null {
  let before = 0;
  for (let i = 0; i < LIFETIME_TIERS.length; i++) {
    const tier = LIFETIME_TIERS[i]!;
    if (sold < before + tier.seats) {
      const left = before + tier.seats - Math.max(0, sold);
      return {
        tierIndex: i,
        price: tier.price,
        seatsInTier: tier.seats,
        seatsLeftInTier: left,
        pctLeft: Math.round((left / tier.seats) * 100),
        nextPrice: LIFETIME_TIERS[i + 1]?.price ?? null,
      };
    }
    before += tier.seats;
  }
  return null;
}

// Opening price of the ladder, for static copy that can't count seats.
export const LIFETIME_PRICE_USD = LIFETIME_TIERS[0]!.price;

export const LIFETIME_PRICE_SUMMARY = `$${LIFETIME_PRICE_USD} once, for lifetime access`;

// ─── Pro AI (subscription, 2026-11) ─────────────────────────────────────────
// Display prices. Like the unlock prices above, launch prices hold until
// PRICE_INCREASE_AT; people who subscribe before then keep their launch price
// (their Stripe subscription stays on the launch Price). Stripe charges what
// the STRIPE_PRICE_PRO_AI_* env vars point at; keep these in sync BY HAND.
export type ProAiInterval = 'monthly' | 'yearly';

export const LAUNCH_PRO_AI_PRICE_USD: Record<ProAiInterval, number> = { monthly: 9.99, yearly: 69 };
export const STANDARD_PRO_AI_PRICE_USD: Record<ProAiInterval, number> = { monthly: 14.99, yearly: 99 };

export function proAiPricesAt(now: Date = new Date()): Record<ProAiInterval, number> {
  return isLaunchPricing(now) ? LAUNCH_PRO_AI_PRICE_USD : STANDARD_PRO_AI_PRICE_USD;
}

// "$9.99 a month or $69 a year": for metadata, structured data and llms.txt.
export const PRO_AI_PRICE_USD = proAiPricesAt();
export const PRO_AI_PRICE_SUMMARY = `$${PRO_AI_PRICE_USD.monthly} a month or $${PRO_AI_PRICE_USD.yearly} a year`;

// ─── Pro AI refills (one-time, usage model 2026-11-24) ─────────────────────
// One more month of coach use for half the monthly price, for members on a
// paid plan. Used after the monthly allowance, expires TOPUP_VALID_MONTHS after
// purchase, at most 2 held (lib/ai/allowanceMath.ts). Stripe charges what
// STRIPE_PRICE_TOPUP_300 points at (the env name is historical); keep the
// price in sync BY HAND.
export const TOPUP_PRICE_USD = 4.99;
export const TOPUP_VALID_MONTHS = 12;
