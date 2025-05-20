/**
 * Destination mocks for testing
 * 
 * This file contains extended mock data for destination tests, including
 * normal cases and edge cases for thorough testing.
 */
import { Destination, Hotel, Category } from '../../../src/lib/directus';

// Import the raw data (these imports will work after running the data export script)
// For simplicity, we're declaring dummy data directly in this file
// In a real implementation, you would import from the exported JSON files:
// import destinationData from './data/destinations.json';
// import hotelData from './data/hotels.json';
// import categoryData from './data/categories.json';

/**
 * Regular destination data for normal test cases
 */
export const mockDestinations: Destination[] = [
  {
    id: '1',
    status: 'published',
    name: 'South Tyrol',
    slug: 'south-tyrol',
    subtitle: 'Where Alpine and Mediterranean worlds meet',
    country: 'Italy',
    region: 'alps',
    short_description: 'Experience the unique blend of Alpine and Italian cultures in this breathtaking mountain region.',
    description: 'South Tyrol offers a fascinating mix of Austrian and Italian influences, with three official languages and diverse cultural traditions. The region is known for its stunning Dolomite mountains, pristine alpine lakes, world-class skiing, and exceptional cuisine that combines hearty Alpine fare with Mediterranean flavors.',
    coordinates: { lat: 46.49, lng: 11.34 },
    main_image: 'south-tyrol.jpg',
    gallery: [
      { image: 'south-tyrol-1.jpg', alt: 'Dolomites', caption: 'The majestic Dolomite mountains', season: 'summer' },
      { image: 'south-tyrol-2.jpg', alt: 'Alpine Lake', caption: 'Pristine alpine lake', season: 'summer' },
      { image: 'south-tyrol-3.jpg', alt: 'Winter Landscape', caption: 'Winter wonderland', season: 'winter' }
    ],
    highlights: [
      {
        title: 'The Dolomites',
        description: 'A UNESCO World Heritage site with dramatic mountain scenery',
        icon: 'mountain',
        image: 'dolomites.jpg'
      },
      {
        title: 'Alpine Cuisine',
        description: 'A unique fusion of Austrian and Italian culinary traditions',
        icon: 'restaurant',
        image: 'cuisine.jpg'
      },
      {
        title: 'Vineyard Culture',
        description: 'Home to some of Italy's finest wine regions',
        icon: 'wine',
        image: 'vineyard.jpg'
      }
    ],
    activities: [
      {
        title: 'Hiking',
        description: 'Explore hundreds of marked trails through alpine meadows and mountains',
        season: 'summer',
        image: 'hiking.jpg'
      },
      {
        title: 'Skiing',
        description: 'World-class ski resorts with reliable snow',
        season: 'winter',
        image: 'skiing.jpg'
      },
      {
        title: 'Wine Tasting',
        description: 'Visit local vineyards and sample regional specialties',
        season: 'all',
        image: 'wine-tasting.jpg'
      }
    ],
    dining: [
      {
        name: 'Restaurant Schönblick',
        description: 'Alpine cuisine with a modern twist and panoramic mountain views',
        cuisine: 'Alpine',
        price_range: '$$$',
        address: 'Via Panorama 12, Castelrotto',
        coordinates: { lat: 46.56, lng: 11.42 },
        image: 'restaurant-1.jpg'
      },
      {
        name: 'Osteria Contadino',
        description: 'Authentic Italian dishes using local ingredients',
        cuisine: 'Italian',
        price_range: '$$',
        address: 'Piazza Walther 7, Bolzano',
        coordinates: { lat: 46.50, lng: 11.35 },
        image: 'restaurant-2.jpg'
      }
    ],
    travel_info: [
      {
        category: 'transportation',
        title: 'Getting Around',
        description: 'South Tyrol has an excellent public transportation network with buses and trains connecting major towns. Rental cars are recommended for exploring remote villages.',
        icon: 'bus'
      },
      {
        category: 'climate',
        title: 'Climate',
        description: 'Alpine climate with cold, snowy winters and mild summers. Mountain weather can change quickly, so pack layers.',
        icon: 'sun'
      },
      {
        category: 'language',
        title: 'Languages',
        description: 'German, Italian, and Ladin are the official languages. English is widely spoken in tourist areas.',
        icon: 'language'
      }
    ],
    weather: [
      {
        season: 'spring',
        temp_low: 5,
        temp_high: 18,
        precipitation: 'Moderate',
        description: 'Mild with occasional rain showers, wildflowers begin to bloom'
      },
      {
        season: 'summer',
        temp_low: 12,
        temp_high: 25,
        precipitation: 'Low',
        description: 'Warm days and cool nights, perfect for hiking'
      },
      {
        season: 'autumn',
        temp_low: 7,
        temp_high: 20,
        precipitation: 'Low',
        description: 'Clear skies with beautiful fall colors'
      },
      {
        season: 'winter',
        temp_low: -5,
        temp_high: 5,
        precipitation: 'High (snow)',
        description: 'Cold with reliable snowfall in the mountains'
      }
    ],
    categories: ['mountain', 'culture', 'culinary'],
    tags: ['skiing', 'hiking', 'wine', 'dolomites', 'nature'],
    is_featured: true,
    is_popular: true,
    meta_title: 'South Tyrol | Alpine Mediterranean Paradise',
    meta_description: 'Discover South Tyrol, a unique region where Alpine and Mediterranean cultures meet, offering stunning mountain landscapes, world-class cuisine, and outdoor adventures.',
    hotels: []
  },
  {
    id: '2',
    status: 'published',
    name: 'Crans-Montana',
    slug: 'crans-montana',
    subtitle: 'The Swiss Alps' luxury playground',
    country: 'Switzerland',
    region: 'alps',
    short_description: 'A glamorous mountain resort offering year-round activities and spectacular Alpine views.',
    description: 'Crans-Montana is a chic mountain destination in the heart of the Swiss Alps, known for its panoramic views, excellent skiing, world-class golf courses, and luxury shopping. With over 300 days of sunshine per year, it offers the perfect combination of outdoor adventure and sophisticated alpine living.',
    coordinates: { lat: 46.31, lng: 7.47 },
    main_image: 'crans-montana.jpg',
    gallery: [
      { image: 'crans-montana-1.jpg', alt: 'Alpine Golf', caption: 'World-class golf course with mountain views', season: 'summer' },
      { image: 'crans-montana-2.jpg', alt: 'Ski Resort', caption: 'Excellent skiing conditions', season: 'winter' },
      { image: 'crans-montana-3.jpg', alt: 'Lake View', caption: 'View of Lake Geneva from the mountains', season: 'summer' }
    ],
    highlights: [
      {
        title: 'Mountain Panorama',
        description: '360° views of the Swiss Alps, including the Matterhorn and Mont Blanc',
        icon: 'mountain',
        image: 'panorama.jpg'
      },
      {
        title: 'Luxury Shopping',
        description: 'High-end boutiques and Swiss watch retailers',
        icon: 'shop',
        image: 'shopping.jpg'
      },
      {
        title: 'Alpine Wellness',
        description: 'Luxurious spas offering mountain-inspired treatments',
        icon: 'spa',
        image: 'wellness.jpg'
      }
    ],
    activities: [
      {
        title: 'Golf',
        description: 'Play on one of Europe's most scenic championship golf courses',
        season: 'summer',
        image: 'golf.jpg'
      },
      {
        title: 'Skiing & Snowboarding',
        description: '140km of perfectly groomed slopes for all skill levels',
        season: 'winter',
        image: 'skiing-cm.jpg'
      },
      {
        title: 'Hiking',
        description: 'Well-marked trails with spectacular mountain views',
        season: 'summer',
        image: 'hiking-cm.jpg'
      },
      {
        title: 'Shopping',
        description: 'Explore luxury boutiques and Swiss specialty shops',
        season: 'all',
        image: 'shopping-cm.jpg'
      }
    ],
    dining: [
      {
        name: 'L'Ours',
        description: 'Michelin-starred restaurant serving innovative Swiss cuisine',
        cuisine: 'Swiss-French',
        price_range: '$$$$',
        address: 'Route des Sommets 1, Crans-Montana',
        coordinates: { lat: 46.31, lng: 7.46 },
        image: 'restaurant-cm-1.jpg'
      },
      {
        name: 'Le Montagnard',
        description: 'Traditional alpine dishes in a cozy atmosphere',
        cuisine: 'Swiss Alpine',
        price_range: '$$$',
        address: 'Rue du Prado 12, Crans-Montana',
        coordinates: { lat: 46.30, lng: 7.47 },
        image: 'restaurant-cm-2.jpg'
      }
    ],
    travel_info: [
      {
        category: 'transportation',
        title: 'Getting Around',
        description: 'The resort offers free shuttle buses. A funicular railway connects the valley to the resort. Cable cars provide access to the mountains.',
        icon: 'cable-car'
      },
      {
        category: 'best_time',
        title: 'Best Times to Visit',
        description: 'December to April for skiing, June to September for golf and hiking. September offers beautiful fall colors.',
        icon: 'calendar'
      },
      {
        category: 'currency',
        title: 'Currency',
        description: 'Swiss Franc (CHF) is the local currency. Credit cards are widely accepted.',
        icon: 'currency'
      }
    ],
    weather: [
      {
        season: 'spring',
        temp_low: 3,
        temp_high: 15,
        precipitation: 'Moderate',
        description: 'Warming temperatures with some lingering snow at higher elevations'
      },
      {
        season: 'summer',
        temp_low: 10,
        temp_high: 23,
        precipitation: 'Low',
        description: 'Sunny and warm with cool evenings'
      },
      {
        season: 'autumn',
        temp_low: 5,
        temp_high: 17,
        precipitation: 'Low to Moderate',
        description: 'Clear days with spectacular fall colors'
      },
      {
        season: 'winter',
        temp_low: -7,
        temp_high: 2,
        precipitation: 'High (snow)',
        description: 'Cold with excellent skiing conditions'
      }
    ],
    categories: ['mountain', 'luxury', 'sports'],
    tags: ['skiing', 'golf', 'spa', 'shopping', 'luxury'],
    is_featured: true,
    is_popular: true,
    meta_title: 'Crans-Montana | Luxury Alpine Experience in Switzerland',
    meta_description: 'Experience Crans-Montana, an elegant Swiss mountain resort offering year-round activities, from world-class skiing to championship golf courses, with breathtaking Alpine views.',
    hotels: []
  },
  {
    id: '3',
    status: 'published',
    name: 'Amalfi Coast',
    slug: 'amalfi-coast',
    subtitle: 'The iconic Mediterranean coastline',
    country: 'Italy',
    region: 'mediterranean',
    short_description: 'A breathtaking stretch of coastline known for its dramatic cliffs, colorful villages, and azure waters.',
    description: 'The Amalfi Coast is a stunning 50-kilometer stretch of coastline along the southern edge of Italy's Sorrentine Peninsula. Designated a UNESCO World Heritage site for its exceptional Mediterranean landscape, it features sheer cliffs plunging into crystal-clear waters, with pastel-colored fishing villages clinging to the steep hillsides. The historic towns of Amalfi, Positano, and Ravello offer a perfect blend of natural beauty, rich history, and extraordinary cuisine.',
    coordinates: { lat: 40.63, lng: 14.60 },
    main_image: 'amalfi-coast.jpg',
    gallery: [
      { image: 'amalfi-1.jpg', alt: 'Positano View', caption: 'The colorful village of Positano', season: 'summer' },
      { image: 'amalfi-2.jpg', alt: 'Amalfi Cathedral', caption: 'Historic Amalfi Cathedral', season: 'all' },
      { image: 'amalfi-3.jpg', alt: 'Coastal Road', caption: 'The dramatic coastal road', season: 'summer' }
    ],
    highlights: [
      {
        title: 'Positano',
        description: 'The coast's most photogenic town, with colorful buildings cascading down to the sea',
        icon: 'village',
        image: 'positano.jpg'
      },
      {
        title: 'Ravello',
        description: 'An elegant hilltop town famous for its gardens and cultural events',
        icon: 'culture',
        image: 'ravello.jpg'
      },
      {
        title: 'Coastal Boat Tours',
        description: 'See hidden coves and grottos only accessible from the water',
        icon: 'boat',
        image: 'boat-tour.jpg'
      }
    ],
    activities: [
      {
        title: 'Beach Relaxation',
        description: 'Unwind at scenic beaches and coves along the coast',
        season: 'summer',
        image: 'beach.jpg'
      },
      {
        title: 'Hiking the Path of Gods',
        description: 'Trek the legendary trail with panoramic coastal views',
        season: 'spring',
        image: 'hiking-amalfi.jpg'
      },
      {
        title: 'Boat Excursions',
        description: 'Explore the coastline and visit the island of Capri',
        season: 'summer',
        image: 'boat.jpg'
      },
      {
        title: 'Cooking Classes',
        description: 'Learn to prepare authentic Campanian cuisine',
        season: 'all',
        image: 'cooking.jpg'
      }
    ],
    dining: [
      {
        name: 'La Sponda',
        description: 'Romantic Michelin-starred restaurant with stunning sea views',
        cuisine: 'Italian',
        price_range: '$$$$',
        address: 'Via Cristoforo Colombo 30, Positano',
        coordinates: { lat: 40.62, lng: 14.48 },
        image: 'restaurant-amalfi-1.jpg'
      },
      {
        name: 'Da Adolfo',
        description: 'Rustic beach restaurant accessible only by boat',
        cuisine: 'Seafood',
        price_range: '$$$',
        address: 'Via Laurito 40, Positano',
        coordinates: { lat: 40.63, lng: 14.47 },
        image: 'restaurant-amalfi-2.jpg'
      }
    ],
    travel_info: [
      {
        category: 'transportation',
        title: 'Getting Around',
        description: 'The coastal road can be congested in summer. Consider boats for town-to-town travel, or the reliable SITA bus network.',
        icon: 'bus'
      },
      {
        category: 'best_time',
        title: 'Best Times to Visit',
        description: 'May-June and September-October offer pleasant weather and fewer crowds. July and August are peak season.',
        icon: 'calendar'
      },
      {
        category: 'tips',
        title: 'Travel Tips',
        description: 'Many towns have limited vehicle access. Wear comfortable shoes for navigating the many stairs. Book restaurants in advance during peak season.',
        icon: 'info'
      }
    ],
    weather: [
      {
        season: 'spring',
        temp_low: 12,
        temp_high: 22,
        precipitation: 'Low to Moderate',
        description: 'Pleasant temperatures with occasional showers, flowers in bloom'
      },
      {
        season: 'summer',
        temp_low: 20,
        temp_high: 30,
        precipitation: 'Very Low',
        description: 'Hot and dry, perfect for beach activities'
      },
      {
        season: 'autumn',
        temp_low: 15,
        temp_high: 25,
        precipitation: 'Moderate',
        description: 'Warm days and mild evenings, occasional rain'
      },
      {
        season: 'winter',
        temp_low: 8,
        temp_high: 15,
        precipitation: 'Moderate to High',
        description: 'Mild but can be rainy, quieter atmosphere'
      }
    ],
    categories: ['coastal', 'culture', 'culinary'],
    tags: ['beach', 'history', 'food', 'views', 'luxury'],
    is_featured: true,
    is_popular: true,
    meta_title: 'Amalfi Coast | Italy's Stunning Mediterranean Paradise',
    meta_description: 'Experience the breathtaking beauty of the Amalfi Coast, with its dramatic cliffs, pastel-colored villages, and crystal-clear waters. A Mediterranean paradise of history, cuisine, and natural wonders.',
    hotels: []
  }
];

