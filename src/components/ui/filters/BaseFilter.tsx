import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../../lib/utils';
import BaseFilterModal from './BaseFilterModal';
import BaseInput from '../forms/BaseInput';
import styles from './BaseFilter.module.css';

/**
 * Filter-Option Typ
 */
export interface FilterOption {
  /** ID der Option (kann string oder number sein) */
  id: string | number;
  /** Anzeigename der Option */
  label: string;
  /** Optionaler Gruppierungsschlüssel */
  group?: string;
  /** Optionale Metadaten oder erweiterte Werte */
  meta?: Record<string, any>;
  /** Optional deaktiviert */
  disabled?: boolean;
  /** Optionale Farbe für visuelle Darstellung */
  color?: string;
  /** Optionales Icon */
  icon?: React.ReactNode;
}

/**
 * Filter-Gruppe
 */
export interface FilterGroup {
  /** ID der Gruppe */
  id: string;
  /** Anzeigename der Gruppe */
  label: string;
  /** Optionen in dieser Gruppe */
  options: FilterOption[];
  /** Ob Mehrfachauswahl möglich ist */
  multiSelect?: boolean;
  /** Optionales Icon */
  icon?: React.ReactNode;
  /** Optionale Beschreibung */
  description?: string;
  /** Optionale Sortierung der Optionen */
  sort?: 'asc' | 'desc' | 'none';
}

/**
 * Aktive Filter
 */
export type ActiveFilters = Record<string, Array<string | number>>;

/**
 * Props für die BaseFilter-Komponente
 */
export interface BaseFilterProps {
  /** Callback für die Suche */
  onSearch?: (query: string) => Promise<void>;
  /** Callback für Filteränderungen */
  onFilterChange?: (filters: ActiveFilters) => void;
  /** Initiale Suchanfrage */
  initialSearchQuery?: string;
  /** Aktive Filter */
  activeFilters?: ActiveFilters;
  /** Filter-Gruppen */
  filterGroups?: FilterGroup[];
  /** Zusätzliche CSS-Klassen */
  className?: string;
  /** Zusätzliche CSS-Klassen für das Suchfeld */
  searchClassName?: string;
  /** Zusätzliche CSS-Klassen für den Filter-Button */
  filterButtonClassName?: string;
  /** Platzhaltertext für das Suchfeld */
  searchPlaceholder?: string;
  /** Label für den Filter-Button */
  filterButtonLabel?: string;
  /** Ob die Suche deaktiviert sein soll */
  disableSearch?: boolean;
  /** Ob die Filter deaktiviert sein sollen */
  disableFilters?: boolean;
  /** Modal-ID für Barrierefreiheit */
  modalId?: string;
  /** Ob Filter direkt inline angezeigt werden sollen (ohne Modal) */
  inlineFilters?: boolean;
  /** Ob leere Filter-Gruppen ausgeblendet werden sollen */
  hideEmptyGroups?: boolean;
  /** Optionales Icon für die Suche */
  searchIcon?: React.ReactNode;
  /** Optionales Icon für den Filter-Button */
  filterIcon?: React.ReactNode;
  /** Optionale zusätzliche Komponente im Header */
  headerComponent?: React.ReactNode;
  /** Label für den Zurücksetzen-Button */
  resetLabel?: string;
  /** Label für den Anwenden-Button */
  applyLabel?: string;
}

/**
 * BaseFilter-Komponente
 * 
 * Eine flexible Komponente für Suche und Filter-Funktionalität.
 * 
 * @example
 * <BaseFilter 
 *   onSearch={handleSearch} 
 *   onFilterChange={handleFilterChange}
 *   filterGroups={[
 *     {
 *       id: 'categories',
 *       label: 'Kategorien',
 *       options: [
 *         { id: 1, label: 'Kategorie 1' },
 *         { id: 2, label: 'Kategorie 2' }
 *       ]
 *     }
 *   ]}
 *   activeFilters={{ categories: [1] }}
 * />
 */
