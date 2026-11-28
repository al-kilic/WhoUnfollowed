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
  uniqueIndex,
  doublePrecision,
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
  // Optional name from You > profile; Today greets with it.
  displayName: text('display_name'),
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
  // NOT infer lifetime status from a null subscriptionExpiresAt elsewhere:
  // many accounts have a null subscriptionExpiresAt (signups are seeded with
  // subscriptionStatus 'none'; grandfathered and comped accounts are 'active'
  // with no expiry), so null expiry alone means nothing. Also doubles as the
  // "Insider since {date}" copy on /account.
  lifetimePurchasedAt: timestamp('lifetime_purchased_at'),
  // Pro AI subscription (2026-11): 'month' | 'year', and when the current paid
  // period ends. Set from Stripe subscription webhooks; null for everyone else.
  // The interval decides the monthly credit grant (100 on both).
  subscriptionInterval: text('subscription_interval'),
  currentPeriodEnd: timestamp('current_period_end'),
  // When the Pro AI subscription started (Stripe start_date), for the yearly
  // reminder to monthly members, and the last renewal reminder sent
  // ('year:<period end day>' or 'anniv:<n>'), so each goes out once.
  subscriptionStartedAt: timestamp('subscription_started_at'),
  // When a cancelled Pro AI subscription stops (Stripe cancel_at, or the period
  // end when cancel_at_period_end). Null while it renews. Access lasts until then.
  cancelAt: timestamp('cancel_at'),
  renewalReminderKey: text('renewal_reminder_key'),
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
  // "Your 3-month wrap is ready" emails (see lib/wrap). Quarters count from
  // consentedAt, per address. Same consent, token and opt-out as reminders.
  wrapNextAt: timestamp('wrap_next_at'),
  wrapSentCount: integer('wrap_sent_count').notNull().default(0),
  wrapLastSentAt: timestamp('wrap_last_sent_at'),
  // Joined the Creator AI waitlist from a teaser.
  creatorWaitlistAt: timestamp('creator_waitlist_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [
  // The daily cron only looks at rows with a reminder scheduled.
  index('email_subscribers_reminder_next_at_idx').on(t.reminderNextAt).where(sql`${t.reminderNextAt} IS NOT NULL`),
  index('email_subscribers_wrap_next_at_idx').on(t.wrapNextAt).where(sql`${t.wrapNextAt} IS NOT NULL`),
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

// ─── Pro AI (2026-11) ────────────────────────────────────────────────────────
// Everything below exists only for people who subscribed to Pro AI (or hold
// Lifetime) and finished onboarding. Free users never write here. Never stores
// follower usernames: counts, dates and the user's own words only. Every table
// cascades on account deletion.

// Onboarding answers and the AI opt-in moment.
export const aiProfiles = pgTable('ai_profiles', {
  userId: uuid('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  // 'personal' | 'creator' | 'business'
  accountType: text('account_type'),
  niche: text('niche'),
  goal: text('goal'),
  // Measurable goal (Studio > Plan > Goals): a follower target, an optional
  // deadline, and the follower count when it was set. Migration 0013.
  goalFollowers: integer('goal_followers'),
  goalBy: timestamp('goal_by'),
  goalStartFollowers: integer('goal_start_followers'),
  goalSetAt: timestamp('goal_set_at'),
  // 'followers' (goalFollowers is a follower count) | 'posts_week' (posts a
  // week) | 'per_post' (average new followers per post). Migration 0014.
  goalType: text('goal_type').notNull().default('followers'),
  // Why the user wants it, in their words; the coach sees it.
  goalNote: text('goal_note'),
  // Check-in emails: 'weekly' | 'biweekly' | 'monthly' | 'off'. Off unless the user turns them on.
  checkinCadence: text('checkin_cadence').notNull().default('off'),
  checkinLastSentAt: timestamp('checkin_last_sent_at'),
  // 0 (Sunday) to 6; null means any day.
  checkinWeekday: integer('checkin_weekday'),
  // One email a week before the deadline.
  checkinDeadlineReminder: boolean('checkin_deadline_reminder').notNull().default(false),
  deadlineRemindedAt: timestamp('deadline_reminded_at'),
  // The last 30-day plan setup answers (JSON), to prefill the next one.
  planPrefs: text('plan_prefs'),
  // You > Settings > Coach (migration 0015): draft defaults, posting days
  // ("0,2,4", 0 = Monday), best time "HH:MM", and the weekly brief email.
  defaultTone: text('default_tone'),
  defaultLength: text('default_length'),
  postingDays: text('posting_days'),
  bestTime: text('best_time'),
  briefEmail: boolean('brief_email').notNull().default(true),
  // The brief date (YYYY-MM-DD) last emailed, so each brief goes out once.
  briefSentFor: text('brief_sent_for'),
  // Posting-day reminder email (migration 0017): off unless the member turns
  // it on; the UTC date (YYYY-MM-DD) it last went out, so it sends once a day.
  postingReminder: boolean('posting_reminder').notNull().default(false),
  postingRemindedFor: text('posting_reminded_for'),
  // 'day_of' | 'day_before' (migration 0028): when the posting email goes out.
  reminderWhen: text('reminder_when').notNull().default('day_of'),
  // Plan calendar feed (migration 0028): an unguessable token in the private
  // subscribe URL; rotate replaces it, revoke clears it.
  calendarToken: text('calendar_token').unique(),
  calendarTokenAt: timestamp('calendar_token_at'),
  // Memory v2 (migration 0020): when the coach lines of memory.md were copied
  // into ai_notes. Set once; the backfill never runs twice.
  memoryV2At: timestamp('memory_v2_at'),
  // Memory v2 (migration 0021): the export the coach's tidy-up last ran for
  // (epoch seconds as text), so it runs at most once per new export, and when.
  digestForExport: text('digest_for_export'),
  digestAt: timestamp('digest_at'),
  onboardedAt: timestamp('onboarded_at'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// One editable markdown memory per account. version increments on every write
// so concurrent edits (AI add vs user edit) can be detected.
export const aiMemory = pgTable('ai_memory', {
  userId: uuid('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull().default(''),
  version: integer('version').notNull().default(1),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// What changed in memory and who changed it, for "Added to memory" and undo.
export const aiMemoryEvents = pgTable('ai_memory_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  // 'ai_add' | 'user_edit' | 'compact' | 'wipe'
  kind: text('kind').notNull(),
  summary: text('summary'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [index('ai_memory_events_user_idx').on(t.userId, t.createdAt)]);

// One row of numbers per uploaded export. Trends are computed in code.
export const aiStatsLedger = pgTable('ai_stats_ledger', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  platform: text('platform').notNull(),
  exportedAt: timestamp('exported_at').notNull(),
  // Shape: see lib/ai/stats.ts (ExportStats). Counts and dates only.
  stats: text('stats').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [uniqueIndex('ai_stats_ledger_export_uq').on(t.userId, t.platform, t.exportedAt)]);

// Results of AI actions the user may want to look back on. Never images.
export const aiContentLog = pgTable('ai_content_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  // 'read' | 'draft' | 'ideas' | 'check' | 'plan'
  kind: text('kind').notNull(),
  format: text('format'),
  topic: text('topic'),
  score: integer('score'),
  // JSON of the validated model output.
  output: text('output').notNull(),
  postedAt: timestamp('posted_at'),
  // JSON the user adds later: likes, saves, new followers.
  results: text('results'),
  // Posted entries: the platform the post went to (null = Instagram, older rows).
  platform: text('platform'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [index('ai_content_log_user_idx').on(t.userId, t.createdAt)]);

// Append-only credit ledger. Balance = sum(delta) over rows not yet expired.
// Grants carry a period_key so a retried webhook can't grant twice.
export const aiCreditLedger = pgTable('ai_credit_ledger', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  delta: integer('delta').notNull(),
  // 'grant' | 'topup' | 'spend' | 'refund' | 'expire'
  reason: text('reason').notNull(),
  // For spends and refunds: 'draft' | 'check' | 'plan' | ...
  action: text('action'),
  // For grants: which allowance, e.g. 'monthly:2026-11' or 'sub:in_123'.
  periodKey: text('period_key'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [
  index('ai_credit_ledger_user_idx').on(t.userId),
  uniqueIndex('ai_credit_ledger_grant_uq').on(t.userId, t.reason, t.periodKey).where(sql`${t.periodKey} IS NOT NULL`),
]);

// Pro AI usage allowance (migration 0023), replacing credits: grants in USD
// of our real AI cost, charged from what each call cost (ai_usage_log).
// kind: 'month' (one per billing month, period_key) | 'refill' (source = the
// Stripe session, expires 12 months) | 'gift' (early Lifetime, never expires)
// | 'trial' (old one-time Pro, never expires). See lib/ai/allowance.ts.
export const aiAllowance = pgTable('ai_allowance', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  kind: text('kind').notNull(),
  usd: doublePrecision('usd').notNull(),
  usedUsd: doublePrecision('used_usd').notNull().default(0),
  periodKey: text('period_key'),
  source: text('source'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [
  index('ai_allowance_user_idx').on(t.userId),
  uniqueIndex('ai_allowance_period_uq').on(t.userId, t.periodKey).where(sql`${t.periodKey} IS NOT NULL`),
  uniqueIndex('ai_allowance_source_uq').on(t.source).where(sql`${t.source} IS NOT NULL`),
]);

// Goals per platform (Studio > Plan > Goals): one per member and platform.
// type 'followers' (target = follower count) | 'posts_week' | 'per_post'.
// Check-in options stay per member on ai_profiles. See lib/ai/goals.ts.
export const aiGoals = pgTable('ai_goals', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  platform: text('platform').notNull(),
  type: text('type').notNull().default('followers'),
  target: integer('target').notNull(),
  by: timestamp('by'),
  startFollowers: integer('start_followers').notNull().default(0),
  setAt: timestamp('set_at').notNull().defaultNow(),
  note: text('note'),
  deadlineRemindedAt: timestamp('deadline_reminded_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (t) => [uniqueIndex('ai_goals_user_platform_uq').on(t.userId, t.platform)]);

// What each model call actually cost us, in USD, one row per call (retries and
// failed calls included, because they are billed too). Holds no prompts or
// answers. Feeds the daily spend caps in lib/ai/spendCap.ts.
// Memory v2 (phase 1C): what Pro AI members did with the coach's answers
// (picked a draft, edited it, used a hook, thumbs). Short text only, handles
// scrubbed. Rows are turned into memory later and deleted 90 days after.
export const aiSignals = pgTable('ai_signals', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  kind: text('kind').notNull(),
  action: text('action').notNull(),
  contentLogId: uuid('content_log_id'),
  payload: text('payload').notNull(),
  processedAt: timestamp('processed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [
  index('ai_signals_user_idx').on(t.userId, t.processedAt),
]);

// Memory v2 (migration 0020): what the coach knows about a member, one short
// fact per row, with where it came from and how sure it is. Nothing is deleted
// except by "Forget", which leaves a tombstone (a hash, no text) so the same
// idea is never learned again. See .claude/reference/memory-v2-spec.md.
export const aiNotes = pgTable('ai_notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  // 'fact' | 'like' | 'dislike' | 'voice' | 'what_worked' | 'what_didnt' |
  // 'audience' | 'photo' | 'goal' | 'context' | 'rollup' | 'ack'
  type: text('type').notNull(),
  body: text('body').notNull(),
  // JSON array, at most 3 of {text?, before?, after?}.
  examples: text('examples').notNull().default('[]'),
  tags: text('tags').array().notNull().default(sql`'{}'::text[]`),
  // 'onboarding' | 'user' | 'read' | 'draft' | 'check' | 'ideas' | 'chat' |
  // 'plan' | 'insights' | 'digest' | 'signals' | 'export' | 'backfill'
  source: text('source').notNull(),
  sourceRef: uuid('source_ref'),
  // 'user' | 'coach' | 'code'
  origin: text('origin').notNull(),
  confidence: doublePrecision('confidence').notNull().default(0.6),
  importance: integer('importance').notNull().default(3),
  pinned: boolean('pinned').notNull().default(false),
  // 'active' | 'disputed' | 'faded' | 'archived'
  status: text('status').notNull().default('active'),
  evidenceCount: integer('evidence_count').notNull().default(1),
  lastConfirmedAt: timestamp('last_confirmed_at').notNull().defaultNow(),
  lastUsedAt: timestamp('last_used_at'),
  contradictsId: uuid('contradicts_id'),
  supersededBy: uuid('superseded_by'),
  platform: text('platform'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (t) => [
  index('ai_notes_user_status_idx').on(t.userId, t.status),
  index('ai_notes_user_type_idx').on(t.userId, t.type),
]);

// "Forget" leaves only this: a hash of the normalised note text.
export const aiNoteTombstones = pgTable('ai_note_tombstones', {
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  hash: text('hash').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [primaryKey({ columns: [t.userId, t.hash] })]);

// Memory v2 (migration 0021): when Today showed each blind spot, and what the
// member answered. One row per key. Numbers only; the card text is built in
// the browser from the member's own export.
export const aiBlindspots = pgTable('ai_blindspots', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  detector: text('detector').notNull(),
  key: text('key').notNull(),
  // 'open' | 'dismissed' (I know) | 'done' | 'expired'
  status: text('status').notNull().default('open'),
  isCurrent: boolean('is_current').notNull().default(false),
  // The export it was first shown for (epoch seconds as text).
  dataKey: text('data_key'),
  shownCount: integer('shown_count').notNull().default(0),
  firstSeenAt: timestamp('first_seen_at'),
  lastShownAt: timestamp('last_shown_at'),
  snoozeUntil: timestamp('snooze_until'),
  resolvedAt: timestamp('resolved_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [uniqueIndex('ai_blindspots_user_key_uq').on(t.userId, t.key)]);

// The weekly "what your coach learned" note: built from that week's memory
// events and notes, no model call. lines is JSON of {kind, text, noteId?}.
export const aiLearnedNotes = pgTable('ai_learned_notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  weekKey: text('week_key').notNull(),
  lines: text('lines').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  seenAt: timestamp('seen_at'),
}, (t) => [uniqueIndex('ai_learned_notes_user_week_uq').on(t.userId, t.weekKey)]);

// How the member writes, from their own captions (numbers plus at most 12
// short, scrubbed examples the member chose to share).
export const aiVoice = pgTable('ai_voice', {
  userId: uuid('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  stats: text('stats').notNull(),
  exemplars: text('exemplars').notNull().default('[]'),
  // 'export' | 'onboarding' | 'edits'
  source: text('source').notNull().default('export'),
  captionCount: integer('caption_count').notNull().default(0),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// The content history numbers from the latest export, one row per platform.
export const aiContentStats = pgTable('ai_content_stats', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  platform: text('platform').notNull(),
  stats: text('stats').notNull(),
  // JSON of AiInsightsStats (Instagram's own numbers from the export), or null.
  insights: text('insights'),
  computedAt: timestamp('computed_at').notNull().defaultNow(),
}, (t) => [uniqueIndex('ai_content_stats_user_platform_uq').on(t.userId, t.platform)]);

// Key moments the exports show (best month, spikes, quiet months, sprees,
// drops). Numbers and 'YYYY-MM(-DD)' dates only.
export const aiMoments = pgTable('ai_moments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  platform: text('platform').notNull(),
  kind: text('kind').notNull(),
  at: text('at').notNull(),
  params: text('params').notNull().default('{}'),
  // 'export' | 'log'
  source: text('source').notNull().default('export'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [uniqueIndex('ai_moments_user_kind_at_uq').on(t.userId, t.platform, t.kind, t.at)]);

export const aiUsageLog = pgTable('ai_usage_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  action: text('action').notNull(),
  model: text('model').notNull(),
  costUsd: doublePrecision('cost_usd').notNull(),
  // Token counts (migration 0018): uncached input, output, cache reads and writes.
  inputTokens: integer('input_tokens').notNull().default(0),
  outputTokens: integer('output_tokens').notNull().default(0),
  cacheReadTokens: integer('cache_read_tokens').notNull().default(0),
  cacheWriteTokens: integer('cache_write_tokens').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [
  index('ai_usage_log_user_idx').on(t.userId, t.createdAt),
  index('ai_usage_log_created_idx').on(t.createdAt),
]);
