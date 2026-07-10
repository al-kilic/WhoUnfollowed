'use server';

import Stripe from 'stripe';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db/index';
import { users, profiles } from '@/lib/db/schema';
import { validateRequest, invalidateSession } from '@/lib/auth/session';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { eq } from 'drizzle-orm';

export async function deleteAccountAction() {
  const { user, session } = await validateRequest();
  if (!user || !session) redirect('/login');

  if (isStripeConfigured()) {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, user.id),
    });

    if (profile?.stripeSubscriptionId) {
      const stripe = getStripe();
      try {
        await stripe.subscriptions.cancel(profile.stripeSubscriptionId);
      } catch (err) {
        // "Already canceled / no longer exists" is fine — anything else means
        // the subscription is still live, so stop rather than silently
        // deleting the account and losing the ID needed to fix billing later.
        const alreadyGone = err instanceof Stripe.errors.StripeError && err.code === 'resource_missing';
        if (!alreadyGone) throw err;
      }
    }
  }

  await invalidateSession(session.id);
  // Cascade deletes handle profiles, sessions, snapshots, sync_settings
  await db.delete(users).where(eq(users.id, user.id));

  redirect('/');
}
