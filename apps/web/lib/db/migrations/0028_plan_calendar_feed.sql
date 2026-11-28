-- Plan calendar feed and reminder timing (Studio > Plan, You > Settings).
ALTER TABLE "ai_profiles" ADD COLUMN IF NOT EXISTS "reminder_when" text DEFAULT 'day_of' NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_profiles" ADD COLUMN IF NOT EXISTS "calendar_token" text;--> statement-breakpoint
ALTER TABLE "ai_profiles" ADD COLUMN IF NOT EXISTS "calendar_token_at" timestamp;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ai_profiles_calendar_token_unique" ON "ai_profiles" ("calendar_token");
