/**
 * Mock-Daten-Modul für Entwicklung ohne Directus CMS
 * Wird nur verwendet, wenn IS_MOCK_SERVER=true in .env.local gesetzt ist
 */

import fs from 'fs';
import path from 'path';
import { Hotel, Destination, Category, Room, Page } from './directus';

// Pfade zu Mock-Daten
const MOCK_DATA_DIR = path.join(process.cwd(), 'mock-directus', 'data');
const MOCK_DESTINATIONS_PATH = path.join(MOCK_DATA_DIR, 'destinations.json');
const MOCK_HOTELS_PATH = path.join(MOCK_DATA_DIR, 'hotels.json');
const MOCK_CATEGORIES_PATH = path.join(MOCK_DATA_DIR, 'categories.json');

/**
 * Liest JSON-Datei und gibt den Inhalt als Objekt zurück
 */
function readJsonFile<T>(filePath: string): T[] {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error(`Error reading mock data from ${filePath}:`, error);
    return [];
  }
}

/**
 * Mock-Funktion für Destinations
 */
export function getMockDestinations(options: {
  limit?: number;
  offset?: number;
  sort?: string[];
  filter?: Record<string, any>;
  fields?: string[];
} = {}): Destination[] {
  const { 
    limit = 100, 
    offset = 0,
    filter = {}
  } = options;

  let destinations = readJsonFile<Destination>(MOCK_DESTINATIONS_PATH);
  
  // Einfache Filterung
  if (filter.status && filter.status._eq) {
    destinations = destinations.filter(d => d.status === filter.status._eq);
  }
  
  if (filter.is_featured !== undefined) {
    destinations = destinations.filter(d => d.is_featured === filter.is_featured._eq);
  }
  
  if (filter.is_popular !== undefined) {
    destinations = destinations.filter(d => d.is_popular === filter.is_popular._eq);
  }
  
  if (filter.region && filter.region._eq) {
    destinations = destinations.filter(d => d.region === filter.region._eq);
  }
  
  return destinations.slice(offset, offset + limit);
}

/**
 * Mock-Funktion für einzelne Destination nach Slug
 */
export function getMockDestinationBySlug(slug: string): Destination | null {
  const destinations = readJsonFile<Destination>(MOCK_DESTINATIONS_PATH);
  return destinations.find(d => d.slug === slug) || null;
}

/**
 * Mock-Funktion für Hotels
 */
export function getMockHotels(options: {
  limit?: number;
  offset?: number;
  sort?: string[];
  filter?: Record<string, any>;
  fields?: string[];
} = {}): Hotel[] {
  const { 
    limit = 100, 
    offset = 0,
    filter = {}
  } = options;

  let hotels = readJsonFile<Hotel>(MOCK_HOTELS_PATH);
  
  // Einfache Filterung
  if (filter.status && filter.status._eq) {
    hotels = hotels.filter(h => h.status === filter.status._eq);
  }
  
  if (filter.is_featured !== undefined) {
    hotels = hotels.filter(h => h.is_featured === filter.is_featured._eq);
  }
  
  if (filter.destination && filter.destination._eq) {
    hotels = hotels.filter(h => h.destination === filter.destination._eq);
  }
  
  return hotels.slice(offset, offset + limit);
}

/**
 * Mock-Funktion für einzelnes Hotel nach Slug
 */
export function getMockHotelBySlug(slug: string): Hotel | null {
  const hotels = readJsonFile<Hotel>(MOCK_HOTELS_PATH);
  return hotels.find(h => h.slug === slug) || null;
}

/**
 * Mock-Funktion für Hotels nach Destination
 */
export function getMockHotelsByDestination(destinationId: string): Hotel[] {
  const hotels = readJsonFile<Hotel>(MOCK_HOTELS_PATH);
  return hotels.filter(h => h.destination === destinationId);
}

/**
 * Mock-Funktion für Kategorien
 */
export function getMockCategories(options: {
  type?: 'hotel' | 'destination' | 'both';
  featured?: boolean;
} = {}): Category[] {
  const { type, featured } = options;
  
  let categories = readJsonFile<Category>(MOCK_CATEGORIES_PATH);
  
  // Filterung nach Typ
  if (type) {
    categories = categories.filter(c => c.type === type || c.type === 'both');
  }
  
  // Filterung nach Featured
  if (featured !== undefined) {
    categories = categories.filter(c => c.featured === featured);
  }
  
  return categories;
}

/**
 * Mock-Bild-URL-Funktion
 */
export function getMockAssetURL(fileId: string): string {
  return `/mock-images/${fileId}`;
}