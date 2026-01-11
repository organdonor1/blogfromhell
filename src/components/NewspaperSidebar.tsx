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
        <div className="bg-black text-white p-4 mb-6">
          <h2 className="text-xl font-black uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
            Trending
          </h2>
        </div>
      )}
      
      {trendingPosts.length > 0 && (
        <div className="space-y-6">
          {trendingPosts.map((post) => (
            <Link
              key={post.id}
              href={`/post/${post.id}`}
              className="block group border-b-2 border-black pb-4 last:border-0"
            >
              <div className="flex gap-3">
                {post.image_url && (
                  <div className="w-20 h-20 flex-shrink-0 relative overflow-hidden bg-gray-200">
                    <Image
                      src={post.image_url}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {post.section && (
                    <span className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1 block">
                      {post.section}
                    </span>
                  )}
                  <h3 className="text-sm font-black text-black group-hover:underline leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                    {post.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Ad Space */}
      <div className="border-4 border-black bg-gray-100 p-6 min-h-[300px] flex items-center justify-center">
        {adSpace || (
          <div className="text-center text-gray-500 text-sm">
            <div className="border-2 border-dashed border-gray-400 p-8">
              <p className="font-bold uppercase tracking-wide">Advertisement</p>
              <p className="text-xs mt-2">300x250</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
