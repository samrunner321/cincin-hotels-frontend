/**
 * Debug-Route für Directus Hotel-Abruf
 */
import { NextResponse, NextRequest } from 'next/server';
import { fetchHotelBySlug } from '../../../src/lib/api/directus-client';

// Configure route options to ensure it's not statically optimized
export const dynamic = 'force-dynamic';

/**
 * GET handler for hotel debug route
 * 
 * Fetches a hotel by slug from Directus API for debugging
 * 
 * @param request The incoming request with query parameters
 * @returns JSON response with hotel data or error
 */
export async function GET(request) {
  try {
    // Get slug from query parameter
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug') || 'crans-luxury-lodge';
    const locale = searchParams.get('locale') || 'de-DE';
    
    console.log(`Debug-API: Fetching hotel with slug="${slug}" and locale="${locale}"`);
    
    // Fetch the hotel
    const hotel = await fetchHotelBySlug(slug, locale);
    
    if (!hotel) {
      console.warn(`Debug-API: No hotel found with slug=${slug}`);
      return NextResponse.json({ 
        success: false, 
        error: 'Hotel not found',
        slug
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      hotel,
      slug
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Debug-API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: errorMessage,
      stack: errorStack
    }, { status: 500 });
  }
}