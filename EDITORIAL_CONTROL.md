# Editorial Control Guide

This document explains how to editorially control where articles appear on your site.

## How Article Placement Works

Currently, article placement is **automatic** based on flags you set in the admin panel. Here's how it works:

### 1. **Section Assignment** (Required for Section Pages)

In the admin panel, each article has a **Section** dropdown:
- **News**
- **Local**
- **Politics**
- **Sports**
- **Entertainment**
- **Opinion**
- **None** (won't appear in section pages)

**How it works:**
- Articles with a section appear on that section's page (e.g., `/section/politics`)
- Articles with "None" won't appear in any section pages
- Articles can appear on the homepage regardless of section

### 2. **Featured Article** (Main Article on Page 1)

Each article has a **Featured** toggle in the admin panel.

**How it works:**
- When enabled, the article becomes the main featured article
- **Homepage**: The most recent featured article (or first article if none) appears as the large featured article on page 1
- **Section Pages**: The most recent featured article *for that section* appears as the featured article on page 1
- Only **one** featured article shows per page (the most recent one)
- Featured articles are automatically excluded from the article list below

**Editorial Control:**
- To feature an article, simply toggle "Featured" ON
- To un-feature, toggle it OFF
- The system automatically picks the most recent featured article

### 3. **Secondary Articles** (Top Right Column)

When there's a featured article, the system automatically selects the **next 3 articles** (excluding the featured one) to appear in the secondary articles column on the right.

**How it works:**
- These are automatically selected from all published articles
- They appear in the `HeightMatchedArticles` component
- Currently, this is **automatic** - you cannot manually select which articles appear here

### 4. **Trending Articles** (Sidebar)

Each article has a **Trending** toggle in the admin panel.

**How it works:**
- When enabled, the article appears in the "Trending" sidebar
- Multiple articles can be marked as trending
- The sidebar shows up to 5 trending articles (most recent first)
- Trending articles appear on all pages (homepage and section pages)

**Editorial Control:**
- Toggle "Trending" ON to add to sidebar
- Toggle OFF to remove from sidebar

### 5. **Article List** (Main Content Area)

All published articles appear in the article list, except:
- Featured articles (automatically excluded)
- Secondary articles (automatically excluded on page 1)
- Articles are paginated (10 per page)

## Current Limitations

### What You CAN Control:
✅ Which section an article belongs to
✅ Whether an article is featured (main article)
✅ Whether an article is trending (sidebar)
✅ Whether an article is published

### What You CANNOT Currently Control:
❌ Which specific articles appear as secondary articles (top right column) - this is automatic
❌ The order of articles in the main list (currently by `created_at` date)
❌ Custom placement of articles on specific pages

## How to Editorially Control Article Placement

### To Feature an Article on Homepage:
1. Go to Admin Panel
2. Edit the article you want to feature
3. Toggle **Featured** ON
4. Make sure it's the most recent featured article (or un-feature older ones)

### To Feature an Article on a Section Page:
1. Go to Admin Panel
2. Edit the article
3. Select the appropriate **Section** (e.g., "Politics")
4. Toggle **Featured** ON
5. Make sure it's the most recent featured article for that section

### To Add Articles to Trending Sidebar:
1. Go to Admin Panel
2. Edit the articles you want in the sidebar
3. Toggle **Trending** ON for each one
4. Up to 5 most recent trending articles will appear

### To Remove an Article from Featured:
1. Go to Admin Panel
2. Edit the article
3. Toggle **Featured** OFF
4. The next most recent featured article will take its place

## Future Enhancements (Potential)

If you need more editorial control, here are some potential enhancements:

1. **Manual Secondary Article Selection**: Add a field to manually select which 3 articles appear in the secondary column
2. **Article Ordering**: Add a `display_order` or `priority` field to control article order
3. **Custom Placement**: Add fields like `show_on_homepage`, `show_on_section`, etc.
4. **Scheduled Publishing**: Add `publish_at` and `unpublish_at` dates
5. **Article Pinning**: Add a "pinned" field to keep articles at the top

## Summary

**Current System:**
- **Automatic**: Secondary articles selection, article ordering, pagination
- **Manual**: Section assignment, Featured toggle, Trending toggle, Publishing status

**To control where articles appear:**
1. Use **Section** to control which section page they appear on
2. Use **Featured** to make an article the main featured article
3. Use **Trending** to add articles to the sidebar
4. Use **Published** to show/hide articles entirely

The system automatically handles the rest (secondary articles, ordering, pagination).
