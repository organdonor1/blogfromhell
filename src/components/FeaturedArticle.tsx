import Link from 'next/link';
import Image from 'next/image';

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
  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="mb-8 border-b-4 border-black pb-8">
      <Link href={`/post/${post.id}`} className="block group">
        {post.image_url && (
          <div className="mb-6 aspect-video relative overflow-hidden bg-gray-200">
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        
        {post.section && (
          <div className="mb-3">
            <span className="inline-block bg-black text-white text-xs font-bold uppercase tracking-wider px-3 py-1">
              {post.section}
            </span>
          </div>
        )}
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-black mb-4 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
          {post.title}
        </h1>
        
        {post.excerpt && (
          <p className="text-xl text-gray-800 mb-4 leading-relaxed font-medium" style={{ fontFamily: 'Georgia, serif' }}>
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
      </Link>
    </article>
  );
}
