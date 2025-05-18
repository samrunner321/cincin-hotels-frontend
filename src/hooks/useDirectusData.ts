/**
 * Custom hooks for fetching data from Directus CMS with SWR for client-side data fetching
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
} from '@/lib/directus';

// SWR fetcher function
const fetcher = (url: string) => fetch(url).then((res) => res.json());

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

  const { data, error, isLoading } = useSWR(
    `/api/hotels?limit=${limit}&offset=${offset}&filter=${JSON.stringify(filter)}`,
    fetcher,
    { 
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      refreshInterval: revalidate * 1000
    }
  );

  return {
    hotels: data,
    isLoading,
    isError: error
  };
}

/**
 * Hook to fetch a hotel by slug
 */
export function useHotel(slug: string | undefined, revalidate = 60) {
  const { data, error, isLoading } = useSWR(
    slug ? `/api/hotels/${slug}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      refreshInterval: revalidate * 1000
    }
  );

  return {
    hotel: data,
    isLoading,
    isError: error
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
  revalidate?: number;
} = {}) {
  const { 
    limit = 100, 
    offset = 0, 
    featured, 
    popular,
    categories,
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

  const { data, error, isLoading } = useSWR(
    `/api/destinations?limit=${limit}&offset=${offset}&filter=${JSON.stringify(filter)}`,
    fetcher,
    { 
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      refreshInterval: revalidate * 1000
    }
  );

  return {
    destinations: data,
    isLoading,
    isError: error
  };
}

/**
 * Hook to fetch a destination by slug
 */
export function useDestination(slug: string | undefined, revalidate = 60) {
  const { data, error, isLoading } = useSWR(
    slug ? `/api/destinations/${slug}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      refreshInterval: revalidate * 1000
    }
  );

  return {
    destination: data,
    isLoading,
    isError: error
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

  const { data, error, isLoading } = useSWR(
    queryString,
    fetcher,
    { 
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      refreshInterval: revalidate * 1000
    }
  );

  return {
    categories: data,
    isLoading,
    isError: error
  };
}

/**
 * Hook to fetch a page by slug
 */
export function usePage(slug: string | undefined, revalidate = 300) {
  const { data, error, isLoading } = useSWR(
    slug ? `/api/pages/${slug}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      refreshInterval: revalidate * 1000
    }
  );

  return {
    page: data,
    isLoading,
    isError: error
  };
}

/**
 * Hook to fetch navigation pages
 */
export function useNavigation(revalidate = 3600) { // 1 hour cache
  const { data, error, isLoading } = useSWR(
    '/api/navigation',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      refreshInterval: revalidate * 1000
    }
  );

  return {
    navItems: data,
    isLoading,
    isError: error
  };
}