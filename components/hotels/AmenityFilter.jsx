'use client';

import { useState, useEffect } from 'react';
import AmenityIcon from '../common/AmenityIcon';
import { useTranslation } from '@/providers/TranslationProvider';

export default function AmenityFilter({ activeAmenities = [], onAmenityChange }) {
  const { t, locale } = useTranslation();
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAmenities();
  }, [locale]);

  const fetchAmenities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/amenities?locale=${locale}`);
      if (response.ok) {
        const data = await response.json();
        setAmenities(data.amenities || []);
      }
    } catch (error) {
      console.error('Error fetching amenities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAmenityClick = (amenityId) => {
    if (onAmenityChange) {
      const newAmenities = activeAmenities.includes(amenityId)
        ? activeAmenities.filter(id => id !== amenityId)
        : [...activeAmenities, amenityId];
      onAmenityChange(newAmenities);
    }
  };

  if (loading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-10 w-24 bg-gray-200 rounded-full"></div>
          </div>
        ))}
      </div>
    );
  }

  // Group amenities by category for better organization
  const basicAmenities = amenities.filter(a => a.category === 'basic').slice(0, 8);
  const otherAmenities = amenities.filter(a => a.category !== 'basic');

  return (
    <div className="space-y-4">
      {/* Basic Amenities - Always visible */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {basicAmenities.map((amenity) => (
          <button
            key={amenity.id}
            onClick={() => handleAmenityClick(amenity.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full border transition-all
              whitespace-nowrap flex-shrink-0
              ${activeAmenities.includes(amenity.id)
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }
            `}
            aria-pressed={activeAmenities.includes(amenity.id)}
            aria-label={`Filter by ${amenity.name}`}
          >
            <AmenityIcon 
              amenity={amenity} 
              size={20} 
              className={activeAmenities.includes(amenity.id) ? 'text-white' : 'text-gray-600'}
            />
            <span className="text-sm font-medium">{amenity.name}</span>
          </button>
        ))}
        
        {/* Show more button if there are additional amenities */}
        {otherAmenities.length > 0 && (
          <button
            onClick={() => {/* Open modal with all amenities */}}
            className="flex items-center gap-2 px-4 py-2 rounded-full border bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100 whitespace-nowrap flex-shrink-0"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="text-sm font-medium">{t('hotels.filters.more')}</span>
          </button>
        )}
      </div>

      {/* Active amenities count */}
      {activeAmenities.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {activeAmenities.length} {t('hotels.filters.active')}
          </span>
          <button
            onClick={() => onAmenityChange([])}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            {t('hotels.filters.clear')}
          </button>
        </div>
      )}
    </div>
  );
}