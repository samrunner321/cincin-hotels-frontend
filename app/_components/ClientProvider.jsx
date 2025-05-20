'use client';

import { useState, useEffect } from 'react';
// Fixed import paths to use the src directory
import { TranslationsProvider } from '../../src/components/TranslationsContext';
import { DEFAULT_LANGUAGE } from '../../src/lib/i18n';

export default function ClientProvider({ children, initialLanguage = DEFAULT_LANGUAGE }) {
  const [isClient, setIsClient] = useState(false);
  const [language, setLanguage] = useState(initialLanguage);
  
  // This effect will only run once the component is mounted on the client
  useEffect(() => {
    setIsClient(true);
    
    // Check localStorage for preferred language
    if (typeof window !== 'undefined') {
      const storedLanguage = localStorage.getItem('preferred_language');
      if (storedLanguage) {
        setLanguage(storedLanguage);
      }
    }
  }, []);
  
  // During SSR or initial load, just render children
  if (!isClient) {
    return <>{children}</>;
  }
  
  // On the client, wrap with providers
  return (
    <TranslationsProvider initialLanguage={language}>
      {children}
    </TranslationsProvider>
  );
}