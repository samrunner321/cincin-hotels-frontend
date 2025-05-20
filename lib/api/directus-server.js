/**
 * Directus Server API
 * Serverside helper functions for interacting with Directus API
 */

const { getDirectusPublicToken, getDirectusAdminToken } = require('../../src/lib/auth-utils');

// Directus configuration
const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

// Default locale for translations
const DEFAULT_LOCALE = 'de-DE';
const FALLBACK_LOCALE = 'en-US';

/**
 * Generic function to fetch data from Directus API
 * @param {string} endpoint - API endpoint path (e.g., 'items/hotels')
 * @param {object} options - Request options
 * @returns {Promise<object>} API response
 */
export async function fetchFromDirectusServer(endpoint, options = {}) {
  try {
    // Set up URL with base path
    const url = new URL(`${DIRECTUS_URL}/${endpoint}`);
    
    // Process filter parameters
    if (options.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          // If the value is an object, use the appropriate operators
          Object.entries(value).forEach(([operator, opValue]) => {
            url.searchParams.append(`filter[${key}][${operator}]`, opValue);
          });
        } else {
          // Default to _eq operator
          url.searchParams.append(`filter[${key}][_eq]`, value);
        }
      });
    }
    
    // Process field selection
    if (options.fields) {
      const fieldsStr = Array.isArray(options.fields) ? options.fields.join(',') : options.fields;
      url.searchParams.append('fields', fieldsStr);
    }
    
    // Process deep filters (for relations)
    if (options.deep) {
      Object.entries(options.deep).forEach(([relation, filters]) => {
        if (typeof filters === 'object' && filters !== null) {
          Object.entries(filters).forEach(([filterKey, filterValue]) => {
            // If filterValue is an object (for operators like _eq)
            if (typeof filterValue === 'object' && filterValue !== null) {
              Object.entries(filterValue).forEach(([operator, opValue]) => {
                url.searchParams.append(`deep[${relation}][${filterKey}][${operator}]`, opValue);
              });
            } else {
              url.searchParams.append(`deep[${relation}][${filterKey}]`, filterValue);
            }
          });
        }
      });
    }
    
    // Process pagination
    if (options.limit) url.searchParams.append('limit', options.limit);
    if (options.offset) url.searchParams.append('offset', options.offset);
    
    // Process sorting
    if (options.sort) {
      const sortStr = Array.isArray(options.sort) ? options.sort.join(',') : options.sort;
      url.searchParams.append('sort', sortStr);
    }
    
    // Log the request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Directus Server API Request: ${url.toString()}`);
    }
    
    // Choose the appropriate token based on options
    const token = options.useAdminToken ? getDirectusAdminToken() : getDirectusPublicToken();
    
    // Make the API request with authentication
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        ...options.headers
      },
      ...options.fetchOptions
    });
    
    // Handle errors
    if (!response.ok) {
      throw new Error(`API error: ${response.status} - ${response.statusText}`);
    }
    
    // Parse and return the response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Process an item to apply translations and image URLs
 * @param {object} item - Item to process
 * @param {string} locale - Current locale
 * @param {array} imageFields - List of image fields to process
 * @returns {object} Processed item
 */
