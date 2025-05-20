'use client';

import React, { useState } from 'react';
import { LANGUAGES, LanguageCode } from '../../lib/i18n';
import { useEnhancedTranslations } from '../../components/i18n/EnhancedTranslationsProvider';
import RtlDemo from '../../components/ui/RtlDemo';

export default function RtlDemoPage() {
  const { language, setLanguage, translate } = useEnhancedTranslations();
  
  // Sprachumschalter
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as LanguageCode);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">RTL-Unterstützung Demonstrationsseite</h1>
      
      <div className="mb-8 bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Sprache ändern</h2>
        <p className="mb-2">
          Wählen Sie eine Sprache aus, um die RTL-Unterstützung zu testen:
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
          <strong>Hinweis:</strong> Arabisch (ar-AE) und Hebräisch (he-IL) sind RTL-Sprachen. 
          Die anderen Sprachen verwenden LTR-Textrichtung.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <a 
            href="/rtl-demo/styling" 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            CSS-Styling-Beispiele anzeigen
          </a>
        </div>
      </div>
      
      <RtlDemo title={translate('common.welcome')} />
    </div>
  );
}