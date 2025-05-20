/**
 * Zentralisierte Internationalisierungsfunktionen
 * 
 * Dieser Modul bündelt alle i18n-bezogenen Funktionen und Konfigurationen
 * und stellt eine standardisierte Schnittstelle für Mehrsprachigkeit bereit.
 */

import { cookies } from 'next/headers';
import { createTranslator } from './translator';
import { mockTranslations } from './mockData';

// Unterstützte Sprachen mit Metadaten
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

// Typdefinitionen
export type LanguageCode = keyof typeof LANGUAGES;
export type TranslationKey = string;
export type TranslationParams = Record<string, string | number>;

export type Translation = {
  key: string;
  value: string;
};

export type TranslationsMap = Record<string, string>;

export interface TranslationsContextProps {
  translations: TranslationsMap;
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  translate: (key: string, params?: TranslationParams) => string;
  isLoading: boolean;
}

// Standard-Sprachcode
export const DEFAULT_LANGUAGE: LanguageCode = 'en-US';

/**
 * Hilfsfunktion zur Spracherkennung aus einem Locale
 * @param locale Locale-String
 * @returns Validierte Sprachcode
 */
export function getLanguageFromLocale(locale: string = DEFAULT_LANGUAGE): LanguageCode {
  return (LANGUAGES[locale as LanguageCode] ? locale : DEFAULT_LANGUAGE) as LanguageCode;
}

/**
 * Ermittelt die bevorzugte Sprache eines Benutzers aus Cookie oder Accept-Language Header
 * @param acceptLanguageHeader Accept-Language Header aus dem Request
 * @returns Sprachcode
 */
export function detectUserLanguage(acceptLanguageHeader?: string | null): LanguageCode {
  // Versuche zuerst, die Sprache aus dem Cookie zu lesen
  const cookieStore = cookies();
  const preferredLanguage = cookieStore.get('preferred_language')?.value;
  
  if (preferredLanguage && isValidLanguage(preferredLanguage)) {
    return preferredLanguage as LanguageCode;
  }
  
  // Versuche dann, die Sprache aus dem Accept-Language Header zu ermitteln
  if (acceptLanguageHeader) {
    const browserPreference = parseBrowserLanguage(acceptLanguageHeader);
    
    // Mapping von Browser-Sprache zu App-Sprache
    if (browserPreference?.startsWith('de')) {
      return 'de-DE';
    } else if (browserPreference?.startsWith('en')) {
      return 'en-US';
    }
  }
  
  // Rückfall auf die Standardsprache
  return DEFAULT_LANGUAGE;
}

/**
 * Prüft, ob ein Sprachcode gültig ist
 * @param lang Sprachcode
 * @returns Ist der Sprachcode gültig?
 */
export function isValidLanguage(lang: string): boolean {
  return Object.keys(LANGUAGES).includes(lang);
}

/**
 * Parst den Accept-Language Header des Browsers
 * @param acceptLanguage Accept-Language Header
 * @returns Bevorzugte Sprache
 */
export function parseBrowserLanguage(acceptLanguage: string): string | undefined {
  return acceptLanguage
    .split(',')
    .map((lang) => {
      const [language, priority = '1.0'] = lang.trim().split(';q=');
      return { language, priority: parseFloat(priority) };
    })
    .sort((a, b) => b.priority - a.priority)
    .map((item) => item.language)[0];
}

/**
 * Hilfsfunktion zur Extraktion von übersetzten Inhalten aus mehrsprachigen Objekten
 * @param item Das mehrsprachige Objekt
 * @param languageCode Zielsprache
 * @param fallbackLanguageCode Fallback-Sprache
 * @returns Das übersetzte Objekt
 */
export function getTranslatedContent<T extends Record<string, any>>(
  item: T,
  languageCode: LanguageCode = DEFAULT_LANGUAGE,
  fallbackLanguageCode: LanguageCode = DEFAULT_LANGUAGE
): T {
  if (!item || typeof item !== 'object') {
    return item;
  }

  // Kopie des Objekts erstellen, um das Original nicht zu verändern
  const translatedItem = { ...item } as Record<string, any>;

  // Nach dem translations-Feld suchen
  if (
    translatedItem.translations &&
    Array.isArray(translatedItem.translations) &&
    translatedItem.translations.length > 0
  ) {
    // Übersetzung für die angeforderte Sprache finden
    const requestedTranslation = translatedItem.translations.find(
      (t: any) => t.language === languageCode
    );

    // Fallback-Übersetzung, falls die angeforderte Sprache nicht gefunden wurde
    const fallbackTranslation = translatedItem.translations.find(
      (t: any) => t.language === fallbackLanguageCode
    );

    // Übersetzungen anwenden
    const translation = requestedTranslation || fallbackTranslation;
    if (translation) {
      // Übersetzungsfelder in das Hauptobjekt kopieren
      Object.keys(translation).forEach((key) => {
        if (key !== 'language' && key !== 'id') {
          translatedItem[key] = translation[key as keyof typeof translation];
        }
      });
    }
  }

  // Verschachtelte Objekte und Arrays verarbeiten
  Object.keys(translatedItem).forEach((key) => {
    const value = translatedItem[key];
    
    // Arrays von Objekten rekursiv verarbeiten
    if (Array.isArray(value)) {
      translatedItem[key] = value.map((item) => 
        typeof item === 'object' && item !== null 
          ? getTranslatedContent(item, languageCode, fallbackLanguageCode) 
          : item
      );
    } 
    // Verschachtelte Objekte rekursiv verarbeiten
    else if (typeof value === 'object' && value !== null) {
      translatedItem[key] = getTranslatedContent(value, languageCode, fallbackLanguageCode);
    }
  });

  return translatedItem as T;
}

/**
 * Erstellt eine Übersetzungsfunktion mit vorgegebenen Übersetzungen
 * @param translations Übersetzungsdaten
 * @returns Übersetzer-Funktion
 */
export function createLocalTranslator(translations: TranslationsMap) {
  return (key: TranslationKey, params?: TranslationParams): string => {
    // Übersetzung suchen
    const value = translations[key] || key;
    
    // Parameter ersetzen
    if (params) {
      let result = value;
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        result = result.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
      });
      return result;
    }
    
    return value;
  };
}

/**
 * Wandelt ein Array von Übersetzungsobjekten in eine Map um
 * @param translations Array von Übersetzungsobjekten
 * @returns Übersetzungs-Map
 */
export function mapTranslations(translations: Translation[]): TranslationsMap {
  const translationMap: TranslationsMap = {};
  
  translations.forEach(item => {
    translationMap[item.key] = item.value;
  });
  
  return translationMap;
}

/**
 * Hilfsfunktion zum Umschalten der Sprache
 * @param language Neue Sprache
 */
export function setLanguageCookie(language: LanguageCode): void {
  // Diese Funktion kann nur clientseitig verwendet werden
  if (typeof document !== 'undefined') {
    document.cookie = `preferred_language=${language}; path=/; max-age=31536000; SameSite=Lax`;
  }
}

// Exportiere zusätzlich alle Funktionen von untermodules
export { 
  createTranslator,
  mockTranslations 
};