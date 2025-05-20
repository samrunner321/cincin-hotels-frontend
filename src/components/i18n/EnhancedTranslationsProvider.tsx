'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  LANGUAGES, 
  LanguageCode, 
  DEFAULT_LANGUAGE, 
  TranslationsMap,
  createLocalTranslator,
  mockTranslations,
  RTL_LANGUAGES
} from '../../lib/i18n';

// Erweiterte Kontexttypen für RTL-Unterstützung
export interface EnhancedTranslationsContextProps {
  translations: TranslationsMap;
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  translate: (key: string, params?: Record<string, string | number>) => string;
  isLoading: boolean;
  direction: 'ltr' | 'rtl';
  isRtl: boolean;
}

// Kontext erstellen
const EnhancedTranslationsContext = createContext<EnhancedTranslationsContextProps>({
  translations: {},
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  translate: (key) => key,
  isLoading: true,
  direction: 'ltr',
  isRtl: false,
});

// Provider-Komponente
export function EnhancedTranslationsProvider({ 
  children, 
  initialLanguage = DEFAULT_LANGUAGE 
}: { 
  children: ReactNode;
  initialLanguage?: LanguageCode;
}) {
  const [language, setLanguage] = useState<LanguageCode>(initialLanguage);
  const [translations, setTranslations] = useState<TranslationsMap>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // RTL-Unterstützung
  const isRtl = RTL_LANGUAGES.includes(language);
  const direction = isRtl ? 'rtl' : 'ltr';

  // Übersetzungen laden, wenn sich die Sprache ändert
  useEffect(() => {
    async function fetchTranslations() {
      setIsLoading(true);
      try {
        // API-Client verwenden, um Übersetzungen zu laden
        const response = await fetch(`/api/translations?language=${language}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch translations: ${response.status}`);
        }
        
        const data = await response.json();
        setTranslations(data.data || {});
      } catch (error) {
        console.error('Error fetching translations:', error);
        // Fallback zu Mock-Übersetzungen
        setTranslations(mockTranslations[language] || {});
      } finally {
        setIsLoading(false);
      }
    }

    fetchTranslations();
  }, [language]);

  // Übersetzer-Funktion
  const translate = createLocalTranslator(translations);

  // Dokument-Direction beim Montieren und Sprachänderung aktualisieren
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = direction;
      document.documentElement.lang = language;
    }
  }, [direction, language]);

  // Sprache ändern
  const handleSetLanguage = useCallback((newLanguage: LanguageCode) => {
    if (LANGUAGES[newLanguage]) {
      setLanguage(newLanguage);
      // Sprachpräferenz im localStorage speichern
      if (typeof window !== 'undefined') {
        localStorage.setItem('preferred_language', newLanguage);
        // Auch im Cookie für Server-Rendering setzen
        document.cookie = `preferred_language=${newLanguage}; path=/; max-age=31536000; SameSite=Lax`;
      }
    }
  }, []);

  return (
    <EnhancedTranslationsContext.Provider
      value={{
        translations,
        language,
        setLanguage: handleSetLanguage,
        translate,
        isLoading,
        direction,
        isRtl,
      }}
    >
      {children}
    </EnhancedTranslationsContext.Provider>
  );
}

// Custom Hook für die Verwendung von erweiterten Übersetzungen mit RTL-Unterstützung
export function useEnhancedTranslations() {
  const context = useContext(EnhancedTranslationsContext);
  
  if (context === undefined) {
    throw new Error('useEnhancedTranslations must be used within an EnhancedTranslationsProvider');
  }
  
  return context;
}

export default EnhancedTranslationsContext;