/**
 * Enhanced Directus client with caching, retry mechanisms, circuit breaker, and type safety
 */

import { rest, readItems, readItem, readSingleton } from '@directus/sdk';
import { 
  directusAdminRest, 
  directusPublicRest,
  Schema,
  Hotel,
  Destination,
  Category,
  Room,
  Page,
  Translation
} from './directus';
import { CacheOptions } from '../types/api';
import { 
  generateCacheKey, 
  withCache, 
  DEFAULT_CACHE_OPTIONS,
  invalidateCache
} from './api-cache';
import { withCircuitBreaker, CircuitOpenError } from './circuit-breaker';

/**
 * Maximum number of retry attempts for API requests
 */
const MAX_RETRIES = 3;

/**
 * Base delay for exponential backoff in milliseconds
 */
const BASE_RETRY_DELAY = 300;

/**
 * Default revalidation times for different entity types
 */
export const REVALIDATE_TIMES = {
  HOTEL: 60 * 5, // 5 minutes
  HOTELS: 60 * 5, // 5 minutes
  DESTINATION: 60 * 10, // 10 minutes
  DESTINATIONS: 60 * 10, // 10 minutes
  CATEGORY: 60 * 30, // 30 minutes
  CATEGORIES: 60 * 30, // 30 minutes
  PAGE: 60 * 60, // 1 hour
  NAVIGATION: 60 * 60, // 1 hour
  TRANSLATIONS: 60 * 60 * 24, // 24 hours
};

/**
 * Helper for retry logic with exponential backoff and circuit breaker
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    retries?: number;
    initialDelay?: number;
    onRetry?: (attempt: number, error: Error) => void;
    circuitName?: string;
  } = {}
): Promise<T> {
  const { 
    retries = MAX_RETRIES, 
    initialDelay = BASE_RETRY_DELAY,
    onRetry = (attempt, error) => console.warn(`Retry attempt ${attempt} after error:`, error.message),
    circuitName = 'directus-default'
  } = options;
  
  let lastError: Error;
  
  // Create a function that will be protected by the circuit breaker
  const executeWithRetries = async (): Promise<T> => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Make the actual request
        return await fn();
      } catch (error) {
        // Store error for potential rethrow
        lastError = error instanceof Error 
          ? error 
          : new Error(String(error));
        
        // If this is our last attempt, don't retry
        if (attempt === retries) {
          break;
        }
        
        // Calculate delay with exponential backoff and jitter
        const delay = initialDelay * Math.pow(2, attempt) + Math.random() * 100;
        
        // Call the retry callback
        onRetry(attempt + 1, lastError);
        
        // Wait before the next retry
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // All retries failed
    throw lastError!;
  };
  
  // Wrap with circuit breaker protection
  try {
    return await withCircuitBreaker(executeWithRetries, circuitName, {
      failureThreshold: 50,          // 50% failure rate opens circuit
      requestVolumeThreshold: 20,    // Minimum 20 requests before calculating failure rate
      resetTimeout: 30000,           // 30 seconds before attempting to recover
      halfOpenSuccessThreshold: 3    // 3 consecutive successes to close circuit
    });
  } catch (error) {
    // If circuit is open, enhance the error message
    if (error instanceof CircuitOpenError) {
      console.error(`Circuit '${circuitName}' open for Directus API - too many failures`);
    }
    throw error;
  }
}

/**
 * Get hotels with caching and retries
 */
