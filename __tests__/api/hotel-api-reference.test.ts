/**
 * Reference tests for Hotel API endpoints
 * 
 * These tests run against the real Directus API to verify basic functionality
 * and provide a "reality check" for our mock-based tests.
 */
import { NextRequest } from 'next/server';
import supertest from 'supertest';
import { GET as getHotels } from '../../src/app/api/hotels/route';
import { GET as getHotelBySlug } from '../../src/app/api/hotels/[slug]/route';
import { Hotel } from '../../lib/directus';
import axios from 'axios';

// Flag to enable/disable reference tests against the real API
// Set to false when running in CI or if Directus is not available
const RUN_REFERENCE_TESTS = process.env.RUN_REFERENCE_TESTS === 'true';

// Skip all tests if reference tests are disabled
const testMethod = RUN_REFERENCE_TESTS ? describe : describe.skip;

// Known test hotel data from our real Directus instance
const testHotelId = '1'; // Replace with a real hotel ID from your Directus instance
const testHotelSlug = 'hotel-schgaguler'; // Replace with a real hotel slug
const testDestinationId = '1'; // Replace with a real destination ID

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
 * Validate hotel structure
 */
function validateHotelStructure(hotel: Hotel): boolean {
  return (
    typeof hotel.id === 'string' &&
    typeof hotel.name === 'string' &&
    typeof hotel.slug === 'string' &&
    typeof hotel.status === 'string' &&
    typeof hotel.location === 'string' &&
    typeof hotel.short_description === 'string' &&
    typeof hotel.description === 'string' &&
    typeof hotel.price_from === 'number' &&
    typeof hotel.currency === 'string'
  );
}

