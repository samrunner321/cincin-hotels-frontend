/**
 * API Route for a specific Destination by slug
 * Enhanced version with TypeScript, caching, and improved error handling
 */

import { NextRequest } from 'next/server';
import { getDestinationBySlugWithCache, getHotelsWithCache } from '../../../../lib/directus-client';
import { 
  extractQueryParams, 
  createSuccessResponse, 
  createErrorResponse,
  handleApiError
} from '../../../../lib/api-utils';
import { BaseQueryParams } from '../../../../lib/types/api';
import { REVALIDATE_TIMES } from '../../../../lib/directus-client';

// Set to dynamic rendering to ensure data is fresh
export const dynamic = 'force-dynamic';

/**
 * GET handler for /api/destinations/:slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Get destination slug from route params
    const { slug } = params;
    if (!slug) {
      return createErrorResponse('Destination slug is required', {
        status: 400,
        code: 'MISSING_PARAMETER',
      });
    }

    // Extract query parameters
    const queryParams = extractQueryParams<BaseQueryParams>(request);

    // Fetch destination using our enhanced client
    const destination = await getDestinationBySlugWithCache(slug, {
      bypassCache: queryParams.bypassCache,
    });

    // If destination not found, return 404
    if (!destination) {
      return createErrorResponse(`Destination with slug '${slug}' not found`, {
        status: 404,
        code: 'DESTINATION_NOT_FOUND',
      });
    }

    // Fetch related hotels for this destination
    const hotels = await getHotelsWithCache({
      filter: { 
        destination: { _eq: destination.id },
        status: { _eq: 'published' } 
      },
      bypassCache: queryParams.bypassCache,
    });
    
    // Combine destination data with hotels
    const responseData = {
      ...destination,
      hotels
    };

    // Return success response with cache headers
    return createSuccessResponse(responseData, {
      cache: {
        enabled: true,
        ttl: REVALIDATE_TIMES.DESTINATION,
        tags: ['destinations', `destination:${slug}`],
      },
    });
  } catch (error) {
    // Use our centralized error handler
    return handleApiError(error, {
      endpoint: `/api/destinations/${params.slug}`,
      method: 'GET',
      params: { slug: params.slug } as Record<string, any>,
    });
  }
}