/**
 * API Caching utility for CinCin API endpoints
 * 
 * Provides a lightweight in-memory cache with TTL support, stale-while-revalidate pattern,
 * and distributed cache invalidation.
 */

import { CacheOptions } from '../types/api';

// Cache storage with type enforcement
interface CacheEntry<T = any> {
  data: T;
  expires: number;
  staleUntil: number; // New field for SWR
  tags: string[];
  isRevalidating?: boolean; // Flag to prevent concurrent revalidations
  lastUpdated: number;
}

// In-memory cache store
const cache = new Map<string, CacheEntry>();

// In-flight requests to deduplicate concurrent identical requests
const inFlightRequests = new Map<string, Promise<any>>();

// Default cache options
export const DEFAULT_CACHE_OPTIONS: CacheOptions = {
  enabled: process.env.DISABLE_API_CACHE !== 'true',
  ttl: 60 * 5, // 5 minutes
  swr: 60 * 60, // 1 hour stale-while-revalidate
  tags: [],
};

/**
 * Generate a cache key from request information
 */
export function generateCacheKey(path: string, params?: Record<string, any>): string {
  // For simple requests without parameters, use the path
  if (!params || Object.keys(params).length === 0) {
    return path;
  }
  
  // Otherwise, combine path and serialized parameters
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      // Skip undefined values and the bypassCache parameter itself
      if (params[key] !== undefined && key !== 'bypassCache') {
        acc[key] = params[key];
      }
      return acc;
    }, {} as Record<string, any>);
  
  return `${path}:${JSON.stringify(sortedParams)}`;
}

/**
 * Set a value in the cache
 */
export function setCacheValue<T>(
  key: string, 
  data: T, 
  options: Partial<CacheOptions> = {}
): void {
  // Apply default options
  const { enabled, ttl, swr, tags = [] } = {
    ...DEFAULT_CACHE_OPTIONS,
    ...options,
  };
  
  // Skip if caching is disabled
  if (!enabled) {
    return;
  }
  
  const now = Date.now();
  
  // Calculate expiration times
  const expires = now + ttl * 1000;
  const staleUntil = now + (ttl + swr) * 1000;
  
  // Store in cache
  cache.set(key, {
    data,
    expires,
    staleUntil,
    tags,
    lastUpdated: now,
    isRevalidating: false,
  });
  
  // Cleanup task - set a timeout to remove this entry when completely stale
  setTimeout(() => {
    // Only remove if this exact entry is still there (to avoid race conditions)
    const entry = cache.get(key);
    if (entry && entry.staleUntil === staleUntil) {
      cache.delete(key);
    }
  }, (ttl + swr) * 1000);
}

/**
 * Get a value from the cache
 */
export function getCacheValue<T>(key: string): { data: T | null; isStale: boolean } {
  // Get from cache
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  
  // If not in cache, return null
  if (!entry) {
    return { data: null, isStale: false };
  }
  
  const now = Date.now();
  
  // If completely stale (beyond SWR window), remove and return null
  if (entry.staleUntil < now) {
    cache.delete(key);
    return { data: null, isStale: false };
  }
  
  // If fresh, return data
  if (entry.expires >= now) {
    return { data: entry.data, isStale: false };
  }
  
  // If in SWR window, return data but mark as stale
  return { data: entry.data, isStale: true };
}

/**
 * Invalidate cache entries by tag or key
 */
export function invalidateCache(options: { 
  keys?: string[]; 
  tags?: string[];
  pattern?: RegExp;
  soft?: boolean; // Soft invalidation only marks entries for revalidation instead of deleting
} = {}): void {
  const { keys, tags, pattern, soft = false } = options;
  
  // If no options provided, clear all cache
  if (!keys && !tags && !pattern) {
    cache.clear();
    inFlightRequests.clear();
    return;
  }
  
  // Invalidate by specific keys
  if (keys && keys.length > 0) {
    keys.forEach(key => {
      if (soft) {
        // Mark for revalidation but don't delete
        const entry = cache.get(key);
        if (entry) {
          entry.expires = 0; // Mark as stale
        }
      } else {
        cache.delete(key);
        inFlightRequests.delete(key);
      }
    });
  }
  
  // Invalidate by tags or pattern
  if (tags || pattern) {
    // Check each entry in the cache
    cache.forEach((entry, key) => {
      let shouldInvalidate = false;
      
      // Invalidate by tag
      if (tags && tags.some(tag => entry.tags.includes(tag))) {
        shouldInvalidate = true;
      }
      
      // Invalidate by pattern
      if (!shouldInvalidate && pattern && pattern.test(key)) {
        shouldInvalidate = true;
      }
      
      if (shouldInvalidate) {
        if (soft) {
          // Mark for revalidation but don't delete
          entry.expires = 0; // Mark as stale
        } else {
          cache.delete(key);
          inFlightRequests.delete(key);
        }
      }
    });
  }
}

