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

interface NewspaperSidebarProps {
  trendingPosts?: Post[];
  adSpace?: React.ReactNode;
}

export default function NewspaperSidebar({ trendingPosts = [], adSpace }: NewspaperSidebarProps) {
  return (
    <aside className="w-full md:w-80 space-y-6">
      {/* Trending Section */}
      {trendingPosts.length > 0 && (
        <div className="bg-green-600 text-white p-4 mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wide">Trending</h2>
        </div>
      )}
      
      {trendingPosts.length > 0 && (
        <div className="space-y-4">
          {trendingPosts.map((post) => (
            <Link
              key={post.id}
              href={`/post/${post.id}`}
              className="block group"
            >
              <div className="flex gap-3">
                {post.image_url && (
                  <div className="w-20 h-20 flex-shrink-0 relative overflow-hidden">
                    <Image
                      src={post.image_url}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {post.section && (
                    <span className="text-xs text-green-600 font-medium uppercase">
                      {post.section}
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-black group-hover:text-green-600 transition-colors line-clamp-2 mt-1">
                    {post.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Ad Space */}
      {adSpace && (
        <div className="border-2 border-gray-300 p-4 bg-gray-50 min-h-[300px] flex items-center justify-center">
          {adSpace}
        </div>
      )}

      {/* Placeholder for additional ad space */}
      {!adSpace && (
        <div className="border-2 border-dashed border-gray-300 p-4 bg-gray-50 min-h-[300px] flex items-center justify-center text-gray-400 text-sm">
          Ad Space
        </div>
      )}
    </aside>
  );
}
