-- Memory v2 phase 2E: blind-spot cadence state (moved from the browser for
-- Pro AI), the weekly "what your coach learned" note, the voice profile, the
-- content history numbers, export moments, and the once-per-export digest flag.
ALTER TABLE "ai_profiles" ADD COLUMN IF NOT EXISTS "digest_for_export" text;--> statement-breakpoint
ALTER TABLE "ai_profiles" ADD COLUMN IF NOT EXISTS "digest_at" timestamp;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_blindspots" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "detector" text NOT NULL,
  "key" text NOT NULL,
  "status" text DEFAULT 'open' NOT NULL,
  "is_current" boolean DEFAULT false NOT NULL,
  "data_key" text,
  "shown_count" integer DEFAULT 0 NOT NULL,
  "first_seen_at" timestamp,
  "last_shown_at" timestamp,
  "snooze_until" timestamp,
  "resolved_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "ai_blindspots" ADD CONSTRAINT "ai_blindspots_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ai_blindspots_user_key_uq" ON "ai_blindspots" USING btree ("user_id","key");--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_learned_notes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "week_key" text NOT NULL,
  "lines" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "seen_at" timestamp
);--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "ai_learned_notes" ADD CONSTRAINT "ai_learned_notes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ai_learned_notes_user_week_uq" ON "ai_learned_notes" USING btree ("user_id","week_key");--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_voice" (
  "user_id" uuid PRIMARY KEY NOT NULL,
  "stats" text NOT NULL,
  "exemplars" text DEFAULT '[]' NOT NULL,
  "source" text DEFAULT 'export' NOT NULL,
  "caption_count" integer DEFAULT 0 NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "ai_voice" ADD CONSTRAINT "ai_voice_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_content_stats" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "platform" text NOT NULL,
  "stats" text NOT NULL,
  "computed_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "ai_content_stats" ADD CONSTRAINT "ai_content_stats_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ai_content_stats_user_platform_uq" ON "ai_content_stats" USING btree ("user_id","platform");--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_moments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "platform" text NOT NULL,
  "kind" text NOT NULL,
  "at" text NOT NULL,
  "params" text DEFAULT '{}' NOT NULL,
  "source" text DEFAULT 'export' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "ai_moments" ADD CONSTRAINT "ai_moments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ai_moments_user_kind_at_uq" ON "ai_moments" USING btree ("user_id","platform","kind","at");
