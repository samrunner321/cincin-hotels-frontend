/**
 * Test utilities for destination API tests
 * 
 * This file contains helper functions for validating destination data structure
 * and performing destination-specific validation in tests.
 */
import { Destination } from '../../../lib/directus';

/**
 * Validate core destination structure
 * Checks that all required fields are present and have the correct types
 */
export function validateDestinationStructure(destination: Destination): boolean {
  // Check required fields
  return (
    typeof destination === 'object' &&
    destination !== null &&
    typeof destination.id === 'string' &&
    typeof destination.name === 'string' &&
    typeof destination.slug === 'string' &&
    typeof destination.country === 'string' &&
    typeof destination.short_description === 'string' &&
    typeof destination.description === 'string' &&
    ['published', 'draft', 'archived'].includes(destination.status)
  );
}

/**
 * Validate complete destination object with all relationships
 * Performs a deep validation of the destination object and its relationships
 */
export function validateCompleteDestination(destination: Destination): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check base structure
  if (!validateDestinationStructure(destination)) {
    errors.push('Destination is missing required fields or has invalid field types');
    return { valid: false, errors };
  }
  
  // Check coordinates if present
  if (destination.coordinates) {
    if (!validateCoordinates(destination.coordinates)) {
      errors.push('Destination coordinates have invalid format');
    }
  }
  
  // Check gallery if present
  if (destination.gallery) {
    if (!Array.isArray(destination.gallery)) {
      errors.push('Destination gallery is not an array');
    } else {
      destination.gallery.forEach((item, index) => {
        if (typeof item !== 'object' || !item.image) {
          errors.push(`Gallery item at index ${index} is invalid`);
        }
      });
    }
  }
  
  // Check highlights if present
  if (destination.highlights) {
    if (!Array.isArray(destination.highlights)) {
      errors.push('Destination highlights is not an array');
    } else {
      destination.highlights.forEach((highlight, index) => {
        if (!validateHighlight(highlight)) {
          errors.push(`Highlight at index ${index} is invalid`);
        }
      });
    }
  }
  
  // Check activities if present
  if (destination.activities) {
    if (!Array.isArray(destination.activities)) {
      errors.push('Destination activities is not an array');
    } else {
      destination.activities.forEach((activity, index) => {
        if (!validateActivity(activity)) {
          errors.push(`Activity at index ${index} is invalid`);
        }
      });
    }
  }
  
  // Check weather if present
  if (destination.weather) {
    if (!Array.isArray(destination.weather)) {
      errors.push('Destination weather is not an array');
    } else {
      destination.weather.forEach((weather, index) => {
        if (!validateWeather(weather)) {
          errors.push(`Weather at index ${index} is invalid`);
        }
      });
    }
  }
  
  // Check dining if present
  if (destination.dining) {
    if (!Array.isArray(destination.dining)) {
      errors.push('Destination dining is not an array');
    } else {
      destination.dining.forEach((dining, index) => {
        if (typeof dining !== 'object' || typeof dining.name !== 'string') {
          errors.push(`Dining at index ${index} is invalid`);
        }
        
        // Check dining coordinates if present
        if (dining.coordinates && !validateCoordinates(dining.coordinates)) {
          errors.push(`Dining at index ${index} has invalid coordinates`);
        }
      });
    }
  }
  
  // Check categories if present
  if (destination.categories) {
    if (!Array.isArray(destination.categories)) {
      errors.push('Destination categories is not an array');
    }
  }
  
  // Check hotels if present
  if (destination.hotels) {
    if (!Array.isArray(destination.hotels)) {
      errors.push('Destination hotels is not an array');
    } else {
      destination.hotels.forEach((hotel, index) => {
        if (typeof hotel !== 'object' || typeof hotel.id !== 'string' || typeof hotel.name !== 'string') {
          errors.push(`Hotel at index ${index} is invalid`);
        }
      });
    }
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate coordinates structure
 * Ensures coordinates have valid lat/lng values within valid ranges
 */
export function validateCoordinates(coordinates: any): boolean {
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
 * Validate highlight structure
 */
export function validateHighlight(highlight: any): boolean {
  return (
    typeof highlight === 'object' &&
    typeof highlight.title === 'string' &&
    (!highlight.description || typeof highlight.description === 'string')
  );
}

/**
 * Validate activity structure
 */
export function validateActivity(activity: any): boolean {
  return (
    typeof activity === 'object' &&
    typeof activity.title === 'string' &&
    ['spring', 'summer', 'autumn', 'winter', 'all'].includes(activity.season) &&
    (!activity.description || typeof activity.description === 'string')
  );
}

/**
 * Validate weather structure
 */
export function validateWeather(weather: any): boolean {
  return (
    typeof weather === 'object' &&
    ['spring', 'summer', 'autumn', 'winter'].includes(weather.season) &&
    typeof weather.temp_low === 'number' &&
    typeof weather.temp_high === 'number' &&
    (!weather.precipitation || typeof weather.precipitation === 'string') &&
    (!weather.description || typeof weather.description === 'string')
  );
}

/**
 * Validate if all seasons are represented in the weather data
 */
export function hasAllSeasons(destination: Destination): boolean {
  if (!destination.weather || !Array.isArray(destination.weather)) {
    return false;
  }
  
  const seasons = destination.weather.map(w => w.season);
  const requiredSeasons = ['spring', 'summer', 'autumn', 'winter'];
  
  return requiredSeasons.every(season => seasons.includes(season));
}

/**
 * Filter activities by season
 */
export function getActivitiesBySeason(destination: Destination, season: 'spring' | 'summer' | 'autumn' | 'winter' | 'all'): any[] {
  if (!destination.activities) return [];
  
  return destination.activities.filter(activity => 
    activity.season === season || activity.season === 'all'
  );
}

/**
 * Custom Jest matchers for destination testing
 */
export const destinationMatchers = {
  toBeValidDestination(received: Destination) {
    const result = validateDestinationStructure(received);
    return {
      message: () => 
        result 
          ? 'Expected destination to be invalid, but it is valid'
          : 'Expected destination to be valid, but it is missing required fields or has invalid types',
      pass: result
    };
  },
  
  toHaveValidCoordinates(received: Destination) {
    const result = received.coordinates && validateCoordinates(received.coordinates);
    return {
      message: () => 
        result 
          ? 'Expected destination not to have valid coordinates, but it does'
          : 'Expected destination to have valid coordinates, but it doesn\'t',
      pass: !!result
    };
  },
  
  toHaveActivitiesForSeason(received: Destination, season: 'spring' | 'summer' | 'autumn' | 'winter' | 'all') {
    const activities = getActivitiesBySeason(received, season);
    const result = activities.length > 0;
    
    return {
      message: () => 
        result 
          ? `Expected destination not to have activities for ${season} season, but it does`
          : `Expected destination to have activities for ${season} season, but it doesn't`,
      pass: result
    };
  },
  
  toHaveCategory(received: Destination, category: string) {
    const hasCategory = received.categories && 
                        Array.isArray(received.categories) && 
                        received.categories.includes(category);
    
    return {
      message: () => 
        hasCategory 
          ? `Expected destination not to have category "${category}", but it does`
          : `Expected destination to have category "${category}", but it doesn't`,
      pass: !!hasCategory
    };
  },
  
  toHaveAllSeasons(received: Destination) {
    const result = hasAllSeasons(received);
    
    return {
      message: () => 
        result 
          ? 'Expected destination not to have weather data for all seasons, but it does'
          : 'Expected destination to have weather data for all seasons, but it doesn\'t',
      pass: result
    };
  }
};

// Extend Jest's expect with custom matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidDestination(): R;
      toHaveValidCoordinates(): R;
      toHaveActivitiesForSeason(season: 'spring' | 'summer' | 'autumn' | 'winter' | 'all'): R;
      toHaveCategory(category: string): R;
      toHaveAllSeasons(): R;
    }
  }
}

/**
 * Helper function to extract response data and validate structure
 */
export async function getAndValidateDestinationResponse(
  response: Response
): Promise<{ destination: Destination; valid: boolean }> {
  const destination = await response.json() as Destination;
  const valid = validateDestinationStructure(destination);
  
  return { destination, valid };
}

/**
 * Helper to create a NextRequest instance for testing
 */
export function createNextRequest(path: string, params: Record<string, string> = {}): Request {
  const url = new URL(`http://localhost:3000${path}`);
  
  // Add query parameters
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  
  return new Request(url);
}

/**
 * Create params object for route handlers
 */
export function createRouteParams(slug: string) {
  return { params: { slug } };
}