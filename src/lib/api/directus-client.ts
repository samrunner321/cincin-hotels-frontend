/**
 * Directus Client
 * Robuste API-Schnittstelle zum Directus CMS mit TypeScript-Unterstützung
 */

// Re-export everything from the main directus-client.ts file
export * from '../directus-client';

// Local imports
import { getDirectusPublicToken } from '../auth-utils';
import { Hotel } from '../directus';

// Typdefinitionen für Directus API
export type DirectusFilterOperator = 
  | '_eq' | '_neq' | '_lt' | '_lte' | '_gt' | '_gte' 
  | '_in' | '_nin' | '_null' | '_nnull' | '_contains' 
  | '_ncontains' | '_starts_with' | '_nstarts_with' 
  | '_ends_with' | '_nends_with' | '_between' | '_nbetween' 
  | '_empty' | '_nempty';

export type DirectusFilterValue = 
  | string 
  | number 
  | boolean 
  | null 
  | Array<string | number | boolean>
  | Record<string, any>;

export interface DirectusFilterCondition {
  [operator: string]: DirectusFilterValue;
}

export interface DirectusFilter {
  [field: string]: DirectusFilterValue | DirectusFilterCondition;
}

export interface DirectusOptions {
  limit?: number;
  offset?: number;
  sort?: string | string[];
  filter?: DirectusFilter;
  advancedFilter?: Record<string, Record<string, DirectusFilterValue>>;
  fields?: string | string[];
  deep?: Record<string, Record<string, DirectusFilterValue>>;
}

export interface DirectusResponse<T> {
  data?: T;
  meta?: {
    filter_count?: number;
    total_count?: number;
    [key: string]: any;
  };
}

export interface DirectusTranslationItem {
  id?: string;
  languages_code?: string;
  languages_id?: string;
  item?: string;
  [key: string]: any;
}

export interface ItemWithTranslations {
  translations?: DirectusTranslationItem[] | Record<string, any>;
  [key: string]: any;
}

export interface GalleryItem {
  id?: string;
  image?: string;
  alt?: string;
  caption?: string;
  url?: string;
  season?: string;
}

export interface AssetOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpg' | 'png' | 'webp' | 'avif';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

export interface HotelQueryOptions {
  limit?: number;
  offset?: number;
  sort?: string;
  filter?: DirectusFilter;
  isFeatured?: boolean;
}

// Valid language codes
export type LanguageCode = 'de-DE' | 'en-US' | 'ar-AE' | 'he-IL';

// Konfiguration
const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

/**
 * Basisfunktion für API-Aufrufe an Directus
 * @param endpoint - API-Endpunkt
 * @param options - Zusätzliche Optionen (Filter, Felder, etc.)
 * @returns API-Antwort
 */