export function processItemForClient(item, locale = DEFAULT_LOCALE, imageFields = ['main_image']) {
  if (!item) return null;
  
  // Create a copy of the item
  const processedItem = { ...item };
  
  // Process translations
  if (processedItem.translations) {
    // Handle array of translations
    if (Array.isArray(processedItem.translations)) {
      const translation = processedItem.translations.find(t => 
        t.languages_code === locale || t.languages_id === locale
      );
      
      if (translation) {
        // Apply translation fields to the main object
        Object.keys(translation).forEach(key => {
          if (key !== 'id' && key !== 'languages_code' && key !== 'languages_id' && 
              key !== 'item' && key !== 'metadata') {
            if (translation[key] !== null && translation[key] !== undefined) {
              processedItem[key] = translation[key];
            }
          }
        });
      }
    } 
    // Handle single translation object
    else if (typeof processedItem.translations === 'object' && processedItem.translations !== null) {
      Object.keys(processedItem.translations).forEach(key => {
        if (key !== 'id' && key !== 'languages_code' && key !== 'languages_id' && 
            key !== 'item' && key !== 'metadata') {
          if (processedItem.translations[key] !== null && processedItem.translations[key] !== undefined) {
            processedItem[key] = processedItem.translations[key];
          }
        }
      });
    }
  }
  
  // Process image fields
  if (imageFields && imageFields.length > 0) {
    imageFields.forEach(field => {
      if (field === 'gallery' && processedItem[field] && Array.isArray(processedItem[field])) {
        // Process gallery as array of images
        processedItem[field] = processedItem[field].map(galleryItem => {
          if (typeof galleryItem === 'object' && galleryItem.image) {
            return {
              ...galleryItem,
              url: getAssetUrl(galleryItem.image)
            };
          } else if (typeof galleryItem === 'string') {
            return {
              id: galleryItem,
              url: getAssetUrl(galleryItem)
            };
          }
          return galleryItem;
        });
      } else if (processedItem[field]) {
        // Process single image field
        if (typeof processedItem[field] === 'object' && processedItem[field].id) {
          processedItem[`${field}_url`] = getAssetUrl(processedItem[field].id);
        } else {
          processedItem[`${field}_url`] = getAssetUrl(processedItem[field]);
        }
      }
    });
  }
  
  return processedItem;
}

/**
 * Process multiple items applying translations and image URLs
 * @param {array} items - Items to process
 * @param {string} locale - Current locale
 * @param {array} imageFields - List of image fields to process
 * @returns {array} Processed items
 */
export function processItemsForClient(items, locale = DEFAULT_LOCALE, imageFields = ['main_image']) {
  if (!items || !Array.isArray(items)) return [];
  return items.map(item => processItemForClient(item, locale, imageFields));
}

/**
 * Helper function to get asset URL for images
 * @param {string} fileId - Directus file ID
 * @param {object} options - Image options (width, height, etc.)
 * @returns {string} Asset URL
 */
export function getAssetUrl(fileId, options = {}) {
  if (!fileId) return '';
  
  // If fileId is already a URL, return it directly
  if (typeof fileId === 'string' && (fileId.startsWith('http') || fileId.startsWith('/'))) {
    return fileId;
  }
  
  const { width, height, quality = 80, format = 'webp', fit = 'cover' } = options;
  
  // Prepare URL parameters
  const params = new URLSearchParams();
  if (width) params.append('width', width);
  if (height) params.append('height', height);
  if (quality) params.append('quality', quality);
  if (format) params.append('format', format);
  if (fit) params.append('fit', fit);
  
  const paramsString = params.toString() ? `?${params.toString()}` : '';
  return `${DIRECTUS_URL}/assets/${fileId}${paramsString}`;
}

/**
 * Get all hotels with optional filtering
 * @param {object} options - Query options (filter, limit, sort, etc.)
 * @param {string} locale - Current locale
 * @returns {Promise<object>} Hotels with metadata
 */
export async function getHotels(options = {}, locale = DEFAULT_LOCALE) {
  try {
    // Set up filter for published hotels only
    const filter = { 
      status: { _eq: 'Published' },
      ...options.filter 
    };
    
    // Execute query with proper fields and deep filters
    const response = await fetchFromDirectusServer('items/hotels', {
      filter,
      fields: '*,main_image.*,translations.*,destination.*,destination.translations.*',
      deep: { 
        translations: { languages_code: { _eq: locale } },
        'destination.translations': { languages_code: { _eq: locale } }
      },
      limit: options.limit || 100,
      offset: options.offset || 0,
      sort: options.sort || '-date_created',
      useAdminToken: true
    });
    
    // Process the response data
    const processedHotels = processItemsForClient(response.data, locale, ['main_image']);
    
    return {
      data: processedHotels,
      meta: response.meta
    };
  } catch (error) {
    console.error('Error fetching hotels from server:', error);
    throw error;
  }
}

/**
 * Get hotel by ID
 * @param {string} id - Hotel ID
 * @param {string} locale - Current locale
 * @returns {Promise<object>} Hotel object
 */