export async function getHotelsWithCache(options: {
  limit?: number;
  offset?: number;
  sort?: Array<"tags" | "categories" | "slug" | "status" | "id" | "date_created" | "country" | "region" | "sort" | "name" | "destination" | "price_from" | "-price_from" | "address" | "location" | string>;
  filter?: Record<string, any>;
  fields?: Array<"*" | keyof Hotel | string>;
  bypassCache?: boolean;
} = {}): Promise<Hotel[]> {
  const {
    limit = 100,
    offset = 0,
    sort = ['-date_created'],
    filter = { status: { _eq: 'published' } },
    fields = ['*', 'main_image.*'],
    bypassCache = false
  } = options;
  
  // Generate cache key
  const cacheKey = generateCacheKey('hotels', { limit, offset, sort, filter, fields });
  
  // Define cache options
  const cacheOptions: CacheOptions = {
    ...DEFAULT_CACHE_OPTIONS,
    ttl: REVALIDATE_TIMES.HOTELS,
    tags: ['hotels']
  };
  
  // Define the fetch function
  const fetchHotels = async () => {
    return withRetry(
      async () => {
      if (process.env.IS_MOCK_SERVER === 'true') {
        // Mock mode implementation (using dynamic import to avoid server issues)
        const { promises: fs } = await import('fs');
        const path = await import('path');
        
        try {
          const mockDataPath = path.join(process.cwd(), 'mock-directus/data/hotels.json');
          const data = await fs.readFile(mockDataPath, 'utf8');
          let hotels = JSON.parse(data);
          
          // Simple filtering
          if (filter.status && filter.status._eq) {
            hotels = hotels.filter((h: any) => h.status === filter.status._eq);
          }
          
          if (filter.is_featured !== undefined) {
            hotels = hotels.filter((h: any) => h.is_featured === filter.is_featured._eq);
          }
          
          if (filter.destination && filter.destination._eq) {
            hotels = hotels.filter((h: any) => h.destination === filter.destination._eq);
          }
          
          if (filter.categories && filter.categories._contains) {
            hotels = hotels.filter((h: any) => {
              const hotelCategories = h.categories || [];
              const filterCategories = filter.categories._contains;
              
              return filterCategories.some((cat: string) => 
                hotelCategories.includes(cat)
              );
            });
          }
          
          // Apply sort and pagination
          return hotels.slice(offset, offset + limit);
        } catch (mockError) {
          console.error('Error reading mock hotel data:', mockError);
          return [];
        }
      }
      
      // Real API request
      return directusPublicRest.request(
        readItems('hotels', {
          limit,
          offset,
          sort: sort as any,
          filter,
          fields: fields as any,
        })
      );
    },
    { circuitName: 'directus-hotels' }
  );
  };
  
  // Execute with caching
  if (bypassCache) {
    return fetchHotels();
  }
  
  return withCache(
    () => fetchHotels(),
    {},
    cacheKey,
    cacheOptions
  );
}

/**
 * Get hotel by slug with caching and retries
 */
export async function getHotelBySlugWithCache(
  slug: string,
  options: {
    bypassCache?: boolean;
  } = {}
): Promise<Hotel | null> {
  const { bypassCache = false } = options;
  
  // Generate cache key
  const cacheKey = generateCacheKey(`hotel:${slug}`);
  
  // Define cache options
  const cacheOptions: CacheOptions = {
    ...DEFAULT_CACHE_OPTIONS,
    ttl: REVALIDATE_TIMES.HOTEL,
    tags: ['hotels', `hotel:${slug}`]
  };
  
  // Define the fetch function
  const fetchHotel = async () => {
    return withRetry(async () => {
      if (process.env.IS_MOCK_SERVER === 'true') {
        // Mock mode implementation
        const { promises: fs } = await import('fs');
        const path = await import('path');
        
        try {
          const mockDataPath = path.join(process.cwd(), 'mock-directus/data/hotels.json');
          const data = await fs.readFile(mockDataPath, 'utf8');
          const hotels = JSON.parse(data);
          
          // Find by slug
          const hotel = hotels.find((h: any) => h.slug === slug && h.status === 'published');
          
          return hotel || null;
        } catch (mockError) {
          console.error(`Error reading mock hotel data for slug ${slug}:`, mockError);
          return null;
        }
      }
      
      // Real API request
      const response = await directusPublicRest.request(
        readItems('hotels', {
          limit: 1,
          filter: {
            slug: { _eq: slug },
            status: { _eq: 'published' },
          },
          fields: [
            '*',
            'main_image',
            'gallery',
            'rooms',
            'destination',
          ] as any,
        })
      );
      
      return response[0] || null;
    },
    { circuitName: 'directus-hotel-by-slug' }
  );
  };
  
  // Execute with caching
  if (bypassCache) {
    return fetchHotel();
  }
  
  return withCache(
    () => fetchHotel(),
    {},
    cacheKey,
    cacheOptions
  );
}

/**
 * Get destinations with caching and retries
 */
