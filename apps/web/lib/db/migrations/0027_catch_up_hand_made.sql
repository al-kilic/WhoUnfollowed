-- Catch-up: these were added to production by hand (June 2026: email
-- verification, password reset, the 'none' plan status) and never got a
-- migration, so a fresh database (staging, e2e tests, a new install) could
-- not sign anyone up. Every statement is a no-op where it already exists.
ALTER TYPE "subscription_status" ADD VALUE IF NOT EXISTS 'none';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email_verified_at" timestamp;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_verifications" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"code_hash" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "email_verifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade
);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "password_resets" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "password_resets_token_hash_unique" UNIQUE("token_hash"),
	CONSTRAINT "password_resets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade
);
