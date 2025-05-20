/**
 * Typen für UI-Zustände
 */

/**
 * Mögliche Ansichtsmodi für Listen
 */
export type ViewMode = 'grid' | 'list' | 'map';

/**
 * Mögliche Themen für die Anwendung
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Mögliche Anzeigegrößen für Komponenten
 */
export type DisplaySize = 'small' | 'medium' | 'large';

/**
 * Interface für den globalen UI-Zustand
 */
export interface UIState {
  /**
   * Aktueller Ansichtsmodus für Listen
   */
  viewMode: ViewMode;
  
  /**
   * UI-Seitenleisten-Status
   */
  sidebar: {
    /**
     * Ist die Seitenleiste geöffnet
     */
    isOpen: boolean;
    
    /**
     * Aktiver Tab in der Seitenleiste (falls vorhanden)
     */
    activeTab?: string;
  };
  
  /**
   * Mobile Menü Status
   */
  mobileMenu: {
    /**
     * Ist das mobile Menü geöffnet
     */
    isOpen: boolean;
  };
  
  /**
   * Thema-Einstellungen
   */
  theme: {
    /**
     * Aktuelles Thema
     */
    current: Theme;
    
    /**
     * Sind Animationen aktiviert
     */
    animationsEnabled: boolean;
    
    /**
     * Ist der reduzierte Bewegungsmodus aktiviert
     */
    reducedMotion: boolean;
  };
  
  /**
   * Modal-Status
   */
  modal: {
    /**
     * Aktuell angezeigtes Modal
     */
    currentModal: string | null;
    
    /**
     * Daten für das Modal
     */
    modalData: any;
  };
  
  /**
   * Banner und Hinweis-Status
   */
  notifications: {
    /**
     * Sind Benachrichtigungen aktiv
     */
    enabled: boolean;
    
    /**
     * Anzahl der ungelesenen Benachrichtigungen
     */
    unreadCount: number;
  };
  
  /**
   * Anwendungsweite Einstellungen
   */
  preferences: {
    /**
     * Anzeigedichte
     * (kompakt, normal, erweitert)
     */
    density: 'compact' | 'normal' | 'expanded';
    
    /**
     * Bevorzugte Anzeigegröße für Komponenten
     */
    displaySize: DisplaySize;
    
    /**
     * Bevorzugter Bildmodus
     */
    imageQuality: 'low' | 'medium' | 'high';
  };
}

/**
 * Aktionstypen für den UI-Reducer
 */
export type UIActionType = 
  | 'SET_VIEW_MODE'
  | 'TOGGLE_SIDEBAR'
  | 'SET_SIDEBAR_TAB'
  | 'TOGGLE_MOBILE_MENU'
  | 'SET_THEME'
  | 'TOGGLE_ANIMATIONS'
  | 'SET_REDUCED_MOTION'
  | 'SHOW_MODAL'
  | 'HIDE_MODAL'
  | 'TOGGLE_NOTIFICATIONS'
  | 'SET_NOTIFICATION_COUNT'
  | 'SET_DISPLAY_DENSITY'
  | 'SET_DISPLAY_SIZE'
  | 'SET_IMAGE_QUALITY';

/**
 * Interface für UI-Aktionen
 */
export interface UIAction {
  type: UIActionType;
  payload?: any;
}

/**
 * Interface für den UIStateContext
 */
export interface UIStateContextProps {
  /**
   * Aktueller UI-Zustand
   */
  state: UIState;
  
  /**
   * Dispatch-Funktion für Aktionen
   */
  dispatch: React.Dispatch<UIAction>;
  
  // Hilfsfunktionen für häufige Aktionen
  
  /**
   * Setzt den Ansichtsmodus
   */
  setViewMode: (mode: ViewMode) => void;
  
  /**
   * Öffnet/schließt die Seitenleiste
   */
  toggleSidebar: () => void;
  
  /**
   * Öffnet/schließt das mobile Menü
   */
  toggleMobileMenu: () => void;
  
  /**
   * Setzt das aktuell angezeigte Thema
   */
  setTheme: (theme: Theme) => void;
  
  /**
   * Zeigt ein Modal an
   */
  showModal: (modalId: string, data?: any) => void;
  
  /**
   * Schließt das aktuelle Modal
   */
  hideModal: () => void;
  
  /**
   * Setzt die bevorzugte Anzeigedichte
   */
  setDisplayDensity: (density: 'compact' | 'normal' | 'expanded') => void;
}