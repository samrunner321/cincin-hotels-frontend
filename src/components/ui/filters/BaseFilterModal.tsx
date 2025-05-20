import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { FilterGroup, FilterOption, ActiveFilters } from './BaseFilter';
import styles from './BaseFilterModal.module.css';

/**
 * Props für die BaseFilterModal-Komponente
 */
export interface BaseFilterModalProps {
  /** ID des Modals für Accessibility */
  id?: string;
  /** Ist das Modal geöffnet? */
  isOpen: boolean;
  /** Callback beim Schließen des Modals */
  onClose: () => void;
  /** Callback bei Änderung der Filter */
  onFilterChange?: (filters: ActiveFilters) => void;
  /** Aktuell aktive Filter */
  activeFilters?: ActiveFilters;
  /** Filter-Gruppen */
  filterGroups?: FilterGroup[];
  /** Label für den Zurücksetzen-Button */
  resetLabel?: string;
  /** Label für den Anwenden-Button */
  applyLabel?: string;
  /** Label für den Abbrechen-Button */
  cancelLabel?: string;
  /** Titel des Modals */
  title?: string;
  /** CSS-Klassen */
  className?: string;
  /** Soll der Overlay beim Klicken schließen? */
  closeOnOverlayClick?: boolean;
  /** Sollen leere Gruppen ausgeblendet werden? */
  hideEmptyGroups?: boolean;
  /** Sortierung der Filtergruppen */
  groupSort?: 'asc' | 'desc' | 'none';
  /** Zusätzliche Header-Komponente */
  headerComponent?: React.ReactNode;
  /** Zusätzliche Footer-Komponente */
  footerComponent?: React.ReactNode;
}

/**
 * BaseFilterModal-Komponente
 * 
 * Ein Modal für die Auswahl von Filtern mit Checkboxen.
 * 
 * @example
 * <BaseFilterModal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   onFilterChange={handleFilterChange}
 *   activeFilters={{ categories: [1, 2] }}
 *   filterGroups={[
 *     { id: 'categories', label: 'Kategorien', options: [...] }
 *   ]}
 * />
 */
