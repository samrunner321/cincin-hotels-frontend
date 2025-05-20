/**
 * Data loaders for static generation (SSG) and incremental static regeneration (ISR)
 */
import {
  getHotels,
  getHotelBySlug,
  getDestinations,
  getDestinationBySlug,
  getHotelsByDestination,
  getRoomsByHotel,
  getCategories,
  getPageBySlug,
  getNavigationPages,
  Hotel,
  Destination,
  Room,
  Category,
  Page
} from './directus';

// Revalidation intervals (in seconds)
export const REVALIDATE = {
  HOTEL: 60 * 5, // 5 minutes
  HOTELS: 60 * 5, // 5 minutes
  DESTINATION: 60 * 10, // 10 minutes
  DESTINATIONS: 60 * 10, // 10 minutes
  CATEGORY: 60 * 30, // 30 minutes
  CATEGORIES: 60 * 30, // 30 minutes
  PAGE: 60 * 60, // 1 hour
  NAVIGATION: 60 * 60, // 1 hour
};

/**
 * Load hotels with options for static generation
 */
export async function loadHotels(options: {
  limit?: number;
  featured?: boolean;
  categories?: string[];
  destination?: string;
} = {}): Promise<Hotel[]> {
  const {
    limit = 100,
    featured,
    categories,
    destination,
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

  try {
    const hotels = await getHotels({
      limit,
      filter,
      fields: ['*', 'main_image', 'destination'],
    });

    return hotels as unknown as Hotel[];
  } catch (error) {
    console.error('Error loading hotels for static generation:', error);
    return [];
  }
}

/**
 * Load hotel by slug for static generation
 */
export async function loadHotel(slug: string): Promise<Hotel | null> {
  try {
    const hotel = await getHotelBySlug(slug) as Hotel | null;
    return hotel;
  } catch (error) {
    console.error(`Error loading hotel ${slug} for static generation:`, error);
    return null;
  }
}

/**
 * Load hotel slugs for static path generation
 */
export async function loadHotelSlugs(): Promise<string[]> {
  try {
    const hotels = await getHotels({
      fields: ['slug'],
      limit: 1000, // Get all published hotels
    });

    return (hotels as unknown as Hotel[]).map(hotel => hotel.slug);
  } catch (error) {
    console.error('Error loading hotel slugs for static paths:', error);
    return [];
  }
}

/**
 * Load destinations with options for static generation
 */
export async function loadDestinations(options: {
  limit?: number;
  featured?: boolean;
  popular?: boolean;
  categories?: string[];
  region?: string;
} = {}): Promise<Destination[]> {
  const {
    limit = 100,
    featured,
    popular,
    categories,
    region,
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

  try {
    const destinations = await getDestinations({
      limit,
      filter,
      fields: ['*', 'main_image'],
    });

    return destinations as unknown as Destination[];
  } catch (error) {
    console.error('Error loading destinations for static generation:', error);
    return [];
  }
}

/**
 * Load destination by slug for static generation
 */
export async function loadDestination(slug: string): Promise<Destination & { hotels: Hotel[] } | null> {
  try {
    const destination = await getDestinationBySlug(slug) as Destination | null;
    
    if (!destination) {
      return null;
    }
    
    // Get hotels for this destination
    const hotels = await getHotelsByDestination(destination.id) as unknown as Hotel[];
    
    return {
      ...destination,
      hotels
    };
  } catch (error) {
    console.error(`Error loading destination ${slug} for static generation:`, error);
    return null;
  }
}

/**
 * Load destination slugs for static path generation
 */
export async function loadDestinationSlugs(): Promise<string[]> {
  try {
    const destinations = await getDestinations({
      fields: ['slug'],
      limit: 1000, // Get all published destinations
    });

    return (destinations as unknown as Destination[]).map(destination => destination.slug);
  } catch (error) {
    console.error('Error loading destination slugs for static paths:', error);
    return [];
  }
}

/**
 * Load categories with options for static generation
 */
export async function loadCategories(options: {
  type?: 'hotel' | 'destination' | 'both';
  featured?: boolean;
} = {}): Promise<Category[]> {
  const { type, featured } = options;

  try {
    const categories = await getCategories({ type, featured });
    return categories as unknown as Category[];
  } catch (error) {
    console.error('Error loading categories for static generation:', error);
    return [];
  }
}

/**
 * Load page by slug for static generation
 */
export async function loadPage(slug: string): Promise<Page | null> {
  try {
    const page = await getPageBySlug(slug) as Page | null;
    return page;
  } catch (error) {
    console.error(`Error loading page ${slug} for static generation:`, error);
    return null;
  }
}

/**
 * Load navigation for static generation
 */
export async function loadNavigation(): Promise<{ title: string; slug: string; id: string }[]> {
  try {
    const navItems = await getNavigationPages() as unknown as { title: string; slug: string; id: string }[];
    return navItems;
  } catch (error) {
    console.error('Error loading navigation for static generation:', error);
    return [];
  }
}