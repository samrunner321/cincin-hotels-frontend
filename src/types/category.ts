/**
 * Interface für eine Kategorie
 */
export interface Category {
  /** Eindeutige ID der Kategorie */
  id: string | number;
  /** Name der Kategorie */
  name: string;
  /** URL-Slug der Kategorie */
  slug?: string;
  /** Beschreibung der Kategorie */
  description?: string;
  /** Bild-URL für die Kategorie */
  image_url?: string;
  /** Icon-Komponente oder Icon-Name */
  icon?: React.ReactNode | string;
  /** Anzahl der zugehörigen Hotels */
  hotel_count?: number;
  /** Reihenfolge für die Sortierung */
  sort_order?: number;
  /** Ist die Kategorie hervorgehoben? */
  is_featured?: boolean;
  /** Metadaten für CMS-Integration */
  metadata?: Record<string, any>;
}

/**
 * Enum für Standard-Kategorietypen
 */
export enum CategoryType {
  BEACH = 'beach',
  CITY = 'city',
  COUNTRYSIDE = 'countryside',
  MOUNTAIN = 'mountain',
  SPA = 'spa',
  CULINARY = 'culinary',
  ADULTS_ONLY = 'adults-only',
  FAMILY = 'family',
  LUXURY = 'luxury',
  BOUTIQUE = 'boutique',
  SUSTAINABLE = 'sustainable',
}

/**
 * Zuordnung von Kategorietypen zu Anzeigenamen
 */
export const CATEGORY_DISPLAY_NAMES: Record<CategoryType, string> = {
  [CategoryType.BEACH]: 'Beach',
  [CategoryType.CITY]: 'City',
  [CategoryType.COUNTRYSIDE]: 'Countryside',
  [CategoryType.MOUNTAIN]: 'Mountain',
  [CategoryType.SPA]: 'Spa & Wellness',
  [CategoryType.CULINARY]: 'Culinary',
  [CategoryType.ADULTS_ONLY]: 'Adults Only',
  [CategoryType.FAMILY]: 'Family Friendly',
  [CategoryType.LUXURY]: 'Luxury',
  [CategoryType.BOUTIQUE]: 'Boutique',
  [CategoryType.SUSTAINABLE]: 'Sustainable',
};

/**
 * Interface für eine Kategorieauswahl in Filterkomponenten
 */
export interface CategorySelection {
  /** ID oder Slug der Kategorie */
  id: string;
  /** Ist die Kategorie ausgewählt? */
  selected: boolean;
  /** Anzeigename */
  label: string;
}

/**
 * Typ für die API-Antwort bei einer Kategorieabfrage
 */
export type CategoryApiResponse = {
  /** Liste von Kategorien */
  data: Category[];
  /** Metadaten zur Abfrage */
  meta?: {
    /** Gesamtanzahl */
    total_count: number;
    /** Gefilterte Anzahl */
    filter_count: number;
  };
};