testMethod('Hotel API Reference Tests', () => {
  // Test timeout increased for API calls
  jest.setTimeout(20000);

  describe('GET /api/hotels', () => {
    it('should return a list of hotels', async () => {
      // Make request to the /api/hotels endpoint
      const request = createNextRequest('/api/hotels');
      const response = await getHotels(request);
      
      // Verify response status
      expect(response.status).toBe(200);
      
      // Parse response body
      const data = await response.json();
      
      // Verify we have hotels in the response
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      
      // Verify structure of first hotel
      const firstHotel = data[0];
      expect(validateHotelStructure(firstHotel)).toBe(true);
    });

    it('should filter hotels by category', async () => {
      // Filter for luxury hotels
      const filter = {
        status: { _eq: 'published' },
        categories: { _contains: ['luxury'] }
      };
      
      // Make request with filter
      const request = createNextRequest('/api/hotels', {
        filter: JSON.stringify(filter)
      });
      
      const response = await getHotels(request);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      
      // Some hotels should match this filter
      if (data.length > 0) {
        // Check if returned hotels have the 'luxury' category
        const hasLuxuryCategory = data.some((hotel: Hotel) => 
          hotel.categories && hotel.categories.includes('luxury')
        );
        
        expect(hasLuxuryCategory).toBe(true);
      }
    });

    it('should filter hotels by destination', async () => {
      // Filter for hotels in our test destination
      const filter = {
        status: { _eq: 'published' },
        destination: { _eq: testDestinationId }
      };
      
      // Make request with filter
      const request = createNextRequest('/api/hotels', {
        filter: JSON.stringify(filter)
      });
      
      const response = await getHotels(request);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      
      // Verify returned hotels are from the test destination
      if (data.length > 0) {
        const allFromTestDestination = data.every((hotel: Hotel) => 
          hotel.destination === testDestinationId
        );
        
        expect(allFromTestDestination).toBe(true);
      }
    });

    it('should sort hotels by price', async () => {
      // Make request with sorting by price ascending
      const request = createNextRequest('/api/hotels', {
        sort: 'price_from'
      });
      
      const response = await getHotels(request);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      
      // Verify hotels are sorted by price (ascending)
      if (data.length > 1) {
        for (let i = 0; i < data.length - 1; i++) {
          expect(data[i].price_from).toBeLessThanOrEqual(data[i + 1].price_from);
        }
      }
    });

    it('should support pagination', async () => {
      // First page (2 items)
      const request1 = createNextRequest('/api/hotels', {
        limit: '2',
        offset: '0'
      });
      
      const response1 = await getHotels(request1);
      expect(response1.status).toBe(200);
      
      const data1 = await response1.json();
      expect(Array.isArray(data1)).toBe(true);
      expect(data1.length).toBeLessThanOrEqual(2);
      
      // Second page (2 items)
      const request2 = createNextRequest('/api/hotels', {
        limit: '2',
        offset: '2'
      });
      
      const response2 = await getHotels(request2);
      expect(response2.status).toBe(200);
      
      const data2 = await response2.json();
      expect(Array.isArray(data2)).toBe(true);
      
      // If we have enough hotels, pages should be different
      if (data1.length === 2 && data2.length > 0) {
        expect(data1[0].id).not.toBe(data2[0].id);
      }
    });
  });

  describe('GET /api/hotels/[slug]', () => {
    it('should return a specific hotel by slug', async () => {
      // Make request for a specific hotel
      const request = createNextRequest(`/api/hotels/${testHotelSlug}`);
      const params = createRouteParams(testHotelSlug);
      
      const response = await getHotelBySlug(request, params as any);
      expect(response.status).toBe(200);
      
      const hotel = await response.json();
      
      // Verify hotel data
      expect(hotel).toBeDefined();
      expect(hotel.slug).toBe(testHotelSlug);
      expect(validateHotelStructure(hotel)).toBe(true);
      
      // Verify relationships are loaded
      expect(hotel.rooms).toBeDefined();
      if (hotel.rooms && hotel.rooms.length > 0) {
        const room = hotel.rooms[0];
        expect(typeof room.name).toBe('string');
        expect(typeof room.price_per_night).toBe('number');
      }
    });

    it('should return 404 for non-existent hotel slug', async () => {
      // Make request with invalid slug
      const nonExistentSlug = 'non-existent-hotel';
      const request = createNextRequest(`/api/hotels/${nonExistentSlug}`);
      const params = createRouteParams(nonExistentSlug);
      
      const response = await getHotelBySlug(request, params as any);
      expect(response.status).toBe(404);
      
      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    it('should include room data in hotel details', async () => {
      // Make request for a specific hotel that should have rooms
      const request = createNextRequest(`/api/hotels/${testHotelSlug}`);
      const params = createRouteParams(testHotelSlug);
      
      const response = await getHotelBySlug(request, params as any);
      expect(response.status).toBe(200);
      
      const hotel = await response.json();
      
      // Verify rooms data
      expect(hotel.rooms).toBeDefined();
      expect(Array.isArray(hotel.rooms)).toBe(true);
      
      // If rooms exist, check their structure
      if (hotel.rooms && hotel.rooms.length > 0) {
        const room = hotel.rooms[0];
        expect(typeof room.id).toBe('string');
        expect(typeof room.name).toBe('string');
        expect(typeof room.description).toBe('string');
        expect(typeof room.price_per_night).toBe('number');
      }
    });

    it('should include destination data in hotel details', async () => {
      // Make request for a specific hotel that should have a destination
      const request = createNextRequest(`/api/hotels/${testHotelSlug}`);
      const params = createRouteParams(testHotelSlug);
      
      const response = await getHotelBySlug(request, params as any);
      expect(response.status).toBe(200);
      
      const hotel = await response.json();
      
      // Verify destination data
      if (hotel.destination) {
        // Destination might be a string ID or an expanded object
        if (typeof hotel.destination === 'object') {
          expect(hotel.destination.id).toBeDefined();
          expect(hotel.destination.name).toBeDefined();
        } else {
          // If it's just an ID, ensure it's a string
          expect(typeof hotel.destination).toBe('string');
        }
      }
    });
  });

  describe('Integration Tests', () => {
    it('should be able to fetch a list of hotels and then get details for one', async () => {
      // First get the list of hotels
      const listRequest = createNextRequest('/api/hotels');
      const listResponse = await getHotels(listRequest);
      expect(listResponse.status).toBe(200);
      
      const hotels = await listResponse.json();
      expect(Array.isArray(hotels)).toBe(true);
      expect(hotels.length).toBeGreaterThan(0);
      
      // Get the slug of the first hotel
      const firstHotelSlug = hotels[0].slug;
      expect(typeof firstHotelSlug).toBe('string');
      
      // Now fetch details for that hotel
      const detailRequest = createNextRequest(`/api/hotels/${firstHotelSlug}`);
      const params = createRouteParams(firstHotelSlug);
      
      const detailResponse = await getHotelBySlug(detailRequest, params as any);
      expect(detailResponse.status).toBe(200);
      
      const hotel = await detailResponse.json();
      expect(hotel.slug).toBe(firstHotelSlug);
      expect(hotel.id).toBe(hotels[0].id);
    });

    it('should have consistent data between list and detail endpoints', async () => {
      // First get a specific hotel from the list endpoint
      const listRequest = createNextRequest('/api/hotels', {
        filter: JSON.stringify({ slug: { _eq: testHotelSlug } })
      });
      
      const listResponse = await getHotels(listRequest);
      expect(listResponse.status).toBe(200);
      
      const hotels = await listResponse.json();
      expect(Array.isArray(hotels)).toBe(true);
      expect(hotels.length).toBe(1);
      
      const listHotel = hotels[0];
      
      // Now get the same hotel from the detail endpoint
      const detailRequest = createNextRequest(`/api/hotels/${testHotelSlug}`);
      const params = createRouteParams(testHotelSlug);
      
      const detailResponse = await getHotelBySlug(detailRequest, params as any);
      expect(detailResponse.status).toBe(200);
      
      const detailHotel = await detailResponse.json();
      
      // Compare basic fields between the two responses
      expect(detailHotel.id).toBe(listHotel.id);
      expect(detailHotel.name).toBe(listHotel.name);
      expect(detailHotel.slug).toBe(listHotel.slug);
      expect(detailHotel.price_from).toBe(listHotel.price_from);
    });
  });
});