ALTER TABLE "email_subscribers" ADD COLUMN "locale" text;--> statement-breakpoint
ALTER TABLE "email_subscribers" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "email_subscribers" ADD COLUMN "reminder_next_at" timestamp;--> statement-breakpoint
ALTER TABLE "email_subscribers" ADD COLUMN "reminder_sent_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "email_subscribers" ADD COLUMN "reminder_last_sent_at" timestamp;--> statement-breakpoint
ALTER TABLE "email_subscribers" ADD COLUMN "reminder_engaged_at" timestamp;--> statement-breakpoint
ALTER TABLE "email_subscribers" ADD COLUMN "reminder_opted_out_at" timestamp;--> statement-breakpoint
ALTER TABLE "email_subscribers" ADD COLUMN "token" text;--> statement-breakpoint
ALTER TABLE "email_subscribers" ADD COLUMN "creator_waitlist_at" timestamp;--> statement-breakpoint
ALTER TABLE "email_subscribers" ADD CONSTRAINT "email_subscribers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_subscribers" ADD CONSTRAINT "email_subscribers_token_unique" UNIQUE("token");--> statement-breakpoint
CREATE INDEX "email_subscribers_reminder_next_at_idx" ON "email_subscribers" ("reminder_next_at") WHERE "reminder_next_at" IS NOT NULL;
