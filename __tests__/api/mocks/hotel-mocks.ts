/**
 * Hotel mocks for testing
 * 
 * This file contains extended mock data for hotel tests, including
 * normal cases and edge cases for thorough testing.
 */
import { Hotel, Room, Destination, Category } from '../../../src/lib/directus';

// Import the raw data (these imports will work after running the data export script)
// For simplicity, we're declaring dummy data directly in this file
// In a real implementation, you would import from the exported JSON files:
// import hotelData from './data/hotels.json';
// import roomData from './data/rooms.json';
// import categoryData from './data/categories.json';
// import destinationData from './data/destinations.json';

/**
 * Base hotel data for normal test cases
 */
export const mockHotels: Hotel[] = [
  {
    id: '1',
    status: 'published',
    name: 'Hotel Schgaguler',
    slug: 'hotel-schgaguler',
    subtitle: 'Contemporary Alpine Retreat',
    location: 'Castelrotto, South Tyrol',
    region: 'alps',
    short_description: 'A minimalist design hotel in the heart of the Dolomites.',
    description: 'Nestled in the picturesque village of Castelrotto, the Schgaguler Hotel combines Alpine tradition with contemporary design. Surrounded by the majestic Dolomites, this family-run retreat offers a refined mountain experience with a focus on local materials, craftsmanship, and sustainable luxury.',
    coordinates: { lat: 46.573, lng: 11.428 },
    address: 'Via Dolomiti 45',
    zip: '39040',
    city: 'Castelrotto',
    country: 'Italy',
    main_image: 'hotel-schgaguler.jpg',
    gallery: [
      { image: 'schgaguler-1.jpg', alt: 'Hotel Exterior', caption: 'The striking minimalist facade' },
      { image: 'schgaguler-2.jpg', alt: 'Mountain View Room', caption: 'Wake up to panoramic mountain views' },
      { image: 'schgaguler-3.jpg', alt: 'Hotel Spa', caption: 'Relax in our alpine-inspired spa' }
    ],
    price_from: 350,
    currency: 'EUR',
    price_notes: 'Rates include breakfast and spa access',
    star_rating: 4,
    user_rating: 4.8,
    review_count: 127,
    year_built: 1986,
    year_renovated: 2018,
    room_count: 42,
    amenities: ['spa', 'restaurant', 'free_wifi', 'parking', 'minibar', 'room_service'],
    features: [
      {
        title: 'Alpine Spa',
        description: 'Featuring indoor pool, saunas, and treatments using locally sourced ingredients',
        icon: 'spa'
      },
      {
        title: 'Mountain View Restaurant',
        description: 'Seasonal South Tyrolean cuisine with modern interpretations',
        icon: 'restaurant'
      }
    ],
    categories: ['luxury', 'design', 'mountain'],
    tags: ['ski', 'hiking', 'wellness', 'architecture'],
    destination: '1', // South Tyrol
    is_featured: true,
    is_new: false,
    owner_information: [
      { 
        name: 'Schgaguler Family',
        description: 'The hotel has been in the Schgaguler family for three generations'
      }
    ],
    meta_title: 'Hotel Schgaguler | Contemporary Alpine Retreat in the Dolomites',
    meta_description: 'Experience minimalist luxury in the heart of the Dolomites. The Schgaguler Hotel offers refined accommodations, mountain views, and authentic South Tyrolean hospitality.',
    rooms: [
      {
        id: '101',
        status: 'published',
        name: 'Alpine Suite',
        slug: 'alpine-suite',
        description: 'Spacious suite with panoramic mountain views, separate living area, and premium amenities.',
        size: '55 m²',
        max_occupancy: 3,
        bed_type: 'king',
        bed_count: 1,
        bathroom_count: 1,
        view_type: 'mountain',
        main_image: 'schgaguler-suite.jpg',
        price_per_night: 550,
        currency: 'EUR',
        amenities: ['minibar', 'wifi', 'tv', 'safe', 'hairdryer', 'bathrobe'],
        hotel: '1'
      },
      {
        id: '102',
        status: 'published',
        name: 'Deluxe Room',
        slug: 'deluxe-room',
        description: 'Elegant room with mountain views, king-size bed, and modern bathroom with walk-in shower.',
        size: '32 m²',
        max_occupancy: 2,
        bed_type: 'king',
        bed_count: 1,
        bathroom_count: 1,
        view_type: 'mountain',
        main_image: 'schgaguler-deluxe.jpg',
        price_per_night: 350,
        currency: 'EUR',
        amenities: ['minibar', 'wifi', 'tv', 'safe', 'hairdryer'],
        hotel: '1'
      }
    ]
  },
  {
    id: '2',
    status: 'published',
    name: 'Hotel Forestis',
    slug: 'hotel-forestis',
    subtitle: 'Luxury Forest Retreat',
    location: 'Brixen, South Tyrol',
    region: 'alps',
    short_description: 'A sanctuary of wellness nestled in the Dolomite forest.',
    description: 'Perched at 1,800 meters above sea level, Forestis is a sanctuary of wellbeing surrounded by pristine nature. This adults-only retreat focuses on forest bathing, natural wellness, and sustainable luxury. The architecture seamlessly blends with the mountainous landscape, featuring floor-to-ceiling windows that frame spectacular views of the Dolomites.',
    coordinates: { lat: 46.736, lng: 11.686 },
    address: 'Palmschoss 22',
    zip: '39042',
    city: 'Brixen',
    country: 'Italy',
    main_image: 'hotel-forestis.jpg',
    gallery: [
      { image: 'forestis-1.jpg', alt: 'Forest View', caption: 'Surrounded by ancient pine forests' },
      { image: 'forestis-2.jpg', alt: 'Minimalist Suite', caption: 'Elegant suites with natural materials' },
      { image: 'forestis-3.jpg', alt: 'Infinity Pool', caption: 'Our mountain-view infinity pool' }
    ],
    price_from: 650,
    currency: 'EUR',
    price_notes: 'Rates include half-board and wellness facilities',
    star_rating: 5,
    user_rating: 4.9,
    review_count: 89,
    year_built: 2020,
    year_renovated: null,
    room_count: 62,
    amenities: ['spa', 'restaurant', 'free_wifi', 'parking', 'minibar', 'room_service', 'pool'],
    features: [
      {
        title: 'Forest Spa',
        description: 'A 2,000 sqm wellness area with indoor and outdoor pools, saunas, and forest-inspired treatments',
        icon: 'spa'
      },
      {
        title: 'Sustainable Gourmet Restaurant',
        description: 'Featuring locally foraged ingredients and Alpine traditions',
        icon: 'restaurant'
      }
    ],
    categories: ['luxury', 'wellness', 'adults_only', 'mountain'],
    tags: ['spa', 'hiking', 'nature', 'sustainable'],
    destination: '1', // South Tyrol
    is_featured: true,
    is_new: true,
    owner_information: [
      { 
        name: 'Teresa and Stefan Hinteregger',
        description: 'The visionary owners who transformed a historic building into a sanctuary of wellbeing'
      }
    ],
    meta_title: 'Forestis | Luxury Wellness Retreat in the Dolomites',
    meta_description: 'Experience forest bathing and mountain wellness at Forestis, an exclusive adults-only retreat in the UNESCO World Heritage Dolomites.',
    rooms: [
      {
        id: '201',
        status: 'published',
        name: 'Forest Suite',
        slug: 'forest-suite',
        description: 'Harmonious suite with private terrace, outdoor lounging area, and panoramic forest views.',
        size: '65 m²',
        max_occupancy: 2,
        bed_type: 'king',
        bed_count: 1,
        bathroom_count: 1,
        view_type: 'mountain',
        main_image: 'forestis-suite.jpg',
        price_per_night: 850,
        currency: 'EUR',
        amenities: ['minibar', 'wifi', 'tv', 'safe', 'hairdryer', 'bathrobe', 'terrace'],
        hotel: '2'
      }
    ]
  },
  {
    id: '3',
    status: 'published',
    name: 'Hotel Giardino Marling',
    slug: 'hotel-giardino-marling',
    subtitle: 'Mediterranean Alpine Fusion',
    location: 'Marling, South Tyrol',
    region: 'alps',
    short_description: 'Where Mediterranean lifestyle meets Alpine tradition.',
    description: 'Nestled on a sunny plateau above Merano, Hotel Giardino Marling combines Mediterranean flair with Alpine scenery. The lush garden setting features olive trees, palm trees, and vibrant flowers, creating a unique microclimate. This family-run property offers a warm atmosphere, excellent cuisine blending Italian and Tyrolean flavors, and spectacular views of the Texel mountains.',
    coordinates: { lat: 46.661, lng: 11.159 },
    address: 'Via Cermes 12',
    zip: '39020',
    city: 'Marling',
    country: 'Italy',
    main_image: 'hotel-giardino.jpg',
    gallery: [
      { image: 'giardino-1.jpg', alt: 'Mediterranean Garden', caption: 'Our lush gardens with mountain backdrop' },
      { image: 'giardino-2.jpg', alt: 'Outdoor Pool', caption: 'Relax by our heated outdoor pool' },
      { image: 'giardino-3.jpg', alt: 'Restaurant Terrace', caption: 'Dine with a view' }
    ],
    price_from: 220,
    currency: 'EUR',
    price_notes: 'Rates include breakfast',
    star_rating: 4,
    user_rating: 4.6,
    review_count: 214,
    year_built: 1995,
    year_renovated: 2016,
    room_count: 48,
    amenities: ['pool', 'restaurant', 'free_wifi', 'parking', 'minibar', 'garden'],
    features: [
      {
        title: 'Mediterranean Gardens',
        description: 'Stroll through olive groves, palm trees, and vibrant flower arrangements',
        icon: 'garden'
      },
      {
        title: 'Panorama Restaurant',
        description: 'Enjoy Italian-Tyrolean fusion cuisine with local wines',
        icon: 'restaurant'
      }
    ],
    categories: ['boutique', 'family_friendly', 'mountain'],
    tags: ['garden', 'pool', 'hiking', 'biking', 'wine'],
    destination: '1', // South Tyrol
    is_featured: false,
    is_new: false,
    owner_information: [
      { 
        name: 'The Mair Family',
        description: 'Hosts with passion for hospitality and South Tyrolean traditions'
      }
    ],
    meta_title: 'Hotel Giardino Marling | Mediterranean Flair in South Tyrol',
    meta_description: 'Experience the unique blend of Mediterranean ambiance and Alpine scenery at Hotel Giardino Marling, a family-run gem with lush gardens and mountain views.',
    rooms: [
      {
        id: '301',
        status: 'published',
        name: 'Garden Room',
        slug: 'garden-room',
        description: 'Comfortable room with balcony overlooking the Mediterranean gardens.',
        size: '28 m²',
        max_occupancy: 2,
        bed_type: 'queen',
        bed_count: 1,
        bathroom_count: 1,
        view_type: 'garden',
        main_image: 'giardino-room.jpg',
        price_per_night: 220,
        currency: 'EUR',
        amenities: ['balcony', 'wifi', 'tv', 'safe', 'hairdryer'],
        hotel: '3'
      }
    ]
  }
];

