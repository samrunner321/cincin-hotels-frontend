/**
 * Translations helper functions
 */
import { mockTranslations as i18nMockTranslations } from './i18n';

// Create a mock translations object if API is not available
export const mockTranslations = i18nMockTranslations;

/**
 * Get translation value from key
 */
export function getTranslation(
  translations,
  key,
  params
) {
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
export function mapTranslations(translations) {
  const translationMap = {};
  
  translations.forEach(item => {
    translationMap[item.key] = item.value;
  });
  
  return translationMap;
}