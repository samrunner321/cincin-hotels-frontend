/**
 * API utilities for error handling, response formatting, and request processing
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiError, ApiQueryParams, ApiResponse, CacheOptions } from '../types/api';
import { getCacheControlHeader } from './api-cache';

/**
 * Helper to safely parse JSON
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch (e) {
    return fallback;
  }
}

/**
 * Extract and parse query parameters from a Next.js request
 */
export function extractQueryParams<T extends ApiQueryParams>(
  request: NextRequest,
  defaults: Partial<T> = {}
): T {
  const searchParams = request.nextUrl.searchParams;
  const params: Record<string, any> = { ...defaults };

  // Extract standard pagination parameters
  if (searchParams.has('limit')) {
    params.limit = parseInt(searchParams.get('limit') as string, 10);
  }

  if (searchParams.has('offset')) {
    params.offset = parseInt(searchParams.get('offset') as string, 10);
  }

  if (searchParams.has('page')) {
    params.page = parseInt(searchParams.get('page') as string, 10);
  }

  // Extract sorting parameters
  if (searchParams.has('sort')) {
    const sortValue = searchParams.get('sort');
    if (sortValue?.startsWith('-')) {
      params.sortBy = sortValue.substring(1);
      params.sortDirection = 'desc';
    } else {
      params.sortBy = sortValue;
      params.sortDirection = 'asc';
    }
  }

  // Extract filter parameters
  if (searchParams.has('filter')) {
    const filterJson = searchParams.get('filter');
    params.filter = safeJsonParse(filterJson as string, {});
  }

  // Extract field selection
  if (searchParams.has('fields')) {
    const fieldsValue = searchParams.get('fields');
    params.fields = fieldsValue?.split(',');
  }

  // Extract locale
  if (searchParams.has('locale')) {
    params.locale = searchParams.get('locale') as string;
  }

  // Extract search query
  if (searchParams.has('search') || searchParams.has('query')) {
    params.search = (searchParams.get('search') || searchParams.get('query')) as string;
  }

  // Extract bypass cache flag
  if (searchParams.has('bypassCache')) {
    params.bypassCache = searchParams.get('bypassCache') === 'true';
  }

  // Process all other parameters
  searchParams.forEach((value, key) => {
    // Skip parameters we've already processed
    if (['limit', 'offset', 'page', 'sort', 'filter', 'fields', 'locale', 'search', 'query', 'bypassCache'].includes(key)) {
      return;
    }

    // Convert boolean strings
    if (value === 'true' || value === 'false') {
      params[key] = value === 'true';
    }
    // Convert numeric strings
    else if (/^-?\d+(\.\d+)?$/.test(value)) {
      params[key] = Number(value);
    }
    // Handle comma-separated values as arrays
    else if (value.includes(',')) {
      params[key] = value.split(',');
    }
    // Keep as string
    else {
      params[key] = value;
    }
  });

  return params as T;
}

/**
 * Create a successful API response
 */
export function createSuccessResponse<T>(
  data: T,
  options: {
    status?: number;
    cache?: Partial<CacheOptions>;
    meta?: Record<string, any>;
  } = {}
): NextResponse {
  const { status = 200, cache, meta } = options;

  // Prepare response data
  const responseBody: ApiResponse<T> = {
    status: 'success',
    data,
    meta
  };

  // Set cache headers if provided
  const headers: Record<string, string> = {};
  if (cache) {
    headers['Cache-Control'] = getCacheControlHeader(cache);
  }

  // Return formatted response
  return NextResponse.json(responseBody, {
    status,
    headers
  });
}

/**
 * Create an error API response
 */
export function createErrorResponse(
  error: Error | ApiError | string,
  options: {
    status?: number;
    code?: string;
    details?: Record<string, any>;
  } = {}
): NextResponse {
  // Default status code
  const status = options.status || 500;

  // Format error object
  let errorObj: ApiError;

  if (typeof error === 'string') {
    errorObj = {
      code: options.code || 'INTERNAL_SERVER_ERROR',
      status,
      message: error,
      details: options.details
    };
  } else if ('code' in error) {
    errorObj = {
      ...error,
      status: error.status || status,
      code: error.code || options.code || 'INTERNAL_SERVER_ERROR',
      details: error.details || options.details
    };
  } else {
    // Check if it's a real Error object
    if (error instanceof Error) {
      errorObj = {
        code: options.code || 'INTERNAL_SERVER_ERROR',
        status,
        message: error.message || 'An unexpected error occurred',
        details: {
          ...options.details,
          name: error.name,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }
      };
    } else {
      // It's already an ApiError or something else
      errorObj = {
        code: options.code || 'INTERNAL_SERVER_ERROR',
        status,
        message: error.message || 'An unexpected error occurred',
        details: {
          ...options.details
          // No name or stack since we don't know if they exist
        }
      };
    }
  }

  // Return formatted error response
  return NextResponse.json({
    error: errorObj
  }, {
    status: errorObj.status
  });
}