export default function BaseFilterModal({
  id = 'filter-modal',
  isOpen,
  onClose,
  onFilterChange,
  activeFilters = {},
  filterGroups = [],
  resetLabel = 'Reset All',
  applyLabel = 'Apply Filters',
  cancelLabel = 'Cancel',
  title = 'Filters',
  className = '',
  closeOnOverlayClick = true,
  hideEmptyGroups = true,
  groupSort = 'none',
  headerComponent,
  footerComponent
}: BaseFilterModalProps) {
  // Kopie der aktiven Filter für lokale Änderungen
  const [selectedFilters, setSelectedFilters] = useState<ActiveFilters>(activeFilters);
  
  // Merke, ob es Änderungen gab
  const [isDirty, setIsDirty] = useState(false);
  
  // Zähle ausgewählte Filter
  const selectedCount = Object.values(selectedFilters)
    .reduce((count, filters) => count + filters.length, 0);
  
  // Refs für Fokus-Management
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const initialFocusRef = useRef<HTMLButtonElement>(null);
  
  // Sortiere Filter-Gruppen nach Bedarf
  const sortedFilterGroups = [...filterGroups];
  if (groupSort !== 'none') {
    sortedFilterGroups.sort((a, b) => {
      if (groupSort === 'asc') {
        return a.label.localeCompare(b.label);
      } else {
        return b.label.localeCompare(a.label);
      }
    });
  }
  
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
  
  // Aktualisiere lokale Filter, wenn sich activeFilters ändert
  useEffect(() => {
    if (isOpen) {
      setSelectedFilters(activeFilters);
      setIsDirty(false);
    }
  }, [isOpen, activeFilters]);
  
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
   * Handler für Filteränderungen
   */
  const handleFilterChange = (groupId: string, optionId: string | number) => {
    setSelectedFilters(prev => {
      const newState = { ...prev };
      
      // Finde die Gruppe
      const group = filterGroups.find(g => g.id === groupId);
      
      if (group) {
        // Wenn die Option bereits ausgewählt ist, entferne sie
        if (newState[groupId]?.includes(optionId)) {
          newState[groupId] = newState[groupId].filter(id => id !== optionId);
          if (newState[groupId].length === 0) {
            delete newState[groupId];
          }
        } else {
          // Wenn Einzelauswahl, ersetze alle ausgewählten Optionen
          if (group.multiSelect === false) {
            newState[groupId] = [optionId];
          } else {
            // Sonst füge zur Mehrfachauswahl hinzu
            if (!newState[groupId]) {
              newState[groupId] = [];
            }
            newState[groupId] = [...newState[groupId], optionId];
          }
        }
      }
      
      return newState;
    });
    
    setIsDirty(true);
  };
  
  /**
   * Wendet Filter an
   */
  const applyFilters = () => {
    if (onFilterChange) {
      onFilterChange(selectedFilters);
    }
    onClose();
  };
  
  /**
   * Setzt Filter zurück
   */
  const resetFilters = () => {
    setSelectedFilters({});
    setIsDirty(true);
  };
  
  /**
   * Generiert eine ID für ein Abschnittslabel
   */
  const getSectionLabelId = (section: string) => `${id}-${section}-heading`;
  
  /**
   * Checkbox-Komponente
   */
  const Checkbox = ({ 
    id, 
    checked, 
    onChange, 
    label, 
    disabled = false,
    color,
    icon
  }: { 
    id: string; 
    checked: boolean; 
    onChange: () => void; 
    label: string;
    disabled?: boolean;
    color?: string;
    icon?: React.ReactNode;
  }) => (
    <div className={cn(styles.checkboxContainer, disabled && styles.disabled)}>
      <div className={styles.checkboxWrapper}>
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={disabled ? undefined : onChange}
          className={styles.checkboxInput}
          disabled={disabled}
        />
        <div 
          className={cn(
            styles.checkboxControl, 
            checked && styles.checked
          )}
          style={color && checked ? { backgroundColor: color, borderColor: color } : undefined}
        >
          {checked && (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={styles.checkIcon} 
              viewBox="0 0 20 20" 
              fill="currentColor" 
              aria-hidden="true"
            >
              <path 
                fillRule="evenodd" 
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                clipRule="evenodd" 
              />
            </svg>
          )}
        </div>
        <label htmlFor={id} className={styles.checkboxLabel}>
          {icon && <span className={styles.optionIcon}>{icon}</span>}
          {label}
        </label>
      </div>
    </div>
  );
  
  /**
   * Filter-Abschnitt-Komponente
   */
  const FilterSection = ({ 
    group
  }: { 
    group: FilterGroup;
  }) => {
    // Wenn hideEmptyGroups true ist und keine Optionen vorhanden sind, nichts rendern
    if (hideEmptyGroups && (!group.options || group.options.length === 0)) {
      return null;
    }
    
    // Sortiere Optionen wenn nötig
    const sortedOptions = [...group.options];
    if (group.sort !== 'none' && group.sort) {
      sortedOptions.sort((a, b) => {
        if (group.sort === 'asc') {
          return a.label.localeCompare(b.label);
        } else {
          return b.label.localeCompare(a.label);
        }
      });
    }
    
    // Berechne, wie viele Optionen in dieser Gruppe ausgewählt sind
    const selectedCount = selectedFilters[group.id]?.length || 0;
    
    return (
      <section 
        className={styles.filterSection} 
        aria-labelledby={getSectionLabelId(group.id)}
      >
        <div className={styles.filterSectionHeader}>
          <h3 
            id={getSectionLabelId(group.id)} 
            className={styles.filterSectionTitle}
          >
            {group.icon && <span className={styles.groupIcon}>{group.icon}</span>}
            {group.label}
          </h3>
          {selectedCount > 0 && (
            <span className={styles.selectedCount}>
              {selectedCount} {selectedCount === 1 ? 'selected' : 'selected'}
            </span>
          )}
        </div>
        
        {group.description && (
          <p className={styles.filterSectionDescription}>{group.description}</p>
        )}
        
        <div className={styles.filterOptions}>
          {sortedOptions.map(option => (
            <Checkbox
              key={option.id}
              id={`${group.id}-${option.id}`}
              checked={selectedFilters[group.id]?.includes(option.id) || false}
              onChange={() => handleFilterChange(group.id, option.id)}
              label={option.label}
              disabled={option.disabled}
              color={option.color}
              icon={option.icon}
            />
          ))}
        </div>
      </section>
    );
  };
  
  // Animation für framer-motion
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
  
  // Wenn das Modal nicht geöffnet ist, nichts rendern
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop-Overlay */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            transition={{ duration: 0.2 }}
            className={styles.overlay}
            onClick={closeOnOverlayClick ? onClose : undefined}
            aria-hidden="true"
          />
          
          {/* Modal-Panel */}
          <motion.div
            ref={modalRef}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={panelVariants}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className={cn(styles.modalPanel, className)}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${id}-title`}
          >
            <div className={styles.modalInner}>
              {/* Header */}
              <div className={styles.modalHeader}>
                <div className={styles.modalTitleRow}>
                  <button 
                    ref={closeButtonRef}
                    onClick={onClose} 
                    className={styles.closeButton}
                    aria-label="Close filters"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={styles.closeIcon} 
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
                  <h2 id={`${id}-title`} className={styles.modalTitle}>
                    {title}
                  </h2>
                  
                  {selectedCount > 0 && (
                    <button 
                      ref={initialFocusRef}
                      onClick={resetFilters}
                      className={styles.resetButton}
                      aria-label="Reset all filters"
                    >
                      {resetLabel}
                    </button>
                  )}
                </div>
                
                {/* Optionale Header-Komponente */}
                {headerComponent && (
                  <div className={styles.headerComponent}>
                    {headerComponent}
                  </div>
                )}
                
                {/* Zusammenfassung der ausgewählten Filter */}
                {selectedCount > 0 && (
                  <div className={styles.selectedSummary}>
                    <span className={styles.selectedCountBadge}>
                      {selectedCount} {selectedCount === 1 ? 'filter' : 'filters'} selected
                    </span>
                  </div>
                )}
              </div>
              
              {/* Filter-Inhalt */}
              <div className={styles.modalContent}>
                {sortedFilterGroups.map(group => (
                  <FilterSection key={group.id} group={group} />
                ))}
              </div>
              
              {/* Footer mit Aktionen */}
              <div className={styles.modalFooter}>
                {footerComponent ? (
                  <div className={styles.footerComponent}>
                    {footerComponent}
                  </div>
                ) : (
                  <div className={styles.actionButtons}>
                    <button
                      onClick={onClose}
                      className={styles.cancelButton}
                    >
                      {cancelLabel}
                    </button>
                    <button
                      onClick={applyFilters}
                      disabled={!isDirty}
                      className={cn(
                        styles.applyButton,
                        !isDirty && styles.disabled
                      )}
                    >
                      {applyLabel}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}