import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  customType,
} from 'drizzle-orm/pg-core';

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
