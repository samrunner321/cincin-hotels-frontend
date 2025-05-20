/**
 * Übersetzer-Modul
 * 
 * Enthält Funktionen zur Übersetzung von Texten und Verwaltung von Übersetzungen.
 */

import { TranslationKey, TranslationParams, TranslationsMap } from './index';

/**
 * Erstellt eine Übersetzungsfunktion für einen gegebenen Übersetzungssatz
 * @param translations Übersetzungs-Map mit Schlüsseln und Übersetzungswerten
 * @returns Eine Übersetzungsfunktion
 */
export function createTranslator(translations: TranslationsMap) {
  /**
   * Übersetzungsfunktion
   * @param key Übersetzungsschlüssel
   * @param params Optionale Parameter zur Ersetzung von Platzhaltern
   * @returns Übersetzter Text
   */
  return function translate(key: TranslationKey, params?: TranslationParams): string {
    // Übersetzung suchen
    let value = translations[key] || key;
    
    // Parameter ersetzen, falls vorhanden
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        value = value.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
      });
    }
    
    return value;
  };
}

/**
 * Holt Übersetzungswert für einen Schlüssel
 * @param translations Übersetzungs-Map
 * @param key Übersetzungsschlüssel
 * @param params Optionale Parameter
 * @returns Übersetzter Text
 */
export function getTranslation(
  translations: TranslationsMap,
  key: TranslationKey,
  params?: TranslationParams
): string {
  let value = translations[key] || key;
  
  // Parameter ersetzen, falls vorhanden
  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      value = value.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
    });
  }
  
  return value;
}

/**
 * Kombiniert mehrere Übersetzungsdateien zu einer
 * @param translationSets Array von Übersetzungs-Maps
 * @returns Kombinierte Übersetzungs-Map
 */
export function mergeTranslations(...translationSets: TranslationsMap[]): TranslationsMap {
  const mergedTranslations: TranslationsMap = {};
  
  // Alle Übersetzungssets durchgehen und kombinieren
  translationSets.forEach(translations => {
    Object.entries(translations).forEach(([key, value]) => {
      // Überschreiben von vorherigen Einträgen, wenn Schlüssel mehrfach vorkommt
      mergedTranslations[key] = value;
    });
  });
  
  return mergedTranslations;
}

/**
 * Validiert, ob alle Übersetzungsschlüssel in allen Sprachversionen vorhanden sind
 * @param defaultTranslations Standardübersetzungen
 * @param otherTranslations Andere Sprachversionen
 * @returns Object mit fehlenden Schlüsseln pro Sprache
 */
export function validateTranslationCompleteness(
  defaultTranslations: TranslationsMap,
  otherTranslations: Record<string, TranslationsMap>
): Record<string, string[]> {
  const missingKeys: Record<string, string[]> = {};
  const defaultKeys = Object.keys(defaultTranslations);
  
  // Für jede Sprache prüfen, ob alle Schlüssel aus den Standardübersetzungen vorhanden sind
  Object.entries(otherTranslations).forEach(([language, translations]) => {
    const missingKeysInLanguage = defaultKeys.filter(key => !translations[key]);
    
    if (missingKeysInLanguage.length > 0) {
      missingKeys[language] = missingKeysInLanguage;
    }
  });
  
  return missingKeys;
}