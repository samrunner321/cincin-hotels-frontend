import { useReducer, useCallback, useMemo, useEffect } from 'react';
import { useUIState } from '../components/UIStateContext';

/**
 * Typen für Filter-Optionen
 */
export type FilterValue = string | number | boolean | Array<string | number>;

/**
 * Interface für eine einzelne Filter-Option
 */
export interface FilterOption {
  /** ID oder Wert der Option */
  id: string | number;
  /** Anzeigelabel */
  label: string;
  /** Ist die Option ausgewählt? */
  selected?: boolean;
  /** Anzahl der Elemente mit dieser Option */
  count?: number;
  /** Ist die Option deaktiviert? */
  disabled?: boolean;
  /** Gruppe für die Option (für verschachtelte Filter) */
  group?: string;
}

/**
 * Interface für den Filterzustand
 */
export interface FilterState {
  /** Aktive Filter als Schlüssel-Wert-Paare */
  activeFilters: Record<string, Array<string | number>>;
  /** Verfügbare Filter-Optionen */
  availableFilters: Record<string, FilterOption[]>;
  /** Ob die Filter geändert wurden */
  isDirty: boolean;
  /** Ob der Filter gerade angewendet wird */
  isApplying: boolean;
  /** Filterverlauf für Undo/Redo-Funktionalität */
  history: {
    past: Record<string, Array<string | number>>[];
    future: Record<string, Array<string | number>>[];
  };
  /** Filter-Metadaten */
  meta: {
    /** Zeitstempel der letzten Änderung */
    lastUpdated: number;
    /** Anzahl der aktiven Filter */
    activeFilterCount: number;
  };
}

/**
 * Interface für optimierte Aktionen zur Filteränderung
 */
export type FilterAction =
  | { type: 'SET_FILTER'; key: string; value: Array<string | number> }
  | { type: 'ADD_FILTER_VALUE'; key: string; value: string | number }
  | { type: 'REMOVE_FILTER_VALUE'; key: string; value: string | number }
  | { type: 'TOGGLE_FILTER_VALUE'; key: string; value: string | number }
  | { type: 'RESET_FILTERS' }
  | { type: 'RESET_FILTER'; key: string }
  | { type: 'SET_AVAILABLE_FILTERS'; filters: Record<string, FilterOption[]> }
  | { type: 'SET_APPLYING'; isApplying: boolean }
  | { type: 'APPLY_FILTERS' }
  | { type: 'UNDO' }
  | { type: 'REDO' };

/**
 * Anfangszustand für die Filter
 */
export const initialFilterState: FilterState = {
  activeFilters: {},
  availableFilters: {},
  isDirty: false,
  isApplying: false,
  history: {
    past: [],
    future: [],
  },
  meta: {
    lastUpdated: Date.now(),
    activeFilterCount: 0,
  },
};

/**
 * Hilfsfunktion zum Zählen aktiver Filter
 */
function countActiveFilters(filters: Record<string, Array<string | number>>): number {
  return Object.values(filters).reduce(
    (count, values) => count + values.length,
    0
  );
}

/**
 * Optimierter Reducer für Filteraktionen
 */
