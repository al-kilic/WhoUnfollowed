CREATE TABLE IF NOT EXISTS "ai_usage_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
	"action" text NOT NULL,
	"model" text NOT NULL,
	"cost_usd" double precision NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_usage_log_user_idx" ON "ai_usage_log" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_usage_log_created_idx" ON "ai_usage_log" USING btree ("created_at");
