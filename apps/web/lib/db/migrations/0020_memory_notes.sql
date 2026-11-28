-- Memory v2 phase 2A: atomic coach notes, tombstones for "Forget", and the
-- one-time backfill flag on ai_profiles.
ALTER TABLE "ai_profiles" ADD COLUMN IF NOT EXISTS "memory_v2_at" timestamp;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_notes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "type" text NOT NULL,
  "body" text NOT NULL,
  "examples" text DEFAULT '[]' NOT NULL,
  "tags" text[] DEFAULT '{}'::text[] NOT NULL,
  "source" text NOT NULL,
  "source_ref" uuid,
  "origin" text NOT NULL,
  "confidence" double precision DEFAULT 0.6 NOT NULL,
  "importance" integer DEFAULT 3 NOT NULL,
  "pinned" boolean DEFAULT false NOT NULL,
  "status" text DEFAULT 'active' NOT NULL,
  "evidence_count" integer DEFAULT 1 NOT NULL,
  "last_confirmed_at" timestamp DEFAULT now() NOT NULL,
  "last_used_at" timestamp,
  "contradicts_id" uuid,
  "superseded_by" uuid,
  "platform" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "ai_notes" ADD CONSTRAINT "ai_notes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_notes_user_status_idx" ON "ai_notes" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_notes_user_type_idx" ON "ai_notes" USING btree ("user_id","type");--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_note_tombstones" (
  "user_id" uuid NOT NULL,
  "hash" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "ai_note_tombstones_user_id_hash_pk" PRIMARY KEY("user_id","hash")
);--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "ai_note_tombstones" ADD CONSTRAINT "ai_note_tombstones_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;
