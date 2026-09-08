ALTER TABLE "profiles" ADD COLUMN "locale" text;
ALTER TABLE "profiles" ADD COLUMN "expiry_reminder_sent_at" timestamp;
ALTER TABLE "profiles" ADD COLUMN "expired_email_sent_at" timestamp;
