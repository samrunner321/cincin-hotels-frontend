/**
 * Directus API
 * Spezifische API-Funktionen für die CinCin Hotels Collections
 */

import { fetchFromDirectus, prepareItem, prepareItems } from './directus-client';

/**
 * Sprachspezifische API-Anfragen
 */
const DEFAULT_LOCALE = 'de-DE';
const FALLBACK_LOCALE = 'en-US';

/**
 * Alle Hotels abrufen
 * @param {object} options - Abfrageparameter
 * @param {string} locale - Gebietsschema
 * @returns {Promise<object>} Hotels mit Metadaten
 */
export async function fetchHotels(options = {}, locale = DEFAULT_LOCALE) {
  try {
    // Standardfilter: nur veröffentlichte Hotels
    const filter = { 
      status: { _eq: 'Published' },
      ...options.filter 
    };
    
    // API-Anfrage mit verbesserten Parametern
    const response = await fetchFromDirectus('items/hotels', {
      filter,
      fields: '*,main_image.*,translations.*,destination.*,destination.translations.*',
      deep: { 
        translations: { languages_code: { _eq: locale } },
        'destination.translations': { languages_code: { _eq: locale } }
      },
      limit: options.limit || 100,
      offset: options.offset || 0,
      sort: options.sort || '-date_created'
    });
    
    // Daten verarbeiten
    const processedHotels = prepareItems(response.data, locale, ['main_image']);
    
    return {
      data: processedHotels,
      meta: response.meta
    };
  } catch (error) {
    console.error('Error fetching hotels:', error);
    // Fallback
    return {
      data: [],
      error: error.message,
      meta: { filter_count: 0, total_count: 0 }
    };
  }
}

/**
 * Hotel nach Slug abrufen
 * @param {string} slug - Hotel-Slug
 * @param {string} locale - Gebietsschema
 * @returns {Promise<object>} Hotel-Objekt
 */
export async function fetchHotelBySlug(slug, locale = DEFAULT_LOCALE) {
  try {
    // Filter für Hotel-Slug
    const filter = { 
      slug: { _eq: slug }, 
      status: { _eq: 'Published' } 
    };
    
    // API-Anfrage mit verbesserten Parametern
    const response = await fetchFromDirectus('items/hotels', {
      filter,
      fields: '*,main_image.*,gallery.image.*,translations.*,destination.*,destination.translations.*',
      deep: { 
        translations: { languages_code: { _eq: locale } },
        'destination.translations': { languages_code: { _eq: locale } }
      },
      limit: 1
    });
    
    // Wenn kein Hotel gefunden wurde
    if (!response.data || response.data.length === 0) {
      throw new Error(`Hotel not found with slug: ${slug}`);
    }
    
    // Hotel verarbeiten
    const hotel = prepareItem(response.data[0], locale, ['main_image', 'gallery']);
    
    // Zimmer für dieses Hotel abrufen
    try {
      const roomsResponse = await fetchFromDirectus('items/rooms', {
        filter: { 
          hotel: { _eq: hotel.id }, 
          status: { _eq: 'Published' } 
        },
        fields: '*,main_image.*,translations.*',
        deep: { translations: { languages_code: { _eq: locale } } }
      });
      
      // Zimmer verarbeiten
      const rooms = prepareItems(roomsResponse.data || [], locale, ['main_image']);
      hotel.rooms = rooms;
    } catch (roomsError) {
      console.error('Error fetching rooms:', roomsError);
      hotel.rooms = [];
    }
    
    return { data: hotel };
  } catch (error) {
    console.error(`Error fetching hotel by slug ${slug}:`, error);
    return { data: null, error: error.message };
  }
}

/**
 * Alle Destinationen abrufen
 * @param {object} options - Abfrageparameter
 * @param {string} locale - Gebietsschema
 * @returns {Promise<object>} Destinationen mit Metadaten
 */
export async function fetchDestinations(options = {}, locale = DEFAULT_LOCALE) {
  try {
    // Standardfilter: nur veröffentlichte Destinationen
    const filter = { 
      status: { _eq: 'Published' }, 
      ...options.filter 
    };
    
    // API-Anfrage mit verbesserten Parametern
    const response = await fetchFromDirectus('items/destinations', {
      filter,
      fields: '*,main_image.*,translations.*',
      deep: { translations: { languages_code: { _eq: locale } } },
      limit: options.limit || 100,
      offset: options.offset || 0,
      sort: options.sort || '-date_created'
    });
    
    // Daten verarbeiten
    const processedDestinations = prepareItems(response.data, locale, ['main_image']);
    
    return {
      data: processedDestinations,
      meta: response.meta
    };
  } catch (error) {
    console.error('Error fetching destinations:', error);
    // Fallback für Destinationen
    return {
      data: [
        {
          id: 1,
          slug: 'schweizer-alpen',
          name: 'Schweizer Alpen',
          country: 'Schweiz',
          region: 'Alps',
          description: 'Majestätische Berglandschaft mit kristallklaren Seen und charmanten Dörfern.',
          main_image_url: '/images/destinations/mountain.jpg.webp',
          categories: ['Mountains'],
          is_featured: true,
          is_popular: true
        },
        {
          id: 2,
          slug: 'mailand',
          name: 'Mailand',
          country: 'Italien',
          region: 'City',
          description: 'Modemetropole mit reicher Geschichte und pulsierendem Stadtleben.',
          main_image_url: '/images/destinations/city.jpg.webp',
          categories: ['City'],
          is_featured: true,
          is_popular: false
        }
      ],
      error: error.message,
      meta: { filter_count: 2, total_count: 2 }
    };
  }
}

