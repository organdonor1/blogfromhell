import Link from 'next/link';
import Image from 'next/image';

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  type: 'fiction' | 'news';
  readTime?: string;
  imageUrl?: string | null;
}

interface PostCardProps {
  post: Post;
  index: number;
}

const PostCard = ({ post, index }: PostCardProps) => {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link
      href={`/post/${post.id}`}
      className="block group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <article className="py-8 border-b border-border animate-fade-in">
        {post.imageUrl && (
          <div className="mb-6 rounded-lg overflow-hidden aspect-video relative">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
          <time dateTime={post.date}>{formattedDate}</time>
          {post.readTime && (
            <>
              <span className="text-border">•</span>
              <span>{post.readTime}</span>
            </>
          )}
        </div>
        <h2 className="font-heading text-2xl md:text-3xl font-medium text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
          {post.title}
        </h2>
        <p className="text-muted-foreground leading-relaxed font-body text-lg">
          {post.excerpt}
        </p>
        <span className="inline-block mt-4 text-primary text-sm font-medium group-hover:underline">
          Read more →
        </span>
      </article>
    </Link>
  );
};

export default PostCard;
