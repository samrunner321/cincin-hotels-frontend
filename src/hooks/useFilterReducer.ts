import { useReducer, useCallback } from 'react';

/**
 * Typen für Filter-Optionen
 */
export type FilterValue = string | number | boolean | Array<string | number>;

/**
 * Interface für den Zustand des Filters
 */
export interface FilterState {
  /** Aktive Filter als Schlüssel-Wert-Paare */
  activeFilters: Record<string, FilterValue>;
  /** Verfügbare Filter-Optionen */
  availableFilters: Record<string, FilterOption[]>;
  /** Ob die Filter geändert wurden */
  isDirty: boolean;
  /** Ob der Filter gerade angewendet wird */
  isApplying: boolean;
}

/**
 * Interface für eine Filteroption
 */
export interface FilterOption {
  /** ID oder Wert der Option */
  id: string;
  /** Anzeigelabel */
  label: string;
  /** Ist die Option ausgewählt? */
  selected: boolean;
  /** Anzahl der Elemente mit dieser Option */
  count?: number;
  /** Ist die Option deaktiviert? */
  disabled?: boolean;
}

/**
 * Interface für Aktionen zur Änderung des Filterzustands
 */
export type FilterAction =
  | { type: 'SET_FILTER'; key: string; value: FilterValue }
  | { type: 'REMOVE_FILTER'; key: string }
  | { type: 'TOGGLE_FILTER'; key: string; value: string }
  | { type: 'RESET_FILTERS' }
  | { type: 'SET_AVAILABLE_FILTERS'; filters: Record<string, FilterOption[]> }
  | { type: 'SET_APPLYING'; isApplying: boolean }
  | { type: 'APPLY_FILTERS' };

/**
 * Anfangszustand für Filter
 */
export const initialFilterState: FilterState = {
  activeFilters: {},
  availableFilters: {},
  isDirty: false,
  isApplying: false,
};

/**
 * Reducer für Filteraktionen
 */
function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_FILTER':
      return {
        ...state,
        activeFilters: {
          ...state.activeFilters,
          [action.key]: action.value,
        },
        isDirty: true,
      };
      
    case 'REMOVE_FILTER':
      const newActiveFilters = { ...state.activeFilters };
      delete newActiveFilters[action.key];
      return {
        ...state,
        activeFilters: newActiveFilters,
        isDirty: true,
      };
      
    case 'TOGGLE_FILTER':
      const currentValue = state.activeFilters[action.key];
      let newValue: FilterValue;
      
      // Wenn der aktuelle Wert ein Array ist, füge den Wert hinzu oder entferne ihn
      if (Array.isArray(currentValue)) {
        if (currentValue.includes(action.value)) {
          newValue = currentValue.filter(v => v !== action.value);
        } else {
          newValue = [...currentValue, action.value];
        }
        // Wenn das Array leer ist, entferne den Filter komplett
        if ((newValue as Array<string | number>).length === 0) {
          const updatedFilters = { ...state.activeFilters };
          delete updatedFilters[action.key];
          return {
            ...state,
            activeFilters: updatedFilters,
            isDirty: true,
          };
        }
      } else {
        // Wenn der aktuelle Wert kein Array ist, wechsle zwischen Wert und null
        newValue = currentValue === action.value ? [] : action.value;
      }
      
      return {
        ...state,
        activeFilters: {
          ...state.activeFilters,
          [action.key]: newValue,
        },
        isDirty: true,
      };
      
    case 'RESET_FILTERS':
      return {
        ...state,
        activeFilters: {},
        isDirty: false,
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
      
    default:
      return state;
  }
}

/**
 * Hook für Filter-Management
 * 
 * @param initialFilters Anfängliche Filter-Einstellungen
 * @returns Filterzustand und Hilfsfunktionen
 * 
 * @example
 * const { 
 *   filters, 
 *   setFilter, 
 *   removeFilter, 
 *   toggleFilter, 
 *   resetFilters 
 * } = useFilterReducer({
 *   categories: ['beach', 'mountain'],
 * });
 */
export function useFilterReducer(initialFilters: Record<string, FilterValue> = {}) {
  // Initialer Zustand mit vorgegebenen Filtern
  const initialState: FilterState = {
    ...initialFilterState,
    activeFilters: initialFilters,
    isDirty: false,
  };
  
  const [filterState, dispatch] = useReducer(filterReducer, initialState);
  
  /**
   * Setzt einen Filter auf einen bestimmten Wert
   */
  const setFilter = useCallback((key: string, value: FilterValue) => {
    dispatch({ type: 'SET_FILTER', key, value });
  }, []);
  
  /**
   * Entfernt einen Filter
   */
  const removeFilter = useCallback((key: string) => {
    dispatch({ type: 'REMOVE_FILTER', key });
  }, []);
  
  /**
   * Schaltet einen Filter um (an/aus)
   */
  const toggleFilter = useCallback((key: string, value: string) => {
    dispatch({ type: 'TOGGLE_FILTER', key, value });
  }, []);
  
  /**
   * Setzt alle Filter zurück
   */
  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);
  
  /**
   * Setzt die verfügbaren Filter-Optionen
   */
  const setAvailableFilters = useCallback((filters: Record<string, FilterOption[]>) => {
    dispatch({ type: 'SET_AVAILABLE_FILTERS', filters });
  }, []);
  
  /**
   * Markiert den Filter-Zustand als angewendet
   */
  const applyFilters = useCallback(() => {
    dispatch({ type: 'APPLY_FILTERS' });
  }, []);
  
  /**
   * Setzt den Anwendungsstatus
   */
  const setApplying = useCallback((isApplying: boolean) => {
    dispatch({ type: 'SET_APPLYING', isApplying });
  }, []);
  
  return {
    filterState,
    activeFilters: filterState.activeFilters,
    availableFilters: filterState.availableFilters,
    isDirty: filterState.isDirty,
    isApplying: filterState.isApplying,
    setFilter,
    removeFilter,
    toggleFilter,
    resetFilters,
    setAvailableFilters,
    applyFilters,
    setApplying,
  };
}