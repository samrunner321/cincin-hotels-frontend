/**
 * Typ-Definitionen für das Journal/Blog
 */

import { Destination } from './destination';
import { Hotel } from './hotel';

/**
 * Enum für Artikelkategorien
 */
export enum ArticleCategory {
  TRAVEL_TIPS = 'travel-tips',
  DESTINATIONS = 'destinations',
  HOTELS = 'hotels',
  CUISINE = 'cuisine',
  CULTURE = 'culture',
  WELLNESS = 'wellness',
  ARCHITECTURE = 'architecture',
  INTERVIEWS = 'interviews',
  NEWS = 'news',
  EVENTS = 'events',
}

/**
 * Interface für Artikel-Autoren
 */
export interface Author {
  /** Eindeutige ID des Autors */
  id: string | number;
  /** Name des Autors */
  name: string;
  /** Biographische Informationen */
  bio?: string;
  /** Profilbild-URL */
  avatar_url?: string;
  /** Jobtitel */
  title?: string;
  /** Sozialmedia-Profile */
  social_links?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    website?: string;
  };
  /** Anzahl veröffentlichter Artikel */
  article_count?: number;
}

/**
 * Enum für Content-Block-Typen in Artikeln
 */
export enum ContentBlockType {
  PARAGRAPH = 'paragraph',
  HEADING = 'heading',
  IMAGE = 'image',
  GALLERY = 'gallery',
  QUOTE = 'quote',
  LIST = 'list',
  DIVIDER = 'divider',
  CALLOUT = 'callout',
  VIDEO = 'video',
  EMBED = 'embed',
  MAP = 'map',
  TABLE = 'table',
}

/**
 * Interface für einen Basis-Content-Block
 */
export interface BaseContentBlock {
  /** Typ des Content-Blocks */
  type: ContentBlockType;
  /** Eindeutige ID des Blocks */
  id: string;
  /** Reihenfolge innerhalb des Artikels */
  order: number;
}

/**
 * Interface für Textblock
 */
export interface ParagraphBlock extends BaseContentBlock {
  type: ContentBlockType.PARAGRAPH;
  /** Textinhalt */
  content: string;
  /** CSS-Klassen */
  className?: string;
}

/**
 * Interface für Überschrift
 */
export interface HeadingBlock extends BaseContentBlock {
  type: ContentBlockType.HEADING;
  /** Überschriftentext */
  content: string;
  /** Überschriftenlevel (h1-h6) */
  level: 1 | 2 | 3 | 4 | 5 | 6;
  /** CSS-Klassen */
  className?: string;
}

/**
 * Interface für ein einzelnes Bild
 */
export interface ImageBlock extends BaseContentBlock {
  type: ContentBlockType.IMAGE;
  /** Bild-URL */
  url: string;
  /** Alternativer Text */
  alt: string;
  /** Bildunterschrift */
  caption?: string;
  /** Bildattribution */
  credit?: string;
  /** Soll das Bild als Vollbild angezeigt werden? */
  fullWidth?: boolean;
  /** CSS-Klassen */
  className?: string;
}

/**
 * Interface für eine Bildergalerie
 */
export interface GalleryBlock extends BaseContentBlock {
  type: ContentBlockType.GALLERY;
  /** Bilder in der Galerie */
  images: Array<{
    url: string;
    alt: string;
    caption?: string;
    credit?: string;
  }>;
  /** Layout-Typ der Galerie */
  layout?: 'grid' | 'carousel' | 'masonry';
  /** CSS-Klassen */
  className?: string;
}

/**
 * Interface für ein Zitat
 */
export interface QuoteBlock extends BaseContentBlock {
  type: ContentBlockType.QUOTE;
  /** Zitattext */
  content: string;
  /** Autor des Zitats */
  author?: string;
  /** Quelle des Zitats */
  source?: string;
  /** CSS-Klassen */
  className?: string;
}

/**
 * Interface für eine Liste
 */
export interface ListBlock extends BaseContentBlock {
  type: ContentBlockType.LIST;
  /** Listeneinträge */
  items: string[];
  /** Listentyp */
  listType: 'ordered' | 'unordered';
  /** CSS-Klassen */
  className?: string;
}

/**
 * Interface für einen Trennstrich
 */
export interface DividerBlock extends BaseContentBlock {
  type: ContentBlockType.DIVIDER;
  /** CSS-Klassen */
  className?: string;
}

/**
 * Interface für ein Callout-Element
 */
export interface CalloutBlock extends BaseContentBlock {
  type: ContentBlockType.CALLOUT;
  /** Callout-Inhalt */
  content: string;
  /** Callout-Typ */
  calloutType: 'info' | 'warning' | 'tip' | 'note';
  /** Icon für das Callout */
  icon?: string;
  /** CSS-Klassen */
  className?: string;
}

/**
 * Interface für ein eingebettetes Video
 */
export interface VideoBlock extends BaseContentBlock {
  type: ContentBlockType.VIDEO;
  /** Video-URL (YouTube, Vimeo etc.) */
  url: string;
  /** Bildunterschrift */
  caption?: string;
  /** Poster-Bild */
  poster?: string;
  /** Automatisch abspielen? */
  autoplay?: boolean;
  /** Mit Steuerung anzeigen? */
  controls?: boolean;
  /** Vollbild erlauben? */
  allowFullscreen?: boolean;
  /** CSS-Klassen */
  className?: string;
}

