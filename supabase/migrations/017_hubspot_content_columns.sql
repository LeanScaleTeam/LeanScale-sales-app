-- Add blog_posts and knowledge_articles columns to hubspot_metadata
-- These were added to the downloader in commit 1a77795 but the migration was missed

ALTER TABLE hubspot_metadata
  ADD COLUMN IF NOT EXISTS blog_posts JSONB,
  ADD COLUMN IF NOT EXISTS knowledge_articles JSONB;
