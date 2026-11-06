'use server';

import { hash, verify } from '@node-rs/argon2';
import Stripe from 'stripe';
import { and, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db/index';
import { users, cloudSnapshots, profiles } from '@/lib/db/schema';
import { validateRequest, invalidateSession } from '@/lib/auth/session';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { checkRateLimit } from '@/lib/auth/rate-limit';

const ARGON2_OPTIONS = { memoryCost: 19456, timeCost: 2, parallelism: 1 };

export type ChangePasswordErrorCode =
  | 'not_authenticated'
  | 'too_short'
  | 'account_not_found'
  | 'incorrect_password'
  | 'too_many_attempts';

// Change the password for the logged-in user. The cloud-sync key is derived from
// the password, so the client re-encrypts every cloud snapshot under the new key
// (same salt) and passes the new blobs here; we swap them in the same transaction
// as the password change so the two never drift apart.
export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
  reEncrypted: { id: string; ciphertextB64: string; ivB64: string }[];
}): Promise<{ ok: boolean; error?: ChangePasswordErrorCode }> {
  const { user } = await validateRequest();
  if (!user) return { ok: false, error: 'not_authenticated' as const };

  // Limits guessing the current password from a hijacked session.
  if (!checkRateLimit(`change-password:${user.id}`).allowed) {
    return { ok: false, error: 'too_many_attempts' as const };
  }

  if (!input.newPassword || input.newPassword.length < 8) {
    return { ok: false, error: 'too_short' as const };
  }

  const row = await db.query.users.findFirst({
    where: eq(users.id, user.id),
    columns: { passwordHash: true },
  });
  if (!row) return { ok: false, error: 'account_not_found' as const };

  const valid = await verify(row.passwordHash, input.currentPassword, ARGON2_OPTIONS);
  if (!valid) return { ok: false, error: 'incorrect_password' as const };

  const newHash = await hash(input.newPassword, ARGON2_OPTIONS);

  await db.transaction(async (tx) => {
    await tx.update(users).set({ passwordHash: newHash }).where(eq(users.id, user.id));

    for (const s of input.reEncrypted) {
      await tx
        .update(cloudSnapshots)
        .set({
          encryptedBlob: Buffer.from(s.ciphertextB64, 'base64'),
          iv: Buffer.from(s.ivB64, 'base64'),
        })
        .where(and(eq(cloudSnapshots.id, s.id), eq(cloudSnapshots.userId, user.id)));
    }
  });

  return { ok: true };
}

// Self-serve withdrawal for the Lifetime-purchase marketing opt-in. Sets
// marketingOptOutAt rather than clearing marketingOptIn/marketingOptInAt, so
// the consent record stays intact ("consented on X, withdrew on Y") instead
// of being overwritten.
export async function setMarketingOptOut(): Promise<{ ok: boolean }> {
  const { user } = await validateRequest();
  if (!user) return { ok: false };

  await db.update(profiles).set({ marketingOptIn: false, marketingOptOutAt: new Date() }).where(eq(profiles.userId, user.id));
  return { ok: true };
}

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

// Turns "time to check again" reminder emails on or off for the logged-in
// account (see lib/reminders). Turning them on starts a fresh 2-week timer.
export async function setRemindersEnabled(on: boolean, locale: string): Promise<{ ok: boolean; nextAt?: string }> {
  const { user } = await validateRequest();
  if (!user) return { ok: false };
  const { enableReminders, disableRemindersForUser } = await import('@/lib/reminders/store');
  const { hasLocale } = await import('next-intl');
  const { routing } = await import('@/i18n/routing');
  if (!on) {
    await disableRemindersForUser(user.id, user.email);
    return { ok: true };
  }
  const { nextAt } = await enableReminders({
    email: user.email,
    source: 'account',
    locale: hasLocale(routing.locales, locale) ? locale : routing.defaultLocale,
    userId: user.id,
  });
  return { ok: true, nextAt: nextAt.toISOString() };
}
