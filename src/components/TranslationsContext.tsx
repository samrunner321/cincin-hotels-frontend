'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LANGUAGES, LanguageCode, DEFAULT_LANGUAGE } from '../lib/i18n';
import { getTranslation, mockTranslations } from '../lib/translations';

// Type definition for the context
export interface TranslationsContextProps {
  translations: Record<string, string>;
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  translate: (key: string, params?: Record<string, string>) => string;
  isLoading: boolean;
}

// Create the context
const TranslationsContext = createContext<TranslationsContextProps>({
  translations: {},
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  translate: (key) => key,
  isLoading: true,
});

// Provider component
export function TranslationsProvider({ 
  children, 
  initialLanguage = DEFAULT_LANGUAGE 
}: { 
  children: ReactNode;
  initialLanguage?: LanguageCode;
}) {
  const [language, setLanguage] = useState<LanguageCode>(initialLanguage);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch translations when language changes
  useEffect(() => {
    async function fetchTranslations() {
      setIsLoading(true);
      try {
        // Use the API client to fetch translations
        const response = await fetch(`/api/translations?language=${language}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch translations: ${response.status}`);
        }
        
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error('Error fetching translations:', error);
        // Fallback to mock translations
        setTranslations(mockTranslations[language] || {});
      } finally {
        setIsLoading(false);
      }
    }

    fetchTranslations();
  }, [language]);

  // Translation function
  const translate = (key: string, params?: Record<string, string>): string => {
    return getTranslation(translations, key, params);
  };

  // Change language handler
  const handleSetLanguage = (newLanguage: LanguageCode) => {
    if (LANGUAGES[newLanguage]) {
      setLanguage(newLanguage);
      // Store language preference in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('preferred_language', newLanguage);
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

// Custom hook for using translations
export function useTranslations() {
  const context = useContext(TranslationsContext);
  
  if (context === undefined) {
    throw new Error('useTranslations must be used within a TranslationsProvider');
  }
  
  return context;
}

export default TranslationsContext;