function filterReducer(state: FilterState, action: FilterAction): FilterState {
  let newActiveFilters: Record<string, Array<string | number>> = {};
  let newPast: Record<string, Array<string | number>>[] = [];
  let newFuture: Record<string, Array<string | number>>[] = [];
  
  // Kopie der State-Objekte - Optimierung durch Vermeidung unnötiger Kopien
  const createStateCopy = () => {
    newActiveFilters = { ...state.activeFilters };
    newPast = [...state.history.past];
    newFuture = [...state.history.future];
    
    // Speichere den aktuellen Zustand in der History
    newPast.push(JSON.parse(JSON.stringify(state.activeFilters)));
    
    // Begrenze die History-Größe
    if (newPast.length > 10) {
      newPast.shift();
    }
    
    // Wenn eine neue Aktion ausgeführt wird, future leeren
    newFuture = [];
  };
  
  switch (action.type) {
    case 'SET_FILTER':
      createStateCopy();
      
      // Wenn der Filter leer ist, entferne ihn komplett
      if (action.value.length === 0) {
        delete newActiveFilters[action.key];
      } else {
        newActiveFilters[action.key] = [...action.value];
      }
      
      return {
        ...state,
        activeFilters: newActiveFilters,
        isDirty: true,
        history: {
          past: newPast,
          future: newFuture,
        },
        meta: {
          lastUpdated: Date.now(),
          activeFilterCount: countActiveFilters(newActiveFilters),
        },
      };
    
    case 'ADD_FILTER_VALUE':
      // Optimierung: Wenn der Wert bereits vorhanden ist, keinen neuen State erstellen
      if (
        state.activeFilters[action.key] &&
        state.activeFilters[action.key].includes(action.value)
      ) {
        return state;
      }
      
      createStateCopy();
      
      // Wenn der Schlüssel noch nicht existiert, erstelle einen neuen Array
      if (!newActiveFilters[action.key]) {
        newActiveFilters[action.key] = [];
      }
      
      // Füge den Wert hinzu
      newActiveFilters[action.key] = [...newActiveFilters[action.key], action.value];
      
      return {
        ...state,
        activeFilters: newActiveFilters,
        isDirty: true,
        history: {
          past: newPast,
          future: newFuture,
        },
        meta: {
          lastUpdated: Date.now(),
          activeFilterCount: countActiveFilters(newActiveFilters),
        },
      };
    
    case 'REMOVE_FILTER_VALUE':
      // Optimierung: Wenn der Schlüssel nicht existiert oder der Wert nicht vorhanden ist,
      // keinen neuen State erstellen
      if (
        !state.activeFilters[action.key] ||
        !state.activeFilters[action.key].includes(action.value)
      ) {
        return state;
      }
      
      createStateCopy();
      
      // Entferne den Wert
      newActiveFilters[action.key] = newActiveFilters[action.key].filter(
        value => value !== action.value
      );
      
      // Wenn die Liste leer ist, entferne den Schlüssel
      if (newActiveFilters[action.key].length === 0) {
        delete newActiveFilters[action.key];
      }
      
      return {
        ...state,
        activeFilters: newActiveFilters,
        isDirty: true,
        history: {
          past: newPast,
          future: newFuture,
        },
        meta: {
          lastUpdated: Date.now(),
          activeFilterCount: countActiveFilters(newActiveFilters),
        },
      };
    
    case 'TOGGLE_FILTER_VALUE':
      createStateCopy();
      
      // Wenn der Schlüssel noch nicht existiert, erstelle einen neuen Array
      if (!newActiveFilters[action.key]) {
        newActiveFilters[action.key] = [action.value];
      } 
      // Wenn der Wert bereits vorhanden ist, entferne ihn
      else if (newActiveFilters[action.key].includes(action.value)) {
        newActiveFilters[action.key] = newActiveFilters[action.key].filter(
          value => value !== action.value
        );
        
        // Wenn die Liste leer ist, entferne den Schlüssel
        if (newActiveFilters[action.key].length === 0) {
          delete newActiveFilters[action.key];
        }
      } 
      // Sonst füge den Wert hinzu
      else {
        newActiveFilters[action.key] = [...newActiveFilters[action.key], action.value];
      }
      
      return {
        ...state,
        activeFilters: newActiveFilters,
        isDirty: true,
        history: {
          past: newPast,
          future: newFuture,
        },
        meta: {
          lastUpdated: Date.now(),
          activeFilterCount: countActiveFilters(newActiveFilters),
        },
      };
    
    case 'RESET_FILTER':
      // Optimierung: Wenn der Schlüssel nicht existiert, keinen neuen State erstellen
      if (!state.activeFilters[action.key]) {
        return state;
      }
      
      createStateCopy();
      
      // Entferne den Schlüssel
      delete newActiveFilters[action.key];
      
      return {
        ...state,
        activeFilters: newActiveFilters,
        isDirty: true,
        history: {
          past: newPast,
          future: newFuture,
        },
        meta: {
          lastUpdated: Date.now(),
          activeFilterCount: countActiveFilters(newActiveFilters),
        },
      };
    
    case 'RESET_FILTERS':
      // Optimierung: Wenn keine Filter aktiv sind, keinen neuen State erstellen
      if (Object.keys(state.activeFilters).length === 0) {
        return state;
      }
      
      createStateCopy();
      
      return {
        ...state,
        activeFilters: {},
        isDirty: true,
        history: {
          past: newPast,
          future: newFuture,
        },
        meta: {
          lastUpdated: Date.now(),
          activeFilterCount: 0,
        },
      };
    
    case 'SET_AVAILABLE_FILTERS':
      return {
        ...state,
        availableFilters: action.filters,
      };
    
    case 'SET_APPLYING':
      return {
        ...state,
        isApplying: action.isApplying,
      };
    
    case 'APPLY_FILTERS':
      return {
        ...state,
        isDirty: false,
        isApplying: false,
      };
    
    case 'UNDO':
      // Wenn es keine Vergangenheit gibt, nichts tun
      if (state.history.past.length === 0) {
        return state;
      }
      
      // Hole den letzten Zustand aus der Vergangenheit
      const previousFilters = state.history.past[state.history.past.length - 1];
      const newPastUndo = state.history.past.slice(0, -1);
      
      // Füge den aktuellen Zustand zur Zukunft hinzu
      const newFutureUndo = [
        JSON.parse(JSON.stringify(state.activeFilters)),
        ...state.history.future,
      ];
      
      return {
        ...state,
        activeFilters: JSON.parse(JSON.stringify(previousFilters)),
        isDirty: true,
        history: {
          past: newPastUndo,
          future: newFutureUndo,
        },
        meta: {
          lastUpdated: Date.now(),
          activeFilterCount: countActiveFilters(previousFilters),
        },
      };
    
    case 'REDO':
      // Wenn es keine Zukunft gibt, nichts tun
      if (state.history.future.length === 0) {
        return state;
      }
      
      // Hole den ersten Zustand aus der Zukunft
      const nextFilters = state.history.future[0];
      const newFutureRedo = state.history.future.slice(1);
      
      // Füge den aktuellen Zustand zur Vergangenheit hinzu
      const newPastRedo = [
        ...state.history.past,
        JSON.parse(JSON.stringify(state.activeFilters)),
      ];
      
      return {
        ...state,
        activeFilters: JSON.parse(JSON.stringify(nextFilters)),
        isDirty: true,
        history: {
          past: newPastRedo,
          future: newFutureRedo,
        },
        meta: {
          lastUpdated: Date.now(),
          activeFilterCount: countActiveFilters(nextFilters),
        },
      };
    
    default:
      return state;
  }
}

