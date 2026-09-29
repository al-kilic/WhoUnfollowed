ALTER TABLE "profiles" ADD COLUMN "lifetime_purchased_at" timestamp;
ALTER TABLE "profiles" ADD COLUMN "marketing_opt_in" boolean NOT NULL DEFAULT false;
ALTER TABLE "profiles" ADD COLUMN "marketing_opt_in_at" timestamp;
ALTER TABLE "profiles" ADD COLUMN "marketing_opt_out_at" timestamp;
ALTER TABLE "profiles" ADD COLUMN "marketing_consent_version" text;
