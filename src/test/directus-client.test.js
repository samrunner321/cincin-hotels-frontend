/**
 * Tests für den Directus-Client
 * Hinweis: Diese Tests verwenden Jest Mocks, um die API-Aufrufe zu simulieren.
 */

import {
  getAssetUrl,
  processTranslations,
  processImages,
  prepareItem
} from '../lib/api/directus-client';

// Mock für fetch
global.fetch = jest.fn();

describe('Directus Client Utilities', () => {
  // Tests für getAssetUrl
  describe('getAssetUrl', () => {
    beforeAll(() => {
      // Mock für process.env
      process.env.NEXT_PUBLIC_DIRECTUS_URL = 'https://directus.example.com';
    });

    test('gibt leeren String zurück, wenn fileId nicht vorhanden', () => {
      expect(getAssetUrl('')).toBe('');
      expect(getAssetUrl(undefined)).toBe('');
      expect(getAssetUrl(null)).toBe('');
    });

    test('gibt direkten URL zurück, wenn fileId bereits eine URL ist', () => {
      expect(getAssetUrl('https://example.com/image.jpg')).toBe('https://example.com/image.jpg');
      expect(getAssetUrl('/images/local.jpg')).toBe('/images/local.jpg');
    });

    test('erstellt korrekte Asset-URL mit Optionen', () => {
      const url = getAssetUrl('abc123', { width: 200, height: 150, format: 'jpg' });
      expect(url).toContain('https://directus.example.com/assets/abc123');
      expect(url).toContain('width=200');
      expect(url).toContain('height=150');
      expect(url).toContain('format=jpg');
    });
  });

  // Tests für processTranslations
  describe('processTranslations', () => {
    test('gibt null zurück, wenn item null ist', () => {
      expect(processTranslations(null)).toBeNull();
    });

    test('gibt unverändertes Item zurück, wenn keine Übersetzungen vorhanden', () => {
      const item = { id: '1', title: 'Original Title' };
      expect(processTranslations(item)).toEqual(item);
    });

    test('verarbeitet Array-Übersetzungen korrekt', () => {
      const item = {
        id: '1',
        title: 'Original Title',
        translations: [
          { languages_code: 'en-US', title: 'English Title' },
          { languages_code: 'de-DE', title: 'Deutscher Titel' }
        ]
      };
      
      // Mit de-DE Locale
      const processed = processTranslations(item, 'de-DE');
      expect(processed.title).toBe('Deutscher Titel');
      
      // Mit en-US Locale
      const processedEn = processTranslations(item, 'en-US');
      expect(processedEn.title).toBe('English Title');
    });

    test('verarbeitet Objekt-Übersetzungen korrekt', () => {
      const item = {
        id: '1',
        title: 'Original Title',
        translations: {
          languages_code: 'de-DE',
          title: 'Deutscher Titel',
          description: 'Deutsche Beschreibung'
        }
      };
      
      const processed = processTranslations(item, 'de-DE');
      expect(processed.title).toBe('Deutscher Titel');
      expect(processed.description).toBe('Deutsche Beschreibung');
    });
  });

  // Tests für processImages
  describe('processImages', () => {
    beforeAll(() => {
      // Mock für process.env
      process.env.NEXT_PUBLIC_DIRECTUS_URL = 'https://directus.example.com';
    });

    test('gibt null zurück, wenn item null ist', () => {
      expect(processImages(null)).toBeNull();
    });

    test('verarbeitet einfache Bildfelder korrekt', () => {
      const item = {
        id: '1',
        main_image: 'abc123'
      };
      
      const processed = processImages(item);
      expect(processed.main_image_url).toBe('https://directus.example.com/assets/abc123');
    });

    test('verarbeitet Galerie-Felder korrekt', () => {
      const item = {
        id: '1',
        gallery: [
          { image: 'img1', alt: 'Image 1' },
          { image: 'img2', alt: 'Image 2' }
        ]
      };
      
      const processed = processImages(item);
      expect(processed.gallery[0].url).toBe('https://directus.example.com/assets/img1');
      expect(processed.gallery[1].url).toBe('https://directus.example.com/assets/img2');
    });
  });

  // Tests für prepareItem
  describe('prepareItem', () => {
    beforeAll(() => {
      // Mock für process.env
      process.env.NEXT_PUBLIC_DIRECTUS_URL = 'https://directus.example.com';
    });

    test('gibt null zurück, wenn item null ist', () => {
      expect(prepareItem(null)).toBeNull();
    });

    test('normalisiert Felder korrekt', () => {
      const item = {
        id: '1',
        title: 'Test Title',
        // kein name oder slug vorhanden
      };
      
      const prepared = prepareItem(item);
      expect(prepared.name).toBe('Test Title'); // name aus title übernommen
      expect(prepared.slug).toBe('item-1'); // slug generiert
      expect(prepared.status).toBe('published'); // status standardmäßig gesetzt
    });

    test('verarbeitet Übersetzungen und Bilder korrekt', () => {
      const item = {
        id: '1',
        title: 'Original Title',
        main_image: 'abc123',
        translations: [
          { languages_code: 'de-DE', title: 'Deutscher Titel' }
        ]
      };
      
      const prepared = prepareItem(item, 'de-DE');
      expect(prepared.title).toBe('Deutscher Titel');
      expect(prepared.main_image_url).toBe('https://directus.example.com/assets/abc123');
    });
  });
});