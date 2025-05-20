/**
 * API Route for Categories
 * Enhanced version with TypeScript, caching, and improved error handling
 */

import { NextRequest } from 'next/server';
import { getCategoriesWithCache, REVALIDATE_TIMES } from '../../../src/lib/api/cached-directus-client';
import { 
  extractQueryParams, 
  createSuccessResponse, 
  handleApiError 
} from '../../../src/lib/api-utils';
import { ApiQueryParams } from '../../../src/types/api';

// Set to dynamic rendering to ensure data is fresh
export const dynamic = 'force-dynamic';

/**
 * GET handler for /api/categories
 */
export async function GET(request: NextRequest) {
  try {
    // Extract and parse query parameters
    const params = extractQueryParams<ApiQueryParams>(request);
    
    // Extract category-specific parameters
    const { type, featured, bypassCache } = params;
    
    // Fetch categories using our enhanced client
    const categories = await getCategoriesWithCache({
      type: type as 'hotel' | 'destination' | 'both',
      featured,
      bypassCache,
    });

    // Return success response with cache headers
    return createSuccessResponse(categories, {
      cache: {
        enabled: true,
        ttl: REVALIDATE_TIMES.CATEGORIES,
        tags: ['categories'],
      },
      meta: {
        total: categories.length,
        type,
        featured,
      },
    });
  } catch (error) {
    // Use our centralized error handler
    return handleApiError(error, {
      endpoint: '/api/categories',
      method: 'GET',
      params: Object.fromEntries(request.nextUrl.searchParams)
    });
  }
}