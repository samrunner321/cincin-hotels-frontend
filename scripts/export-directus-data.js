/**
 * Script to extract hotel data from Directus API
 * 
 * This script fetches complete hotel data including relationships 
 * and saves it to a JSON file for use in tests.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { directusPublicRest, getDirectusAdminToken } = require('../src/lib/directus');
const { createDirectus, rest, staticToken } = require('@directus/sdk');

// Maximum number of items to fetch per request
const MAX_LIMIT = 100;

// Define test data directory
const TEST_DATA_DIR = path.join(__dirname, '../__tests__/api/mocks/data');
fs.mkdirSync(TEST_DATA_DIR, { recursive: true });

// Create directus admin client for better access
const directusClient = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055')
  .with(rest())
  .with(staticToken(getDirectusAdminToken()));

/**
 * Fetch all items from a collection with pagination
 */
async function fetchAllItems(collection, options = {}) {
  const {
    filter = {},
    fields = ['*'],
    sort = ['id'],
  } = options;
  
  let allItems = [];
  let offset = 0;
  let hasMore = true;
  
  console.log(`Fetching all items from ${collection}...`);
  
  while (hasMore) {
    try {
      const items = await directusClient.request(
        rest.readItems(collection, {
          limit: MAX_LIMIT,
          offset,
          filter,
          fields,
          sort,
        })
      );
      
      if (items && items.length > 0) {
        allItems = allItems.concat(items);
        offset += items.length;
        console.log(`  Fetched ${items.length} items, total: ${allItems.length}`);
      } else {
        hasMore = false;
      }
      
      // If we got fewer items than the limit, we're at the end
      if (items.length < MAX_LIMIT) {
        hasMore = false;
      }
    } catch (error) {
      console.error(`Error fetching items from ${collection}:`, error);
      hasMore = false;
    }
  }
  
  return allItems;
}

/**
 * Get hotels with all relationships
 */
async function getHotelsWithRelationships() {
  // Fetch hotels with all fields and relationships
  const hotels = await fetchAllItems('hotels', {
    filter: { status: { _eq: 'published' } },
    fields: [
      '*',
      'main_image.*',
      'gallery.image.*',
      'destination.*',
      'destination.main_image.*',
      'categories.*',
      'rooms.*',
      'rooms.main_image.*',
      'rooms.gallery.image.*',
      'features.*',
      'owner_information.*',
    ],
  });
  
  console.log(`Fetched ${hotels.length} hotels with relationships`);
  return hotels;
}

/**
 * Get categories with all fields
 */
async function getCategories() {
  const categories = await fetchAllItems('categories', {
    fields: ['*', 'image.*'],
  });
  
  console.log(`Fetched ${categories.length} categories`);
  return categories;
}

/**
 * Get destinations with all relationships
 */
async function getDestinationsWithRelationships() {
  const destinations = await fetchAllItems('destinations', {
    filter: { status: { _eq: 'published' } },
    fields: [
      '*',
      'main_image.*',
      'gallery.image.*',
      'highlights.*',
      'highlights.image.*',
      'activities.*',
      'activities.image.*',
      'dining.*',
      'dining.image.*',
      'travel_info.*',
      'weather.*',
      'categories.*',
    ],
  });
  
  console.log(`Fetched ${destinations.length} destinations with relationships`);
  return destinations;
}

/**
 * Get rooms with all fields
 */
async function getRooms() {
  const rooms = await fetchAllItems('rooms', {
    filter: { status: { _eq: 'published' } },
    fields: [
      '*',
      'main_image.*',
      'gallery.image.*',
      'features.*',
      'amenities',
    ],
  });
  
  console.log(`Fetched ${rooms.length} rooms`);
  return rooms;
}

/**
 * Get translations
 */
async function getTranslations() {
  const translations = await fetchAllItems('translations', {
    fields: ['*'],
  });
  
  console.log(`Fetched ${translations.length} translations`);
  return translations;
}

/**
 * Create edge case hotels with specially crafted data for testing
 */
