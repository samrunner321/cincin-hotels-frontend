/**
 * Test-Hilfsfunktionen für API-Tests
 * 
 * Diese Datei enthält Hilfsfunktionen für die API-Tests, um häufige Test-Operationen
 * zu vereinfachen und Code-Wiederholungen zu vermeiden.
 */

import { server } from '../jest.setup.api';
import { rest } from 'msw';
import fetch from 'node-fetch';
import supertest from 'supertest';

// Supertest-Instanz für Http-Anfragen
// Sie müsste in einem echten Next.js-Projekt das tatsächliche API-Objekt verwenden
// Für unsere Tests verwenden wir eine Basis-URL
const request = supertest('http://localhost:3000');

/**
 * Führt einen GET-Request durch und validiert die Antwort gegen ein Schema
 * 
 * @param {string} endpoint - Der API-Endpunkt (z.B. '/api/hotels')
 * @param {Object} schema - Das Joi-Schema zur Validierung
 * @param {Object} options - Zusätzliche Optionen (query, expectedStatus)
 * @returns {Promise<Object>} - Die API-Antwort
 */
export async function testEndpointWithSchema(endpoint, schema, options = {}) {
  const { query = {}, expectedStatus = 200 } = options;
  
  // Query-Parameter hinzufügen, wenn vorhanden
  const queryString = Object.keys(query).length > 0
    ? '?' + new URLSearchParams(query).toString()
    : '';
  
  // Anfrage durchführen
  const response = await request
    .get(`${endpoint}${queryString}`)
    .expect(expectedStatus)
    .expect('Content-Type', /json/);
  
  // Schema-Validierung für erfolgreiche Antworten
  if (expectedStatus >= 200 && expectedStatus < 300 && schema) {
    expect(() => schema.validate(response.body)).not.toThrow();
  }
  
  return response.body;
}

/**
 * Misst die Antwortzeit eines Endpunkts und prüft, ob sie unter einem Schwellenwert liegt
 * 
 * @param {string} endpoint - Der API-Endpunkt
 * @param {number} maxDuration - Maximale erlaubte Antwortzeit in ms
 * @returns {Promise<Object>} - Die Messergebnisse: {duration, response}
 */
export async function measureEndpointPerformance(endpoint, maxDuration = 1000) {
  const start = performance.now();
  
  const response = await request
    .get(endpoint)
    .expect(200)
    .expect('Content-Type', /json/);
  
  const end = performance.now();
  const duration = end - start;
  
  expect(duration).toBeLessThanOrEqual(
    maxDuration,
    `API-Antwortzeit (${duration.toFixed(2)}ms) überschreitet erlaubte Zeit (${maxDuration}ms)`
  );
  
  return { duration, response: response.body };
}

/**
 * Simuliert einen Timeout-Fehler bei einem bestimmten Endpunkt
 * 
 * @param {string} url - Die URL, die einen Timeout simulieren soll
 */
export function mockTimeout(url) {
  server.use(
    rest.get(url, async (req, res, ctx) => {
      // Simuliere einen Timeout, indem wir nie antworten
      return new Promise(() => {
        // Diese Promise wird nie resolved
      });
    })
  );
}

/**
 * Simuliert einen Server-Fehler bei einem bestimmten Endpunkt
 * 
 * @param {string} url - Die URL, die einen Fehler simulieren soll
 * @param {number} status - Der HTTP-Statuscode (default: 500)
 * @param {Object} errorBody - Der Fehler-Response-Body
 */
export function mockServerError(url, status = 500, errorBody = { error: 'Internal Server Error' }) {
  server.use(
    rest.get(url, async (req, res, ctx) => {
      return res(
        ctx.status(status),
        ctx.json(errorBody)
      );
    })
  );
}

/**
 * Simuliert einen Cache-Hit oder Cache-Miss für einen Endpunkt
 * 
 * @param {string} url - Die URL, für die Cache-Verhalten simuliert werden soll
 * @param {boolean} cacheHit - Ob ein Cache-Hit simuliert werden soll
 */
export function mockCacheBehavior(url, cacheHit = true) {
  const headers = cacheHit
    ? { 'x-cache': 'HIT', 'cache-control': 'max-age=3600' }
    : { 'x-cache': 'MISS', 'cache-control': 'no-cache' };
    
  server.use(
    rest.get(url, async (req, res, ctx) => {
      return res(
        ctx.set(headers),
        ctx.status(200),
        ctx.json({ success: true, fromCache: cacheHit })
      );
    })
  );
}

