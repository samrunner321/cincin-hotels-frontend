// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { Hotel } from '../../types/hotel';
import { cn } from '../../lib/utils';
import { useHotelNavigation } from '../../hooks/useHotelNavigation';
import HotelCard from './HotelCard';
import ViewSwitcher from '../ui/ViewSwitcher';
import LoadingSpinner from '../ui/LoadingSpinner';
import HotelModal from './HotelModal';

/**
 * Props für AnimatedHotelEntry
 */
interface AnimatedHotelEntryProps {
  /** Verzögerung der Animation in Sekunden */
  delay: number;
  /** Kinder-Elemente */
  children: React.ReactNode;
}

/**
 * Animierte Eintragung eines Hotels
 */
const AnimatedHotelEntry = ({ delay, children }: AnimatedHotelEntryProps): JSX.Element => {
  return (
    <div 
      className="opacity-0 animate-fadeIn" 
      style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
    >
      {children}
    </div>
  );
};

/**
 * Interface für eine Fehleranzeige
 */
interface ApiError {
  message: string;
}

/**
 * Props für die HotelList-Komponente
 */
export interface HotelListProps {
  /** Liste von Hotels */
  hotels?: Hotel[];
  /** Ob Daten geladen werden */
  isLoading?: boolean;
  /** Fehler, falls vorhanden */
  error?: ApiError | null;
  /** Titel der Hotel-Liste */
  title?: string;
  /** Zusätzliche CSS-Klassen */
  className?: string;
  /** Zeigt Modal-Vorschau an */
  showModal?: boolean;
}

/**
 * HotelList-Komponente
 * 
 * Zeigt eine Liste von Hotels an, mit Ladeansicht, Fehlerzustand und verschiedenen Ansichtsmodi
 * 
 * @example
 * <HotelList 
 *   hotels={hotels} 
 *   isLoading={isLoading} 
 *   error={error} 
 *   title="Featured Hotels" 
 * />
 */
export default function HotelList({ 
  hotels = [], 
  isLoading = false, 
  error = null,
  title = "Our Hotels",
  className = '',
  showModal = true
}: HotelListProps): JSX.Element {
  // Zustand für ausgewähltes Hotel und Modal
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  
  // State für den Ansichtsmodus
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  
  // Handler für Kartenklick
  const handleCardClick = (e: React.MouseEvent, hotel: Hotel) => {
    e.preventDefault();
    if (showModal) {
      setSelectedHotel(hotel);
    }
  };

  // Handler für Modalschließung
  const closeModal = () => {
    setSelectedHotel(null);
  };
  
  // Handler für die Änderung des Ansichtsmodus
  const handleViewChange = (mode: 'grid' | 'list' | 'map') => {
    setViewMode(mode);
  };

  // Zeige Ladezustand
  if (isLoading) {
    return (
      <section 
        className={cn("py-8 md:py-12", className)} 
        aria-busy="true" 
        aria-label="Loading hotels"
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <LoadingSpinner size="large" label="Loading hotels..." />
        </div>
      </section>
    );
  }

  // Zeige Fehlerzustand
  if (error) {
    return (
      <section className={cn("py-8 md:py-12", className)}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-[1536px]">
          <div className="text-center py-8">
            <h2 className="text-2xl font-normal text-gray-800 mb-4">Unable to load hotels</h2>
            <p className="text-gray-600 mb-6">{error.message || "Please try again later."}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 border border-brand-olive-400 rounded-md hover:bg-brand-olive-400 hover:text-white transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }
  
  // Zeige leeren Zustand
  if (hotels.length === 0) {
    return (
      <section className={cn("py-8 md:py-12", className)}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-[1536px]">
          <div className="text-center py-8 md:py-12 rounded-xl">
            <svg 
              className="w-16 h-16 text-gray-400 mx-auto mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
            <h3 className="text-lg font-normal text-gray-900 mb-2 font-brooklyn">No hotels found</h3>
            <p className="text-gray-600">Try adjusting your search filters</p>
          </div>
        </div>
      </section>
    );
  }

  // Zeige Hotels
  return (
    <section className={cn("py-8 md:py-12", className)}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-[1814px]">
        {title && (
          <h2 className="text-3xl font-normal mb-8">{title}</h2>
        )}
        
        <ViewSwitcher onChange={handleViewChange} />
        
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-10 md:gap-y-16">
            {hotels.map((hotel, index) => {
              const hotelUrl = `/hotels/${hotel.slug || hotel.id}`;
              const delay = index * 0.1;
              return (
                <AnimatedHotelEntry key={hotel.id} delay={delay}>
                  <div onClick={(e) => handleCardClick(e, hotel)}>
                    <a 
                      href={hotelUrl} 
                      onClick={(e) => e.preventDefault()} 
                      className="block cursor-pointer"
                    >
                      <HotelCard {...hotel} />
                    </a>
                  </div>
                </AnimatedHotelEntry>
              );
            })}
          </div>
        )}
        
        {viewMode === 'list' && (
          <div className="space-y-6">
            {hotels.map((hotel, index) => (
              <div 
                key={hotel.id}
                className="opacity-0 animate-fadeIn bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards' }}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-64 relative">
                    <a 
                      href={`/hotels/${hotel.slug || hotel.id}`}
                      onClick={(e) => handleCardClick(e, hotel)}
                      className="block h-full"
                    >
                      <HotelCard 
                        {...hotel} 
                        hideDescription 
                        className="h-full shadow-none hover:shadow-none border-0"
                      />
                    </a>
                  </div>
                  <div className="md:w-2/3 p-6">
                    <h3 className="text-xl font-normal">{hotel.name}</h3>
                    {hotel.location && (
                      <p className="text-gray-600 text-sm mb-2">{hotel.location}</p>
                    )}
                    <p className="mb-4">{hotel.short_description || hotel.description}</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {hotel.categories?.map((category: any) => {
                        const categoryName = typeof category === 'string' 
                          ? category 
                          : (category.name || '');
                        
                        const categorySlug = typeof category === 'string' 
                          ? category.toLowerCase().replace(/\s+/g, '-')
                          : (category.slug || category.name?.toLowerCase().replace(/\s+/g, '-') || '');
                        
                        if (!categoryName) return null;
                        
                        return (
                          <a 
                            key={categorySlug || categoryName}
                            href={`/categories/${categorySlug}`}
                            className="text-sm text-brand-olive-600 hover:text-brand-olive-800 transition-colors bg-brand-olive-50 px-2 py-1 rounded-full"
                          >
                            {categoryName}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {viewMode === 'map' && (
          <div className="bg-gray-100 rounded-xl p-8 text-center h-[600px] flex items-center justify-center">
            <p>Map view loading soon...</p>
          </div>
        )}
      </div>
      
      {/* Hotel modal */}
      <HotelModal
        hotel={selectedHotel}
        isOpen={!!selectedHotel}
        onClose={closeModal}
      />
    </section>
  );
}