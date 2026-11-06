import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  customType,
  index,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType() {
    return 'bytea';
  },
});

export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active',
  'grace',
  'cancelled',
  'none',
]);

export const feedbackSentimentEnum = pgEnum('feedback_sentiment', [
  'angry',
  'sad',
  'neutral',
  'happy',
  'delighted',
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  // Null = email not yet verified. Set once the user enters the emailed code.
  // Enforced only when email sending is configured (RESEND_API_KEY present).
  emailVerifiedAt: timestamp('email_verified_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// One pending email-verification code per user (upserted on resend). The code
// itself is never stored, only its SHA-256 hash, and it expires.
export const emailVerifications = pgTable('email_verifications', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  codeHash: text('code_hash').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// One pending password-reset token per user (upserted on re-request). Only the
// SHA-256 hash of the token is stored; the raw token lives only in the emailed link.
export const passwordResets = pgTable('password_resets', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
});

export const profiles = pgTable('profiles', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  subscriptionStatus: subscriptionStatusEnum('subscription_status')
    .notNull()
    .default('none'),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  gracePeriodEndsAt: timestamp('grace_period_ends_at'),
  // Set only for one-time unlock purchases (30-day / 365-day). Null for a real
  // recurring Stripe subscription, which never "expires" on its own, Stripe
  // webhooks flip subscriptionStatus instead. isProUser() treats a non-null,
  // past-dated value as no longer active.
  subscriptionExpiresAt: timestamp('subscription_expires_at'),
  // Last known UI locale ('en' | 'es' | 'pt'), captured at signup/checkout so
  // the cron-triggered unlock-expiry emails (no request context to read it
  // from) can still be sent in the right language. Null falls back to 'en'.
  locale: text('locale'),
  // Idempotency markers for the cron-triggered unlock-expiry emails: since an
  // expired unlock's subscriptionStatus row is never flipped (getSubscriptionStatus
  // computes "expired" at read time from subscriptionExpiresAt), the daily cron
  // needs its own record of which emails already went out, or it would resend
  // them every day forever.
  expiryReminderSentAt: timestamp('expiry_reminder_sent_at'),
  expiredEmailSentAt: timestamp('expired_email_sent_at'),
  // The sole signal for a genuine Lifetime ("Insider") purchase. Do
  // NOT infer lifetime status from a null subscriptionExpiresAt elsewhere —
  // every ordinary signup is already seeded with subscriptionStatus:'active'
  // and a null subscriptionExpiresAt (see isPaidSubscriber()'s comment in
  // lib/flags.ts), so null expiry alone means nothing. Also doubles as the
  // "Insider since {date}" copy on /account.
  lifetimePurchasedAt: timestamp('lifetime_purchased_at'),
  // Consent to be emailed about future products (not this product's
  // transactional emails, which need no opt-in). Opt-out is a separate field
  // rather than clearing marketingOptInAt, so there's a retained record of
  // "consented on X, withdrew on Y" instead of just a current boolean.
  marketingOptIn: boolean('marketing_opt_in').notNull().default(false),
  marketingOptInAt: timestamp('marketing_opt_in_at'),
  marketingOptOutAt: timestamp('marketing_opt_out_at'),
  // Freeform tag identifying which version of the consent copy was agreed to
  // (e.g. 'lifetime-2026-09'), so a later copy change doesn't retroactively
  // muddy what an earlier consent actually covered.
  marketingConsentVersion: text('marketing_consent_version'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const cloudSnapshots = pgTable('cloud_snapshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  label: text('label').notNull(),
  exportedAt: timestamp('exported_at').notNull(),
  encryptedBlob: bytea('encrypted_blob').notNull(),
  iv: bytea('iv').notNull(),
  salt: bytea('salt').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const syncSettings = pgTable('sync_settings', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  passphraseSalt: text('passphrase_salt').notNull(),
  passphraseSetAt: timestamp('passphrase_set_at').notNull().defaultNow(),
});

// Email addresses people handed over on purpose (mobile-app waitlist, CSV
// export prompt), each with a consent record. Distinct from
// profiles.marketingOptIn, which belongs to an account (Lifetime buyers).
// A future broadcast send must union both lists and honor both opt-outs.
export const emailSubscribers = pgTable('email_subscribers', {
  id: uuid('id').primaryKey().defaultRandom(),
  // Stored lowercased; unique, so re-subscribing updates the row instead of duplicating it.
  email: text('email').notNull().unique(),
  // Where the address first came from: 'mobile-waitlist' | 'csv' | 'signup'
  // | an EmailOptInSource from packages/core.
  source: text('source').notNull(),
  consentedAt: timestamp('consented_at').notNull().defaultNow(),
  // Tag of the consent wording shown, see lib/marketingConsent.ts.
  consentVersion: text('consent_version').notNull(),
  optedOutAt: timestamp('opted_out_at'),
  // UI language at sign-up, so reminder emails go out in the right one.
  locale: text('locale'),
  // Account this address belongs to, when it came from signup or a logged-in
  // opt-in. Deleting the account deletes the row (and its reminders).
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  // "Time to check again" reminder emails (see lib/reminders.ts). Null
  // reminderNextAt = no reminder scheduled. Only an email, dates and counts
  // live here; never anything from the user's export.
  reminderNextAt: timestamp('reminder_next_at'),
  reminderSentCount: integer('reminder_sent_count').notNull().default(0),
  reminderLastSentAt: timestamp('reminder_last_sent_at'),
  // Last click on a reminder's link. Reminders keep going monthly only while
  // people actually use them.
  reminderEngagedAt: timestamp('reminder_engaged_at'),
  reminderOptedOutAt: timestamp('reminder_opted_out_at'),
  // Random token in every reminder's unsubscribe and open links, so those
  // links work without logging in and without exposing the email address.
  token: text('token').unique(),
  // Joined the Creator AI waitlist from a teaser.
  creatorWaitlistAt: timestamp('creator_waitlist_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [
  // The daily cron only looks at rows with a reminder scheduled.
  index('email_subscribers_reminder_next_at_idx').on(t.reminderNextAt).where(sql`${t.reminderNextAt} IS NOT NULL`),
]);

export const feedback = pgTable('feedback', {
  id: uuid('id').primaryKey().defaultRandom(),
  // Null for logged-out submissions (the widget also shows on /results, which
  // doesn't require an account).
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  sentiment: feedbackSentimentEnum('sentiment').notNull(),
  reason: text('reason'),
  comment: text('comment'),
  page: text('page').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Free-text contact messages: the /contact page's form, and the lightweight
// "quick feedback" widget on the homepage. No userId column - these come
// from logged-out visitors just as often as logged-in ones.
export const contactMessages = pgTable('contact_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  // Required by /contact's own form (client-side), but genuinely optional
  // here: the homepage widget allows an anonymous note with no reply expected.
  email: text('email'),
  message: text('message').notNull(),
  topic: text('topic'),
  // 'contact_page' | 'homepage_widget' — see ContactSource in packages/core.
  source: text('source').notNull(),
  page: text('page'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Unfollow planner progress for the weekly/daily nudge email. Counts only:
// the list of accounts never leaves the browser. One row per account and
// platform. Deleting the account deletes the rows.
export const unfollowPlans = pgTable('unfollow_plans', {
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  // 'instagram' | 'threads' | 'tiktok'
  platform: text('platform').notNull(),
  total: integer('total').notNull(),
  done: integer('done').notNull().default(0),
  perDay: integer('per_day').notNull(),
  // 'weekly' | 'daily' | 'off'
  cadence: text('cadence').notNull().default('weekly'),
  locale: text('locale'),
  nextAt: timestamp('next_at'),
  lastSentAt: timestamp('last_sent_at'),
  // Random token for the email's unsubscribe link (no login needed).
  token: text('token').notNull().unique(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [
  primaryKey({ columns: [t.userId, t.platform] }),
  index('unfollow_plans_next_at_idx').on(t.nextAt).where(sql`${t.nextAt} IS NOT NULL`),
]);
