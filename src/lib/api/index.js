/**
 * API module for interacting with Directus
 * Re-exports all API methods from directus-server
 */

export {
  getHotels,
  getHotelById,
  getHotelBySlug,
  getDestinations,
  getDestinationById,
  getDestinationBySlug,
  getCategories,
  getCategoryBySlug,
  getRoomsByHotelId,
  getPageBySlug,
  getTranslations,
  getNavigation
} from './directus-server';

/**
 * Get all categories
 * @param {object} options - Optional query parameters
 * @param {string} locale - Locale code
 * @returns {Promise<object>} Categories data
 */
export async function getAllCategories(options = {}, locale = 'en-US') {
  const { getCategories } = await import('./directus-server');
  return getCategories(options, locale);
}

/**
 * Get hotels by category
 * @param {string} categorySlug - Category slug
 * @param {object} options - Optional query parameters
 * @param {string} locale - Locale code
 * @returns {Promise<object>} Hotels data
 */
export async function getHotelsByCategory(categorySlug, options = {}, locale = 'en-US') {
  const { getCategoryBySlug, getHotels } = await import('./directus-server');
  
  // First get the category to find its ID
  const categoryData = await getCategoryBySlug(categorySlug, locale);
  
  if (!categoryData || !categoryData.data) {
    return { data: [] };
  }
  
  // Get hotels with this category ID
  const categoryId = categoryData.data.id;
  
  return getHotels({
    ...options,
    filter: {
      ...options.filter,
      // Using categories field that's an array in hotels
      categories: { _contains: categoryId }
    }
  }, locale);
}