function createEdgeCaseHotels(hotels) {
  // Base template from a real hotel
  const baseHotel = hotels[0];
  
  // Create hotels with special edge cases for testing
  const edgeCaseHotels = [
    // Hotel with no main image
    {
      ...JSON.parse(JSON.stringify(baseHotel)),
      id: 'edge-case-no-image',
      name: 'Test Hotel (No Image)',
      slug: 'test-hotel-no-image',
      main_image: null,
    },
    
    // Hotel with no rooms
    {
      ...JSON.parse(JSON.stringify(baseHotel)),
      id: 'edge-case-no-rooms',
      name: 'Test Hotel (No Rooms)',
      slug: 'test-hotel-no-rooms',
      rooms: [],
    },
    
    // Hotel with no categories
    {
      ...JSON.parse(JSON.stringify(baseHotel)),
      id: 'edge-case-no-categories',
      name: 'Test Hotel (No Categories)',
      slug: 'test-hotel-no-categories',
      categories: null,
    },
    
    // Hotel with minimal data
    {
      id: 'edge-case-minimal',
      status: 'published',
      name: 'Test Hotel (Minimal)',
      slug: 'test-hotel-minimal',
      location: 'Test Location',
      short_description: 'This is a minimal test hotel',
      description: 'This is a minimal test hotel with only the required fields.',
      main_image: baseHotel.main_image,
      price_from: 100,
      currency: 'EUR',
    },
    
    // Hotel with very high price
    {
      ...JSON.parse(JSON.stringify(baseHotel)),
      id: 'edge-case-high-price',
      name: 'Test Hotel (High Price)',
      slug: 'test-hotel-high-price',
      price_from: 99999,
    },
    
    // Hotel with invalid data format
    {
      ...JSON.parse(JSON.stringify(baseHotel)),
      id: 'edge-case-invalid-format',
      name: 'Test Hotel (Invalid Format)',
      slug: 'test-hotel-invalid-format',
      coordinates: 'not-an-object', // Should be an object
    },
  ];
  
  return edgeCaseHotels;
}

/**
 * Create edge case destinations with specially crafted data for testing
 */
function createEdgeCaseDestinations(destinations) {
  // Base template from a real destination
  const baseDestination = destinations[0];
  
  // Create destinations with special edge cases for testing
  const edgeCaseDestinations = [
    // Destination with no main image
    {
      ...JSON.parse(JSON.stringify(baseDestination)),
      id: 'edge-case-dest-no-image',
      name: 'Test Destination (No Image)',
      slug: 'test-destination-no-image',
      main_image: null,
    },
    
    // Destination with no highlights
    {
      ...JSON.parse(JSON.stringify(baseDestination)),
      id: 'edge-case-dest-no-highlights',
      name: 'Test Destination (No Highlights)',
      slug: 'test-destination-no-highlights',
      highlights: [],
    },
    
    // Destination with no activities
    {
      ...JSON.parse(JSON.stringify(baseDestination)),
      id: 'edge-case-dest-no-activities',
      name: 'Test Destination (No Activities)',
      slug: 'test-destination-no-activities',
      activities: [],
    },
    
    // Destination with no categories
    {
      ...JSON.parse(JSON.stringify(baseDestination)),
      id: 'edge-case-dest-no-categories',
      name: 'Test Destination (No Categories)',
      slug: 'test-destination-no-categories',
      categories: [],
    },
    
    // Destination with minimal data
    {
      id: 'edge-case-dest-minimal',
      status: 'published',
      name: 'Test Destination (Minimal)',
      slug: 'test-destination-minimal',
      country: 'Test Country',
      short_description: 'This is a minimal test destination',
      description: 'This is a minimal test destination with only the required fields.',
      main_image: baseDestination.main_image,
    },
    
    // Destination with invalid coordinates
    {
      ...JSON.parse(JSON.stringify(baseDestination)),
      id: 'edge-case-dest-invalid-coordinates',
      name: 'Test Destination (Invalid Coordinates)',
      slug: 'test-destination-invalid-coordinates',
      coordinates: 'not-an-object', // Should be an object
    },
    
    // Destination with activities for all seasons
    {
      ...JSON.parse(JSON.stringify(baseDestination)),
      id: 'edge-case-dest-all-seasons',
      name: 'Test Destination (All Seasons)',
      slug: 'test-destination-all-seasons',
      activities: [
        {
          title: 'Spring Activity',
          description: 'Activity available in spring',
          season: 'spring',
          image: baseDestination.main_image,
        },
        {
          title: 'Summer Activity',
          description: 'Activity available in summer',
          season: 'summer',
          image: baseDestination.main_image,
        },
        {
          title: 'Autumn Activity',
          description: 'Activity available in autumn',
          season: 'autumn',
          image: baseDestination.main_image,
        },
        {
          title: 'Winter Activity',
          description: 'Activity available in winter',
          season: 'winter',
          image: baseDestination.main_image,
        },
        {
          title: 'All-Season Activity',
          description: 'Activity available all year',
          season: 'all',
          image: baseDestination.main_image,
        },
      ],
    },
    
    // Destination with missing translations
    {
      ...JSON.parse(JSON.stringify(baseDestination)),
      id: 'edge-case-dest-missing-translations',
      name: 'Test Destination (Missing Translations)',
      slug: 'test-destination-missing-translations',
      __translations_missing: true, // Special flag for tests
    },
    
    // Destination with draft status (should be filtered out in published-only queries)
    {
      ...JSON.parse(JSON.stringify(baseDestination)),
      id: 'edge-case-dest-draft',
      name: 'Test Destination (Draft)',
      slug: 'test-destination-draft',
      status: 'draft',
    },
  ];
  
  return edgeCaseDestinations;
}

