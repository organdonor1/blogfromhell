import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// GET comments for a post
export async function GET(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 500 }
    );
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { error: 'postId is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch comments' },
        { status: 500 }
      );
    }

    return NextResponse.json({ comments: data || [] });
  } catch (error: any) {
    console.error('Error in GET comments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST a new comment
export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { postId, authorName, authorEmail, content } = body;

    if (!postId || !authorName || !content) {
      return NextResponse.json(
        { error: 'postId, authorName, and content are required' },
        { status: 400 }
      );
    }

    // Verify post exists
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('id')
      .eq('id', postId)
      .eq('published', true)
      .maybeSingle();

    if (postError || !post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          post_id: postId,
          author_name: authorName,
          author_email: authorEmail || null,
          content: content.trim(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating comment:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create comment' },
        { status: 500 }
      );
    }

    return NextResponse.json({ comment: data }, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST comments:', error);
    return NextResponse.json(
      { error: error.message || 'Invalid request body' },
      { status: 400 }
    );
  }
}
