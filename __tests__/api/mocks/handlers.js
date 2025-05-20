import { rest } from 'msw';

// Importiere Mock-Daten
import { mockHotels } from './data/hotels';
import { mockDestinations } from './data/destinations';
import { mockCategories } from './data/categories';
import { mockRooms } from './data/rooms';
import { mockPages } from './data/pages';
import { mockTranslations } from './data/translations';

// Base URL für Directus API
const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

/**
 * Helfer-Funktion zur Filterung von Daten basierend auf Query-Parametern
 * Unterstützt die wichtigsten Directus-Filter
 */
function applyFilters(data, filters) {
  if (!filters) return data;
  
  return data.filter(item => {
    // Prüfe jeden Filter
    for (const [key, value] of Object.entries(filters)) {
      // Überspringe leere Filter
      if (!value) continue;
      
      // Unterstützte Operatoren: _eq, _in, _gt, _lt, _null, _contains, _gte, _lte
      if (typeof value === 'object') {
        // Prüfen auf mehrere Operatoren (z.B. Range-Filter wie {_gte: X, _lte: Y})
        if (Object.keys(value).length > 1) {
          for (const [op, val] of Object.entries(value)) {
            if (!applyOperator(item, key, op, val)) return false;
          }
        } else {
          const operator = Object.keys(value)[0];
          const filterValue = value[operator];
          if (!applyOperator(item, key, operator, filterValue)) return false;
        }
      } else {
        // Einfacher Gleichheitsfilter
        if (item[key] !== value) return false;
      }
    }
    
    return true;
  });
}

/**
 * Wendet einen einzelnen Filter-Operator an
 */
function applyOperator(item, key, operator, filterValue) {
  // Behandlung für nicht vorhandene Werte
  if (item[key] === undefined || item[key] === null) {
    if (operator === '_null') return filterValue === true;
    return false;
  }
  
  switch (operator) {
    case '_eq':
      return item[key] === filterValue;
    case '_neq':
      return item[key] !== filterValue;
    case '_in':
      return Array.isArray(filterValue) && filterValue.includes(item[key]);
    case '_gt':
      return item[key] > filterValue;
    case '_lt':
      return item[key] < filterValue;
    case '_gte':
      return item[key] >= filterValue;
    case '_lte':
      return item[key] <= filterValue;
    case '_null':
      const isNull = item[key] === null || item[key] === undefined;
      return filterValue ? isNull : !isNull;
    case '_contains':
      // Array enthält Element oder String enthält Substring
      if (Array.isArray(item[key])) {
        // Wenn filterValue ein Array ist, prüfen ob einer der Werte enthalten ist
        if (Array.isArray(filterValue)) {
          return filterValue.some(val => item[key].includes(val));
        }
        // Sonst prüfen ob der einzelne Wert enthalten ist
        return item[key].includes(filterValue);
      } else if (typeof item[key] === 'string') {
        return item[key].includes(filterValue);
      }
      return false;
    default:
      // Unbekannter Operator
      console.warn(`Unbekannter Filter-Operator: ${operator}`);
      return true; // Unbekannte Operatoren ignorieren
  }
}

/**
 * Helfer-Funktion zum Anwenden von Sortierung
 */
function applySorting(data, sort) {
  if (!sort || !Array.isArray(sort) || sort.length === 0) return [...data];
  
  const sortedData = [...data];
  
  sortedData.sort((a, b) => {
    // Durchlaufe alle Sortierkriterien
    for (const criteria of sort) {
      const isDesc = criteria.startsWith('-');
      const field = isDesc ? criteria.substring(1) : criteria;
      
      if (a[field] < b[field]) return isDesc ? 1 : -1;
      if (a[field] > b[field]) return isDesc ? -1 : 1;
    }
    
    return 0;
  });
  
  return sortedData;
}

/**
 * Helfer-Funktion zum Extrahieren von Parametern aus der URL
 */
function extractParams(url) {
  const searchParams = new URL(url).searchParams;
  
  // Extrahiere Pagination
  const limit = parseInt(searchParams.get('limit')) || 100;
  const offset = parseInt(searchParams.get('offset')) || 0;
  
  // Extrahiere Sortierung
  const sort = searchParams.get('sort')?.split(',') || ['-date_created'];
  
  // Extrahiere Filter
  let filter = {};
  const filterParam = searchParams.get('filter');
  if (filterParam) {
    try {
      filter = JSON.parse(filterParam);
    } catch (error) {
      console.error('Fehler beim Parsen des Filters:', error);
    }
  }
  
  // Extrahiere zusätzliche Parameter
  const fields = searchParams.get('fields')?.split(',');
  
  return { limit, offset, sort, filter, fields };
}

