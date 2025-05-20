/**
 * Utility Typen zur Verwendung im gesamten Projekt
 */

/**
 * Ein Typ für Elemente, die IDs haben können (string oder number)
 */
export type WithId = {
  id: string | number;
};

/**
 * Typ für Statuswerte innerhalb der Anwendung
 */
export type FetchStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Generischer Typ für API-Antwortdaten
 */
export interface UtilsApiResponse<T> {
  /** Daten */
  data: T;
  /** Metadaten */
  meta?: {
    /** Gesamtanzahl */
    total?: number;
    /** Aktuelle Seite */
    page?: number;
    /** Einträge pro Seite */
    perPage?: number;
    /** Filter-Parameter */
    filter?: Record<string, any>;
    /** Sortierparameter */
    sort?: string | string[];
  };
  /** Links für Pagination */
  links?: {
    /** Link zur ersten Seite */
    first?: string;
    /** Link zur vorherigen Seite */
    prev?: string;
    /** Link zur nächsten Seite */
    next?: string;
    /** Link zur letzten Seite */
    last?: string;
  };
  /** Zusätzliche Optionen oder Konfigurationen */
  options?: Record<string, any>;
}

/**
 * Generischer Typ für API-Fehler
 */
export interface UtilsApiError {
  /** HTTP-Statuscode */
  status?: number;
  /** Fehlercode */
  code?: string;
  /** Fehlermeldung */
  message: string;
  /** Details zum Fehler */
  details?: Record<string, any>;
  /** Stack-Trace (nur in Entwicklung) */
  stack?: string;
}

/**
 * Pagination-Parameter für API-Requests
 */
export interface PaginationParams {
  /** Seite */
  page?: number;
  /** Einträge pro Seite */
  limit?: number;
  /** Offset (Alternative zu page) */
  offset?: number;
}

/**
 * Sortierparameter für API-Requests
 */
export interface SortParams {
  /** Feld, nach dem sortiert werden soll */
  field: string;
  /** Sortierrichtung */
  direction: 'asc' | 'desc';
}

/**
 * Filter-Parameter für API-Requests
 */
export interface FilterParams {
  /** Suchbegriff */
  query?: string;
  /** Filterkriterien als Key-Value-Paar */
  [key: string]: any;
}

/**
 * Kombinierte Parameter für API-Requests
 */
export interface UtilsApiQueryParams extends PaginationParams {
  /** Sortierparameter */
  sort?: string | SortParams | SortParams[];
  /** Filterparameter */
  filter?: FilterParams;
  /** Felder, die zurückgegeben werden sollen */
  fields?: string[];
  /** Relationen, die geladen werden sollen */
  includes?: string[];
  /** Lokalisierung der Inhalte */
  locale?: string;
}

/**
 * Generischer Typ für Datenlisten mit Status
 */
export interface DataList<T> {
  /** Daten */
  data: T[];
  /** Status */
  status: FetchStatus;
  /** Fehlermeldung */
  error?: string;
  /** Gesamtanzahl */
  total?: number;
  /** Aktuelle Seite */
  page?: number;
  /** Einträge pro Seite */
  perPage?: number;
  /** Gibt es weitere Daten? */
  hasMore?: boolean;
}

/**
 * Typ für Lokalisierungen
 */
export type LocalizedString = {
  /** Sprachcode als Schlüssel, lokalisierter String als Wert */
  [locale: string]: string;
};

/**
 * Generischer Typ für lokalisierbare Felder
 */
export type Localizable<T> = {
  /** Jedes Feld kann entweder vom Typ T oder ein lokalisiertes Objekt sein */
  [K in keyof T]: T[K] | LocalizedString;
};

/**
 * Typ für Date-Range-Auswahl
 */
export interface DateRange {
  /** Startdatum */
  startDate: string;
  /** Enddatum */
  endDate: string;
}

/**
 * Typ für geografische Koordinaten
 */
export interface GeoCoordinates {
  /** Breitengrad */
  latitude: number;
  /** Längengrad */
  longitude: number;
}

/**
 * Typ für Geolocation mit Adresse
 */
export interface GeoLocation extends GeoCoordinates {
  /** Adresse */
  address?: string;
  /** Stadt */
  city?: string;
  /** Bundesland/Region */
  region?: string;
  /** Land */
  country?: string;
  /** PLZ */
  postalCode?: string;
  /** Formatierte Adresse */
  formattedAddress?: string;
}

/**
 * Typ für mehrsprachige Inhalte
 */
export interface I18nContent<T> {
  /** Standardsprache */
  default: T;
  /** Übersetzungen */
  translations: {
    /** Sprachcode als Schlüssel, übersetzte Inhalte als Wert */
    [locale: string]: Partial<T>;
  };
}

/**
 * Typ-Guard für API-Fehler
 */
export function isUtilsApiError(obj: any): obj is UtilsApiError {
  return obj && typeof obj === 'object' && 'message' in obj;
}

/**
 * Utility-Typ für Komponenten mit Klassen-Props
 */
export interface WithClassName {
  /** Zusätzliche CSS-Klassen */
  className?: string;
}

/**
 * Utility-Typ für Komponenten mit Stil-Props
 */
export interface WithStyle {
  /** Inline-Stile */
  style?: React.CSSProperties;
}

/**
 * Utility-Typ für Komponenten mit Ref-Props
 */
export interface WithRef<T> {
  /** Ref-Objekt */
  ref?: React.Ref<T>;
}

/**
 * Utility-Typ für Komponenten mit Kindern
 */
export interface WithChildren {
  /** Kinder-Elemente */
  children?: React.ReactNode;
}

/**
 * Utility-Typ für Komponenten mit Daten-Attributen
 */
export interface WithDataAttributes {
  /** Beliebige Daten-Attribute */
  [key: `data-${string}`]: any;
}

/**
 * Kombinierter Basis-Typ für UI-Komponenten
 */
export type BaseComponentProps = WithClassName & WithStyle & WithDataAttributes & WithChildren;

/**
 * Utility-Typ für optionale Eigenschaften
 */
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

/**
 * Utility-Typ für erforderliche Eigenschaften
 */
export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/**
 * Utility-Typ für tiefes Partial
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};