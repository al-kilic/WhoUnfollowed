CREATE TABLE "unfollow_plans" (
	"user_id" uuid NOT NULL,
	"platform" text NOT NULL,
	"total" integer NOT NULL,
	"done" integer DEFAULT 0 NOT NULL,
	"per_day" integer NOT NULL,
	"cadence" text DEFAULT 'weekly' NOT NULL,
	"locale" text,
	"next_at" timestamp,
	"last_sent_at" timestamp,
	"token" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unfollow_plans_user_id_platform_pk" PRIMARY KEY("user_id","platform"),
	CONSTRAINT "unfollow_plans_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "unfollow_plans" ADD CONSTRAINT "unfollow_plans_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "unfollow_plans_next_at_idx" ON "unfollow_plans" ("next_at") WHERE "next_at" IS NOT NULL;
