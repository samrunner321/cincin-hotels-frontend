// @ts-nocheck
'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterOption, FilterModalProps } from './filters/FilterModal';
import { cn } from '../../../lib/utils';
import { useUIState } from '../UIStateContext';
import { HotelFilters } from './HotelFilters';

/**
 * Props für Checkbox-Komponente
 */
interface CheckboxProps {
  /** ID des Checkboxes */
  id: string;
  /** Label-Text */
  label: string;
  /** Ist die Checkbox angehakt? */
  checked: boolean;
  /** Callback bei Änderung */
  onChange: () => void;
  /** Deaktiviert-Status */
  disabled?: boolean;
}

/**
 * Props für Filter-Sektion
 */
interface FilterSectionProps {
  /** Titel der Sektion */
  title: string;
  /** Filter-Optionen */
  options: FilterOption[];
  /** Ausgewählte Werte */
  selectedValues: (string | number)[];
  /** Callback bei Änderung */
  onChange: (id: string | number) => void;
  /** ID der Sektion für Accessibility */
  sectionId: string;
}

/**
 * Props für Price-Range Filter
 */
interface PriceRangeProps {
  /** Minimum-Preis */
  min: number;
  /** Maximum-Preis */
  max: number;
  /** Aktueller Minimum-Wert */
  currentMin: number;
  /** Aktueller Maximum-Wert */
  currentMax: number;
  /** Callback bei Änderung */
  onChange: (min: number, max: number) => void;
}

/**
 * Props für AdvancedFilterModal
 */
export interface AdvancedFilterModalProps extends Omit<FilterModalProps, 'activeFilters'> {
  /** Aktive Filter */
  activeFilters?: HotelFilters;
  /** Preisbereich */
  priceRange?: {
    min: number;
    max: number;
    currentMin: number;
    currentMax: number;
  };
  /** Callback für Preisbereich-Änderung */
  onPriceRangeChange?: (min: number, max: number) => void;
  /** Callback für alle Filteränderungen */
  onFilterChange?: (filters: HotelFilters) => void;
}

/**
 * Erweiterte Filter-Modal Komponente
 * 
 * Bietet umfangreiche Filteroptionen für Hotels
 */
