-- Posted entries (and other content rows) can say which platform they were
-- for, so habit goals count posts per platform. Old rows stay null and count
-- as Instagram.
ALTER TABLE "ai_content_log" ADD COLUMN IF NOT EXISTS "platform" text;
