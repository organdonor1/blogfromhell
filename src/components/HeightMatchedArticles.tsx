'use client';

import { useEffect, useRef, useState } from 'react';
import FeaturedArticle from './FeaturedArticle';
import SecondaryArticleCard from './SecondaryArticleCard';

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
}

export default function HeightMatchedArticles({ featuredPost, secondaryPosts }: HeightMatchedArticlesProps) {
  const featuredRef = useRef<HTMLDivElement>(null);
  const secondaryRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Safety check
  if (!featuredPost || !secondaryPosts || secondaryPosts.length === 0) {
    return null;
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;

    const matchHeights = () => {
      try {
        if (!featuredRef.current || !secondaryRef.current) return;
        if (window.innerWidth < 1024) {
          // Reset on mobile
          secondaryRef.current.style.height = '';
          secondaryRef.current.style.maxHeight = '';
          return;
        }

        const featuredHeight = featuredRef.current.offsetHeight;
        if (featuredHeight > 0) {
          // Set exact height - this forces the container to match
          secondaryRef.current.style.height = `${featuredHeight}px`;
          secondaryRef.current.style.maxHeight = `${featuredHeight}px`;
        }
      } catch (error) {
        console.error('Error matching heights:', error);
      }
    };

    // Multiple timeouts to ensure DOM is ready
    const timeoutId1 = setTimeout(matchHeights, 100);
    const timeoutId2 = setTimeout(matchHeights, 300);
    const timeoutId3 = setTimeout(matchHeights, 600);

    // Watch for resize
    let resizeObserver: ResizeObserver | null = null;
    try {
      resizeObserver = new ResizeObserver(() => {
        matchHeights();
      });

      if (featuredRef.current) {
        resizeObserver.observe(featuredRef.current);
      }
    } catch (e) {
      console.warn('ResizeObserver not available');
    }

    window.addEventListener('resize', matchHeights);

    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', matchHeights);
    };
  }, [isMounted, featuredPost, secondaryPosts]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      {/* Main Content - Featured Article */}
      <div className="lg:col-span-2" ref={featuredRef}>
        <FeaturedArticle post={featuredPost} />
      </div>

      {/* Secondary articles with photos - this container will be height-constrained */}
      <div 
        className="flex flex-col" 
        ref={secondaryRef}
        style={{ minHeight: 0, overflow: 'hidden' }}
      >
        <div className="flex flex-col h-full" style={{ gap: '1rem', minHeight: 0 }}>
          {secondaryPosts.slice(0, 3).map((post, index) => (
            <div 
              key={post?.id || index} 
              className="flex flex-col"
              style={{ 
                flex: index < 2 ? '1 1 0%' : '0 1 auto', 
                minHeight: 0,
                overflow: 'hidden'
              }}
            >
              <SecondaryArticleCard post={post} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
