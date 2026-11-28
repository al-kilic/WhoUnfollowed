-- Pro AI usage allowance (replaces credits): grants in USD of our real AI
-- cost. A month grant per billing month, refills, the early Lifetime gift and
-- the old-Pro trial. Usage is charged against them from ai_usage_log costs.
CREATE TABLE IF NOT EXISTS "ai_allowance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
	"kind" text NOT NULL,
	"usd" double precision NOT NULL,
	"used_usd" double precision DEFAULT 0 NOT NULL,
	"period_key" text,
	"source" text,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_allowance_user_idx" ON "ai_allowance" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ai_allowance_period_uq" ON "ai_allowance" USING btree ("user_id","period_key") WHERE "period_key" IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ai_allowance_source_uq" ON "ai_allowance" USING btree ("source") WHERE "source" IS NOT NULL;
