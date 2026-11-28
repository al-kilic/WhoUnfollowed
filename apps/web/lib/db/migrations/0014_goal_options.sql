ALTER TABLE "ai_profiles" ADD COLUMN IF NOT EXISTS "goal_type" text DEFAULT 'followers' NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_profiles" ADD COLUMN IF NOT EXISTS "goal_note" text;--> statement-breakpoint
ALTER TABLE "ai_profiles" ADD COLUMN IF NOT EXISTS "checkin_weekday" integer;--> statement-breakpoint
ALTER TABLE "ai_profiles" ADD COLUMN IF NOT EXISTS "checkin_deadline_reminder" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_profiles" ADD COLUMN IF NOT EXISTS "deadline_reminded_at" timestamp;--> statement-breakpoint
ALTER TABLE "ai_profiles" ADD COLUMN IF NOT EXISTS "plan_prefs" text;
