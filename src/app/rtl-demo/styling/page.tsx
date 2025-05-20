'use client';

import React from 'react';
import { LANGUAGES, LanguageCode } from '../../../lib/i18n';
import { useEnhancedTranslations } from '../../../components/i18n/EnhancedTranslationsProvider';
import RtlStylingExample from '../../../components/ui/RtlStylingExample';
import Link from 'next/link';

export default function RtlStylingPage() {
  const { language, setLanguage, translate, direction } = useEnhancedTranslations();
  
  // Sprachumschalter
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as LanguageCode);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">RTL-CSS-Styling Demonstrationsseite</h1>
      
      <div className="mb-8 bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Sprache ändern</h2>
        <p className="mb-2">
          Wählen Sie eine Sprache aus, um die RTL-Styling-Unterstützung zu testen:
        </p>
        
        <select 
          value={language}
          onChange={handleLanguageChange}
          className="block w-full max-w-xs px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {Object.values(LANGUAGES).map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name} {lang.code === language ? '(aktiv)' : ''}
            </option>
          ))}
        </select>
        
        <p className="mt-4">
          <strong>Aktuelle Textrichtung:</strong> {direction.toUpperCase()}
        </p>

        <div className="mt-4">
          <Link href="/rtl-demo" className="text-blue-600 hover:underline">
            Zurück zur RTL-Demo-Hauptseite
          </Link>
        </div>
      </div>
      
      <RtlStylingExample />
    </div>
  );
}