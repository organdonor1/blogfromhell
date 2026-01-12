'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import NewspaperHeader from '../../../components/NewspaperHeader';
import ArticleList from '../../../components/ArticleList';
import NewspaperSidebar from '../../../components/NewspaperSidebar';
import HeightMatchedArticles from '../../../components/HeightMatchedArticles';
import FeaturedArticle from '../../../components/FeaturedArticle';
import Footer from '../../../components/footer';
import Pagination from '../../../components/Pagination';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { supabase } from '../../../integrations/supabase/client';

interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  type: string;
  section: string | null;
  read_time: string | null;
  created_at: string;
  image_url: string | null;
  featured: boolean | null;
  featured_home: boolean | null;
  featured_section: boolean | null;
  trending: boolean | null;
  trending_home: boolean | null;
  trending_section: boolean | null;
}

const POSTS_PER_PAGE = 10;

const sectionNames: Record<string, string> = {
  local: 'Local',
  politics: 'Politics',
  news: 'News',
  sports: 'Sports',
  entertainment: 'Entertainment',
  opinion: 'Opinion',
};

// Map section slugs to page values for ads
const sectionSlugToPage: Record<string, string> = {
  local: 'local',
  politics: 'politics',
  news: 'news',
  sports: 'sports',
  entertainment: 'entertainment',
  opinion: 'opinion',
};

function SectionPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  const sectionName = sectionNames[slug] || slug;
  
  const page = parseInt((searchParams && searchParams.get('page')) || '1', 10);
  const currentPage = isNaN(page) || page < 1 ? 1 : page;
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch featured post for this section
        const { data: featuredData, error: featuredError } = await supabase
          .from('posts')
          .select('*')
          .eq('published', true)
          .eq('section', sectionName)
          .eq('featured_section', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (featuredError) {
          console.error('Error fetching featured post:', featuredError);
        }

        if (featuredData) {
          setFeaturedPost(featuredData);
        } else {
          setFeaturedPost(null);
        }

        // Fetch trending posts for section pages
        const { data: trendingData, error: trendingError } = await supabase
          .from('posts')
          .select('*')
          .eq('published', true)
          .eq('trending_section', true)
          .order('created_at', { ascending: false })
          .limit(5);

        if (trendingError) {
          console.error('Error fetching trending posts:', trendingError);
        }

        setTrendingPosts(Array.isArray(trendingData) ? trendingData : []);

        // Fetch all posts for this section
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .eq('published', true)
          .eq('section', sectionName)
          .order('created_at', { ascending: false });

        if (postsError) {
          console.error('Error fetching posts:', postsError);
          setError('Failed to load posts');
          setPosts([]);
        } else {
          setPosts(Array.isArray(postsData) ? postsData : []);
        }
      } catch (err: any) {
        console.error('Error fetching posts:', err);
        setError(err?.message || 'An error occurred');
        setPosts([]);
        setFeaturedPost(null);
        setTrendingPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [slug, sectionName]);

  // Pagination logic - with safety checks
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  
  // Display featured post if it exists
  const displayFeatured = currentPage === 1 ? featuredPost : null;
  
  // Get trending post IDs to exclude from main list (trending articles should only appear in sidebar)
  const trendingPostIds = trendingPosts.map(p => p.id);
  
  // Filter posts for pagination: exclude featured and trending posts
  const postsToPaginate = currentPage === 1
    ? (Array.isArray(posts) ? posts.filter(p => {
        // Exclude trending posts (they appear in sidebar only)
        if (trendingPostIds.includes(p.id)) return false;
        // Always exclude featured post if it's being displayed as featured
        if (displayFeatured && p.id === displayFeatured.id) return false;
        return true;
      }) : [])
    : (Array.isArray(posts) ? posts.filter(p => {
        // Exclude trending posts on all pages
        if (trendingPostIds.includes(p.id)) return false;
        // Exclude featured post if it exists
        return displayFeatured ? (p && p.id && p.id !== displayFeatured.id) : (p && p.id);
      }) : []);
  const displayPosts = Array.isArray(postsToPaginate) ? postsToPaginate.slice(startIndex, startIndex + POSTS_PER_PAGE) : [];
  const totalPages = Math.ceil((Array.isArray(postsToPaginate) ? postsToPaginate.length : 0) / POSTS_PER_PAGE);

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <NewspaperHeader />
        <main className="container mx-auto px-4 md:px-6 py-8 max-w-6xl">
          <div className="text-center py-12 text-red-600">Error: {error}</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <NewspaperHeader />
      
      <main className="container mx-auto px-4 md:px-6 py-8 max-w-7xl">
        {/* Section Title */}
        <div className="mb-8 text-center border-b-4 border-black pb-4">
          <h1 className="text-5xl md:text-6xl font-black text-black uppercase tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
            {sectionName}
          </h1>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-600">Loading...</div>
        ) : (
          <>
            {displayFeatured && currentPage === 1 ? (
              <>
                {/* Featured article and trending sidebar in grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                  <div className="lg:col-span-2" style={{ overflow: 'hidden' }}>
                    <FeaturedArticle post={displayFeatured} />
                  </div>
                  <div className="lg:col-span-1" style={{ overflow: 'visible' }}>
                    <NewspaperSidebar trendingPosts={trendingPosts} currentPage={sectionSlugToPage[slug] || null} />
                  </div>
                </div>
                {/* Articles below featured - aligned with sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                  <div className="lg:col-span-2" style={{ position: 'relative', zIndex: 3, backgroundColor: 'white' }}>
                    <div style={{ paddingRight: '2rem', marginRight: '2rem', overflow: 'hidden', width: '100%' }}>
                      <ArticleList posts={displayPosts} showSection={false} />
                    </div>
                  </div>
                  <div className="lg:col-span-1"></div>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2" style={{ position: 'relative', zIndex: 2, backgroundColor: 'white' }}>
                  <div style={{ paddingRight: '2rem', marginRight: '2rem', overflow: 'hidden', width: '100%' }}>
                    <ArticleList posts={displayPosts} showSection={false} />
                  </div>
                </div>
                <div className="lg:col-span-1" style={{ position: 'relative', zIndex: 1, overflow: 'visible', backgroundColor: 'white' }}>
                  <NewspaperSidebar trendingPosts={trendingPosts} currentPage={sectionSlugToPage[slug] || null} />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  basePath={`/section/${slug}`}
                />
              </div>
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default function SectionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <SectionPageContent />
    </Suspense>
  );
}
