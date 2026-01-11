'use client';

import { Suspense } from 'react';
import NewspaperHeader from '../components/NewspaperHeader';
import ArticleList from '../components/ArticleList';
import NewspaperSidebar from '../components/NewspaperSidebar';
import HeightMatchedArticles from '../components/HeightMatchedArticles';
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
        // Fetch featured post
        const { data: featuredData, error: featuredError } = await supabase
          .from('posts')
          .select('*')
          .eq('published', true)
          .eq('featured', true)
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

        setTrendingPosts(trendingData || []);

        // Fetch regular posts (exclude featured)
        const { data: postsData } = await supabase
          .from('posts')
          .select('*')
          .eq('published', true)
          .neq('featured', true)
          .order('created_at', { ascending: false });

        setPosts(postsData || []);
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
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  // If no featured post, use the first post
  const displayFeatured = currentPage === 1 ? (featuredPost || (posts.length > 0 ? posts[0] : null)) : null;
  const postsToPaginate = featuredPost && currentPage === 1 
    ? posts.filter(p => p.id !== featuredPost.id)
    : posts.filter(p => featuredPost ? p.id !== featuredPost.id : true);
  const displayPosts = postsToPaginate.slice(startIndex, startIndex + POSTS_PER_PAGE);
  const secondaryPosts = displayFeatured 
    ? posts.filter(p => p.id !== displayFeatured.id).slice(0, 3)
    : [];

  return (
    <div className="min-h-screen bg-white">
      <NewspaperHeader />
      
      <main className="container mx-auto px-4 md:px-6 py-8 max-w-7xl">
        {isLoading ? (
          <div className="text-center py-12 text-gray-600">Loading...</div>
        ) : (
          <>
            {displayFeatured && secondaryPosts.length > 0 ? (
              <HeightMatchedArticles 
                featuredPost={displayFeatured} 
                secondaryPosts={secondaryPosts}
              />
            ) : displayFeatured ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2">
                  <ArticleList posts={displayPosts} />
                </div>
                <div>
                  <NewspaperSidebar trendingPosts={trendingPosts} />
                </div>
              </div>
            ) : null}

            {displayFeatured ? (
              <div>
                <ArticleList posts={displayPosts} />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  basePath="/"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <ArticleList posts={displayPosts} />
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    basePath="/"
                  />
                </div>
                <div>
                  <NewspaperSidebar trendingPosts={trendingPosts} />
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
