import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  
  // Get language from query params or default to 'de'
  const searchParams = request.nextUrl.searchParams;
  const lang = searchParams.get('lang') || 'de';
  
  try {
    console.log('=== Enhanced Hotel API Route ===');
    console.log('Slug:', slug);
    console.log('Language:', lang);
    
    // Fetch hotel with all related data
    const response = await fetch(
      `http://localhost:8055/items/hotels?` + new URLSearchParams({
        'filter[slug][_eq]': slug,
        'fields': [
          '*',
          'rooms.*',
          'gallery.*',
          'translations.*'
        ].join(',')
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_HOTEL ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_HOTEL) : 300 }
      }
    );

    console.log('Response status:', response.status);

    if (!response.ok) {
      console.error('Fetch failed:', response.statusText);
      return NextResponse.json(
        { error: `Failed to fetch hotel: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Data received:', JSON.stringify(data, null, 2));
    
    if (!data.data || data.data.length === 0) {
      console.log('No hotel found for slug:', slug);
      return NextResponse.json(
        { error: 'Hotel not found' },
        { status: 404 }
      );
    }

    const hotel = data.data[0];
    console.log('Hotel found:', hotel.name);
    
    // Find translation for requested language
    const translation = hotel.translations?.find(t => t.language_code === lang) || null;
    
    // Sort gallery by sort_order
    const gallery = hotel.gallery?.sort((a, b) => a.sort_order - b.sort_order) || [];
    
    // Build response with translated content
    const response_data = {
      // Basic fields
      id: hotel.id,
      slug: hotel.slug,
      name: translation?.name || hotel.name,
      description: translation?.description || hotel.description,
      short_description: translation?.short_description || '',
      location: hotel.location,
      region: hotel.region,
      stars: hotel.stars,
      price_from: hotel.price_from,
      featured: hotel.featured,
      status: hotel.status,
      
      // New professional fields
      coordinates: {
        latitude: hotel.latitude || null,
        longitude: hotel.longitude || null
      },
      contact: {
        phone: hotel.phone || null,
        email: hotel.email || null,
        website: hotel.website || null
      },
      rating: {
        score: hotel.rating || null,
        review_count: hotel.review_count || 0
      },
      check_times: {
        check_in: hotel.check_in_time || '15:00',
        check_out: hotel.check_out_time || '11:00'
      },
      amenities: hotel.amenities || [],
      amenities_text: translation?.amenities_text || '',
      location_description: translation?.location_description || '',
      
      // SEO fields
      seo: {
        meta_title: translation?.meta_title || hotel.meta_title || hotel.name,
        meta_description: translation?.meta_description || hotel.meta_description || ''
      },
      
      // Related data
      rooms: hotel.rooms || [],
      gallery: gallery.map(item => ({
        id: item.id,
        image_url: item.image_url,
        title: item.title,
        alt_text: item.alt_text,
        is_hero: item.is_hero,
        sort_order: item.sort_order
      })),
      
      // Available languages
      available_languages: hotel.translations?.map(t => t.language_code) || [lang],
      current_language: lang
    };
    
    return NextResponse.json(response_data);
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hotel data', details: error.message },
      { status: 500 }
    );
  }
}