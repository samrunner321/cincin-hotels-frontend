import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';

/**
 * Props für eine einzelne Filteroption
 */
export interface FilterOption {
  /** Eindeutige ID der Option */
  id: string | number;
  /** Anzeigetext der Option */
  label: string;
}

/**
 * Props für die FilterModal-Komponente
 */
export interface FilterModalProps {
  /** ID des Modals für Accessibility */
  id?: string;
  /** Ist das Modal geöffnet? */
  isOpen: boolean;
  /** Callback beim Schließen des Modals */
  onClose: () => void;
  /** Callback bei Änderung der Filter */
  onFilterChange?: (filters: Record<string, any[]>) => void;
  /** Aktuell aktive Filter */
  activeFilters?: Record<string, any[]>;
  /** Optionen für Standorte */
  locationOptions?: FilterOption[];
  /** Optionen für Kategorien */
  categoryOptions?: FilterOption[];
}

/**
 * Props für die Checkbox-Komponente
 */
interface CheckboxProps {
  /** ID des Checkboxes */
  id: string;
  /** Ist die Checkbox angehakt? */
  checked: boolean;
  /** Callback bei Änderung */
  onChange: () => void;
  /** Label-Text */
  label: string;
}

/**
 * Props für die FilterSection-Komponente
 */
interface FilterSectionProps {
  /** Titel der Sektion */
  title: string;
  /** Filteroption */
  options: FilterOption[];
  /** Ausgewählte Werte */
  selectedValues: (string | number)[];
  /** Callback bei Änderung */
  onChange: (id: string | number) => void;
  /** ID der Sektion für Accessibility */
  sectionId: string;
}

/**
 * FilterModal-Komponente
 * 
 * Ein Modal für die Auswahl von Filtern
 * 
 * @example
 * <FilterModal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   onFilterChange={handleFilterChange}
 *   activeFilters={{ categories: [1, 2], locations: [3] }}
 * />
 */
