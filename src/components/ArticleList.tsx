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
        <p className="text-lg">No articles found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {posts.map((post, index) => {
        const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        return (
          <article key={post.id} className={`border-b-2 border-black ${index === 0 ? 'pt-0' : 'pt-6'} pb-6 last:border-0`}>
            <Link href={`/post/${post.id}`} className="block group">
              <div className="flex gap-6">
                {post.image_url && (
                  <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 relative overflow-hidden bg-gray-200">
                    <Image
                      src={post.image_url}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  {showSection && post.section && (
                    <div className="mb-2">
                      <span className="inline-block bg-black text-white text-xs font-bold uppercase tracking-wider px-2 py-1">
                        {post.section}
                      </span>
                    </div>
                  )}
                  
                  <h2 className="text-2xl md:text-3xl font-black text-black mb-2 leading-tight group-hover:underline" style={{ fontFamily: 'Georgia, serif' }}>
                    {post.title}
                  </h2>
                  
                  {post.excerpt && (
                    <p className="text-gray-700 mb-3 line-clamp-2 text-base leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                      {post.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
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
      })}
    </div>
  );
}
