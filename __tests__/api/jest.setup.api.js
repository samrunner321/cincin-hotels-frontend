/**
 * Setup-Datei für API-Integrationstests
 * Diese Datei wird vor jedem API-Test automatisch geladen
 */

import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';
import { afterAll, afterEach, beforeAll, jest } from '@jest/globals';

// Add TextEncoder and TextDecoder which is missing in the test environment
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
  global.TextDecoder = require('util').TextDecoder;
}

// Umgebungsvariablen für API-Tests setzen
process.env.NEXT_PUBLIC_DIRECTUS_URL = 'http://localhost:8055';
process.env.IS_MOCK_SERVER = 'true';
process.env.DIRECTUS_PUBLIC_TOKEN = 'test-public-token';
process.env.DIRECTUS_ADMIN_TOKEN = 'test-admin-token';
process.env.NODE_ENV = 'test';

// Globalen Timeout für Tests erhöhen (für Performance Tests)
jest.setTimeout(30000);

// MSW Server für API-Mocking einrichten
export const server = setupServer(...handlers);

// Server vor allen Tests starten
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });
  console.log('🔶 Mock-Server gestartet');
});

// Reset handlers nach jedem Test für einen sauberen Zustand
afterEach(() => {
  server.resetHandlers();
});

// Server nach allen Tests herunterfahren
afterAll(() => {
  server.close();
  console.log('🔶 Mock-Server beendet');
});

// Global fetch und Response Timeout-Einstellungen für Timeout-Tests
global.FETCH_TIMEOUT_MS = 2000;

// Error-Handler für unerwartete Promise-Rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('🔴 Unhandled Rejection in tests:', reason);
});

// Helfer-Funktionen für Performance-Messungen
global.measurePerformance = async (fn) => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  const duration = end - start;
  
  return { result, duration };
};

// Helfer für Response-Zeit-Validierung
global.validateResponseTime = (duration, maxDuration = 1000) => {
  expect(duration).toBeLessThanOrEqual(
    maxDuration,
    `API-Antwortzeit (${duration.toFixed(2)}ms) überschreitet erlaubte Zeit (${maxDuration}ms)`
  );
};

// Schema-Validierung mit Joi
global.validateSchema = (data, schema) => {
  const validation = schema.validate(data, { abortEarly: false });
  expect(validation.error).toBeFalsy();
  return validation;
};

// Konsolen-Mocks für saubere Testausgaben
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args) => {
  if (process.env.JEST_WORKER_ID === '1' || process.env.DEBUG === 'true') {
    originalConsoleError(...args);
  }
};

console.warn = (...args) => {
  if (process.env.JEST_WORKER_ID === '1' || process.env.DEBUG === 'true') {
    originalConsoleWarn(...args);
  }
};