export async function getHotelById(id, locale = DEFAULT_LOCALE) {
  try {
    // Execute query for single hotel by ID
    const response = await fetchFromDirectusServer(`items/hotels/${id}`, {
      fields: '*,main_image.*,gallery.image.*,translations.*,destination.*,destination.translations.*',
      deep: { 
        translations: { languages_code: { _eq: locale } },
        'destination.translations': { languages_code: { _eq: locale } }
      },
      useAdminToken: true
    });
    
    // Process the hotel data
    const hotel = processItemForClient(response.data, locale, ['main_image', 'gallery']);
    
    // Get rooms for this hotel
    try {
      const roomsResponse = await fetchFromDirectusServer('items/rooms', {
        filter: { 
          hotel: { _eq: id }, 
          status: { _eq: 'Published' } 
        },
        fields: '*,main_image.*,translations.*',
        deep: { translations: { languages_code: { _eq: locale } } },
        useAdminToken: true
      });
      
      // Process room data
      const rooms = processItemsForClient(roomsResponse.data || [], locale, ['main_image']);
      hotel.rooms = rooms;
    } catch (roomsError) {
      console.error('Error fetching rooms for hotel:', roomsError);
      hotel.rooms = [];
    }
    
    return { data: hotel };
  } catch (error) {
    console.error(`Error fetching hotel with ID ${id} from server:`, error);
    throw error;
  }
}

/**
 * Get hotel by slug
 * @param {string} slug - Hotel slug
 * @param {string} locale - Current locale
 * @returns {Promise<object>} Hotel object
 */
export async function getHotelBySlug(slug, locale = DEFAULT_LOCALE) {
  try {
    // Execute query for hotel by slug
    const response = await fetchFromDirectusServer('items/hotels', {
      filter: {
        slug: { _eq: slug },
        status: { _eq: 'Published' }
      },
      fields: '*,main_image.*,gallery.image.*,translations.*,destination.*,destination.translations.*',
      deep: { 
        translations: { languages_code: { _eq: locale } },
        'destination.translations': { languages_code: { _eq: locale } }
      },
      limit: 1,
      useAdminToken: true
    });
    
    // Check if hotel exists
    if (!response.data || response.data.length === 0) {
      console.warn(`No hotel found with slug: ${slug}`);
      return { data: null };
    }
    
    // Process the hotel data
    const hotel = processItemForClient(response.data[0], locale, ['main_image', 'gallery']);
    
    // Get rooms for this hotel
    try {
      const roomsResponse = await fetchFromDirectusServer('items/rooms', {
        filter: { 
          hotel: { _eq: hotel.id }, 
          status: { _eq: 'Published' } 
        },
        fields: '*,main_image.*,translations.*',
        deep: { translations: { languages_code: { _eq: locale } } },
        useAdminToken: true
      });
      
      // Process room data
      const rooms = processItemsForClient(roomsResponse.data || [], locale, ['main_image']);
      hotel.rooms = rooms;
    } catch (roomsError) {
      console.error('Error fetching rooms for hotel:', roomsError);
      hotel.rooms = [];
    }
    
    return { data: hotel };
  } catch (error) {
    console.error(`Error fetching hotel with slug ${slug} from server:`, error);
    throw error;
  }
}

/**
 * Get all destinations with optional filtering
 * @param {object} options - Query options (filter, limit, sort, etc.)
 * @param {string} locale - Current locale
 * @returns {Promise<object>} Destinations with metadata
 */
export async function getDestinations(options = {}, locale = DEFAULT_LOCALE) {
  try {
    // Set up filter for published destinations only
    const filter = { 
      status: { _eq: 'Published' }, 
      ...options.filter 
    };
    
    // Execute query with proper fields and deep filters
    const response = await fetchFromDirectusServer('items/destinations', {
      filter,
      fields: '*,main_image.*,translations.*',
      deep: { translations: { languages_code: { _eq: locale } } },
      limit: options.limit || 100,
      offset: options.offset || 0,
      sort: options.sort || '-date_created',
      useAdminToken: true
    });
    
    // Process the response data
    const processedDestinations = processItemsForClient(response.data, locale, ['main_image']);
    
    return {
      data: processedDestinations,
      meta: response.meta
    };
  } catch (error) {
    console.error('Error fetching destinations from server:', error);
    throw error;
  }
}

/**
 * Get destination by ID
 * @param {string} id - Destination ID
 * @param {string} locale - Current locale
 * @returns {Promise<object>} Destination object
 */