/**
 * Verzögert die Antwort um eine zufällige Zeit (für Simulationen)
 */
async function simulateNetworkDelay(minMs = 10, maxMs = 200) {
  const delayMs = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise(resolve => setTimeout(resolve, delayMs));
}

/**
 * Handler für Directus API
 */
export const directusHandlers = [
  // Hotels Endpunkte
  rest.get(`${DIRECTUS_URL}/items/hotels`, async (req, res, ctx) => {
    await simulateNetworkDelay();
    
    const { limit, offset, sort, filter } = extractParams(req.url.toString());
    
    // Filter und sortiere die Daten
    let filteredData = applyFilters(mockHotels, filter);
    filteredData = applySorting(filteredData, sort);
    
    // Paginierung anwenden
    const paginatedData = filteredData.slice(offset, offset + limit);
    
    return res(
      ctx.status(200),
      ctx.json(paginatedData)
    );
  }),
  
  // Hotel by ID Endpunkt
  rest.get(`${DIRECTUS_URL}/items/hotels/:id`, async (req, res, ctx) => {
    await simulateNetworkDelay();
    
    const { id } = req.params;
    const hotel = mockHotels.find(hotel => hotel.id === id || hotel.slug === id);
    
    if (hotel) {
      return res(
        ctx.status(200),
        ctx.json(hotel)
      );
    }
    
    return res(
      ctx.status(404)
    );
  }),
  
  // Destinations Endpunkte
  rest.get(`${DIRECTUS_URL}/items/destinations`, async (req, res, ctx) => {
    await simulateNetworkDelay();
    
    const { limit, offset, sort, filter } = extractParams(req.url.toString());
    
    // Filter und sortiere die Daten
    let filteredData = applyFilters(mockDestinations, filter);
    filteredData = applySorting(filteredData, sort);
    
    // Paginierung anwenden
    const paginatedData = filteredData.slice(offset, offset + limit);
    
    return res(
      ctx.status(200),
      ctx.json(paginatedData)
    );
  }),
  
  // Destination by ID Endpunkt
  rest.get(`${DIRECTUS_URL}/items/destinations/:id`, async (req, res, ctx) => {
    await simulateNetworkDelay();
    
    const { id } = req.params;
    const destination = mockDestinations.find(destination => destination.id === id || destination.slug === id);
    
    if (destination) {
      return res(
        ctx.status(200),
        ctx.json(destination)
      );
    }
    
    return res(
      ctx.status(404)
    );
  }),
  
  // Categories Endpunkte
  rest.get(`${DIRECTUS_URL}/items/categories`, async (req, res, ctx) => {
    await simulateNetworkDelay();
    
    const { limit, offset, sort, filter } = extractParams(req.url.toString());
    
    // Filter und sortiere die Daten
    let filteredData = applyFilters(mockCategories, filter);
    filteredData = applySorting(filteredData, sort);
    
    // Paginierung anwenden
    const paginatedData = filteredData.slice(offset, offset + limit);
    
    return res(
      ctx.status(200),
      ctx.json(paginatedData)
    );
  }),
  
  // Rooms Endpunkte
  rest.get(`${DIRECTUS_URL}/items/rooms`, async (req, res, ctx) => {
    await simulateNetworkDelay();
    
    const { limit, offset, sort, filter } = extractParams(req.url.toString());
    
    // Filter und sortiere die Daten
    let filteredData = applyFilters(mockRooms, filter);
    filteredData = applySorting(filteredData, sort);
    
    // Paginierung anwenden
    const paginatedData = filteredData.slice(offset, offset + limit);
    
    return res(
      ctx.status(200),
      ctx.json(paginatedData)
    );
  }),
  
  // Pages Endpunkte
  rest.get(`${DIRECTUS_URL}/items/pages`, async (req, res, ctx) => {
    await simulateNetworkDelay();
    
    const { limit, offset, sort, filter } = extractParams(req.url.toString());
    
    // Filter und sortiere die Daten
    let filteredData = applyFilters(mockPages, filter);
    filteredData = applySorting(filteredData, sort);
    
    // Paginierung anwenden
    const paginatedData = filteredData.slice(offset, offset + limit);
    
    return res(
      ctx.status(200),
      ctx.json(paginatedData)
    );
  }),
  
  // Page by ID/Slug Endpunkt
  rest.get(`${DIRECTUS_URL}/items/pages/:id`, async (req, res, ctx) => {
    await simulateNetworkDelay();
    
    const { id } = req.params;
    const page = mockPages.find(page => page.id === id || page.slug === id);
    
    if (page) {
      return res(
        ctx.status(200),
        ctx.json(page)
      );
    }
    
    return res(
      ctx.status(404)
    );
  }),
  
  // Translations Endpunkte
  rest.get(`${DIRECTUS_URL}/items/translations`, async (req, res, ctx) => {
    await simulateNetworkDelay();
    
    const { limit, offset, sort, filter } = extractParams(req.url.toString());
    
    // Filter und sortiere die Daten
    let filteredData = applyFilters(mockTranslations, filter);
    filteredData = applySorting(filteredData, sort);
    
    // Paginierung anwenden
    const paginatedData = filteredData.slice(offset, offset + limit);
    
    return res(
      ctx.status(200),
      ctx.json(paginatedData)
    );
  }),
  
  // Fehlerszenarien
  rest.get(`${DIRECTUS_URL}/items/error`, async (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({ message: 'Internal Server Error' })
    );
  }),
  
  // Timeout Szenario
  rest.get(`${DIRECTUS_URL}/items/timeout`, async (req, res, ctx) => {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Langer Delay
    return res(
      ctx.status(200),
      ctx.json({ message: 'This response was delayed' })
    );
  }),
];