/**
 * Hook-Optionen für useOptimizedFilter
 */
export interface UseOptimizedFilterOptions {
  /** Anfängliche Filter */
  initialFilters?: Record<string, Array<string | number>>;
  /** Automatisches Zwischenspeichern der Filter in localStorage */
  persistToStorage?: boolean;
  /** Schlüssel für localStorage */
  storageKey?: string;
  /** Debounce-Zeit in Millisekunden für Filter-Änderungen */
  debounceTime?: number;
}

/**
 * Optimierter Hook für Filter-Management
 * 
 * Bietet Performance-Optimierungen, History und erweiterte Funktionen
 * 
 * @param options Optionen für den Hook
 * @returns Filterzustand und Hilfsfunktionen
 * 
 * @example
 * const {
 *   activeFilters,
 *   setFilter,
 *   addFilterValue,
 *   removeFilterValue,
 *   toggleFilterValue,
 *   resetFilters,
 *   applyFilters,
 *   undo,
 *   redo
 * } = useOptimizedFilter({
 *   initialFilters: { categories: ["luxury", "spa"] },
 *   persistToStorage: true
 * });
 */
export function useOptimizedFilter(options: UseOptimizedFilterOptions = {}) {
  const {
    initialFilters = {},
    persistToStorage = false,
    storageKey = 'hotel_filters',
    debounceTime = 250
  } = options;
  
  const { state: uiState } = useUIState();
  
  // Lade gespeicherte Filter aus localStorage
  const getSavedFilters = useCallback(() => {
    if (typeof window === 'undefined' || !persistToStorage) {
      return initialFilters;
    }
    
    try {
      const savedFilters = localStorage.getItem(storageKey);
      return savedFilters ? JSON.parse(savedFilters) : initialFilters;
    } catch (error) {
      console.error('Error loading filters from localStorage:', error);
      return initialFilters;
    }
  }, [initialFilters, persistToStorage, storageKey]);
  
  // Initialer Zustand
  const initialState: FilterState = useMemo(() => ({
    ...initialFilterState,
    activeFilters: getSavedFilters(),
    isDirty: false,
    meta: {
      lastUpdated: Date.now(),
      activeFilterCount: countActiveFilters(getSavedFilters()),
    },
  }), [getSavedFilters]);
  
  // State und Reducer
  const [filterState, dispatch] = useReducer(filterReducer, initialState);
  
  // Speichere die Filter in localStorage
  useEffect(() => {
    if (typeof window === 'undefined' || !persistToStorage) {
      return;
    }
    
    const saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify(filterState.activeFilters)
        );
      } catch (error) {
        console.error('Error saving filters to localStorage:', error);
      }
    }, debounceTime);
    
    return () => clearTimeout(saveTimeout);
  }, [filterState.activeFilters, persistToStorage, storageKey, debounceTime]);
  
  // Memoized Action-Creators
  const setFilter = useCallback((key: string, values: Array<string | number>) => {
    dispatch({ type: 'SET_FILTER', key, value: values });
  }, []);
  
  const addFilterValue = useCallback((key: string, value: string | number) => {
    dispatch({ type: 'ADD_FILTER_VALUE', key, value });
  }, []);
  
  const removeFilterValue = useCallback((key: string, value: string | number) => {
    dispatch({ type: 'REMOVE_FILTER_VALUE', key, value });
  }, []);
  
  const toggleFilterValue = useCallback((key: string, value: string | number) => {
    dispatch({ type: 'TOGGLE_FILTER_VALUE', key, value });
  }, []);
  
  const resetFilter = useCallback((key: string) => {
    dispatch({ type: 'RESET_FILTER', key });
  }, []);
  
  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);
  
  const setAvailableFilters = useCallback((filters: Record<string, FilterOption[]>) => {
    dispatch({ type: 'SET_AVAILABLE_FILTERS', filters });
  }, []);
  
  const applyFilters = useCallback(() => {
    dispatch({ type: 'APPLY_FILTERS' });
  }, []);
  
  const setApplying = useCallback((isApplying: boolean) => {
    dispatch({ type: 'SET_APPLYING', isApplying });
  }, []);
  
  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);
  
  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);
  
  // Memoized derived values
  const canUndo = useMemo(() => filterState.history.past.length > 0, [filterState.history.past.length]);
  const canRedo = useMemo(() => filterState.history.future.length > 0, [filterState.history.future.length]);
  
  const activeFilterCount = useMemo(
    () => filterState.meta.activeFilterCount,
    [filterState.meta.activeFilterCount]
  );
  
  const hasActiveFilters = useMemo(
    () => activeFilterCount > 0,
    [activeFilterCount]
  );
  
  // Performance-optimierte Filteranwendung mit Debounce
  const getFilteredItems = useCallback(
    <T extends Record<string, any>>(
      items: T[],
      filterFn: (item: T, filters: Record<string, Array<string | number>>) => boolean
    ): T[] => {
      return items.filter(item => filterFn(item, filterState.activeFilters));
    },
    [filterState.activeFilters]
  );
  
  // Optimierte Implementierung für häufige Filterszenarien
  const filterByProperties = useCallback(
    <T extends Record<string, any>>(
      items: T[],
      propertyMap: Record<string, keyof T | ((item: T) => any)>
    ): T[] => {
      // Wenn keine Filter aktiv sind, gib alle Items zurück
      if (!hasActiveFilters) {
        return items;
      }
      
      return items.filter(item => {
        // Prüfe jeden Filterschlüssel
        return Object.entries(filterState.activeFilters).every(([filterKey, filterValues]) => {
          // Überspringe, wenn keine Werte für diesen Schlüssel vorhanden sind
          if (!filterValues.length) {
            return true;
          }
          
          // Finde die entsprechende Eigenschaft im Item
          const itemProperty = propertyMap[filterKey];
          
          if (!itemProperty) {
            return true; // Wenn keine Zuordnung definiert ist, Überspringe diesen Filter
          }
          
          // Extrahiere den Wert basierend auf dem Typ von itemProperty
          const itemValue = typeof itemProperty === 'function'
            ? itemProperty(item)
            : item[itemProperty];
          
          // Handle verschiedene Typen von itemValue
          if (Array.isArray(itemValue)) {
            // Wenn der Wert ein Array ist, prüfe, ob mindestens ein Wert übereinstimmt
            return filterValues.some(value => 
              itemValue.some(v => 
                String(v) === String(value) || 
                (typeof v === 'object' && v && 'id' in v && String(v.id) === String(value))
              )
            );
          } else if (typeof itemValue === 'object' && itemValue !== null) {
            // Wenn der Wert ein Objekt ist, prüfe, ob die ID übereinstimmt
            return 'id' in itemValue && filterValues.includes(itemValue.id);
          } else {
            // Für einfache Werte, prüfe direkte Übereinstimmung
            return filterValues.includes(itemValue);
          }
        });
      });
    },
    [filterState.activeFilters, hasActiveFilters]
  );
  
  // Memoized Filter-Parameter für URL-Queries
  const filterParams = useMemo(() => {
    return Object.entries(filterState.activeFilters).reduce(
      (params, [key, values]) => {
        params[key] = values.join(',');
        return params;
      },
      {} as Record<string, string>
    );
  }, [filterState.activeFilters]);
  
  // Verarbeite URL-Parameter zu Filtern
  const setFiltersFromParams = useCallback(
    (params: URLSearchParams) => {
      const newFilters: Record<string, Array<string | number>> = {};
      
      params.forEach((value, key) => {
        if (value) {
          newFilters[key] = value.split(',');
        }
      });
      
      // Setze alle Filter auf einmal
      Object.entries(newFilters).forEach(([key, values]) => {
        dispatch({ type: 'SET_FILTER', key, value: values });
      });
    },
    []
  );
  
  return {
    // State
    filterState,
    activeFilters: filterState.activeFilters,
    availableFilters: filterState.availableFilters,
    isDirty: filterState.isDirty,
    isApplying: filterState.isApplying,
    lastUpdated: filterState.meta.lastUpdated,
    activeFilterCount,
    hasActiveFilters,
    canUndo,
    canRedo,
    
    // Actions
    setFilter,
    addFilterValue,
    removeFilterValue,
    toggleFilterValue,
    resetFilter,
    resetFilters,
    setAvailableFilters,
    applyFilters,
    setApplying,
    undo,
    redo,
    
    // Utilities
    getFilteredItems,
    filterByProperties,
    filterParams,
    setFiltersFromParams,
  };
}