/**
 * Custom hooks for fetching data from Directus CMS with SWR for client-side data fetching
 * With enhanced error handling and type safety
 */
import useSWR from 'swr';
import { 
  getHotels, 
  getHotelBySlug, 
  getDestinations, 
  getDestinationBySlug,
  getHotelsByDestination,
  getRoomsByHotel,
  getCategories,
  getPageBySlug,
  getNavigationPages
} from '../lib/directus';
import { ApiError } from '../types/api';
import { errorLogger, ErrorSeverity } from '../lib/error-logger';

// Enhanced fetcher function with error handling
const fetcher = async (url: string) => {
  try {
    const startTime = performance.now();
    const response = await fetch(url);
    const duration = performance.now() - startTime;
    
    // Log slow requests (client-side)
    if (duration > 1000) {
      errorLogger.logWarning(
        `Slow client fetch: ${url} took ${duration.toFixed(2)}ms`,
        {
          source: 'client-performance',
          data: { duration, url },
          tags: ['performance', 'client']
        },
        'SLOW_CLIENT_REQUEST'
      );
    }

    // Handle non-2xx responses
    if (!response.ok) {
      let errorData: ApiError;
      
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = {
          message: `Network response was not ok: ${response.statusText}`,
          statusCode: response.status,
          code: 'FETCH_ERROR'
        };
      }
      
      // Log client-side fetch errors
      errorLogger.logApiError(
        errorData,
        {
          source: 'client-fetch',
          request: {
            method: 'GET',
            path: url
          },
          tags: ['client', 'fetch', url.split('?')[0].split('/').pop() || 'unknown']
        },
        response.status >= 500 ? ErrorSeverity.ERROR : ErrorSeverity.WARNING
      );
      
      throw errorData;
    }
    
    return response.json();
  } catch (error) {
    if (!(error as ApiError).statusCode && !(error as ApiError).code) {
      // Capture and format network errors
      const networkError: ApiError = {
        message: error instanceof Error ? error.message : 'Network request failed',
        code: 'NETWORK_ERROR',
        statusCode: 0,
        details: { originalError: error }
      };
      
      // Log network errors
      errorLogger.logApiError(
        networkError,
        {
          source: 'client-fetch',
          request: {
            method: 'GET',
            path: url
          },
          tags: ['client', 'network', 'fetch']
        },
        ErrorSeverity.WARNING
      );
      
      throw networkError;
    }
    
    throw error;
  }
};

/**
 * Hook to fetch hotels with filters
 */
export function useHotels(options: {
  limit?: number;
  offset?: number;
  featured?: boolean;
  categories?: string[];
  destination?: string;
  revalidate?: number;
} = {}) {
  const { 
    limit = 100, 
    offset = 0, 
    featured, 
    categories,
    destination,
    revalidate = 60 // 1 minute cache
  } = options;

  // Build filter object
  const filter: Record<string, any> = { status: { _eq: 'published' } };
  
  if (featured !== undefined) {
    filter.is_featured = { _eq: featured };
  }
  
  if (categories && categories.length > 0) {
    filter.categories = { _contains: categories };
  }
  
  if (destination) {
    filter.destination = { _eq: destination };
  }

  const { data, error, isLoading, mutate } = useSWR(
    `/api/hotels?limit=${limit}&offset=${offset}&filter=${JSON.stringify(filter)}`,
    fetcher,
    { 
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      refreshInterval: revalidate * 1000,
      shouldRetryOnError: (error) => {
        // Don't retry on 4xx errors, retry on 503 (circuit breaker) and other 5xx
        const status = (error as ApiError)?.statusCode || 0;
        return status >= 500 && status !== 503;
      },
      errorRetryCount: 3
    }
  );

  // Handle specific error processing
  if (error) {
    const apiError = error as ApiError;
    
    // If circuit is open, log a more specific error
    if (apiError.code === 'SERVICE_UNAVAILABLE') {
      console.warn('Hotel service temporarily unavailable due to high error rate');
    }
  }

  return {
    hotels: data?.data || [],
    isLoading,
    isError: error,
    error: error as ApiError | null,
    mutate
  };
}

/**
 * Hook to fetch a hotel by slug
 */