/**
 * Handler für eigene API-Routen
 */
export const nextApiHandlers = [
  // Hotels API - Liste und Filter
  rest.get('http://localhost:3000/api/hotels', async (req, res, ctx) => {
    await simulateNetworkDelay();
    
    const url = new URL(req.url.toString());
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const filterParam = url.searchParams.get('filter');
    const sortParam = url.searchParams.get('sort');
    const locale = url.searchParams.get('locale') || 'en-US';
    
    // Filter verarbeiten
    let filter = { status: { _eq: 'published' } };
    if (filterParam) {
      try {
        filter = JSON.parse(filterParam);
      } catch (e) {
        console.error('Fehler beim Parsen des Filter-Parameters:', e);
      }
    }
    
    // Filter und sortiere die Daten
    let filteredData = applyFilters(mockHotels, filter);
    
    // Sortierung anwenden
    if (sortParam) {
      const sort = Array.isArray(sortParam) ? sortParam : [sortParam];
      filteredData = applySorting(filteredData, sort);
    }
    
    // Paginierung anwenden
    const paginatedData = filteredData.slice(offset, offset + limit);
    
    // Metadaten (für Paginierung)
    const totalCount = filteredData.length;
    const pageCount = Math.ceil(totalCount / limit);
    
    return res(
      ctx.status(200),
      ctx.set({
        'Cache-Control': 'max-age=60, stale-while-revalidate=600',
        'X-Total-Count': totalCount.toString(),
        'X-Page-Count': pageCount.toString()
      }),
      ctx.json(paginatedData)
    );
  }),
  
  // Hotel by Slug/ID API
  rest.get('http://localhost:3000/api/hotels/:slug', async (req, res, ctx) => {
    await simulateNetworkDelay();
    
    const { slug } = req.params;
    const url = new URL(req.url.toString());
    const locale = url.searchParams.get('locale') || 'en-US';
    
    // Prüfen auf leeren Slug
    if (!slug || slug === '') {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Hotel slug is required' })
      );
    }
    
    // Überprüfen, ob es eine ID ist
    const isId = !isNaN(slug) || mockHotels.some(h => h.id === slug);
    
    // Hotel suchen, entweder nach ID oder nach Slug
    const hotel = isId
      ? mockHotels.find(h => h.id === slug && h.status === 'published')
      : mockHotels.find(h => h.slug === slug && h.status === 'published');
    
    if (hotel) {
      // Simuliere mehrsprachige Inhalte je nach locale-Parameter
      let localizedHotel = { ...hotel };
      
      // Hier könnten wir Lokalisierungen für verschiedene Sprachen implementieren
      // Beispiel:
      // if (locale === 'de-DE') {
      //   localizedHotel.name = `${hotel.name} (Deutsch)`;
      //   // Weitere Lokalisierungen
      // }
      
      return res(
        ctx.status(200),
        ctx.set({
          'Cache-Control': 'max-age=300, stale-while-revalidate=3600',
          'x-cache': url.searchParams.has('cache-hit') ? 'HIT' : 'MISS'
        }),
        ctx.json(localizedHotel)
      );
    }
    
    return res(
      ctx.status(404),
      ctx.json({ error: 'Hotel not found' })
    );
  }),
  
  // Destinations API
  rest.get('/api/destinations', async (req, res, ctx) => {
    await simulateNetworkDelay();
    
    const url = new URL(req.url.toString());
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const filterParam = url.searchParams.get('filter');
    const region = url.searchParams.get('region');
    
    // Filter erstellen
    let filter = { status: { _eq: 'published' } };
    if (filterParam) {
      try {
        filter = JSON.parse(filterParam);
      } catch (e) {
        console.error('Fehler beim Parsen des Filter-Parameters:', e);
      }
    }
    
    // Region-Filter hinzufügen, wenn vorhanden
    if (region && !filter.region) {
      filter.region = { _eq: region };
    }
    
    // Filter und sortiere die Daten
    let filteredData = applyFilters(mockDestinations, filter);
    
    // Paginierung anwenden
    const paginatedData = filteredData.slice(offset, offset + limit);
    
    return res(
      ctx.status(200),
      ctx.json(paginatedData)
    );
  }),
  
  // Destination by Slug API
  rest.get('/api/destinations/:slug', async (req, res, ctx) => {
    await simulateNetworkDelay();
    
    const { slug } = req.params;
    const destination = mockDestinations.find(
      destination => destination.slug === slug && destination.status === 'published'
    );
    
    if (destination) {
      return res(
        ctx.status(200),
        ctx.json(destination)
      );
    }
    
    return res(
      ctx.status(404),
      ctx.json({ error: 'Destination not found' })
    );
  }),
  
  // Categories API
  rest.get('/api/categories', async (req, res, ctx) => {
    await simulateNetworkDelay();
    
    return res(
      ctx.status(200),
      ctx.json(mockCategories)
    );
  }),
  
  // Rooms by Hotel API
  rest.get('http://localhost:3000/api/rooms/:hotelId', async (req, res, ctx) => {
    await simulateNetworkDelay();
    
    const { hotelId } = req.params;
    const url = new URL(req.url.toString());
    const locale = url.searchParams.get('locale') || 'en-US';
    
    // Prüfen auf leeren oder ungültigen hotelId
    if (!hotelId) {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Hotel ID is required' })
      );
    }
    
    // Filtern der Räume nach Hotel und Status
    const rooms = mockRooms.filter(
      room => room.hotel === hotelId && room.status === 'published'
    );
    
    // Falls keine Räume gefunden wurden, trotzdem leeres Array zurückgeben
    // (im Gegensatz zu 404 bei Hotels, die wirklich nicht existieren)
    return res(
      ctx.status(200),
      ctx.set({
        'Cache-Control': 'max-age=300, stale-while-revalidate=3600'
      }),
      ctx.json(rooms)
    );
  }),
  
  // Pages API
  rest.get('http://localhost:3000/api/pages/:slug', async (req, res, ctx) => {
    await simulateNetworkDelay();
    
    const { slug } = req.params;
    
    // Handle empty slug case
    if (!slug || slug === '') {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Page slug is required' })
      );
    }
    
    const page = mockPages.find(
      page => page.slug === slug && page.status === 'published'
    );
    
    if (page) {
      return res(
        ctx.status(200),
        ctx.json(page)
      );
    }
    
    return res(
      ctx.status(404),
      ctx.json({ error: 'Page not found' })
    );
  }),
  
  // Empty slug path handler
  rest.get('http://localhost:3000/api/pages/', async (req, res, ctx) => {
    await simulateNetworkDelay();
    
    return res(
      ctx.status(400),
      ctx.json({ error: 'Page slug is required' })
    );
  }),
  
  // Translations API
  rest.get('http://localhost:3000/api/translations', async (req, res, ctx) => {
    await simulateNetworkDelay();
    
    const url = new URL(req.url.toString());
    let language = url.searchParams.get('language') || 'en-US';
    
    // Check if language is supported, fall back to default if not
    const supportedLanguages = ['en-US', 'de-DE']; // Define supported languages
    if (!supportedLanguages.includes(language)) {
      language = 'en-US'; // Default to en-US for unsupported languages
    }
    
    // Filtern nach Sprache
    const translations = mockTranslations.filter(t => t.language === language);
    
    // In ein Key-Value-Format umwandeln
    const translationsObject = {};
    translations.forEach(t => {
      translationsObject[t.key] = t.value;
    });
    
    return res(
      ctx.status(200),
      ctx.json(translationsObject)
    );
  }),
  
  // Fehlerszenarien API
  rest.get('/api/error', async (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({ error: 'Internal Server Error' })
    );
  }),
  
  // Timeout Szenario API
  rest.get('/api/timeout', async (req, res, ctx) => {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Langer Delay
    return res(
      ctx.status(200),
      ctx.json({ message: 'This response was delayed' })
    );
  }),
];

// Alle Handler kombinieren
export const handlers = [
  ...directusHandlers,
  ...nextApiHandlers,
];