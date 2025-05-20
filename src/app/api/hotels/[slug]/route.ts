/**
 * API Route for a specific Hotel by slug
 * Enhanced version with TypeScript, caching, and improved error handling
 */

import { NextRequest } from 'next/server';
import { getHotelBySlugWithCache } from '../../../../lib/api/directus-client';
import { 
  extractQueryParams, 
  createSuccessResponse, 
  createErrorResponse,
  handleApiError
} from '../../../../lib/api-utils';
import { BaseQueryParams } from '../../../../lib/types/api';
import { REVALIDATE_TIMES } from '../../../../lib/api/directus-client';

// Set to dynamic rendering to ensure data is fresh
export const dynamic = 'force-dynamic';

/**
 * GET handler for /api/hotels/:slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Get hotel slug from route params
    const { slug } = params;
    if (!slug) {
      return createErrorResponse('Hotel slug is required', {
        status: 400,
        code: 'MISSING_PARAMETER',
      });
    }

    // Extract query parameters
    const queryParams = extractQueryParams<BaseQueryParams>(request);

    // Fetch hotel using our enhanced client
    const hotel = await getHotelBySlugWithCache(slug, {
      bypassCache: queryParams.bypassCache,
    });

    // If hotel not found, return 404
    if (!hotel) {
      return createErrorResponse(`Hotel with slug '${slug}' not found`, {
        status: 404,
        code: 'HOTEL_NOT_FOUND',
      });
    }

    // Return success response with cache headers
    return createSuccessResponse(hotel, {
      cache: {
        enabled: true,
        ttl: REVALIDATE_TIMES.HOTEL,
        tags: ['hotels', `hotel:${slug}`],
      },
    });
  } catch (error) {
    // Use our centralized error handler
    return handleApiError(error, {
      endpoint: `/api/hotels/${params.slug}`,
      method: 'GET',
      params: { slug: params.slug } as Record<string, any>,
    });
  }
}