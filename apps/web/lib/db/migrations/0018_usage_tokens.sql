-- Token counts per model call, so cache hits can be checked: uncached input,
-- output, cache reads and cache writes. Old rows keep 0.
ALTER TABLE "ai_usage_log" ADD COLUMN IF NOT EXISTS "input_tokens" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_usage_log" ADD COLUMN IF NOT EXISTS "output_tokens" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_usage_log" ADD COLUMN IF NOT EXISTS "cache_read_tokens" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_usage_log" ADD COLUMN IF NOT EXISTS "cache_write_tokens" integer DEFAULT 0 NOT NULL;
