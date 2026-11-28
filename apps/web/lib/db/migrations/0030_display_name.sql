-- Optional name a member types in You > profile, used to greet them on Today.
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "display_name" text;
