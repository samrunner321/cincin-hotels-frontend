'use client';

import { useState, useMemo, useCallback } from 'react';
import HotelList from '@/components/hotels/HotelList';
import CategoryBar from '@/components/hotels/CategoryBar';
import Filters from '@/components/hotels/Filters';
import AmenityFilter from '@/components/hotels/AmenityFilter';
import HotelsHero from '@/components/hotels/Hero';

export default function HotelsPageClient({ 
  locale, 
  initialHotels, 
  categories, 
  destinations,
  searchParams 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    locations: [],
    categories: [],
    amenities: []
  });

  // Filter hotels based on all criteria
  const filteredHotels = useMemo(() => {
    let filtered = [...initialHotels];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(hotel => 
        hotel.name?.toLowerCase().includes(query) ||
        hotel.location?.toLowerCase().includes(query) ||
        hotel.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(hotel => 
        hotel.categories?.includes(selectedCategory)
      );
    }

    // Location filter
    if (activeFilters.locations.length > 0) {
      filtered = filtered.filter(hotel => {
        const hotelDestinationId = hotel.destination?.id || hotel.destination_id;
        return activeFilters.locations.includes(hotelDestinationId);
      });
    }

    // Category filter from modal
    if (activeFilters.categories.length > 0) {
      filtered = filtered.filter(hotel => 
        hotel.categories?.some(cat => activeFilters.categories.includes(cat))
      );
    }

    // Amenity filter
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(hotel => {
        const hotelAmenityIds = hotel.amenities?.map(a => 
          a.hotel_amenities_id?.id || a.id
        ) || [];
        return selectedAmenities.every(amenityId => 
          hotelAmenityIds.includes(amenityId)
        );
      });
    }

    return filtered;
  }, [initialHotels, searchQuery, selectedCategory, activeFilters, selectedAmenities]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleFilterChange = useCallback((filters) => {
    setActiveFilters(filters);
  }, []);

  const handleCategorySelect = useCallback((categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  }, [selectedCategory]);

  const handleAmenityChange = useCallback((amenities) => {
    setSelectedAmenities(amenities);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <HotelsHero />
      
      {/* Category Bar */}
      <CategoryBar 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />
      
      {/* Filters Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          {/* Search and Filter Modal */}
          <Filters 
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            initialSearchQuery={searchQuery}
            activeFilters={activeFilters}
          />
          
          {/* Amenity Filters */}
          <div className="pb-6">
            <AmenityFilter
              activeAmenities={selectedAmenities}
              onAmenityChange={handleAmenityChange}
            />
          </div>
        </div>
      </div>
      
      {/* Hotels Grid */}
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Results count */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              {filteredHotels.length} {filteredHotels.length === 1 ? 'hotel' : 'hotels'} found
              {(searchQuery || selectedCategory || selectedAmenities.length > 0) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                    setSelectedAmenities([]);
                    setActiveFilters({ locations: [], categories: [], amenities: [] });
                  }}
                  className="ml-2 text-gray-900 underline hover:no-underline"
                >
                  Clear all filters
                </button>
              )}
            </p>
          </div>
          
          <HotelList hotels={filteredHotels} />
        </div>
      </main>
    </div>
  );
}