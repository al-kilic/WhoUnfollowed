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

export const planEnum = pgEnum('plan', ['free', 'pro', 'team', 'agency']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
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
  plan: planEnum('plan').notNull().default('free'),
  stripeCustomerId: text('stripe_customer_id'),
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