export async function getDestinationsWithCache(options: {
  limit?: number;
  offset?: number;
  sort?: Array<"tags" | "categories" | "slug" | "status" | "id" | "date_created" | "country" | "region" | "sort" | "name" | "price_from" | "-price_from" | string>;
  filter?: Record<string, any>;
  fields?: Array<"*" | keyof Destination | string>;
  bypassCache?: boolean;
} = {}): Promise<Destination[]> {
  const {
    limit = 100,
    offset = 0,
    sort = ['-date_created'],
    filter = { status: { _eq: 'published' } },
    fields = ['*', 'main_image.*'],
    bypassCache = false
  } = options;
  
  // Generate cache key
  const cacheKey = generateCacheKey('destinations', { limit, offset, sort, filter, fields });
  
  // Define cache options
  const cacheOptions: CacheOptions = {
    ...DEFAULT_CACHE_OPTIONS,
    ttl: REVALIDATE_TIMES.DESTINATIONS,
    tags: ['destinations']
  };
  
  // Define the fetch function
  const fetchDestinations = async () => {
    return withRetry(async () => {
      if (process.env.IS_MOCK_SERVER === 'true') {
        // Mock mode implementation
        const { promises: fs } = await import('fs');
        const path = await import('path');
        
        try {
          const mockDataPath = path.join(process.cwd(), 'mock-directus/data/destinations.json');
          const data = await fs.readFile(mockDataPath, 'utf8');
          let destinations = JSON.parse(data);
          
          // Simple filtering
          if (filter.status && filter.status._eq) {
            destinations = destinations.filter((d: any) => d.status === filter.status._eq);
          }
          
          if (filter.is_featured !== undefined) {
            destinations = destinations.filter((d: any) => d.is_featured === filter.is_featured._eq);
          }
          
          if (filter.is_popular !== undefined) {
            destinations = destinations.filter((d: any) => d.is_popular === filter.is_popular._eq);
          }
          
          if (filter.region && filter.region._eq) {
            destinations = destinations.filter((d: any) => d.region === filter.region._eq);
          }
          
          // Apply sort and pagination
          return destinations.slice(offset, offset + limit);
        } catch (mockError) {
          console.error('Error reading mock destination data:', mockError);
          return [];
        }
      }
      
      // Real API request
      return directusPublicRest.request(
        readItems('destinations', {
          limit,
          offset,
          sort: sort as any,
          filter,
          fields: fields as any,
        })
      );
    },
    { circuitName: 'directus-destinations' }
  );
  };
  
  // Execute with caching
  if (bypassCache) {
    return fetchDestinations();
  }
  
  return withCache(
    () => fetchDestinations(),
    {},
    cacheKey,
    cacheOptions
  );
}

/**
 * Get destination by slug with caching and retries
 */
export async function getDestinationBySlugWithCache(
  slug: string,
  options: {
    bypassCache?: boolean;
  } = {}
): Promise<Destination | null> {
  const { bypassCache = false } = options;
  
  // Generate cache key
  const cacheKey = generateCacheKey(`destination:${slug}`);
  
  // Define cache options
  const cacheOptions: CacheOptions = {
    ...DEFAULT_CACHE_OPTIONS,
    ttl: REVALIDATE_TIMES.DESTINATION,
    tags: ['destinations', `destination:${slug}`]
  };
  
  // Define the fetch function
  const fetchDestination = async () => {
    return withRetry(async () => {
      if (process.env.IS_MOCK_SERVER === 'true') {
        // Mock mode implementation
        const { promises: fs } = await import('fs');
        const path = await import('path');
        
        try {
          const mockDataPath = path.join(process.cwd(), 'mock-directus/data/destinations.json');
          const data = await fs.readFile(mockDataPath, 'utf8');
          const destinations = JSON.parse(data);
          
          // Find by slug
          const destination = destinations.find((d: any) => d.slug === slug && d.status === 'published');
          return destination || null;
        } catch (mockError) {
          console.error(`Error reading mock destination data for slug ${slug}:`, mockError);
          return null;
        }
      }
      
      // Real API request
      const response = await directusPublicRest.request(
        readItems('destinations', {
          limit: 1,
          filter: {
            slug: { _eq: slug },
            status: { _eq: 'published' },
          },
          fields: [
            '*',
            'main_image',
            'gallery',
            'highlights',
            'activities',
            'dining',
            'signature_dishes',
            'chef_spotlight',
          ] as any,
        })
      );
      
      return response[0] || null;
    },
    { circuitName: 'directus-destination-by-slug' }
  );
  };
  
  // Execute with caching
  if (bypassCache) {
    return fetchDestination();
  }
  
  return withCache(
    () => fetchDestination(),
    {},
    cacheKey,
    cacheOptions
  );
}

/**
 * Get categories with caching and retries
 */
export async function getCategoriesWithCache(options: {
  type?: 'hotel' | 'destination' | 'both';
  featured?: boolean;
  bypassCache?: boolean;
} = {}): Promise<Category[]> {
  const { type, featured, bypassCache = false } = options;
  
  // Generate cache key
  const cacheKey = generateCacheKey('categories', { type, featured });
  
  // Define cache options
  const cacheOptions: CacheOptions = {
    ...DEFAULT_CACHE_OPTIONS,
    ttl: REVALIDATE_TIMES.CATEGORIES,
    tags: ['categories']
  };
  
  // Define the fetch function
  const fetchCategories = async () => {
    return withRetry(async () => {
      // Build filter object
      const filter: Record<string, any> = {};
      
      if (type) {
        filter.type = { _in: [type, 'both'] };
      }
      
      if (featured !== undefined) {
        filter.featured = { _eq: featured };
      }
      
      if (process.env.IS_MOCK_SERVER === 'true') {
        // Mock mode implementation
        const { promises: fs } = await import('fs');
        const path = await import('path');
        
        try {
          const mockDataPath = path.join(process.cwd(), 'mock-directus/data/categories.json');
          const data = await fs.readFile(mockDataPath, 'utf8');
          let categories = JSON.parse(data);
          
          // Filter by type
          if (type) {
            categories = categories.filter((c: any) => c.type === type || c.type === 'both');
          }
          
          // Filter by featured
          if (featured !== undefined) {
            categories = categories.filter((c: any) => c.featured === featured);
          }
          
          return categories;
        } catch (mockError) {
          console.error('Error reading mock category data:', mockError);
          return [];
        }
      }
      
      // Real API request
      return directusPublicRest.request(
        readItems('categories', {
          filter,
          sort: ['sort'] as any,
          fields: ['*', 'image'] as any,
        })
      );
    },
    { circuitName: 'directus-categories' }
  );
  };
  
  // Execute with caching
  if (bypassCache) {
    return fetchCategories();
  }
  
  return withCache(
    () => fetchCategories(),
    {},
    cacheKey,
    cacheOptions
  );
}

