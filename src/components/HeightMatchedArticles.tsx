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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;

    const matchHeights = () => {
      try {
        if (!featuredRef.current || !secondaryRef.current) return;
        if (window.innerWidth < 1024) return; // Only on desktop

        const featuredHeight = featuredRef.current.offsetHeight;
        if (featuredHeight > 0) {
          secondaryRef.current.style.maxHeight = `${featuredHeight}px`;
          secondaryRef.current.style.overflow = 'hidden';
        }
      } catch (error) {
        console.error('Error matching heights:', error);
      }
    };

    // Initial match
    const timeoutId = setTimeout(matchHeights, 100);

    // Watch for resize
    const resizeObserver = new ResizeObserver(() => {
      matchHeights();
    });

    if (featuredRef.current) {
      resizeObserver.observe(featuredRef.current);
    }

    window.addEventListener('resize', matchHeights);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
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
        <div className="flex flex-col h-full" style={{ gap: '1rem', minHeight: 0 }}>
          {secondaryPosts.slice(0, 3).map((post, index) => (
            <div 
              key={post.id} 
              style={{ 
                flex: index < 2 ? '1 1 0%' : '0 0 auto', 
                minHeight: 0, 
                display: 'flex', 
                flexDirection: 'column' 
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
