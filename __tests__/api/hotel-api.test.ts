/**
 * Comprehensive mock tests for Hotel API
 * 
 * These tests use MSW to mock API responses, testing various scenarios
 * without requiring a real Directus instance.
 */
import { NextRequest } from 'next/server';
import supertest from 'supertest';
import { GET as getHotels } from '../../src/app/api/hotels/route';
import { GET as getHotelBySlug } from '../../src/app/api/hotels/[slug]/route';
import { Hotel } from '../../lib/directus';
import axios from 'axios';
import { server } from './mocks/server';
import { rest } from 'msw';
import { 
  mockAllHotels, 
  mockHotels, 
  mockEdgeCaseHotels,
  mockCategories,
  mockDestinations
} from './mocks/hotel-mocks';
import { 
  createNextRequest, 
  createRouteParams,
  validateHotelStructure, 
  validateCompleteHotel,
  validateRoomStructure 
} from './utils/hotel-test-utils';

// Import Jest types for test enhancements
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidHotel(): R;
      toBeValidRoom(): R;
      toHaveCategory(category: string): R;
    }
  }
}

// Extend Jest matchers for hotel validation
expect.extend({
  toBeValidHotel(received: Hotel) {
    const result = validateHotelStructure(received);
    return {
      message: () => 
        result 
          ? 'Expected hotel to be invalid, but it is valid'
          : 'Expected hotel to be valid, but it is missing required fields or has invalid types',
      pass: result
    };
  },
  
  toBeValidRoom(received: any) {
    const result = validateRoomStructure(received);
    return {
      message: () => 
        result 
          ? 'Expected room to be invalid, but it is valid'
          : 'Expected room to be valid, but it is missing required fields or has invalid types',
      pass: result
    };
  },
  
  toHaveCategory(received: Hotel, category: string) {
    const hasCategory = received.categories && 
                        Array.isArray(received.categories) && 
                        received.categories.includes(category);
    
    return {
      message: () => 
        hasCategory 
          ? `Expected hotel not to have category "${category}", but it does`
          : `Expected hotel to have category "${category}", but it doesn't`,
      pass: hasCategory
    };
  }
});

