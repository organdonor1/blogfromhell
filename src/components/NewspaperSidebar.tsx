import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';

interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  image_url: string | null;
  section: string | null;
  created_at: string;
}

interface Ad {
  id: string;
  title: string | null;
  image_url: string;
  link_url: string | null;
  position: string;
  active: boolean;
}

interface NewspaperSidebarProps {
  trendingPosts?: Post[];
  adSpace?: React.ReactNode;
}

export default function NewspaperSidebar({ trendingPosts = [], adSpace, currentPage = null }: NewspaperSidebarProps) {
  const [ads, setAds] = useState<Ad[]>([]);

  // Debug: log when ads state changes
  useEffect(() => {
    console.log('Ads state updated:', ads.length, 'ads');
    if (ads.length > 0) {
      console.log('Ads in state:', ads);
    }
  }, [ads]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        console.log('🔵🔵🔵 NEWSPAPER SIDEBAR: Starting ad fetch 🔵🔵🔵');
        console.log('Current page prop received:', currentPage);
        console.log('Type of currentPage:', typeof currentPage);
        
        // Fetch all active sidebar ads, then filter by page in JavaScript
        let { data, error } = await supabase
          .from('ads')
          .select('*')
          .eq('active', true)
          .eq('position', 'sidebar')
          .order('created_at', { ascending: false });
        
        console.log('Raw query result - data:', data);
        console.log('Raw query result - error:', error);
        
        // Check for RLS/permission errors
        if (error) {
          console.error('Supabase query error:', error);
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          
          // If it's a permission error, try using the API route instead
          if (error.code === 'PGRST116' || error.message?.includes('permission') || error.message?.includes('policy')) {
            console.log('RLS/Permission error detected. Trying API route fallback...');
            try {
              const response = await fetch(`/api/ads?page=${currentPage || ''}`);
              const result = await response.json();
              if (result.ads && Array.isArray(result.ads) && result.ads.length > 0) {
                console.log('Successfully fetched ads via API route:', result.ads.length);
                // Filter by page in JavaScript
                let filteredAds = result.ads.filter((ad: Ad) => {
                  const adPage = ad.page ? String(ad.page).trim().toLowerCase() : null;
                  const hasNoPage = !adPage || adPage === '';
                  
                  // If ad has no page set, show on all pages
                  if (hasNoPage) {
                    return true;
                  }
                  
                  // If currentPage is specified, ONLY show ads that match that page (case-insensitive)
                  if (currentPage) {
                    const currentPageLower = String(currentPage).trim().toLowerCase();
                    return adPage === currentPageLower;
                  }
                  
                  // If no currentPage specified, only show ads with no page set
                  return false;
                });
                // Remove duplicates before setting state
                const uniqueAds = Array.from(new Map(filteredAds.map((ad: Ad) => [ad.id, ad])).values());
                console.log('Unique ads after deduplication and page filtering:', uniqueAds.length);
                setAds(uniqueAds);
                return;
              }
            } catch (apiError) {
              console.error('API route also failed:', apiError);
            }
          }
          setAds([]);
          return;
        }
        
        // Filter by page in JavaScript
        if (data && data.length > 0) {
          console.log('=== AD FILTERING DEBUG ===');
          console.log('Fetched ads before filtering:', data.length);
          console.log('Current page prop:', currentPage, '(type:', typeof currentPage, ')');
          console.log('All ads with their page values:', data.map((ad: Ad) => ({ 
            id: ad.id, 
            title: ad.title,
            page: ad.page, 
            pageType: typeof ad.page,
            pageValue: ad.page ? String(ad.page) : 'null/undefined',
            isEmpty: !ad.page || (typeof ad.page === 'string' && ad.page.trim() === '')
          })));
          
          let filteredAds = data.filter((ad: Ad) => {
            // Check if ad has no page set (null, undefined, or empty string)
            const adPageRaw = ad.page;
            const adPage = adPageRaw ? String(adPageRaw).trim().toLowerCase() : null;
            const hasNoPage = !adPage || adPage === '';
            
            console.log(`\nChecking ad ${ad.id} (${ad.title}):`);
            console.log(`  - Raw page value:`, adPageRaw);
            console.log(`  - Processed page:`, adPage);
            console.log(`  - Has no page:`, hasNoPage);
            
            // If ad has no page set, show on all pages
            if (hasNoPage) {
              console.log(`  ✓ Showing (no page set)`);
              return true;
            }
            
            // If currentPage is specified, ONLY show ads that match that page (case-insensitive)
            if (currentPage) {
              const currentPageLower = String(currentPage).trim().toLowerCase();
              const matches = adPage === currentPageLower;
              console.log(`  - Current page:`, currentPageLower);
              console.log(`  - Ad page:`, adPage);
              console.log(`  - Match:`, matches ? 'YES ✓' : 'NO ✗');
              return matches;
            }
            
            // If no currentPage specified, only show ads with no page set
            console.log(`  ✗ Not showing (has page="${adPage}" but no currentPage provided)`);
            return false;
          });
          
          console.log('\n=== FILTERING RESULTS ===');
          console.log('Ads after filtering:', filteredAds.length);
          console.log('Filtered ads:', filteredAds.map((ad: Ad) => ({ id: ad.id, title: ad.title, page: ad.page })));
          
          // If no ads matched the page filter, fall back to showing ads with no page set
          if (filteredAds.length === 0 && currentPage) {
            console.log('No ads matched current page, falling back to ads with no page set...');
            const fallbackAds = data.filter((ad: Ad) => {
              const adPage = ad.page ? String(ad.page).trim().toLowerCase() : null;
              return !adPage || adPage === '';
            });
            console.log('Fallback ads found:', fallbackAds.length);
            filteredAds = fallbackAds;
          }
          
          console.log('=== END DEBUG ===\n');
          
          // Remove duplicates before setting state
          const uniqueAds = Array.from(new Map(filteredAds.map(ad => [ad.id, ad])).values());
          console.log('Final unique ads to display:', uniqueAds.length);
          setAds(uniqueAds);
          return;
        } else {
          console.log('No ads found in database (data is empty or null)');
        }
        
        // If we get here, no ads were found
        console.warn('No ads found. Possible issues:');
        console.warn('1. Row Level Security (RLS) policies may be blocking access');
        console.warn('2. Ads may not exist with active=true and position="sidebar"');
        console.warn('3. Check Supabase dashboard > Authentication > Policies for the ads table');
        setAds([]);
      } catch (error) {
        console.error('Unexpected error fetching ads:', error);
        setAds([]);
      }
    };

    fetchAds();
  }, [currentPage]);

  return (
    <aside className="w-full md:w-80 space-y-6" style={{ position: 'relative', zIndex: 1, overflow: 'visible', minWidth: 0 }}>
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

      {/* Ad Space - Render only first unique ad */}
      {(() => {
        console.log('🟢 RENDERING AD SPACE - ads.length:', ads.length, 'ads:', ads);
        if (ads.length === 0) {
          if (adSpace) {
            return (
              <div className="border-4 border-black bg-gray-100 p-6 min-h-[300px] flex items-center justify-center mb-6 w-full">
                {adSpace}
              </div>
            );
          }
          return (
            <div className="border-4 border-black bg-gray-100 p-6 min-h-[300px] flex items-center justify-center mb-6 w-full">
              <div className="text-center text-gray-500 text-sm">
                <div className="border-2 border-dashed border-gray-400 p-8">
                  <p className="font-bold uppercase tracking-wide">Advertisement</p>
                  <p className="text-xs mt-2">300x250</p>
                </div>
              </div>
            </div>
          );
        }
        
        // Remove duplicates by id, then take only the first ad
        const uniqueAds = Array.from(new Map(ads.map(ad => [ad.id, ad])).values());
        const firstAd = uniqueAds[0];
        
        if (!firstAd) return null;
        
        const adContent = firstAd.link_url ? (
          <a 
            href={firstAd.link_url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              display: 'block',
              width: '100%',
              textDecoration: 'none'
            }}
          >
            <img
              src={firstAd.image_url}
              alt={firstAd.title || 'Advertisement'}
              style={{ 
                display: 'block',
                width: '100%',
                height: 'auto',
                maxWidth: '100%',
                margin: 0,
                padding: 0,
                border: 'none',
                outline: 'none',
                verticalAlign: 'top',
                objectFit: 'contain'
              }}
              loading="lazy"
            />
          </a>
        ) : (
          <img
            src={firstAd.image_url}
            alt={firstAd.title || 'Advertisement'}
            style={{ 
              display: 'block',
              width: '100%',
              height: 'auto',
              margin: 0,
              padding: 0,
              border: 'none',
              outline: 'none',
              verticalAlign: 'top'
            }}
            loading="lazy"
          />
        );
        
        return (
          <div 
            key={`ad-${firstAd.id}`}
            className="border-4 border-black mb-6" 
            style={{ 
              position: 'relative',
              overflow: 'visible',
              width: '100%',
              backgroundColor: '#ffffff',
              lineHeight: 0,
              zIndex: 1,
              boxSizing: 'border-box',
              minHeight: 'auto',
              maxHeight: 'none'
            }}
          >
            <div style={{ width: '100%', overflow: 'visible', display: 'block' }}>
              {adContent}
            </div>
          </div>
        );
      })()}
    </aside>
  );
}