// Define a type for hotel edge cases with custom properties
interface HotelEdgeCase extends Hotel {
  __translations_missing?: boolean;
}

/**
 * Edge case hotels with special test scenarios
 */
export const mockEdgeCaseHotels: HotelEdgeCase[] = [
  // Hotel with no main image
  {
    id: 'edge-case-no-image',
    status: 'published',
    name: 'Test Hotel (No Image)',
    slug: 'test-hotel-no-image',
    location: 'Test Location',
    region: 'alps',
    short_description: 'A test hotel with no main image.',
    description: 'This test hotel is missing a main image to test fallback behavior and error handling.',
    price_from: 300,
    currency: 'EUR',
    main_image: '', // Empty string to test missing image
    rooms: [], // No rooms
    categories: ['test', 'edge_case'],
    destination: '1',
  },
  
  // Hotel with no rooms
  {
    id: 'edge-case-no-rooms',
    status: 'published',
    name: 'Test Hotel (No Rooms)',
    slug: 'test-hotel-no-rooms',
    location: 'Test Location',
    region: 'alps',
    short_description: 'A test hotel with no rooms.',
    description: 'This test hotel has no rooms to test empty relationship handling.',
    price_from: 300,
    currency: 'EUR',
    main_image: 'placeholder.jpg',
    rooms: [], // Empty array
    categories: ['test', 'edge_case'],
    destination: '1',
  },
  
  // Hotel with no categories
  {
    id: 'edge-case-no-categories',
    status: 'published',
    name: 'Test Hotel (No Categories)',
    slug: 'test-hotel-no-categories',
    location: 'Test Location',
    region: 'alps',
    short_description: 'A test hotel with no categories.',
    description: 'This test hotel has no categories to test empty filtering.',
    price_from: 300,
    currency: 'EUR',
    main_image: 'placeholder.jpg',
    categories: [], // Empty array
    destination: '1',
    rooms: [
      {
        id: '901',
        status: 'published',
        name: 'Test Room',
        slug: 'test-room',
        description: 'A test room.',
        size: '30 m²',
        max_occupancy: 2,
        main_image: 'placeholder.jpg',
        price_per_night: 300,
        currency: 'EUR',
        hotel: 'edge-case-no-categories'
      }
    ]
  },
  
  // Hotel with minimal data (only required fields)
  {
    id: 'edge-case-minimal',
    status: 'published',
    name: 'Test Hotel (Minimal)',
    slug: 'test-hotel-minimal',
    location: 'Test Location',
    short_description: 'A minimal test hotel with only required fields.',
    description: 'This is a minimal test hotel with only the required fields to test fallback behavior.',
    main_image: 'placeholder.jpg',
    price_from: 100,
    currency: 'EUR',
  },
  
  // Hotel with very high price
  {
    id: 'edge-case-high-price',
    status: 'published',
    name: 'Test Hotel (High Price)',
    slug: 'test-hotel-high-price',
    location: 'Test Location',
    region: 'alps',
    short_description: 'A test hotel with an extremely high price.',
    description: 'This test hotel has an extremely high price to test sorting and filtering by price.',
    price_from: 99999, // Very high price
    currency: 'EUR',
    main_image: 'placeholder.jpg',
    categories: ['luxury', 'test'],
    destination: '1',
  },
  
  // Hotel with all missing translations
  {
    id: 'edge-case-no-translations',
    status: 'published',
    name: 'Test Hotel (No Translations)',
    slug: 'test-hotel-no-translations',
    location: 'Test Location',
    region: 'alps',
    short_description: 'A test hotel with no translations.',
    description: 'This test hotel has no translations to test fallback language behavior.',
    price_from: 300,
    currency: 'EUR',
    main_image: 'placeholder.jpg',
    categories: ['test'],
    destination: '1',
    // Explicitly marking translations as missing for test
    __translations_missing: true
  },
  
  // Hotel with invalid data format
  {
    id: 'edge-case-invalid-format',
    status: 'published',
    name: 'Test Hotel (Invalid Format)',
    slug: 'test-hotel-invalid-format',
    location: 'Test Location',
    region: 'alps',
    short_description: 'A test hotel with invalid data formats.',
    description: 'This test hotel has invalid data formats to test error handling.',
    price_from: 300,
    currency: 'EUR',
    main_image: 'placeholder.jpg',
    // Using a type assertion for testing invalid data scenarios
    coordinates: 'not-an-object' as unknown as { lat: number; lng: number },
    categories: ['test'],
    destination: '1',
  },
  
  // Hotel with draft status (should be filtered out in published-only queries)
  {
    id: 'edge-case-draft-status',
    status: 'draft',
    name: 'Test Hotel (Draft)',
    slug: 'test-hotel-draft',
    location: 'Test Location',
    region: 'alps',
    short_description: 'A test hotel with draft status.',
    description: 'This test hotel has draft status to test status filtering.',
    price_from: 300,
    currency: 'EUR',
    main_image: 'placeholder.jpg',
    categories: ['test'],
    destination: '1',
  }
];