// Define a type for destination edge cases with custom properties
interface DestinationEdgeCase extends Destination {
  __translations_missing?: boolean;
}

/**
 * Edge case destinations with special test scenarios
 */
export const mockEdgeCaseDestinations: DestinationEdgeCase[] = [
  // Destination with no main image
  {
    id: 'edge-case-dest-no-image',
    status: 'published',
    name: 'Test Destination (No Image)',
    slug: 'test-destination-no-image',
    country: 'Test Country',
    short_description: 'A test destination with no main image.',
    description: 'This test destination is missing a main image to test fallback behavior and error handling.',
    main_image: '',
    categories: ['test'],
  },
  
  // Destination with no highlights
  {
    id: 'edge-case-dest-no-highlights',
    status: 'published',
    name: 'Test Destination (No Highlights)',
    slug: 'test-destination-no-highlights',
    country: 'Test Country',
    short_description: 'A test destination with no highlights.',
    description: 'This test destination has no highlights to test empty relationship handling.',
    main_image: 'placeholder.jpg',
    highlights: [],
    categories: ['test'],
  },
  
  // Destination with no activities
  {
    id: 'edge-case-dest-no-activities',
    status: 'published',
    name: 'Test Destination (No Activities)',
    slug: 'test-destination-no-activities',
    country: 'Test Country',
    short_description: 'A test destination with no activities.',
    description: 'This test destination has no activities to test empty activities array handling.',
    main_image: 'placeholder.jpg',
    activities: [],
    categories: ['test'],
  },
  
  // Destination with no categories
  {
    id: 'edge-case-dest-no-categories',
    status: 'published',
    name: 'Test Destination (No Categories)',
    slug: 'test-destination-no-categories',
    country: 'Test Country',
    short_description: 'A test destination with no categories.',
    description: 'This test destination has no categories to test empty filtering.',
    main_image: 'placeholder.jpg',
    categories: [],
  },
  
  // Destination with minimal data
  {
    id: 'edge-case-dest-minimal',
    status: 'published',
    name: 'Test Destination (Minimal)',
    slug: 'test-destination-minimal',
    country: 'Test Country',
    short_description: 'A minimal test destination with only required fields.',
    description: 'This is a minimal test destination with only the required fields to test fallback behavior.',
    main_image: 'placeholder.jpg',
  },
  
  // Destination with invalid coordinates
  {
    id: 'edge-case-dest-invalid-coordinates',
    status: 'published',
    name: 'Test Destination (Invalid Coordinates)',
    slug: 'test-destination-invalid-coordinates',
    country: 'Test Country',
    short_description: 'A test destination with invalid coordinates format.',
    description: 'This test destination has invalid coordinates data to test error handling.',
    main_image: 'placeholder.jpg',
    // Using a type assertion for testing invalid data scenarios
    coordinates: 'not-an-object' as unknown as { lat: number; lng: number }, 
    categories: ['test'],
  },
  
  // Destination with activities for all seasons
  {
    id: 'edge-case-dest-all-seasons',
    status: 'published',
    name: 'Test Destination (All Seasons)',
    slug: 'test-destination-all-seasons',
    country: 'Test Country',
    short_description: 'A test destination with activities for all seasons.',
    description: 'This test destination has activities for all seasons to test seasonal filtering.',
    main_image: 'placeholder.jpg',
    activities: [
      {
        title: 'Spring Activity',
        description: 'Activity available in spring',
        season: 'spring',
        image: 'placeholder.jpg',
      },
      {
        title: 'Summer Activity',
        description: 'Activity available in summer',
        season: 'summer',
        image: 'placeholder.jpg',
      },
      {
        title: 'Autumn Activity',
        description: 'Activity available in autumn',
        season: 'autumn',
        image: 'placeholder.jpg',
      },
      {
        title: 'Winter Activity',
        description: 'Activity available in winter',
        season: 'winter',
        image: 'placeholder.jpg',
      },
      {
        title: 'All-Season Activity',
        description: 'Activity available all year',
        season: 'all',
        image: 'placeholder.jpg',
      },
    ],
    categories: ['test', 'seasonal'],
  },
  
  // Destination with missing translations
  {
    id: 'edge-case-dest-missing-translations',
    status: 'published',
    name: 'Test Destination (Missing Translations)',
    slug: 'test-destination-missing-translations',
    country: 'Test Country',
    short_description: 'A test destination with missing translations.',
    description: 'This test destination has missing translations to test fallback language behavior.',
    main_image: 'placeholder.jpg',
    categories: ['test'],
    __translations_missing: true, // Special flag for tests
  },
  
  // Destination with draft status (should be filtered out in published-only queries)
  {
    id: 'edge-case-dest-draft',
    status: 'draft',
    name: 'Test Destination (Draft)',
    slug: 'test-destination-draft',
    country: 'Test Country',
    short_description: 'A test destination with draft status.',
    description: 'This test destination has draft status to test status filtering.',
    main_image: 'placeholder.jpg',
    categories: ['test'],
  },
];

