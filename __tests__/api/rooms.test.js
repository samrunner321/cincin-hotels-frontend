/**
 * Tests für Zimmer-API-Endpunkte
 * 
 * Diese Tests überprüfen den Zimmer-Endpunkt:
 * - /api/rooms/[hotelId] - Zimmer eines bestimmten Hotels
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
import { roomsCollectionSchema, errorResponseSchema } from './utils/schemas';
import { mockRooms } from './mocks/data/rooms';
import { mockHotels } from './mocks/data/hotels';

describe('Rooms API Endpoints', () => {
  // Tests für /api/rooms/[hotelId] Endpunkt
  describe('GET /api/rooms/[hotelId]', () => {
    // Happy Path Tests
    test('sollte Zimmer für ein bestimmtes Hotel zurückgeben', async () => {
      const hotelId = '1'; // Hotel Schgaguler
      const rooms = await testEndpointWithSchema(`/api/rooms/${hotelId}`, roomsCollectionSchema);
      
      // Basisprüfungen
      expect(Array.isArray(rooms)).toBe(true);
      expect(rooms.length).toBeGreaterThan(0);
      
      // Überprüfen, dass alle Zimmer zum angegebenen Hotel gehören
      rooms.forEach(room => {
        expect(room.hotel).toBe(hotelId);
      });
      
      // Stichprobenartige Prüfung eines erwarteten Zimmers
      expect(rooms.some(room => room.name === 'Alpine Suite')).toBe(true);
    });
    
    test('sollte nur veröffentlichte Zimmer zurückgeben', async () => {
      const hotelId = '1'; // Hotel Schgaguler
      const rooms = await testEndpointWithSchema(`/api/rooms/${hotelId}`, roomsCollectionSchema);
      
      // Überprüfen, dass alle zurückgegebenen Zimmer veröffentlicht sind
      rooms.forEach(room => {
        expect(room.status).toBe('published');
      });
      
      // Zähle, wie viele veröffentlichte Zimmer es für dieses Hotel in den Mockdaten gibt
      const mockPublishedRooms = mockRooms.filter(r => 
        r.hotel === hotelId && r.status === 'published'
      );
      expect(rooms.length).toBe(mockPublishedRooms.length);
    });
    
    test('sollte ein leeres Array zurückgeben, wenn das Hotel keine Zimmer hat', async () => {
      // Verwende eine Hotel-ID, für die keine Zimmer existieren
      const hotelId = '6'; // Marina Bay Resort (im Entwurfsstatus, sollte keine Zimmer haben)
      const rooms = await testEndpointWithSchema(`/api/rooms/${hotelId}`, roomsCollectionSchema);
      
      // Überprüfen, dass ein leeres Array zurückgegeben wird
      expect(Array.isArray(rooms)).toBe(true);
      expect(rooms.length).toBe(0);
    });
    
    test('sollte ein leeres Array zurückgeben, wenn das Hotel nicht existiert', async () => {
      // Verwende eine nicht existierende Hotel-ID
      const nonExistentId = '999';
      const rooms = await testEndpointWithSchema(`/api/rooms/${nonExistentId}`, roomsCollectionSchema);
      
      // Überprüfen, dass ein leeres Array zurückgegeben wird
      expect(Array.isArray(rooms)).toBe(true);
      expect(rooms.length).toBe(0);
    });
    
    // Fehlerszenarien
    test('sollte einen Serverfehler korrekt behandeln', async () => {
      const hotelId = '1'; // Hotel Schgaguler
      
      // Mock einen Serverfehler für diesen Test
      mockServerError(`http://localhost:3000/api/rooms/${hotelId}`);
      
      // Prüfen, ob der Fehler korrekt zurückgegeben wird
      const errorResponse = await testEndpointWithSchema(`/api/rooms/${hotelId}`, errorResponseSchema, {
        expectedStatus: 500
      });
      
      expect(errorResponse).toHaveProperty('error');
    });
    
    // Performance Tests
    test('sollte innerhalb des Performance-Limits antworten', async () => {
      const hotelId = '2'; // Hotel Giardino
      const { duration } = await measureEndpointPerformance(`/api/rooms/${hotelId}`, 500);
      
      // Zimmer sollten schnell geladen werden, daher ein strengeres Limit von 500ms
      
      // Zusätzliche Prüfung für Debug-Output
      console.log(`Response time for /api/rooms/${hotelId}: ${duration.toFixed(2)}ms`);
    });
    
    test('sollte bei gleichzeitigen Anfragen konsistente Ergebnisse liefern', async () => {
      const hotelId = '3'; // RockResort
      
      // 3 gleichzeitige Anfragen
      const responses = await testConcurrentRequests(`/api/rooms/${hotelId}`, 3);
      
      // Überprüfe, dass alle Antworten identisch sind
      compareResponses(responses[0], responses[1]);
      compareResponses(responses[0], responses[2]);
    });
  });
  
  // Tests für Zimmer-Datenstruktur
  describe('Room Data Structure', () => {
    test('sollte alle erforderlichen Felder für jedes Zimmer enthalten', async () => {
      const hotelId = '4'; // Hotel Aurora
      const rooms = await testEndpointWithSchema(`/api/rooms/${hotelId}`, roomsCollectionSchema);
      
      // Prüfe, ob alle Zimmer die erforderlichen Felder haben
      rooms.forEach(room => {
        expect(room).toHaveProperty('id');
        expect(room).toHaveProperty('name');
        expect(room).toHaveProperty('slug');
        expect(room).toHaveProperty('description');
        expect(room).toHaveProperty('size');
        expect(room).toHaveProperty('max_occupancy');
        expect(room).toHaveProperty('price_per_night');
        expect(room).toHaveProperty('currency');
        expect(room).toHaveProperty('hotel');
      });
    });
    
    test('sollte korrekte numerische Werte für Zimmer enthalten', async () => {
      const hotelId = '5'; // Forestis Dolomites
      const rooms = await testEndpointWithSchema(`/api/rooms/${hotelId}`, roomsCollectionSchema);
      
      // Prüfe, ob alle numerischen Werte korrekt sind
      rooms.forEach(room => {
        // max_occupancy sollte eine positive Ganzzahl sein
        expect(Number.isInteger(room.max_occupancy)).toBe(true);
        expect(room.max_occupancy).toBeGreaterThan(0);
        
        // price_per_night sollte eine positive Zahl sein
        expect(typeof room.price_per_night).toBe('number');
        expect(room.price_per_night).toBeGreaterThan(0);
        
        // Bed count, wenn vorhanden, sollte eine positive Ganzzahl sein
        if (room.bed_count !== undefined) {
          expect(Number.isInteger(room.bed_count)).toBe(true);
          expect(room.bed_count).toBeGreaterThan(0);
        }
        
        // Bathroom count, wenn vorhanden, sollte eine positive Ganzzahl sein
        if (room.bathroom_count !== undefined) {
          expect(Number.isInteger(room.bathroom_count)).toBe(true);
          expect(room.bathroom_count).toBeGreaterThan(0);
        }
      });
    });
    
    test('sollte korrekte Maßangabe für Zimmergröße enthalten', async () => {
      const hotelId = '1'; // Hotel Schgaguler
      const rooms = await testEndpointWithSchema(`/api/rooms/${hotelId}`, roomsCollectionSchema);
      
      // Prüfe, ob die Zimmergrößen das korrekte Format haben (z.B. "30 m²")
      rooms.forEach(room => {
        expect(room.size).toMatch(/^\d+(\.\d+)?\s*m²$/);
      });
    });
    
    test('sollte korrekte Bilddaten für Zimmer enthalten', async () => {
      const hotelId = '2'; // Hotel Giardino
      const rooms = await testEndpointWithSchema(`/api/rooms/${hotelId}`, roomsCollectionSchema);
      
      // Prüfe, ob alle Zimmer Bilder haben
      rooms.forEach(room => {
        expect(room).toHaveProperty('main_image');
        expect(room.main_image).not.toBeNull();
        expect(room.main_image).toHaveProperty('id');
        
        // Prüfe Gallerie, wenn vorhanden
        if (room.gallery && room.gallery.length > 0) {
          room.gallery.forEach(galleryItem => {
            expect(galleryItem).toHaveProperty('image');
            expect(galleryItem.image).toHaveProperty('id');
          });
        }
      });
    });
    
    test('sollte Zimmer nach Sortierreihenfolge zurückgeben', async () => {
      const hotelId = '5'; // Forestis Dolomites
      const rooms = await testEndpointWithSchema(`/api/rooms/${hotelId}`, roomsCollectionSchema);
      
      if (rooms.length > 1) {
        // Überprüfen, dass die Zimmer nach ihrem "sort"-Feld sortiert sind
        const sortValues = rooms.map(room => room.sort);
        
        // Die sortValues sollten in aufsteigender Reihenfolge sein
        const isSorted = sortValues.every((value, index, array) => {
          return index === 0 || value >= array[index - 1];
        });
        
        expect(isSorted).toBe(true);
      }
    });
  });
  
  // Tests für die Beziehung zwischen Zimmern und Hotels
  describe('Room-Hotel Relationships', () => {
    test('sollte für jedes Zimmer ein gültiges Hotel-Referenz haben', async () => {
      // Wir testen alle Hotels mit ihren Zimmern
      for (const hotel of mockHotels.filter(h => h.status === 'published')) {
        const hotelId = hotel.id;
        const rooms = await testEndpointWithSchema(`/api/rooms/${hotelId}`, roomsCollectionSchema);
        
        if (rooms.length > 0) {
          // Überprüfen, dass alle Zimmer zum angegebenen Hotel gehören
          rooms.forEach(room => {
            expect(room.hotel).toBe(hotelId);
          });
        }
      }
    });
    
    test('sollte konsistente Preiswährungen zwischen Hotel und Zimmern haben', async () => {
      // Für jedes Hotel mit Zimmern sollten die Zimmer die gleiche Währung wie das Hotel haben
      for (const hotel of mockHotels.filter(h => h.status === 'published')) {
        const hotelId = hotel.id;
        const hotelCurrency = hotel.currency;
        const rooms = await testEndpointWithSchema(`/api/rooms/${hotelId}`, roomsCollectionSchema);
        
        if (rooms.length > 0) {
          // Überprüfen, dass alle Zimmer die gleiche Währung wie das Hotel haben
          rooms.forEach(room => {
            expect(room.currency).toBe(hotelCurrency);
          });
        }
      }
    });
  });
});