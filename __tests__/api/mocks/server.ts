/**
 * MSW Server Setup
 * 
 * This file sets up the Mock Service Worker server for intercepting
 * API requests during testing.
 */
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Create an MSW server instance with our handlers
export const server = setupServer(...handlers);

// Setup lifecycle hooks for Jest
beforeAll(() => {
  // Enable API mocking before all tests
  console.log('🔶 Starting MSW server for API mocking');
  server.listen({ onUnhandledRequest: 'warn' });
});

afterEach(() => {
  // Reset handlers between tests
  server.resetHandlers();
});

afterAll(() => {
  // Disable API mocking after all tests
  console.log('🔶 Stopping MSW server');
  server.close();
});