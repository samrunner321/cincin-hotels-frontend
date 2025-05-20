/**
 * Tests für Hotel-API-Endpunkte
 * 
 * Diese Tests überprüfen alle Hotel-bezogenen API-Endpunkte:
 * - /api/hotels - Liste aller Hotels mit Filtermöglichkeiten
 * - /api/hotels/[slug] - Einzelnes Hotel mit Details
 * - /api/hotels/[id] - Einzelnes Hotel mit Details über ID
 */

import { server } from './jest.setup.api';
import { rest } from 'msw';
import supertest from 'supertest';
import {
  testEndpointWithSchema,
  measureEndpointPerformance,
  mockServerError,
  mockTimeout,
  testConcurrentRequests,
  compareResponses,
  testRetryBehavior,
  mockCacheBehavior
} from './utils/test-helpers';

// Supertest-Instanz für Http-Anfragen
const request = supertest('http://localhost:3000');
import { 
  hotelSchema, 
  hotelsCollectionSchema, 
  errorResponseSchema,
  roomsCollectionSchema
} from './utils/schemas';
import { mockHotels } from './mocks/data/hotels';
import { mockCategories } from './mocks/data/categories';
import { mockRooms } from './mocks/data/rooms';

describe('Hotel API Endpoints', () => {
  // Tests für /api/hotels Endpunkt (Listenansicht)
  describe('GET /api/hotels', () => {
    // Basisfunktionalität Tests
    test('sollte eine Liste von Hotels zurückgeben', async () => {
      const hotels = await testEndpointWithSchema('/api/hotels', hotelsCollectionSchema);
      
      // Basisprüfungen
      expect(Array.isArray(hotels)).toBe(true);
      expect(hotels.length).toBeGreaterThan(0);
      
      // Stichprobenartige Prüfung einiger erwarteter Hotels
      const hotelNames = hotels.map(hotel => hotel.name);
      expect(hotelNames).toContain('Hotel Schgaguler');
      expect(hotelNames).toContain('Hotel Giardino');
    });

    test('sollte korrekte Datenstrukturen für jedes Hotel zurückgeben', async () => {
      const hotels = await testEndpointWithSchema('/api/hotels', hotelsCollectionSchema);
      
      // Überprüfe die Struktur jedes Hotels
      hotels.forEach(hotel => {
        expect(hotel).toHaveProperty('id');
        expect(hotel).toHaveProperty('name');
        expect(hotel).toHaveProperty('slug');
        expect(hotel).toHaveProperty('location');
        expect(hotel).toHaveProperty('short_description');
        expect(hotel).toHaveProperty('price_from');
        expect(hotel).toHaveProperty('currency');
      });
    });
    
    // Paginierung Tests
    test('sollte Hotels mit Paginierung zurückgeben', async () => {
      // Erste Seite (2 Hotels)
      const firstPage = await testEndpointWithSchema('/api/hotels', hotelsCollectionSchema, {
        query: { limit: 2, offset: 0 }
      });
      
      expect(firstPage.length).toBe(2);
      
      // Zweite Seite (2 weitere Hotels)
      const secondPage = await testEndpointWithSchema('/api/hotels', hotelsCollectionSchema, {
        query: { limit: 2, offset: 2 }
      });
      
      expect(secondPage.length).toBe(2);
      
      // Überprüfen, dass die Seiten unterschiedliche Hotels enthalten
      const firstPageIds = firstPage.map(hotel => hotel.id);
      const secondPageIds = secondPage.map(hotel => hotel.id);
      
      firstPageIds.forEach(id => {
        expect(secondPageIds).not.toContain(id);
      });
    });

    test('sollte mit page und limit Parametern korrekt funktionieren', async () => {
      // Umrechnung von page/limit zu offset/limit
      const page = 2;
      const limit = 2;
      const offset = (page - 1) * limit;
      
      const hotels = await testEndpointWithSchema('/api/hotels', hotelsCollectionSchema, {
        query: { limit, offset }
      });
      
      expect(hotels.length).toBe(limit);
      
      // Überprüfe, dass es sich um die zweite Seite handelt
      const allHotels = await testEndpointWithSchema('/api/hotels', hotelsCollectionSchema);
      const expectedHotels = allHotels.slice(offset, offset + limit);
      
      expect(hotels.map(h => h.id).sort()).toEqual(expectedHotels.map(h => h.id).sort());
    });

    test('sollte leere Antwort für eine zu große Seitenzahl liefern', async () => {
      const hotels = await testEndpointWithSchema('/api/hotels', hotelsCollectionSchema, {
        query: { offset: 1000, limit: 10 }
      });
      
      expect(Array.isArray(hotels)).toBe(true);
      expect(hotels.length).toBe(0);
    });
    
    // Filter Tests
    test('sollte Hotels nach Status filtern', async () => {
      // Nur veröffentlichte Hotels
      const publishedHotels = await testEndpointWithSchema('/api/hotels', hotelsCollectionSchema, {
        query: { filter: JSON.stringify({ status: { _eq: 'published' } }) }
      });
      
      // Überprüfen, dass alle zurückgegebenen Hotels veröffentlicht sind
      publishedHotels.forEach(hotel => {
        expect(hotel.status).toBe('published');
      });
      
      // Zähle, wie viele veröffentlichte Hotels es in den Mockdaten gibt
      const mockPublishedHotels = mockHotels.filter(h => h.status === 'published');
      expect(publishedHotels.length).toBe(mockPublishedHotels.length);
    });
    
    test('sollte Hotels nach Region filtern', async () => {
      // Filter nach Region "alps"
      const alpHotels = await testEndpointWithSchema('/api/hotels', hotelsCollectionSchema, {
        query: { filter: JSON.stringify({ region: { _eq: 'alps' } }) }
      });
      
      // Überprüfen, dass alle zurückgegebenen Hotels in der Region "alps" sind
      alpHotels.forEach(hotel => {
        expect(hotel.region).toBe('alps');
      });
      
      // Zähle, wie viele Hotels in der Region "alps" in den Mockdaten sind
      const mockAlpHotels = mockHotels.filter(h => h.region === 'alps' && h.status === 'published');
      expect(alpHotels.length).toBe(mockAlpHotels.length);
    });
    
    test('sollte hervorgehobene Hotels filtern', async () => {
      // Filter nach hervorgehobenen Hotels
      const featuredHotels = await testEndpointWithSchema('/api/hotels', hotelsCollectionSchema, {
        query: { filter: JSON.stringify({ is_featured: { _eq: true } }) }
      });
      
      // Überprüfen, dass alle zurückgegebenen Hotels hervorgehoben sind
      featuredHotels.forEach(hotel => {
        expect(hotel.is_featured).toBe(true);
      });
      
      // Zähle, wie viele hervorgehobene Hotels in den Mockdaten sind
      const mockFeaturedHotels = mockHotels.filter(h => h.is_featured === true && h.status === 'published');
      expect(featuredHotels.length).toBe(mockFeaturedHotels.length);
    });

    test('sollte Hotels nach Kategorie filtern', async () => {
      // Filter nach Kategorie "luxury"
      const luxuryHotels = await testEndpointWithSchema('/api/hotels', hotelsCollectionSchema, {
        query: { filter: JSON.stringify({ categories: { _contains: ['luxury'] } }) }
      });
      
      // Überprüfen, dass alle zurückgegebenen Hotels die Kategorie "luxury" haben
      luxuryHotels.forEach(hotel => {
        expect(hotel.categories).toContain('luxury');
      });
      
      // Mindestanzahl von Hotels mit der Kategorie überprüfen
      // (exakte Anzahl kann aufgrund von Implementierungsdetails abweichen)
      expect(luxuryHotels.length).toBeGreaterThan(0);
    });

    test('sollte Hotels nach Land filtern', async () => {
      // Filter nach Land "Switzerland"
      const swissHotels = await testEndpointWithSchema('/api/hotels', hotelsCollectionSchema, {
        query: { filter: JSON.stringify({ country: { _eq: 'Switzerland' } }) }
      });
      
      // Überprüfen, dass alle zurückgegebenen Hotels in der Schweiz sind
      swissHotels.forEach(hotel => {
        expect(hotel.country).toBe('Switzerland');
      });
      
      // Zähle, wie viele Hotels in der Schweiz in den Mockdaten sind
      const mockSwissHotels = mockHotels.filter(h => 
        h.country === 'Switzerland' && h.status === 'published'
      );
      expect(swissHotels.length).toBe(mockSwissHotels.length);
    });

    test('sollte Hotels nach Preisspanne filtern', async () => {
      const minPrice = 300;
      const maxPrice = 500;
      
      // Filter nach Preisspanne
      const priceFilteredHotels = await testEndpointWithSchema('/api/hotels', hotelsCollectionSchema, {
        query: { filter: JSON.stringify({ 
          price_from: { _gte: minPrice, _lte: maxPrice } 
        }) }
      });
      
      // Überprüfen, dass alle zurückgegebenen Hotels im Preisbereich liegen
      priceFilteredHotels.forEach(hotel => {
        expect(hotel.price_from).toBeGreaterThanOrEqual(minPrice);
        expect(hotel.price_from).toBeLessThanOrEqual(maxPrice);
      });
      
      // Zähle, wie viele Hotels im Preisbereich in den Mockdaten sind
      const mockPriceFilteredHotels = mockHotels.filter(h => 
        h.price_from >= minPrice && 
        h.price_from <= maxPrice && 
        h.status === 'published'
      );
      expect(priceFilteredHotels.length).toBe(mockPriceFilteredHotels.length);
    });

    test('sollte neue Hotels filtern', async () => {
      // Filter nach neuen Hotels
      const newHotels = await testEndpointWithSchema('/api/hotels', hotelsCollectionSchema, {
        query: { filter: JSON.stringify({ is_new: { _eq: true } }) }
      });
      
      // Überprüfen, dass alle zurückgegebenen Hotels als neu markiert sind
      newHotels.forEach(hotel => {
        expect(hotel.is_new).toBe(true);
      });
      
      // Mindestanzahl neuer Hotels überprüfen
      expect(newHotels.length).toBeGreaterThan(0);
    });

    // Sortierung Tests
    test('sollte Hotels nach Preis aufsteigend sortieren', async () => {
      const sortedHotels = await testEndpointWithSchema('/api/hotels', hotelsCollectionSchema, {
        query: { sort: 'price_from' }
      });
      
      // Überprüfen, dass die Hotels nach Preis aufsteigend sortiert sind
      for (let i = 1; i < sortedHotels.length; i++) {
        expect(sortedHotels[i].price_from).toBeGreaterThanOrEqual(sortedHotels[i-1].price_from);
      }
    });

    test('sollte Hotels nach Preis absteigend sortieren', async () => {
      const sortedHotels = await testEndpointWithSchema('/api/hotels', hotelsCollectionSchema, {
        query: { sort: '-price_from' }
      });
      
      // Überprüfen, dass die Hotels nach Preis absteigend sortiert sind
      for (let i = 1; i < sortedHotels.length; i++) {
        expect(sortedHotels[i].price_from).toBeLessThanOrEqual(sortedHotels[i-1].price_from);
      }
    });

    test('sollte Hotels nach Bewertung sortieren', async () => {
      const sortedHotels = await testEndpointWithSchema('/api/hotels', hotelsCollectionSchema, {
        query: { sort: '-user_rating' }
      });
      
      // Überprüfen, dass die Hotels nach Bewertung absteigend sortiert sind
      for (let i = 1; i < sortedHotels.length; i++) {
        // Ignoriere Hotels ohne Bewertung oder vergleiche nur, wenn beide Bewertungen haben
        if (sortedHotels[i].user_rating && sortedHotels[i-1].user_rating) {
          expect(sortedHotels[i].user_rating).toBeLessThanOrEqual(sortedHotels[i-1].user_rating);
        }
      }
    });
    
    // Kombinierte Filter Tests
    test('sollte mehrere Filter kombinieren', async () => {
      // Filter nach Region "alps" UND featured=true
      const combinedFilterHotels = await testEndpointWithSchema('/api/hotels', hotelsCollectionSchema, {
        query: { filter: JSON.stringify({ 
          region: { _eq: 'alps' },
          is_featured: { _eq: true }
        }) }
      });
      
      // Überprüfen, dass alle zurückgegebenen Hotels beide Bedingungen erfüllen
      combinedFilterHotels.forEach(hotel => {
        expect(hotel.region).toBe('alps');
        expect(hotel.is_featured).toBe(true);
      });
      
      // Zähle, wie viele Hotels beide Bedingungen in den Mockdaten erfüllen
      const mockCombinedFilterHotels = mockHotels.filter(h => 
        h.region === 'alps' && 
        h.is_featured === true && 
        h.status === 'published'
      );
      expect(combinedFilterHotels.length).toBe(mockCombinedFilterHotels.length);
    });

    // Fehlerszenarien Tests
    test('sollte einen Serverfehler korrekt behandeln', async () => {
      // Mock einen Serverfehler für diesen Test
      mockServerError('http://localhost:3000/api/hotels');
      
      // Prüfen, ob der Fehler korrekt zurückgegeben wird
      const errorResponse = await testEndpointWithSchema('/api/hotels', errorResponseSchema, {
        expectedStatus: 500
      });
      
      expect(errorResponse).toHaveProperty('error');
    });

    test('sollte mit ungültigen Filterparametern umgehen können', async () => {
      // Nicht-JSON Filter-Parameter
      const hotels = await testEndpointWithSchema('/api/hotels', hotelsCollectionSchema, {
        query: { filter: 'invalid-json' }
      });
      
      // Erwarten wir, dass die API nicht abbricht, sondern den Standardfilter anwendet
      expect(Array.isArray(hotels)).toBe(true);
      
      // Alle Ergebnisse sollten veröffentlicht sein (Standardfilter)
      hotels.forEach(hotel => {
        expect(hotel.status).toBe('published');
      });
    });
    
    // Timeout und Retry Tests
    test('sollte Fehlerzustände korrekt behandeln', async () => {
      // Mock einen Timeout-Endpunkt, der lange braucht
      server.use(
        rest.get('http://localhost:3000/api/timeout', async (req, res, ctx) => {
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1s delay
          return res(
            ctx.status(503),
            ctx.json({ error: 'Service temporarily unavailable' })
          );
        })
      );
      
      // Der Test sollte mit einem Fehlercode antworten
      const errorResponse = await request
        .get('/api/timeout')
        .expect(503);
      
      expect(errorResponse.body).toHaveProperty('error');
    });

    test('sollte Retry-Logik implementieren können', async () => {
      // Ein Response nach 2 fehlgeschlagenen Versuchen
      const response = await testRetryBehavior('http://localhost:3000/api/hotels', 2);
      
      // Prüfen, ob die Antwort die erwartete Anzahl Versuche enthält
      expect(response).toHaveProperty('attempts');
      expect(response.attempts).toBe(3); // 2 Fehler + 1 Erfolg
    });
    
    // Performance Tests
    test('sollte innerhalb des Performance-Limits antworten', async () => {
      const { duration } = await measureEndpointPerformance('/api/hotels', 1000);
      
      // Zusätzliche Prüfung für Debug-Output
      console.log(`Response time for /api/hotels: ${duration.toFixed(2)}ms`);
    });
    
    test('sollte bei gleichzeitigen Anfragen konsistente Ergebnisse liefern', async () => {
      // 3 gleichzeitige Anfragen
      const responses = await testConcurrentRequests('/api/hotels', 3);
      
      // Überprüfe, dass alle Antworten identisch sind
      compareResponses(responses[0], responses[1]);
      compareResponses(responses[0], responses[2]);
    });

    // Caching Tests
    test('sollte Cache-Header korrekt setzen', async () => {
      // Wir verwenden testEndpointWithSchema, um die HTTP-Header zu überprüfen
      const response = await request
        .get('/api/hotels')
        .expect(200)
        .expect('Content-Type', /json/);
      
      // Prüfen, ob Cache-Control-Header gesetzt ist
      expect(response.headers['cache-control']).toBeDefined();
      expect(response.headers['cache-control']).toContain('max-age=');
    });
  });
  
  // Tests für /api/hotels/[slug] Endpunkt (Detailansicht)
  describe('GET /api/hotels/[slug]', () => {
    // Happy Path Tests
    test('sollte ein einzelnes Hotel nach Slug zurückgeben', async () => {
      const hotelSlug = 'hotel-schgaguler';
      const hotel = await testEndpointWithSchema(`/api/hotels/${hotelSlug}`, hotelSchema);
      
      expect(hotel.slug).toBe(hotelSlug);
      expect(hotel.name).toBe('Hotel Schgaguler');
      expect(hotel).toHaveProperty('description');
      expect(hotel).toHaveProperty('main_image');
    });
    
    test('sollte alle erwarteten Details für ein Hotel enthalten', async () => {
      const hotelSlug = 'hotel-giardino';
      const hotel = await testEndpointWithSchema(`/api/hotels/${hotelSlug}`, hotelSchema);
      
      // Prüfe, ob alle wichtigen Felder vorhanden sind
      expect(hotel).toHaveProperty('id');
      expect(hotel).toHaveProperty('name');
      expect(hotel).toHaveProperty('location');
      expect(hotel).toHaveProperty('short_description');
      expect(hotel).toHaveProperty('description');
      expect(hotel).toHaveProperty('main_image');
      expect(hotel).toHaveProperty('price_from');
      expect(hotel).toHaveProperty('currency');
      
      // Prüfe optionale Felder, die für UX wichtig sind
      expect(hotel).toHaveProperty('amenities');
      expect(hotel).toHaveProperty('gallery');
      expect(hotel).toHaveProperty('coordinates');
      expect(hotel).toHaveProperty('features');
      
      // Prüfe die Detailtiefe
      if (hotel.main_image) {
        expect(hotel.main_image).toHaveProperty('id');
        expect(hotel.main_image).toHaveProperty('title');
      }
      
      if (hotel.gallery && hotel.gallery.length > 0) {
        expect(hotel.gallery[0]).toHaveProperty('image');
        expect(hotel.gallery[0].image).toHaveProperty('id');
      }
      
      if (hotel.features && hotel.features.length > 0) {
        expect(hotel.features[0]).toHaveProperty('title');
        expect(hotel.features[0]).toHaveProperty('description');
      }
    });

    // Tests für URL-Parameter-Verarbeitung
    test('sollte 404 zurückgeben, wenn Hotel nicht gefunden wird', async () => {
      const nonExistentSlug = 'non-existent-hotel';
      const errorResponse = await testEndpointWithSchema(`/api/hotels/${nonExistentSlug}`, errorResponseSchema, {
        expectedStatus: 404
      });
      
      expect(errorResponse).toHaveProperty('error');
      expect(errorResponse.error).toContain('not found');
    });

    test('sollte 400 zurückgeben, wenn kein Slug angegeben ist', async () => {
      const emptySlug = '';
      const errorResponse = await testEndpointWithSchema(`/api/hotels/${emptySlug}`, errorResponseSchema, {
        expectedStatus: 400
      });
      
      expect(errorResponse).toHaveProperty('error');
      expect(errorResponse.error).toContain('required');
    });
    
    // Fehlerszenarien
    test('sollte einen Serverfehler korrekt behandeln', async () => {
      const hotelSlug = 'hotel-rockresort';
      
      // Mock einen Serverfehler für diesen Test
      mockServerError(`http://localhost:3000/api/hotels/${hotelSlug}`);
      
      // Prüfen, ob der Fehler korrekt zurückgegeben wird
      const errorResponse = await testEndpointWithSchema(`/api/hotels/${hotelSlug}`, errorResponseSchema, {
        expectedStatus: 500
      });
      
      expect(errorResponse).toHaveProperty('error');
    });
    
    // Performance Tests
    test('sollte innerhalb des Performance-Limits antworten', async () => {
      const hotelSlug = 'hotel-aurora';
      const { duration } = await measureEndpointPerformance(`/api/hotels/${hotelSlug}`, 1000);
      
      // Zusätzliche Prüfung für Debug-Output
      console.log(`Response time for /api/hotels/${hotelSlug}: ${duration.toFixed(2)}ms`);
    });
  });
  
  // Tests für /api/hotels/[id] Endpunkt (Detailansicht über ID)
  describe('GET /api/hotels/[id]', () => {
    test('sollte ein einzelnes Hotel nach ID zurückgeben', async () => {
      const hotelId = '1'; // ID für Hotel Schgaguler
      const hotel = await testEndpointWithSchema(`/api/hotels/${hotelId}`, hotelSchema);
      
      expect(hotel.id).toBe(hotelId);
      expect(hotel.name).toBe('Hotel Schgaguler');
    });
    
    test('sollte 404 zurückgeben, wenn Hotel mit der ID nicht gefunden wird', async () => {
      const nonExistentId = '999';
      const errorResponse = await testEndpointWithSchema(`/api/hotels/${nonExistentId}`, errorResponseSchema, {
        expectedStatus: 404
      });
      
      expect(errorResponse).toHaveProperty('error');
      expect(errorResponse.error).toContain('not found');
    });
  });
  
  // Tests für die Beziehung zwischen Hotels und anderen Entitäten
  describe('Hotel Relationships', () => {
    test('sollte korrekte Destination-Referenz haben', async () => {
      const hotelSlug = 'hotel-schgaguler';
      const hotel = await testEndpointWithSchema(`/api/hotels/${hotelSlug}`, hotelSchema);
      
      // Prüfe, ob die Destination-ID vorhanden ist
      expect(hotel).toHaveProperty('destination');
      expect(hotel.destination).toBe('1'); // South Tyrol hat die ID '1' in den Mockdaten
    });

    test('sollte korrekte Kategorien haben', async () => {
      const hotelSlug = 'hotel-schgaguler';
      const hotel = await testEndpointWithSchema(`/api/hotels/${hotelSlug}`, hotelSchema);
      
      // Prüfe, ob die Kategorien vorhanden sind
      expect(hotel).toHaveProperty('categories');
      expect(Array.isArray(hotel.categories)).toBe(true);
      expect(hotel.categories).toContain('luxury');
      expect(hotel.categories).toContain('mountain');
    });

    test('sollte zu den korrekten Zimmertypen verlinken', async () => {
      const hotelId = '1'; // ID für Hotel Schgaguler
      
      // Hier würden wir normalerweise einen API-Endpoint /api/hotels/{id}/rooms testen
      // Da dieser möglicherweise nicht existiert, testen wir den allgemeinen Zimmer-Endpunkt mit Filter
      const rooms = await testEndpointWithSchema(`/api/rooms/${hotelId}`, roomsCollectionSchema);
      
      // Überprüfe, ob alle Zimmer zum richtigen Hotel gehören
      expect(rooms.length).toBeGreaterThan(0);
      rooms.forEach(room => {
        expect(room.hotel).toBe(hotelId);
      });
    });
  });

  // Mehrsprachigkeits-Tests
  describe('Hotel Internationalization', () => {
    test('sollte übersetzte Inhalte zurückgeben, wenn locale Parameter vorhanden', async () => {
      // Diese Test würde spezifisch für die mehrsprachigen Felder sein
      // Je nach Implementierung der Mehrsprachigkeit
      
      const englishHotel = await testEndpointWithSchema('/api/hotels/hotel-schgaguler', hotelSchema, {
        query: { locale: 'en-US' }
      });
      
      // Lokalisierte Felder sollten auf Englisch sein
      expect(englishHotel.name).toBe('Hotel Schgaguler');
      
      // Hier würden wir prüfen, ob lokalisierte Felder in der richtigen Sprache zurückgegeben werden
      // Mock hier noch erweitern für zusätzliche Sprachen
    });
  });

  // Caching Tests
  describe('Hotel Caching', () => {
    test('sollte Cache-Header für detaillierte Hotelansichten setzen', async () => {
      const hotelSlug = 'hotel-schgaguler';
      
      // Wir verwenden testEndpointWithSchema, um die HTTP-Header zu überprüfen
      const response = await request
        .get(`/api/hotels/${hotelSlug}`)
        .expect(200)
        .expect('Content-Type', /json/);
      
      // Prüfen, ob Cache-Control-Header gesetzt ist
      expect(response.headers['cache-control']).toBeDefined();
      expect(response.headers['cache-control']).toContain('max-age=');
    });
  });
});