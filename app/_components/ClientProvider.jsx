'use client';

import { useState, useEffect } from 'react';
import { TranslationsProvider } from '@/src/components/TranslationsContext';

export default function ClientProvider({ children, initialLanguage = 'en-US' }) {
  const [isClient, setIsClient] = useState(false);
  
  // This effect will only run once the component is mounted on the client
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // During SSR or initial load, just render children
  if (!isClient) {
    return <>{children}</>;
  }
  
  // On the client, wrap with providers
  return (
    <TranslationsProvider initialLanguage={initialLanguage}>
      {children}
    </TranslationsProvider>
  );
}