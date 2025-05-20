/**
 * API Route for individual Category by slug
 * Acts as a proxy to Directus API to avoid CORS and authorization issues
 */

import { NextResponse } from 'next/server';
import { getCategoryBySlug } from '../../../../lib/api/directus-server';

// Set to dynamic rendering to ensure data is fresh
export const dynamic = 'force-dynamic';

/**
 * GET handler for /api/categories/[slug]
 * @param {Request} request - The incoming request
 * @param {Object} params - Route parameters including slug
 * @returns {Promise<Response>} JSON response with category data
 */
export async function GET(request, { params }) {
  try {
    // Extract the slug from route parameters
    const { slug } = params;
    
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'de-DE';
    
    // Fetch category by slug
    const result = await getCategoryBySlug(slug, locale);
    
    // Check if category was found
    if (!result.data) {
      return NextResponse.json(
        { error: `Category not found: ${slug}` }, 
        { status: 404 }
      );
    }
    
    // Return the processed data
    return NextResponse.json(result.data, {
      status: 200,
      headers: {
        'Cache-Control': `s-maxage=${process.env.NEXT_PUBLIC_REVALIDATE_CATEGORY || 1800}, stale-while-revalidate`
      }
    });
  } catch (error) {
    console.error(`API Error in /api/categories/${params?.slug}:`, error);
    
    // Return a structured error response
    return NextResponse.json(
      { 
        error: 'Failed to fetch category', 
        message: error.message 
      }, 
      { status: 500 }
    );
  }
}