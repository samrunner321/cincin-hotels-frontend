/**
 * API Route for Destinations
 * Enhanced version with TypeScript, caching, and improved error handling
 */

import { NextRequest } from 'next/server';
import { getDestinationsWithCache, REVALIDATE_TIMES } from '../../../src/lib/api/cached-directus-client';
import { 
  extractQueryParams, 
  createSuccessResponse, 
  handleApiError, 
  createDirectusFilter 
} from '../../../src/lib/api-utils';
import { ApiQueryParams } from '../../../src/types/api';

// Set to dynamic rendering to ensure data is fresh
export const dynamic = 'force-dynamic';

/**
 * GET handler for /api/destinations
 */
export async function GET(request: NextRequest) {
  try {
    // Extract and parse query parameters with defaults
    const params = extractQueryParams<ApiQueryParams>(request, {
      limit: 100,
      offset: 0,
      sortBy: 'date_created',
      sortDirection: 'desc',
      fields: ['*', 'main_image.*'],
    });

    // Create sort array based on sortBy and sortDirection
    const sort = [
      params.sortDirection === 'desc' ? `-${params.sortBy}` : params.sortBy
    ];

    // Prepare Directus filter from parameters
    const filter = createDirectusFilter(params);

    // Add specific filters for destinations
    if (params.popular !== undefined) {
      filter.is_popular = { _eq: params.popular };
    }

    if (params.country) {
      filter.country = { _eq: params.country };
    }

    // Prepare additional fields based on includes
    let fields = ['*', 'main_image.*'];
    if (params.fields && params.fields.length > 0) {
      fields = params.fields;
    }

    // Fetch destinations using our enhanced client
    const destinations = await getDestinationsWithCache({
      limit: params.limit,
      offset: params.offset,
      sort,
      filter,
      fields,
      bypassCache: params.bypassCache,
    });

    // Return success response with cache headers
    return createSuccessResponse(destinations, {
      cache: {
        enabled: true,
        ttl: REVALIDATE_TIMES.DESTINATIONS,
        tags: ['destinations'],
      },
      meta: {
        total: destinations.length,
        limit: params.limit,
        offset: params.offset,
      },
    });
  } catch (error) {
    // Use our centralized error handler
    return handleApiError(error, {
      endpoint: '/api/destinations',
      method: 'GET',
      params: Object.fromEntries(request.nextUrl.searchParams)
    });
  }
}