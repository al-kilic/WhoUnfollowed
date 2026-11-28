ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "subscription_interval" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "current_period_end" timestamp;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL REFERENCES "users"("id") ON DELETE cascade,
	"account_type" text,
	"niche" text,
	"goal" text,
	"onboarded_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_memory" (
	"user_id" uuid PRIMARY KEY NOT NULL REFERENCES "users"("id") ON DELETE cascade,
	"content" text DEFAULT '' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_memory_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
	"kind" text NOT NULL,
	"summary" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_memory_events_user_idx" ON "ai_memory_events" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_stats_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
	"platform" text NOT NULL,
	"exported_at" timestamp NOT NULL,
	"stats" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ai_stats_ledger_export_uq" ON "ai_stats_ledger" USING btree ("user_id","platform","exported_at");--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_content_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
	"kind" text NOT NULL,
	"format" text,
	"topic" text,
	"score" integer,
	"output" text NOT NULL,
	"posted_at" timestamp,
	"results" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_content_log_user_idx" ON "ai_content_log" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_credit_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
	"delta" integer NOT NULL,
	"reason" text NOT NULL,
	"action" text,
	"period_key" text,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_credit_ledger_user_idx" ON "ai_credit_ledger" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ai_credit_ledger_grant_uq" ON "ai_credit_ledger" USING btree ("user_id","reason","period_key") WHERE "ai_credit_ledger"."period_key" IS NOT NULL;