/**
 * Combined mock destinations for tests
 */
export const mockAllDestinations: Destination[] = [
  ...mockDestinations,
  ...mockEdgeCaseDestinations
];

// Define type for query parameters
interface DestinationQueryParams {
  filter?: Record<string, any>;
  limit?: number;
  offset?: number;
  sort?: string[];
}

/**
 * Helper function to filter destinations based on query parameters
 * (Simulates Directus filtering logic for tests)
 */
export function filterDestinations(destinations: Destination[], params: DestinationQueryParams): Destination[] {
  let filteredDestinations = [...destinations];
  const { filter, limit = 100, offset = 0, sort = ['-date_created'] } = params;
  
  // Apply filters if provided
  if (filter) {
    // Filter by status
    if (filter.status && filter.status._eq) {
      filteredDestinations = filteredDestinations.filter(destination => destination.status === filter.status._eq);
    }
    
    // Filter by featured status
    if (filter.is_featured !== undefined && filter.is_featured._eq !== undefined) {
      filteredDestinations = filteredDestinations.filter(destination => destination.is_featured === filter.is_featured._eq);
    }
    
    // Filter by popular status
    if (filter.is_popular !== undefined && filter.is_popular._eq !== undefined) {
      filteredDestinations = filteredDestinations.filter(destination => destination.is_popular === filter.is_popular._eq);
    }
    
    // Filter by region
    if (filter.region && filter.region._eq) {
      filteredDestinations = filteredDestinations.filter(destination => destination.region === filter.region._eq);
    }
    
    // Filter by country
    if (filter.country && filter.country._eq) {
      filteredDestinations = filteredDestinations.filter(destination => destination.country === filter.country._eq);
    }
    
    // Filter by categories
    if (filter.categories && filter.categories._contains) {
      filteredDestinations = filteredDestinations.filter(destination => {
        if (!destination.categories) return false;
        
        // Filter logic depends on whether we're checking for one category or multiple
        if (Array.isArray(filter.categories._contains)) {
          // Check if destination has at least one of the requested categories
          return filter.categories._contains.some((cat: string) => destination.categories?.includes(cat));
        } else {
          // Check for a single category
          return destination.categories.includes(filter.categories._contains);
        }
      });
    }
  }
  
  // Apply sorting
  if (sort && sort.length > 0) {
    // Copy the array to avoid mutation issues
    filteredDestinations = [...filteredDestinations];
    
    filteredDestinations.sort((a, b) => {
      for (const sortOption of sort) {
        const isDesc = sortOption.startsWith('-');
        const field = isDesc ? sortOption.substring(1) : sortOption;
        
        // Skip if either destination doesn't have the field
        if (!(field in a) || !(field in b)) continue;
        
        // Safe property access with type checking
        const aValue = a[field as keyof Destination];
        const bValue = b[field as keyof Destination];
        
        // Compare values based on type
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue);
          if (comparison !== 0) {
            return isDesc ? -comparison : comparison;
          }
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          if (aValue < bValue) return isDesc ? 1 : -1;
          if (aValue > bValue) return isDesc ? -1 : 1;
        } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
          if (aValue < bValue) return isDesc ? 1 : -1;
          if (aValue > bValue) return isDesc ? -1 : 1;
        }
      }
      
      return 0;
    });
  }
  
  // Apply pagination
  return filteredDestinations.slice(offset, offset + limit);
}