/**
 * Get navigation pages with caching
 */
export async function getNavigationPagesWithCache(options: {
  bypassCache?: boolean;
} = {}): Promise<{ id: string; title: string; slug: string }[]> {
  const { bypassCache = false } = options;
  
  // Generate cache key
  const cacheKey = generateCacheKey('navigation');
  
  // Define cache options
  const cacheOptions: CacheOptions = {
    ...DEFAULT_CACHE_OPTIONS,
    ttl: REVALIDATE_TIMES.NAVIGATION,
    tags: ['navigation', 'pages']
  };
  
  // Define the fetch function
  const fetchNavigation = async () => {
    return withRetry(async () => {
      const response = await directusPublicRest.request(
        readItems('pages', {
          filter: {
            show_in_navigation: { _eq: true },
            status: { _eq: 'published' },
          },
          sort: ['sort'] as any,
          fields: ['id', 'title', 'slug'] as any,
        })
      );
      
      return response as unknown as { id: string; title: string; slug: string }[];
    },
    { circuitName: 'directus-navigation' }
  );
  };
  
  // Execute with caching
  if (bypassCache) {
    return fetchNavigation();
  }
  
  return withCache(
    () => fetchNavigation(),
    {} as { id: string; title: string; slug: string }[],
    cacheKey,
    cacheOptions
  );
}

/**
 * Get translations by language with caching
 */
export async function getTranslationsWithCache(
  language: "en-US" | "de-DE" | "ar-AE" | "he-IL",
  options: {
    bypassCache?: boolean;
  } = {}
): Promise<Record<string, string>> {
  const { bypassCache = false } = options;
  
  // Generate cache key
  const cacheKey = generateCacheKey(`translations:${language}`);
  
  // Define cache options
  const cacheOptions: CacheOptions = {
    ...DEFAULT_CACHE_OPTIONS,
    ttl: REVALIDATE_TIMES.TRANSLATIONS,
    tags: ['translations', `translations:${language}`]
  };
  
  // Define the fetch function
  const fetchTranslations = async () => {
    return withRetry(async () => {
      const response = await directusPublicRest.request(
        readItems('translations', {
          filter: {
            language: { _eq: language },
          },
          fields: ['key', 'value'] as any,
        })
      );
      
      // Convert to object format
      const translationsObject: Record<string, string> = {};
      (response as unknown as Translation[]).forEach((item: Translation) => {
        translationsObject[item.key] = item.value;
      });
      
      return translationsObject;
    },
    { circuitName: 'directus-translations' }
  );
  };
  
  // Execute with caching
  if (bypassCache) {
    return fetchTranslations();
  }
  
  return withCache(
    () => fetchTranslations(),
    {},
    cacheKey,
    cacheOptions
  );
}

/**
 * Invalidate cache for specific entity types
 */
export function invalidateEntityCache(entityType: string, id?: string): void {
  switch (entityType.toLowerCase()) {
    case 'hotel':
    case 'hotels':
      if (id) {
        invalidateCache({ tags: [`hotel:${id}`] });
      } else {
        invalidateCache({ tags: ['hotels'] });
      }
      break;
      
    case 'destination':
    case 'destinations':
      if (id) {
        invalidateCache({ tags: [`destination:${id}`] });
      } else {
        invalidateCache({ tags: ['destinations'] });
      }
      break;
      
    case 'category':
    case 'categories':
      invalidateCache({ tags: ['categories'] });
      break;
      
    case 'page':
    case 'pages':
      invalidateCache({ tags: ['pages'] });
      // Also invalidate navigation as it might be affected
      invalidateCache({ tags: ['navigation'] });
      break;
      
    case 'translation':
    case 'translations':
      if (id) {
        // ID here would be the language code
        invalidateCache({ tags: [`translations:${id}`] });
      } else {
        invalidateCache({ tags: ['translations'] });
      }
      break;
      
    case 'all':
      invalidateCache();
      break;
      
    default:
      console.warn(`Unknown entity type for cache invalidation: ${entityType}`);
  }
}