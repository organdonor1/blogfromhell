'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import TabToggle from '../components/TabToggle';
import PostList from '../components/PostList';
import Footer from '../components/footer';
import { supabase } from '../integrations/supabase/client';

interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  type: string;
  read_time: string | null;
  created_at: string;
}

export default function Index() {
  const [activeTab, setActiveTab] = useState<'fiction' | 'news'>('fiction');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('type', activeTab)
          .eq('published', true)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching posts:', error);
          setPosts([]);
        } else {
          setPosts(data || []);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [activeTab]);

  const formattedPosts = posts.map(p => ({
    id: p.id,
    title: p.title,
    excerpt: p.excerpt || '',
    date: p.created_at,
    type: p.type as 'fiction' | 'news',
    readTime: p.read_time || undefined,
    content: p.content,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container max-w-3xl mx-auto px-6 py-10">
        <TabToggle activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div key={activeTab} className="animate-fade-in">
          {isLoading ? (
            <p className="text-center text-muted-foreground py-12">Loading...</p>
          ) : formattedPosts.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No posts yet.</p>
          ) : (
            <PostList posts={formattedPosts} />
          )}
        </div>
      </main>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