/**
 * Destination nach Slug abrufen
 * @param {string} slug - Destination-Slug
 * @param {string} locale - Gebietsschema
 * @returns {Promise<object>} Destination-Objekt
 */
export async function fetchDestinationBySlug(slug, locale = DEFAULT_LOCALE) {
  try {
    // Filter für Destination-Slug
    const filter = { slug, status: 'Published' };
    
    // API-Anfrage
    const response = await fetchFromDirectus('items/destinations', {
      filter,
      fields: '*,main_image.*,gallery.image.*,translations.*,highlights.image.*,activities.image.*',
      deep: { translations: { languages_code: locale } },
      limit: 1
    });
    
    // Wenn keine Destination gefunden wurde
    if (!response.data || response.data.length === 0) {
      throw new Error(`Destination not found with slug: ${slug}`);
    }
    
    // Destination verarbeiten
    const destination = prepareItem(response.data[0], locale, 
      ['main_image', 'gallery', 'highlights.image', 'activities.image']);
    
    // Hotels für diese Destination abrufen
    try {
      const hotelsResponse = await fetchFromDirectus('items/hotels', {
        filter: { destination: destination.id, status: 'Published' },
        fields: '*,main_image.*,translations.*',
        deep: { translations: { languages_code: locale } }
      });
      
      // Hotels verarbeiten
      const hotels = prepareItems(hotelsResponse.data || [], locale, ['main_image']);
      destination.hotels = hotels;
    } catch (hotelsError) {
      console.error('Error fetching hotels for destination:', hotelsError);
      destination.hotels = [];
    }
    
    return { data: destination };
  } catch (error) {
    console.error(`Error fetching destination by slug ${slug}:`, error);
    return { data: null, error: error.message };
  }
}

/**
 * Alle Kategorien abrufen
 * @param {object} options - Abfrageparameter
 * @param {string} locale - Gebietsschema
 * @returns {Promise<object>} Kategorien mit Metadaten
 */