/**
 * Combined mock hotels for tests
 */
export const mockAllHotels: Hotel[] = [
  ...mockHotels,
  ...mockEdgeCaseHotels
];

/**
 * Mock categories
 */
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Luxury',
    slug: 'luxury',
    description: 'High-end hotels with premium amenities and services',
    type: 'hotel',
    featured: true,
  },
  {
    id: '2',
    name: 'Design',
    slug: 'design',
    description: 'Hotels with exceptional architectural and interior design',
    type: 'hotel',
    featured: true,
  },
  {
    id: '3',
    name: 'Mountain',
    slug: 'mountain',
    description: 'Hotels nestled in mountain landscapes',
    type: 'both',
    featured: true,
  },
  {
    id: '4',
    name: 'Wellness',
    slug: 'wellness',
    description: 'Hotels with exceptional spa and wellness facilities',
    type: 'hotel',
    featured: true,
  },
  {
    id: '5',
    name: 'Boutique',
    slug: 'boutique',
    description: 'Small, unique hotels with personalized service',
    type: 'hotel',
    featured: false,
  },
  {
    id: '6',
    name: 'Family Friendly',
    slug: 'family_friendly',
    description: 'Hotels with amenities and activities for all ages',
    type: 'hotel',
    featured: false,
  },
  {
    id: '7',
    name: 'Adults Only',
    slug: 'adults_only',
    description: 'Hotels exclusively for adult guests',
    type: 'hotel',
    featured: false,
  },
  {
    id: '8',
    name: 'Test',
    slug: 'test',
    description: 'Test category for edge cases',
    type: 'hotel',
    featured: false,
  }
];

