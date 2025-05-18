/**
 * Internationalization utilities for handling multilingual content from Directus
 */
import { createDirectus, rest, staticToken } from '@directus/sdk';

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
  }
};

export type LanguageCode = keyof typeof LANGUAGES;

// Default language code
export const DEFAULT_LANGUAGE: LanguageCode = 'en-US';

// Directus configuration
const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || '';

/**
 * Directus REST client for translations
 */
const translationsClient = createDirectus(DIRECTUS_URL)
  .with(rest())
  .with(staticToken(DIRECTUS_TOKEN));

/**
 * Fetch translations for a given language
 */
export async function getTranslations(languageCode: LanguageCode = DEFAULT_LANGUAGE) {
  try {
    const translations = await translationsClient.request(
      rest.readItems('translations', {
        filter: {
          language: { _eq: languageCode }
        },
        fields: ['key', 'value']
      })
    );

    // Convert to key-value object
    const translationMap: Record<string, string> = {};
    translations.forEach((item: any) => {
      translationMap[item.key] = item.value;
    });

    return translationMap;
  } catch (error) {
    console.error(`Error fetching translations for ${languageCode}:`, error);
    return {};
  }
}

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
  const translatedItem = { ...item };

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
 * Context provider for translations
 */
export type TranslationsContextType = {
  translations: Record<string, string>;
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