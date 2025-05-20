/**
 * Debug-Route für direkte Abfrage eines Hotels in Directus
 */
import { NextResponse, NextRequest } from 'next/server';

// Configure route to be dynamic
export const dynamic = 'force-dynamic';

// Konfiguration
const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const API_TOKEN = process.env.DIRECTUS_PUBLIC_TOKEN || process.env.DIRECTUS_TOKEN || '';

/**
 * GET handler for direct Directus hotel query
 * 
 * Allows direct debugging of Directus API for hotel data
 * 
 * @param request The incoming request with query parameters
 * @returns JSON response with hotel data or error
 */
export async function GET(request) {
  try {
    // Get slug from query parameter
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug') || 'crans-luxury-lodge';
    
    console.log(`Debug DirectusHotel API: Fetching hotel with slug="${slug}"`);
    
    // Construct the API URL
    const apiUrl = `${DIRECTUS_URL}/items/hotels?filter%5Bslug%5D%5B_eq%5D=${encodeURIComponent(slug)}`;
    console.log(`API URL: ${apiUrl}`);
    
    // Safety check for API token
    if (!API_TOKEN) {
      return NextResponse.json({
        success: false,
        error: 'API Token is not configured',
      }, { status: 500 });
    }
    
    // Execute the API request
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });
    
    if (!response.ok) {
      return NextResponse.json({ 
        success: false, 
        error: `API error: ${response.status} - ${response.statusText}`,
        url: apiUrl
      }, { status: response.status });
    }
    
    // Parse the response
    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Hotel not found',
        slug,
        apiResponse: data
      }, { status: 404 });
    }
    
    // Return success response with hotel data
    return NextResponse.json({ 
      success: true, 
      hotel: data.data[0],
      apiUrl,
      // Only show partial token for security
      token: API_TOKEN ? API_TOKEN.slice(0, 5) + "..." + API_TOKEN.slice(-5) : null
    });
  } catch (error) {
    // Enhanced error handling
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