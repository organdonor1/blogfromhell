'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FeaturedArticle from './FeaturedArticle';
import SecondaryArticleCard from './SecondaryArticleCard';
import NewspaperSidebar from './NewspaperSidebar';

interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  image_url: string | null;
  section: string | null;
  created_at: string;
  read_time: string | null;
}

interface HeightMatchedArticlesProps {
  featuredPost: Post;
  secondaryPosts: Post[];
  trendingPosts?: Post[];
  currentPage?: string | null;
}

export default function HeightMatchedArticles({ featuredPost, secondaryPosts, trendingPosts = [], currentPage = null, sidebarOnly = false }: HeightMatchedArticlesProps) {
  const featuredRef = useRef<HTMLDivElement>(null);
  const secondaryRef = useRef<HTMLDivElement>(null);
  const [matchedHeight, setMatchedHeight] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const lastValidPostsRef = useRef<Post[]>([]);

  // Memoize posts to show to prevent recalculation, but preserve last valid value
  const postsToShow = useMemo(() => {
    if (!secondaryPosts || secondaryPosts.length === 0) {
      // Return last valid posts if we had them, otherwise empty array
      return lastValidPostsRef.current.length > 0 ? lastValidPostsRef.current : [];
    }
    const result = secondaryPosts.slice(0, 3);
    // Store valid result
    if (result.length > 0) {
      lastValidPostsRef.current = result;
    }
    return result;
  }, [secondaryPosts]);

  // Safety check
  if (!featuredPost) {
    return null;
  }
  
  // If we have posts to show (either current or from ref), render them
  if (postsToShow.length === 0) {
    return null;
  }
  
  console.log('HeightMatchedArticles rendering with postsToShow:', postsToShow.length, postsToShow.map(p => p.title));

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined' || sidebarOnly) return;

    const updateHeight = () => {
      try {
        if (!featuredRef.current || !secondaryRef.current) return;
        if (window.innerWidth < 1024) {
          setMatchedHeight(null);
          if (secondaryRef.current) {
            secondaryRef.current.style.height = '';
            secondaryRef.current.style.maxHeight = '';
            secondaryRef.current.style.overflow = '';
          }
          return;
        }

        // Measure the actual content height of the featured article
        const featuredArticle = featuredRef.current.querySelector('article') as HTMLElement;
        if (!featuredArticle) return;

        const featuredHeight = featuredArticle.offsetHeight;
        
        if (featuredHeight > 0) {
          setMatchedHeight(featuredHeight);
          // Don't set any height constraints - let the container grow naturally
          // This allows the ad to display fully without being cut off
          if (secondaryRef.current) {
            secondaryRef.current.style.height = 'auto';
            secondaryRef.current.style.maxHeight = 'none';
            secondaryRef.current.style.overflow = 'visible';
            secondaryRef.current.style.minHeight = 'auto';
          }
        }
      } catch (error) {
        console.error('Error matching heights:', error);
      }
    };

    // Wait for images to load before measuring
    const waitForImages = () => {
      const images = featuredRef.current?.querySelectorAll('img');
      if (images && images.length > 0) {
        let loadedCount = 0;
        const totalImages = images.length;
        
        const checkComplete = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            setTimeout(updateHeight, 50);
          }
        };

        images.forEach((img) => {
          if (img.complete) {
            checkComplete();
          } else {
            img.addEventListener('load', checkComplete, { once: true });
            img.addEventListener('error', checkComplete, { once: true });
          }
        });

        setTimeout(updateHeight, 1000);
      } else {
        updateHeight();
      }
    };

    // Multiple timeouts to catch different render phases
    const timeoutId1 = setTimeout(waitForImages, 100);
    const timeoutId2 = setTimeout(waitForImages, 300);
    const timeoutId3 = setTimeout(waitForImages, 600);
    const timeoutId4 = setTimeout(waitForImages, 1000);

    // Watch for resize
    let resizeObserver: ResizeObserver | null = null;
    try {
      resizeObserver = new ResizeObserver(() => {
        waitForImages();
      });

      if (featuredRef.current) {
        resizeObserver.observe(featuredRef.current);
      }
    } catch (e) {
      console.warn('ResizeObserver not available');
    }

    window.addEventListener('resize', waitForImages);
    window.addEventListener('load', waitForImages);

    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
      clearTimeout(timeoutId4);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', waitForImages);
      window.removeEventListener('load', waitForImages);
    };
  }, [isMounted, featuredPost, secondaryPosts, sidebarOnly]);

  // If sidebarOnly, just render the sidebar content
  if (sidebarOnly) {
    return (
      <div 
        className="flex flex-col" 
        ref={secondaryRef}
        style={{ 
          overflow: 'visible',
          maxHeight: 'none',
          height: 'auto'
        }}
      >
        {/* Trending Section - Show first */}
        {trendingPosts.length > 0 && (
          <>
            <div className="bg-black text-white p-4 mb-6">
              <h2 className="text-xl font-black uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
                Trending
              </h2>
            </div>
            <div className="space-y-6 mb-6">
              {trendingPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.id}`}
                  className="block group"
                >
                  <div className="flex gap-3">
                    {post.image_url && (
                      <div className="w-20 h-20 flex-shrink-0 relative overflow-hidden bg-gray-200">
                        <Image
                          src={post.image_url}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-black text-black leading-tight group-hover:underline line-clamp-2" style={{ fontFamily: 'Georgia, serif' }}>
                        {post.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
        
        {/* What's New Header */}
        <div className="bg-black text-white p-4 mb-6">
          <h2 className="text-xl font-black uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
            What&apos;s New
          </h2>
        </div>
        
        <div 
          className="flex flex-col" 
          style={{ 
            gap: '0.75rem',
            overflow: 'visible'
          }}
        >
          {postsToShow.map((post, index) => {
            if (!post || !post.id) return null;
            return (
              <div 
                key={post.id} 
                className="flex flex-col"
                style={{ opacity: 1, visibility: 'visible' }}
              >
                <SecondaryArticleCard post={post} />
              </div>
            );
          })}
        </div>
        
        {/* Ad space under the articles - not constrained by height */}
        <div className="mt-4 flex-shrink-0" style={{ overflow: 'visible', minHeight: 'auto', height: 'auto' }}>
          <NewspaperSidebar trendingPosts={[]} currentPage={currentPage} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16" style={{ overflow: 'visible', minHeight: 0 }}>
      {/* Main Content - Featured Article */}
      <div className="lg:col-span-2" ref={featuredRef}>
        <FeaturedArticle post={featuredPost} />
      </div>

      {/* Secondary articles - constrained to match featured height */}
      <div 
        className="flex flex-col" 
        ref={secondaryRef}
        style={{ 
          overflow: 'visible',
          maxHeight: 'none',
          height: 'auto'
        }}
      >
        {/* What's New Header */}
        <div className="bg-black text-white p-4 mb-6">
          <h2 className="text-xl font-black uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
            What&apos;s New
          </h2>
        </div>
        
        <div 
          className="flex flex-col" 
          style={{ 
            gap: '0.75rem',
            overflow: 'visible'
          }}
        >
          {postsToShow.map((post, index) => {
            if (!post || !post.id) return null;
            return (
              <div 
                key={post.id} 
                className="flex flex-col"
                style={{ opacity: 1, visibility: 'visible' }}
              >
                <SecondaryArticleCard post={post} />
              </div>
            );
          })}
        </div>
        
        {/* Ad space under the 3 articles - not constrained by height */}
        <div className="mt-4 flex-shrink-0" style={{ overflow: 'visible', minHeight: 'auto', height: 'auto' }}>
          <NewspaperSidebar trendingPosts={trendingPosts} currentPage={currentPage} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16" style={{ overflow: 'visible', minHeight: 0 }}>
      {/* Main Content - Featured Article */}
      <div className="lg:col-span-2" ref={featuredRef}>
        <FeaturedArticle post={featuredPost} />
      </div>

      {/* Secondary articles - constrained to match featured height */}
      <div 
        className="flex flex-col" 
        ref={secondaryRef}
        style={{ 
          overflow: 'visible',
          maxHeight: 'none',
          height: 'auto'
        }}
      >
        {/* What's New Header */}
        <div className="bg-black text-white p-4 mb-6">
          <h2 className="text-xl font-black uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
            What&apos;s New
          </h2>
        </div>
        
        <div 
          className="flex flex-col" 
          style={{ 
            gap: '0.75rem',
            overflow: 'visible'
          }}
        >
          {postsToShow.map((post, index) => {
            if (!post || !post.id) return null;
            return (
              <div 
                key={post.id} 
                className="flex flex-col"
                style={{ opacity: 1, visibility: 'visible' }}
              >
                <SecondaryArticleCard post={post} />
              </div>
            );
          })}
        </div>
        
        {/* Ad space under the 3 articles - not constrained by height */}
        <div className="mt-4 flex-shrink-0" style={{ overflow: 'visible', minHeight: 'auto', height: 'auto' }}>
          <NewspaperSidebar trendingPosts={trendingPosts} currentPage={currentPage} />
        </div>
      </div>
    </div>
  );
}
