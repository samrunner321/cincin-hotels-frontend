// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDestinations } from '../../hooks/useDirectusData';
import { Destination, Category } from '../../lib/directus';
import DestinationCard from './DestinationCard';
import CategoryBar from '../Hotels_Page/CategoryBar';

interface DestinationListProps {
  initialDestinations: Destination[];
  categories: Category[];
}

type RegionType = 'alps' | 'mediterranean' | 'northern_europe' | 'central_europe' | 'southern_europe' | null;

export default function DestinationList({ initialDestinations, categories }: DestinationListProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category') || null
  );
  const [selectedRegion, setSelectedRegion] = useState<RegionType>(
    searchParams.get('region') as RegionType || null
  );
  const [displayedDestinations, setDisplayedDestinations] = useState<Destination[]>(initialDestinations);

  // Client-side data fetching with filters
  const { destinations, isLoading, isError } = useDestinations({
    categories: selectedCategory ? [selectedCategory] : undefined,
  });

  // Update displayed destinations when client-side data comes in or filters change
  useEffect(() => {
    if (destinations) {
      // First filter by category (already handled by API)
      let filtered = [...destinations];
      
      // Then filter by region if selected
      if (selectedRegion) {
        filtered = filtered.filter(dest => dest.region === selectedRegion);
      }
      
      setDisplayedDestinations(filtered);
    } else if (!selectedCategory) {
      // If we're using the initial SSG data, filter by region
      let filtered = [...initialDestinations];
      
      if (selectedRegion) {
        filtered = filtered.filter(dest => dest.region === selectedRegion);
      }
      
      setDisplayedDestinations(filtered);
    }
  }, [destinations, selectedCategory, selectedRegion, initialDestinations]);
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedRegion) params.set('region', selectedRegion);
    
    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.push(`/destinations${newUrl}`, { scroll: false });
  }, [selectedCategory, selectedRegion, router]);

  // Handle category selection
  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };
  
  // Handle region selection
  const handleRegionChange = (region: RegionType) => {
    setSelectedRegion(region === selectedRegion ? null : region);
  };

  // Region options
  const regions = [
    { id: 'mediterranean', name: 'Mediterranean' },
    { id: 'alps', name: 'Alps' },
    { id: 'northern_europe', name: 'Northern Europe' },
    { id: 'central_europe', name: 'Central Europe' },
    { id: 'southern_europe', name: 'Southern Europe' }
  ];

  return (
    <div>
      <div className="mb-8">
        <CategoryBar 
          categories={categories} 
          selectedCategory={selectedCategory} 
          onSelectCategory={handleCategoryChange}
        />
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3">Filter by Region</h3>
        <div className="flex flex-wrap gap-2">
          {regions.map(region => (
            <button
              key={region.id}
              className={`px-4 py-2 text-sm rounded-full transition-colors ${
                selectedRegion === region.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleRegionChange(region.id as RegionType)}
            >
              {region.name}
            </button>
          ))}
        </div>
      </div>

      {isLoading && !destinations && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {isError && (
        <div className="text-center text-red-500 py-8">
          An error occurred while loading destinations.
        </div>
      )}

      {!isLoading && displayedDestinations.length === 0 && (
        <div className="text-center py-8">
          No destinations found. Please try different filters.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedDestinations.map((destination) => (
          <DestinationCard key={destination.id} destination={destination} />
        ))}
      </div>
    </div>
  );
}