'use client';

import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { motion, Variants } from 'framer-motion';
import { useUIState } from '../UIStateContext';
import { cn } from '../../lib/utils';
import { useFilterReducer } from '../../hooks/useFilterReducer';

/**
 * Typ für Filter-Definitionen
 */
export type HotelFilters = {
  categories: string[];
  locations: string[];
  experiences: string[];
  [key: string]: string[];
};

/**
 * Props für CategoryButton Komponente
 */
interface CategoryButtonProps {
  /** Anzeige-Label für den Button */
  label: string;
  /** Anzahl ausgewählter Items */
  count?: number;
  /** Callback für Klick */
  onClick: () => void;
}

/**
 * Props für HotelFilters Komponente
 */
export interface HotelFiltersProps {
  /** Callback für Suchanfragen */
  onSearch?: (query: string) => Promise<void>;
  /** Callback für Filteränderungen */
  onFilterChange?: (filters: HotelFilters) => void;
  /** Initiale Suchanfrage */
  initialSearchQuery?: string;
  /** Aktive Filter */
  activeFilters?: HotelFilters;
  /** Zusätzliche CSS-Klassen */
  className?: string;
}

/**
 * HotelFilters Komponente
 * 
 * Bietet Funktionalität für Suche und Filterung von Hotels
 * 
 * @example
 * <HotelFilters 
 *   onSearch={handleSearch}
 *   onFilterChange={handleFilterChange}
 *   activeFilters={{ categories: ["luxury"], locations: ["alps"] }}
 * />
 */
export default function HotelFilters({ 
  onSearch, 
  onFilterChange,
  initialSearchQuery = '',
  activeFilters = { categories: [], locations: [], experiences: [] },
  className = ''
}: HotelFiltersProps): JSX.Element {
  // UI-State Context verwenden
  const { state: uiState } = useUIState();
  
  // Lokale States
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);
  
  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  
  // Animation variants mit korrekten Typen
  const fadeInVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };
  
  // Aktive Filter zählen
  const activeFilterCount = Object.values(activeFilters)
    .reduce((count, filters) => count + filters.length, 0);
  
  /**
   * Verarbeitet die Suchformular-Übermittlung
   */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      setIsSearching(true);
      try {
        await onSearch(searchQuery);
      } finally {
        setIsSearching(false);
      }
    }
  };
  
  /**
   * Leert das Suchfeld
   */
  const handleClearSearch = (): void => {
    setSearchQuery('');
    searchInputRef.current?.focus();
    if (onSearch) onSearch('');
  };
  
  /**
   * Schließt das Dropdown bei Klick außerhalb
   */
  const handleClickOutside = (e: MouseEvent): void => {
    if (filtersRef.current && !filtersRef.current.contains(e.target as Node)) {
      setShowFilterDropdown(false);
    }
  };
  
  // Event Listener für Außenklicks
  useEffect(() => {
    if (showFilterDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilterDropdown]);
  
  // Reduzierte Bewegung berücksichtigen
  const shouldAnimate = !uiState.theme.reducedMotion && uiState.theme.animationsEnabled;
  
  return (
    <motion.section 
      className={cn("py-8 bg-white shadow-sm", className)}
      initial={shouldAnimate ? "hidden" : "visible"}
      animate="visible"
      variants={fadeInVariants}
      aria-label="Hotel filters and search"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Search Form */}
          <div className="w-full md:w-96">
            <form onSubmit={handleSubmit} className="relative" role="search">
              <div className="relative flex items-center">
                <input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search hotels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search hotels"
                  className="w-full py-3 pl-4 pr-10 rounded-full bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
                
                {searchQuery.length > 0 && (
                  <button 
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-12 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                
                <button 
                  type="submit"
                  disabled={isSearching}
                  className="absolute right-3 text-gray-500"
                  aria-label="Submit search"
                >
                  {isSearching ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          {/* Filter Categories */}
          <div className="flex flex-wrap items-center gap-3">
            <CategoryButton 
              label="Location"
              count={activeFilters.locations?.length || 0}
              onClick={() => setShowFilterDropdown(prev => !prev)}
            />
            <CategoryButton 
              label="Category"
              count={activeFilters.categories?.length || 0}
              onClick={() => setShowFilterDropdown(prev => !prev)}
            />
            <CategoryButton 
              label="Experience"
              count={activeFilters.experiences?.length || 0}
              onClick={() => setShowFilterDropdown(prev => !prev)}
            />
            
            {/* View Filters Button */}
            <div className="relative" ref={filtersRef}>
              <button 
                onClick={() => setShowFilterDropdown(prev => !prev)}
                className={cn(
                  "flex items-center justify-center gap-2 px-5 py-2.5 border rounded-full transition-colors",
                  activeFilterCount > 0 ? "border-black/70 text-black" : "border-gray-200 text-gray-700",
                  "focus:outline-none"
                )}
                aria-expanded={showFilterDropdown}
                aria-haspopup="dialog"
                aria-controls="filter-dropdown"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 5H15M7.5 10H12.5M9 15H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>
                  {activeFilterCount > 0 ? `All Filters (${activeFilterCount})` : 'All Filters'}
                </span>
              </button>
              
              {/* Dropdown Content */}
              {showFilterDropdown && (
                <motion.div 
                  id="filter-dropdown"
                  className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-20 overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Filter options"
                >
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800">Filter Options</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-500">Expanded filter options will appear here in the full implementation.</p>
                  </div>
                  <div className="p-4 bg-gray-50 flex justify-end">
                    <button 
                      className="px-4 py-2 bg-black text-white rounded-lg text-sm"
                      onClick={() => setShowFilterDropdown(false)}
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/**
 * CategoryButton Komponente
 * 
 * Button zum Filtern nach bestimmten Kategorien
 */
function CategoryButton({ label, count = 0, onClick }: CategoryButtonProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full border transition-all",
        count > 0 
          ? 'border-black/70 text-black' 
          : 'border-gray-200 text-gray-600 hover:border-gray-300'
      )}
      type="button"
      aria-label={`Filter by ${label}`}
    >
      <span className="flex items-center gap-2">
        {label}
        {count > 0 && (
          <span className="inline-flex items-center justify-center h-5 w-5 text-xs bg-black text-white rounded-full">
            {count}
          </span>
        )}
      </span>
    </button>
  );
}