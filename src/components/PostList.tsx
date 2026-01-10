import { Post } from './PostCard';
import PostCard from './PostCard';

interface PostListProps {
  posts: Post[];
}

const PostList = ({ posts }: PostListProps) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground font-body italic text-lg">
          No posts yet. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y-0">
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
};

export default PostList;
