import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export async function GET(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ ads: [] });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    
    // Fetch all active sidebar ads, then filter by page in JavaScript
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .eq('active', true)
      .eq('position', 'sidebar')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching ads:', error);
      return NextResponse.json({ ads: [] });
    }

    // Filter by page in JavaScript
    let filteredAds = data || [];
    if (page) {
      // Show ads where page is null/empty (all pages) OR page matches the requested page (case-insensitive)
      const pageLower = String(page).trim().toLowerCase();
      filteredAds = filteredAds.filter(ad => {
        const adPage = ad.page ? String(ad.page).trim().toLowerCase() : null;
        const hasNoPage = !adPage || adPage === '';
        
        // If ad has no page set, show on all pages
        if (hasNoPage) {
          return true;
        }
        // Otherwise, only show if page matches (case-insensitive)
        return adPage === pageLower;
      });
    } else {
      // If no page specified, only show ads with no page set (for all pages)
      filteredAds = filteredAds.filter(ad => {
        const adPage = ad.page ? String(ad.page).trim().toLowerCase() : null;
        return !adPage || adPage === '';
      });
    }

    return NextResponse.json({ ads: filteredAds });
  } catch (error: any) {
    console.error('Error fetching ads:', error);
    return NextResponse.json({ ads: [] });
  }
}