export async function fetchFromDirectus<T = any>(
  endpoint: string, 
  options: DirectusOptions = {}
): Promise<DirectusResponse<T>> {
  try {
    // Parameter vorbereiten
    const params = new URLSearchParams();
    
    // Filter hinzufügen
    if (options.filter) {
      for (const [key, value] of Object.entries(options.filter)) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // Wenn der Wert ein Objekt ist, die entsprechenden Operatoren verwenden
          for (const [operator, opValue] of Object.entries(value)) {
            params.append(`filter[${key}][${operator}]`, String(opValue));
          }
        } else {
          // Standardmäßig _eq Operator verwenden
          params.append(`filter[${key}][_eq]`, String(value));
        }
      }
    }
    
    // Erweiterte Filter hinzufügen (für komplexere Bedingungen)
    if (options.advancedFilter) {
      for (const [key, conditions] of Object.entries(options.advancedFilter)) {
        for (const [operator, value] of Object.entries(conditions)) {
          params.append(`filter[${key}][${operator}]`, String(value));
        }
      }
    }
    
    // Felder hinzufügen
    if (options.fields) {
      const fieldsStr = Array.isArray(options.fields) ? options.fields.join(',') : options.fields;
      params.append('fields', fieldsStr);
    }
    
    // Beziehungen hinzufügen
    if (options.deep) {
      for (const [relation, filters] of Object.entries(options.deep)) {
        if (typeof filters === 'object' && filters !== null) {
          for (const [filterKey, filterValue] of Object.entries(filters)) {
            params.append(`deep[${relation}][${filterKey}]`, String(filterValue));
          }
        }
      }
    }
    
    // Limit und Offset hinzufügen
    if (options.limit) params.append('limit', String(options.limit));
    if (options.offset) params.append('offset', String(options.offset));
    
    // Sortierung hinzufügen
    if (options.sort) {
      const sortStr = Array.isArray(options.sort) ? options.sort.join(',') : options.sort;
      params.append('sort', sortStr);
    }
    
    // Debug-Informationen für die Anforderung
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Request: ${DIRECTUS_URL}/${endpoint}?${params.toString()}`);
    }
    
    // API-Token sicher aus der auth-utils Funktion abrufen
    const API_TOKEN = getDirectusPublicToken();
    
    if (!API_TOKEN) {
      throw new Error('No API token available for Directus');
    }
    
    // API-Aufruf ausführen - mit Authorization Header statt Query-Parameter
    const response = await fetch(`${DIRECTUS_URL}/${endpoint}?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });
    
    // Fehler behandeln
    if (!response.ok) {
      throw new Error(`API error: ${response.status} - ${response.statusText}`);
    }
    
    // Antwort zurückgeben
    const data = await response.json();
    return data as DirectusResponse<T>;
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Hilfsfunktion für den Abruf bestimmter Hotels
 * @param options Optionen für den Hotels-Abruf
 * @returns List von Hotels
 */
export async function fetchHotels(options: HotelQueryOptions = {}): Promise<Hotel[]> {
  const {
    limit = 10,
    offset = 0,
    sort = '-date_created',
    filter = {},
    isFeatured = false
  } = options;
  
  // Filter vorbereiten
  const apiFilter: DirectusFilter = {
    status: 'published',
    ...filter
  };
  
  if (isFeatured) {
    apiFilter.is_featured = true;
  }
  
  try {
    // API-Anfrage ausführen
    const response = await fetchFromDirectus<Hotel[]>('items/hotels', {
      limit,
      offset,
      sort: [sort],
      filter: apiFilter,
    });
    
    // Wenn keine Daten zurückgegeben wurden, leeres Array zurückgeben
    if (!response.data) return [];
    
    // Verarbeite die Hotels für die Frontend-Anzeige
    const processedHotels = response.data.map(hotel => prepareItem(hotel));
    
    return processedHotels.filter((hotel): hotel is Hotel => hotel !== null);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return [];
  }
}

/**
 * Hilfsfunktion für den Abruf eines bestimmten Hotels anhand des Slugs
 * @param slug Hotel-Slug
 * @param locale - Gebietsschema (z.B. 'de-DE', 'en-US')
 * @returns Hotel-Objekt oder null
 */
export async function fetchHotelBySlug(
  slug: string, 
  locale: LanguageCode | string = 'de-DE'
): Promise<Hotel | null> {
  try {
    console.log(`Fetching hotel with slug: ${slug} and locale: ${locale}`);
    
    // Direkte Abfrage nach dem Slug
    const response = await fetchFromDirectus<Hotel[]>('items/hotels', {
      filter: {
        slug: slug,
        status: 'Published'  // Großgeschrieben, wie in der Datenbank
      },
      fields: '*,main_image.*,gallery.image.*,translations.*,destination.*,destination.translations.*',
      deep: { 
        translations: { languages_code: locale }
      },
      limit: 1
    });
    
    // Wenn keine Daten zurückgegeben wurden, null zurückgeben
    if (!response.data || response.data.length === 0) {
      console.warn(`No hotel found with slug: ${slug}`);
      return null;
    }
    
    // Hotel für die Frontend-Anzeige verarbeiten
    const hotel = prepareItem<Hotel>(response.data[0], locale, ['main_image', 'gallery']);
    
    if (hotel) {
      console.log(`Hotel found: ${hotel.name}, preparing data`);
    }
    
    return hotel;
  } catch (error) {
    console.error(`Error fetching hotel by slug ${slug}:`, error);
    return null;
  }
}

