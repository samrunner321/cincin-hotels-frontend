/**
 * Typdefinitionen für Galerien und Bild-Management
 */

import { MotionProps } from 'framer-motion';

/**
 * Grundlegendes Asset-Interface
 */
export interface Asset {
  /** Eindeutige ID des Assets */
  id: string | number;
  /** Dateiname */
  filename: string;
  /** MIME-Typ */
  mime_type: string;
  /** Dateigröße in Bytes */
  filesize?: number;
  /** Asset-Titel */
  title?: string;
  /** Asset-Beschreibung */
  description?: string;
  /** Erstelldatum */
  created_at?: string;
  /** Aktualisierungsdatum */
  updated_at?: string;
  /** Metadaten */
  metadata?: Record<string, any>;
}

/**
 * Interface für Bildressourcen
 */
export interface ImageAsset extends Asset {
  /** Bild-URL (Original) */
  url: string;
  /** Bild-URL für kleine Größe */
  url_small?: string;
  /** Bild-URL für mittlere Größe */
  url_medium?: string;
  /** Bild-URL für große Größe */
  url_large?: string;
  /** Breite in Pixeln */
  width?: number;
  /** Höhe in Pixeln */
  height?: number;
  /** Alternativer Text für Barrierefreiheit */
  alt_text?: string;
  /** Bildunterschrift */
  caption?: string;
  /** Credit/Quellenangabe */
  credit?: string;
  /** Dominante Farbe (für Lazy Loading) */
  dominant_color?: string;
  /** Hash für Blurhash-Vorschau */
  blur_hash?: string;
  /** Schlüsselwörter/Tags */
  tags?: string[];
  /** Fokuspunkt X (0-1) */
  focal_point_x?: number;
  /** Fokuspunkt Y (0-1) */
  focal_point_y?: number;
}

/**
 * Interface für Video-Assets
 */
export interface VideoAsset extends Asset {
  /** Video-URL */
  url: string;
  /** Thumbnail-URL */
  thumbnail_url?: string;
  /** Dauer in Sekunden */
  duration?: number;
  /** Breite in Pixeln */
  width?: number;
  /** Höhe in Pixeln */
  height?: number;
  /** Untertitel/Captions URL */
  captions_url?: string;
}

/**
 * Union-Typ für alle Asset-Typen
 */
export type MediaAsset = ImageAsset | VideoAsset;

/**
 * Enum für Galerie-Layouts
 */
export enum GalleryLayout {
  GRID = 'grid',
  CAROUSEL = 'carousel',
  MASONRY = 'masonry',
  FULLSCREEN = 'fullscreen',
  SLIDESHOW = 'slideshow',
}

/**
 * Interface für eine Galerie mit Bildern und Videos
 */
export interface Gallery {
  /** Eindeutige ID der Galerie */
  id: string | number;
  /** Titel der Galerie */
  title?: string;
  /** Beschreibung der Galerie */
  description?: string;
  /** Liste der Assets in der Galerie */
  items: MediaAsset[];
  /** Galerie-Layout */
  layout?: GalleryLayout;
  /** Optionale Konfiguration */
  config?: {
    /** Automatisches Abspielen aktivieren? */
    autoplay?: boolean;
    /** Intervall für automatisches Abspielen in ms */
    autoplayInterval?: number;
    /** Anzahl der Spalten im Grid/Masonry */
    columns?: number;
    /** Unendliche Schleife aktivieren? */
    infinite?: boolean;
    /** Unterstützt Lightbox? */
    lightbox?: boolean;
    /** Zeigt Thumbnails an? */
    thumbnails?: boolean;
    /** Zeigt Navigationspfeile an? */
    arrows?: boolean;
    /** Zeigt Punkte/Indikatoren an? */
    dots?: boolean;
  };
}

/**
 * Props für die GallerySection-Komponente
 */
