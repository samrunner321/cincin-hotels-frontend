import React from 'react';
import Link from 'next/link';
import { DEFAULT_LANGUAGE } from '../../lib/i18n';

export default function GermanPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center text-white">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-blue-800 to-purple-900"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-20 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans mb-6">
            Willkommen bei CinCin Hotels
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10">
            Entdecken Sie handverlesene Luxushotels mit Charakter und Persönlichkeit.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/de-DE/hotels"
              className="px-8 py-3 bg-white text-gray-900 hover:bg-gray-200 transition-colors rounded-full font-medium"
            >
              Hotels entdecken
            </Link>
            <Link 
              href="/de-DE/destinations"
              className="px-8 py-3 border border-white hover:bg-white/20 transition-colors rounded-full font-medium"
            >
              Reiseziele entdecken
            </Link>
          </div>
          
          <div className="mt-12 p-4 bg-white/10 backdrop-blur rounded-lg">
            <h2 className="text-2xl mb-4">Sprachauswahl</h2>
            <div className="flex justify-center gap-4">
              <Link 
                href="/" 
                className="px-4 py-2 rounded-md border border-white"
              >
                🇺🇸 English
              </Link>
              <Link 
                href="/de-DE" 
                className="px-4 py-2 rounded-md bg-white text-blue-900"
              >
                🇩🇪 Deutsch
              </Link>
            </div>
            <p className="mt-4 text-sm">
              Aktuelle Sprache: Deutsch
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
