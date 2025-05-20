/**
 * API Route for Cache Invalidation
 * Enables selective cache invalidation via webhooks or admin requests
 */

import { NextRequest } from 'next/server';
import { invalidateEntityCache } from '../../../src/lib/api/cached-directus-client';
import { getCacheStats } from '../../../src/lib/api-cache';
import { 
  createSuccessResponse, 
  createErrorResponse,
  handleApiError 
} from '../../../src/lib/api-utils';

// Set to dynamic rendering
export const dynamic = 'force-dynamic';

// Secret for validation (should be in an environment variable)
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'development_secret';

/**
 * GET handler for /api/revalidate - returns cache stats
 */
export async function GET(request: NextRequest) {
  try {
    // Get the token from the request
    const token = request.nextUrl.searchParams.get('token');
    
    // Check the token for authentication
    if (!token || token !== REVALIDATE_SECRET) {
      return createErrorResponse('Invalid token', {
        status: 401,
        code: 'UNAUTHORIZED',
      });
    }
    
    // Get cache statistics
    const stats = getCacheStats();
    
    // Return stats
    return createSuccessResponse(stats, {
      cache: {
        enabled: false
      }
    });
  } catch (error) {
    return handleApiError(error, {
      endpoint: '/api/revalidate',
      method: 'GET',
      params: Object.fromEntries(request.nextUrl.searchParams)
    });
  }
}

/**
 * POST handler for /api/revalidate - invalidates cache
 */
export async function POST(request: NextRequest) {
  try {
    // Get the token from the request
    const token = request.nextUrl.searchParams.get('token');
    
    // Check the token for authentication
    if (!token || token !== REVALIDATE_SECRET) {
      return createErrorResponse('Invalid token', {
        status: 401,
        code: 'UNAUTHORIZED',
      });
    }
    
    // Parse the request body
    const body = await request.json();
    
    // Extract entity type and ID
    const { entityType, entityId } = body;
    
    // Validate the entity type
    if (!entityType) {
      return createErrorResponse('Entity type is required', {
        status: 400,
        code: 'MISSING_PARAMETER',
      });
    }
    
    // Perform cache invalidation
    invalidateEntityCache(entityType, entityId);
    
    // Return success response
    return createSuccessResponse({
      message: `Cache invalidated for ${entityType}${entityId ? ` (${entityId})` : ''}`,
      timestamp: new Date().toISOString(),
    }, {
      cache: {
        enabled: false
      }
    });
  } catch (error) {
    return handleApiError(error, {
      endpoint: '/api/revalidate',
      method: 'POST',
      params: Object.fromEntries(request.nextUrl.searchParams)
    });
  }
}