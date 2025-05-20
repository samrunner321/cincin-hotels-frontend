/**
 * API Types and Interfaces
 * Contains type definitions for API requests and responses
 */
import { LanguageCode } from '../i18n';

/**
 * Base query parameters that all API endpoints accept
 */
export interface BaseQueryParams {
  /** Whether to bypass the cache for this request */
  bypassCache?: boolean;
}

/**
 * Query parameters for the /api/translations endpoint
 */
export interface TranslationQueryParams extends BaseQueryParams {
  /** The language code to fetch translations for */
  language?: LanguageCode;
}

/**
 * Query parameters for the /api/destinations endpoint
 */
export interface DestinationQueryParams extends BaseQueryParams {
  /** Maximum number of items to return */
  limit?: number;
  /** Number of items to skip */
  offset?: number;
  /** Field to sort by */
  sortBy?: string;
  /** Sort direction */
  sortDirection?: 'asc' | 'desc';
  /** Filter for popular destinations */
  popular?: boolean;
  /** Filter by country */
  country?: string;
  /** Filter by region */
  region?: string;
  /** Specific fields to include in the response */
  fields?: string[];
}

/**
 * Query parameters for the /api/hotels endpoint
 */
export interface HotelQueryParams extends BaseQueryParams {
  /** Maximum number of items to return */
  limit?: number;
  /** Number of items to skip */
  offset?: number;
  /** Field to sort by */
  sortBy?: string;
  /** Sort direction */
  sortDirection?: 'asc' | 'desc';
  /** Filter for featured hotels */
  featured?: boolean;
  /** Filter by destination */
  destination?: string;
  /** Filter by category */
  categories?: string[];
  /** Filter by price range */
  priceRange?: [number, number];
  /** Specific fields to include in the response */
  fields?: string[];
}

/**
 * Query parameters for the /api/categories endpoint
 */
export interface CategoryQueryParams extends BaseQueryParams {
  /** Filter by category type */
  type?: 'hotel' | 'destination' | 'activity' | 'all';
  /** Filter for featured categories */
  featured?: boolean;
}

/**
 * Query parameters for the /api/pages endpoint
 */
export interface PageQueryParams extends BaseQueryParams {
  /** Language code for the page content */
  language?: LanguageCode;
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  /** HTTP status code */
  statusCode: number;
  /** Error message */
  message: string;
  /** Error details */
  details?: any;
}

/**
 * API success response wrapper
 */
export interface ApiSuccessResponse<T> {
  /** Response data */
  data: T;
  /** Response metadata */
  meta?: Record<string, any>;
}

/**
 * Cache configuration for API responses
 */
export interface ApiCacheConfig {
  /** Whether to enable caching for this response */
  enabled: boolean;
  /** Time to live in seconds */
  ttl: number;
  /** Cache tags for invalidation */
  tags?: string[];
}

/**
 * API response options
 */
export interface ApiResponseOptions {
  /** Cache configuration */
  cache?: ApiCacheConfig;
  /** Response metadata */
  meta?: Record<string, any>;
}

/**
 * Error context for API error handling
 */
export interface ApiErrorContext {
  /** Endpoint that encountered the error */
  endpoint: string;
  /** HTTP method */
  method: string;
  /** Query parameters */
  params?: string;
  /** Request body */
  body?: any;
}