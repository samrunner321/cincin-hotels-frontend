import { Category } from './category';
import { Destination } from './destination';

/**
 * Mögliche Sterne-Bewertungen für Hotels
 */
export type HotelStarRating = 1 | 2 | 3 | 4 | 5;

/**
 * Basis-Preisinformationen für ein Hotel
 */
export interface HotelPriceInfo {
  /** Preis ab (Mindestpreis) */
  price_from?: number;
  /** Währungscode (ISO 4217) */
  currency?: string;
  /** Zusätzliche Preishinweise */
  price_notes?: string;
}

/**
 * Standortinformationen für ein Hotel
 */
export interface HotelLocation {
  /** Adresse des Hotels */
  address?: string;
  /** Stadt */
  city?: string;
  /** Land */
  country?: string;
  /** PLZ */
  postal_code?: string;
  /** Breitengrad für Karten */
  latitude?: number;
  /** Längengrad für Karten */
  longitude?: number;
  /** Formatierte Ortsangabe (z.B. "Paris, Frankreich") */
  location?: string;
}

/**
 * Kontaktinformationen für ein Hotel
 */
export interface HotelContact {
  /** Telefonnummer */
  phone?: string;
  /** E-Mail-Adresse */
  email?: string;
  /** Website-URL */
  website?: string;
}

/**
 * Hotel-Annehmlichkeiten
 */
export interface HotelAmenities {
  /** Hat das Hotel einen Pool? */
  has_pool?: boolean;
  /** Hat das Hotel ein Spa? */
  has_spa?: boolean;
  /** Hat das Hotel ein Restaurant? */
  has_restaurant?: boolean;
  /** Hat das Hotel WLAN? */
  has_wifi?: boolean;
  /** Hat das Hotel Parkplätze? */
  has_parking?: boolean;
  /** Ist das Hotel haustierfreundlich? */
  is_pet_friendly?: boolean;
  /** Weitere Annehmlichkeiten als Array */
  amenities?: string[];
}

/**
 * Vollständiges Hotel-Interface
 */
export interface Hotel extends HotelPriceInfo, HotelLocation, HotelContact, HotelAmenities {
  /** Eindeutige ID des Hotels */
  id: string | number;
  /** Name des Hotels */
  name: string;
  /** Kurzbeschreibung des Hotels */
  short_description?: string;
  /** Ausführliche Beschreibung des Hotels */
  description?: string;
  /** URL-Slug für das Hotel */
  slug?: string;
  /** Sterne-Bewertung des Hotels */
  star_rating?: HotelStarRating;
  /** Zugehörige Kategorien */
  categories?: Category[];
  /** Zugehörige Destination */
  destination?: Destination;
  /** Hauptbild-URL */
  main_image_url?: string;
  /** Alternativer Bildpfad (Legacy) */
  image?: string;
  /** Zusätzliche Bilder */
  images?: string[];
  /** Zimmeranzahl */
  room_count?: number;
  /** Zusätzliche Informationen */
  extraInfo?: string;
  /** Ist Featured/Hervorgehoben? */
  is_featured?: boolean;
  /** Aktive Angebote */
  has_offers?: boolean;
  /** Datum der Eröffnung */
  opening_date?: string;
  /** Datum der letzten Renovierung */
  renovation_date?: string;
  /** Gästebewertung (0-10) */
  guest_rating?: number;
  /** Verfügbarkeit */
  is_available?: boolean;
  /** Metadaten (für CMS-Integrationen) */
  metadata?: Record<string, any>;
}

/**
 * Kurze Version des Hotel-Interfaces für Listen und Karten
 */
export type HotelSummary = Pick<
  Hotel,
  | 'id'
  | 'name'
  | 'location'
  | 'short_description'
  | 'slug'
  | 'main_image_url'
  | 'image'
  | 'star_rating'
  | 'categories'
  | 'price_from'
  | 'currency'
  | 'is_featured'
>;

/**
 * Status für einen Hotel-Suchanruf
 */
export type HotelFetchStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Interface für die Ergebnisse einer Hotelsuche
 */
export interface HotelSearchResults {
  /** Liste der Hotels */
  hotels: Hotel[];
  /** Gesamtanzahl der gefundenen Hotels */
  total: number;
  /** Aktuelle Seite */
  page: number;
  /** Anzahl der Ergebnisse pro Seite */
  per_page: number;
  /** Gibt es weitere Seiten? */
  has_more: boolean;
  /** Aktueller Suchstatus */
  status: HotelFetchStatus;
  /** Fehlermeldung, falls vorhanden */
  error?: string;
}

/**
 * Optionen für eine Hotelsuche
 */
export interface HotelSearchOptions {
  /** Suchbegriff */
  query?: string;
  /** Ausgewählte Kategorien */
  categories?: string[];
  /** Ausgewählte Destinationen */
  destinations?: string[];
  /** Mindestpreis */
  min_price?: number;
  /** Maximaler Preis */
  max_price?: number;
  /** Mindest-Sterne */
  min_stars?: number;
  /** Sortierfeld */
  sort_by?: 'name' | 'price' | 'rating' | 'recommended';
  /** Sortierrichtung */
  sort_order?: 'asc' | 'desc';
  /** Nur verfügbare Hotels anzeigen */
  available_only?: boolean;
  /** Angebote anzeigen */
  has_offers?: boolean;
  /** Seite */
  page?: number;
  /** Ergebnisse pro Seite */
  per_page?: number;
}