/**
 * Helper function to find destination by slug
 * (Simulates Directus single-item retrieval for tests)
 */
export function findDestinationBySlug(destinations: Destination[], slug: string): Destination | null {
  return destinations.find(destination => destination.slug === slug && destination.status === 'published') || null;
}

/**
 * Helper function to find destination by ID
 * (Simulates Directus single-item retrieval for tests)
 */
export function findDestinationById(destinations: Destination[], id: string): Destination | null {
  return destinations.find(destination => destination.id === id && destination.status === 'published') || null;
}

/**
 * Helper function to filter activities by season
 * Useful for testing seasonal content
 */
export function filterActivitiesBySeason(
  destination: Destination, 
  season: 'spring' | 'summer' | 'autumn' | 'winter' | 'all'
): Array<{ title: string; description?: string; season: string; image?: string }> {
  if (!destination.activities) return [];
  
  return destination.activities.filter(activity => 
    activity.season === season || activity.season === 'all'
  );
}

/**
 * Helper function to validate coordinates
 */
export function hasValidCoordinates(destination: Destination): boolean {
  return (
    !!destination.coordinates &&
    typeof destination.coordinates === 'object' &&
    typeof destination.coordinates.lat === 'number' &&
    typeof destination.coordinates.lng === 'number' &&
    destination.coordinates.lat >= -90 && 
    destination.coordinates.lat <= 90 &&
    destination.coordinates.lng >= -180 &&
    destination.coordinates.lng <= 180
  );
}