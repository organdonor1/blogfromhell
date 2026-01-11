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
    <Link href={`/post/${post.id}`} className="block group border-b-2 border-black pb-4 last:border-0 h-full flex flex-col" style={{ minHeight: 0, height: '100%', overflow: 'hidden' }}>
      {post.image_url && (
        <div className="mb-3 relative overflow-hidden bg-gray-200" style={{ flex: '0 1 auto', minHeight: 0, maxHeight: '50%' }}>
          <Image
            src={post.image_url}
            alt={post.title || ''}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}
      
      <div className="flex flex-col flex-1 min-h-0" style={{ overflow: 'hidden', flex: '1 1 0%' }}>
        {post.section && (
          <div className="mb-2 flex-shrink-0">
            <span className="inline-block bg-black text-white text-xs font-bold uppercase tracking-wider px-2 py-1">
              {post.section}
            </span>
          </div>
        )}
        
        <h3 className="text-lg md:text-xl font-black text-black group-hover:underline leading-tight flex-1 overflow-hidden" style={{ 
          fontFamily: 'Georgia, serif',
          display: '-webkit-box',
          WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical',
          textOverflow: 'ellipsis',
          minHeight: 0
        }}>
          {post.title || ''}
        </h3>
      </div>
    </Link>
  );
}
