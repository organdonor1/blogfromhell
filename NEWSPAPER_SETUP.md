# Newspaper Layout Setup Guide

## Database Changes Required

You need to add the following columns to your `posts` table in Supabase:

1. **`section`** (TEXT, nullable)
   - Values: "News", "Local", "Sports", "Entertainment", "Opinion", or NULL
   - Used to categorize articles into sections

2. **`featured`** (BOOLEAN, nullable, default: false)
   - Marks articles to appear as the main featured article on homepage/section pages
   - Only one featured article should be active per section/homepage

3. **`trending`** (BOOLEAN, nullable, default: false)
   - Marks articles to appear in the "Trending" sidebar
   - Multiple articles can be marked as trending

### SQL to Add Columns

Run this in your Supabase SQL Editor:

```sql
-- Add section column
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS section TEXT;

-- Add featured column
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Add trending column
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS trending BOOLEAN DEFAULT false;
```

## Features Implemented

### 1. Newspaper-Style Header
- Masthead with site name and tagline
- Date display
- Navigation bar with sections: News, Local, Sports, Entertainment, Opinion

### 2. Homepage Layout
- **Page 1**: Featured article (large image + headline) + sidebar with trending articles
- **Page 2+**: Article list only (no featured layout)
- Pagination using URL query parameters (`?page=2`)

### 3. Section Pages
- Each section (Sports, Entertainment, etc.) has its own page
- URL format: `/section/sports`, `/section/entertainment`, etc.
- Same layout as homepage: featured article on page 1, list on subsequent pages

### 4. Admin Panel Updates
- Added "Section" dropdown (News, Local, Sports, Entertainment, Opinion, or None)
- Added "Featured" toggle (shows as main article)
- Added "Trending" toggle (shows in sidebar)

### 5. Sidebar
- "Trending" section showing articles marked as trending
- Ad space placeholder (you can add your own ads here)

## How to Use

1. **Create Articles with Sections**:
   - In admin panel, select a section for each article
   - Articles without a section won't appear in section pages

2. **Mark Featured Articles**:
   - Toggle "Featured" for the main article you want to highlight
   - Only one featured article will show per page (most recent)

3. **Mark Trending Articles**:
   - Toggle "Trending" for articles to appear in sidebar
   - Multiple articles can be trending

4. **Add Ads**:
   - Edit `src/components/NewspaperSidebar.tsx`
   - Replace the ad space placeholder with your ad HTML/images

## Reverting to Old Layout

A backup branch `backup-blog-layout` has been created with the original blog layout. To revert:

```bash
git checkout backup-blog-layout
```

Or switch back to main and restore specific files from that branch.

## Notes

- The old `type` field (fiction/news) is still available but not used in the newspaper layout
- Pagination uses URL query parameters (`?page=2`) instead of separate routes
- Featured articles are excluded from the regular article list
- Section pages filter articles by the `section` field
