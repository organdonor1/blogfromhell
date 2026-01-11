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
  return (
    <Link href={`/post/${post.id}`} className="block group border-b-2 border-black pb-4 last:border-0 h-full flex flex-col">
      {post.image_url && (
        <div className="mb-3 aspect-video relative overflow-hidden bg-gray-200 flex-shrink-0">
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
        </div>
      )}
      
      <div className="flex flex-col flex-1 min-h-0">
        {post.section && (
          <div className="mb-2 flex-shrink-0">
            <span className="inline-block bg-black text-white text-xs font-bold uppercase tracking-wider px-2 py-1">
              {post.section}
            </span>
          </div>
        )}
        
        <h3 className="text-lg md:text-xl font-black text-black group-hover:underline leading-tight flex-1" style={{ fontFamily: 'Georgia, serif' }}>
          {post.title}
        </h3>
      </div>
    </Link>
  );
}
