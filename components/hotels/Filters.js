'use client';

import { useState, useEffect, useRef } from 'react';
import FilterModal from './FilterModal';

export default function Filters({ 
  onSearch, 
  onFilterChange,
  initialSearchQuery = '',
  activeFilters = {} 
}) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);
  
  // Berechne die Anzahl aktiver Filter
  const activeFilterCount = Object.values(activeFilters).flat().length;
  
  const handleSubmit = async (e) => {
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
  
  const handleClearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
    if (onSearch) onSearch('');
  };

  return (
    <section 
      className="py-6"
      aria-label="Hotel filters and search"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          {/* Suchformular */}
          <div className="relative w-96">
            <form onSubmit={handleSubmit} className="relative" role="search">
              <div className="relative flex items-center">
                <input
                  ref={searchInputRef}
                  type="search"
                  placeholder="search destination..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search destinations or hotels"
                  className="w-full py-3 pl-4 pr-10 rounded-full bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
                
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
          
          {/* Filter-Button */}
          <button 
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-200 rounded-full text-gray-700 focus:outline-none"
            aria-haspopup="dialog"
            aria-expanded={isFilterModalOpen}
            aria-controls="filter-modal"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 5H15M7.5 10H12.5M9 15H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Filters</span>
          </button>
        </div>
      </div>
      
      {/* Filter-Modal */}
      <FilterModal
        id="filter-modal"
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onFilterChange={onFilterChange}
        activeFilters={activeFilters}
      />
    </section>
  );
}