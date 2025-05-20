/**
 * API Route for Rooms by Hotel ID
 * Acts as a proxy to Directus API to avoid CORS and authorization issues
 */

import { NextResponse } from 'next/server';
import { getRoomsByHotelId } from '../../../../lib/api/directus-server';

// Set to dynamic rendering to ensure data is fresh
export const dynamic = 'force-dynamic';

/**
 * GET handler for /api/rooms/[hotelId]
 * @param {Request} request - The incoming request
 * @param {Object} params - Route parameters including hotelId
 * @returns {Promise<Response>} JSON response with rooms data
 */
export async function GET(request, { params }) {
  try {
    // Extract the hotel ID from route parameters
    const { hotelId } = params;
    
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'de-DE';
    
    // Fetch rooms for the specified hotel
    const result = await getRoomsByHotelId(hotelId, locale);
    
    // Return the processed data
    return NextResponse.json(result.data, {
      status: 200,
      headers: {
        'Cache-Control': `s-maxage=${process.env.NEXT_PUBLIC_REVALIDATE_HOTEL || 300}, stale-while-revalidate`
      }
    });
  } catch (error) {
    console.error(`API Error in /api/rooms/${params?.hotelId}:`, error);
    
    // Return a structured error response
    return NextResponse.json(
      { 
        error: 'Failed to fetch rooms', 
        message: error.message 
      }, 
      { status: 500 }
    );
  }
}