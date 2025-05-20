import { createMocks } from 'node-mocks-http';
import { NextRequest, NextResponse } from 'next/server';
import { GET } from '../../src/app/api/hotels/route';

// Mock the directus-client module
jest.mock('../../lib/directus-client', () => ({
  getHotelsWithCache: jest.fn().mockResolvedValue([
    {
      id: '1',
      name: 'Test Hotel 1',
      slug: 'test-hotel-1',
      location: 'Test Location 1',
      status: 'published',
    },
    {
      id: '2',
      name: 'Test Hotel 2',
      slug: 'test-hotel-2',
      location: 'Test Location 2',
      status: 'published',
    },
  ]),
  REVALIDATE_TIMES: {
    HOTELS: 300,
  },
}));

// Mock NextRequest and URL
const createMockRequest = (params = {}) => {
  const url = new URL('http://localhost:3000/api/hotels');
  
  // Add search params
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });
  
  return new NextRequest(url);
};

describe('Hotels API Route', () => {
  it('returns a list of hotels', async () => {
    const request = createMockRequest();
    const response = await GET(request);
    
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.data).toHaveLength(2);
    expect(data.data[0].name).toBe('Test Hotel 1');
    expect(data.data[1].name).toBe('Test Hotel 2');
  });
  
  it('applies query parameters correctly', async () => {
    // Mock the implementation to track parameters
    const { getHotelsWithCache } = require('../../lib/directus-client');
    
    // Create request with query parameters
    const request = createMockRequest({
      limit: '10',
      offset: '5',
      sortBy: 'name',
      sortDirection: 'asc',
      featured: 'true',
    });
    
    await GET(request);
    
    // Check that getHotelsWithCache was called with the correct parameters
    expect(getHotelsWithCache).toHaveBeenCalledWith(
      expect.objectContaining({
        limit: 10,
        offset: 5,
        sort: ['name'],
        filter: expect.objectContaining({
          status: { _eq: 'published' },
          is_featured: { _eq: true },
        }),
      })
    );
  });
  
  it('handles error gracefully', async () => {
    // Mock implementation to throw error
    const { getHotelsWithCache } = require('../../lib/directus-client');
    getHotelsWithCache.mockRejectedValueOnce(new Error('Test error'));
    
    const request = createMockRequest();
    const response = await GET(request);
    
    expect(response.status).toBe(500);
    
    const data = await response.json();
    expect(data.error).toBeDefined();
    expect(data.error.message).toContain('Test error');
  });
  
  it('sets proper cache headers', async () => {
    const request = createMockRequest();
    const response = await GET(request);
    
    const headers = Object.fromEntries(response.headers.entries());
    expect(headers['cache-control']).toContain('public');
    expect(headers['cache-control']).toContain('max-age=300');
  });
});