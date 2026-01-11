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
          secondaryRef.current.style.overflow = '';
          return;
        }

        const featuredHeight = featuredRef.current.offsetHeight;
        if (featuredHeight > 0) {
          // Set exact height to force shrinking - this makes the container match exactly
          secondaryRef.current.style.height = `${featuredHeight}px`;
          secondaryRef.current.style.maxHeight = `${featuredHeight}px`;
          secondaryRef.current.style.overflow = 'hidden';
          secondaryRef.current.style.display = 'flex';
          secondaryRef.current.style.flexDirection = 'column';
          
          // Also set height on inner container
          const innerContainer = secondaryRef.current.querySelector('div') as HTMLElement;
          if (innerContainer) {
            innerContainer.style.height = '100%';
            innerContainer.style.minHeight = '0';
          }
        }
      } catch (error) {
        console.error('Error matching heights:', error);
      }
    };

    // Initial match with multiple attempts to ensure DOM is ready
    const timeoutId1 = setTimeout(matchHeights, 50);
    const timeoutId2 = setTimeout(matchHeights, 200);
    const timeoutId3 = setTimeout(matchHeights, 500);

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
      // ResizeObserver might not be available
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

      {/* Secondary articles with photos */}
      <div 
        className="flex flex-col" 
        ref={secondaryRef}
        style={{ minHeight: 0 }}
      >
        <div className="flex flex-col" style={{ gap: '1rem', minHeight: 0, height: '100%', justifyContent: 'flex-start' }}>
          {secondaryPosts.slice(0, 3).map((post, index) => (
            <div 
              key={post.id} 
              style={{ 
                flex: index < 2 ? '1 1 0%' : '0 1 auto', 
                minHeight: 0,
                maxHeight: index < 2 ? '100%' : 'none',
                display: 'flex', 
                flexDirection: 'column',
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
