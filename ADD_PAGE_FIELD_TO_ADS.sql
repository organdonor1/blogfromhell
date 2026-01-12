-- Add page/section field to ads table
-- This allows ads to be targeted to specific pages (home, news, politics, etc.)

ALTER TABLE ads 
ADD COLUMN IF NOT EXISTS page TEXT;

-- Add a comment to explain the field
COMMENT ON COLUMN ads.page IS 'Page/section where ad should appear: home, news, local, politics, sports, entertainment, opinion, or NULL for all pages';

-- Update RLS policy to include page field (if needed)
-- The existing policy should still work, but you may want to add page filtering in your queries
