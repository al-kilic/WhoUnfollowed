import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { validateRequest } from '@/lib/auth/session';
import { checkRateLimit } from '@/lib/auth/rate-limit';
import { db } from '@/lib/db/index';
import { profiles } from '@/lib/db/schema';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { syncSubscriptionFromStripe } from '@/lib/proAiBilling';
import { syncRefills } from '@/lib/aiTopup';

// Called when a member comes back from Stripe (billing portal or a refill
// checkout): re-reads their subscription and their paid refills from Stripe,
// so a cancel, resume, plan switch or refill shows at once even when the
// webhook is late or missing. Signed-in only, and rate limited.
export async function POST() {
  if (!isStripeConfigured()) return NextResponse.json({ error: 'Payments not enabled' }, { status: 404 });
  const { user } = await validateRequest();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!checkRateLimit(`stripe-sync:${user.id}`).allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  const profile = await db.query.profiles.findFirst({ where: eq(profiles.userId, user.id), columns: { stripeSubscriptionId: true, stripeCustomerId: true } });
  const stripe = getStripe();
  const fail = (what: string) => (err: unknown) => { console.error(`[stripe sync] ${what}: ${err instanceof Error ? err.message : 'unknown'}`); return null; };
  const [synced, refills] = await Promise.all([
    profile?.stripeSubscriptionId || profile?.stripeCustomerId ? syncSubscriptionFromStripe(stripe, profile).catch(fail('subscription')) : Promise.resolve(false),
    syncRefills(stripe, user.id, profile?.stripeCustomerId ?? null).catch(fail('refills')),
  ]);
  return NextResponse.json({ synced: !!synced, refills: refills ?? 0 });
}
