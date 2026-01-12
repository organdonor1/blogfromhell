'use client';

import Link from 'next/link';
import Image from 'next/image';

interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  image_url: string | null;
  section: string | null;
  created_at: string;
}

interface SecondaryArticleCardProps {
  post: Post;
}

export default function SecondaryArticleCard({ post }: SecondaryArticleCardProps) {
  if (!post || !post.id) {
    return null;
  }

  return (
    <Link 
      href={`/post/${post.id}`} 
      className="block group border-b-2 border-black pb-3 last:border-0 h-full flex flex-col" 
      style={{ minHeight: 0, overflow: 'hidden' }}
    >
      <div className="flex gap-3 h-full" style={{ minHeight: 0, overflow: 'hidden' }}>
        {/* Text on left */}
        <div className="flex flex-col flex-1 min-h-0" style={{ overflow: 'hidden' }}>
          {post.section && (
            <div className="mb-1 flex-shrink-0">
              <span className="inline-block bg-black text-white text-xs font-bold uppercase tracking-wider px-2 py-0.5">
                {post.section}
              </span>
            </div>
          )}
          
          <h3 
            className="text-sm md:text-base font-black text-black group-hover:underline leading-tight overflow-hidden" 
            style={{ 
              fontFamily: 'Georgia, serif',
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis',
              minHeight: 0,
              wordBreak: 'break-word',
              lineHeight: '1.2',
              margin: 0
            }}
          >
            {post.title || ''}
          </h3>
        </div>

        {/* Image on right */}
        {post.image_url && (
          <div 
            className="relative bg-gray-200 flex-shrink-0" 
            style={{ 
              width: '100px',
              height: '100px',
              minHeight: '100px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Image
              src={post.image_url}
              alt={post.title || ''}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
              sizes="100px"
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}
      </div>
    </Link>
  );
}
