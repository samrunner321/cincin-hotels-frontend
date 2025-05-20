/**
 * Comprehensive mock tests for Destination API
 * 
 * These tests use MSW to mock API responses, testing various scenarios
 * without requiring a real Directus instance.
 */
import { NextRequest } from 'next/server';
import supertest from 'supertest';
import { GET as getDestinations } from '../../src/app/api/destinations/route';
import { GET as getDestinationBySlug } from '../../src/app/api/destinations/[slug]/route';
import { Destination } from '../../lib/directus';
import axios from 'axios';
import { server } from './mocks/server';
import { rest } from 'msw';
import { 
  mockAllDestinations, 
  mockDestinations, 
  mockEdgeCaseDestinations,
  filterActivitiesBySeason
} from './mocks/destination-mocks';
import { 
  validateDestinationStructure, 
  validateCompleteDestination,
  validateCoordinates,
  validateActivity,
  validateHighlight,
  getActivitiesBySeason,
  destinationMatchers,
  createNextRequest,
  createRouteParams
} from './utils/destination-test-utils';

// Extend Jest with custom matchers
expect.extend(destinationMatchers);

describe('Destination API Tests with MSW', () => {
  // Common test destination data
  const testDestinationSlug = mockDestinations[0].slug;
  const testDestinationId = mockDestinations[0].id;
  const edgeCaseDestinationSlug = mockEdgeCaseDestinations[0].slug;
  
  describe('GET /api/destinations - List View', () => {
    describe('Basic Functionality', () => {
      it('returns a list of destinations', async () => {
        const request = createNextRequest('/api/destinations');
        const response = await getDestinations(request);
        
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThan(0);
        
        // Verify destination structure
        const firstDestination = data[0];
        expect(firstDestination).toBeValidDestination();
      });
      
      it('returns only published destinations by default', async () => {
        const request = createNextRequest('/api/destinations');
        const response = await getDestinations(request);
        
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        
        // Verify all returned destinations are published
        const allPublished = data.every((destination: Destination) => 
          destination.status === 'published'
        );
        expect(allPublished).toBe(true);
        
        // Verify draft destinations are not included
        const draftDestination = mockEdgeCaseDestinations.find(d => d.status === 'draft');
        if (draftDestination) {
          const hasDraft = data.some((destination: Destination) => 
            destination.id === draftDestination.id
          );
          expect(hasDraft).toBe(false);
        }
      });
      
      it('sets proper cache headers', async () => {
        const request = createNextRequest('/api/destinations');
        const response = await getDestinations(request);
        
        expect(response.status).toBe(200);
        
        // Check cache headers
        const cacheControl = response.headers.get('cache-control');
        expect(cacheControl).toBeDefined();
        expect(cacheControl).toContain('public');
        expect(cacheControl).toContain('max-age=');
      });
    });
    
    describe('Filtering', () => {
      it('filters destinations by region', async () => {
        // Filter for Alpine destinations
        const filter = {
          status: { _eq: 'published' },
          region: { _eq: 'alps' }
        };
        
        const request = createNextRequest('/api/destinations', {
          filter: JSON.stringify(filter)
        });
        
        const response = await getDestinations(request);
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        
        // Verify all returned destinations are in the Alps region
        if (data.length > 0) {
          const allAlps = data.every((destination: Destination) => 
            destination.region === 'alps'
          );
          expect(allAlps).toBe(true);
        }
      });
      
      it('filters destinations by country', async () => {
        // Filter for Italian destinations
        const filter = {
          status: { _eq: 'published' },
          country: { _eq: 'Italy' }
        };
        
        const request = createNextRequest('/api/destinations', {
          filter: JSON.stringify(filter)
        });
        
        const response = await getDestinations(request);
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        
        // Verify all returned destinations are in Italy
        if (data.length > 0) {
          const allItaly = data.every((destination: Destination) => 
            destination.country === 'Italy'
          );
          expect(allItaly).toBe(true);
        }
      });
      
      it('filters destinations by featured status', async () => {
        // Filter for featured destinations
        const filter = {
          status: { _eq: 'published' },
          is_featured: { _eq: true }
        };
        
        const request = createNextRequest('/api/destinations', {
          filter: JSON.stringify(filter)
        });
        
        const response = await getDestinations(request);
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        
        // Verify all returned destinations are featured
        if (data.length > 0) {
          const allFeatured = data.every((destination: Destination) => 
            destination.is_featured === true
          );
          expect(allFeatured).toBe(true);
        }
      });
      
      it('filters destinations by popular status', async () => {
        // Filter for popular destinations
        const filter = {
          status: { _eq: 'published' },
          is_popular: { _eq: true }
        };
        
        const request = createNextRequest('/api/destinations', {
          filter: JSON.stringify(filter)
        });
        
        const response = await getDestinations(request);
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        
        // Verify all returned destinations are popular
        if (data.length > 0) {
          const allPopular = data.every((destination: Destination) => 
            destination.is_popular === true
          );
          expect(allPopular).toBe(true);
        }
      });
      
      it('filters destinations by category', async () => {
        // Find a destination with known category
        const destination = mockDestinations.find(d => d.categories && d.categories.length > 0);
        if (!destination || !destination.categories) {
          console.warn('No destination with categories found, skipping test');
          return;
        }
        
        const category = destination.categories[0];
        
        // Filter for destinations with this category
        const filter = {
          status: { _eq: 'published' },
          categories: { _contains: [category] }
        };
        
        const request = createNextRequest('/api/destinations', {
          filter: JSON.stringify(filter)
        });
        
        const response = await getDestinations(request);
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        
        // Verify returned destinations have the category
        if (data.length > 0) {
          data.forEach((destination: Destination) => {
            expect(destination).toHaveCategory(category);
          });
        }
      });
      
      it('supports filtering via URL region parameter', async () => {
        // Use the region URL parameter instead of filter JSON
        const request = createNextRequest('/api/destinations', {
          region: 'alps'
        });
        
        const response = await getDestinations(request);
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        
        // Verify all returned destinations are in the Alps region
        if (data.length > 0) {
          const allAlps = data.every((destination: Destination) => 
            destination.region === 'alps'
          );
          expect(allAlps).toBe(true);
        }
      });
      
      it('handles complex filters with multiple conditions', async () => {
        // Complex filter with multiple conditions
        const filter = {
          status: { _eq: 'published' },
          region: { _eq: 'alps' },
          is_featured: { _eq: true }
        };
        
        const request = createNextRequest('/api/destinations', {
          filter: JSON.stringify(filter)
        });
        
        const response = await getDestinations(request);
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        
        // Verify all returned destinations match all conditions
        if (data.length > 0) {
          data.forEach((destination: Destination) => {
            expect(destination.status).toBe('published');
            expect(destination.region).toBe('alps');
            expect(destination.is_featured).toBe(true);
          });
        }
      });
    });
    
    describe('Sorting', () => {
      it('sorts destinations alphabetically by name', async () => {
        const request = createNextRequest('/api/destinations', {
          sort: 'name'
        });
        
        const response = await getDestinations(request);
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        
        // Verify destinations are sorted alphabetically by name
        for (let i = 0; i < data.length - 1; i++) {
          expect(data[i].name.localeCompare(data[i + 1].name)).toBeLessThanOrEqual(0);
        }
      });
      
      it('sorts destinations by country', async () => {
        const request = createNextRequest('/api/destinations', {
          sort: 'country'
        });
        
        const response = await getDestinations(request);
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        
        // Verify destinations are sorted by country
        for (let i = 0; i < data.length - 1; i++) {
          expect(data[i].country.localeCompare(data[i + 1].country)).toBeLessThanOrEqual(0);
        }
      });
    });
    
    describe('Pagination', () => {
      it('limits the number of destinations returned', async () => {
        const limit = 2;
        
        const request = createNextRequest('/api/destinations', {
          limit: limit.toString()
        });
        
        const response = await getDestinations(request);
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeLessThanOrEqual(limit);
      });
      
      it('skips destinations with offset parameter', async () => {
        // First page
        const limit = 1;
        const request1 = createNextRequest('/api/destinations', {
          limit: limit.toString(),
          offset: '0'
        });
        
        const response1 = await getDestinations(request1);
        const data1 = await response1.json();
        
        // Make sure we have at least one destination
        if (data1.length === 0) {
          console.warn('No destinations found, skipping pagination test');
          return;
        }
        
        // Second page
        const request2 = createNextRequest('/api/destinations', {
          limit: limit.toString(),
          offset: limit.toString()
        });
        
        const response2 = await getDestinations(request2);
        const data2 = await response2.json();
        
        // Verify the two pages have different destinations
        if (data2.length > 0) {
          expect(data1[0].id).not.toBe(data2[0].id);
        }
      });
    });
    
    describe('Error Handling', () => {
      it('handles server errors gracefully', async () => {
        // Mock a server error response
        server.use(
          rest.get('http://localhost:3000/api/destinations', (req, res, ctx) => {
            return res(
              ctx.status(500),
              ctx.json({ error: 'Internal Server Error' })
            );
          })
        );
        
        const request = createNextRequest('/api/destinations');
        const response = await getDestinations(request);
        
        expect(response.status).toBe(500);
        
        const data = await response.json();
        expect(data.error).toBeDefined();
      });
      
      it('handles invalid filter JSON gracefully', async () => {
        const request = createNextRequest('/api/destinations', {
          filter: 'invalid-json'
        });
        
        const response = await getDestinations(request);
        
        // Should still return a successful response with default filtering
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
      });
    });
  });
  
  describe('GET /api/destinations/[slug] - Detail View', () => {
    describe('Basic Functionality', () => {
      it('returns a specific destination by slug', async () => {
        const request = createNextRequest(`/api/destinations/${testDestinationSlug}`);
        const params = createRouteParams(testDestinationSlug);
        
        const response = await getDestinationBySlug(request, params as any);
        expect(response.status).toBe(200);
        
        const destination = await response.json();
        
        // Verify destination data
        expect(destination).toBeValidDestination();
        expect(destination.slug).toBe(testDestinationSlug);
        expect(destination.id).toBe(testDestinationId);
      });
      
      it('returns 404 for non-existent destination slug', async () => {
        const nonExistentSlug = 'non-existent-destination';
        const request = createNextRequest(`/api/destinations/${nonExistentSlug}`);
        const params = createRouteParams(nonExistentSlug);
        
        const response = await getDestinationBySlug(request, params as any);
        expect(response.status).toBe(404);
        
        const data = await response.json();
        expect(data.error).toBeDefined();
      });
      
      it('returns 400 for empty slug', async () => {
        const emptySlug = '';
        const request = createNextRequest(`/api/destinations/${emptySlug}`);
        const params = createRouteParams(emptySlug);
        
        const response = await getDestinationBySlug(request, params as any);
        expect(response.status).toBe(400);
        
        const data = await response.json();
        expect(data.error).toBeDefined();
      });
      
      it('includes highlights in destination details', async () => {
        // Use a destination known to have highlights
        const request = createNextRequest(`/api/destinations/${testDestinationSlug}`);
        const params = createRouteParams(testDestinationSlug);
        
        const response = await getDestinationBySlug(request, params as any);
        expect(response.status).toBe(200);
        
        const destination = await response.json();
        
        // Verify highlights data
        expect(destination.highlights).toBeDefined();
        expect(Array.isArray(destination.highlights)).toBe(true);
        
        if (destination.highlights.length > 0) {
          const highlight = destination.highlights[0];
          expect(typeof highlight.title).toBe('string');
        }
      });
      
      it('includes activities in destination details', async () => {
        // Use a destination known to have activities
        const request = createNextRequest(`/api/destinations/${testDestinationSlug}`);
        const params = createRouteParams(testDestinationSlug);
        
        const response = await getDestinationBySlug(request, params as any);
        expect(response.status).toBe(200);
        
        const destination = await response.json();
        
        // Verify activities data
        expect(destination.activities).toBeDefined();
        expect(Array.isArray(destination.activities)).toBe(true);
        
        if (destination.activities.length > 0) {
          const activity = destination.activities[0];
          expect(typeof activity.title).toBe('string');
          expect(['spring', 'summer', 'autumn', 'winter', 'all']).toContain(activity.season);
        }
      });
      
      it('includes related hotels in destination details', async () => {
        // Use a destination that should have related hotels
        const request = createNextRequest(`/api/destinations/${testDestinationSlug}`);
        const params = createRouteParams(testDestinationSlug);
        
        const response = await getDestinationBySlug(request, params as any);
        expect(response.status).toBe(200);
        
        const destination = await response.json();
        
        // Verify hotels array exists (even if empty)
        expect(destination.hotels).toBeDefined();
        expect(Array.isArray(destination.hotels)).toBe(true);
      });
      
      it('sets proper cache headers', async () => {
        const request = createNextRequest(`/api/destinations/${testDestinationSlug}`);
        const params = createRouteParams(testDestinationSlug);
        
        const response = await getDestinationBySlug(request, params as any);
        expect(response.status).toBe(200);
        
        // Check cache headers
        const cacheControl = response.headers.get('cache-control');
        expect(cacheControl).toBeDefined();
        expect(cacheControl).toContain('public');
        expect(cacheControl).toContain('max-age=');
      });
    });
    
    describe('Edge Cases', () => {
      it('handles destinations with no main image', async () => {
        // Use a destination without a main image
        const slug = 'test-destination-no-image';
        const request = createNextRequest(`/api/destinations/${slug}`);
        const params = createRouteParams(slug);
        
        const response = await getDestinationBySlug(request, params as any);
        expect(response.status).toBe(200);
        
        const destination = await response.json();
        
        // Main image should be empty or null
        expect(destination.main_image).toBeFalsy();
      });
      
      it('handles destinations with no highlights', async () => {
        // Use a destination without highlights
        const slug = 'test-destination-no-highlights';
        const request = createNextRequest(`/api/destinations/${slug}`);
        const params = createRouteParams(slug);
        
        const response = await getDestinationBySlug(request, params as any);
        expect(response.status).toBe(200);
        
        const destination = await response.json();
        
        // Highlights should be an empty array
        expect(destination.highlights).toBeDefined();
        expect(Array.isArray(destination.highlights)).toBe(true);
        expect(destination.highlights.length).toBe(0);
      });
      
      it('handles destinations with no activities', async () => {
        // Use a destination without activities
        const slug = 'test-destination-no-activities';
        const request = createNextRequest(`/api/destinations/${slug}`);
        const params = createRouteParams(slug);
        
        const response = await getDestinationBySlug(request, params as any);
        expect(response.status).toBe(200);
        
        const destination = await response.json();
        
        // Activities should be an empty array
        expect(destination.activities).toBeDefined();
        expect(Array.isArray(destination.activities)).toBe(true);
        expect(destination.activities.length).toBe(0);
      });
      
      it('handles destinations with minimal data', async () => {
        // Use a destination with minimal data
        const slug = 'test-destination-minimal';
        const request = createNextRequest(`/api/destinations/${slug}`);
        const params = createRouteParams(slug);
        
        const response = await getDestinationBySlug(request, params as any);
        expect(response.status).toBe(200);
        
        const destination = await response.json();
        
        // Should still have all required fields
        expect(destination).toBeValidDestination();
      });
      
      it('returns 404 for draft destinations', async () => {
        // Use a destination with draft status
        const slug = 'test-destination-draft';
        const request = createNextRequest(`/api/destinations/${slug}`);
        const params = createRouteParams(slug);
        
        const response = await getDestinationBySlug(request, params as any);
        expect(response.status).toBe(404);
      });
    });
    
    describe('Season-specific Content', () => {
      it('filters activities by season when season parameter is provided', async () => {
        // Use the destination with activities for all seasons
        const slug = 'test-destination-all-seasons';
        const season = 'summer';
        
        const request = createNextRequest(`/api/destinations/${slug}`, {
          season
        });
        const params = createRouteParams(slug);
        
        const response = await getDestinationBySlug(request, params as any);
        expect(response.status).toBe(200);
        
        const destination = await response.json();
        
        // Verify only summer and all-season activities are included
        if (destination.activities && destination.activities.length > 0) {
          const validSeasons = destination.activities.every((activity: any) => 
            activity.season === season || activity.season === 'all'
          );
          expect(validSeasons).toBe(true);
          
          // Verify activities for other seasons are not included
          const otherSeasons = destination.activities.some((activity: any) => 
            activity.season !== season && activity.season !== 'all'
          );
          expect(otherSeasons).toBe(false);
        }
      });
      
      it('returns season-specific data via special endpoint', async () => {
        // Use the destination with activities for all seasons
        const slug = 'test-destination-all-seasons';
        const season = 'winter';
        
        // Use the special seasonal endpoint
        const response = await fetch(`http://localhost:3000/api/destinations/${slug}/seasons/${season}`);
        expect(response.status).toBe(200);
        
        const destination = await response.json();
        
        // Verify only winter activities are included
        if (destination.activities && destination.activities.length > 0) {
          const validSeasons = destination.activities.every((activity: any) => 
            activity.season === season || activity.season === 'all'
          );
          expect(validSeasons).toBe(true);
        }
        
        // Verify weather data is for the requested season
        if (destination.weather && destination.weather.length > 0) {
          const winterWeather = destination.weather.every((weather: any) => 
            weather.season === season
          );
          expect(winterWeather).toBe(true);
        }
      });
      
      it('returns 400 for invalid season parameter', async () => {
        // Use the destination with activities for all seasons
        const slug = 'test-destination-all-seasons';
        const invalidSeason = 'invalid-season';
        
        // Use the special seasonal endpoint with invalid season
        const response = await fetch(`http://localhost:3000/api/destinations/${slug}/seasons/${invalidSeason}`);
        expect(response.status).toBe(400);
        
        const data = await response.json();
        expect(data.error).toBeDefined();
      });
    });
    
    describe('Relationship Tests', () => {
      it('returns only the highlights via special endpoint', async () => {
        // Use a destination known to have highlights
        const slug = testDestinationSlug;
        
        // Use the special highlights endpoint
        const response = await fetch(`http://localhost:3000/api/destinations/${slug}/highlights`);
        expect(response.status).toBe(200);
        
        const highlights = await response.json();
        
        // Verify we have highlights data in array format
        expect(Array.isArray(highlights)).toBe(true);
        
        if (highlights.length > 0) {
          const highlight = highlights[0];
          expect(typeof highlight.title).toBe('string');
        }
      });
    });
    
    describe('Error Handling', () => {
      it('handles server errors gracefully', async () => {
        // Mock a server error response for a specific destination
        server.use(
          rest.get(`http://localhost:3000/api/destinations/${testDestinationSlug}`, (req, res, ctx) => {
            return res(
              ctx.status(500),
              ctx.json({ error: 'Internal Server Error' })
            );
          })
        );
        
        const request = createNextRequest(`/api/destinations/${testDestinationSlug}`);
        const params = createRouteParams(testDestinationSlug);
        
        const response = await getDestinationBySlug(request, params as any);
        expect(response.status).toBe(500);
        
        const data = await response.json();
        expect(data.error).toBeDefined();
      });
    });
  });
  
  describe('Performance and Caching', () => {
    it('handles concurrent requests correctly', async () => {
      // Make multiple concurrent requests
      const requests = Array(3).fill(null).map(() => 
        fetch('http://localhost:3000/api/destinations')
          .then(res => res.json())
      );
      
      const responses = await Promise.all(requests);
      
      // Verify all responses have the same data
      expect(responses[0]).toEqual(responses[1]);
      expect(responses[1]).toEqual(responses[2]);
    });
  });
  
  describe('Error Scenarios', () => {
    it('handles rate limiting correctly', async () => {
      const response = await fetch('http://localhost:3000/api/destinations/rate-limit-test');
      
      expect(response.status).toBe(429);
      
      const data = await response.json();
      expect(data.error).toBeDefined();
      expect(data.error).toContain('Rate limit');
    });
    
    it('handles server errors correctly', async () => {
      const response = await fetch('http://localhost:3000/api/destinations/error-test');
      
      expect(response.status).toBe(500);
      
      const data = await response.json();
      expect(data.error).toBeDefined();
    });
    
    it('handles server timeout correctly', async () => {
      // Set a short timeout for this test
      jest.setTimeout(1000);
      
      try {
        // Call the timeout endpoint
        const response = await fetch('http://localhost:3000/api/destinations/timeout-test', {
          signal: AbortSignal.timeout(500) // Abort after 500ms
        });
        
        // This should not be reached
        expect(true).toBe(false);
      } catch (error) {
        // Expect a timeout error
        expect(error).toBeDefined();
      }
    });
  });
  
  describe('Destination-specific Tests', () => {
    it('validates coordinates are within valid ranges', async () => {
      // Use a destination known to have coordinates
      const request = createNextRequest(`/api/destinations/${testDestinationSlug}`);
      const params = createRouteParams(testDestinationSlug);
      
      const response = await getDestinationBySlug(request, params as any);
      expect(response.status).toBe(200);
      
      const destination = await response.json();
      
      // Verify coordinates if present
      if (destination.coordinates) {
        // Latitude should be between -90 and 90
        expect(destination.coordinates.lat).toBeGreaterThanOrEqual(-90);
        expect(destination.coordinates.lat).toBeLessThanOrEqual(90);
        
        // Longitude should be between -180 and 180
        expect(destination.coordinates.lng).toBeGreaterThanOrEqual(-180);
        expect(destination.coordinates.lng).toBeLessThanOrEqual(180);
      }
    });
    
    it('verifies all seasons have weather data when available', async () => {
      // Use a destination known to have weather data
      const request = createNextRequest(`/api/destinations/${testDestinationSlug}`);
      const params = createRouteParams(testDestinationSlug);
      
      const response = await getDestinationBySlug(request, params as any);
      expect(response.status).toBe(200);
      
      const destination = await response.json();
      
      // Skip if no weather data
      if (!destination.weather || destination.weather.length === 0) {
        return;
      }
      
      // Get all seasons from the weather data
      const seasons = destination.weather.map((w: any) => w.season);
      
      // Check for all four seasons
      const expectedSeasons = ['spring', 'summer', 'autumn', 'winter'];
      expectedSeasons.forEach(season => {
        expect(seasons).toContain(season);
      });
    });
    
    it('ensures all temperature ranges are valid', async () => {
      // Use a destination known to have weather data
      const request = createNextRequest(`/api/destinations/${testDestinationSlug}`);
      const params = createRouteParams(testDestinationSlug);
      
      const response = await getDestinationBySlug(request, params as any);
      expect(response.status).toBe(200);
      
      const destination = await response.json();
      
      // Skip if no weather data
      if (!destination.weather || destination.weather.length === 0) {
        return;
      }
      
      // Check all weather items
      destination.weather.forEach((weather: any) => {
        // Low temperature should be less than or equal to high temperature
        expect(weather.temp_low).toBeLessThanOrEqual(weather.temp_high);
        
        // Temperatures should be within reasonable ranges for Earth (-70°C to 60°C)
        expect(weather.temp_low).toBeGreaterThanOrEqual(-70);
        expect(weather.temp_high).toBeLessThanOrEqual(60);
      });
    });
  });
});