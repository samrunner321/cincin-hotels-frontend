/**
 * Internationalization utilities for handling multilingual content
 */

// Define supported languages
export const LANGUAGES = {
  'en-US': {
    code: 'en-US',
    name: 'English',
    flag: '🇺🇸',
    default: true
  },
  'de-DE': {
    code: 'de-DE',
    name: 'Deutsch',
    flag: '🇩🇪',
    default: false
  },
  'ar-AE': {
    code: 'ar-AE',
    name: 'العربية',
    flag: '🇦🇪',
    default: false
  },
  'he-IL': {
    code: 'he-IL',
    name: 'עברית',
    flag: '🇮🇱',
    default: false
  }
};

export type LanguageCode = keyof typeof LANGUAGES;

// Default language code
export const DEFAULT_LANGUAGE: LanguageCode = 'en-US';

// Languages that require Right-to-Left text direction
export const RTL_LANGUAGES: LanguageCode[] = ['ar-AE', 'he-IL'];

/**
 * Get language from a Next.js locale string
 */
export function getLanguageFromLocale(locale: string = DEFAULT_LANGUAGE): LanguageCode {
  return (LANGUAGES[locale as LanguageCode] ? locale : DEFAULT_LANGUAGE) as LanguageCode;
}

/**
 * Helper function to get translated content from a multilingual object
 */
export function getTranslatedContent<T extends Record<string, any>>(
  item: T,
  languageCode: LanguageCode = DEFAULT_LANGUAGE,
  fallbackLanguageCode: LanguageCode = DEFAULT_LANGUAGE
): T {
  if (!item || typeof item !== 'object') {
    return item;
  }

  // Create a copy of the item to avoid modifying the original
  const translatedItem = { ...item } as Record<string, any>;

  // Look for translations field
  if (
    translatedItem.translations &&
    Array.isArray(translatedItem.translations) &&
    translatedItem.translations.length > 0
  ) {
    // Find the translation for the requested language
    const requestedTranslation = translatedItem.translations.find(
      (t: any) => t.language === languageCode
    );

    // Find the fallback translation if requested language not found
    const fallbackTranslation = translatedItem.translations.find(
      (t: any) => t.language === fallbackLanguageCode
    );

    // Apply translations
    const translation = requestedTranslation || fallbackTranslation;
    if (translation) {
      // Copy translation fields to the root object
      Object.keys(translation).forEach((key) => {
        if (key !== 'language' && key !== 'id') {
          translatedItem[key] = translation[key as keyof typeof translation];
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

  return translatedItem as T;
}

/**
 * Type definitions for translations
 */
export type TranslationsMap = Record<string, string>;

/**
 * Context provider for translations
 */
export type TranslationsContextType = {
  translations: TranslationsMap;
  language: LanguageCode;
  translate: (key: string, params?: Record<string, string>) => string;
};

/**
 * Translate a key with optional parameter replacement
 */
export function createTranslator(translations: Record<string, string>) {
  return function translate(key: string, params?: Record<string, string>): string {
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
export function createLocalTranslator(translations: TranslationsMap) {
  return function translate(key: string, params?: Record<string, string | number>): string {
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
 * Mock translations for development and testing
 */
export const mockTranslations: Record<LanguageCode, TranslationsMap> = {
  'en-US': {
    'common.welcome': 'Welcome',
    'common.hotels': 'Hotels',
    'common.destinations': 'Destinations',
    'common.search': 'Search',
  },
  'de-DE': {
    'common.welcome': 'Willkommen',
    'common.hotels': 'Hotels',
    'common.destinations': 'Reiseziele',
    'common.search': 'Suchen',
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