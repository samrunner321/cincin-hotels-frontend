// @ts-nocheck
'use client';

import { useState } from 'react';
import { LANGUAGES, LanguageCode, RTL_LANGUAGES } from '../../../lib/i18n';
import { useEnhancedTranslations } from './EnhancedTranslationsProvider';

export default function EnhancedLanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, direction } = useEnhancedTranslations();
  const currentLang = LANGUAGES[language];

  const handleLanguageChange = (newLanguage: LanguageCode) => {
    if (newLanguage === language) {
      setIsOpen(false);
      return;
    }
    
    // Aktuellen URL-Pfad abrufen
    const currentPath = window.location.pathname;
    const baseUrl = window.location.origin;
    
    // Aktuelles Sprachpräfix entfernen, falls vorhanden
    const pathWithoutLang = currentPath.replace(/^\/[a-z]{2}-[A-Z]{2}/, '');
    
    // Neues Sprachpräfix hinzufügen (außer für Standardsprache)
    const newPath = newLanguage === 'en-US' 
      ? pathWithoutLang
      : `/${newLanguage}${pathWithoutLang}`;
    
    // Zustand aktualisieren
    setLanguage(newLanguage);
    
    // Zu neuer URL navigieren
    window.location.href = `${baseUrl}${newPath}`;
    
    setIsOpen(false);
  };

  // RTL-abhängiges Dropdown-Styling
  const dropdownPosition = direction === 'ltr' ? 'right-0' : 'left-0';

  return (
    <div className="relative">
      <button
        className="flex items-center space-x-1 py-2 px-3 rounded-md hover:bg-gray-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span className="hidden sm:inline-block">{currentLang.name}</span>
        {/* RTL-Indikator für RTL-Sprachen */}
        {RTL_LANGUAGES.includes(language) && (
          <span className="ml-1 text-xs bg-indigo-100 text-indigo-800 py-0.5 px-1.5 rounded">RTL</span>
        )}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className={`absolute ${dropdownPosition} mt-2 py-2 w-48 bg-white rounded-md shadow-lg z-20`}>
          {Object.entries(LANGUAGES).map(([langCode, langInfo]) => (
            <button
              key={langCode}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                langCode === language ? 'bg-gray-50 font-medium' : ''
              } flex items-center justify-between`}
              onClick={() => handleLanguageChange(langCode as LanguageCode)}
            >
              <div>
                <span className="mr-2">{langInfo.flag}</span>
                <span>{langInfo.name}</span>
              </div>
              
              {/* RTL-Indikator für RTL-Sprachen */}
              {RTL_LANGUAGES.includes(langCode as LanguageCode) && (
                <span className="text-xs bg-indigo-100 text-indigo-800 py-0.5 px-1.5 rounded">RTL</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}