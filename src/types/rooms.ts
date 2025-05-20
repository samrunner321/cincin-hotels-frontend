/**
 * Typ-Definitionen für Hotelzimmer
 */
import { Hotel } from './hotel';

/**
 * Enum für verschiedene Zimmertypen
 */
export enum RoomType {
  SINGLE = 'single',
  DOUBLE = 'double',
  TWIN = 'twin',
  SUITE = 'suite',
  DELUXE = 'deluxe',
  FAMILY = 'family',
  PENTHOUSE = 'penthouse',
  APARTMENT = 'apartment',
  VILLA = 'villa',
  BUNGALOW = 'bungalow',
}

/**
 * Enum für Bettentypen
 */
export enum BedType {
  SINGLE = 'single',
  DOUBLE = 'double',
  KING = 'king',
  QUEEN = 'queen',
  TWIN = 'twin',
  BUNK = 'bunk',
  SOFA = 'sofa',
}

/**
 * Interface für ein Bett im Zimmer
 */
export interface RoomBed {
  /** Art des Bettes */
  type: BedType;
  /** Anzahl dieses Bettentyps */
  count: number;
}

/**
 * Interface für einen Preis
 */
export interface RoomPrice {
  /** Preis pro Nacht */
  amount: number;
  /** Währung (ISO-Code) */
  currency: string;
  /** Gilt der Preis pro Person? */
  per_person?: boolean;
  /** Inkludiert Steuern? */
  includes_tax?: boolean;
  /** Inkludiert Frühstück? */
  includes_breakfast?: boolean;
  /** Mindestaufenthaltsdauer */
  min_stay_nights?: number;
}

/**
 * Interface für Preisperioden (saisonale Preise)
 */
export interface PricePeriod {
  /** Eindeutige ID der Preisperiode */
  id: string | number;
  /** Name der Preisperiode (z.B. "Hochsaison") */
  name: string;
  /** Startdatum (YYYY-MM-DD) */
  start_date: string;
  /** Enddatum (YYYY-MM-DD) */
  end_date: string;
  /** Preis für diesen Zeitraum */
  price: RoomPrice;
}

/**
 * Interface für Zimmerausstattung
 */
export interface RoomAmenities {
  /** Hat das Zimmer einen Balkon? */
  has_balcony?: boolean;
  /** Hat das Zimmer eine Terrasse? */
  has_terrace?: boolean;
  /** Hat das Zimmer ein eigenes Bad? */
  has_private_bathroom?: boolean;
  /** Hat das Zimmer eine Klimaanlage? */
  has_air_conditioning?: boolean;
  /** Hat das Zimmer einen Fernseher? */
  has_tv?: boolean;
  /** Hat das Zimmer einen Minibar? */
  has_minibar?: boolean;
  /** Hat das Zimmer einen Safe? */
  has_safe?: boolean;
  /** Hat das Zimmer einen Schreibtisch? */
  has_desk?: boolean;
  /** Hat das Zimmer einen Sitzbereich? */
  has_seating_area?: boolean;
  /** Hat das Zimmer kostenfreies WLAN? */
  has_free_wifi?: boolean;
  /** Liste zusätzlicher Annehmlichkeiten */
  additional_amenities?: string[];
}

/**
 * Vollständiges Zimmer-Interface
 */
export interface Room extends RoomAmenities {
  /** Eindeutige ID des Zimmers */
  id: string | number;
  /** Name des Zimmers */
  name: string;
  /** Kurzbeschreibung */
  short_description?: string;
  /** Ausführliche Beschreibung */
  description?: string;
  /** Zimmertyp */
  type: RoomType;
  /** Fläche des Zimmers in m² */
  size_sqm?: number;
  /** Kapazität (maximale Personenanzahl) */
  max_occupancy: number;
  /** Empfohlene Personenanzahl */
  recommended_occupancy?: number;
  /** Betten im Zimmer */
  beds: RoomBed[];
  /** Preise (Standard) */
  price: RoomPrice;
  /** Saisonale Preise */
  price_periods?: PricePeriod[];
  /** Hauptbild-URL */
  main_image_url?: string;
  /** Weitere Bilder des Zimmers */
  images?: string[];
  /** Zugehöriges Hotel */
  hotel?: Hotel;
  /** Anzahl verfügbarer Zimmer */
  available_count?: number;
  /** Reihenfolge für die Sortierung */
  sort_order?: number;
  /** Ist das Zimmer barrierefrei? */
  is_accessible?: boolean;
  /** Ist das Zimmer rauchfrei? */
  is_non_smoking?: boolean;
  /** Ist das Zimmer ein Angebot/Deal? */
  is_special_offer?: boolean;
  /** Etage, auf der sich das Zimmer befindet */
  floor?: number;
  /** Details zum Badezimmer */
  bathroom_details?: string;
  /** Details zur Aussicht */
  view_details?: string;
  /** Spezielle Features des Zimmers */
  special_features?: string[];
  /** Metadaten für CMS-Integration */
  metadata?: Record<string, any>;
}

/**
 * Gekürzte Version des Room-Interfaces für Listen
 */
export type RoomSummary = Pick<
  Room,
  | 'id'
  | 'name'
  | 'type'
  | 'short_description'
  | 'max_occupancy'
  | 'price'
  | 'main_image_url'
  | 'is_special_offer'
>;

/**
 * Props für RoomCard-Komponente
 */
export interface RoomCardProps {
  /** Daten des Zimmers */
  room: Room | RoomSummary;
  /** Zusätzliche CSS-Klassen */
  className?: string;
  /** OnClick-Handler */
  onClick?: (room: Room | RoomSummary) => void;
  /** Kompakte Ansicht? */
  compact?: boolean;
  /** Preisanzeige ausblenden? */
  hidePrice?: boolean;
}

/**
 * Props für RoomList-Komponente
 */
export interface RoomListProps {
  /** Liste der Zimmer */
  rooms: Room[] | RoomSummary[];
  /** Wird geladen? */
  loading?: boolean;
  /** Fehler beim Laden? */
  error?: string;
  /** Zusätzliche CSS-Klassen */
  className?: string;
}

/**
 * Interface für Zimmerbuchungsdaten
 */
export interface RoomBookingData {
  /** Zimmer-ID */
  roomId: string | number;
  /** Anreisedatum */
  checkInDate: string;
  /** Abreisedatum */
  checkOutDate: string;
  /** Anzahl Erwachsene */
  adults: number;
  /** Anzahl Kinder */
  children: number;
  /** Spezielle Anfragen */
  specialRequests?: string;
}