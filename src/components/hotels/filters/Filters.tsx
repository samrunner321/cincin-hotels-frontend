// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { cn } from '../../../../lib/utils';
import BaseFilter, { FilterGroup, ActiveFilters } from '../../../../components/ui/filters/BaseFilter';
import styles from './Filters.module.css';

export interface HotelFiltersProps {
  /** Callback für die Suche */
  onSearch?: (query: string) => Promise<void>;
  /** Callback für Filteränderungen */
  onFilterChange?: (filters: ActiveFilters) => void;
  /** Initiale Suchanfrage */
  initialSearchQuery?: string;
  /** Aktive Filter */
  activeFilters?: ActiveFilters;
  /** Zusätzliche CSS-Klassen */
  className?: string;
  /** Verfügbare Standorte für Filter */
  locations?: Array<{ id: string | number; name: string; count?: number }>;
  /** Verfügbare Kategorien für Filter */
  categories?: Array<{ id: string | number; name: string; count?: number; color?: string }>;
  /** Verfügbare Preiskategorien für Filter */
  priceRanges?: Array<{ id: string | number; name: string; min: number; max: number }>;
  /** Verfügbare Bewertungen für Filter */
  ratings?: Array<{ id: string | number; name: string; value: number }>;
  /** Einheiten für Preisangaben (z.B. '€') */
  currency?: string;
}

/**
 * HotelFilters-Komponente
 * 
 * Spezialisierte Filter-Komponente für Hotels, basierend auf der BaseFilter-Komponente.
 * 
 * @example
 * <HotelFilters 
 *   onSearch={handleSearch} 
 *   onFilterChange={handleFilterChange}
 *   locations={locationOptions}
 *   categories={categoryOptions}
 *   activeFilters={{ categories: [1, 2], locations: [3] }}
 * />
 */
export default function HotelFilters({
  onSearch,
  onFilterChange,
  initialSearchQuery = '',
  activeFilters = {},
  className = '',
  locations = [],
  categories = [],
  priceRanges = [],
  ratings = [],
  currency = '€'
}: HotelFiltersProps) {
  // Filter-Gruppen für Hotels aufbauen
  const filterGroups: FilterGroup[] = [];
  
  // Wenn Standorte vorhanden sind, füge sie hinzu
  if (locations && locations.length > 0) {
    filterGroups.push({
      id: 'locations',
      label: 'Locations',
      options: locations.map(location => ({
        id: location.id,
        label: `${location.name}${location.count ? ` (${location.count})` : ''}`,
      })),
      multiSelect: true,
      icon: (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={styles.groupIcon} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
          />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
          />
        </svg>
      )
    });
  }
  
  // Wenn Kategorien vorhanden sind, füge sie hinzu
  if (categories && categories.length > 0) {
    filterGroups.push({
      id: 'categories',
      label: 'Categories',
      options: categories.map(category => ({
        id: category.id,
        label: `${category.name}${category.count ? ` (${category.count})` : ''}`,
        color: category.color
      })),
      multiSelect: true,
      icon: (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={styles.groupIcon} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" 
          />
        </svg>
      )
    });
  }
  
  // Wenn Preiskategorien vorhanden sind, füge sie hinzu
  if (priceRanges && priceRanges.length > 0) {
    filterGroups.push({
      id: 'priceRanges',
      label: 'Price Range',
      options: priceRanges.map(range => ({
        id: range.id,
        label: `${range.name} (${range.min}-${range.max} ${currency})`,
        meta: { min: range.min, max: range.max }
      })),
      multiSelect: false,
      icon: (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={styles.groupIcon} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      )
    });
  }
  
  // Wenn Bewertungen vorhanden sind, füge sie hinzu
  if (ratings && ratings.length > 0) {
    filterGroups.push({
      id: 'ratings',
      label: 'Rating',
      options: ratings.map(rating => ({
        id: rating.id,
        label: rating.name,
        meta: { value: rating.value }
      })),
      multiSelect: false,
      icon: (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={styles.groupIcon} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
          />
        </svg>
      )
    });
  }
  
  return (
    <BaseFilter
      onSearch={onSearch}
      onFilterChange={onFilterChange}
      initialSearchQuery={initialSearchQuery}
      activeFilters={activeFilters}
      filterGroups={filterGroups}
      className={cn(styles.hotelFilters, className)}
      searchPlaceholder="Search hotels, destinations..."
      filterButtonLabel="Filters"
      headerComponent={(
        <div className={styles.filtersHeader}>
          <h2 className={styles.filtersHeading}>Find Your Perfect Hotel</h2>
        </div>
      )}
      resetLabel="Reset Filters"
      applyLabel="Apply Filters"
    />
  );
}