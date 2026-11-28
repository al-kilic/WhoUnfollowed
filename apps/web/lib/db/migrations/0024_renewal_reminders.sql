-- Renewal reminders (California automatic renewal law, EU/UK good practice):
-- when the Pro AI subscription started (for the yearly reminder to monthly
-- members) and which reminder was last sent (one per period / per year).
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "subscription_started_at" timestamp;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "renewal_reminder_key" text;
