import 'server-only';
import { count, isNotNull } from 'drizzle-orm';
import { db } from '@/lib/db/index';
import { profiles } from '@/lib/db/schema';
import { lifetimeOfferForSold, type LifetimeOffer } from '@/lib/pricing';
import { priceIdForLifetimeTier } from '@/lib/stripe';

// Every genuine Lifetime purchase sets profiles.lifetimePurchasedAt (see the
// Stripe webhook), so the number of such rows is the number of seats sold.
export async function countLifetimeSeatsSold(): Promise<number> {
  const [row] = await db.select({ n: count() }).from(profiles).where(isNotNull(profiles.lifetimePurchasedAt));
  return row?.n ?? 0;
}

export type LifetimeAvailability =
  | { status: 'open'; offer: LifetimeOffer; priceId: string }
  | { status: 'sold_out' }
  | { status: 'off' };

// What the next Lifetime buyer would get right now. 'off' when Lifetime is
// switched off (no opening price set) or the current step's price is missing,
// 'sold_out' once the whole ladder is gone. Two buyers racing for the last seat
// of a step can both get the lower price; at this scale that's acceptable.
export async function getLifetimeAvailability(): Promise<LifetimeAvailability> {
  if (!priceIdForLifetimeTier(0)) return { status: 'off' };
  let sold: number;
  try {
    sold = await countLifetimeSeatsSold();
  } catch (err) {
    console.error('[lifetimeSeats] count failed:', err);
    return { status: 'off' };
  }
  const offer = lifetimeOfferForSold(sold);
  if (!offer) return { status: 'sold_out' };
  const priceId = priceIdForLifetimeTier(offer.tierIndex);
  if (!priceId) return { status: 'off' };
  return { status: 'open', offer, priceId };
}
