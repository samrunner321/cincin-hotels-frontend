import { NextRequest, NextResponse } from 'next/server';
import { GET } from '../../src/app/api/destinations/route';

// Mock the directus-client module
jest.mock('../../lib/directus-client', () => ({
  getDestinationsWithCache: jest.fn().mockResolvedValue([
    {
      id: '1',
      name: 'Test Destination 1',
      slug: 'test-destination-1',
      country: 'Test Country 1',
      status: 'published',
    },
    {
      id: '2',
      name: 'Test Destination 2',
      slug: 'test-destination-2',
      country: 'Test Country 2',
      status: 'published',
    },
  ]),
  REVALIDATE_TIMES: {
    DESTINATIONS: 600,
  },
}));

// Mock NextRequest and URL
const createMockRequest = (params = {}) => {
  const url = new URL('http://localhost:3000/api/destinations');
  
  // Add search params
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });
  
  return new NextRequest(url);
};

describe('Destinations API Route', () => {
  it('returns a list of destinations', async () => {
    const request = createMockRequest();
    const response = await GET(request);
    
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.data).toHaveLength(2);
    expect(data.data[0].name).toBe('Test Destination 1');
    expect(data.data[1].name).toBe('Test Destination 2');
  });
  
  it('applies query parameters correctly', async () => {
    // Mock the implementation to track parameters
    const { getDestinationsWithCache } = require('../../lib/directus-client');
    
    // Create request with query parameters
    const request = createMockRequest({
      limit: '10',
      offset: '5',
      sortBy: 'name',
      sortDirection: 'asc',
      featured: 'true',
      popular: 'true',
      region: 'alps',
      country: 'Switzerland',
    });
    
    await GET(request);
    
    // Check that getDestinationsWithCache was called with the correct parameters
    expect(getDestinationsWithCache).toHaveBeenCalledWith(
      expect.objectContaining({
        limit: 10,
        offset: 5,
        sort: ['name'],
        filter: expect.objectContaining({
          status: { _eq: 'published' },
          is_featured: { _eq: true },
          region: { _eq: 'alps' },
          country: { _eq: 'Switzerland' },
        }),
      })
    );
  });
  
  it('handles error gracefully', async () => {
    // Mock implementation to throw error
    const { getDestinationsWithCache } = require('../../lib/directus-client');
    getDestinationsWithCache.mockRejectedValueOnce(new Error('Test error'));
    
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
    expect(headers['cache-control']).toContain('max-age=600');
  });
});