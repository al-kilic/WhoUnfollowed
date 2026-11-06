ALTER TABLE "email_subscribers" ADD COLUMN IF NOT EXISTS "wrap_next_at" timestamp;--> statement-breakpoint
ALTER TABLE "email_subscribers" ADD COLUMN IF NOT EXISTS "wrap_sent_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "email_subscribers" ADD COLUMN IF NOT EXISTS "wrap_last_sent_at" timestamp;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_subscribers_wrap_next_at_idx" ON "email_subscribers" USING btree ("wrap_next_at") WHERE "email_subscribers"."wrap_next_at" IS NOT NULL;--> statement-breakpoint
-- Backfill: everyone with reminders on gets their next 3-month anniversary of consented_at.
UPDATE "email_subscribers"
SET "wrap_next_at" = "consented_at" + make_interval(months => 3 * (((EXTRACT(YEAR FROM age(now(), "consented_at")) * 12 + EXTRACT(MONTH FROM age(now(), "consented_at")))::int / 3) + 1))
WHERE "wrap_next_at" IS NULL AND "reminder_next_at" IS NOT NULL AND "reminder_opted_out_at" IS NULL AND "opted_out_at" IS NULL;