export default function AdvancedFilterModal({
  id = 'advanced-filter-modal',
  isOpen,
  onClose,
  onFilterChange,
  activeFilters = { categories: [], locations: [], experiences: [] },
  priceRange = { min: 0, max: 2000, currentMin: 0, currentMax: 2000 },
  onPriceRangeChange,
  locationOptions = [
    { id: 'alps', label: 'Alps' },
    { id: 'switzerland', label: 'Switzerland' },
    { id: 'italy', label: 'Italy' },
    { id: 'austria', label: 'Austria' },
    { id: 'germany', label: 'Germany' },
    { id: 'france', label: 'France' }
  ],
  categoryOptions = [
    { id: 'luxury', label: 'Luxury' },
    { id: 'boutique', label: 'Boutique' },
    { id: 'design', label: 'Design' },
    { id: 'wellness', label: 'Wellness & Spa' },
    { id: 'mountains', label: 'Mountains' },
    { id: 'lakeside', label: 'Lakeside' },
    { id: 'beachfront', label: 'Beachfront' },
    { id: 'adults-only', label: 'Adults Only' }
  ],
  experienceOptions = [
    { id: 'skiing', label: 'Skiing' },
    { id: 'hiking', label: 'Hiking' },
    { id: 'gastronomy', label: 'Gastronomy' },
    { id: 'cultural', label: 'Cultural' },
    { id: 'romantic', label: 'Romantic' },
    { id: 'family', label: 'Family' }
  ]
}: AdvancedFilterModalProps): JSX.Element | null {
  // UI State Context
  const { state: uiState } = useUIState();
  
  // Filter States
  const [selectedLocations, setSelectedLocations] = useState<string[]>(activeFilters.locations || []);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(activeFilters.categories || []);
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>(activeFilters.experiences || []);
  const [currentPriceRange, setCurrentPriceRange] = useState({
    min: priceRange.currentMin,
    max: priceRange.currentMax
  });
  
  // Dirty-Status für Apply-Button
  const [isDirty, setIsDirty] = useState(false);
  
  // Refs für Accessibility
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const initialFocusRef = useRef<HTMLButtonElement>(null);
  
  // Anzahl ausgewählter Filter
  const selectedCount = useMemo(() => {
    return selectedLocations.length + 
           selectedCategories.length + 
           selectedExperiences.length + 
           (currentPriceRange.min !== priceRange.min || 
            currentPriceRange.max !== priceRange.max ? 1 : 0);
  }, [
    selectedLocations, 
    selectedCategories, 
    selectedExperiences, 
    currentPriceRange,
    priceRange
  ]);
  
  // Beim Öffnen/Schließen - Scroll-Lock und Fokus-Management
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      // Fokus auf den Schließen-Button
      setTimeout(() => {
        initialFocusRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Dirty-Status zurücksetzen und Filter initialisieren
  useEffect(() => {
    if (isOpen) {
      setIsDirty(false);
      setSelectedLocations(activeFilters.locations || []);
      setSelectedCategories(activeFilters.categories || []);
      setSelectedExperiences(activeFilters.experiences || []);
      setCurrentPriceRange({
        min: priceRange.currentMin,
        max: priceRange.currentMax
      });
    }
  }, [isOpen, activeFilters, priceRange]);
  
  // Dirty-Status überwachen
  useEffect(() => {
    const locationsDirty = !arraysEqual(selectedLocations, activeFilters.locations || []);
    const categoriesDirty = !arraysEqual(selectedCategories, activeFilters.categories || []);
    const experiencesDirty = !arraysEqual(selectedExperiences, activeFilters.experiences || []);
    const priceDirty = currentPriceRange.min !== priceRange.currentMin || 
                      currentPriceRange.max !== priceRange.currentMax;
    
    setIsDirty(locationsDirty || categoriesDirty || experiencesDirty || priceDirty);
  }, [
    selectedLocations, 
    selectedCategories, 
    selectedExperiences, 
    currentPriceRange, 
    activeFilters,
    priceRange
  ]);
  
  // Tastatur-Events (ESC zum Schließen)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  
  // Fokus-Falle für das Modal
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    
    const modalElement = modalRef.current;
    const focusableElements = modalElement.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    };
    
    modalElement.addEventListener('keydown', handleTabKey);
    return () => modalElement.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);
  
  /**
   * Standort-Filter ändern
   */
  const handleLocationChange = (locationId: string | number): void => {
    setSelectedLocations(prev => {
      if (prev.includes(String(locationId))) {
        return prev.filter(id => id !== String(locationId));
      } else {
        return [...prev, String(locationId)];
      }
    });
  };
  
  /**
   * Kategorie-Filter ändern
   */
  const handleCategoryChange = (categoryId: string | number): void => {
    setSelectedCategories(prev => {
      if (prev.includes(String(categoryId))) {
        return prev.filter(id => id !== String(categoryId));
      } else {
        return [...prev, String(categoryId)];
      }
    });
  };
  
  /**
   * Erlebnis-Filter ändern
   */
  const handleExperienceChange = (experienceId: string | number): void => {
    setSelectedExperiences(prev => {
      if (prev.includes(String(experienceId))) {
        return prev.filter(id => id !== String(experienceId));
      } else {
        return [...prev, String(experienceId)];
      }
    });
  };
  
  /**
   * Preisbereich ändern
   */
  const handlePriceRangeChange = (min: number, max: number): void => {
    setCurrentPriceRange({ min, max });
  };
  
  /**
   * Filter anwenden
   */
  const applyFilters = (): void => {
    if (onFilterChange) {
      onFilterChange({
        locations: selectedLocations,
        categories: selectedCategories,
        experiences: selectedExperiences
      });
    }
    
    if (onPriceRangeChange) {
      onPriceRangeChange(currentPriceRange.min, currentPriceRange.max);
    }
    
    onClose();
  };
  
  /**
   * Filter zurücksetzen
   */
  const resetFilters = (): void => {
    setSelectedLocations([]);
    setSelectedCategories([]);
    setSelectedExperiences([]);
    setCurrentPriceRange({
      min: priceRange.min,
      max: priceRange.max
    });
  };
  
  /**
   * Hilfsmethode zum Vergleich von Arrays
   */
  function arraysEqual<T>(a: T[], b: T[]): boolean {
    if (a === b) return true;
    if (a.length !== b.length) return false;
    
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    
    for (let i = 0; i < sortedA.length; i++) {
      if (sortedA[i] !== sortedB[i]) return false;
    }
    return true;
  }
  
  // Wenn nicht offen, nichts rendern
  if (!isOpen) return null;
  
  // Animations-Einstellungen basierend auf Benutzereinstellungen
  const shouldAnimate = !uiState.theme.reducedMotion && uiState.theme.animationsEnabled;
  
  // Motion-Varianten für Animationen
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };
  
  const panelVariants = {
    hidden: { x: '100%' },
    visible: { x: 0 },
    exit: { x: '100%' }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={shouldAnimate ? "hidden" : "visible"}
            animate="visible"
            exit={shouldAnimate ? "exit" : "hidden"}
            variants={overlayVariants}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
            aria-hidden="true"
          />
          
          {/* Modal Panel */}
          <motion.div
            ref={modalRef}
            initial={shouldAnimate ? "hidden" : "visible"}
            animate="visible"
            exit={shouldAnimate ? "exit" : "hidden"}
            variants={panelVariants}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed inset-y-0 right-0 max-w-md w-full bg-white z-50 overflow-y-auto shadow-lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${id}-title`}
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <button 
                      ref={closeButtonRef}
                      onClick={onClose} 
                      className="mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
                      aria-label="Close filters"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M15 1L1 15M1 1L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <h2 id={`${id}-title`} className="text-xl font-semibold text-gray-900">
                      Filters
                    </h2>
                  </div>
                  
                  {selectedCount > 0 && (
                    <button 
                      ref={initialFocusRef}
                      onClick={resetFilters}
                      className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 underline underline-offset-2"
                      aria-label="Reset all filters"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                
                {/* Selected filters summary */}
                {selectedCount > 0 && (
                  <div className="mt-4 flex items-center">
                    <span className="text-sm text-gray-500">
                      {selectedCount} filter{selectedCount !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                )}
              </div>
              
              {/* Filter Content */}
              <div className="flex-grow overflow-y-auto p-6">
                {/* Locations Section */}
                <FilterSection
                  title="Locations"
                  options={locationOptions}
                  selectedValues={selectedLocations}
                  onChange={handleLocationChange}
                  sectionId={`${id}-locations-heading`}
                />
                
                {/* Categories Section */}
                <FilterSection
                  title="Categories"
                  options={categoryOptions}
                  selectedValues={selectedCategories}
                  onChange={handleCategoryChange}
                  sectionId={`${id}-categories-heading`}
                />
                
                {/* Experiences Section */}
                <FilterSection
                  title="Experiences"
                  options={experienceOptions}
                  selectedValues={selectedExperiences}
                  onChange={handleExperienceChange}
                  sectionId={`${id}-experiences-heading`}
                />
                
                {/* Price Range Section */}
                <section className="mb-8" aria-labelledby={`${id}-price-heading`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 id={`${id}-price-heading`} className="text-lg font-medium text-gray-900">
                      Price Range
                    </h3>
                    <span className="text-sm text-gray-500">
                      €{currentPriceRange.min} - €{currentPriceRange.max}
                    </span>
                  </div>
                  <PriceRange
                    min={priceRange.min}
                    max={priceRange.max}
                    currentMin={currentPriceRange.min}
                    currentMax={currentPriceRange.max}
                    onChange={handlePriceRangeChange}
                  />
                </section>
              </div>
              
              {/* Footer with Actions */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={onClose}
                    className="sm:order-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={applyFilters}
                    disabled={!isDirty}
                    className={cn(
                      "sm:flex-1 sm:order-2 bg-black text-white py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2",
                      !isDirty && "bg-gray-400 cursor-not-allowed"
                    )}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Checkbox Komponente
 */
function Checkbox({ id, label, checked, onChange, disabled = false }: CheckboxProps): JSX.Element {
  return (
    <div className="flex items-center">
      <div className="relative flex items-center">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only peer" // Versteckt, aber zugänglich
        />
        <div className={cn(
          "w-5 h-5 border rounded flex items-center justify-center transition-colors cursor-pointer",
          checked 
            ? "bg-black border-black" 
            : "border-gray-300 bg-white",
          disabled && "opacity-50 cursor-not-allowed",
          "peer-focus:ring-2 peer-focus:ring-offset-1 peer-focus:ring-black"
        )}>
          {checked && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <label htmlFor={id} className={cn(
          "ml-2 cursor-pointer select-none text-gray-700",
          disabled && "opacity-50 cursor-not-allowed"
        )}>
          {label}
        </label>
      </div>
    </div>
  );
}

/**
 * FilterSection Komponente
 */
function FilterSection({ title, options, selectedValues, onChange, sectionId }: FilterSectionProps): JSX.Element {
  return (
    <section className="mb-8" aria-labelledby={sectionId}>
      <div className="flex justify-between items-center mb-4">
        <h3 id={sectionId} className="text-lg font-medium text-gray-900">
          {title}
        </h3>
        {selectedValues.length > 0 && (
          <span className="text-sm text-gray-500">
            {selectedValues.length} selected
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4">
        {options.map(option => (
          <Checkbox
            key={option.id}
            id={`${title.toLowerCase()}-${option.id}`}
            checked={selectedValues.includes(String(option.id))}
            onChange={() => onChange(option.id)}
            label={option.label}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * PriceRange Komponente
 */
function PriceRange({ min, max, currentMin, currentMax, onChange }: PriceRangeProps): JSX.Element {
  const [localMin, setLocalMin] = useState(currentMin);
  const [localMax, setLocalMax] = useState(currentMax);
  const range = max - min;
  
  // Berechne prozentuale Position für die Range-Input-Thumbs
  const minPos = ((localMin - min) / range) * 100;
  const maxPos = ((localMax - min) / range) * 100;
  
  useEffect(() => {
    // Aktualisiere lokale Werte, wenn Props sich ändern
    setLocalMin(currentMin);
    setLocalMax(currentMax);
  }, [currentMin, currentMax]);
  
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(parseInt(e.target.value), localMax - 1);
    setLocalMin(newMin);
    onChange(newMin, localMax);
  };
  
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(parseInt(e.target.value), localMin + 1);
    setLocalMax(newMax);
    onChange(localMin, newMax);
  };
  
  return (
    <div className="mt-4">
      <div className="relative h-2 bg-gray-200 rounded-full">
        {/* Track fill */}
        <div 
          className="absolute h-full bg-black rounded-full"
          style={{ left: `${minPos}%`, width: `${maxPos - minPos}%` }}
        />
        
        {/* Min and Max values */}
        <div className="absolute top-6 left-0 text-xs text-gray-500">€{min}</div>
        <div className="absolute top-6 right-0 text-xs text-gray-500">€{max}</div>
      </div>
      
      <div className="relative mt-10">
        <input 
          type="range"
          min={min}
          max={max}
          value={localMin}
          onChange={handleMinChange}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none"
          style={{ 
            zIndex: 3,
            // Custom thumb styles
            WebkitAppearance: 'none',
          }}
        />
        <input 
          type="range"
          min={min}
          max={max}
          value={localMax}
          onChange={handleMaxChange}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none"
          style={{ 
            zIndex: 4,
            // Custom thumb styles
            WebkitAppearance: 'none',
          }}
        />
      </div>
      
      <div className="flex justify-between mt-8">
        <div className="w-1/2 pr-2">
          <label className="block text-sm text-gray-500 mb-1">Min Price</label>
          <input 
            type="number"
            min={min}
            max={localMax - 1}
            value={localMin}
            onChange={handleMinChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div className="w-1/2 pl-2">
          <label className="block text-sm text-gray-500 mb-1">Max Price</label>
          <input 
            type="number"
            min={localMin + 1}
            max={max}
            value={localMax}
            onChange={handleMaxChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>
    </div>
  );
}