/**
 * Interface für eingebettete Inhalte
 */
export interface EmbedBlock extends BaseContentBlock {
  type: ContentBlockType.EMBED;
  /** HTML für den eingebetteten Inhalt */
  html: string;
  /** Höhe des Embed */
  height?: number;
  /** Bildunterschrift */
  caption?: string;
  /** CSS-Klassen */
  className?: string;
}

/**
 * Interface für eine eingebettete Karte
 */
export interface MapBlock extends BaseContentBlock {
  type: ContentBlockType.MAP;
  /** Breitengrad */
  latitude: number;
  /** Längengrad */
  longitude: number;
  /** Zoom-Level */
  zoom: number;
  /** Kartenmarker */
  markers?: Array<{
    latitude: number;
    longitude: number;
    title?: string;
    description?: string;
  }>;
  /** Bildunterschrift */
  caption?: string;
  /** CSS-Klassen */
  className?: string;
}

/**
 * Interface für eine Tabelle
 */
export interface TableBlock extends BaseContentBlock {
  type: ContentBlockType.TABLE;
  /** Tabellenüberschrift */
  header?: string[];
  /** Tabellenzeilen */
  rows: string[][];
  /** Hat die Tabelle eine Kopfzeile? */
  hasHeader?: boolean;
  /** Bildunterschrift */
  caption?: string;
  /** CSS-Klassen */
  className?: string;
}

/**
 * Union-Typ für alle Content-Block-Typen
 */
export type ContentBlock =
  | ParagraphBlock
  | HeadingBlock
  | ImageBlock
  | GalleryBlock
  | QuoteBlock
  | ListBlock
  | DividerBlock
  | CalloutBlock
  | VideoBlock
  | EmbedBlock
  | MapBlock
  | TableBlock;

/**
 * Interface für Artikel/Blogposts
 */
export interface Article {
  /** Eindeutige ID des Artikels */
  id: string | number;
  /** Titel des Artikels */
  title: string;
  /** Slug für die URL */
  slug: string;
  /** Kurze Beschreibung/Teaser */
  excerpt?: string;
  /** Artikel-Content als Array von Blöcken */
  content: ContentBlock[];
  /** Roher Inhalt (falls kein strukturierter Inhalt) */
  raw_content?: string;
  /** Hauptbild-URL */
  featured_image?: string;
  /** Autor des Artikels */
  author?: Author;
  /** Veröffentlichungsdatum */
  published_date: string;
  /** Aktualisierungsdatum */
  updated_date?: string;
  /** Schlagwörter/Tags */
  tags?: string[];
  /** Artikelkategorien */
  categories?: ArticleCategory[];
  /** Verlinkte Destinationen */
  related_destinations?: Destination[];
  /** Verlinkte Hotels */
  related_hotels?: Hotel[];
  /** Lesezeit in Minuten */
  reading_time?: number;
  /** Metadaten für SEO */
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    og_image?: string;
  };
  /** Ist der Artikel ein Feature-Artikel? */
  is_featured?: boolean;
  /** Status des Artikels */
  status: 'draft' | 'published' | 'archived';
  /** Anzahl der Aufrufe/Leser */
  view_count?: number;
  /** Metadaten für CMS-Integration */
  metadata?: Record<string, any>;
}

/**
 * Gekürzte Version des Article-Interfaces für Listen
 */
export type ArticleSummary = Pick<
  Article,
  | 'id'
  | 'title'
  | 'slug'
  | 'excerpt'
  | 'featured_image'
  | 'author'
  | 'published_date'
  | 'categories'
  | 'tags'
  | 'reading_time'
  | 'is_featured'
>;

/**
 * Props für die JournalGrid-Komponente
 */
export interface JournalGridProps {
  /** Liste der Artikel */
  articles: Article[] | ArticleSummary[];
  /** Wird geladen? */
  loading?: boolean;
  /** Fehler beim Laden? */
  error?: string;
  /** Maximale Anzahl anzuzeigender Artikel */
  limit?: number;
  /** Ausgewählte Kategorie zur Filterung */
  category?: ArticleCategory;
  /** Ausgewählter Tag zur Filterung */
  tag?: string;
  /** Layout der Grid */
  layout?: 'grid' | 'list' | 'featured';
  /** Anzahl der Spalten (für Grid-Layout) */
  columns?: 1 | 2 | 3 | 4;
  /** Zusätzliche CSS-Klassen */
  className?: string;
  /** Callback bei Artikelauswahl */
  onArticleClick?: (article: Article | ArticleSummary) => void;
}

/**
 * Props für die JournalPostHero-Komponente
 */
export interface JournalPostHeroProps {
  /** Artikel-Daten */
  article: Article;
  /** Zusätzliche CSS-Klassen */
  className?: string;
}

/**
 * Props für die JournalPostContent-Komponente
 */
export interface JournalPostContentProps {
  /** Artikel-Daten */
  article: Article;
  /** Zusätzliche CSS-Klassen */
  className?: string;
}