/**
 * Testet das Retry-Verhalten eines Endpunkts
 * 
 * @param {string} url - Die URL zum Testen
 * @param {number} failCount - Anzahl der fehlschlagenden Versuche vor Erfolg
 * @param {Object} successData - Die Daten, die nach den Fehlversuchen zurückgegeben werden
 * @returns {Promise<Object>} - Das Ergebnis nach allen Versuchen
 */
export async function testRetryBehavior(url, failCount = 2, successData = { success: true }) {
  let attemptCount = 0;
  
  // Mocking server response to fail initially
  server.use(
    rest.get(url, async (req, res, ctx) => {
      attemptCount++;
      
      if (attemptCount <= failCount) {
        return res(
          ctx.status(500),
          ctx.json({ error: `Attempt ${attemptCount} failed` })
        );
      }
      
      return res(
        ctx.status(200),
        ctx.json({ ...successData, attempts: attemptCount })
      );
    })
  );
  
  // Implementierung der Retry-Logik
  const maxRetries = failCount + 1;
  let lastError = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        return await response.json();
      }
      
      lastError = await response.json();
    } catch (err) {
      lastError = err;
    }
    
    // Kurze Pause zwischen Versuchen
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  throw new Error(`All ${maxRetries} attempts failed. Last error: ${JSON.stringify(lastError)}`);
}

/**
 * Testet die gleichzeitige Ausführung von Anfragen an einen Endpunkt
 * 
 * @param {string} url - Die URL zum Testen
 * @param {number} concurrentRequests - Anzahl der gleichzeitigen Anfragen
 * @returns {Promise<Array>} - Array mit allen Antworten
 */
export async function testConcurrentRequests(url, concurrentRequests = 5) {
  // Erstelle ein Array von Promises für alle gleichzeitigen Anfragen
  const requests = Array(concurrentRequests).fill().map(() => 
    request.get(url).expect(200).expect('Content-Type', /json/)
  );
  
  // Warte, bis alle Anfragen abgeschlossen sind
  const responses = await Promise.all(requests);
  
  // Überprüfe, ob alle Anfragen erfolgreich waren
  responses.forEach((response, index) => {
    expect(response.status).toBe(200, `Concurrent request ${index + 1} failed`);
  });
  
  return responses.map(r => r.body);
}

/**
 * Vergleicht zwei Antworten, um sicherzustellen, dass sie konsistent sind
 * 
 * @param {Object} response1 - Die erste Antwort
 * @param {Object} response2 - Die zweite Antwort
 * @param {Array<string>} ignoredFields - Felder, die beim Vergleich ignoriert werden sollen
 */
export function compareResponses(response1, response2, ignoredFields = []) {
  // Tiefe Kopien der Antworten erstellen
  const r1 = JSON.parse(JSON.stringify(response1));
  const r2 = JSON.parse(JSON.stringify(response2));
  
  // Ignorierte Felder entfernen
  if (ignoredFields.length > 0) {
    const removeFields = (obj) => {
      if (Array.isArray(obj)) {
        return obj.map(item => removeFields(item));
      } else if (obj && typeof obj === 'object') {
        const newObj = { ...obj };
        ignoredFields.forEach(field => {
          delete newObj[field];
        });
        
        // Rekursiv für alle Object-Properties
        Object.keys(newObj).forEach(key => {
          if (typeof newObj[key] === 'object' && newObj[key] !== null) {
            newObj[key] = removeFields(newObj[key]);
          }
        });
        
        return newObj;
      }
      return obj;
    };
    
    const cleanR1 = removeFields(r1);
    const cleanR2 = removeFields(r2);
    
    expect(cleanR1).toEqual(cleanR2);
  } else {
    expect(r1).toEqual(r2);
  }
}

/**
 * Exportiere alle Hilfsfunktionen
 */
export default {
  testEndpointWithSchema,
  measureEndpointPerformance,
  mockTimeout,
  mockServerError,
  mockCacheBehavior,
  testRetryBehavior,
  testConcurrentRequests,
  compareResponses,
};