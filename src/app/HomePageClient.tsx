'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from '../components/TranslationsContext';
import { DEFAULT_LANGUAGE, LanguageCode } from '../lib/i18n';

interface HomePageClientProps {
  currentLocale: LanguageCode;
}

/**
 * Client component for the home page that can use client hooks
 */
export default function HomePageClient({ currentLocale }: HomePageClientProps): React.ReactElement {
  const { translate } = useTranslations();
  
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center text-white">
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-blue-800 to-purple-900"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-20 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-brooklyn mb-6">
          {currentLocale === 'de-DE' ? 'Willkommen bei CinCin Hotels' : 'Welcome to CinCin Hotels'}
        </h1>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10">
          {currentLocale === 'de-DE' 
            ? 'Entdecken Sie handverlesene Luxushotels mit Charakter und Persönlichkeit.' 
            : 'Discover handpicked luxury hotels with character and personality.'}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href={`${currentLocale === DEFAULT_LANGUAGE ? '' : `/${currentLocale}`}/hotels`}
            className="px-8 py-3 bg-white text-gray-900 hover:bg-gray-200 transition-colors rounded-full font-medium"
          >
            {currentLocale === 'de-DE' ? 'Hotels entdecken' : 'Explore Hotels'}
          </Link>
          <Link 
            href={`${currentLocale === DEFAULT_LANGUAGE ? '' : `/${currentLocale}`}/destinations`}
            className="px-8 py-3 border border-white hover:bg-white/20 transition-colors rounded-full font-medium"
          >
            {currentLocale === 'de-DE' ? 'Reiseziele entdecken' : 'Discover Destinations'}
          </Link>
        </div>
        
        <div className="mt-12 p-4 bg-white/10 backdrop-blur rounded-lg">
          <h2 className="text-2xl mb-4">{currentLocale === 'de-DE' ? 'Sprachauswahl' : 'Language Selection'}</h2>
          <div className="flex justify-center gap-4">
            <Link 
              href="/" 
              className={`px-4 py-2 rounded-md ${currentLocale === 'en-US' ? 'bg-white text-blue-900' : 'border border-white'}`}
            >
              🇺🇸 English
            </Link>
            <Link 
              href="/de-DE" 
              className={`px-4 py-2 rounded-md ${currentLocale === 'de-DE' ? 'bg-white text-blue-900' : 'border border-white'}`}
            >
              🇩🇪 Deutsch
            </Link>
          </div>
          <p className="mt-4 text-sm">
            {currentLocale === 'de-DE' 
              ? 'Aktuelle Sprache: Deutsch' 
              : 'Current language: English'}
          </p>
        </div>
      </div>
    </section>
  );
}