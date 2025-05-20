/**
 * API Client
 * Client-side helper functions for fetching data from the Next.js API routes
 */

// Default locale for translations
const DEFAULT_LOCALE = 'de-DE';
const FALLBACK_LOCALE = 'en-US';

/**
 * Base fetch function for API calls
 * @param {string} endpoint - API endpoint (e.g., '/api/hotels')
 * @param {object} options - Request options
 * @returns {Promise<object>} API response
 */
export async function fetchAPI(endpoint, options = {}) {
  try {
    // Build URL with query parameters
    const url = new URL(endpoint, window.location.origin);
    
    // Add query parameters from options
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value);
        }
      });
    }
    
    // Make the request
    const response = await fetch(url.toString(), {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      ...options.fetchOptions,
    });
    
    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }
    
    // Parse the JSON response
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from API endpoint ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Get all hotels with optional filtering
 * @param {object} options - Query options (filter params)
 * @returns {Promise<Array>} List of hotels
 */
export async function getHotels(options = {}) {
  try {
    const params = {
      locale: options.locale || DEFAULT_LOCALE,
      limit: options.limit,
      offset: options.offset,
      sort: options.sort,
    };
    
    // Add optional filters if provided
    if (options.featured !== undefined) {
      params.featured = options.featured;
    }
    
    if (options.category) {
      params.category = options.category;
    }
    
    if (options.destination) {
      params.destination = options.destination;
    }
    
    if (options.region) {
      params.region = options.region;
    }
    
    // Make the API request
    return await fetchAPI('/api/hotels', { params });
  } catch (error) {
    console.error('Error getting hotels:', error);
    return [];
  }
}

/**
 * Get a single hotel by ID or slug
 * @param {string} idOrSlug - Hotel ID or slug
 * @param {object} options - Request options
 * @returns {Promise<object|null>} Hotel object or null if not found
 */
export async function getHotel(idOrSlug, options = {}) {
  try {
    const params = {
      locale: options.locale || DEFAULT_LOCALE,
    };
    
    // Make the API request
    return await fetchAPI(`/api/hotels/${idOrSlug}`, { params });
  } catch (error) {
    console.error(`Error getting hotel ${idOrSlug}:`, error);
    return null;
  }
}

/**
 * Get all destinations with optional filtering
 * @param {object} options - Query options (filter params)
 * @returns {Promise<Array>} List of destinations
 */
export async function getDestinations(options = {}) {
  try {
    const params = {
      locale: options.locale || DEFAULT_LOCALE,
      limit: options.limit,
      offset: options.offset,
      sort: options.sort,
    };
    
    // Add optional filters if provided
    if (options.featured !== undefined) {
      params.featured = options.featured;
    }
    
    if (options.popular !== undefined) {
      params.popular = options.popular;
    }
    
    if (options.category) {
      params.category = options.category;
    }
    
    if (options.region) {
      params.region = options.region;
    }
    
    if (options.country) {
      params.country = options.country;
    }
    
    // Make the API request
    return await fetchAPI('/api/destinations', { params });
  } catch (error) {
    console.error('Error getting destinations:', error);
    return [];
  }
}

/**
 * Get a single destination by ID or slug
 * @param {string} idOrSlug - Destination ID or slug
 * @param {object} options - Request options
 * @returns {Promise<object|null>} Destination object or null if not found
 */
export async function getDestination(idOrSlug, options = {}) {
  try {
    const params = {
      locale: options.locale || DEFAULT_LOCALE,
    };
    
    // Make the API request
    return await fetchAPI(`/api/destinations/${idOrSlug}`, { params });
  } catch (error) {
    console.error(`Error getting destination ${idOrSlug}:`, error);
    return null;
  }
}

/**
 * Get all categories with optional filtering
 * @param {object} options - Query options (filter params)
 * @returns {Promise<Array>} List of categories
 */
export async function getCategories(options = {}) {
  try {
    const params = {
      locale: options.locale || DEFAULT_LOCALE,
      sort: options.sort,
    };
    
    // Add optional filters if provided
    if (options.type) {
      params.type = options.type;
    }
    
    if (options.featured !== undefined) {
      params.featured = options.featured;
    }
    
    // Make the API request
    return await fetchAPI('/api/categories', { params });
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
}

/**
 * Get a single category by slug
 * @param {string} slug - Category slug
 * @param {object} options - Request options
 * @returns {Promise<object|null>} Category object or null if not found
 */
export async function getCategory(slug, options = {}) {
  try {
    const params = {
      locale: options.locale || DEFAULT_LOCALE,
    };
    
    // Make the API request
    return await fetchAPI(`/api/categories/${slug}`, { params });
  } catch (error) {
    console.error(`Error getting category ${slug}:`, error);
    return null;
  }
}

/**
 * Get rooms for a specific hotel
 * @param {string} hotelId - Hotel ID
 * @param {object} options - Request options
 * @returns {Promise<Array>} List of rooms
 */
export async function getRooms(hotelId, options = {}) {
  try {
    const params = {
      locale: options.locale || DEFAULT_LOCALE,
    };
    
    // Make the API request
    return await fetchAPI(`/api/rooms/${hotelId}`, { params });
  } catch (error) {
    console.error(`Error getting rooms for hotel ${hotelId}:`, error);
    return [];
  }
}

/**
 * Get a single page by slug
 * @param {string} slug - Page slug
 * @param {object} options - Request options
 * @returns {Promise<object|null>} Page object or null if not found
 */
export async function getPage(slug, options = {}) {
  try {
    const params = {
      locale: options.locale || DEFAULT_LOCALE,
    };
    
    // Make the API request
    return await fetchAPI(`/api/pages/${slug}`, { params });
  } catch (error) {
    console.error(`Error getting page ${slug}:`, error);
    return null;
  }
}

/**
 * Get translations for a specific language
 * @param {string} language - Language code (e.g., 'de-DE')
 * @returns {Promise<object>} Translations as key-value pairs
 */
export async function getTranslations(language = DEFAULT_LOCALE) {
  try {
    // Make the API request
    return await fetchAPI('/api/translations', { 
      params: { language } 
    });
  } catch (error) {
    console.error(`Error getting translations for ${language}:`, error);
    return {};
  }
}

// Export the full API interface
export default {
  fetchAPI,
  getHotels,
  getHotel,
  getDestinations,
  getDestination,
  getCategories,
  getCategory,
  getRooms,
  getPage,
  getTranslations,
};