'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/footer';
import { supabase } from '../../../integrations/supabase/client';

interface Post {
  id: string;
  title: string;
  content: string;
  type: string;
  read_time: string | null;
  created_at: string;
}

export default function PostDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setNotFound(true);
        return;
      }

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .eq('published', true)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setPost(data);
      }
      setIsLoading(false);
    };

    fetchPost();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container max-w-3xl mx-auto px-6 py-10">
          <p className="text-center text-muted-foreground py-12">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound || !post) {
    router.push('/');
    return null;
  }

  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container max-w-3xl mx-auto px-6 py-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to all posts</span>
        </Link>
        
        <article className="animate-fade-in">
          <header className="mb-10 pb-8 border-b border-border">
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
              <span className="uppercase tracking-wide text-primary font-medium">
                {post.type}
              </span>
              <span className="text-border">•</span>
              <time dateTime={post.created_at}>{formattedDate}</time>
              {post.read_time && (
                <>
                  <span className="text-border">•</span>
                  <span>{post.read_time}</span>
                </>
              )}
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-semibold text-foreground leading-tight">
              {post.title}
            </h1>
          </header>
          
          <div className="prose-fiction">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
