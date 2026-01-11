'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import NewspaperHeader from '../../../components/NewspaperHeader';
import ArticleList from '../../../components/ArticleList';
import NewspaperSidebar from '../../../components/NewspaperSidebar';
import HeightMatchedArticles from '../../../components/HeightMatchedArticles';
import Footer from '../../../components/footer';
import Pagination from '../../../components/Pagination';
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
  trending: boolean | null;
}

const POSTS_PER_PAGE = 10;

const sectionNames: Record<string, string> = {
  news: 'News',
  local: 'Local',
  politics: 'Politics',
  sports: 'Sports',
  entertainment: 'Entertainment',
  opinion: 'Opinion',
};

function SectionPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  const sectionName = sectionNames[slug] || slug;
  
  const page = parseInt(searchParams?.get('page') || '1', 10);
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
          .eq('featured', true)
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

        // Fetch trending posts
        const { data: trendingData, error: trendingError } = await supabase
          .from('posts')
          .select('*')
          .eq('published', true)
          .eq('trending', true)
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

  // Pagination logic
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const displayFeatured = currentPage === 1 ? (featuredPost || (posts.length > 0 ? posts[0] : null)) : null;
  const postsToPaginate = featuredPost && currentPage === 1
    ? posts.filter(p => p && p.id !== featuredPost.id)
    : posts.filter(p => featuredPost ? (p && p.id !== featuredPost.id) : true);
  const displayPosts = postsToPaginate.slice(startIndex, startIndex + POSTS_PER_PAGE);
  const totalPages = Math.ceil(postsToPaginate.length / POSTS_PER_PAGE);
  const secondaryPosts = displayFeatured ? posts.filter(p => p && p.id !== displayFeatured.id).slice(0, 3) : [];

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <NewspaperHeader />
        <main className="container mx-auto px-4 md:px-6 py-8 max-w-7xl">
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
            {displayFeatured && secondaryPosts && secondaryPosts.length > 0 && currentPage === 1 ? (
              <>
                <HeightMatchedArticles 
                  featuredPost={displayFeatured} 
                  secondaryPosts={secondaryPosts}
                />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                  <div className="lg:col-span-2">
                    <ArticleList posts={displayPosts} showSection={false} />
                  </div>
                  <div>
                    <NewspaperSidebar trendingPosts={trendingPosts} />
                  </div>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2">
                  <ArticleList posts={displayPosts} showSection={false} />
                </div>
                <div>
                  <NewspaperSidebar trendingPosts={trendingPosts} />
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