export async function getDestinationById(id, locale = DEFAULT_LOCALE) {
  try {
    // Execute query for single destination by ID
    const response = await fetchFromDirectusServer(`items/destinations/${id}`, {
      fields: '*,main_image.*,gallery.image.*,translations.*,highlights.image.*,activities.image.*',
      deep: { translations: { languages_code: { _eq: locale } } },
      useAdminToken: true
    });
    
    // Process the destination data
    const destination = processItemForClient(response.data, locale, 
      ['main_image', 'gallery', 'highlights.image', 'activities.image']);
    
    // Get hotels for this destination
    try {
      const hotelsResponse = await fetchFromDirectusServer('items/hotels', {
        filter: { 
          destination: { _eq: id }, 
          status: { _eq: 'Published' } 
        },
        fields: '*,main_image.*,translations.*',
        deep: { translations: { languages_code: { _eq: locale } } },
        useAdminToken: true
      });
      
      // Process hotel data
      const hotels = processItemsForClient(hotelsResponse.data || [], locale, ['main_image']);
      destination.hotels = hotels;
    } catch (hotelsError) {
      console.error('Error fetching hotels for destination:', hotelsError);
      destination.hotels = [];
    }
    
    return { data: destination };
  } catch (error) {
    console.error(`Error fetching destination with ID ${id} from server:`, error);
    throw error;
  }
}

/**
 * Get destination by slug
 * @param {string} slug - Destination slug
 * @param {string} locale - Current locale
 * @returns {Promise<object>} Destination object
 */
export async function getDestinationBySlug(slug, locale = DEFAULT_LOCALE) {
  try {
    // Execute query for destination by slug
    const response = await fetchFromDirectusServer('items/destinations', {
      filter: {
        slug: { _eq: slug },
        status: { _eq: 'Published' }
      },
      fields: '*,main_image.*,gallery.image.*,translations.*,highlights.image.*,activities.image.*',
      deep: { translations: { languages_code: { _eq: locale } } },
      limit: 1,
      useAdminToken: true
    });
    
    // Check if destination exists
    if (!response.data || response.data.length === 0) {
      console.warn(`No destination found with slug: ${slug}`);
      return { data: null };
    }
    
    // Process the destination data
    const destination = processItemForClient(response.data[0], locale, 
      ['main_image', 'gallery', 'highlights.image', 'activities.image']);
    
    // Get hotels for this destination
    try {
      const hotelsResponse = await fetchFromDirectusServer('items/hotels', {
        filter: { 
          destination: { _eq: destination.id }, 
          status: { _eq: 'Published' } 
        },
        fields: '*,main_image.*,translations.*',
        deep: { translations: { languages_code: { _eq: locale } } },
        useAdminToken: true
      });
      
      // Process hotel data
      const hotels = processItemsForClient(hotelsResponse.data || [], locale, ['main_image']);
      destination.hotels = hotels;
    } catch (hotelsError) {
      console.error('Error fetching hotels for destination:', hotelsError);
      destination.hotels = [];
    }
    
    return { data: destination };
  } catch (error) {
    console.error(`Error fetching destination with slug ${slug} from server:`, error);
    throw error;
  }
}

/**
 * Get all categories with optional filtering
 * @param {object} options - Query options (type, featured, etc.)
 * @param {string} locale - Current locale
 * @returns {Promise<object>} Categories with metadata
 */
export async function getCategories(options = {}, locale = DEFAULT_LOCALE) {
  try {
    // Set up filter based on options
    const filter = {};
    
    if (options.type) {
      filter.type = { _in: [options.type, 'both'] };
    }
    
    if (options.featured !== undefined) {
      filter.featured = { _eq: options.featured };
    }
    
    // Execute query with proper fields and deep filters
    const response = await fetchFromDirectusServer('items/categories', {
      filter,
      fields: '*,image.*,translations.*',
      deep: { translations: { languages_code: { _eq: locale } } },
      sort: options.sort || 'sort',
      useAdminToken: true
    });
    
    // Process the response data
    const processedCategories = processItemsForClient(response.data, locale, ['image']);
    
    return {
      data: processedCategories,
      meta: response.meta
    };
  } catch (error) {
    console.error('Error fetching categories from server:', error);
    throw error;
  }
}

/**
 * Get category by slug
 * @param {string} slug - Category slug
 * @param {string} locale - Current locale
 * @returns {Promise<object>} Category object
 */
