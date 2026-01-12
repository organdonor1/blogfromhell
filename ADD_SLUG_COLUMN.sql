-- Add slug column to posts table
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Generate slugs for existing posts from their titles
UPDATE posts 
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(title, '[^a-zA-Z0-9\s]', '', 'g'),
      '\s+', '-', 'g'
    ),
    '-+', '-', 'g'
  )
)
WHERE slug IS NULL OR slug = '';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);

-- Add unique constraint to prevent duplicate slugs
-- Note: You may need to handle duplicates manually if they exist
-- ALTER TABLE posts ADD CONSTRAINT unique_slug UNIQUE (slug);
