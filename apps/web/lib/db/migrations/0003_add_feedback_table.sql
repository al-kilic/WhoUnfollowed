CREATE TYPE "public"."feedback_sentiment" AS ENUM('angry', 'sad', 'neutral', 'happy', 'delighted');--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"sentiment" "feedback_sentiment" NOT NULL,
	"reason" text,
	"comment" text,
	"page" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