/**
 * Get cache statistics for monitoring
 */
export function getCacheStats(): {
  size: number;
  keys: string[];
  byTag: Record<string, number>;
  staleEntries: number;
  inFlightRequests: number;
  averageAge: number;
} {
  const now = Date.now();
  let totalAge = 0;
  let staleEntries = 0;
  
  const stats: {
    size: number;
    keys: string[];
    byTag: Record<string, number>;
    staleEntries: number;
    inFlightRequests: number;
    averageAge: number;
  } = {
    size: cache.size,
    keys: Array.from(cache.keys()),
    byTag: {},
    staleEntries: 0,
    inFlightRequests: inFlightRequests.size,
    averageAge: 0,
  };
  
  // Count entries by tag and analyze staleness
  cache.forEach(entry => {
    totalAge += now - entry.lastUpdated;
    
    if (entry.expires < now) {
      staleEntries++;
    }
    
    entry.tags.forEach(tag => {
      stats.byTag[tag] = (stats.byTag[tag] || 0) + 1;
    });
  });
  
  stats.staleEntries = staleEntries;
  stats.averageAge = cache.size > 0 ? totalAge / cache.size : 0;
  
  return stats;
}

/**
 * Background revalidation function that updates the cache without blocking
 */
async function backgroundRevalidate<T, P extends Record<string, any>>(
  fn: (params: P) => Promise<T>,
  params: P,
  cacheKey: string,
  options: CacheOptions
): Promise<void> {
  // Check if entry is already revalidating
  const entry = cache.get(cacheKey);
  if (!entry || entry.isRevalidating) {
    return;
  }
  
  try {
    // Mark as revalidating to prevent concurrent updates
    entry.isRevalidating = true;
    
    // Execute function
    const newResult = await fn(params);
    
    // Update cache with new value
    setCacheValue<T>(cacheKey, newResult, options);
  } catch (error) {
    // On error, just log but keep serving stale data
    console.warn(`Background revalidation failed for ${cacheKey}:`, error);
  } finally {
    // Clear revalidating flag
    const currentEntry = cache.get(cacheKey);
    if (currentEntry) {
      currentEntry.isRevalidating = false;
    }
  }
}

/**
 * Wrap a function call with caching and stale-while-revalidate pattern
 */
export async function withCache<T, P extends Record<string, any>>(
  fn: (params: P) => Promise<T>,
  params: P,
  cacheKey: string,
  options: Partial<CacheOptions> = {}
): Promise<T> {
  // Apply default options
  const cacheOptions = {
    ...DEFAULT_CACHE_OPTIONS,
    ...options,
  };
  
  // Skip cache if disabled or explicitly bypassed
  if (!cacheOptions.enabled || params.bypassCache) {
    return fn(params);
  }
  
  // Check if there's an in-flight request for this key
  const inFlight = inFlightRequests.get(cacheKey);
  if (inFlight) {
    return inFlight as Promise<T>;
  }
  
  // Try to get from cache
  const { data: cached, isStale } = getCacheValue<T>(cacheKey);
  
  // If we have a valid cached response
  if (cached !== null) {
    // If stale, trigger background revalidation
    if (isStale) {
      backgroundRevalidate(fn, params, cacheKey, cacheOptions);
    }
    
    // Return the cached response immediately
    return cached;
  }
  
  // If nothing in cache or expired, fetch new data
  try {
    // Create promise for this request
    const requestPromise = fn(params);
    
    // Store promise to deduplicate concurrent requests
    inFlightRequests.set(cacheKey, requestPromise);
    
    // Wait for result
    const result = await requestPromise;
    
    // Cache the result
    setCacheValue<T>(cacheKey, result, cacheOptions);
    
    return result;
  } finally {
    // Clean up in-flight request
    inFlightRequests.delete(cacheKey);
  }
}

/**
 * Generate Cache-Control header value
 */
export function getCacheControlHeader(options: Partial<CacheOptions> = {}): string {
  const { enabled, ttl, swr } = {
    ...DEFAULT_CACHE_OPTIONS,
    ...options,
  };
  
  if (!enabled) {
    return 'no-store, max-age=0';
  }
  
  if (swr) {
    return `public, max-age=${ttl}, s-maxage=${ttl}, stale-while-revalidate=${swr}`;
  }
  
  return `public, max-age=${ttl}, s-maxage=${ttl}`;
}