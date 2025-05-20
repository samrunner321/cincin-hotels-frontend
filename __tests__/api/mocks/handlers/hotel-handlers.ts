/**
 * MSW Handlers for hotel API endpoints
 * 
 * These handlers intercept and mock API requests for hotel-related endpoints.
 * They implement the same behavior as the real API but use mock data for testing.
 */
import { rest } from 'msw';
import { 
  mockAllHotels, 
  mockCategories, 
  mockDestinations,
  filterHotels,
  findHotelBySlug
} from '../hotel-mocks';

// Base URL for API endpoints
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Helper function to extract query parameters from the URL
 */
function extractParams(url: string) {
  const searchParams = new URL(url).searchParams;
  
  // Extract pagination parameters
  const limit = parseInt(searchParams.get('limit') || '100');
  const offset = parseInt(searchParams.get('offset') || '0');
  
  // Extract sorting parameters
  const sort = searchParams.get('sort')?.split(',') || ['-date_created'];
  
  // Extract filter parameters
  let filter: Record<string, any> = { status: { _eq: 'published' } };
  const filterParam = searchParams.get('filter');
  
  if (filterParam) {
    try {
      filter = JSON.parse(filterParam);
    } catch (error) {
      console.error('Error parsing filter parameter:', error);
    }
  }
  
  // Extract fields to return
  const fields = searchParams.get('fields')?.split(',') || ['*'];
  
  return { limit, offset, sort, filter, fields };
}

/**
 * Simulate network delay (used to test loading states and timeouts)
 */
async function simulateNetworkDelay(minMs = 10, maxMs = 100) {
  const delayMs = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise(resolve => setTimeout(resolve, delayMs));
}

/**
 * Handler for /api/hotels endpoint (list view)
 */
const getHotelsHandler = rest.get(`${API_BASE_URL}/hotels`, async (req, res, ctx) => {
  await simulateNetworkDelay();
  
  try {
    // Extract query parameters
    const { limit, offset, sort, filter } = extractParams(req.url.toString());
    
    // Apply filters and sorting
    const filteredHotels = filterHotels(mockAllHotels, { limit, offset, sort, filter });
    
    // Set cache headers for testing
    const cacheControl = 'public, max-age=60, stale-while-revalidate=600';
    
    // Return the filtered hotels
    return res(
      ctx.status(200),
      ctx.set('Cache-Control', cacheControl),
      ctx.json(filteredHotels)
    );
  } catch (error) {
    console.error('Error in mock hotel handler:', error);
    
    return res(
      ctx.status(500),
      ctx.json({ error: 'An error occurred while processing the request' })
    );
  }
});

/**
 * Handler for /api/hotels/:slug endpoint (detail view)
 */
const getHotelBySlugHandler = rest.get(`${API_BASE_URL}/hotels/:slug`, async (req, res, ctx) => {
  await simulateNetworkDelay();
  
  try {
    const { slug } = req.params;
    
    // Handle missing or empty slug
    if (!slug || slug === '') {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Hotel slug is required' })
      );
    }
    
    // Find hotel by slug
    const hotel = findHotelBySlug(mockAllHotels, slug.toString());
    
    // Handle hotel not found
    if (!hotel) {
      return res(
        ctx.status(404),
        ctx.json({ error: 'Hotel not found' })
      );
    }
    
    // Set cache headers for testing
    const cacheControl = 'public, max-age=300, stale-while-revalidate=3600';
    
    // Return the hotel
    return res(
      ctx.status(200),
      ctx.set('Cache-Control', cacheControl),
      ctx.json(hotel)
    );
  } catch (error) {
    console.error('Error in mock hotel detail handler:', error);
    
    return res(
      ctx.status(500),
      ctx.json({ error: 'An error occurred while processing the request' })
    );
  }
});

/**
 * Timeout handler for testing error scenarios
 */
const timeoutHandler = rest.get(`${API_BASE_URL}/hotels/timeout-test`, async (req, res, ctx) => {
  // Simulate a long delay (5 seconds)
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  return res(
    ctx.status(200),
    ctx.json({ message: 'Response after timeout' })
  );
});

/**
 * Error handler for testing error scenarios
 */
const errorHandler = rest.get(`${API_BASE_URL}/hotels/error-test`, async (req, res, ctx) => {
  return res(
    ctx.status(500),
    ctx.json({ error: 'Simulated server error' })
  );
});

/**
 * Rate limit handler for testing rate limiting
 */
const rateLimitHandler = rest.get(`${API_BASE_URL}/hotels/rate-limit-test`, async (req, res, ctx) => {
  return res(
    ctx.status(429),
    ctx.json({ error: 'Rate limit exceeded. Try again later.' })
  );
});

/**
 * Cache test handler with cache hit/miss headers
 */
const cacheHandler = rest.get(`${API_BASE_URL}/hotels/cache-test`, async (req, res, ctx) => {
  await simulateNetworkDelay();
  
  // Simulate cache hit or miss based on query parameter
  const isCacheHit = req.url.searchParams.has('cache-hit');
  
  const cacheStatus = isCacheHit ? 'HIT' : 'MISS';
  const cacheControl = 'public, max-age=300, stale-while-revalidate=3600';
  
  return res(
    ctx.status(200),
    ctx.set('Cache-Control', cacheControl),
    ctx.set('X-Cache', cacheStatus),
    ctx.json({
      cache_status: cacheStatus,
      timestamp: new Date().toISOString()
    })
  );
});

/**
 * Export all handlers
 */
export const hotelHandlers = [
  getHotelsHandler,
  getHotelBySlugHandler,
  timeoutHandler,
  errorHandler,
  rateLimitHandler,
  cacheHandler
];