export default function FilterModal({ 
  id,
  isOpen, 
  onClose, 
  onFilterChange,
  activeFilters = { locations: [], categories: [] },
  // Standard-Optionen für Filter
  locationOptions = [
    { id: 47, label: 'South Tyrol' },
    { id: 46, label: 'Switzerland' },
    { id: 48, label: 'Austria' },
    { id: 49, label: 'Italy' },
    { id: 50, label: 'Germany' }
  ],
  categoryOptions = [
    { id: 36, label: 'Adults Only' },
    { id: 39, label: 'Family' },
    { id: 50, label: 'Fine Dining' },
    { id: 43, label: 'Mountains' },
    { id: 44, label: 'Beach' },
    { id: 40, label: 'Spa & Wellness' },
    { id: 41, label: 'Design' },
    { id: 42, label: 'Boutique' }
  ]
}: FilterModalProps): JSX.Element | null {
  // Initialisiere mit aktiven Filtern oder leeren Arrays
  const [selectedLocations, setSelectedLocations] = useState<(string | number)[]>(activeFilters.locations || []);
  const [selectedCategories, setSelectedCategories] = useState<(string | number)[]>(activeFilters.categories || []);
  
  // Verfolge "dirty"-Status, um den Apply-Button zu aktivieren/deaktivieren
  const [isDirty, setIsDirty] = useState(false);
  
  // Zähle ausgewählte Filter
  const selectedCount = selectedLocations.length + selectedCategories.length;
  
  // Refs für Fokus-Management
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const initialFocusRef = useRef<HTMLButtonElement>(null);
  
  // Body-Scroll-Lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      // Fokussiere auf den Schließen-Button, wenn das Modal öffnet
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
  
  // Setze den Dirty-Status zurück, wenn das Modal geöffnet/geschlossen wird
  useEffect(() => {
    if (isOpen) {
      setIsDirty(false);
    }
  }, [isOpen]);
  
  // Prüfe, ob sich Filter geändert haben, um als "dirty" zu markieren
  useEffect(() => {
    const locationsChanged = !arraysEqual(selectedLocations, activeFilters.locations || []);
    const categoriesChanged = !arraysEqual(selectedCategories, activeFilters.categories || []);
    
    setIsDirty(locationsChanged || categoriesChanged);
  }, [selectedLocations, selectedCategories, activeFilters]);
  
  // Tastatur-Support (ESC zum Schließen)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  
  // Fokus-Falle innerhalb des Modals
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
   * Handler für Änderungen an Standorten
   */
  const handleLocationChange = (locationId: string | number) => {
    setSelectedLocations(prev => {
      if (prev.includes(locationId)) {
        return prev.filter(id => id !== locationId);
      } else {
        return [...prev, locationId];
      }
    });
  };
  
  /**
   * Handler für Änderungen an Kategorien
   */
  const handleCategoryChange = (categoryId: string | number) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };
  
  /**
   * Wendet Filter an
   */
  const applyFilters = () => {
    if (onFilterChange) {
      onFilterChange({
        locations: selectedLocations,
        categories: selectedCategories
      });
    }
    onClose();
  };
  
  /**
   * Setzt Filter zurück
   */
  const resetFilters = () => {
    setSelectedLocations([]);
    setSelectedCategories([]);
  };
  
  /**
   * Generiert eine ID für ein Abschnittslabel
   */
  const getSectionLabelId = (section: string) => `${id || 'filter-modal'}-${section}-heading`;
  
  /**
   * Hilfsfunktion zum Vergleichen von Arrays
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
  
  /**
   * Benutzerdefinierte Checkbox-Komponente
   */
  const Checkbox = ({ id, checked, onChange, label }: CheckboxProps): JSX.Element => (
    <div className="flex items-center">
      <div className="relative flex items-center">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          className="sr-only peer" // Ursprünglichen Input verstecken, aber zugänglich halten
        />
        <div className="w-5 h-5 border border-gray-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 peer-focus:ring-2 peer-focus:ring-offset-1 peer-focus:ring-blue-500 transition-colors cursor-pointer flex items-center justify-center">
          {checked && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <label htmlFor={id} className="ml-2 text-gray-700 cursor-pointer select-none">
          {label}
        </label>
      </div>
    </div>
  );
  
  if (!isOpen) return null;
  
  /**
   * Filter-Abschnitt-Komponente für DRY-Code
   */
  const FilterSection = ({ title, options, selectedValues, onChange, sectionId }: FilterSectionProps): JSX.Element => (
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
            checked={selectedValues.includes(option.id)}
            onChange={() => onChange(option.id)}
            label={option.label}
          />
        ))}
      </div>
    </section>
  );
  
  // Support für Framer-Motion-Animation
  const MotionOverlay = motion.div;
  const MotionPanel = motion.div;
  
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
          {/* Backdrop-Overlay */}
          <MotionOverlay
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
            aria-hidden="true"
          />
          
          {/* Modal-Panel */}
          <MotionPanel
            ref={modalRef}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={panelVariants}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed inset-y-0 right-0 max-w-md w-full bg-white z-50 overflow-y-auto shadow-lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${id || 'filter-modal'}-title`}
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <button 
                      ref={closeButtonRef}
                      onClick={onClose} 
                      className="mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Close filters"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M15 1L1 15M1 1L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <h2 id={`${id || 'filter-modal'}-title`} className="text-xl font-semibold text-gray-900">
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
                
                {/* Zusammenfassung der ausgewählten Filter */}
                {selectedCount > 0 && (
                  <div className="mt-4 flex items-center">
                    <span className="text-sm text-gray-500">
                      {selectedCount} filter{selectedCount !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                )}
              </div>
              
              {/* Filter-Inhalt */}
              <div className="flex-grow overflow-y-auto p-6">
                <FilterSection
                  title="Locations"
                  options={locationOptions}
                  selectedValues={selectedLocations}
                  onChange={handleLocationChange}
                  sectionId={getSectionLabelId('locations')}
                />
                
                <FilterSection
                  title="Categories"
                  options={categoryOptions}
                  selectedValues={selectedCategories}
                  onChange={handleCategoryChange}
                  sectionId={getSectionLabelId('categories')}
                />
                
                {/* Hier können weitere Filter-Abschnitte hinzugefügt werden */}
              </div>
              
              {/* Footer mit Aktionen */}
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
                      "sm:flex-1 sm:order-2 bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                      !isDirty && "bg-blue-300 cursor-not-allowed"
                    )}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </MotionPanel>
        </>
      )}
    </AnimatePresence>
  );
}