/**
 * Handle API errors with consistent logging and response formatting
 */
import { errorLogger, ErrorSeverity, normalizeError, ApiPerformanceMonitor } from './error-logger';

export function handleApiError(
  error: unknown,
  context: {
    endpoint: string;
    method: string;
    params?: Record<string, any>;
  }
): NextResponse {
  // Determine error type and details
  const { endpoint, method, params } = context;
  
  // Normalize error to a consistent format
  const normalizedError = normalizeError(error);
  
  // Log with our centralized error logger
  errorLogger.logApiError(normalizedError, {
    source: 'api',
    request: {
      method,
      path: endpoint,
      query: params,
    },
    tags: ['api', endpoint.split('/')[2] || 'root'] // Tag with API category
  }, error instanceof Error && error.name === 'CircuitOpenError' 
      ? ErrorSeverity.CRITICAL 
      : ErrorSeverity.ERROR);

  // Check for specific error types
  if (error instanceof Error) {
    if (error.name === 'ValidationError') {
      return createErrorResponse(error, {
        status: 400,
        code: 'VALIDATION_ERROR'
      });
    }

    if (error.name === 'NotFoundError') {
      return createErrorResponse(error, {
        status: 404,
        code: 'NOT_FOUND'
      });
    }

    if (error.name === 'CircuitOpenError') {
      return createErrorResponse(error, {
        status: 503,
        code: 'SERVICE_UNAVAILABLE',
        details: { 
          retryAfter: 30,
          message: 'API service temporarily unavailable due to high error rate. Please try again later.'
        }
      });
    }

    // If we have an ApiError already, use it
    if ('code' in error && 'status' in error) {
      return createErrorResponse(error as ApiError);
    }

    // Generic error
    return createErrorResponse(error);
  }

  // Handle unknown error types with our normalized error
  return createErrorResponse(normalizedError);
}

/**
 * Validate required parameters
 */
export function validateRequiredParams<T extends Record<string, any>>(
  params: T,
  requiredParams: (keyof T)[]
): { isValid: boolean; missingParams: (keyof T)[] } {
  const missingParams = requiredParams.filter(param => params[param] === undefined);
  return {
    isValid: missingParams.length === 0,
    missingParams
  };
}

/**
 * Create a directus-compatible filter from API params
 */
export function createDirectusFilter(params: Record<string, any>): Record<string, any> {
  const filter: Record<string, any> = { status: { _eq: 'published' } };

  // Common filters
  if (params.id) {
    filter.id = { _eq: params.id };
  }

  if (params.slug) {
    filter.slug = { _eq: params.slug };
  }

  if (params.featured !== undefined) {
    filter.is_featured = { _eq: params.featured };
  }

  // Search
  if (params.search) {
    // This is a simplified implementation - might need to adjust based on Directus version
    filter._or = [
      { name: { _contains: params.search } },
      { description: { _contains: params.search } },
      { short_description: { _contains: params.search } }
    ];
  }

  // Other filters
  if (params.region) {
    filter.region = { _eq: params.region };
  }

  if (params.destination) {
    filter.destination = { _eq: params.destination };
  }

  if (params.type) {
    filter.type = { _in: Array.isArray(params.type) ? params.type : [params.type] };
  }

  // Category filter with different formats
  if (params.category) {
    if (Array.isArray(params.category)) {
      filter.categories = { _contains: params.category };
    } else if (typeof params.category === 'string' && params.category.includes(',')) {
      filter.categories = { _contains: params.category.split(',') };
    } else {
      filter.categories = { _contains: [params.category] };
    }
  }

  // Price range filters
  if (params.minPrice !== undefined) {
    filter.price_from = { ...filter.price_from, _gte: params.minPrice };
  }

  if (params.maxPrice !== undefined) {
    filter.price_from = { ...filter.price_from, _lte: params.maxPrice };
  }

  // Star rating filter
  if (params.minStars !== undefined) {
    filter.star_rating = { _gte: params.minStars };
  }

  return filter;
}