/**
 * Hilfsfunktion, um die URL für ein Asset zu generieren
 * @param fileId - Datei-ID
 * @param options - Optionen für Bildtransformation
 * @returns Asset-URL
 */
export function getAssetUrl(fileId: string | undefined, options: AssetOptions = {}): string {
  if (!fileId) return '';
  
  // Wenn fileId bereits eine URL ist, direkt zurückgeben
  if (typeof fileId === 'string' && (fileId.startsWith('http') || fileId.startsWith('/'))) {
    return fileId;
  }
  
  const { width, height, quality = 80, format = 'webp', fit = 'cover' } = options;
  
  // Parameter vorbereiten
  const params = new URLSearchParams();
  if (width) params.append('width', width.toString());
  if (height) params.append('height', height.toString());
  if (quality) params.append('quality', quality.toString());
  if (format) params.append('format', format);
  if (fit) params.append('fit', fit);
  
  const paramsString = params.toString() ? `?${params.toString()}` : '';
  return `${DIRECTUS_URL}/assets/${fileId}${paramsString}`;
}

/**
 * Verarbeitet Übersetzungsdaten basierend auf dem ausgewählten Gebietsschema
 * @param item - Element mit Übersetzungen
 * @param locale - Gebietsschema (z.B. 'de-DE', 'en-US')
 * @param fields - Felder, die übersetzt werden sollen
 * @returns Element mit integrierten Übersetzungen
 */
export function processTranslations<T extends ItemWithTranslations>(
  item: T | null, 
  locale: string = 'de-DE', 
  fields: string[] = []
): T | null {
  // Wenn keine Übersetzungen vorhanden sind, Original zurückgeben
  if (!item) return item;
  
  // Kopie des Elements erstellen
  const processedItem = { ...item };
  
  // Prüfen ob translations als Array oder als Objekt vorliegt
  if (processedItem.translations) {
    let translation: Record<string, any> | null = null;
    
    // Fall 1: translations ist ein Array von Übersetzungsobjekten
    if (Array.isArray(processedItem.translations)) {
      // Übersetzung für das angegebene Gebietsschema finden
      const foundTranslation = processedItem.translations.find(t => 
        t.languages_code === locale || t.languages_id === locale
      );
      
      if (foundTranslation) {
        translation = foundTranslation;
      }
    }
    // Fall 2: translations ist ein verschachteltes Objekt von Directus
    else if (typeof processedItem.translations === 'object') {
      // In diesem Fall die Übersetzungsdaten direkt nutzen
      translation = processedItem.translations;
    }
    
    // Wenn Übersetzung gefunden wurde, diese anwenden
    if (translation) {
      // Wenn keine spezifischen Felder angegeben sind, alle Felder aus der Übersetzung übernehmen
      if (!fields || fields.length === 0) {
        // Übersetzungsfelder auf das Hauptobjekt anwenden, außer metadata
        Object.keys(translation).forEach(key => {
          if (key !== 'id' && key !== 'languages_code' && key !== 'languages_id' && 
              key !== 'item' && key !== 'metadata') {
            if (translation[key] !== null && translation[key] !== undefined) {
              // Verwende ein generisches Record für dynamische Zuweisungen
              (processedItem as Record<string, any>)[key] = translation[key];
            }
          }
        });
      } else {
        // Nur die angegebenen Felder aus der Übersetzung übernehmen
        fields.forEach(field => {
          if (translation[field] !== null && translation[field] !== undefined) {
            // Verwende ein generisches Record für dynamische Zuweisungen
            (processedItem as Record<string, any>)[field] = translation[field];
          }
        });
      }
    }
  }
  
  return processedItem;
}

