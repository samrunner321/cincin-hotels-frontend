/**
 * Internationalization utilities for handling multilingual content
 */

// Define supported languages
export const LANGUAGES = {
  'de': {
    code: 'de',
    name: 'Deutsch',
    flag: '🇩🇪',
    default: true
  },
  'en': {
    code: 'en',
    name: 'English',
    flag: '🇬🇧',
    default: false
  }
};

// Default language code
export const DEFAULT_LANGUAGE = 'de';

// Languages that require Right-to-Left text direction
export const RTL_LANGUAGES = [];

/**
 * Next.js i18n configuration for app router
 */
export const i18n = {
  defaultLocale: DEFAULT_LANGUAGE,
  locales: Object.keys(LANGUAGES),
}

export const i18nConfig = {
  defaultLocale: DEFAULT_LANGUAGE,
  locales: Object.keys(LANGUAGES),
  localeDetection: true
};

/**
 * Get language from a Next.js locale string
 */
export function getLanguageFromLocale(locale = DEFAULT_LANGUAGE) {
  return LANGUAGES[locale] ? locale : DEFAULT_LANGUAGE;
}

/**
 * Helper function to get translated content from a multilingual object
 */
export function getTranslatedContent(
  item,
  languageCode = DEFAULT_LANGUAGE,
  fallbackLanguageCode = DEFAULT_LANGUAGE
) {
  if (!item || typeof item !== 'object') {
    return item;
  }

  // Create a copy of the item to avoid modifying the original
  const translatedItem = { ...item };

  // Look for translations field
  if (
    translatedItem.translations &&
    Array.isArray(translatedItem.translations) &&
    translatedItem.translations.length > 0
  ) {
    // Find the translation for the requested language
    const requestedTranslation = translatedItem.translations.find(
      (t) => t.language === languageCode
    );

    // Find the fallback translation if requested language not found
    const fallbackTranslation = translatedItem.translations.find(
      (t) => t.language === fallbackLanguageCode
    );

    // Apply translations
    const translation = requestedTranslation || fallbackTranslation;
    if (translation) {
      // Copy translation fields to the root object
      Object.keys(translation).forEach((key) => {
        if (key !== 'language' && key !== 'id') {
          translatedItem[key] = translation[key];
        }
      });
    }
  }

  // Process nested objects and arrays
  Object.keys(translatedItem).forEach((key) => {
    const value = translatedItem[key];
    
    // Process arrays of objects recursively
    if (Array.isArray(value)) {
      translatedItem[key] = value.map((item) => 
        typeof item === 'object' && item !== null 
          ? getTranslatedContent(item, languageCode, fallbackLanguageCode) 
          : item
      );
    } 
    // Process nested objects recursively
    else if (typeof value === 'object' && value !== null) {
      translatedItem[key] = getTranslatedContent(value, languageCode, fallbackLanguageCode);
    }
  });

  return translatedItem;
}

/**
 * Translate a key with optional parameter replacement
 */
export function createTranslator(translations) {
  return function translate(key, params) {
    let value = translations[key] || key;
    
    // Replace parameters if they exist
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        value = value.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue);
      });
    }
    
    return value;
  };
}

/**
 * Create a local translator function for use within components
 */
export function createLocalTranslator(translations) {
  return function translate(key, params) {
    let value = translations[key] || key;
    
    // Replace parameters if they exist
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        value = value.replace(
          new RegExp(`{{${paramKey}}}`, 'g'), 
          String(paramValue)
        );
      });
    }
    
    return value;
  };
}

/**
 * Get default translations fallback object
 */
export function getDefaultTranslations(locale = DEFAULT_LANGUAGE) {
  return mockTranslations[locale] || mockTranslations[DEFAULT_LANGUAGE];
}

/**
 * Mock translations for development and testing
 */
export const mockTranslations = {
  'en-US': {
    'common.welcome': 'Welcome',
    'common.hotels': 'Hotels',
    'common.destinations': 'Destinations',
    'common.search': 'Search',
    'common.welcome': 'Welcome to CinCin Hotels',
    'common.explore': 'Explore our collection',
    'common.book_now': 'Book Now',
    'common.view_details': 'View Details',
    'home.hero_title': 'Discover Unique Accommodations',
    'home.hero_subtitle': 'Handpicked luxury hotels with character',
    'nav.home': 'Home',
    'nav.hotels': 'Hotels',
    'nav.destinations': 'Destinations',
    'nav.about': 'About',
    'nav.contact': 'Contact',
  },
  'de-DE': {
    'common.welcome': 'Willkommen',
    'common.hotels': 'Hotels',
    'common.destinations': 'Reiseziele',
    'common.search': 'Suchen',
    'common.welcome': 'Willkommen bei CinCin Hotels',
    'common.explore': 'Entdecken Sie unsere Kollektion',
    'common.book_now': 'Jetzt Buchen',
    'common.view_details': 'Details Anzeigen',
    'home.hero_title': 'Entdecken Sie einzigartige Unterkünfte',
    'home.hero_subtitle': 'Handverlesene Luxushotels mit Charakter',
    'nav.home': 'Startseite',
    'nav.hotels': 'Hotels',
    'nav.destinations': 'Reiseziele',
    'nav.about': 'Über Uns',
    'nav.contact': 'Kontakt',
  },
  'ar-AE': {
    'common.welcome': 'مرحباً',
    'common.hotels': 'الفنادق',
    'common.destinations': 'الوجهات',
    'common.search': 'بحث',
  },
  'he-IL': {
    'common.welcome': 'ברוך הבא',
    'common.hotels': 'מלונות',
    'common.destinations': 'יעדים',
    'common.search': 'חיפוש',
  }
};