'use client';

import { Suspense } from 'react';
import NewspaperHeader from '../components/NewspaperHeader';
import ArticleList from '../components/ArticleList';
import NewspaperSidebar from '../components/NewspaperSidebar';
import HeightMatchedArticles from '../components/HeightMatchedArticles';
import FeaturedArticle from '../components/FeaturedArticle';
import Footer from '../components/footer';
import Pagination from '../components/Pagination';
import { supabase } from '../integrations/supabase/client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

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
  trending: boolean | null;
}

const POSTS_PER_PAGE = 10;

function IndexContent() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = isNaN(page) || page < 1 ? 1 : page;
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        // Fetch featured post for homepage
        const { data: featuredData, error: featuredError } = await supabase
          .from('posts')
          .select('*')
          .eq('published', true)
          .eq('featured_home', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!featuredError && featuredData) {
          setFeaturedPost(featuredData);
        } else {
          setFeaturedPost(null);
        }

        // Fetch trending posts
        const { data: trendingData } = await supabase
          .from('posts')
          .select('*')
          .eq('published', true)
          .eq('trending', true)
          .order('created_at', { ascending: false })
          .limit(5);

        setTrendingPosts(Array.isArray(trendingData) ? trendingData : []);

        // Fetch all published posts (don't exclude featured - they'll show in both places)
        const { data: postsData } = await supabase
          .from('posts')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });

        setPosts(Array.isArray(postsData) ? postsData : []);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Pagination logic
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;

  // If no featured post, use the first post
  const displayFeatured = currentPage === 1 ? (featuredPost || (posts.length > 0 ? posts[0] : null)) : null;
  // Get secondary posts from all posts, excluding featured
  const secondaryPosts = displayFeatured 
    ? posts.filter(p => p && p.id && displayFeatured && p.id !== displayFeatured.id).slice(0, 3)
    : [];
  // Get secondary post IDs to exclude from main list
  const secondaryPostIds = secondaryPosts.map(p => p.id);
  // Filter posts for pagination: exclude secondary posts (but keep featured and trending in the list)
  // All articles show in the main list by default, featured/trending just control placement
  const postsToPaginate = currentPage === 1
    ? posts.filter(p => {
        // Only exclude secondary posts (the 3 articles shown in the right column)
        // Featured and trending articles still appear in the main list
        if (secondaryPostIds.includes(p.id)) return false;
        return true;
      })
    : posts.filter(p => {
        // On page 2+, exclude featured post if it exists
        return featuredPost ? p.id !== featuredPost.id : true;
      });
  const displayPosts = postsToPaginate.slice(startIndex, startIndex + POSTS_PER_PAGE);
  const totalPages = Math.ceil(postsToPaginate.length / POSTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-white">
      <NewspaperHeader />
      
      <main className="container mx-auto px-4 md:px-6 py-8 max-w-7xl">
        {isLoading ? (
          <div className="text-center py-12 text-gray-600">Loading...</div>
        ) : (
          <>
            {displayFeatured && secondaryPosts && secondaryPosts.length > 0 ? (
              <>
                <HeightMatchedArticles 
                  featuredPost={displayFeatured} 
                  secondaryPosts={secondaryPosts}
                  trendingPosts={trendingPosts}
                  currentPage="home"
                />
                {/* Articles below featured */}
                <div className="mt-8">
                  <ArticleList posts={displayPosts} />
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    basePath="/"
                  />
                </div>
              </>
            ) : displayFeatured ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                  <div className="lg:col-span-2" style={{ position: 'relative', zIndex: 2 }}>
                    <FeaturedArticle post={displayFeatured} />
                  </div>
                  <div style={{ position: 'relative', zIndex: 1, overflow: 'hidden', backgroundColor: 'white' }}>
                    <NewspaperSidebar trendingPosts={trendingPosts} currentPage="home" />
                  </div>
                </div>
                {/* Articles below featured - in grid with empty sidebar column to align */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 relative">
                  <div className="lg:col-span-2" style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ overflow: 'hidden', width: '100%' }}>
                      <ArticleList posts={displayPosts} />
                    </div>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      basePath="/"
                    />
                  </div>
                  <div className="lg:col-span-1" style={{ position: 'relative', zIndex: 3, backgroundColor: 'white', paddingLeft: '2rem', marginLeft: '-2rem' }}></div>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2" style={{ position: 'relative', zIndex: 2, overflow: 'hidden' }}>
                  <ArticleList posts={displayPosts} />
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    basePath="/"
                  />
                </div>
                <div style={{ position: 'relative', zIndex: 1, overflow: 'hidden', backgroundColor: 'white' }}>
                  <NewspaperSidebar trendingPosts={trendingPosts} currentPage="home" />
                </div>
              </div>
            )}
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default function Index() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <IndexContent />
    </Suspense>
  );
}
