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
    <article className="mb-8">
      <Link href={`/post/${post.id}`} className="block group">
        {post.image_url && (
          <div className="mb-4 aspect-video relative overflow-hidden">
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        {post.section && (
          <span className="text-sm text-green-600 font-medium uppercase tracking-wide mb-2 block">
            {post.section}
          </span>
        )}
        
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-3 group-hover:text-green-600 transition-colors leading-tight">
          {post.title}
        </h1>
        
        {post.excerpt && (
          <p className="text-lg text-gray-700 mb-3 leading-relaxed">
            {post.excerpt}
          </p>
        )}
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <time dateTime={post.created_at}>{formattedDate}</time>
          {post.read_time && (
            <>
              <span>•</span>
              <span>{post.read_time}</span>
            </>
          )}
        </div>
      </Link>
    </article>
  );
}
