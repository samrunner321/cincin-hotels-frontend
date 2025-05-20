/**
 * Reference tests for Destination API endpoints
 * 
 * These tests run against the real Directus API to verify basic functionality
 * and provide a "reality check" for our mock-based tests.
 */
import { NextRequest, NextResponse } from 'next/server';
import supertest from 'supertest';
import { GET as getDestinations } from '../../src/app/api/destinations/route';
import { GET as getDestinationBySlug } from '../../src/app/api/destinations/[slug]/route';
import { Destination } from '../../lib/directus';
import axios from 'axios';

// Flag to enable/disable reference tests against the real API
// Set to false when running in CI or if Directus is not available
const RUN_REFERENCE_TESTS = process.env.RUN_REFERENCE_TESTS === 'true';

// Skip all tests if reference tests are disabled
const testMethod = RUN_REFERENCE_TESTS ? describe : describe.skip;

// Known test destination data from our real Directus instance
const testDestinationId = '1'; // Replace with a real destination ID from your Directus instance
const testDestinationSlug = 'south-tyrol'; // Replace with a real destination slug

/**
 * Create a NextRequest instance for testing
 */
function createNextRequest(path: string, params: Record<string, string> = {}): NextRequest {
  const url = new URL(`http://localhost:3000${path}`);
  
  // Add query parameters
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  
  return new NextRequest(url);
}

/**
 * Create params object for route handlers
 */
function createRouteParams(slug: string) {
  return { params: { slug } };
}

/**
 * Validate destination structure
 */
function validateDestinationStructure(destination: Destination): boolean {
  return (
    typeof destination.id === 'string' &&
    typeof destination.name === 'string' &&
    typeof destination.slug === 'string' &&
    typeof destination.status === 'string' &&
    typeof destination.country === 'string' &&
    typeof destination.short_description === 'string' &&
    typeof destination.description === 'string'
  );
}

/**
 * Validate coordinates structure
 */
function validateCoordinates(coordinates: any): boolean {
  return (
    coordinates &&
    typeof coordinates === 'object' &&
    typeof coordinates.lat === 'number' &&
    typeof coordinates.lng === 'number' &&
    coordinates.lat >= -90 && 
    coordinates.lat <= 90 &&
    coordinates.lng >= -180 &&
    coordinates.lng <= 180
  );
}

/**
 * Validate activity structure
 */
function validateActivity(activity: any): boolean {
  return (
    typeof activity.title === 'string' &&
    ['spring', 'summer', 'autumn', 'winter', 'all'].includes(activity.season)
  );
}

/**
 * Validate highlight structure
 */
function validateHighlight(highlight: any): boolean {
  return (
    typeof highlight.title === 'string' &&
    (!highlight.description || typeof highlight.description === 'string')
  );
}

