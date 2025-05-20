/**
 * API Route for Hotels
 * Enhanced version with TypeScript, caching, and improved error handling
 */

import { NextRequest } from 'next/server';
import { getHotelsWithCache } from '../../../lib/api/directus-client';
import { 
  extractQueryParams, 
  createSuccessResponse, 
  handleApiError, 
  createDirectusFilter 
} from '../../../lib/api-utils';
import { HotelQueryParams } from '../../../lib/types/api';
import { REVALIDATE_TIMES } from '../../../lib/api/directus-client';
import { ApiPerformanceMonitor, errorLogger } from '../../../lib/error-logger';

// Set to dynamic rendering to ensure data is fresh
export const dynamic = 'force-dynamic';

/**
 * GET handler for /api/hotels
 */
export async function GET(request: NextRequest) {
  // Start performance monitoring
  const endTiming = ApiPerformanceMonitor.startTiming('/api/hotels');
  
  try {
    // Extract and parse query parameters with defaults
    const params = extractQueryParams<HotelQueryParams>(request, {
      limit: 100,
      offset: 0,
      sortBy: 'date_created',
      sortDirection: 'desc',
      fields: ['*', 'main_image.*'],
    });

    // Create sort array based on sortBy and sortDirection
    const sort = params.sortBy ? [
      params.sortDirection === 'desc' ? `-${params.sortBy}` : params.sortBy
    ] : [];

    // Prepare Directus filter from parameters
    const filter = createDirectusFilter(params);

    // Add hotel-specific filters
    if (params.categories && params.categories.length > 0) {
      filter.categories = { _contains: params.categories };
    }

    if (params.destination) {
      filter.destination = { _eq: params.destination };
    }

    if (params.priceRange && Array.isArray(params.priceRange) && params.priceRange.length === 2) {
      filter.price_from = { 
        _gte: params.priceRange[0],
        _lte: params.priceRange[1]
      };
    }

    // Prepare additional fields based on includes
    let fields: string[] = ['*', 'main_image.*'];
    if (params.fields && Array.isArray(params.fields) && params.fields.length > 0) {
      // Ensure we have an array of strings without undefined values
      fields = params.fields.filter((field): field is string => field !== undefined);
    }

    // Fetch hotels using our enhanced client
    const hotels = await getHotelsWithCache({
      limit: params.limit,
      offset: params.offset,
      sort,
      filter,
      fields,
      bypassCache: params.bypassCache,
    });

    // Return success response with cache headers
    return createSuccessResponse(hotels, {
      cache: {
        enabled: true,
        ttl: REVALIDATE_TIMES.HOTELS,
        tags: ['hotels'],
      },
      meta: {
        total: hotels.length,
        limit: params.limit,
        offset: params.offset,
      },
    });
  } catch (error) {
    // Use our centralized error handler
    return handleApiError(error, {
      endpoint: '/api/hotels',
      method: 'GET',
      params: { query: request.nextUrl.searchParams.toString() },
    });
  } finally {
    // Record request duration
    const duration = endTiming();
    if (duration > 1000) {
      // Log slow requests
      errorLogger.logWarning(
        `Slow API request: /api/hotels took ${duration.toFixed(2)}ms`,
        {
          source: 'api-performance',
          data: { duration, endpoint: '/api/hotels' },
          tags: ['performance', 'api', 'hotels']
        },
        'SLOW_API_REQUEST'
      );
    }
  }
}