/**
 * Main function to extract and save data
 */
async function extractAndSaveData() {
  try {
    // Create test data directory if it doesn't exist
    if (!fs.existsSync(TEST_DATA_DIR)) {
      fs.mkdirSync(TEST_DATA_DIR, { recursive: true });
    }
    
    // Fetch data from Directus
    const hotels = await getHotelsWithRelationships();
    const categories = await getCategories();
    const destinations = await getDestinationsWithRelationships();
    const rooms = await getRooms();
    const translations = await getTranslations();
    
    // Add edge case hotels for testing
    const edgeCaseHotels = createEdgeCaseHotels(hotels);
    const allHotels = [...hotels, ...edgeCaseHotels];
    
    // Add edge case destinations for testing
    const edgeCaseDestinations = createEdgeCaseDestinations(destinations);
    const allDestinations = [...destinations, ...edgeCaseDestinations];
    
    // Save data to JSON files
    fs.writeFileSync(
      path.join(TEST_DATA_DIR, 'hotels.json'),
      JSON.stringify(allHotels, null, 2)
    );
    
    fs.writeFileSync(
      path.join(TEST_DATA_DIR, 'categories.json'),
      JSON.stringify(categories, null, 2)
    );
    
    fs.writeFileSync(
      path.join(TEST_DATA_DIR, 'destinations.json'),
      JSON.stringify(allDestinations, null, 2)
    );
    
    fs.writeFileSync(
      path.join(TEST_DATA_DIR, 'rooms.json'),
      JSON.stringify(rooms, null, 2)
    );
    
    fs.writeFileSync(
      path.join(TEST_DATA_DIR, 'translations.json'),
      JSON.stringify(translations, null, 2)
    );
    
    console.log('Data extraction complete!');
    console.log(`Exported ${allHotels.length} hotels (${hotels.length} real, ${edgeCaseHotels.length} edge cases)`);
    console.log(`Exported ${allDestinations.length} destinations (${destinations.length} real, ${edgeCaseDestinations.length} edge cases)`);
    console.log(`Exported ${categories.length} categories`);
    console.log(`Exported ${rooms.length} rooms`);
    console.log(`Exported ${translations.length} translations`);
    console.log(`Files saved to ${TEST_DATA_DIR}`);
  } catch (error) {
    console.error('Error extracting data:', error);
  }
}

// Run the data extraction
extractAndSaveData();