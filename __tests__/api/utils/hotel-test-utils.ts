/**
 * Test utilities for hotel API tests
 * 
 * This file contains helper functions for validating hotel data structure
 * and comparing expected vs. actual results in tests.
 */
import { Hotel, Room, Destination, Category } from '../../../lib/directus';

/**
 * Validate core hotel structure
 * Checks that all required fields are present and have the correct types
 */
export function validateHotelStructure(hotel: Hotel): boolean {
  // Check required fields
  return (
    typeof hotel === 'object' &&
    hotel !== null &&
    typeof hotel.id === 'string' &&
    typeof hotel.name === 'string' &&
    typeof hotel.slug === 'string' &&
    typeof hotel.location === 'string' &&
    typeof hotel.short_description === 'string' &&
    typeof hotel.description === 'string' &&
    typeof hotel.price_from === 'number' &&
    typeof hotel.currency === 'string' &&
    ['published', 'draft', 'archived'].includes(hotel.status)
  );
}

/**
 * Validate complete hotel object with all relationships
 * Performs a deep validation of the hotel object and its relationships
 */
export function validateCompleteHotel(hotel: Hotel): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check base structure
  if (!validateHotelStructure(hotel)) {
    errors.push('Hotel is missing required fields or has invalid field types');
    return { valid: false, errors };
  }
  
  // Check coordinates if present
  if (hotel.coordinates) {
    if (typeof hotel.coordinates !== 'object' ||
        typeof hotel.coordinates.lat !== 'number' ||
        typeof hotel.coordinates.lng !== 'number') {
      errors.push('Hotel coordinates have invalid format');
    }
  }
  
  // Check gallery if present
  if (hotel.gallery) {
    if (!Array.isArray(hotel.gallery)) {
      errors.push('Hotel gallery is not an array');
    } else {
      hotel.gallery.forEach((item, index) => {
        if (typeof item !== 'object' || !item.image) {
          errors.push(`Gallery item at index ${index} is invalid`);
        }
      });
    }
  }
  
  // Check rooms if present
  if (hotel.rooms) {
    if (!Array.isArray(hotel.rooms)) {
      errors.push('Hotel rooms is not an array');
    } else {
      hotel.rooms.forEach((room, index) => {
        if (!validateRoomStructure(room)) {
          errors.push(`Room at index ${index} is invalid`);
        }
      });
    }
  }
  
  // Check features if present
  if (hotel.features) {
    if (!Array.isArray(hotel.features)) {
      errors.push('Hotel features is not an array');
    } else {
      hotel.features.forEach((feature, index) => {
        if (typeof feature !== 'object' || typeof feature.title !== 'string') {
          errors.push(`Feature at index ${index} is invalid`);
        }
      });
    }
  }
  
  // Check categories if present
  if (hotel.categories) {
    if (!Array.isArray(hotel.categories)) {
      errors.push('Hotel categories is not an array');
    }
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate room structure
 */
export function validateRoomStructure(room: Room): boolean {
  return (
    typeof room === 'object' &&
    room !== null &&
    typeof room.id === 'string' &&
    typeof room.name === 'string' &&
    typeof room.description === 'string' &&
    typeof room.size === 'string' &&
    typeof room.max_occupancy === 'number' &&
    typeof room.price_per_night === 'number' &&
    typeof room.currency === 'string' &&
    typeof room.hotel === 'string' || typeof room.hotel === 'object'
  );
}

/**
 * Compare hotels to expected results
 * Useful for testing filtering and sorting
 */
export function compareHotelResults(
  actualHotels: Hotel[], 
  expectedCondition: (hotel: Hotel) => boolean,
  message = 'Hotels do not match expected condition'
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!Array.isArray(actualHotels)) {
    errors.push('Actual hotels is not an array');
    return { valid: false, errors };
  }
  
  // Check if all hotels meet the condition
  const invalidHotels = actualHotels.filter(hotel => !expectedCondition(hotel));
  
  if (invalidHotels.length > 0) {
    errors.push(message);
    errors.push(`${invalidHotels.length} hotels did not meet the expected condition`);
    invalidHotels.forEach(hotel => {
      errors.push(`Hotel '${hotel.name}' (${hotel.id}) failed condition check`);
    });
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Helper function to validate sorting order
 */
export function validateSorting<T>(
  items: T[],
  getField: (item: T) => any,
  ascending = true
): boolean {
  if (items.length <= 1) return true;
  
  for (let i = 0; i < items.length - 1; i++) {
    const current = getField(items[i]);
    const next = getField(items[i + 1]);
    
    // Handling null/undefined values
    if (current === null || current === undefined) {
      if (ascending) continue; // null values should come first in ascending order
      if (next !== null && next !== undefined) return false;
    }
    
    if (next === null || next === undefined) {
      if (!ascending) continue; // null values should come last in descending order
      return false;
    }
    
    // Compare values based on sort direction
    if (ascending) {
      if (current > next) return false;
    } else {
      if (current < next) return false;
    }
  }
  
  return true;
}

/**
 * Create a custom matcher for hotel validation
 */
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
  
  toBeValidRoom(received: Room) {
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
  },
  
  toBeSortedBy<T>(received: T[], getField: (item: T) => any, ascending = true) {
    const result = validateSorting(received, getField, ascending);
    
    const direction = ascending ? 'ascending' : 'descending';
    
    return {
      message: () => 
        result 
          ? `Expected array not to be sorted in ${direction} order, but it is`
          : `Expected array to be sorted in ${direction} order, but it isn't`,
      pass: result
    };
  }
});

/**
 * Extends Jest's expect with custom matchers
 */
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidHotel(): R;
      toBeValidRoom(): R;
      toHaveCategory(category: string): R;
    }
    interface Expect {
      toBeSortedBy<T>(getField: (item: T) => any, ascending?: boolean): any;
    }
  }
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

/**
 * Helper function to extract response data and validate structure
 */
export async function getAndValidateResponse<T>(
  response: Response, 
  validator: (data: T) => boolean
): Promise<{ data: T; valid: boolean }> {
  const data = await response.json() as T;
  const valid = validator(data);
  
  return { data, valid };
}