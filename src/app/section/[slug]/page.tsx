'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import NewspaperHeader from '../../../components/NewspaperHeader';
import FeaturedArticle from '../../../components/FeaturedArticle';
import ArticleList from '../../../components/ArticleList';
import NewspaperSidebar from '../../../components/NewspaperSidebar';
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
        // Fetch featured post for this section
        const { data: featuredData } = await supabase
          .from('posts')
          .select('*')
          .eq('published', true)
          .eq('section', sectionName)
          .eq('featured', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (featuredData) {
          setFeaturedPost(featuredData);
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

        // Fetch all posts for this section
        const { data: postsData } = await supabase
          .from('posts')
          .select('*')
          .eq('published', true)
          .eq('section', sectionName)
          .order('created_at', { ascending: false });

        setPosts(postsData || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchPosts();
    }
  }, [slug, sectionName]);

  // Pagination logic
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const displayFeatured = currentPage === 1 ? (featuredPost || posts[0]) : null;
  const postsToPaginate = featuredPost && currentPage === 1
    ? posts.filter(p => p.id !== featuredPost.id)
    : posts.filter(p => featuredPost ? p.id !== featuredPost.id : true);
  const displayPosts = postsToPaginate.slice(startIndex, startIndex + POSTS_PER_PAGE);
  const totalPages = Math.ceil(postsToPaginate.length / POSTS_PER_PAGE);

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
            {displayFeatured ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Main Content - Featured Article */}
                <div className="lg:col-span-2">
                  <FeaturedArticle post={displayFeatured} />
                  
                  {/* Secondary articles */}
                  {posts.length > 1 && (
                    <div className="mt-8 space-y-3 border-t-2 border-black pt-6">
                      {posts
                        .filter(p => p.id !== displayFeatured.id)
                        .slice(0, 3)
                        .map((post) => (
                          <Link
                            key={post.id}
                            href={`/post/${post.id}`}
                            className="block group"
                          >
                            <h3 className="text-xl font-black text-black group-hover:underline leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                              {post.title}
                            </h3>
                          </Link>
                        ))}
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div>
                  <NewspaperSidebar trendingPosts={trendingPosts} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <ArticleList posts={displayPosts} showSection={false} />
                </div>

                {/* Sidebar */}
                <div>
                  <NewspaperSidebar trendingPosts={trendingPosts} />
                </div>
              </div>
            )}

            {/* Article List for page 1 (below featured) or all pages */}
            {displayFeatured ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <ArticleList posts={displayPosts} showSection={false} />
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    basePath={`/section/${slug}`}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <ArticleList posts={displayPosts} showSection={false} />
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    basePath={`/section/${slug}`}
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

export default function SectionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <SectionPageContent />
    </Suspense>
  );
}
