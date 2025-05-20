/**
 * Webhook endpoint for Directus
 * Handles automatic cache invalidation when content changes
 */

import { NextRequest } from 'next/server';
import { invalidateEntityCache } from '../../../../src/lib/api/cached-directus-client';
import { 
  createSuccessResponse, 
  createErrorResponse,
  handleApiError 
} from '../../../../src/lib/api-utils';

// Set to dynamic rendering
export const dynamic = 'force-dynamic';

// Secret for validation
const WEBHOOK_SECRET = process.env.DIRECTUS_WEBHOOK_SECRET || 'development_secret';

/**
 * Map collection names to entity types for cache invalidation
 */
const COLLECTION_TO_ENTITY_TYPE: Record<string, string> = {
  'hotels': 'hotels',
  'destinations': 'destinations',
  'categories': 'categories',
  'pages': 'pages',
  'translations': 'translations',
  'rooms': 'hotels', // Invalidate hotels when rooms change
};

/**
 * POST handler for /api/webhooks/directus - processes webhooks from Directus
 */
export async function POST(request: NextRequest) {
  try {
    // Get the token from the authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;
    
    // Check the token for authentication
    if (!token || token !== WEBHOOK_SECRET) {
      return createErrorResponse('Invalid token', {
        status: 401,
        code: 'UNAUTHORIZED',
      });
    }
    
    // Parse the request body
    const body = await request.json();
    
    // Extract relevant information from the webhook payload
    const { event, collection, item } = body;
    
    // Skip if event or collection is missing
    if (!event || !collection) {
      return createErrorResponse('Invalid webhook payload', {
        status: 400,
        code: 'INVALID_PAYLOAD',
      });
    }
    
    // Map collection to entity type
    const entityType = COLLECTION_TO_ENTITY_TYPE[collection] || collection;
    
    // Extract entity ID for targeted invalidation
    let entityId: string | undefined;
    
    if (item && (item.id || item.slug)) {
      entityId = item.slug || item.id;
    }
    
    // Perform cache invalidation
    invalidateEntityCache(entityType, entityId);
    
    // Log the invalidation
    console.log(`[Cache Invalidated] ${entityType}${entityId ? ` (${entityId})` : ''} - Event: ${event}`);
    
    // Return success response
    return createSuccessResponse({
      message: `Cache invalidated for ${entityType}${entityId ? ` (${entityId})` : ''}`,
      event,
      collection,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return handleApiError(error, {
      endpoint: '/api/webhooks/directus',
      method: 'POST',
      params: { event: "error" }
    });
  }
}