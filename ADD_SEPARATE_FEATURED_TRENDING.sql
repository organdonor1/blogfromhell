-- Add separate featured/trending fields for homepage vs section pages
-- This allows articles to be featured/trending on homepage independently from their section

ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS featured_home BOOLEAN DEFAULT false;

ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS featured_section BOOLEAN DEFAULT false;

ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS trending_home BOOLEAN DEFAULT false;

ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS trending_section BOOLEAN DEFAULT false;

-- Migrate existing data: if featured/trending is true, set both home and section to true
UPDATE posts 
SET featured_home = featured, 
    featured_section = featured,
    trending_home = trending,
    trending_section = trending
WHERE featured = true OR trending = true;

-- Add comments to explain the fields
COMMENT ON COLUMN posts.featured_home IS 'Featured on homepage';
COMMENT ON COLUMN posts.featured_section IS 'Featured on the article''s section page';
COMMENT ON COLUMN posts.trending_home IS 'Trending on homepage sidebar';
COMMENT ON COLUMN posts.trending_section IS 'Trending on section page sidebar';
