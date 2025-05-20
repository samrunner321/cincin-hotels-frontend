/**
 * MSW Handlers for destination API endpoints
 * 
 * These handlers intercept and mock API requests for destination-related endpoints.
 * They implement the same behavior as the real API but use mock data for testing.
 */
import { rest } from 'msw';
import { 
  mockAllDestinations, 
  mockDestinations,
  filterDestinations,
  findDestinationBySlug,
  filterActivitiesBySeason
} from '../destination-mocks';
import { mockAllHotels } from '../hotel-mocks';

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
  
  // Extract region parameter (special case for destinations)
  const region = searchParams.get('region');
  
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
  
  // Add region filter if provided in URL params but not in filter JSON
  if (region && !filter.region) {
    filter.region = { _eq: region };
  }
  
  // Extract fields to return
  const fields = searchParams.get('fields')?.split(',') || ['*'];
  
  // Extract season for filtering activities
  const season = searchParams.get('season');
  
  return { limit, offset, sort, filter, fields, region, season };
}

/**
 * Simulate network delay (used to test loading states and timeouts)
 */
async function simulateNetworkDelay(minMs = 10, maxMs = 100) {
  const delayMs = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise(resolve => setTimeout(resolve, delayMs));
}

/**
 * Helper function to find hotels for a destination
 */
function getHotelsByDestination(destinationId: string) {
  return mockAllHotels.filter(hotel => 
    hotel.destination === destinationId && hotel.status === 'published'
  );
}

/**
 * Handler for /api/destinations endpoint (list view)
 */
const getDestinationsHandler = rest.get(`${API_BASE_URL}/destinations`, async (req, res, ctx) => {
  await simulateNetworkDelay();
  
  try {
    // Extract query parameters
    const { limit, offset, sort, filter, region } = extractParams(req.url.toString());
    
    // Apply filters and sorting
    const filteredDestinations = filterDestinations(mockAllDestinations, { 
      limit, 
      offset, 
      sort, 
      filter 
    });
    
    // Set cache headers for testing
    const cacheControl = 'public, max-age=60, stale-while-revalidate=600';
    
    // Return the filtered destinations
    return res(
      ctx.status(200),
      ctx.set('Cache-Control', cacheControl),
      ctx.json(filteredDestinations)
    );
  } catch (error) {
    console.error('Error in mock destination handler:', error);
    
    return res(
      ctx.status(500),
      ctx.json({ error: 'An error occurred while processing the request' })
    );
  }
});

/**
 * Handler for /api/destinations/:slug endpoint (detail view)
 */
const getDestinationBySlugHandler = rest.get(`${API_BASE_URL}/destinations/:slug`, async (req, res, ctx) => {
  await simulateNetworkDelay();
  
  try {
    const { slug } = req.params;
    
    // Handle missing or empty slug
    if (!slug || slug === '') {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Destination slug is required' })
      );
    }
    
    // Find destination by slug
    const destination = findDestinationBySlug(mockAllDestinations, slug.toString());
    
    // Handle destination not found
    if (!destination) {
      return res(
        ctx.status(404),
        ctx.json({ error: 'Destination not found' })
      );
    }
    
    // Extract season parameter for filtering activities
    const { season } = extractParams(req.url.toString());
    
    // Clone destination to avoid modifying the mock data
    const responseDestination = { ...destination };
    
    // Filter activities by season if requested
    if (season && responseDestination.activities) {
      responseDestination.activities = filterActivitiesBySeason(
        responseDestination, 
        season as any
      );
    }
    
    // Get related hotels for this destination
    const hotels = getHotelsByDestination(destination.id);
    
    // Combine destination data with hotels
    const responseData = {
      ...responseDestination,
      hotels
    };
    
    // Set cache headers for testing
    const cacheControl = 'public, max-age=300, stale-while-revalidate=3600';
    
    // Return the destination with related hotels
    return res(
      ctx.status(200),
      ctx.set('Cache-Control', cacheControl),
      ctx.json(responseData)
    );
  } catch (error) {
    console.error('Error in mock destination detail handler:', error);
    
    return res(
      ctx.status(500),
      ctx.json({ error: 'An error occurred while processing the request' })
    );
  }
});

/**
 * Handler for destination with specific season (for testing seasonal content)
 */
const getDestinationSeasonHandler = rest.get(`${API_BASE_URL}/destinations/:slug/seasons/:season`, async (req, res, ctx) => {
  await simulateNetworkDelay();
  
  try {
    const { slug, season } = req.params;
    
    // Find destination by slug
    const destination = findDestinationBySlug(mockAllDestinations, slug.toString());
    
    // Handle destination not found
    if (!destination) {
      return res(
        ctx.status(404),
        ctx.json({ error: 'Destination not found' })
      );
    }
    
    // Validate season parameter
    if (!['spring', 'summer', 'autumn', 'winter', 'all'].includes(season.toString())) {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Invalid season parameter. Must be one of: spring, summer, autumn, winter, all' })
      );
    }
    
    // Clone destination to avoid modifying the mock data
    const responseDestination = { ...destination };
    
    // Filter activities by requested season
    if (responseDestination.activities) {
      responseDestination.activities = filterActivitiesBySeason(
        responseDestination, 
        season as any
      );
    }
    
    // Filter weather data by requested season
    if (responseDestination.weather) {
      responseDestination.weather = responseDestination.weather.filter(
        (w: any) => w.season === season
      );
    }
    
    return res(
      ctx.status(200),
      ctx.set('Cache-Control', 'public, max-age=300'),
      ctx.json(responseDestination)
    );
  } catch (error) {
    console.error('Error in mock destination season handler:', error);
    
    return res(
      ctx.status(500),
      ctx.json({ error: 'An error occurred while processing the request' })
    );
  }
});

/**
 * Handler for destination with featured content (special test endpoint)
 */
const getDestinationHighlightsHandler = rest.get(`${API_BASE_URL}/destinations/:slug/highlights`, async (req, res, ctx) => {
  await simulateNetworkDelay();
  
  try {
    const { slug } = req.params;
    
    // Find destination by slug
    const destination = findDestinationBySlug(mockAllDestinations, slug.toString());
    
    // Handle destination not found
    if (!destination) {
      return res(
        ctx.status(404),
        ctx.json({ error: 'Destination not found' })
      );
    }
    
    // Extract just the highlights
    const highlights = destination.highlights || [];
    
    return res(
      ctx.status(200),
      ctx.json(highlights)
    );
  } catch (error) {
    console.error('Error in mock destination highlights handler:', error);
    
    return res(
      ctx.status(500),
      ctx.json({ error: 'An error occurred while processing the request' })
    );
  }
});

/**
 * Timeout handler for testing error scenarios
 */
const timeoutHandler = rest.get(`${API_BASE_URL}/destinations/timeout-test`, async (req, res, ctx) => {
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
const errorHandler = rest.get(`${API_BASE_URL}/destinations/error-test`, async (req, res, ctx) => {
  return res(
    ctx.status(500),
    ctx.json({ error: 'Simulated server error' })
  );
});

/**
 * Rate limit handler for testing rate limiting
 */
const rateLimitHandler = rest.get(`${API_BASE_URL}/destinations/rate-limit-test`, async (req, res, ctx) => {
  return res(
    ctx.status(429),
    ctx.json({ error: 'Rate limit exceeded. Try again later.' })
  );
});

/**
 * Export all handlers
 */
export const destinationHandlers = [
  getDestinationsHandler,
  getDestinationBySlugHandler,
  getDestinationSeasonHandler,
  getDestinationHighlightsHandler,
  timeoutHandler,
  errorHandler,
  rateLimitHandler
];