export interface GallerySectionProps {
  /** Galerie-Daten */
  gallery: Gallery;
  /** Zusätzliche CSS-Klassen */
  className?: string;
  /** Überschrift für die Sektion */
  title?: string;
  /** Unterüberschrift/Beschreibung */
  subtitle?: string;
  /** Initialer Index */
  initialIndex?: number;
  /** Callback bei Bildklick */
  onItemClick?: (item: MediaAsset, index: number) => void;
  /** Animationsvarianten */
  variants?: MotionProps['variants'];
}

/**
 * Props für die GalleryItem-Komponente
 */
export interface GalleryItemProps {
  /** Asset-Daten */
  item: MediaAsset;
  /** Index des Items */
  index: number;
  /** Ausgewählt? */
  isActive?: boolean;
  /** Ist vergrößert/im Lightbox-Modus? */
  isEnlarged?: boolean;
  /** Callback bei Klick */
  onClick?: (item: MediaAsset, index: number) => void;
  /** Callback für Vorschau/Vergrößerung */
  onPreview?: (item: MediaAsset, index: number) => void;
  /** Animationsvarianten */
  variants?: MotionProps['variants'];
  /** Zusätzliche CSS-Klassen */
  className?: string;
}

/**
 * Props für die AssetManager-Komponente
 */
export interface AssetManagerProps {
  /** Unterstützte Asset-Typen */
  supportedTypes?: ('image' | 'video' | 'audio' | 'document')[];
  /** Ist der Manager im Mehrfachauswahl-Modus? */
  multiple?: boolean;
  /** Maximale Anzahl auswählbarer Assets */
  maxSelection?: number;
  /** Initial ausgewählte Assets */
  initialSelection?: MediaAsset[];
  /** Callback bei Auswahländerung */
  onSelectionChange?: (selected: MediaAsset[]) => void;
  /** Callback bei Asset-Upload */
  onUpload?: (assets: MediaAsset[]) => void;
  /** Callback bei Schließen des Managers */
  onClose?: () => void;
  /** Erlaubt das Hochladen neuer Assets? */
  allowUpload?: boolean;
  /** Erlaubt das Bearbeiten von Assets? */
  allowEdit?: boolean;
  /** Erlaubt das Löschen von Assets? */
  allowDelete?: boolean;
  /** Zusätzliche CSS-Klassen */
  className?: string;
}

/**
 * Props für die AssetPreloader-Komponente
 */
export interface AssetPreloaderProps {
  /** Zu ladende Assets */
  assets: MediaAsset[] | string[];
  /** Werden alle Assets sofort geladen? */
  preloadAll?: boolean;
  /** Priorität der Assets */
  priority?: 'high' | 'medium' | 'low';
  /** Callback nach Abschluss des Ladevorgangs */
  onComplete?: () => void;
  /** Callback bei Fortschrittsänderung */
  onProgress?: (progress: number) => void;
}

/**
 * Props für die ResponsiveDirectusImage-Komponente
 */
export interface ResponsiveDirectusImageProps {
  /** Bild-ID oder URL */
  image: string | ImageAsset;
  /** Alternativer Text */
  alt: string;
  /** Bildgröße */
  size?: 'small' | 'medium' | 'large' | 'original';
  /** Bildbreite */
  width?: number | string;
  /** Bildhöhe */
  height?: number | string;
  /** Optimiert für Layout-Fill-Modus? */
  fill?: boolean;
  /** Priorität für Ladevorgang */
  priority?: boolean;
  /** Qualität (1-100) */
  quality?: number;
  /** Anpassungen für verschiedene Bildschirmgrößen */
  responsive?: {
    sm?: { width?: number; height?: number };
    md?: { width?: number; height?: number };
    lg?: { width?: number; height?: number };
  };
  /** Objektanpassung */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  /** Objektposition */
  objectPosition?: string;
  /** Unverschwommen machen (falls noch nicht geladen) */
  unblur?: boolean;
  /** Lazy Loading verwenden? */
  lazy?: boolean;
  /** Zusätzliche CSS-Klassen */
  className?: string;
}