testMethod('Destination API Reference Tests', () => {
  // Test timeout increased for API calls
  jest.setTimeout(20000);

  describe('GET /api/destinations', () => {
    it('should return a list of destinations', async () => {
      // Make request to the /api/destinations endpoint
      const request = createNextRequest('/api/destinations');
      const response = await getDestinations(request);
      
      // Verify response status
      expect(response.status).toBe(200);
      
      // Parse response body
      const data = await response.json();
      
      // Verify we have destinations in the response
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      
      // Verify structure of first destination
      const firstDestination = data[0];
      expect(validateDestinationStructure(firstDestination)).toBe(true);
    });

    it('should filter destinations by region', async () => {
      // Filter for Alpine destinations
      const filter = {
        status: { _eq: 'published' },
        region: { _eq: 'alps' }
      };
      
      // Make request with filter
      const request = createNextRequest('/api/destinations', {
        filter: JSON.stringify(filter)
      });
      
      const response = await getDestinations(request);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      
      // Skip this check if no data is returned (test environment might not have data)
      if (data.length > 0) {
        // Check if returned destinations have the 'alps' region
        const hasAlpsRegion = data.every((destination: Destination) => 
          destination.region === 'alps'
        );
        
        expect(hasAlpsRegion).toBe(true);
      }
    });

    it('should filter destinations by featured status', async () => {
      // Filter for featured destinations
      const filter = {
        status: { _eq: 'published' },
        is_featured: { _eq: true }
      };
      
      // Make request with filter
      const request = createNextRequest('/api/destinations', {
        filter: JSON.stringify(filter)
      });
      
      const response = await getDestinations(request);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      
      // Skip this check if no data is returned (test environment might not have data)
      if (data.length > 0) {
        // Check if returned destinations are featured
        const allFeatured = data.every((destination: Destination) => 
          destination.is_featured === true
        );
        
        expect(allFeatured).toBe(true);
      }
    });

    it('should support pagination', async () => {
      // First page (2 items)
      const request1 = createNextRequest('/api/destinations', {
        limit: '2',
        offset: '0'
      });
      
      const response1 = await getDestinations(request1);
      expect(response1.status).toBe(200);
      
      const data1 = await response1.json();
      expect(Array.isArray(data1)).toBe(true);
      expect(data1.length).toBeLessThanOrEqual(2);
      
      // Skip pagination check if we don't have enough data
      if (data1.length < 2) {
        return;
      }
      
      // Second page (2 items)
      const request2 = createNextRequest('/api/destinations', {
        limit: '2',
        offset: '2'
      });
      
      const response2 = await getDestinations(request2);
      expect(response2.status).toBe(200);
      
      const data2 = await response2.json();
      expect(Array.isArray(data2)).toBe(true);
      
      // If we have enough destinations, pages should be different
      if (data1.length === 2 && data2.length > 0) {
        expect(data1[0].id).not.toBe(data2[0].id);
      }
    });
  });

  describe('GET /api/destinations/[slug]', () => {
    it('should return a specific destination by slug', async () => {
      // Make request for a specific destination
      const request = createNextRequest(`/api/destinations/${testDestinationSlug}`);
      const params = createRouteParams(testDestinationSlug);
      
      const response = await getDestinationBySlug(request, params as any);
      expect(response.status).toBe(200);
      
      const destination = await response.json();
      
      // Verify destination data
      expect(destination).toBeDefined();
      expect(destination.slug).toBe(testDestinationSlug);
      expect(validateDestinationStructure(destination)).toBe(true);
      
      // Verify relationships are loaded
      if (destination.highlights && destination.highlights.length > 0) {
        const highlight = destination.highlights[0];
        expect(validateHighlight(highlight)).toBe(true);
      }
      
      if (destination.activities && destination.activities.length > 0) {
        const activity = destination.activities[0];
        expect(validateActivity(activity)).toBe(true);
      }
      
      // Verify coordinates if present
      if (destination.coordinates) {
        expect(validateCoordinates(destination.coordinates)).toBe(true);
      }
    });

    it('should return 404 for non-existent destination slug', async () => {
      // Make request with invalid slug
      const nonExistentSlug = 'non-existent-destination';
      const request = createNextRequest(`/api/destinations/${nonExistentSlug}`);
      const params = createRouteParams(nonExistentSlug);
      
      const response = await getDestinationBySlug(request, params as any);
      expect(response.status).toBe(404);
      
      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    it('should include related hotels if available', async () => {
      // Make request for a specific destination that should have hotels
      const request = createNextRequest(`/api/destinations/${testDestinationSlug}`);
      const params = createRouteParams(testDestinationSlug);
      
      const response = await getDestinationBySlug(request, params as any);
      expect(response.status).toBe(200);
      
      const destination = await response.json();
      
      // Verify hotels array exists (even if empty)
      expect(destination.hotels).toBeDefined();
      expect(Array.isArray(destination.hotels)).toBe(true);
      
      // If hotels exist, check their structure
      if (destination.hotels && destination.hotels.length > 0) {
        const hotel = destination.hotels[0];
        expect(typeof hotel.id).toBe('string');
        expect(typeof hotel.name).toBe('string');
        expect(typeof hotel.slug).toBe('string');
      }
    });

    it('should include season-specific activities', async () => {
      // Make request for a specific destination
      const request = createNextRequest(`/api/destinations/${testDestinationSlug}`);
      const params = createRouteParams(testDestinationSlug);
      
      const response = await getDestinationBySlug(request, params as any);
      expect(response.status).toBe(200);
      
      const destination = await response.json();
      
      // If activities exist, check that they have seasonal information
      if (destination.activities && destination.activities.length > 0) {
        const activity = destination.activities[0];
        expect(activity.season).toBeDefined();
        expect(['spring', 'summer', 'autumn', 'winter', 'all']).toContain(activity.season);
      }
    });

    it('should include weather information for multiple seasons', async () => {
      // Make request for a specific destination
      const request = createNextRequest(`/api/destinations/${testDestinationSlug}`);
      const params = createRouteParams(testDestinationSlug);
      
      const response = await getDestinationBySlug(request, params as any);
      expect(response.status).toBe(200);
      
      const destination = await response.json();
      
      // If weather data exists, check its structure
      if (destination.weather && destination.weather.length > 0) {
        // Verify we have data for multiple seasons (if data is complete)
        if (destination.weather.length > 1) {
          // Get all seasons from the weather data
          const seasons = destination.weather.map((w: any) => w.season);
          // Check for presence of different seasons
          const uniqueSeasons = new Set(seasons);
          // There should be more than one season
          expect(uniqueSeasons.size).toBeGreaterThan(1);
        }
        
        // Check structure of first weather item
        const weather = destination.weather[0];
        expect(['spring', 'summer', 'autumn', 'winter']).toContain(weather.season);
        expect(typeof weather.temp_low).toBe('number');
        expect(typeof weather.temp_high).toBe('number');
      }
    });
  });

  describe('Integration Tests', () => {
    it('should be able to fetch a list of destinations and then get details for one', async () => {
      // First get the list of destinations
      const listRequest = createNextRequest('/api/destinations');
      const listResponse = await getDestinations(listRequest);
      expect(listResponse.status).toBe(200);
      
      const destinations = await listResponse.json();
      expect(Array.isArray(destinations)).toBe(true);
      
      // Skip this test if no destinations are returned
      if (destinations.length === 0) {
        console.warn('No destinations found, skipping integration test');
        return;
      }
      
      // Get the slug of the first destination
      const firstDestinationSlug = destinations[0].slug;
      expect(typeof firstDestinationSlug).toBe('string');
      
      // Now fetch details for that destination
      const detailRequest = createNextRequest(`/api/destinations/${firstDestinationSlug}`);
      const params = createRouteParams(firstDestinationSlug);
      
      const detailResponse = await getDestinationBySlug(detailRequest, params as any);
      expect(detailResponse.status).toBe(200);
      
      const destination = await detailResponse.json();
      expect(destination.slug).toBe(firstDestinationSlug);
      expect(destination.id).toBe(destinations[0].id);
    });

    it('should have consistent data between list and detail endpoints', async () => {
      // First get a specific destination from the list endpoint
      const listRequest = createNextRequest('/api/destinations', {
        filter: JSON.stringify({ slug: { _eq: testDestinationSlug } })
      });
      
      const listResponse = await getDestinations(listRequest);
      expect(listResponse.status).toBe(200);
      
      const destinations = await listResponse.json();
      expect(Array.isArray(destinations)).toBe(true);
      
      // Skip this test if the specific destination is not found
      if (destinations.length === 0) {
        console.warn(`Test destination '${testDestinationSlug}' not found, skipping consistency test`);
        return;
      }
      
      const listDestination = destinations[0];
      
      // Now get the same destination from the detail endpoint
      const detailRequest = createNextRequest(`/api/destinations/${testDestinationSlug}`);
      const params = createRouteParams(testDestinationSlug);
      
      const detailResponse = await getDestinationBySlug(detailRequest, params as any);
      expect(detailResponse.status).toBe(200);
      
      const detailDestination = await detailResponse.json();
      
      // Compare basic fields between the two responses
      expect(detailDestination.id).toBe(listDestination.id);
      expect(detailDestination.name).toBe(listDestination.name);
      expect(detailDestination.slug).toBe(listDestination.slug);
      expect(detailDestination.country).toBe(listDestination.country);
    });
  });
});