export function useHotel(slug: string | undefined, revalidate = 60) {
  const { data, error, isLoading, mutate } = useSWR(
    slug ? `/api/hotels/${slug}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      refreshInterval: revalidate * 1000,
      shouldRetryOnError: (error) => {
        // Don't retry on 4xx errors, retry on other 5xx
        const status = (error as ApiError)?.statusCode || 0;
        return status >= 500 && status !== 503;
      },
      errorRetryCount: 2
    }
  );

  return {
    hotel: data?.data || null,
    isLoading,
    isError: error,
    error: error as ApiError | null,
    mutate
  };
}

/**
 * Hook to fetch destinations with filters
 */
export function useDestinations(options: {
  limit?: number;
  offset?: number;
  featured?: boolean;
  popular?: boolean;
  categories?: string[];
  region?: string;
  revalidate?: number;
} = {}) {
  const { 
    limit = 100, 
    offset = 0, 
    featured, 
    popular,
    categories,
    region,
    revalidate = 60 // 1 minute cache
  } = options;

  // Build filter object
  const filter: Record<string, any> = { status: { _eq: 'published' } };
  
  if (featured !== undefined) {
    filter.is_featured = { _eq: featured };
  }
  
  if (popular !== undefined) {
    filter.is_popular = { _eq: popular };
  }
  
  if (categories && categories.length > 0) {
    filter.categories = { _contains: categories };
  }
  
  if (region) {
    filter.region = { _eq: region };
  }

  const { data, error, isLoading, mutate } = useSWR(
    `/api/destinations?limit=${limit}&offset=${offset}&filter=${JSON.stringify(filter)}`,
    fetcher,
    { 
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      refreshInterval: revalidate * 1000,
      shouldRetryOnError: (error) => {
        // Don't retry on 4xx errors, retry on other 5xx
        const status = (error as ApiError)?.statusCode || 0;
        return status >= 500 && status !== 503;
      }
    }
  );

  return {
    destinations: data?.data || [],
    isLoading,
    isError: error,
    error: error as ApiError | null,
    mutate
  };
}

/**
 * Hook to fetch a destination by slug
 */
export function useDestination(slug: string | undefined, revalidate = 60) {
  const { data, error, isLoading, mutate } = useSWR(
    slug ? `/api/destinations/${slug}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      refreshInterval: revalidate * 1000,
      shouldRetryOnError: (error) => {
        // Don't retry on 4xx errors, retry on other 5xx
        const status = (error as ApiError)?.statusCode || 0;
        return status >= 500 && status !== 503;
      }
    }
  );

  return {
    destination: data?.data || null,
    isLoading,
    isError: error,
    error: error as ApiError | null,
    mutate
  };
}

/**
 * Hook to fetch categories
 */
export function useCategories(options: {
  type?: 'hotel' | 'destination' | 'both';
  featured?: boolean;
  revalidate?: number;
} = {}) {
  const { 
    type, 
    featured,
    revalidate = 300 // 5 minutes cache
  } = options;

  // Build query string
  let queryString = '/api/categories?';
  if (type) {
    queryString += `type=${type}&`;
  }
  if (featured !== undefined) {
    queryString += `featured=${featured}&`;
  }

  const { data, error, isLoading, mutate } = useSWR(
    queryString,
    fetcher,
    { 
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      refreshInterval: revalidate * 1000,
      shouldRetryOnError: (error) => {
        // Don't retry on 4xx errors, retry on other 5xx
        const status = (error as ApiError)?.statusCode || 0;
        return status >= 500 && status !== 503;
      }
    }
  );

  return {
    categories: data?.data || [],
    isLoading,
    isError: error,
    error: error as ApiError | null,
    mutate
  };
}

/**
 * Hook to fetch a page by slug
 */
export function usePage(slug: string | undefined, revalidate = 300) {
  const { data, error, isLoading, mutate } = useSWR(
    slug ? `/api/pages/${slug}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      refreshInterval: revalidate * 1000,
      shouldRetryOnError: (error) => {
        // Don't retry on 4xx errors, retry on other 5xx
        const status = (error as ApiError)?.statusCode || 0;
        return status >= 500 && status !== 503;
      }
    }
  );

  return {
    page: data?.data || null,
    isLoading,
    isError: error,
    error: error as ApiError | null,
    mutate
  };
}

/**
 * Hook to fetch navigation pages
 */
export function useNavigation(revalidate = 3600) { // 1 hour cache
  const { data, error, isLoading, mutate } = useSWR(
    '/api/navigation',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      refreshInterval: revalidate * 1000,
      shouldRetryOnError: (error) => {
        // Don't retry on 4xx errors, retry on other 5xx
        const status = (error as ApiError)?.statusCode || 0;
        return status >= 500 && status !== 503;
      }
    }
  );

  return {
    navItems: data?.data || [],
    isLoading,
    isError: error,
    error: error as ApiError | null,
    mutate
  };
}