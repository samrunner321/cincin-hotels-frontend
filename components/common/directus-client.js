'use client';

/**
 * DEPRECATION NOTICE:
 * This file is deprecated and will be removed in the future.
 * Please use the TypeScript version at src/lib/api/directus-client.ts instead.
 * This file now re-exports from the TypeScript implementation for backward compatibility.
 */

import {
  getAssetUrl,
  fetchFromDirectus,
  fetchHotels,
  fetchHotelBySlug,
  processTranslations,
  processImages,
  prepareItem,
  prepareItems
} from '../../src/lib/api/directus-client';

// These functions don't exist in the new implementation,
// so we'll provide simple implementations here
const getTransformedImage = getAssetUrl;
const generateImageSet = (fileId, sizes = []) => {
  return sizes.map(size => ({
    url: getAssetUrl(fileId, size),
    ...size
  }));
};

// Configuration constants for backward compatibility
const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const IS_MOCK_SERVER = process.env.IS_MOCK_SERVER === 'true';

/**
 * Function to get asset URL from Directus file ID
 * @deprecated Use getAssetUrl from src/lib/api/directus-client.ts instead
 */
export function getAssetURL(fileId) {
  return getAssetUrl(fileId);
}

/**
 * Transformierte Bild-URL mit angegebenen Parametern generieren
 * @deprecated Use getTransformedImageUrl from src/lib/api/directus-client.ts instead
 */
export function getTransformedImageUrl(fileId, options = {}) {
  if (!fileId) return '';
  
  const {
    width,
    height,
    fit = 'cover',
    quality = 80,
    format = 'webp'
  } = options;
  
  return getTransformedImage(fileId, { width, height, fit, quality, format });
}

/**
 * Responsives Bilderset für art direction generieren
 * @deprecated Use generateResponsiveImageSet from src/lib/api/directus-client.ts instead
 */
export function generateResponsiveImageSet(fileId, sizes = []) {
  return generateImageSet(fileId, sizes);
}

/**
 * Mock data for testing when actual API is unavailable
 */
export const mockHotels = [
  {
    id: '1',
    name: 'Schgaguler Hotel',
    slug: 'schgaguler-hotel',
    location: 'Dolomites, Italy',
    short_description: 'A minimalist mountain retreat in the heart of the Dolomites.',
    description: 'The Schgaguler Hotel is a modern, minimalist retreat in the heart of the Dolomites.',
    main_image: 'hotel-schgaguler.jpg',
    gallery: [
      { image: 'hotel-1.jpg', alt: 'Mountain view suite' },
      { image: 'hotel-2.jpg', alt: 'Hotel exterior' },
      { image: 'hotel-3.jpg', alt: 'Dining area' }
    ],
    rooms: [
      {
        id: '1-1',
        name: 'Mountain View Suite',
        slug: 'mountain-view-suite',
        description: 'Spacious suite with panoramic mountain views',
        size: '45m²',
        max_occupancy: 2,
        main_image: 'hotel-1.jpg',
        price_per_night: 450,
        currency: 'EUR'
      },
      {
        id: '1-2',
        name: 'Alpine Deluxe Room',
        slug: 'alpine-deluxe-room',
        description: 'Cozy room with balcony and alpine decor',
        size: '30m²',
        max_occupancy: 2,
        main_image: 'hotel-2.jpg',
        price_per_night: 350,
        currency: 'EUR'
      }
    ],
    features: [
      {
        title: 'Mountain Location',
        description: 'Situated at 1,500m elevation with panoramic views of the Dolomites',
        icon: 'mountains'
      },
      {
        title: 'Award-winning Spa',
        description: 'Alpine-inspired wellness center with indoor and outdoor pools',
        icon: 'spa'
      },
      {
        title: 'Fine Dining',
        description: 'Gourmet restaurant featuring seasonal South Tyrolean cuisine',
        icon: 'food'
      }
    ]
  },
  {
    id: '2',
    name: 'Hotel Aurora',
    slug: 'hotel-aurora',
    location: 'Lake Como, Italy',
    short_description: 'Lakeside luxury with historic charm and modern amenities.',
    main_image: 'hotel-aurora.jpg',
    gallery: [
      { image: 'hotel-3.jpg', alt: 'Lake view' },
      { image: 'hotel-4.jpg', alt: 'Pool area' },
      { image: 'hotel-5.jpg', alt: 'Hotel gardens' }
    ]
  },
  {
    id: '3',
    name: 'Hotel Giardino',
    slug: 'hotel-giardino',
    location: 'Tuscany, Italy',
    short_description: 'A restored villa surrounded by vineyards and olive groves.',
    main_image: 'hotel-giardino.jpg',
    gallery: [
      { image: 'hotel-6.jpg', alt: 'Villa exterior' },
      { image: 'hotel-7.jpg', alt: 'Garden view' },
      { image: 'hotel-1.jpg', alt: 'Dining terrace' }
    ]
  }
];

/**
 * Get mock hotel by slug
 * @deprecated Use fetchHotelBySlug from src/lib/api/directus-client.ts instead
 */
export function getMockHotelBySlug(slug) {
  return mockHotels.find(hotel => hotel.slug === slug) || null;
}

// Export the functions from the TypeScript client
export {
  fetchFromDirectus,
  fetchHotels,
  fetchHotelBySlug,
  processTranslations,
  processImages,
  prepareItem,
  prepareItems
};

// Default export for backward compatibility
export default {
  getAssetURL,
  getTransformedImageUrl,
  generateResponsiveImageSet,
  getMockHotelBySlug,
  fetchFromDirectus,
  fetchHotels,
  fetchHotelBySlug,
  processTranslations,
  processImages,
  prepareItem,
  prepareItems
};