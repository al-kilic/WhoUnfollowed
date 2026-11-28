-- Memory v2 phase 1C: what Pro AI members do with coach answers (draft picked,
-- edited, hook used, thumbs). Short scrubbed text only.
CREATE TABLE IF NOT EXISTS "ai_signals" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "kind" text NOT NULL,
  "action" text NOT NULL,
  "content_log_id" uuid,
  "payload" text NOT NULL,
  "processed_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "ai_signals" ADD CONSTRAINT "ai_signals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_signals_user_idx" ON "ai_signals" USING btree ("user_id","processed_at");
