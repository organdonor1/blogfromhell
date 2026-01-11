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
  const [matchedHeight, setMatchedHeight] = useState<number | null>(null);
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

    const updateHeight = () => {
      try {
        if (!featuredRef.current || !secondaryRef.current) return;
        if (window.innerWidth < 1024) {
          setMatchedHeight(null);
          if (secondaryRef.current) {
            secondaryRef.current.style.height = '';
            secondaryRef.current.style.maxHeight = '';
          }
          return;
        }

        // Measure the actual content height of the featured article
        // Get the article element inside the container
        const featuredArticle = featuredRef.current.querySelector('article') as HTMLElement;
        if (!featuredArticle) return;

        // Get the actual height including padding but excluding margin
        const featuredHeight = featuredArticle.offsetHeight;
        
        if (featuredHeight > 0) {
          setMatchedHeight(featuredHeight);
          // Also directly set it to ensure it applies
          secondaryRef.current.style.height = `${featuredHeight}px`;
          secondaryRef.current.style.maxHeight = `${featuredHeight}px`;
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

        // Fallback timeout
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
  }, [isMounted, featuredPost, secondaryPosts]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      {/* Main Content - Featured Article */}
      <div className="lg:col-span-2" ref={featuredRef}>
        <FeaturedArticle post={featuredPost} />
      </div>

      {/* Secondary articles - constrained to match featured height */}
      <div 
        className="flex flex-col" 
        ref={secondaryRef}
        style={{ 
          minHeight: 0, 
          overflow: 'hidden',
          ...(matchedHeight && typeof window !== 'undefined' && window.innerWidth >= 1024 ? { 
            height: `${matchedHeight}px`, 
            maxHeight: `${matchedHeight}px` 
          } : {})
        }}
      >
        <div 
          className="flex flex-col" 
          style={{ 
            gap: '1rem', 
            minHeight: 0, 
            height: '100%',
            maxHeight: '100%',
            overflow: 'hidden'
          }}
        >
          {secondaryPosts.slice(0, 3).map((post, index) => {
            if (!post || !post.id) return null;
            return (
              <div 
                key={post.id} 
                className="flex flex-col"
                style={{ 
                  flex: index < 2 ? '1 1 0%' : '0 1 auto', 
                  minHeight: 0,
                  maxHeight: index < 2 ? '100%' : 'none',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <SecondaryArticleCard post={post} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
