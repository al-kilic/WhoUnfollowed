-- Goals per platform (Studio > Plan > Goals): one goal per member and
-- platform (Instagram, Threads, TikTok). Check-in options stay per member on
-- ai_profiles, so one email covers every goal. The old single goal on
-- ai_profiles is copied over once, to the platform the member uploaded most
-- recently (Instagram if none); those columns stay but are no longer read.
CREATE TABLE IF NOT EXISTS "ai_goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
	"platform" text NOT NULL,
	"type" text DEFAULT 'followers' NOT NULL,
	"target" integer NOT NULL,
	"by" timestamp,
	"start_followers" integer DEFAULT 0 NOT NULL,
	"set_at" timestamp DEFAULT now() NOT NULL,
	"note" text,
	"deadline_reminded_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ai_goals_user_platform_uq" ON "ai_goals" USING btree ("user_id","platform");--> statement-breakpoint
INSERT INTO "ai_goals" ("user_id", "platform", "type", "target", "by", "start_followers", "set_at", "note", "deadline_reminded_at")
SELECT p."user_id",
	COALESCE((SELECT l."platform" FROM "ai_stats_ledger" l WHERE l."user_id" = p."user_id" ORDER BY l."exported_at" DESC LIMIT 1), 'instagram'),
	COALESCE(p."goal_type", 'followers'), p."goal_followers", p."goal_by", COALESCE(p."goal_start_followers", 0), p."goal_set_at", p."goal_note", p."deadline_reminded_at"
FROM "ai_profiles" p
WHERE p."goal_followers" IS NOT NULL AND p."goal_set_at" IS NOT NULL
ON CONFLICT ("user_id", "platform") DO NOTHING;