export async function fetchCategories(options = {}, locale = DEFAULT_LOCALE) {
  try {
    // Filter vorbereiten
    const filter = { ...options.filter };
    
    // Wenn Typ angegeben ist, entsprechend filtern
    if (options.type) {
      filter.type = options.type;
    }
    
    // Wenn featured angegeben ist, entsprechend filtern
    if (options.featured !== undefined) {
      filter.featured = options.featured;
    }
    
    // API-Anfrage
    const response = await fetchFromDirectus('items/categories', {
      filter,
      fields: '*,image.*,translations.*',
      deep: { translations: { languages_code: locale } },
      sort: options.sort || 'sort'
    });
    
    // Daten verarbeiten
    const processedCategories = prepareItems(response.data, locale, ['image']);
    
    return {
      data: processedCategories,
      meta: response.meta
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Fallback für Kategorien
    return {
      data: [
        {
          id: 1,
          slug: 'berge',
          name: 'Berge',
          description: 'Atemberaubende Berglandschaften mit frischer Luft und panoramischen Ausblicken.',
          icon: 'mountains',
          image_url: '/images/categories/mountain.jpg',
          type: 'both',
          featured: true
        },
        {
          id: 2,
          slug: 'stadt',
          name: 'Stadt',
          description: 'Urbane Erlebnisse mit Kultur, Gastronomie und Nachtleben.',
          icon: 'city',
          image_url: '/images/categories/city.jpg',
          type: 'both',
          featured: true
        },
        {
          id: 3,
          slug: 'wellness',
          name: 'Wellness & Spa',
          description: 'Entspannung und Regeneration in luxuriösen Spa-Umgebungen.',
          icon: 'spa',
          image_url: '/images/categories/spa.jpg',
          type: 'hotel',
          featured: true
        }
      ],
      error: error.message,
      meta: { filter_count: 3, total_count: 3 }
    };
  }
}

/**
 * Kategorie nach Slug abrufen
 * @param {string} slug - Kategorie-Slug
 * @param {string} locale - Gebietsschema
 * @returns {Promise<object>} Kategorie-Objekt
 */
export async function fetchCategoryBySlug(slug, locale = DEFAULT_LOCALE) {
  try {
    // Filter für Kategorie-Slug
    const filter = { slug };
    
    // API-Anfrage
    const response = await fetchFromDirectus('items/categories', {
      filter,
      fields: '*,image.*,translations.*',
      deep: { translations: { languages_code: locale } },
      limit: 1
    });
    
    // Wenn keine Kategorie gefunden wurde
    if (!response.data || response.data.length === 0) {
      throw new Error(`Category not found with slug: ${slug}`);
    }
    
    // Kategorie verarbeiten
    const category = prepareItem(response.data[0], locale, ['image']);
    
    return { data: category };
  } catch (error) {
    console.error(`Error fetching category by slug ${slug}:`, error);
    return { data: null, error: error.message };
  }
}

/**
 * Seite nach Slug abrufen
 * @param {string} slug - Seiten-Slug
 * @param {string} locale - Gebietsschema
 * @returns {Promise<object>} Seiten-Objekt
 */
export async function fetchPageBySlug(slug, locale = DEFAULT_LOCALE) {
  try {
    // Filter für Seiten-Slug
    const filter = { slug, status: 'Published' };
    
    // API-Anfrage
    const response = await fetchFromDirectus('items/pages', {
      filter,
      fields: '*,featured_image.*,translations.*',
      deep: { translations: { languages_code: locale } },
      limit: 1
    });
    
    // Wenn keine Seite gefunden wurde
    if (!response.data || response.data.length === 0) {
      throw new Error(`Page not found with slug: ${slug}`);
    }
    
    // Seite verarbeiten
    const page = prepareItem(response.data[0], locale, ['featured_image']);
    
    return { data: page };
  } catch (error) {
    console.error(`Error fetching page by slug ${slug}:`, error);
    
    // Fallback für bestimmte Seiten
    if (slug === 'ueber-uns') {
      return {
        data: {
          id: 1,
          slug: 'ueber-uns',
          title: 'Über CinCin Hotels',
          content: `
            <h1>Über CinCin Hotels</h1>
            <p>CinCin Hotels ist eine exklusive Kollektion handverlesener Boutique-Hotels in den schönsten Destinationen Europas. Unsere Philosophie basiert auf der Überzeugung, dass außergewöhnliche Reiseerlebnisse durch authentische lokale Erfahrungen, persönlichen Service und besondere Atmosphäre entstehen.</p>
            <h2>Unsere Geschichte</h2>
            <p>CinCin Hotels wurde 2020 von einer Gruppe leidenschaftlicher Reisender gegründet, die eine gemeinsame Vision teilten: Hotels zu kuratieren, die durch ihren einzigartigen Charakter, ihre besondere Lage und ihr Engagement für Exzellenz begeistern.</p>
          `,
          template: 'default',
          meta_title: 'Über CinCin Hotels | Exklusive Boutique-Hotels in Europa',
          meta_description: 'Entdecken Sie die Geschichte und Philosophie von CinCin Hotels, Ihrer Kollektion handverlesener Boutique-Hotels an den schönsten Orten Europas.'
        }
      };
    }
    
    return { data: null, error: error.message };
  }
}

/**
 * Alle Übersetzungen für eine bestimmte Sprache abrufen
 * @param {string} language - Sprachcode (z.B. 'de-DE')
 * @returns {Promise<object>} Übersetzungen als Key-Value-Object
 */
export async function fetchTranslations(language = DEFAULT_LOCALE) {
  try {
    // Korrekte API-Anfrage für Übersetzungen
    const response = await fetchFromDirectus('items/translations', {
      filter: { language: { _eq: language } },
      fields: ['key', 'value']
    });
    
    // In Key-Value-Format umwandeln
    const translations = {};
    if (response.data && Array.isArray(response.data)) {
      response.data.forEach(item => {
        translations[item.key] = item.value;
      });
    }
    
    return { data: translations };
  } catch (error) {
    console.error(`Error fetching translations for language ${language}:`, error);
    return { data: {}, error: error.message };
  }
}

/**
 * Navigationsseiten abrufen
 * @param {string} locale - Gebietsschema
 * @returns {Promise<object>} Navigationselemente
 */
export async function fetchNavigation(locale = DEFAULT_LOCALE) {
  try {
    // API-Anfrage
    const response = await fetchFromDirectus('items/pages', {
      filter: { show_in_navigation: true, status: 'Published' },
      fields: 'id,title,slug,translations.*',
      deep: { translations: { languages_code: locale } },
      sort: 'sort'
    });
    
    // Daten verarbeiten
    const processedPages = prepareItems(response.data, locale);
    
    return {
      data: processedPages.map(page => ({
        id: page.id,
        title: page.title,
        slug: page.slug
      }))
    };
  } catch (error) {
    console.error('Error fetching navigation:', error);
    return { data: [], error: error.message };
  }
}