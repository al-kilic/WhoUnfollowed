CREATE TABLE "contact_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text,
	"message" text NOT NULL,
	"topic" text,
	"source" text NOT NULL,
	"page" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
