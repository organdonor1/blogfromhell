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

interface ArticleListProps {
  posts: Post[];
  showSection?: boolean;
}

export default function ArticleList({ posts, showSection = true }: ArticleListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600">
        <p>No articles found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => {
        const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        return (
          <article key={post.id} className="border-b border-gray-200 pb-6 last:border-0">
            <Link href={`/post/${post.id}`} className="block group">
              <div className="flex gap-4">
                {post.image_url && (
                  <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 relative overflow-hidden">
                    <Image
                      src={post.image_url}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  {showSection && post.section && (
                    <span className="text-xs text-green-600 font-medium uppercase tracking-wide mb-1 block">
                      {post.section}
                    </span>
                  )}
                  
                  <h2 className="text-xl md:text-2xl font-bold text-black mb-2 group-hover:text-green-600 transition-colors leading-tight">
                    {post.title}
                  </h2>
                  
                  {post.excerpt && (
                    <p className="text-gray-700 mb-2 line-clamp-2">
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
                </div>
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
}
