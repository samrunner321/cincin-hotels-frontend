/**
 * API Response Schemas
 * 
 * Diese Datei enthält Joi-Schema-Definitionen zur Validierung von API-Response-Strukturen.
 * Sie stellt sicher, dass unsere API-Endpunkte konsistente und korrekt typisierte Daten zurückgeben.
 */

import Joi from 'joi';

/**
 * Basis-Schema für gemeinsame Felder
 */
const baseItemSchema = Joi.object({
  id: Joi.string().required(),
  date_created: Joi.string().optional(),
  date_updated: Joi.string().optional(),
  user_created: Joi.string().optional(),
  user_updated: Joi.string().optional(),
});

/**
 * Image Schema
 */
const imageSchema = Joi.object({
  id: Joi.string().required(),
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  width: Joi.number().optional(),
  height: Joi.number().optional(),
});

/**
 * Galleriebild-Schema
 */
const galleryImageSchema = Joi.object({
  image: imageSchema.required(),
  alt: Joi.string().optional(),
  caption: Joi.string().optional(),
  season: Joi.string().optional(),
});

/**
 * Feature-Schema
 */
const featureSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  icon: Joi.string().optional(),
  image: Joi.string().optional(),
});

/**
 * Hotel Schema
 */
export const hotelSchema = baseItemSchema.keys({
  status: Joi.string().valid('published', 'draft', 'archived').required(),
  name: Joi.string().required(),
  slug: Joi.string().required(),
  subtitle: Joi.string().optional(),
  location: Joi.string().required(),
  region: Joi.string().optional(),
  short_description: Joi.string().required(),
  description: Joi.string().required(),
  coordinates: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  }).optional(),
  address: Joi.string().optional(),
  zip: Joi.string().optional(),
  city: Joi.string().optional(),
  country: Joi.string().optional(),
  main_image: imageSchema.optional(),
  gallery: Joi.array().items(galleryImageSchema).optional(),
  video_url: Joi.string().optional(),
  price_from: Joi.number().required(),
  currency: Joi.string().valid('EUR', 'CHF', 'USD', 'GBP').required(),
  price_notes: Joi.string().optional(),
  star_rating: Joi.number().min(1).max(5).optional(),
  user_rating: Joi.number().min(0).max(5).optional(),
  review_count: Joi.number().optional(),
  year_built: Joi.number().optional(),
  year_renovated: Joi.number().optional(),
  room_count: Joi.number().optional(),
  amenities: Joi.array().items(Joi.string()).optional(),
  features: Joi.array().items(featureSchema).optional(),
  categories: Joi.array().items(Joi.string()).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  destination: Joi.string().optional(),
  is_featured: Joi.boolean().optional(),
  is_new: Joi.boolean().optional(),
});

/**
 * Hotels Collection Schema
 */
export const hotelsCollectionSchema = Joi.array().items(hotelSchema);

/**
 * Zimmer Schema
 */
export const roomSchema = baseItemSchema.keys({
  status: Joi.string().valid('published', 'draft', 'archived').required(),
  name: Joi.string().required(),
  slug: Joi.string().required(),
  description: Joi.string().required(),
  size: Joi.string().required(),
  max_occupancy: Joi.number().required(),
  bed_type: Joi.string().optional(),
  bed_count: Joi.number().optional(),
  bathroom_count: Joi.number().optional(),
  view_type: Joi.string().optional(),
  main_image: imageSchema.optional(),
  gallery: Joi.array().items(galleryImageSchema).optional(),
  price_per_night: Joi.number().required(),
  currency: Joi.string().valid('EUR', 'CHF', 'USD', 'GBP').required(),
  price_notes: Joi.string().optional(),
  amenities: Joi.array().items(Joi.string()).optional(),
  features: Joi.array().items(featureSchema).optional(),
  hotel: Joi.string().required(),
  is_featured: Joi.boolean().optional(),
  sort: Joi.number().optional(),
});

/**
 * Zimmer Collection Schema
 */
export const roomsCollectionSchema = Joi.array().items(roomSchema);

/**
 * Activity Schema
 */
const activitySchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  season: Joi.string().required(),
  image: imageSchema.optional(),
});

/**
 * Dining Option Schema
 */
const diningSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  cuisine: Joi.string().optional(),
  price_range: Joi.string().optional(),
  address: Joi.string().optional(),
  coordinates: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  }).optional(),
  image: imageSchema.optional(),
});

/**
 * Travel Info Schema
 */
const travelInfoSchema = Joi.object({
  category: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  icon: Joi.string().optional(),
});

/**
 * Weather Schema
 */
const weatherSchema = Joi.object({
  season: Joi.string().required(),
  temp_low: Joi.number().required(),
  temp_high: Joi.number().required(),
  precipitation: Joi.string().optional(),
  description: Joi.string().optional(),
});

/**
 * Destination Schema
 */
export const destinationSchema = baseItemSchema.keys({
  status: Joi.string().valid('published', 'draft', 'archived').required(),
  name: Joi.string().required(),
  slug: Joi.string().required(),
  subtitle: Joi.string().optional(),
  country: Joi.string().required(),
  region: Joi.string().optional(),
  short_description: Joi.string().required(),
  description: Joi.string().required(),
  coordinates: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  }).optional(),
  main_image: imageSchema.optional(),
  gallery: Joi.array().items(galleryImageSchema).optional(),
  video_url: Joi.string().optional(),
  highlights: Joi.array().items(featureSchema).optional(),
  activities: Joi.array().items(activitySchema).optional(),
  dining: Joi.array().items(diningSchema).optional(),
  travel_info: Joi.array().items(travelInfoSchema).optional(),
  weather: Joi.array().items(weatherSchema).optional(),
  categories: Joi.array().items(Joi.string()).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  is_featured: Joi.boolean().optional(),
  is_popular: Joi.boolean().optional(),
  hotels: Joi.array().items(hotelSchema).optional(),
});

/**
 * Destinations Collection Schema
 */
export const destinationsCollectionSchema = Joi.array().items(destinationSchema);

/**
 * Category Schema
 */
export const categorySchema = baseItemSchema.keys({
  name: Joi.string().required(),
  slug: Joi.string().required(),
  description: Joi.string().optional(),
  icon: Joi.string().optional(),
  image: imageSchema.optional(),
  type: Joi.string().valid('hotel', 'destination', 'both').required(),
  featured: Joi.boolean().optional(),
  sort: Joi.number().optional(),
});

/**
 * Categories Collection Schema
 */
export const categoriesCollectionSchema = Joi.array().items(categorySchema);

/**
 * Page Schema
 */
export const pageSchema = baseItemSchema.keys({
  status: Joi.string().valid('published', 'draft', 'archived').required(),
  title: Joi.string().required(),
  slug: Joi.string().required(),
  content: Joi.string().required(),
  featured_image: imageSchema.allow(null).optional(),
  template: Joi.string().required(),
  meta_title: Joi.string().optional(),
  meta_description: Joi.string().optional(),
  show_in_navigation: Joi.boolean().optional(),
  sort: Joi.number().optional(),
});

/**
 * Pages Collection Schema
 */
export const pagesCollectionSchema = Joi.array().items(pageSchema);

/**
 * Translation Schema
 */
export const translationSchema = baseItemSchema.keys({
  language: Joi.string().required(),
  key: Joi.string().required(),
  value: Joi.string().required(),
});

/**
 * Translations Collection Schema
 */
export const translationsCollectionSchema = Joi.array().items(translationSchema);

/**
 * Translations Object Schema (für formatierte Übersetzungen)
 */
export const translationsObjectSchema = Joi.object().pattern(
  Joi.string(),
  Joi.string()
);

/**
 * Error Response Schema
 */
export const errorResponseSchema = Joi.object({
  error: Joi.string().required(),
});

// Export default als komplettes Objekt mit allen Schemas
export default {
  baseItemSchema,
  imageSchema,
  galleryImageSchema,
  featureSchema,
  hotelSchema,
  hotelsCollectionSchema,
  roomSchema,
  roomsCollectionSchema,
  destinationSchema,
  destinationsCollectionSchema,
  categorySchema,
  categoriesCollectionSchema,
  pageSchema,
  pagesCollectionSchema,
  translationSchema,
  translationsCollectionSchema,
  translationsObjectSchema,
  errorResponseSchema,
};