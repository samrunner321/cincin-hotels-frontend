/**
 * Main MSW handlers file
 * 
 * This file combines all handlers for different API endpoints.
 */
import { hotelHandlers } from './hotel-handlers';
import { destinationHandlers } from './destination-handlers';

// Combine all handlers
export const handlers = [
  ...hotelHandlers,
  ...destinationHandlers,
  // Add other API handlers here
];

export default handlers;