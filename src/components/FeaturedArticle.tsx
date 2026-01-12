'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  image_url: string | null;
  section: string | null;
  created_at: string;
  read_time: string | null;
}

interface FeaturedArticleProps {
  post: Post;
}

export default function FeaturedArticle({ post }: FeaturedArticleProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [imageHeight, setImageHeight] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;

    const updateImageHeight = () => {
      if (textRef.current && imageRef.current && post.image_url) {
        // Wait for images to load
        const images = textRef.current.querySelectorAll('img');
        let loadedCount = 0;
        const totalImages = images.length;

        const checkComplete = () => {
          loadedCount++;
          if (loadedCount === totalImages || totalImages === 0) {
            // Measure text container height
            const textHeight = textRef.current?.offsetHeight || 0;
            if (textHeight > 0) {
              setImageHeight(textHeight);
            }
          }
        };

        if (totalImages > 0) {
          images.forEach((img) => {
            if (img.complete) {
              checkComplete();
            } else {
              img.addEventListener('load', checkComplete, { once: true });
              img.addEventListener('error', checkComplete, { once: true });
            }
          });
        } else {
          // No images in text, just measure directly
          setTimeout(() => {
            const textHeight = textRef.current?.offsetHeight || 0;
            if (textHeight > 0) {
              setImageHeight(textHeight);
            }
          }, 100);
        }

        // Fallback timeout
        setTimeout(() => {
          const textHeight = textRef.current?.offsetHeight || 0;
          if (textHeight > 0) {
            setImageHeight(textHeight);
          }
        }, 500);
      }
    };

    // Multiple timeouts to catch different render phases
    const timeoutId1 = setTimeout(updateImageHeight, 100);
    const timeoutId2 = setTimeout(updateImageHeight, 300);
    const timeoutId3 = setTimeout(updateImageHeight, 600);

    // Watch for resize
    let resizeObserver: ResizeObserver | null = null;
    try {
      resizeObserver = new ResizeObserver(() => {
        updateImageHeight();
      });

      if (textRef.current) {
        resizeObserver.observe(textRef.current);
      }
    } catch (e) {
      console.warn('ResizeObserver not available');
    }

    window.addEventListener('resize', updateImageHeight);
    window.addEventListener('load', updateImageHeight);

    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', updateImageHeight);
      window.removeEventListener('load', updateImageHeight);
    };
  }, [isMounted, post.title, post.excerpt, post.image_url]);

  return (
    <article className="mb-12 border-b-4 border-black pb-8 px-4">
      <Link href={`/post/${post.id}`} className="block group">
        <div className="flex flex-col">
          {/* Image on top - full width and bigger */}
          {post.image_url && (
            <div 
              ref={imageRef}
              className="w-full relative overflow-hidden bg-gray-200 mb-6"
              style={{
                height: '500px',
                minHeight: '400px'
              }}
            >
              <Image
                src={post.image_url}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            </div>
          )}

          {/* Text below image */}
          <div ref={textRef} className="flex-1 min-w-0">
            {post.section && (
              <div className="mb-2">
                <span className="inline-block bg-black text-white text-xs font-bold uppercase tracking-wider px-3 py-1">
                  {post.section}
                </span>
              </div>
            )}
            
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-black mb-3 leading-snug" style={{ fontFamily: 'Georgia, serif' }}>
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-base md:text-lg text-gray-800 mb-3 leading-relaxed font-medium" style={{ fontFamily: 'Georgia, serif' }}>
                {post.excerpt}
              </p>
            )}
            
            <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
              <time dateTime={post.created_at}>{formattedDate}</time>
              {post.read_time && (
                <>
                  <span className="text-gray-400">•</span>
                  <span>{post.read_time}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
