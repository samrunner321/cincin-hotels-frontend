/**
 * Cached Directus API client
 * Adds caching layer on top of directus server client
 */

import { withCache, generateCacheKey } from '../api-cache';
import * as directusServer from './directus-server';
import { LanguageCode } from '../i18n';

// Cache times in seconds
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
 * Get hotels with caching
 */
export async function getHotelsWithCache(options: any = {}) {
  const locale = options.locale || 'de-DE';
  return withCache(
    (params) => directusServer.getHotels(params, params.locale),
    { ...options, locale },
    generateCacheKey('hotels', options),
    {
      ttl: REVALIDATE_TIMES.HOTELS,
      tags: ['hotels'],
    }
  );
}

/**
 * Get hotel by slug with caching
 */
export async function getHotelBySlugWithCache(slug: string, locale: string = 'de-DE') {
  return withCache(
    (params) => directusServer.getHotelBySlug(params.slug, params.locale),
    { slug, locale },
    generateCacheKey(`hotel:${slug}`, { locale }),
    {
      ttl: REVALIDATE_TIMES.HOTEL,
      tags: ['hotels', `hotel:${slug}`],
    }
  );
}

/**
 * Get destinations with caching
 */
export async function getDestinationsWithCache(options: any = {}) {
  const locale = options.locale || 'de-DE';
  return withCache(
    (params) => directusServer.getDestinations(params, params.locale),
    { ...options, locale },
    generateCacheKey('destinations', options),
    {
      ttl: REVALIDATE_TIMES.DESTINATIONS,
      tags: ['destinations'],
    }
  );
}

/**
 * Get destination by slug with caching
 */
export async function getDestinationBySlugWithCache(slug: string, locale: string = 'de-DE') {
  return withCache(
    (params) => directusServer.getDestinationBySlug(params.slug, params.locale),
    { slug, locale },
    generateCacheKey(`destination:${slug}`, { locale }),
    {
      ttl: REVALIDATE_TIMES.DESTINATION,
      tags: ['destinations', `destination:${slug}`],
    }
  );
}

/**
 * Get categories with caching
 */
export async function getCategoriesWithCache(options: any = {}) {
  const locale = options.locale || 'de-DE';
  return withCache(
    (params) => directusServer.getCategories(params, params.locale),
    { ...options, locale },
    generateCacheKey('categories', options),
    {
      ttl: REVALIDATE_TIMES.CATEGORIES,
      tags: ['categories'],
    }
  );
}

/**
 * Get translations with caching
 */
export async function getTranslationsWithCache(language: LanguageCode = 'de-DE', options: any = {}) {
  return withCache(
    (params) => directusServer.getTranslations(params.language),
    { language, ...options },
    generateCacheKey(`translations:${language}`, options),
    {
      ttl: REVALIDATE_TIMES.TRANSLATIONS,
      tags: ['translations', `language:${language}`],
    }
  );
}

/**
 * Invalidate entity cache
 */
export async function invalidateEntityCache(type: string, id?: string) {
  const { invalidateCache } = await import('../api-cache');
  
  // Determine which tags to invalidate
  const tags: string[] = [];
  
  switch (type) {
    case 'hotel':
      tags.push('hotels');
      if (id) tags.push(`hotel:${id}`);
      break;
    case 'destination':
      tags.push('destinations');
      if (id) tags.push(`destination:${id}`);
      break;
    case 'category':
      tags.push('categories');
      break;
    case 'page':
      tags.push('pages');
      if (id) tags.push(`page:${id}`);
      break;
    case 'translation':
      tags.push('translations');
      break;
    default:
      console.warn(`Unknown entity type for cache invalidation: ${type}`);
  }
  
  // Invalidate cache for affected tags
  invalidateCache({ tags });
}