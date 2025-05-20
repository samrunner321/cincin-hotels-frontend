import { Hotel } from './hotel';

/**
 * Interface für Wetterdaten einer Destination
 */
export interface DestinationWeather {
  /** Aktuelle Temperatur */
  current_temperature?: number;
  /** Minimale Temperatur */
  min_temperature?: number;
  /** Maximale Temperatur */
  max_temperature?: number;
  /** Wetterbedingung (z.B. "sonnig", "regnerisch") */
  condition?: string;
  /** Icon für die Wetterbedingung */
  icon?: string;
  /** Luftfeuchtigkeit in Prozent */
  humidity?: number;
  /** Regenwahrscheinlichkeit in Prozent */
  precipitation?: number;
  /** Windgeschwindigkeit */
  wind_speed?: number;
  /** Sonnenaufgang (ISO-Zeitstempel) */
  sunrise?: string;
  /** Sonnenuntergang (ISO-Zeitstempel) */
  sunset?: string;
  /** Zeitpunkt der letzten Aktualisierung */
  updated_at?: string;
}

/**
 * Interface für Aktivitäten an einer Destination
 */
export interface DestinationActivity {
  /** Eindeutige ID der Aktivität */
  id: string | number;
  /** Name der Aktivität */
  name: string;
  /** Beschreibung der Aktivität */
  description?: string;
  /** Bild-URL */
  image_url?: string;
  /** Kategorie der Aktivität */
  category?: string;
  /** Bewertung (0-5) */
  rating?: number;
  /** Preis oder Preisbereich */
  price_range?: string;
  /** Dauer (z.B. "2 Stunden") */
  duration?: string;
  /** Standort/Adresse */
  location?: string;
  /** Website-URL */
  website?: string;
}

/**
 * Interface für Gastronomie an einer Destination
 */
export interface DestinationDining {
  /** Eindeutige ID */
  id: string | number;
  /** Name des Restaurants */
  name: string;
  /** Beschreibung */
  description?: string;
  /** Bild-URL */
  image_url?: string;
  /** Küchenstil */
  cuisine_type?: string;
  /** Preisklasse (1-4) */
  price_level?: number;
  /** Bewertung (0-5) */
  rating?: number;
  /** Adresse */
  address?: string;
  /** Website-URL */
  website?: string;
  /** Öffnungszeiten */
  opening_hours?: string;
  /** Reservierung möglich? */
  accepts_reservations?: boolean;
}

/**
 * Interface für Reiseinformationen zu einer Destination
 */
export interface DestinationTravelInfo {
  /** Wie man hinkommt */
  how_to_get_there?: string;
  /** Transportmöglichkeiten vor Ort */
  local_transportation?: string;
  /** Beste Reisezeit */
  best_time_to_visit?: string;
  /** Lokale Währung */
  local_currency?: string;
  /** Sprachen */
  languages?: string[];
  /** Zeitzone */
  timezone?: string;
  /** Visa-Informationen */
  visa_requirements?: string;
  /** Gesundheitshinweise */
  health_info?: string;
  /** Sicherheitshinweise */
  safety_tips?: string;
}

/**
 * Interface für Highlights einer Destination
 */
export interface DestinationHighlight {
  /** Eindeutige ID */
  id: string | number;
  /** Titel des Highlights */
  title: string;
  /** Beschreibung */
  description?: string;
  /** Bild-URL */
  image_url?: string;
  /** Link-URL */
  link_url?: string;
  /** Ist es ein Premium-Highlight? */
  is_premium?: boolean;
}

/**
 * Vollständiges Destination-Interface
 */
export interface Destination {
  /** Eindeutige ID */
  id: string | number;
  /** Name der Destination */
  name: string;
  /** Land */
  country?: string;
  /** Region oder Bundesland */
  region?: string;
  /** URL-Slug */
  slug?: string;
  /** Kurzbeschreibung */
  short_description?: string;
  /** Ausführliche Beschreibung */
  description?: string;
  /** Hauptbild-URL */
  main_image_url?: string;
  /** Alternativer Bildpfad (Legacy) */
  image?: string;
  /** Array von Bildern */
  images?: string[];
  /** Breitengrad für Karten */
  latitude?: number;
  /** Längengrad für Karten */
  longitude?: number;
  /** Wetterdaten */
  weather?: DestinationWeather;
  /** Aktivitäten an dieser Destination */
  activities?: DestinationActivity[];
  /** Restaurants und Gastronomie */
  dining?: DestinationDining[];
  /** Reiseinformationen */
  travel_info?: DestinationTravelInfo;
  /** Highlights der Destination */
  highlights?: DestinationHighlight[];
  /** Hotels an dieser Destination */
  hotels?: Hotel[];
  /** Anzahl der Hotels an dieser Destination */
  hotel_count?: number;
  /** Ist die Destination beliebt/hervorgehoben? */
  is_featured?: boolean;
  /** Reihenfolge für die Sortierung */
  sort_order?: number;
  /** Metadaten für CMS-Integration */
  metadata?: Record<string, any>;
}

/**
 * Verkürzte Version für Listen und Karten
 */
export type DestinationSummary = Pick<
  Destination,
  | 'id'
  | 'name'
  | 'country'
  | 'region'
  | 'slug'
  | 'short_description'
  | 'main_image_url'
  | 'image'
  | 'latitude'
  | 'longitude'
  | 'hotel_count'
  | 'is_featured'
>;

/**
 * Status für einen Destination-Suchanruf
 */
export type DestinationFetchStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Interface für die Ergebnisse einer Destinationssuche
 */
export interface DestinationSearchResults {
  /** Liste der Destinationen */
  destinations: Destination[];
  /** Gesamtanzahl der gefundenen Destinationen */
  total: number;
  /** Aktuelle Seite */
  page: number;
  /** Anzahl der Ergebnisse pro Seite */
  per_page: number;
  /** Gibt es weitere Seiten? */
  has_more: boolean;
  /** Aktueller Suchstatus */
  status: DestinationFetchStatus;
  /** Fehlermeldung, falls vorhanden */
  error?: string;
}