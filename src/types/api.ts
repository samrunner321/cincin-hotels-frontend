/**
 * Allgemeine API-Statustypen
 */
export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Interface für API-Fehler
 */
export interface ApiError {
  /** HTTP-Statuscode */
  statusCode?: number;
  /** Fehlercode */
  code?: string;
  /** Status */
  status?: number;
  /** Fehlermeldung */
  message: string;
  /** Fehlerdetails */
  details?: Record<string, any>;
  /** Ursprünglicher Fehler */
  originalError?: Error;
}

/**
 * Interface für generische API-Abfrageparameter
 */
export interface ApiQueryParams {
  /** Anzahl der zurückzugebenden Ergebnisse */
  limit?: number;
  /** Anzahl der zu überspringenden Ergebnisse */
  offset?: number;
  /** Seite für paginierte Ergebnisse */
  page?: number;
  /** Ergebnisse pro Seite */
  per_page?: number;
  /** Sortierfeld */
  sort_by?: string;
  /** Sortierrichtung */
  sort_order?: 'asc' | 'desc';
  /** Filteroptionen */
  filter?: Record<string, any>;
  /** Suchbegriff */
  search?: string;
  /** Nur bestimmte Felder zurückgeben */
  fields?: string[];
  /** Beziehungen einbeziehen */
  include?: string[];
  /** Gebietsschema/Sprache */
  locale?: string;
  /** Weitere Parameter */
  [key: string]: any;
}

/**
 * Interface für eine generische API-Antwort
 */
export interface ApiResponse<T> {
  /** Status der Anfrage */
  status: ApiStatus;
  /** Nutzdaten */
  data?: T;
  /** Fehlerobjekt */
  error?: ApiError;
  /** Metadaten */
  meta?: {
    /** Gesamtanzahl */
    total?: number;
    /** Anzahl der Ergebnisse pro Seite */
    per_page?: number;
    /** Aktuelle Seite */
    current_page?: number;
    /** Letzte Seite */
    last_page?: number;
    /** URL für die nächste Seite */
    next_page_url?: string;
    /** URL für die vorherige Seite */
    prev_page_url?: string;
    /** Von-Eintrag */
    from?: number;
    /** Bis-Eintrag */
    to?: number;
  };
}

/**
 * Interface für eine paginierte API-Antwort
 */
export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  /** Metadaten für die Paginierung sind erforderlich */
  meta: {
    /** Gesamtanzahl */
    total: number;
    /** Anzahl der Ergebnisse pro Seite */
    per_page: number;
    /** Aktuelle Seite */
    current_page: number;
    /** Letzte Seite */
    last_page: number;
    /** URL für die nächste Seite */
    next_page_url?: string;
    /** URL für die vorherige Seite */
    prev_page_url?: string;
    /** Von-Eintrag */
    from: number;
    /** Bis-Eintrag */
    to: number;
  };
}

/**
 * Interface für eine Directus-API-Antwort
 */
export interface DirectusApiResponse<T> {
  /** Nutzdaten */
  data: T;
  /** Fehler, falls vorhanden */
  errors?: {
    /** Fehlercode */
    code: string;
    /** Fehlermeldung */
    message: string;
    /** Fehlerextensions */
    extensions?: Record<string, any>;
  }[];
}

/**
 * Interface für Cache-Optionen
 */
export interface CacheOptions {
  /** Ist Caching aktiviert? */
  enabled: boolean;
  /** Cache-Gültigkeitsdauer in Sekunden */
  ttl: number;
  /** Stale-While-Revalidate Dauer in Sekunden */
  swr: number;
  /** Tags zur Kategorisierung der Cache-Einträge */
  tags: string[];
}

/**
 * Interface für Directus-Abfrageparameter
 */
export interface DirectusQueryParams {
  /** Felder, die zurückgegeben werden sollen */
  fields?: string[];
  /** Beziehungen, die einbezogen werden sollen */
  deep?: Record<string, any>;
  /** Filter */
  filter?: Record<string, any>;
  /** Lokalisierung */
  lang?: string;
  /** Sortierung */
  sort?: string[];
  /** Limitierung */
  limit?: number;
  /** Versatz */
  offset?: number;
  /** Seite */
  page?: number;
  /** Suche */
  search?: string;
  /** Aggregation */
  aggregate?: Record<string, any>;
  /** Gruppierung */
  groupBy?: string[];
  /** Alias */
  alias?: Record<string, string>;
  /** Meta */
  meta?: string[];
}