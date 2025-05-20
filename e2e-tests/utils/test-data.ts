/**
 * Test data utilities for E2E tests
 */

export interface TestHotel {
  id: string;
  name: string;
  slug: string;
  category: string;
  location: string;
  price: {
    min: number;
    currency: string;
  };
}

export interface TestDestination {
  id: string;
  name: string;
  slug: string;
  region: string;
  type: string;
  seasons: string[];
}

// Sample test hotels data
export const testHotels: TestHotel[] = [
  {
    id: 'hotel-1',
    name: 'Hotel Aurora',
    slug: 'hotel-aurora',
    category: 'Beach',
    location: 'Amalfi Coast',
    price: {
      min: 250,
      currency: 'EUR',
    },
  },
  {
    id: 'hotel-2',
    name: 'Hotel Schgaguler',
    slug: 'hotel-schgaguler',
    category: 'Mountain',
    location: 'South Tyrol',
    price: {
      min: 300,
      currency: 'EUR',
    },
  },
  {
    id: 'hotel-3',
    name: 'Hotel Giardino',
    slug: 'hotel-giardino',
    category: 'City',
    location: 'Rome',
    price: {
      min: 200,
      currency: 'EUR',
    },
  },
  {
    id: 'hotel-4',
    name: 'Hotel Rockresort',
    slug: 'hotel-rockresort',
    category: 'Mountain',
    location: 'Crans-Montana',
    price: {
      min: 350,
      currency: 'CHF',
    },
  },
];

// Sample test destinations data
export const testDestinations: TestDestination[] = [
  {
    id: 'destination-1',
    name: 'Amalfi Coast',
    slug: 'amalfi-coast',
    region: 'Italy',
    type: 'Beach',
    seasons: ['spring', 'summer', 'autumn'],
  },
  {
    id: 'destination-2',
    name: 'South Tyrol',
    slug: 'south-tyrol',
    region: 'Italy',
    type: 'Mountain',
    seasons: ['spring', 'summer', 'autumn', 'winter'],
  },
  {
    id: 'destination-3',
    name: 'Rome',
    slug: 'rome',
    region: 'Italy',
    type: 'City',
    seasons: ['spring', 'autumn', 'winter'],
  },
  {
    id: 'destination-4',
    name: 'Crans-Montana',
    slug: 'crans-montana',
    region: 'Switzerland',
    type: 'Mountain',
    seasons: ['summer', 'winter'],
  },
];

/**
 * Get a test hotel by name or slug
 */
export function getTestHotel(nameOrSlug: string): TestHotel | undefined {
  const normalizedInput = nameOrSlug.toLowerCase();
  return testHotels.find(
    hotel => hotel.name.toLowerCase() === normalizedInput || hotel.slug === normalizedInput
  );
}

/**
 * Get a test destination by name or slug
 */
export function getTestDestination(nameOrSlug: string): TestDestination | undefined {
  const normalizedInput = nameOrSlug.toLowerCase();
  return testDestinations.find(
    destination => destination.name.toLowerCase() === normalizedInput || destination.slug === normalizedInput
  );
}

/**
 * Get test hotels filtered by category
 */
export function getTestHotelsByCategory(category: string): TestHotel[] {
  return testHotels.filter(
    hotel => hotel.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get test destinations filtered by type
 */
export function getTestDestinationsByType(type: string): TestDestination[] {
  return testDestinations.filter(
    destination => destination.type.toLowerCase() === type.toLowerCase()
  );
}

/**
 * Get test destinations filtered by region
 */
export function getTestDestinationsByRegion(region: string): TestDestination[] {
  return testDestinations.filter(
    destination => destination.region.toLowerCase() === region.toLowerCase()
  );
}

/**
 * Get test destinations filtered by season
 */
export function getTestDestinationsBySeason(season: string): TestDestination[] {
  return testDestinations.filter(
    destination => destination.seasons.includes(season.toLowerCase())
  );
}

/**
 * Generate a random email for testing
 */
export function generateTestEmail(): string {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 10000);
  return `test-${timestamp}-${random}@example.com`;
}