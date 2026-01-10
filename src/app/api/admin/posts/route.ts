import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create admin client with service role key (bypasses RLS)
const supabaseAdmin = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

export async function GET(request: NextRequest) {
  const password = request.headers.get('x-admin-password');
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '';

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ posts: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const password = request.headers.get('x-admin-password');
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '';

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const postData = await request.json();
    const { data, error } = await supabaseAdmin
      .from('posts')
      .insert(postData)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ post: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const password = request.headers.get('x-admin-password');
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '';

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const { postId, postData } = await request.json();
    const { data, error } = await supabaseAdmin
      .from('posts')
      .update(postData)
      .eq('id', postId)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ post: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const password = request.headers.get('x-admin-password');
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '';

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('id');

    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
