/**
 * CinCin Hotels API Client
 * Provides TypeScript type definitions and helper functions for interacting with the Directus API
 */

import { createDirectus, rest, graphql, staticToken, readItems } from '@directus/sdk';
import { getDirectusAdminToken, getDirectusPublicToken } from './auth';

/**
 * Base types for common fields
 */
export interface BaseItem {
  id: string;
  date_created?: string;
  date_updated?: string;
  user_created?: string;
  user_updated?: string;
}

export type Status = 'published' | 'draft' | 'archived';

/**
 * Hotel types
 */
export interface Hotel extends BaseItem {
  status: Status;
  name: string;
  slug: string;
  subtitle?: string;
  location: string;
  region?: 'alps' | 'mediterranean' | 'northern_europe' | 'central_europe' | 'southern_europe';
  short_description: string;
  description: string;
  coordinates?: { lat: number; lng: number };
  address?: string;
  zip?: string;
  city?: string;
  country?: string;
  main_image: string;
  gallery?: Array<{
    image: string;
    alt?: string;
    caption?: string;
  }>;
  video_url?: string;
  price_from: number;
  currency: 'EUR' | 'CHF' | 'USD' | 'GBP';
  price_notes?: string;
  star_rating?: number;
  user_rating?: number;
  review_count?: number;
  year_built?: number;
  year_renovated?: number;
  room_count?: number;
  amenities?: Array<string>;
  features?: Array<{
    title: string;
    description?: string;
    icon?: string;
    image?: string;
  }>;
  categories?: Array<string>;
  tags?: Array<string>;
  destination?: string;
  is_featured?: boolean;
  is_new?: boolean;
  owner_information?: Array<{
    name: string;
    description?: string;
    image?: string;
  }>;
  meta_title?: string;
  meta_description?: string;
  sort?: number;
  rooms?: Room[];
}

/**
 * Room types
 */
export interface Room extends BaseItem {
  status: Status;
  name: string;
  slug: string;
  description: string;
  size: string;
  max_occupancy: number;
  bed_type?: 'king' | 'queen' | 'twin' | 'double' | 'single' | 'multiple';
  bed_count?: number;
  bathroom_count?: number;
  view_type?: 'mountain' | 'sea' | 'garden' | 'city' | 'lake' | 'pool' | 'none';
  main_image: string;
  gallery?: Array<{
    image: string;
    alt?: string;
    caption?: string;
  }>;
  price_per_night: number;
  currency: 'EUR' | 'CHF' | 'USD' | 'GBP';
  price_notes?: string;
  amenities?: Array<string>;
  features?: Array<{
    title: string;
    description?: string;
  }>;
  hotel: string | Hotel;
  is_featured?: boolean;
  sort?: number;
}

/**
 * Destination types
 */
export interface Destination extends BaseItem {
  status: Status;
  name: string;
  slug: string;
  subtitle?: string;
  country: string;
  region?: 'alps' | 'mediterranean' | 'northern_europe' | 'central_europe' | 'southern_europe';
  short_description: string;
  description: string;
  coordinates?: { lat: number; lng: number };
  main_image: string;
  gallery?: Array<{
    image: string;
    alt?: string;
    caption?: string;
    season?: 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
  }>;
  video_url?: string;
  highlights?: Array<{
    title: string;
    description?: string;
    icon?: string;
    image?: string;
  }>;
  activities?: Array<{
    title: string;
    description?: string;
    season: 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
    image?: string;
  }>;
  dining?: Array<{
    name: string;
    description?: string;
    cuisine?: string;
    price_range?: '$' | '$$' | '$$$' | '$$$$';
    address?: string;
    coordinates?: { lat: number; lng: number };
    image?: string;
  }>;
  signature_dishes?: Array<{
    name: string;
    description?: string;
    restaurant?: string;
    image?: string;
  }>;
  chef_spotlight?: Array<{
    name: string;
    restaurant?: string;
    description?: string;
    image?: string;
  }>;
  travel_info?: Array<{
    category: 'transportation' | 'climate' | 'best_time' | 'language' | 'currency' | 'customs' | 'tips';
    title: string;
    description: string;
    icon?: string;
  }>;
  weather?: Array<{
    season: 'spring' | 'summer' | 'autumn' | 'winter';
    temp_low: number;
    temp_high: number;
    precipitation?: string;
    description?: string;
  }>;
  categories?: Array<string>;
  tags?: Array<string>;
  is_featured?: boolean;
  is_popular?: boolean;
  meta_title?: string;
  meta_description?: string;
  sort?: number;
  hotels?: Hotel[];
}

