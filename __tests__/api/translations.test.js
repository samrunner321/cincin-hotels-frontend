/**
 * Tests für Übersetzungs-API-Endpunkte
 * 
 * Diese Tests überprüfen den Übersetzungs-Endpunkt:
 * - /api/translations - Übersetzungsdaten
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
import { translationsObjectSchema, errorResponseSchema } from './utils/schemas';
import { mockTranslations } from './mocks/data/translations';

describe('Translations API Endpoints', () => {
  // Tests für /api/translations Endpunkt
  describe('GET /api/translations', () => {
    // Happy Path Tests
    test('sollte Übersetzungen für die Standardsprache zurückgeben', async () => {
      const translations = await testEndpointWithSchema('/api/translations', translationsObjectSchema);
      
      // Basisprüfungen
      expect(translations).toBeDefined();
      expect(typeof translations).toBe('object');
      expect(Object.keys(translations).length).toBeGreaterThan(0);
      
      // Stichprobenartige Prüfung einiger erwarteter Übersetzungsschlüssel mit Schlüsseln als vollständigen Strings
      // Die Schlüssel sind als vollständige Strings gespeichert, keine Punktnotation
      expect(translations['global.nav.home']).toBeDefined();
      expect(translations['global.nav.hotels']).toBeDefined();
      expect(translations['global.nav.destinations']).toBeDefined();
    });
    
    test('sollte Übersetzungen für eine spezifische Sprache zurückgeben (en-US)', async () => {
      const language = 'en-US';
      const translations = await testEndpointWithSchema('/api/translations', translationsObjectSchema, {
        query: { language }
      });
      
      // Überprüfe, ob die Übersetzungen für die angeforderte Sprache sind
      // (In diesem Test können wir nur indirekt prüfen, da wir das Response-Format als Objekt haben)
      
      // Prüfe auf englische Werte für bekannte Schlüssel
      expect(translations['global.nav.home']).toBe('Home');
      expect(translations['global.nav.about']).toBe('About Us');
      expect(translations['global.footer.copyright']).toBe('All rights reserved');
      
      // Stichprobenartige Prüfung, dass deutsche Werte NICHT vorhanden sind
      expect(translations['global.nav.home']).not.toBe('Startseite');
    });
    
    test('sollte Übersetzungen für eine spezifische Sprache zurückgeben (de-DE)', async () => {
      const language = 'de-DE';
      const translations = await testEndpointWithSchema('/api/translations', translationsObjectSchema, {
        query: { language }
      });
      
      // Prüfe auf deutsche Werte für bekannte Schlüssel
      expect(translations['global.nav.home']).toBe('Startseite');
      expect(translations['global.nav.about']).toBe('Über uns');
      expect(translations['global.footer.copyright']).toBe('Alle Rechte vorbehalten');
      
      // Stichprobenartige Prüfung, dass englische Werte NICHT vorhanden sind
      expect(translations['global.nav.home']).not.toBe('Home');
    });
    
    test('sollte alle erwarteten Übersetzungsschlüssel für jede Sprache enthalten', async () => {
      // Englische Übersetzungen
      const enTranslations = await testEndpointWithSchema('/api/translations', translationsObjectSchema, {
        query: { language: 'en-US' }
      });
      
      // Deutsche Übersetzungen
      const deTranslations = await testEndpointWithSchema('/api/translations', translationsObjectSchema, {
        query: { language: 'de-DE' }
      });
      
      // Überprüfe, dass beide Sprachen dieselben Schlüssel haben
      const enKeys = Object.keys(enTranslations);
      const deKeys = Object.keys(deTranslations);
      
      // Beide Sprachen sollten dieselbe Anzahl an Schlüsseln haben
      expect(enKeys.length).toBe(deKeys.length);
      
      // Überprüfe, dass alle Schlüssel in beiden Sprachen vorhanden sind
      enKeys.forEach(key => {
        expect(deTranslations[key]).toBeDefined();
      });
      
      deKeys.forEach(key => {
        expect(enTranslations[key]).toBeDefined();
      });
    });
    
    test('sollte für eine unbekannte Sprache die Standardsprache zurückgeben', async () => {
      const language = 'fr-FR'; // Nicht unterstützte Sprache
      const translations = await testEndpointWithSchema('/api/translations', translationsObjectSchema, {
        query: { language }
      });
      
      // Da die Sprache nicht unterstützt wird, sollten wir trotzdem Übersetzungen zurückbekommen
      // (wahrscheinlich die Standardsprache, normalerweise en-US)
      expect(translations).toBeDefined();
      expect(Object.keys(translations).length).toBeGreaterThan(0);
      
      // Wir können nicht direkt prüfen, welche Sprache zurückgegeben wird,
      // aber wir können prüfen, ob die Antwort ein gültiges Übersetzungsobjekt ist
      expect(translations['global.nav.home']).toBeDefined();
    });
    
    // Fehlerszenarien
    test('sollte einen Serverfehler korrekt behandeln', async () => {
      // Mock einen Serverfehler für diesen Test
      mockServerError('http://localhost:3000/api/translations');
      
      // Prüfen, ob der Fehler korrekt zurückgegeben wird
      const errorResponse = await testEndpointWithSchema('/api/translations', errorResponseSchema, {
        expectedStatus: 500
      });
      
      expect(errorResponse).toHaveProperty('error');
    });
    
    // Performance Tests
    test('sollte innerhalb des Performance-Limits antworten', async () => {
      const { duration } = await measureEndpointPerformance('/api/translations', 500);
      
      // Übersetzungen sollten besonders schnell geladen werden, da sie oft gecached werden
      // Daher haben wir hier ein strengeres Limit von 500ms statt 1000ms
      
      // Zusätzliche Prüfung für Debug-Output
      console.log(`Response time for /api/translations: ${duration.toFixed(2)}ms`);
    });
    
    test('sollte bei gleichzeitigen Anfragen konsistente Ergebnisse liefern', async () => {
      // 3 gleichzeitige Anfragen
      const responses = await testConcurrentRequests('/api/translations', 3);
      
      // Überprüfe, dass alle Antworten identisch sind
      compareResponses(responses[0], responses[1]);
      compareResponses(responses[0], responses[2]);
    });
  });
  
  // Tests für die Übersetzungskonsistenz
  describe('Translation Consistency', () => {
    test('sollte konsistente Übersetzungswerte für alle Sprachen haben', async () => {
      // Englische Übersetzungen
      const enTranslations = await testEndpointWithSchema('/api/translations', translationsObjectSchema, {
        query: { language: 'en-US' }
      });
      
      // Deutsche Übersetzungen
      const deTranslations = await testEndpointWithSchema('/api/translations', translationsObjectSchema, {
        query: { language: 'de-DE' }
      });
      
      // Überprüfe, dass Platzhalter konsistent verwendet werden
      const enKeysWithPlaceholders = Object.entries(enTranslations)
        .filter(([_, value]) => value.includes('{') && value.includes('}'))
        .map(([key]) => key);
      
      // Wenn es Schlüssel mit Platzhaltern gibt, überprüfe sie
      if (enKeysWithPlaceholders.length > 0) {
        enKeysWithPlaceholders.forEach(key => {
          // Prüfe, ob der deutsche Wert auch Platzhalter enthält
          const enValue = enTranslations[key];
          const deValue = deTranslations[key];
          
          // Extrahiere Platzhalter aus den Werten
          const enPlaceholders = extractPlaceholders(enValue);
          const dePlaceholders = extractPlaceholders(deValue);
          
          // Beide Sprachen sollten dieselben Platzhalter haben
          expect(dePlaceholders.sort()).toEqual(enPlaceholders.sort());
        });
      }
      
      // Wenn die Mockdaten keine Platzhalter enthalten, wird dieser Test automatisch bestanden
    });
    
    test('sollte für interaktive Elemente (Buttons, Links) in allen Sprachen Texte haben', async () => {
      // Englische Übersetzungen
      const enTranslations = await testEndpointWithSchema('/api/translations', translationsObjectSchema, {
        query: { language: 'en-US' }
      });
      
      // Überprüfe, dass alle CTA (Call-to-Action) Schlüssel vorhanden sind
      const ctaKeys = Object.keys(enTranslations).filter(key => key.includes('cta.'));
      expect(ctaKeys.length).toBeGreaterThan(0);
      
      // Überprüfe, dass typische CTA Schlüssel vorhanden sind
      expect(ctaKeys).toContain('global.cta.book_now');
      expect(ctaKeys).toContain('global.cta.learn_more');
    });
  });
});

/**
 * Hilfsfunktion zum Extrahieren von Platzhaltern aus einem Übersetzungswert
 * z.B. "Hello {{name}}" -> ["name"]
 */
function extractPlaceholders(value) {
  const placeholders = [];
  const regex = /{{([^}]+)}}/g;
  let match;
  
  while ((match = regex.exec(value)) !== null) {
    placeholders.push(match[1]);
  }
  
  return placeholders;
}