-- Instagram's own numbers from the member's full export (stories, per-post
-- reach and saves, the account's last 90 days), worked out in the browser and
-- sent with the content history. Numbers, days and top countries/cities only.
ALTER TABLE "ai_content_stats" ADD COLUMN IF NOT EXISTS "insights" text;
