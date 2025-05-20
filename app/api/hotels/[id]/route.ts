/**
 * API Route for a specific Hotel by ID or slug
 * Enhanced version with TypeScript, caching, and improved error handling
 */

import { NextRequest } from 'next/server';
import { getHotelBySlugWithCache, REVALIDATE_TIMES } from '../../../../src/lib/api/cached-directus-client';
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
 * GET handler for /api/hotels/:id
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get hotel ID or slug from route params
    const { id } = params;
    if (!id) {
      return createErrorResponse('Hotel ID is required', {
        status: 400,
        code: 'MISSING_PARAMETER',
      });
    }

    // Extract query parameters
    const queryParams = extractQueryParams<ApiQueryParams>(request);

    // Fetch hotel using our enhanced client
    const hotel = await getHotelBySlugWithCache(id, queryParams.locale);

    // If hotel not found, return 404
    if (!hotel) {
      return createErrorResponse(`Hotel with ID or slug '${id}' not found`, {
        status: 404,
        code: 'HOTEL_NOT_FOUND',
      });
    }

    // Return success response with cache headers
    return createSuccessResponse(hotel, {
      cache: {
        enabled: true,
        ttl: REVALIDATE_TIMES.HOTEL,
        tags: ['hotels', `hotel:${id}`],
      },
    });
  } catch (error) {
    // Use our centralized error handler
    return handleApiError(error, {
      endpoint: `/api/hotels/${params.id}`,
      method: 'GET',
      params: { id: params.id, ...Object.fromEntries(request.nextUrl.searchParams) }
    });
  }
}