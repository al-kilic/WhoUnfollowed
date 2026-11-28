ALTER TABLE "ai_profiles" ADD COLUMN IF NOT EXISTS "goal_followers" integer;--> statement-breakpoint
ALTER TABLE "ai_profiles" ADD COLUMN IF NOT EXISTS "goal_by" timestamp;--> statement-breakpoint
ALTER TABLE "ai_profiles" ADD COLUMN IF NOT EXISTS "goal_start_followers" integer;--> statement-breakpoint
ALTER TABLE "ai_profiles" ADD COLUMN IF NOT EXISTS "goal_set_at" timestamp;--> statement-breakpoint
ALTER TABLE "ai_profiles" ADD COLUMN IF NOT EXISTS "checkin_cadence" text DEFAULT 'off' NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_profiles" ADD COLUMN IF NOT EXISTS "checkin_last_sent_at" timestamp;