describe('Hotel API Tests with MSW', () => {
  // Common test hotel data
  const testHotelSlug = mockHotels[0].slug;
  const testHotelId = mockHotels[0].id;
  const edgeCaseHotelSlug = mockEdgeCaseHotels[0].slug;
  
  describe('GET /api/hotels - List View', () => {
    describe('Basic Functionality', () => {
      it('returns a list of hotels', async () => {
        const request = createNextRequest('/api/hotels');
        const response = await getHotels(request);
        
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThan(0);
        
        // Verify hotel structure
        const firstHotel = data[0];
        expect(firstHotel).toBeValidHotel();
      });
      
      it('returns correct default values when no parameters are provided', async () => {
        const request = createNextRequest('/api/hotels');
        const response = await getHotels(request);
        
        expect(response.status).toBe(200);
        
        const data = await response.json();
        
        // Should return published hotels by default
        const allPublished = data.every((hotel: Hotel) => hotel.status === 'published');
        expect(allPublished).toBe(true);
        
        // Default limit should be applied (100)
        expect(data.length).toBeLessThanOrEqual(100);
      });
      
      it('sets proper cache headers', async () => {
        const request = createNextRequest('/api/hotels');
        const response = await getHotels(request);
        
        expect(response.status).toBe(200);
        
        // Check cache headers
        const cacheControl = response.headers.get('cache-control');
        expect(cacheControl).toBeDefined();
        expect(cacheControl).toContain('public');
        expect(cacheControl).toContain('max-age=');
      });
    });
    
    describe('Filtering', () => {
      it('filters hotels by category', async () => {
        // Filter for luxury hotels
        const filter = {
          status: { _eq: 'published' },
          categories: { _contains: ['luxury'] }
        };
        
        const request = createNextRequest('/api/hotels', {
          filter: JSON.stringify(filter)
        });
        
        const response = await getHotels(request);
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        
        // Verify all returned hotels have the luxury category
        data.forEach((hotel: Hotel) => {
          expect(hotel).toHaveCategory('luxury');
        });
      });
      
      it('filters hotels by price range', async () => {
        // Filter for hotels within a price range
        const minPrice = 300;
        const maxPrice = 600;
        
        const filter = {
          status: { _eq: 'published' },
          price_from: { _gte: minPrice, _lte: maxPrice }
        };
        
        const request = createNextRequest('/api/hotels', {
          filter: JSON.stringify(filter)
        });
        
        const response = await getHotels(request);
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        
        // Verify all returned hotels are within the price range
        data.forEach((hotel: Hotel) => {
          expect(hotel.price_from).toBeGreaterThanOrEqual(minPrice);
          expect(hotel.price_from).toBeLessThanOrEqual(maxPrice);
        });
      });
      
      it('filters hotels by location (region)', async () => {
        // Filter for hotels in a specific region
        const region = 'alps';
        
        const filter = {
          status: { _eq: 'published' },
          region: { _eq: region }
        };
        
        const request = createNextRequest('/api/hotels', {
          filter: JSON.stringify(filter)
        });
        
        const response = await getHotels(request);
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        
        // Verify all returned hotels are in the specified region
        data.forEach((hotel: Hotel) => {
          expect(hotel.region).toBe(region);
        });
      });
      
      it('filters hotels by featured status', async () => {
        // Filter for featured hotels
        const filter = {
          status: { _eq: 'published' },
          is_featured: { _eq: true }
        };
        
        const request = createNextRequest('/api/hotels', {
          filter: JSON.stringify(filter)
        });
        
        const response = await getHotels(request);
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        
        // Verify all returned hotels are featured
        data.forEach((hotel: Hotel) => {
          expect(hotel.is_featured).toBe(true);
        });
      });
      
      it('handles complex filters with multiple conditions', async () => {
        // Complex filter with multiple conditions
        const filter = {
          status: { _eq: 'published' },
          region: { _eq: 'alps' },
          is_featured: { _eq: true },
          price_from: { _gte: 300 }
        };
        
        const request = createNextRequest('/api/hotels', {
          filter: JSON.stringify(filter)
        });
        
        const response = await getHotels(request);
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        
        // Verify all returned hotels match all conditions
        data.forEach((hotel: Hotel) => {
          expect(hotel.status).toBe('published');
          expect(hotel.region).toBe('alps');
          expect(hotel.is_featured).toBe(true);
          expect(hotel.price_from).toBeGreaterThanOrEqual(300);
        });
      });
      
      it('returns empty array for filters with no matches', async () => {
        // Filter that shouldn't match any hotels
        const filter = {
          status: { _eq: 'published' },
          price_from: { _gte: 1000000 } // Extremely high price
        };
        
        const request = createNextRequest('/api/hotels', {
          filter: JSON.stringify(filter)
        });
        
        const response = await getHotels(request);
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBe(0);
      });
    });
    
    describe('Sorting', () => {
      it('sorts hotels by price (ascending)', async () => {
        const request = createNextRequest('/api/hotels', {
          sort: 'price_from'
        });
        
        const response = await getHotels(request);
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        
        // Verify hotels are sorted by price (ascending)
        for (let i = 0; i < data.length - 1; i++) {
          expect(data[i].price_from).toBeLessThanOrEqual(data[i + 1].price_from);
        }
      });
      
      it('sorts hotels by price (descending)', async () => {
        const request = createNextRequest('/api/hotels', {
          sort: '-price_from'
        });
        
        const response = await getHotels(request);
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        
        // Verify hotels are sorted by price (descending)
        for (let i = 0; i < data.length - 1; i++) {
          expect(data[i].price_from).toBeGreaterThanOrEqual(data[i + 1].price_from);
        }
      });
      
      it('sorts hotels alphabetically by name', async () => {
        const request = createNextRequest('/api/hotels', {
          sort: 'name'
        });
        
        const response = await getHotels(request);
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        
        // Verify hotels are sorted alphabetically by name
        for (let i = 0; i < data.length - 1; i++) {
          expect(data[i].name.localeCompare(data[i + 1].name)).toBeLessThanOrEqual(0);
        }
      });
    });
    
    describe('Pagination', () => {
      it('limits the number of hotels returned', async () => {
        const limit = 2;
        
        const request = createNextRequest('/api/hotels', {
          limit: limit.toString()
        });
        
        const response = await getHotels(request);
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeLessThanOrEqual(limit);
      });
      
      it('skips hotels with offset parameter', async () => {
        // First page
        const limit = 2;
        const request1 = createNextRequest('/api/hotels', {
          limit: limit.toString(),
          offset: '0'
        });
        
        const response1 = await getHotels(request1);
        const data1 = await response1.json();
        
        // Second page
        const request2 = createNextRequest('/api/hotels', {
          limit: limit.toString(),
          offset: limit.toString()
        });
        
        const response2 = await getHotels(request2);
        const data2 = await response2.json();
        
        // Verify the two pages have different hotels
        if (data1.length > 0 && data2.length > 0) {
          expect(data1[0].id).not.toBe(data2[0].id);
        }
      });
      
      it('returns correct data for pagination with filters', async () => {
        // Filter for luxury hotels with pagination
        const filter = {
          status: { _eq: 'published' },
          categories: { _contains: ['luxury'] }
        };
        
        const limit = 1;
        
        // First page
        const request1 = createNextRequest('/api/hotels', {
          filter: JSON.stringify(filter),
          limit: limit.toString(),
          offset: '0'
        });
        
        const response1 = await getHotels(request1);
        const data1 = await response1.json();
        
        // Verify first page
        expect(data1.length).toBeLessThanOrEqual(limit);
        if (data1.length > 0) {
          expect(data1[0]).toHaveCategory('luxury');
        }
        
        // Second page
        const request2 = createNextRequest('/api/hotels', {
          filter: JSON.stringify(filter),
          limit: limit.toString(),
          offset: limit.toString()
        });
        
        const response2 = await getHotels(request2);
        const data2 = await response2.json();
        
        // Verify second page
        expect(data2.length).toBeLessThanOrEqual(limit);
        if (data2.length > 0) {
          expect(data2[0]).toHaveCategory('luxury');
        }
        
        // Verify the two pages have different hotels
        if (data1.length > 0 && data2.length > 0) {
          expect(data1[0].id).not.toBe(data2[0].id);
        }
      });
    });
    
    describe('Error Handling', () => {
      it('handles server errors gracefully', async () => {
        // Mock a server error response
        server.use(
          rest.get('http://localhost:3000/api/hotels', (req, res, ctx) => {
            return res(
              ctx.status(500),
              ctx.json({ error: 'Internal Server Error' })
            );
          })
        );
        
        const request = createNextRequest('/api/hotels');
        const response = await getHotels(request);
        
        expect(response.status).toBe(500);
        
        const data = await response.json();
        expect(data.error).toBeDefined();
      });
      
      it('handles invalid filter JSON gracefully', async () => {
        const request = createNextRequest('/api/hotels', {
          filter: 'invalid-json'
        });
        
        const response = await getHotels(request);
        
        // Should still return a successful response with default filtering
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
      });
    });
  });
  
  describe('GET /api/hotels/[slug] - Detail View', () => {
    describe('Basic Functionality', () => {
      it('returns a specific hotel by slug', async () => {
        const request = createNextRequest(`/api/hotels/${testHotelSlug}`);
        const params = createRouteParams(testHotelSlug);
        
        const response = await getHotelBySlug(request, params as any);
        expect(response.status).toBe(200);
        
        const hotel = await response.json();
        
        // Verify hotel data
        expect(hotel).toBeValidHotel();
        expect(hotel.slug).toBe(testHotelSlug);
        expect(hotel.id).toBe(testHotelId);
      });
      
      it('returns 404 for non-existent hotel slug', async () => {
        const nonExistentSlug = 'non-existent-hotel';
        const request = createNextRequest(`/api/hotels/${nonExistentSlug}`);
        const params = createRouteParams(nonExistentSlug);
        
        const response = await getHotelBySlug(request, params as any);
        expect(response.status).toBe(404);
        
        const data = await response.json();
        expect(data.error).toBeDefined();
      });
      
      it('returns 400 for empty slug', async () => {
        const emptySlug = '';
        const request = createNextRequest(`/api/hotels/${emptySlug}`);
        const params = createRouteParams(emptySlug);
        
        const response = await getHotelBySlug(request, params as any);
        expect(response.status).toBe(400);
        
        const data = await response.json();
        expect(data.error).toBeDefined();
      });
      
      it('includes room data in hotel details', async () => {
        // Use a hotel known to have rooms
        const request = createNextRequest(`/api/hotels/${testHotelSlug}`);
        const params = createRouteParams(testHotelSlug);
        
        const response = await getHotelBySlug(request, params as any);
        expect(response.status).toBe(200);
        
        const hotel = await response.json();
        
        // Verify room data
        expect(hotel.rooms).toBeDefined();
        expect(Array.isArray(hotel.rooms)).toBe(true);
        expect(hotel.rooms.length).toBeGreaterThan(0);
        
        // Verify first room structure
        const firstRoom = hotel.rooms[0];
        expect(firstRoom).toBeValidRoom();
      });
      
      it('sets proper cache headers', async () => {
        const request = createNextRequest(`/api/hotels/${testHotelSlug}`);
        const params = createRouteParams(testHotelSlug);
        
        const response = await getHotelBySlug(request, params as any);
        expect(response.status).toBe(200);
        
        // Check cache headers
        const cacheControl = response.headers.get('cache-control');
        expect(cacheControl).toBeDefined();
        expect(cacheControl).toContain('public');
        expect(cacheControl).toContain('max-age=');
      });
    });
    
    describe('Edge Cases', () => {
      it('handles hotels with no main image', async () => {
        // Use a hotel without a main image
        const slug = 'test-hotel-no-image';
        const request = createNextRequest(`/api/hotels/${slug}`);
        const params = createRouteParams(slug);
        
        const response = await getHotelBySlug(request, params as any);
        expect(response.status).toBe(200);
        
        const hotel = await response.json();
        
        // Main image should be empty or null
        expect(hotel.main_image).toBeFalsy();
      });
      
      it('handles hotels with no rooms', async () => {
        // Use a hotel without rooms
        const slug = 'test-hotel-no-rooms';
        const request = createNextRequest(`/api/hotels/${slug}`);
        const params = createRouteParams(slug);
        
        const response = await getHotelBySlug(request, params as any);
        expect(response.status).toBe(200);
        
        const hotel = await response.json();
        
        // Rooms should be an empty array
        expect(hotel.rooms).toBeDefined();
        expect(Array.isArray(hotel.rooms)).toBe(true);
        expect(hotel.rooms.length).toBe(0);
      });
      
      it('handles hotels with no categories', async () => {
        // Use a hotel without categories
        const slug = 'test-hotel-no-categories';
        const request = createNextRequest(`/api/hotels/${slug}`);
        const params = createRouteParams(slug);
        
        const response = await getHotelBySlug(request, params as any);
        expect(response.status).toBe(200);
        
        const hotel = await response.json();
        
        // Categories should be an empty array
        expect(hotel.categories).toBeDefined();
        expect(Array.isArray(hotel.categories)).toBe(true);
        expect(hotel.categories.length).toBe(0);
      });
      
      it('handles hotels with minimal data', async () => {
        // Use a hotel with minimal data
        const slug = 'test-hotel-minimal';
        const request = createNextRequest(`/api/hotels/${slug}`);
        const params = createRouteParams(slug);
        
        const response = await getHotelBySlug(request, params as any);
        expect(response.status).toBe(200);
        
        const hotel = await response.json();
        
        // Should still have all required fields
        expect(hotel).toBeValidHotel();
      });
      
      it('returns 404 for draft hotels', async () => {
        // Use a hotel with draft status
        const slug = 'test-hotel-draft';
        const request = createNextRequest(`/api/hotels/${slug}`);
        const params = createRouteParams(slug);
        
        const response = await getHotelBySlug(request, params as any);
        expect(response.status).toBe(404);
      });
    });
    
    describe('Error Handling', () => {
      it('handles server errors gracefully', async () => {
        // Mock a server error response for a specific hotel
        server.use(
          rest.get(`http://localhost:3000/api/hotels/${testHotelSlug}`, (req, res, ctx) => {
            return res(
              ctx.status(500),
              ctx.json({ error: 'Internal Server Error' })
            );
          })
        );
        
        const request = createNextRequest(`/api/hotels/${testHotelSlug}`);
        const params = createRouteParams(testHotelSlug);
        
        const response = await getHotelBySlug(request, params as any);
        expect(response.status).toBe(500);
        
        const data = await response.json();
        expect(data.error).toBeDefined();
      });
    });
  });
  
  describe('Performance and Caching', () => {
    it('returns cached responses with correct headers', async () => {
      // Test the cache handler
      const response = await fetch('http://localhost:3000/api/hotels/cache-test?cache-hit=true');
      expect(response.status).toBe(200);
      
      // Check cache headers
      const cacheStatus = response.headers.get('x-cache');
      expect(cacheStatus).toBe('HIT');
      
      const cacheControl = response.headers.get('cache-control');
      expect(cacheControl).toBeDefined();
      expect(cacheControl).toContain('public');
      expect(cacheControl).toContain('max-age=');
      
      const data = await response.json();
      expect(data.cache_status).toBe('HIT');
    });
    
    it('handles concurrent requests correctly', async () => {
      // Make multiple concurrent requests
      const requests = Array(3).fill(null).map(() => 
        fetch('http://localhost:3000/api/hotels')
          .then(res => res.json())
      );
      
      const responses = await Promise.all(requests);
      
      // Verify all responses have the same data
      expect(responses[0]).toEqual(responses[1]);
      expect(responses[1]).toEqual(responses[2]);
    });
  });
  
  describe('Error Scenarios', () => {
    it('handles server timeout correctly', async () => {
      // Set a short timeout for this test
      jest.setTimeout(1000);
      
      try {
        // Call the timeout endpoint
        const response = await fetch('http://localhost:3000/api/hotels/timeout-test', {
          signal: AbortSignal.timeout(500) // Abort after 500ms
        });
        
        // This should not be reached
        expect(true).toBe(false);
      } catch (error) {
        // Expect a timeout error
        expect(error).toBeDefined();
      }
    });
    
    it('handles rate limiting correctly', async () => {
      const response = await fetch('http://localhost:3000/api/hotels/rate-limit-test');
      
      expect(response.status).toBe(429);
      
      const data = await response.json();
      expect(data.error).toBeDefined();
      expect(data.error).toContain('Rate limit');
    });
    
    it('handles server errors correctly', async () => {
      const response = await fetch('http://localhost:3000/api/hotels/error-test');
      
      expect(response.status).toBe(500);
      
      const data = await response.json();
      expect(data.error).toBeDefined();
    });
  });
});