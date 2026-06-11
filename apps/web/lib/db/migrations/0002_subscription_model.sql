-- Drop old plan enum and replace profiles table with new subscription model

-- 1. Create new enum
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'grace', 'cancelled');

-- 2. Add new columns to profiles
ALTER TABLE "profiles"
  ADD COLUMN "subscription_status" "subscription_status" NOT NULL DEFAULT 'active',
  ADD COLUMN "stripe_subscription_id" text,
  ADD COLUMN "grace_period_ends_at" timestamp;

-- 3. Drop old plan column
ALTER TABLE "profiles" DROP COLUMN IF EXISTS "plan";

-- 4. Drop old plan enum
DROP TYPE IF EXISTS "public"."plan";
