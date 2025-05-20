// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LANGUAGES, LanguageCode, DEFAULT_LANGUAGE } from '../../../lib/i18n';

interface LanguageSwitcherProps {
  className?: string;
  showFlags?: boolean;
  showNames?: boolean;
  currentLanguage?: LanguageCode;
}

/**
 * Sprachumschalter-Komponente
 * 
 * Ermöglicht es dem Benutzer, zwischen den unterstützten Sprachen zu wechseln.
 * Speichert die Präferenz im Cookie und navigiert zur entsprechenden Seite.
 */
export default function LanguageSwitcher({
  className = '',
  showFlags = true,
  showNames = true,
  currentLanguage: propLanguage
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(propLanguage || DEFAULT_LANGUAGE);

  // Bei Initialisierung die Sprache aus dem Cookie lesen
  useEffect(() => {
    const languageCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('preferred_language='));
    
    if (languageCookie) {
      const cookieValue = languageCookie.split('=')[1];
      if (cookieValue in LANGUAGES) {
        setCurrentLanguage(cookieValue as LanguageCode);
      }
    } else if (propLanguage) {
      setCurrentLanguage(propLanguage);
    }
  }, [propLanguage]);

  // Wenn die Sprache aus den Props geändert wird, aktualisiere den State
  useEffect(() => {
    if (propLanguage && propLanguage !== currentLanguage) {
      setCurrentLanguage(propLanguage);
    }
  }, [propLanguage, currentLanguage]);

  /**
   * Sprachumschaltung
   * @param newLanguage Neue Sprachcode
   */
  const handleLanguageChange = (newLanguage: LanguageCode) => {
    if (newLanguage === currentLanguage) return;

    // Sprache im Cookie speichern
    document.cookie = `preferred_language=${newLanguage}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Sprachstatus aktualisieren
    setCurrentLanguage(newLanguage);

    // URL für die neue Sprache bestimmen
    let newPathname = pathname;
    
    // Wenn der Pfad mit einem Sprachcode beginnt, diesen entfernen
    for (const lang of Object.keys(LANGUAGES)) {
      if (pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`) {
        newPathname = pathname.substring(lang.length + 1) || '/';
        break;
      }
    }
    
    // Für Standard-Sprache kein Präfix hinzufügen
    if (newLanguage === DEFAULT_LANGUAGE) {
      router.push(newPathname);
    } else {
      // Für andere Sprachen, Sprachcode als Präfix hinzufügen
      router.push(`/${newLanguage}${newPathname === '/' ? '' : newPathname}`);
    }
  };

  return (
    <div className={`language-switcher ${className}`}>
      <ul className="flex items-center space-x-2">
        {Object.entries(LANGUAGES).map(([code, language]) => (
          <li key={code}>
            <button
              onClick={() => handleLanguageChange(code as LanguageCode)}
              aria-label={`Switch to ${language.name}`}
              className={`flex items-center px-2 py-1 rounded ${
                currentLanguage === code ? 'bg-gray-200 font-medium' : 'hover:bg-gray-100'
              }`}
            >
              {showFlags && <span className="mr-1">{language.flag}</span>}
              {showNames && <span>{language.name}</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}