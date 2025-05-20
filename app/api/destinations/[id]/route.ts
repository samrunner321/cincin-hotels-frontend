/**
 * API Route for a specific Destination by ID or slug
 * Enhanced version with TypeScript, caching, and improved error handling
 */

import { NextRequest } from 'next/server';
import { 
  getDestinationBySlugWithCache, 
  getHotelsWithCache,
  REVALIDATE_TIMES
} from '../../../../src/lib/api/cached-directus-client';
import { 
  extractQueryParams, 
  createSuccessResponse, 
  createErrorResponse,
  handleApiError
} from '../../../../src/lib/api-utils';
import { ApiQueryParams } from '../../../../src/types/api';

// Set to dynamic rendering to ensure data is fresh
export const dynamic = 'force-dynamic';

/**
 * GET handler for /api/destinations/:id
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get destination ID or slug from route params
    const { id } = params;
    if (!id) {
      return createErrorResponse('Destination ID is required', {
        status: 400,
        code: 'MISSING_PARAMETER',
      });
    }

    // Extract query parameters
    const queryParams = extractQueryParams<ApiQueryParams>(request);
    
    // Determine whether to include related hotels
    const includeHotels = queryParams.include?.includes('hotels') || 
                         request.nextUrl.searchParams.has('includeHotels');

    // Fetch destination using our enhanced client
    const destination = await getDestinationBySlugWithCache(id, queryParams.locale);

    // If destination not found, return 404
    if (!destination) {
      return createErrorResponse(`Destination with ID or slug '${id}' not found`, {
        status: 404,
        code: 'DESTINATION_NOT_FOUND',
      });
    }

    // If requested, fetch related hotels
    let result = destination;
    if (includeHotels) {
      const hotels = await getHotelsWithCache({
        filter: { destination: { _eq: destination.id } },
        bypassCache: queryParams.bypassCache,
      });
      
      result = {
        ...destination,
        hotels
      };
    }

    // Return success response with cache headers
    return createSuccessResponse(result, {
      cache: {
        enabled: true,
        ttl: REVALIDATE_TIMES.DESTINATION,
        tags: ['destinations', `destination:${id}`],
      },
    });
  } catch (error) {
    // Use our centralized error handler
    return handleApiError(error, {
      endpoint: `/api/destinations/${params.id}`,
      method: 'GET',
      params: { id: params.id, ...Object.fromEntries(request.nextUrl.searchParams) }
    });
  }
}