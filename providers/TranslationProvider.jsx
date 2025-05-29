'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import de from '@/translations/de.json';
import en from '@/translations/en.json';

const translations = { de, en };

const TranslationContext = createContext();

export function TranslationProvider({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [locale, setLocale] = useState('de');
  
  useEffect(() => {
    // Extract locale from URL pathname
    const pathSegments = pathname.split('/').filter(Boolean);
    const firstSegment = pathSegments[0];
    
    if (['de', 'en'].includes(firstSegment)) {
      setLocale(firstSegment);
    } else {
      // Default to 'de' if no locale in path
      setLocale('de');
    }
  }, [pathname]);
  
  const t = (key, params = {}) => {
    let value = translations[locale]?.[key] || translations['de']?.[key] || key;
    
    // Replace parameters if they exist
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      value = value.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
    });
    
    return value;
  };
  
  const switchLocale = (newLocale) => {
    if (!['de', 'en'].includes(newLocale)) return;
    
    // Get current path without locale
    const pathSegments = pathname.split('/').filter(Boolean);
    const currentLocale = ['de', 'en'].includes(pathSegments[0]) ? pathSegments[0] : null;
    
    let newPath;
    if (currentLocale) {
      // Replace existing locale
      pathSegments[0] = newLocale;
      newPath = '/' + pathSegments.join('/');
    } else {
      // Add locale to path
      newPath = `/${newLocale}${pathname}`;
    }
    
    router.push(newPath);
  };
  
  return (
    <TranslationContext.Provider value={{ t, locale, switchLocale }}>
      {children}
    </TranslationContext.Provider>
  );
}

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
};