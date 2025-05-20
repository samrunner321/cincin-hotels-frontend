// @ts-nocheck
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  LANGUAGES, 
  LanguageCode, 
  DEFAULT_LANGUAGE, 
  TranslationsMap,
  createLocalTranslator,
  mockTranslations
} from '../../../lib/i18n';

// Typ für den Kontext
export interface TranslationsContextProps {
  translations: TranslationsMap;
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  translate: (key: string, params?: Record<string, string | number>) => string;
  isLoading: boolean;
}

// Kontext erstellen
const TranslationsContext = createContext<TranslationsContextProps>({
  translations: {},
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  translate: (key) => key,
  isLoading: true,
});

// Provider-Komponente
export function TranslationsProvider({ 
  children, 
  initialLanguage = DEFAULT_LANGUAGE 
}: { 
  children: ReactNode;
  initialLanguage?: LanguageCode;
}) {
  const [language, setLanguage] = useState<LanguageCode>(initialLanguage);
  const [translations, setTranslations] = useState<TranslationsMap>({});
  const [isLoading, setIsLoading] = useState(true);

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

  // Sprache ändern
  const handleSetLanguage = (newLanguage: LanguageCode) => {
    if (LANGUAGES[newLanguage]) {
      setLanguage(newLanguage);
      // Sprachpräferenz im localStorage speichern
      if (typeof window !== 'undefined') {
        localStorage.setItem('preferred_language', newLanguage);
        // Auch im Cookie für Server-Rendering setzen
        document.cookie = `preferred_language=${newLanguage}; path=/; max-age=31536000; SameSite=Lax`;
      }
    }
  };

  return (
    <TranslationsContext.Provider
      value={{
        translations,
        language,
        setLanguage: handleSetLanguage,
        translate,
        isLoading,
      }}
    >
      {children}
    </TranslationsContext.Provider>
  );
}

// Custom Hook für die Verwendung von Übersetzungen
export function useTranslations() {
  const context = useContext(TranslationsContext);
  
  if (context === undefined) {
    throw new Error('useTranslations must be used within a TranslationsProvider');
  }
  
  return context;
}

export default TranslationsContext;