ALTER TABLE "ai_profiles" ADD COLUMN IF NOT EXISTS "posting_reminder" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_profiles" ADD COLUMN IF NOT EXISTS "posting_reminded_for" text;