export async function getCategoryBySlug(slug, locale = DEFAULT_LOCALE) {
  try {
    // Execute query for category by slug
    const response = await fetchFromDirectusServer('items/categories', {
      filter: { slug: { _eq: slug } },
      fields: '*,image.*,translations.*',
      deep: { translations: { languages_code: { _eq: locale } } },
      limit: 1,
      useAdminToken: true
    });
    
    // Check if category exists
    if (!response.data || response.data.length === 0) {
      console.warn(`No category found with slug: ${slug}`);
      return { data: null };
    }
    
    // Process the category data
    const category = processItemForClient(response.data[0], locale, ['image']);
    
    return { data: category };
  } catch (error) {
    console.error(`Error fetching category with slug ${slug} from server:`, error);
    throw error;
  }
}

/**
 * Get rooms by hotel ID
 * @param {string} hotelId - Hotel ID
 * @param {string} locale - Current locale
 * @returns {Promise<object>} Rooms list
 */
export async function getRoomsByHotelId(hotelId, locale = DEFAULT_LOCALE) {
  try {
    // Execute query for rooms by hotel ID
    const response = await fetchFromDirectusServer('items/rooms', {
      filter: {
        hotel: { _eq: hotelId },
        status: { _eq: 'Published' }
      },
      fields: '*,main_image.*,gallery.image.*,translations.*',
      deep: { translations: { languages_code: { _eq: locale } } },
      useAdminToken: true
    });
    
    // Process the room data
    const processedRooms = processItemsForClient(response.data, locale, ['main_image', 'gallery']);
    
    return {
      data: processedRooms,
      meta: response.meta
    };
  } catch (error) {
    console.error(`Error fetching rooms for hotel ${hotelId} from server:`, error);
    throw error;
  }
}

/**
 * Get page by slug
 * @param {string} slug - Page slug
 * @param {string} locale - Current locale
 * @returns {Promise<object>} Page object
 */
export async function getPageBySlug(slug, locale = DEFAULT_LOCALE) {
  try {
    // Execute query for page by slug
    const response = await fetchFromDirectusServer('items/pages', {
      filter: {
        slug: { _eq: slug },
        status: { _eq: 'Published' }
      },
      fields: '*,featured_image.*,translations.*',
      deep: { translations: { languages_code: { _eq: locale } } },
      limit: 1,
      useAdminToken: true
    });
    
    // Check if page exists
    if (!response.data || response.data.length === 0) {
      console.warn(`No page found with slug: ${slug}`);
      return { data: null };
    }
    
    // Process the page data
    const page = processItemForClient(response.data[0], locale, ['featured_image']);
    
    return { data: page };
  } catch (error) {
    console.error(`Error fetching page with slug ${slug} from server:`, error);
    throw error;
  }
}

/**
 * Get translations for a specific language
 * @param {string} language - Language code (e.g., 'de-DE')
 * @returns {Promise<object>} Translations as key-value pairs
 */
export async function getTranslations(language = DEFAULT_LOCALE) {
  try {
    // Execute query for translations by language
    const response = await fetchFromDirectusServer('items/translations', {
      filter: { language: { _eq: language } },
      fields: ['key', 'value'],
      useAdminToken: true
    });
    
    // Convert to key-value object
    const translations = {};
    if (response.data && Array.isArray(response.data)) {
      response.data.forEach(item => {
        translations[item.key] = item.value;
      });
    }
    
    return { data: translations };
  } catch (error) {
    console.error(`Error fetching translations for language ${language} from server:`, error);
    throw error;
  }
}

/**
 * Get navigation pages for the site
 * @param {string} locale - Current locale
 * @returns {Promise<object>} Navigation items
 */
export async function getNavigation(locale = DEFAULT_LOCALE) {
  try {
    // Execute query for navigation pages
    const response = await fetchFromDirectusServer('items/pages', {
      filter: { 
        show_in_navigation: { _eq: true }, 
        status: { _eq: 'Published' } 
      },
      fields: 'id,title,slug,translations.*',
      deep: { translations: { languages_code: { _eq: locale } } },
      sort: 'sort',
      useAdminToken: true
    });
    
    // Process the navigation data
    const processedPages = processItemsForClient(response.data, locale);
    
    return {
      data: processedPages.map(page => ({
        id: page.id,
        title: page.title,
        slug: page.slug
      }))
    };
  } catch (error) {
    console.error('Error fetching navigation from server:', error);
    throw error;
  }
}