/**
 * Tests für Kategorien-API-Endpunkte
 * 
 * Diese Tests überprüfen den Kategorien-Endpunkt:
 * - /api/categories - Liste aller Kategorien
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
import { categoriesCollectionSchema, errorResponseSchema } from './utils/schemas';
import { mockCategories } from './mocks/data/categories';

describe('Categories API Endpoints', () => {
  // Tests für /api/categories Endpunkt
  describe('GET /api/categories', () => {
    // Happy Path Tests
    test('sollte eine Liste von Kategorien zurückgeben', async () => {
      const categories = await testEndpointWithSchema('/api/categories', categoriesCollectionSchema);
      
      // Basisprüfungen
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
      
      // Stichprobenartige Prüfung einiger erwarteter Kategorien
      const categoryNames = categories.map(category => category.name);
      expect(categoryNames).toContain('Luxury');
      expect(categoryNames).toContain('Beach');
      expect(categoryNames).toContain('Mountain');
    });
    
    test('sollte Kategorien nach Typ filtern (hotel)', async () => {
      const categories = await testEndpointWithSchema('/api/categories', categoriesCollectionSchema, {
        query: { type: 'hotel' }
      });
      
      // Überprüfen, dass alle zurückgegebenen Kategorien vom Typ "hotel" sind
      // Da wir den Typ "both" auch akzeptieren, müssen wir beide prüfen
      categories.forEach(category => {
        expect(['hotel', 'both']).toContain(category.type);
      });
      
      // Zähle, wie viele Kategorien vom Typ "hotel" oder "both" in den Mockdaten sind
      const mockHotelCategories = mockCategories.filter(c => 
        c.type === 'hotel' || c.type === 'both'
      );
      expect(categories.length).toBe(mockHotelCategories.length);
    });
    
    test('sollte Kategorien nach Typ filtern (destination)', async () => {
      const categories = await testEndpointWithSchema('/api/categories', categoriesCollectionSchema, {
        query: { type: 'destination' }
      });
      
      // Überprüfen, dass alle zurückgegebenen Kategorien vom Typ "destination" sind
      // Da wir den Typ "both" auch akzeptieren, müssen wir beide prüfen
      categories.forEach(category => {
        expect(['destination', 'both']).toContain(category.type);
      });
      
      // Zähle, wie viele Kategorien vom Typ "destination" oder "both" in den Mockdaten sind
      const mockDestinationCategories = mockCategories.filter(c => 
        c.type === 'destination' || c.type === 'both'
      );
      expect(categories.length).toBe(mockDestinationCategories.length);
    });
    
    test('sollte nur hervorgehobene Kategorien zurückgeben', async () => {
      const categories = await testEndpointWithSchema('/api/categories', categoriesCollectionSchema, {
        query: { featured: 'true' }
      });
      
      // Überprüfen, dass alle zurückgegebenen Kategorien als "featured" markiert sind
      categories.forEach(category => {
        expect(category.featured).toBe(true);
      });
      
      // Zähle, wie viele hervorgehobene Kategorien in den Mockdaten sind
      const mockFeaturedCategories = mockCategories.filter(c => c.featured === true);
      expect(categories.length).toBe(mockFeaturedCategories.length);
    });
    
    test('sollte Kategorien nach Typ und Featured-Status filtern', async () => {
      const categories = await testEndpointWithSchema('/api/categories', categoriesCollectionSchema, {
        query: { type: 'hotel', featured: 'true' }
      });
      
      // Überprüfen, dass alle zurückgegebenen Kategorien vom Typ "hotel" oder "both" sind
      // und als "featured" markiert sind
      categories.forEach(category => {
        expect(['hotel', 'both']).toContain(category.type);
        expect(category.featured).toBe(true);
      });
      
      // Zähle, wie viele hervorgehobene Kategorien vom Typ "hotel" oder "both" in den Mockdaten sind
      const mockFeaturedHotelCategories = mockCategories.filter(c => 
        (c.type === 'hotel' || c.type === 'both') && c.featured === true
      );
      expect(categories.length).toBe(mockFeaturedHotelCategories.length);
    });
    
    test('sollte Kategorien nach ihrer Sortierreihenfolge zurückgeben', async () => {
      const categories = await testEndpointWithSchema('/api/categories', categoriesCollectionSchema);
      
      // Überprüfen, dass die Kategorien nach ihrem "sort"-Feld sortiert sind
      const sortValues = categories.map(category => category.sort);
      
      // Die sortValues sollten in aufsteigender Reihenfolge sein
      const isSorted = sortValues.every((value, index, array) => {
        return index === 0 || value >= array[index - 1];
      });
      
      expect(isSorted).toBe(true);
    });
    
    // Fehlerszenarien
    test('sollte einen Serverfehler korrekt behandeln', async () => {
      // Mock einen Serverfehler für diesen Test
      mockServerError('http://localhost:3000/api/categories');
      
      // Prüfen, ob der Fehler korrekt zurückgegeben wird
      const errorResponse = await testEndpointWithSchema('/api/categories', errorResponseSchema, {
        expectedStatus: 500
      });
      
      expect(errorResponse).toHaveProperty('error');
    });
    
    // Performance Tests
    test('sollte innerhalb des Performance-Limits antworten', async () => {
      const { duration } = await measureEndpointPerformance('/api/categories', 500);
      
      // Kategorien sollten besonders schnell geladen werden, da es wenige sind
      // und sie oft gecached werden, daher ein strengeres Limit von 500ms
      
      // Zusätzliche Prüfung für Debug-Output
      console.log(`Response time for /api/categories: ${duration.toFixed(2)}ms`);
    });
    
    test('sollte bei gleichzeitigen Anfragen konsistente Ergebnisse liefern', async () => {
      // 3 gleichzeitige Anfragen
      const responses = await testConcurrentRequests('/api/categories', 3);
      
      // Überprüfe, dass alle Antworten identisch sind
      compareResponses(responses[0], responses[1]);
      compareResponses(responses[0], responses[2]);
    });
  });
  
  // Tests für Kategorie-Datenstruktur
  describe('Category Data Structure', () => {
    test('sollte alle erforderlichen Felder für jede Kategorie enthalten', async () => {
      const categories = await testEndpointWithSchema('/api/categories', categoriesCollectionSchema);
      
      // Prüfe, ob alle Kategorien die erforderlichen Felder haben
      categories.forEach(category => {
        expect(category).toHaveProperty('id');
        expect(category).toHaveProperty('name');
        expect(category).toHaveProperty('slug');
        expect(category).toHaveProperty('type');
      });
    });
    
    test('sollte für hervorgehobene Kategorien Bilder enthalten', async () => {
      const featuredCategories = await testEndpointWithSchema('/api/categories', categoriesCollectionSchema, {
        query: { featured: 'true' }
      });
      
      // Überprüfe, ob alle hervorgehobenen Kategorien Bilder haben
      featuredCategories.forEach(category => {
        expect(category).toHaveProperty('image');
        expect(category.image).not.toBeNull();
      });
    });
    
    test('sollte konsistente Slug-Werte haben, die der Namenskonvention entsprechen', async () => {
      const categories = await testEndpointWithSchema('/api/categories', categoriesCollectionSchema);
      
      // Überprüfe, ob alle Slugs der Konvention entsprechen (kleinbuchstaben, nur Buchstaben und Bindestriche)
      categories.forEach(category => {
        const slug = category.slug;
        const name = category.name;
        
        // Slug sollte nur Kleinbuchstaben, Zahlen und Bindestriche enthalten
        expect(slug).toMatch(/^[a-z0-9-]+$/);
        
        // Slug sollte keine aufeinanderfolgenden Bindestriche enthalten
        expect(slug).not.toMatch(/--/);
        
        // Slug sollte mit dem Namen in Beziehung stehen
        // (Dies ist eine einfache Heuristik, kann aber in komplexeren Fällen fehlschlagen)
        const normalizedName = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        expect(slug).toContain(normalizedName) || expect(normalizedName).toContain(slug);
      });
    });
  });
});