/**
 * Mock destinations
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
    is_featured: true,
    is_popular: true,
    categories: ['mountain', 'culinary', 'cultural'],
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
    is_featured: true,
    is_popular: true,
    categories: ['mountain', 'luxury', 'sports'],
  }
];

// Define type for query parameters
interface HotelQueryParams {
  filter?: Record<string, any>;
  limit?: number;
  offset?: number;
  sort?: string[];
}

/**
 * Helper function to filter hotels based on query parameters
 * (Simulates Directus filtering logic for tests)
 */
export function filterHotels(hotels: Hotel[], params: HotelQueryParams): Hotel[] {
  let filteredHotels = [...hotels];
  const { filter, limit = 100, offset = 0, sort = ['-date_created'] } = params;
  
  // Apply filters if provided
  if (filter) {
    // Filter by status
    if (filter.status && filter.status._eq) {
      filteredHotels = filteredHotels.filter(hotel => hotel.status === filter.status._eq);
    }
    
    // Filter by featured status
    if (filter.is_featured !== undefined && filter.is_featured._eq !== undefined) {
      filteredHotels = filteredHotels.filter(hotel => hotel.is_featured === filter.is_featured._eq);
    }
    
    // Filter by destination
    if (filter.destination && filter.destination._eq) {
      filteredHotels = filteredHotels.filter(hotel => hotel.destination === filter.destination._eq);
    }
    
    // Filter by price range
    if (filter.price_from) {
      if (filter.price_from._gte) {
        filteredHotels = filteredHotels.filter(hotel => hotel.price_from >= filter.price_from._gte);
      }
      if (filter.price_from._lte) {
        filteredHotels = filteredHotels.filter(hotel => hotel.price_from <= filter.price_from._lte);
      }
    }
    
    // Filter by categories
    if (filter.categories && filter.categories._contains) {
      filteredHotels = filteredHotels.filter(hotel => {
        if (!hotel.categories) return false;
        
        // Filter logic depends on whether we're checking for one category or multiple
        if (Array.isArray(filter.categories._contains)) {
          // Check if hotel has at least one of the requested categories
          return filter.categories._contains.some((cat: string) => hotel.categories?.includes(cat));
        } else {
          // Check for a single category
          return hotel.categories.includes(filter.categories._contains);
        }
      });
    }
    
    // Filter by region
    if (filter.region && filter.region._eq) {
      filteredHotels = filteredHotels.filter(hotel => hotel.region === filter.region._eq);
    }
  }
  
  // Apply sorting
  if (sort && sort.length > 0) {
    // Copy the array to avoid mutation issues
    filteredHotels = [...filteredHotels];
    
    filteredHotels.sort((a, b) => {
      for (const sortOption of sort) {
        const isDesc = sortOption.startsWith('-');
        const field = isDesc ? sortOption.substring(1) : sortOption;
        
        // Skip if either hotel doesn't have the field
        if (!(field in a) || !(field in b)) continue;
        
        // Safe property access with type checking
        const aValue = a[field as keyof Hotel];
        const bValue = b[field as keyof Hotel];
        
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
  return filteredHotels.slice(offset, offset + limit);
}

/**
 * Helper function to find hotel by slug
 * (Simulates Directus single-item retrieval for tests)
 */
export function findHotelBySlug(hotels: Hotel[], slug: string): Hotel | null {
  return hotels.find(hotel => hotel.slug === slug && hotel.status === 'published') || null;
}

/**
 * Helper function to find hotel by ID
 * (Simulates Directus single-item retrieval for tests)
 */
export function findHotelById(hotels: Hotel[], id: string): Hotel | null {
  return hotels.find(hotel => hotel.id === id && hotel.status === 'published') || null;
}