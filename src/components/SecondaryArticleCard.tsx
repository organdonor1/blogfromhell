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
      className="block group border-b-2 border-black pb-4 last:border-0 h-full flex flex-col" 
      style={{ minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      <div className="flex gap-3 h-full" style={{ minHeight: 0, overflow: 'hidden' }}>
        {post.image_url && (
          <div 
            className="relative bg-gray-200 flex-shrink-0" 
            style={{ 
              width: '120px',
              height: '100%',
              minHeight: 0,
              maxHeight: '100%',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Image
              src={post.image_url}
              alt={post.title || ''}
              fill
              className="object-contain group-hover:scale-105 transition-transform"
              sizes="120px"
              style={{ objectFit: 'contain' }}
            />
          </div>
        )}
        
        <div className="flex flex-col flex-1 min-h-0" style={{ overflow: 'hidden', minHeight: 0 }}>
          {post.section && (
            <div className="mb-2 flex-shrink-0">
              <span className="inline-block bg-black text-white text-xs font-bold uppercase tracking-wider px-2 py-1">
                {post.section}
              </span>
            </div>
          )}
          
          <h3 
            className="text-lg md:text-xl font-black text-black group-hover:underline leading-tight flex-1 overflow-hidden" 
            style={{ 
              fontFamily: 'Georgia, serif',
              display: '-webkit-box',
              WebkitLineClamp: 6,
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis',
              minHeight: 0,
              wordBreak: 'break-word',
              lineHeight: '1.2'
            }}
          >
            {post.title || ''}
          </h3>
        </div>
      </div>
    </Link>
  );
}
