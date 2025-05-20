/**
 * Translations helper functions
 */
import { LanguageCode } from './i18n';

export interface Translation {
  key: string;
  value: string;
}

// Create a mock translations object if API is not available
export const mockTranslations: Partial<Record<LanguageCode, Record<string, string>>> = {
  'en-US': {
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
};

/**
 * Get translation value from key
 */
export function getTranslation(
  translations: Record<string, string>,
  key: string,
  params?: Record<string, string>
): string {
  let value = translations[key] || key;
  
  // Replace parameters if they exist
  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      value = value.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue);
    });
  }
  
  return value;
}

/**
 * Convert array of translation objects to key-value map
 */
export function mapTranslations(translations: Translation[]): Record<string, string> {
  const translationMap: Record<string, string> = {};
  
  translations.forEach(item => {
    translationMap[item.key] = item.value;
  });
  
  return translationMap;
}