/**
 * Category types
 */
export interface Category extends BaseItem {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  type: 'hotel' | 'destination' | 'both';
  featured?: boolean;
  sort?: number;
}

/**
 * Page types
 */
export interface Page extends BaseItem {
  status: Status;
  title: string;
  slug: string;
  content: string;
  featured_image?: string;
  template: 'default' | 'full_width' | 'sidebar' | 'landing';
  meta_title?: string;
  meta_description?: string;
  show_in_navigation?: boolean;
  sort?: number;
}

/**
 * Translation
 */
export interface Translation extends BaseItem {
  language: 'en-US' | 'de-DE' | 'ar-AE' | 'he-IL';
  key: string;
  value: string;
}

/**
 * Schema definition
 */
export interface Schema {
  hotels: Hotel[];
  rooms: Room[];
  destinations: Destination[];
  categories: Category[];
  pages: Page[];
  translations: Translation[];
}

/**
 * API client configuration
 */
const DIRECTUS_URL = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055')
  : (process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055');

// Safely access tokens via auth functions
const IS_MOCK_SERVER = process.env.IS_MOCK_SERVER === 'true';

/**
 * Directus REST client - admin access (server-side only)
 */
export const directusAdminRest = createDirectus<Schema>(DIRECTUS_URL)
  .with(rest())
  .with(staticToken(getDirectusAdminToken()));

/**
 * Directus REST client - public access (can be used on client)
 */
export const directusPublicRest = createDirectus<Schema>(DIRECTUS_URL)
  .with(rest())
  .with(staticToken(getDirectusPublicToken()));

/**
 * Directus GraphQL client - admin access (server-side only)
 */
export const directusAdminGraphQL = createDirectus<Schema>(DIRECTUS_URL)
  .with(graphql())
  .with(staticToken(getDirectusAdminToken()));

/**
 * Directus GraphQL client - public access (can be used on client)
 */
export const directusPublicGraphQL = createDirectus<Schema>(DIRECTUS_URL)
  .with(graphql())
  .with(staticToken(getDirectusPublicToken()));

/**
 * Function to get asset URL from Directus file ID
 */
export function getAssetURL(fileId: string): string {
  if (!fileId) return '';
  
  // Mock mode: path to local images
  if (IS_MOCK_SERVER) {
    return `/mock-images/${fileId}`;
  }
  
  return `${DIRECTUS_URL}/assets/${fileId}`;
}

/**
 * Generate transformed image URL with specified parameters
 */
export function getTransformedImageUrl(fileId: string, options: {
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  quality?: number;
  format?: 'jpg' | 'png' | 'webp' | 'avif';
}) {
  if (!fileId) return '';
  
  const {
    width,
    height,
    fit = 'cover',
    quality = 80,
    format = 'webp'
  } = options;
  
  const baseUrl = `${DIRECTUS_URL}/assets/${fileId}`;
  const params = new URLSearchParams();
  
  if (width) params.append('width', width.toString());
  if (height) params.append('height', height.toString());
  if (fit) params.append('fit', fit);
  if (quality) params.append('quality', quality.toString());
  if (format) params.append('format', format);
  
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Generate responsive image set for art direction
 */
export function generateResponsiveImageSet(fileId: string, sizes: { width: number, height?: number }[]) {
  if (!fileId) return [];
  
  return sizes.map(size => {
    const { width, height } = size;
    return {
      src: getTransformedImageUrl(fileId, { width, height, format: 'webp' }),
      width
    };
  });
}

// Browser-safe API functions

/**
 * Get all hotels with filtering options
 */
export async function getHotels(options: {
  limit?: number;
  offset?: number;
  sort?: string[];
  filter?: Record<string, any>;
  fields?: string[];
} = {}) {
  try {
    const {
      limit = 100,
      offset = 0,
      sort = ['-date_created'],
      filter = { status: { _eq: 'published' } },
      fields = ['*', 'main_image.*'],
    } = options;

    // API request in production mode
    const response = await directusPublicRest.request(
      readItems('hotels', {
        limit,
        offset,
        sort: sort as any,
        filter,
        fields: fields as any,
      })
    );

    return response;
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return [];
  }
}

/**
 * Get hotel by slug
 */
export async function getHotelBySlug(slug: string) {
  try {
    // API request in production mode
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
  } catch (error) {
    console.error(`Error fetching hotel by slug ${slug}:`, error);
    return null;
  }
}

/**
 * Get all destinations
 */
export async function getDestinations(options: {
  limit?: number;
  offset?: number;
  sort?: string[];
  filter?: Record<string, any>;
  fields?: string[];
} = {}) {
  try {
    const {
      limit = 100,
      offset = 0,
      sort = ['-date_created'],
      filter = { status: { _eq: 'published' } },
      fields = ['*', 'main_image.*'],
    } = options;

    // API request in production mode
    const response = await directusPublicRest.request(
      readItems('destinations', {
        limit,
        offset,
        sort: sort as any,
        filter,
        fields: fields as any,
      })
    );

    return response;
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return [];
  }
}

/**
 * Get destination by slug
 */
export async function getDestinationBySlug(slug: string) {
  try {
    // API request in production mode
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
  } catch (error) {
    console.error(`Error fetching destination by slug ${slug}:`, error);
    return null;
  }
}

/**
 * Get hotels by destination
 */
export async function getHotelsByDestination(destinationId: string) {
  try {
    // API request in production mode
    const response = await directusPublicRest.request(
      readItems('hotels', {
        filter: {
          destination: { _eq: destinationId },
          status: { _eq: 'published' },
        },
        fields: ['*', 'main_image'] as any,
      })
    );

    return response;
  } catch (error) {
    console.error(`Error fetching hotels by destination ${destinationId}:`, error);
    return [];
  }
}

/**
 * Get rooms by hotel
 */
export async function getRoomsByHotel(hotelId: string) {
  try {
    const response = await directusPublicRest.request(
      readItems('rooms', {
        filter: {
          hotel: { _eq: hotelId },
          status: { _eq: 'published' },
        },
        fields: ['*', 'main_image', 'gallery'] as any,
      })
    );

    return response;
  } catch (error) {
    console.error(`Error fetching rooms by hotel ${hotelId}:`, error);
    return [];
  }
}

/**
 * Get all categories
 */
export async function getCategories(options: {
  type?: 'hotel' | 'destination' | 'both';
  featured?: boolean;
} = {}) {
  try {
    const { type, featured } = options;
    const filter: Record<string, any> = {};
    
    if (type) {
      filter.type = { _in: [type, 'both'] };
    }
    
    if (featured !== undefined) {
      filter.featured = { _eq: featured };
    }

    // API request in production mode
    const response = await directusPublicRest.request(
      readItems('categories', {
        filter,
        sort: ['sort'] as any,
        fields: ['*', 'image'] as any,
      })
    );

    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Get page by slug
 */
export async function getPageBySlug(slug: string) {
  try {
    const response = await directusPublicRest.request(
      readItems('pages', {
        limit: 1,
        filter: {
          slug: { _eq: slug },
          status: { _eq: 'published' },
        },
        fields: ['*', 'featured_image'] as any,
      })
    );

    return response[0] || null;
  } catch (error) {
    console.error(`Error fetching page by slug ${slug}:`, error);
    return null;
  }
}

/**
 * Get navigation pages
 */
export async function getNavigationPages() {
  try {
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

    return response;
  } catch (error) {
    console.error('Error fetching navigation pages:', error);
    return [];
  }
}

/**
 * Get translations by language
 */
export async function getTranslationsByLanguage(language: 'en-US' | 'de-DE' | 'ar-AE' | 'he-IL') {
  try {
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
    response.forEach(item => {
      translationsObject[item.key] = item.value;
    });
    
    return translationsObject;
  } catch (error) {
    console.error(`Error fetching translations for language ${language}:`, error);
    return {};
  }
}