'use client';

import React, { createContext, useContext, useReducer, useCallback, ReactNode, useEffect } from 'react';
import { 
  UIState, 
  UIAction, 
  UIStateContextProps,
  ViewMode,
  Theme
} from '../types/ui';

/**
 * Initialer UI-Status
 */
const initialState: UIState = {
  viewMode: 'grid',
  sidebar: {
    isOpen: false,
    activeTab: undefined
  },
  mobileMenu: {
    isOpen: false
  },
  theme: {
    current: 'light',
    animationsEnabled: true,
    reducedMotion: false
  },
  modal: {
    currentModal: null,
    modalData: null
  },
  notifications: {
    enabled: true,
    unreadCount: 0
  },
  preferences: {
    density: 'normal',
    displaySize: 'medium',
    imageQuality: 'medium'
  }
};

/**
 * UI Reducer Funktion
 */
function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case 'SET_VIEW_MODE':
      return {
        ...state,
        viewMode: action.payload as ViewMode
      };
    
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebar: {
          ...state.sidebar,
          isOpen: !state.sidebar.isOpen
        }
      };
    
    case 'SET_SIDEBAR_TAB':
      return {
        ...state,
        sidebar: {
          ...state.sidebar,
          activeTab: action.payload as string
        }
      };
    
    case 'TOGGLE_MOBILE_MENU':
      return {
        ...state,
        mobileMenu: {
          isOpen: !state.mobileMenu.isOpen
        }
      };
    
    case 'SET_THEME':
      return {
        ...state,
        theme: {
          ...state.theme,
          current: action.payload as Theme
        }
      };
    
    case 'TOGGLE_ANIMATIONS':
      return {
        ...state,
        theme: {
          ...state.theme,
          animationsEnabled: !state.theme.animationsEnabled
        }
      };
    
    case 'SET_REDUCED_MOTION':
      return {
        ...state,
        theme: {
          ...state.theme,
          reducedMotion: action.payload as boolean
        }
      };
    
    case 'SHOW_MODAL':
      return {
        ...state,
        modal: {
          currentModal: action.payload.modalId as string,
          modalData: action.payload.data
        }
      };
    
    case 'HIDE_MODAL':
      return {
        ...state,
        modal: {
          currentModal: null,
          modalData: null
        }
      };
    
    case 'TOGGLE_NOTIFICATIONS':
      return {
        ...state,
        notifications: {
          ...state.notifications,
          enabled: !state.notifications.enabled
        }
      };
    
    case 'SET_NOTIFICATION_COUNT':
      return {
        ...state,
        notifications: {
          ...state.notifications,
          unreadCount: action.payload as number
        }
      };
    
    case 'SET_DISPLAY_DENSITY':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          density: action.payload as 'compact' | 'normal' | 'expanded'
        }
      };
    
    case 'SET_DISPLAY_SIZE':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          displaySize: action.payload as 'small' | 'medium' | 'large'
        }
      };
    
    case 'SET_IMAGE_QUALITY':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          imageQuality: action.payload as 'low' | 'medium' | 'high'
        }
      };
    
    default:
      return state;
  }
}

/**
 * Context für UI-Status
 */
const UIStateContext = createContext<UIStateContextProps | undefined>(undefined);

/**
 * Props für den UIStateProvider
 */
interface UIStateProviderProps {
  children: ReactNode;
  initialViewMode?: ViewMode;
  initialTheme?: Theme;
}

/**
 * Provider für UI-Status
 */
export function UIStateProvider({ 
  children, 
  initialViewMode = 'grid',
  initialTheme = 'light'
}: UIStateProviderProps) {
  const [state, dispatch] = useReducer(
    uiReducer, 
    {
      ...initialState,
      viewMode: initialViewMode,
      theme: {
        ...initialState.theme,
        current: initialTheme
      }
    }
  );
  
  // Theme in localStorage speichern und aus localStorage laden
  useEffect(() => {
    // Beim ersten Laden aus localStorage lesen
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      dispatch({ type: 'SET_THEME', payload: storedTheme });
    }
    
    // Medien-Query für reduzierte Bewegung
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      dispatch({ type: 'SET_REDUCED_MOTION', payload: true });
    }
    
    // Event Listener für reduzierte Bewegung
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      dispatch({ type: 'SET_REDUCED_MOTION', payload: e.matches });
    };
    
    prefersReducedMotion.addEventListener('change', handleReducedMotionChange);
    
    return () => {
      prefersReducedMotion.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);
  
  // Theme speichern, wenn es sich ändert
  useEffect(() => {
    localStorage.setItem('theme', state.theme.current);
    
    // Klasse an html-Element anhängen
    if (state.theme.current === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme.current]);
  
  // Memoized Handler-Funktionen
  const setViewMode = useCallback((mode: ViewMode) => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
  }, []);
  
  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  }, []);
  
  const toggleMobileMenu = useCallback(() => {
    dispatch({ type: 'TOGGLE_MOBILE_MENU' });
  }, []);
  
  const setTheme = useCallback((theme: Theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  }, []);
  
  const showModal = useCallback((modalId: string, data?: any) => {
    dispatch({ 
      type: 'SHOW_MODAL', 
      payload: { modalId, data } 
    });
  }, []);
  
  const hideModal = useCallback(() => {
    dispatch({ type: 'HIDE_MODAL' });
  }, []);
  
  const setDisplayDensity = useCallback((density: 'compact' | 'normal' | 'expanded') => {
    dispatch({ type: 'SET_DISPLAY_DENSITY', payload: density });
  }, []);
  
  // Context-Wert
  const contextValue: UIStateContextProps = {
    state,
    dispatch,
    setViewMode,
    toggleSidebar,
    toggleMobileMenu,
    setTheme,
    showModal,
    hideModal,
    setDisplayDensity
  };
  
  return (
    <UIStateContext.Provider value={contextValue}>
      {children}
    </UIStateContext.Provider>
  );
}

/**
 * Hook für den Zugriff auf den UI-Status
 */
export function useUIState(): UIStateContextProps {
  const context = useContext(UIStateContext);
  
  if (context === undefined) {
    throw new Error('useUIState must be used within a UIStateProvider');
  }
  
  return context;
}