/**
 * Verarbeitet Bilder in einem Element
 * @param item - Element mit Bildern
 * @param imageFields - Bildfelder (z.B. ['main_image', 'gallery'])
 * @returns Element mit verarbeiteten Bildfeldern
 */
export function processImages<T extends Record<string, any>>(
  item: T | null, 
  imageFields: string[] = ['main_image', 'gallery']
): T | null {
  if (!item) return item;
  
  // Kopie des Elements erstellen
  const processedItem = { ...item } as Record<string, any>;
  
  // Bilder verarbeiten
  imageFields.forEach(field => {
    if (field === 'gallery' && item[field] && Array.isArray(item[field])) {
      // Gallery-Feld als Array verarbeiten
      processedItem[field] = item[field].map((galleryItem: GalleryItem | string) => {
        if (typeof galleryItem === 'object' && galleryItem.image) {
          return {
            ...galleryItem,
            url: getAssetUrl(galleryItem.image)
          };
        } else if (typeof galleryItem === 'string') {
          return {
            id: galleryItem,
            url: getAssetUrl(galleryItem)
          };
        }
        return galleryItem;
      });
    } else if (item[field]) {
      // Einzelnes Bildfeld
      if (typeof item[field] === 'object' && item[field].id) {
        processedItem[`${field}_url`] = getAssetUrl(item[field].id);
      } else {
        processedItem[`${field}_url`] = getAssetUrl(item[field]);
      }
    }
  });
  
  return processedItem as T;
}

/**
 * Bereitet ein Element für die Frontend-Verwendung vor
 * @param item - Rohes Element aus Directus
 * @param locale - Gebietsschema
 * @param imageFields - Bildfelder
 * @returns Aufbereitetes Element
 */
export function prepareItem<T extends Record<string, any>>(
  item: T | null, 
  locale: string = 'de-DE', 
  imageFields: string[] = ['main_image', 'gallery']
): T | null {
  if (!item) return null;
  
  // Kopie erstellen mit Normalisierung von Feldern
  const normalizedItem: Record<string, any> = { ...item };
  
  // Stelle sicher, dass ein name-Feld existiert
  if (!normalizedItem.name && normalizedItem.title) {
    normalizedItem.name = normalizedItem.title;
  }
  
  // Stelle sicher, dass ein slug-Feld existiert
  if (!normalizedItem.slug && normalizedItem.id) {
    normalizedItem.slug = `item-${normalizedItem.id}`;
  }
  
  // Stelle sicher, dass eine status-Standardeinstellung existiert
  if (!normalizedItem.status) {
    normalizedItem.status = 'published';
  }
  
  // Übersetzungen verarbeiten
  const withTranslations = processTranslations(normalizedItem, locale);
  
  // Bilder verarbeiten
  const withImages = processImages(withTranslations, imageFields);
  
  // Verwende Type Assertion erst am Ende, wenn alle Verarbeitungen abgeschlossen sind
  return withImages as T;
}

/**
 * Bereitet eine Liste von Elementen für die Frontend-Verwendung vor
 * @param items - Liste von Elementen
 * @param locale - Gebietsschema
 * @param imageFields - Bildfelder
 * @returns Aufbereitete Liste
 */
export function prepareItems<T extends Record<string, any>>(
  items: T[] | null, 
  locale: string = 'de-DE', 
  imageFields: string[] = ['main_image', 'gallery']
): T[] {
  if (!items || !Array.isArray(items)) return [];
  
  // Typensichere Filterung mit Type Guard
  return items
    .map(item => prepareItem(item, locale, imageFields))
    .filter((item): item is T => item !== null);
}

// Export der Hilfsfunktionen
export default {
  fetchFromDirectus,
  fetchHotels,
  fetchHotelBySlug,
  getAssetUrl,
  processTranslations,
  processImages,
  prepareItem,
  prepareItems
};