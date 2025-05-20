/**
 * Tests für Destinations-API-Endpunkte
 * 
 * Diese Tests überprüfen alle Destinations-bezogenen API-Endpunkte:
 * - /api/destinations - Liste aller Destinations
 * - /api/destinations/[slug] - Einzelne Destination mit Details
 */

import { server } from './jest.setup.api';
import { rest } from 'msw';
import {
  testEndpointWithSchema,
  measureEndpointPerformance,
  mockServerError,
  mockTimeout,
  testConcurrentRequests,
  compareResponses
} from './utils/test-helpers';
import { destinationSchema, destinationsCollectionSchema, errorResponseSchema } from './utils/schemas';
import { mockDestinations } from './mocks/data/destinations';

describe('Destinations API Endpoints', () => {
  // Tests für /api/destinations Endpunkt
  describe('GET /api/destinations', () => {
    // Happy Path Tests
    test('sollte eine Liste von Destinations zurückgeben', async () => {
      const destinations = await testEndpointWithSchema('/api/destinations', destinationsCollectionSchema);
      
      // Basisprüfungen
      expect(Array.isArray(destinations)).toBe(true);
      expect(destinations.length).toBeGreaterThan(0);
      
      // Stichprobenartige Prüfung einiger erwarteter Destinations
      const destinationNames = destinations.map(destination => destination.name);
      expect(destinationNames).toContain('South Tyrol');
      expect(destinationNames).toContain('Lake Maggiore');
    });
    
    test('sollte Destinations mit Paginierung zurückgeben', async () => {
      // Erste Seite (2 Destinations)
      const firstPage = await testEndpointWithSchema('/api/destinations', destinationsCollectionSchema, {
        query: { limit: 2, offset: 0 }
      });
      
      expect(firstPage.length).toBe(2);
      
      // Zweite Seite (2 weitere Destinations, oder weniger falls nicht genug Daten)
      const secondPage = await testEndpointWithSchema('/api/destinations', destinationsCollectionSchema, {
        query: { limit: 2, offset: 2 }
      });
      
      expect(secondPage.length).toBeGreaterThan(0);
      
      // Überprüfen, dass die Seiten unterschiedliche Destinations enthalten
      const firstPageIds = firstPage.map(destination => destination.id);
      const secondPageIds = secondPage.map(destination => destination.id);
      
      firstPageIds.forEach(id => {
        expect(secondPageIds).not.toContain(id);
      });
    });
    
    test('sollte Destinations nach Status filtern', async () => {
      // Nur veröffentlichte Destinations
      const publishedDestinations = await testEndpointWithSchema('/api/destinations', destinationsCollectionSchema, {
        query: { filter: JSON.stringify({ status: { _eq: 'published' } }) }
      });
      
      // Überprüfen, dass alle zurückgegebenen Destinations veröffentlicht sind
      publishedDestinations.forEach(destination => {
        expect(destination.status).toBe('published');
      });
      
      // Zähle, wie viele veröffentlichte Destinations es in den Mockdaten gibt
      const mockPublishedDestinations = mockDestinations.filter(d => d.status === 'published');
      expect(publishedDestinations.length).toBe(mockPublishedDestinations.length);
    });
    
    test('sollte Destinations nach Region filtern', async () => {
      // Filter nach Region "alps"
      const alpDestinations = await testEndpointWithSchema('/api/destinations', destinationsCollectionSchema, {
        query: { filter: JSON.stringify({ region: { _eq: 'alps' } }) }
      });
      
      // Überprüfen, dass alle zurückgegebenen Destinations in der Region "alps" sind
      alpDestinations.forEach(destination => {
        expect(destination.region).toBe('alps');
      });
      
      // Zähle, wie viele Destinations in der Region "alps" in den Mockdaten sind
      const mockAlpDestinations = mockDestinations.filter(d => 
        d.region === 'alps' && d.status === 'published'
      );
      expect(alpDestinations.length).toBe(mockAlpDestinations.length);
    });
    
    test('sollte hervorgehobene Destinations filtern', async () => {
      // Filter nach hervorgehobenen Destinations
      const featuredDestinations = await testEndpointWithSchema('/api/destinations', destinationsCollectionSchema, {
        query: { filter: JSON.stringify({ is_featured: { _eq: true } }) }
      });
      
      // Überprüfen, dass alle zurückgegebenen Destinations hervorgehoben sind
      featuredDestinations.forEach(destination => {
        expect(destination.is_featured).toBe(true);
      });
      
      // Zähle, wie viele hervorgehobene Destinations in den Mockdaten sind
      const mockFeaturedDestinations = mockDestinations.filter(d => 
        d.is_featured === true && d.status === 'published'
      );
      expect(featuredDestinations.length).toBe(mockFeaturedDestinations.length);
    });
    
    test('sollte beliebte Destinations filtern', async () => {
      // Filter nach beliebten Destinations
      const popularDestinations = await testEndpointWithSchema('/api/destinations', destinationsCollectionSchema, {
        query: { filter: JSON.stringify({ is_popular: { _eq: true } }) }
      });
      
      // Überprüfen, dass alle zurückgegebenen Destinations beliebt sind
      popularDestinations.forEach(destination => {
        expect(destination.is_popular).toBe(true);
      });
      
      // Zähle, wie viele beliebte Destinations in den Mockdaten sind
      const mockPopularDestinations = mockDestinations.filter(d => 
        d.is_popular === true && d.status === 'published'
      );
      expect(popularDestinations.length).toBe(mockPopularDestinations.length);
    });
    
    // Fehlerszenarien
    test('sollte einen Serverfehler korrekt behandeln', async () => {
      // Mock einen Serverfehler für diesen Test
      mockServerError('http://localhost:3000/api/destinations');
      
      // Prüfen, ob der Fehler korrekt zurückgegeben wird
      const errorResponse = await testEndpointWithSchema('/api/destinations', errorResponseSchema, {
        expectedStatus: 500
      });
      
      expect(errorResponse).toHaveProperty('error');
    });
    
    // Performance Tests
    test('sollte innerhalb des Performance-Limits antworten', async () => {
      const { duration } = await measureEndpointPerformance('/api/destinations', 1000);
      
      // Zusätzliche Prüfung für Debug-Output
      console.log(`Response time for /api/destinations: ${duration.toFixed(2)}ms`);
    });
    
    test('sollte bei gleichzeitigen Anfragen konsistente Ergebnisse liefern', async () => {
      // 3 gleichzeitige Anfragen
      const responses = await testConcurrentRequests('/api/destinations', 3);
      
      // Überprüfe, dass alle Antworten identisch sind
      compareResponses(responses[0], responses[1]);
      compareResponses(responses[0], responses[2]);
    });
  });
  
  // Tests für /api/destinations/[slug] Endpunkt
  describe('GET /api/destinations/[slug]', () => {
    // Happy Path Tests
    test('sollte eine einzelne Destination nach Slug zurückgeben', async () => {
      const destinationSlug = 'south-tyrol';
      const destination = await testEndpointWithSchema(`/api/destinations/${destinationSlug}`, destinationSchema);
      
      expect(destination.slug).toBe(destinationSlug);
      expect(destination.name).toBe('South Tyrol');
      expect(destination).toHaveProperty('description');
      expect(destination).toHaveProperty('main_image');
    });
    
    test('sollte alle erwarteten Details für eine Destination enthalten', async () => {
      const destinationSlug = 'swiss-alps';
      const destination = await testEndpointWithSchema(`/api/destinations/${destinationSlug}`, destinationSchema);
      
      // Prüfe, ob alle wichtigen Felder vorhanden sind
      expect(destination).toHaveProperty('id');
      expect(destination).toHaveProperty('name');
      expect(destination).toHaveProperty('country');
      expect(destination).toHaveProperty('short_description');
      expect(destination).toHaveProperty('description');
      expect(destination).toHaveProperty('main_image');
      
      // Prüfe detaillierte Destinationsinformationen
      expect(destination).toHaveProperty('highlights');
      expect(destination).toHaveProperty('activities');
      expect(destination).toHaveProperty('dining');
      expect(destination).toHaveProperty('travel_info');
      expect(destination).toHaveProperty('weather');
    });
    
    // Fehlerszenarien
    test('sollte 404 zurückgeben, wenn Destination nicht gefunden wird', async () => {
      const nonExistentSlug = 'non-existent-destination';
      const errorResponse = await testEndpointWithSchema(`/api/destinations/${nonExistentSlug}`, errorResponseSchema, {
        expectedStatus: 404
      });
      
      expect(errorResponse).toHaveProperty('error');
      expect(errorResponse.error).toContain('not found');
    });
    
    test('sollte einen Serverfehler korrekt behandeln', async () => {
      const destinationSlug = 'lake-maggiore';
      
      // Mock einen Serverfehler für diesen Test
      mockServerError(`http://localhost:3000/api/destinations/${destinationSlug}`);
      
      // Prüfen, ob der Fehler korrekt zurückgegeben wird
      const errorResponse = await testEndpointWithSchema(`/api/destinations/${destinationSlug}`, errorResponseSchema, {
        expectedStatus: 500
      });
      
      expect(errorResponse).toHaveProperty('error');
    });
    
    // Performance Tests
    test('sollte innerhalb des Performance-Limits antworten', async () => {
      const destinationSlug = 'italian-riviera';
      const { duration } = await measureEndpointPerformance(`/api/destinations/${destinationSlug}`, 1000);
      
      // Zusätzliche Prüfung für Debug-Output
      console.log(`Response time for /api/destinations/${destinationSlug}: ${duration.toFixed(2)}ms`);
    });
  });
  
  // Tests für die Detailstruktur einer Destination
  describe('Destination Detail Structure', () => {
    test('sollte korrekte Aktivitätsstruktur haben', async () => {
      const destinationSlug = 'south-tyrol';
      const destination = await testEndpointWithSchema(`/api/destinations/${destinationSlug}`, destinationSchema);
      
      // Prüfe, ob Aktivitäten vorhanden sind
      expect(destination).toHaveProperty('activities');
      expect(Array.isArray(destination.activities)).toBe(true);
      
      if (destination.activities.length > 0) {
        const activity = destination.activities[0];
        expect(activity).toHaveProperty('title');
        expect(activity).toHaveProperty('season');
      }
    });
    
    test('sollte korrekte Wetterdatenstruktur haben', async () => {
      const destinationSlug = 'swiss-alps';
      const destination = await testEndpointWithSchema(`/api/destinations/${destinationSlug}`, destinationSchema);
      
      // Prüfe, ob Wetterdaten vorhanden sind
      expect(destination).toHaveProperty('weather');
      expect(Array.isArray(destination.weather)).toBe(true);
      
      if (destination.weather.length > 0) {
        const weatherData = destination.weather[0];
        expect(weatherData).toHaveProperty('season');
        expect(weatherData).toHaveProperty('temp_low');
        expect(weatherData).toHaveProperty('temp_high');
      }
    });
    
    test('sollte korrekte Reiseinformationsstruktur haben', async () => {
      const destinationSlug = 'lake-maggiore';
      const destination = await testEndpointWithSchema(`/api/destinations/${destinationSlug}`, destinationSchema);
      
      // Prüfe, ob Reiseinformationen vorhanden sind
      expect(destination).toHaveProperty('travel_info');
      expect(Array.isArray(destination.travel_info)).toBe(true);
      
      if (destination.travel_info.length > 0) {
        const travelInfo = destination.travel_info[0];
        expect(travelInfo).toHaveProperty('category');
        expect(travelInfo).toHaveProperty('title');
        expect(travelInfo).toHaveProperty('description');
      }
    });
  });
});