import 'server-only';
import { randomBytes } from 'crypto';
import { and, asc, eq, isNotNull, isNull, lte, or } from 'drizzle-orm';
import { db } from '@/lib/db/index';
import { emailSubscribers } from '@/lib/db/schema';
import { SUBSCRIBER_CONSENT_VERSION } from '@/lib/marketingConsent';
import type { AppLocale } from '@/i18n/routing';
import { firstReminderAt } from './schedule';

export function newToken(): string {
  return randomBytes(24).toString('base64url');
}

export type ReminderSource = 'results' | 'snapshot-limit' | 'reveal' | 'welcome' | 'signup' | 'purchase' | 'account';

// Turns reminders on for an address (creating the row if needed) and returns
// when the first one is due plus the row's token. Re-subscribing after an
// opt-out turns reminders back on: the person just asked for them again.
export async function enableReminders(opts: {
  email: string;
  source: ReminderSource;
  locale: AppLocale;
  userId?: string | null;
  now?: Date;
}): Promise<{ nextAt: Date; token: string; alreadyOn: boolean }> {
  const now = opts.now ?? new Date();
  const email = opts.email.trim().toLowerCase();

  const existing = await db.query.emailSubscribers.findFirst({ where: eq(emailSubscribers.email, email) });
  if (existing?.reminderNextAt && !existing.reminderOptedOutAt && existing.token) {
    if (opts.userId && !existing.userId) {
      await db.update(emailSubscribers).set({ userId: opts.userId }).where(eq(emailSubscribers.id, existing.id));
    }
    return { nextAt: existing.reminderNextAt, token: existing.token, alreadyOn: true };
  }

  const nextAt = firstReminderAt(now);
  const token = existing?.token ?? newToken();
  const reminderFields = {
    locale: opts.locale,
    reminderNextAt: nextAt,
    reminderSentCount: 0,
    reminderOptedOutAt: null,
    token,
    ...(opts.userId ? { userId: opts.userId } : {}),
  };

  if (existing) {
    await db.update(emailSubscribers).set(reminderFields).where(eq(emailSubscribers.id, existing.id));
  } else {
    await db.insert(emailSubscribers).values({
      email,
      source: opts.source,
      consentVersion: SUBSCRIBER_CONSENT_VERSION,
      ...reminderFields,
    });
  }
  return { nextAt, token, alreadyOn: false };
}

// Adds an address to the Creator AI waitlist without touching its reminders.
export async function joinCreatorWaitlist(opts: { email: string; locale: AppLocale; userId?: string | null }): Promise<void> {
  const email = opts.email.trim().toLowerCase();
  const now = new Date();
  await db
    .insert(emailSubscribers)
    .values({
      email,
      source: 'creator-ai-waitlist',
      consentVersion: SUBSCRIBER_CONSENT_VERSION,
      locale: opts.locale,
      creatorWaitlistAt: now,
      token: newToken(),
      ...(opts.userId ? { userId: opts.userId } : {}),
    })
    .onConflictDoUpdate({ target: emailSubscribers.email, set: { creatorWaitlistAt: now } });
}

export async function findByToken(token: string) {
  if (!token || token.length > 64) return undefined;
  return db.query.emailSubscribers.findFirst({ where: eq(emailSubscribers.token, token) });
}

// Stops reminder emails for the address behind a token. Idempotent: a second
// click (or a mail scanner) changes nothing. Returns false for an unknown token.
export async function disableRemindersByToken(token: string, now: Date = new Date()): Promise<boolean> {
  const row = await findByToken(token);
  if (!row) return false;
  if (!row.reminderOptedOutAt) {
    await db
      .update(emailSubscribers)
      .set({ reminderNextAt: null, reminderOptedOutAt: now })
      .where(eq(emailSubscribers.id, row.id));
  }
  return true;
}

export async function markEngaged(token: string, now: Date = new Date()): Promise<typeof emailSubscribers.$inferSelect | undefined> {
  const row = await findByToken(token);
  if (!row) return undefined;
  await db.update(emailSubscribers).set({ reminderEngagedAt: now }).where(eq(emailSubscribers.id, row.id));
  return row;
}

// Rows for an account: linked by id, or by the same address (a buy-first
// purchase creates the reminder before the account exists).
function accountRow(userId: string, email: string) {
  return or(eq(emailSubscribers.userId, userId), eq(emailSubscribers.email, email.trim().toLowerCase()));
}

// Reminder state for a logged-in account, for /account.
export async function getReminderStateForUser(userId: string, email: string) {
  return db.query.emailSubscribers.findFirst({
    where: accountRow(userId, email),
    columns: { reminderNextAt: true, reminderOptedOutAt: true, token: true },
  });
}

export async function disableRemindersForUser(userId: string, email: string, now: Date = new Date()): Promise<void> {
  await db
    .update(emailSubscribers)
    .set({ reminderNextAt: null, reminderOptedOutAt: now })
    .where(accountRow(userId, email));
}

export async function dueReminders(now: Date, limit: number) {
  return db.query.emailSubscribers.findMany({
    where: and(
      isNotNull(emailSubscribers.reminderNextAt),
      lte(emailSubscribers.reminderNextAt, now),
      isNull(emailSubscribers.reminderOptedOutAt),
      isNull(emailSubscribers.optedOutAt),
    ),
    orderBy: [asc(emailSubscribers.reminderNextAt)],
    limit,
  });
}