export default function BaseFilter({
  onSearch,
  onFilterChange,
  initialSearchQuery = '',
  activeFilters = {},
  filterGroups = [],
  className = '',
  searchClassName = '',
  filterButtonClassName = '',
  searchPlaceholder = 'Search...',
  filterButtonLabel = 'Filters',
  disableSearch = false,
  disableFilters = false,
  modalId = 'filter-modal',
  inlineFilters = false,
  hideEmptyGroups = true,
  searchIcon,
  filterIcon,
  headerComponent,
  resetLabel = 'Reset',
  applyLabel = 'Apply Filters'
}: BaseFilterProps) {
  // Zustandsverwaltung
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Berechne die Anzahl aktiver Filter
  const activeFilterCount = Object.values(activeFilters)
    .reduce((count, filters) => count + filters.length, 0);
  
  /**
   * Handler für das Absenden des Suchformulars
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim() && !disableSearch) {
      setIsSearching(true);
      try {
        await onSearch(searchQuery);
      } finally {
        setIsSearching(false);
      }
    }
  };
  
  /**
   * Handler für das Zurücksetzen der Suche
   */
  const handleClearSearch = () => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (onSearch) {
      onSearch('');
    }
  };
  
  /**
   * Handler für das Öffnen des Filter-Modals
   */
  const handleOpenFilterModal = () => {
    if (!disableFilters) {
      setIsFilterModalOpen(true);
    }
  };
  
  /**
   * Handler für das Schließen des Filter-Modals
   */
  const handleCloseFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  // Standardmäßiges Suchsymbol
  const defaultSearchIcon = (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={styles.searchIcon} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
      />
    </svg>
  );
  
  // Standardmäßiges Filtersymbol
  const defaultFilterIcon = (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 20 20" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={styles.filterIcon}
    >
      <path 
        d="M5 5H15M7.5 10H12.5M9 15H11" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <section 
      className={cn(styles.baseFilter, className)}
      aria-label="Search and filters"
    >
      <div className={styles.filterContainer}>
        {/* Header-Komponente (optional) */}
        {headerComponent && (
          <div className={styles.headerComponent}>
            {headerComponent}
          </div>
        )}
      
        <div className={styles.filterControls}>
          {/* Suchformular */}
          {!disableSearch && (
            <form 
              onSubmit={handleSubmit} 
              className={cn(styles.searchForm, searchClassName)} 
              role="search"
            >
              <BaseInput
                id="search-input"
                ref={searchInputRef}
                type="search"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={searchIcon || defaultSearchIcon}
                suffix={searchQuery.length > 0 ? (
                  <button 
                    type="button"
                    onClick={handleClearSearch}
                    className={styles.clearButton}
                    aria-label="Clear search"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={styles.clearIcon} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M6 18L18 6M6 6l12 12" 
                      />
                    </svg>
                  </button>
                ) : null}
                inputClassName={styles.searchInput}
                disabled={isSearching}
              />
            </form>
          )}
          
          {/* Filter-Button */}
          {!disableFilters && !inlineFilters && (
            <button 
              onClick={handleOpenFilterModal}
              className={cn(
                styles.filterButton,
                activeFilterCount > 0 && styles.filterButtonActive,
                filterButtonClassName
              )}
              aria-haspopup="dialog"
              aria-expanded={isFilterModalOpen}
              aria-controls={modalId}
            >
              {filterIcon || defaultFilterIcon}
              <span className={styles.filterButtonText}>
                {activeFilterCount > 0 
                  ? `${filterButtonLabel} (${activeFilterCount})` 
                  : filterButtonLabel}
              </span>
            </button>
          )}
        </div>
        
        {/* Inline-Filter */}
        {!disableFilters && inlineFilters && filterGroups.length > 0 && (
          <div className={styles.inlineFilters}>
            {filterGroups.map(group => {
              // Wenn hideEmptyGroups true ist und keine Optionen vorhanden sind, überspringe
              if (hideEmptyGroups && (!group.options || group.options.length === 0)) {
                return null;
              }
              
              return (
                <div key={group.id} className={styles.inlineFilterGroup}>
                  <h3 className={styles.inlineFilterGroupTitle}>{group.label}</h3>
                  <div className={styles.inlineFilterOptions}>
                    {group.options.map(option => {
                      const isActive = activeFilters[group.id]?.includes(option.id);
                      
                      return (
                        <button
                          key={option.id}
                          className={cn(
                            styles.inlineFilterOption,
                            isActive && styles.inlineFilterOptionActive
                          )}
                          onClick={() => {
                            if (onFilterChange) {
                              const newFilters = { ...activeFilters };
                              
                              if (isActive) {
                                // Entferne Filter
                                newFilters[group.id] = newFilters[group.id].filter(
                                  id => id !== option.id
                                );
                              } else {
                                // Füge Filter hinzu
                                if (!newFilters[group.id]) {
                                  newFilters[group.id] = [];
                                }
                                
                                if (group.multiSelect !== false) {
                                  // Mehrfachauswahl
                                  newFilters[group.id] = [...newFilters[group.id], option.id];
                                } else {
                                  // Einzelauswahl
                                  newFilters[group.id] = [option.id];
                                }
                              }
                              
                              onFilterChange(newFilters);
                            }
                          }}
                          aria-pressed={isActive}
                          style={option.color ? { 
                            backgroundColor: isActive ? option.color : undefined,
                            borderColor: option.color,
                            color: isActive ? '#fff' : undefined
                          } : undefined}
                        >
                          {option.icon && (
                            <span className={styles.optionIcon}>{option.icon}</span>
                          )}
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            
            {/* Reset-Button für Inline-Filter */}
            {activeFilterCount > 0 && (
              <button
                className={styles.inlineFilterReset}
                onClick={() => {
                  if (onFilterChange) {
                    onFilterChange({});
                  }
                }}
              >
                {resetLabel}
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Filter-Modal */}
      {!disableFilters && !inlineFilters && (
        <BaseFilterModal
          id={modalId}
          isOpen={isFilterModalOpen}
          onClose={handleCloseFilterModal}
          onFilterChange={onFilterChange}
          activeFilters={activeFilters}
          filterGroups={filterGroups}
          resetLabel={resetLabel}
          applyLabel={applyLabel}
          hideEmptyGroups={hideEmptyGroups}
        />
      )}
    </section>
  );
}