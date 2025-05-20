/**
 * Directus Client
 * Robuste API-Schnittstelle zum Directus CMS
 */

// Konfiguration
const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const API_TOKEN = process.env.DIRECTUS_PUBLIC_TOKEN || process.env.DIRECTUS_TOKEN;

/**
 * Basisfunktion für API-Aufrufe an Directus
 * @param {string} endpoint - API-Endpunkt
 * @param {object} options - Zusätzliche Optionen (Filter, Felder, etc.)
 * @returns {Promise<object>} API-Antwort
 */
export async function fetchFromDirectus(endpoint, options = {}) {
  try {
    // Parameter vorbereiten
    const params = new URLSearchParams();
    
    // Filter hinzufügen
    if (options.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        params.append(`filter[${key}][_eq]`, value);
      });
    }
    
    // Erweiterte Filter hinzufügen (für komplexere Bedingungen)
    if (options.advancedFilter) {
      for (const [key, conditions] of Object.entries(options.advancedFilter)) {
        for (const [operator, value] of Object.entries(conditions)) {
          params.append(`filter[${key}][${operator}]`, value);
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
        for (const [filterKey, filterValue] of Object.entries(filters)) {
          params.append(`deep[${relation}][${filterKey}]`, filterValue);
        }
      }
    }
    
    // Limit und Offset hinzufügen
    if (options.limit) params.append('limit', options.limit);
    if (options.offset) params.append('offset', options.offset);
    
    // Sortierung hinzufügen
    if (options.sort) {
      const sortStr = Array.isArray(options.sort) ? options.sort.join(',') : options.sort;
      params.append('sort', sortStr);
    }
    
    // API-Aufruf ausführen
    const url = `${DIRECTUS_URL}/${endpoint}?${params.toString()}`;
    
    // Ändere hier die Authentifizierungsmethode auf Authorization Header
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} - ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Hilfsfunktion, um die URL für ein Asset zu generieren
 * @param {string} fileId - Datei-ID
 * @param {object} options - Optionen für Bildtransformation
 * @returns {string} Asset-URL
 */
export function getAssetUrl(fileId, options = {}) {
  if (!fileId) return '';
  
  const { width, height, quality = 80, format = 'webp', fit = 'cover' } = options;
  
  // Parameter vorbereiten
  const params = new URLSearchParams();
  if (width) params.append('width', width);
  if (height) params.append('height', height);
  if (quality) params.append('quality', quality);
  if (format) params.append('format', format);
  if (fit) params.append('fit', fit);
  
  const paramsString = params.toString() ? `?${params.toString()}` : '';
  return `${DIRECTUS_URL}/assets/${fileId}${paramsString}`;
}

/**
 * Verarbeitet Übersetzungsdaten basierend auf dem ausgewählten Gebietsschema
 * @param {object} item - Element mit Übersetzungen
 * @param {string} locale - Gebietsschema (z.B. 'de-DE', 'en-US')
 * @param {array} fields - Felder, die übersetzt werden sollen
 * @returns {object} Element mit integrierten Übersetzungen
 */
export function processTranslations(item, locale = 'de-DE', fields = []) {
  // Wenn keine Übersetzungen vorhanden sind, Original zurückgeben
  if (!item || !item.translations || !Array.isArray(item.translations)) {
    return item;
  }
  
  // Kopie des Elements erstellen
  const processedItem = { ...item };
  
  // Übersetzung für das angegebene Gebietsschema finden
  const translation = item.translations.find(t => 
    t.languages_code === locale || t.languages_id === locale
  );
  
  // Wenn keine Übersetzung gefunden wurde, Original zurückgeben
  if (!translation) return processedItem;
  
  // Wenn keine spezifischen Felder angegeben sind, alle Felder aus der Übersetzung übernehmen
  if (!fields || fields.length === 0) {
    // Übersetzungsfelder auf das Hauptobjekt anwenden, außer metadata
    Object.keys(translation).forEach(key => {
      if (key !== 'id' && key !== 'languages_code' && key !== 'languages_id' && 
          key !== 'item' && key !== 'metadata') {
        if (translation[key] !== null && translation[key] !== undefined) {
          processedItem[key] = translation[key];
        }
      }
    });
  } else {
    // Nur die angegebenen Felder aus der Übersetzung übernehmen
    fields.forEach(field => {
      if (translation[field] !== null && translation[field] !== undefined) {
        processedItem[field] = translation[field];
      }
    });
  }
  
  return processedItem;
}

/**
 * Verarbeitet Bilder in einem Element
 * @param {object} item - Element mit Bildern
 * @param {array} imageFields - Bildfelder (z.B. ['main_image', 'gallery'])
 * @returns {object} Element mit verarbeiteten Bildfeldern
 */
export function processImages(item, imageFields = ['main_image', 'gallery']) {
  if (!item) return item;
  
  // Kopie des Elements erstellen
  const processedItem = { ...item };
  
  // Primäres Bild verarbeiten (z.B. main_image)
  imageFields.forEach(field => {
    if (field === 'gallery' && item[field] && Array.isArray(item[field])) {
      // Gallery-Feld als Array verarbeiten
      processedItem[field] = item[field].map(galleryItem => {
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
  
  return processedItem;
}

/**
 * Bereitet ein Element für die Frontend-Verwendung vor
 * @param {object} item - Rohes Element aus Directus
 * @param {string} locale - Gebietsschema
 * @param {array} imageFields - Bildfelder
 * @returns {object} Aufbereitetes Element
 */
export function prepareItem(item, locale = 'de-DE', imageFields = ['main_image', 'gallery']) {
  if (!item) return null;
  
  // Übersetzungen verarbeiten
  const withTranslations = processTranslations(item, locale);
  
  // Bilder verarbeiten
  const withImages = processImages(withTranslations, imageFields);
  
  return withImages;
}

/**
 * Bereitet eine Liste von Elementen für die Frontend-Verwendung vor
 * @param {array} items - Liste von Elementen
 * @param {string} locale - Gebietsschema
 * @param {array} imageFields - Bildfelder
 * @returns {array} Aufbereitete Liste
 */
export function prepareItems(items, locale = 'de-DE', imageFields = ['main_image', 'gallery']) {
  if (!items || !Array.isArray(items)) return [];
  
  return items.map(item => prepareItem(item, locale, imageFields));
}

// Export der Hilfsfunktionen
export default {
  fetchFromDirectus,
  getAssetUrl,
  processTranslations,
  processImages,
  prepareItem,
  prepareItems
};