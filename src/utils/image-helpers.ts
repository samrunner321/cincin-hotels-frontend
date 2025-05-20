import { Hotel } from '../types/hotel';
import { Destination } from '../types/destination';

/**
 * Mapping von Hotel-Slugs zu statischen Bildern
 */
export const HOTEL_IMAGE_MAP: Record<string, string> = {
  'the-comodo': '/images/hotels/hotel-1.jpg',
  'schgaguler-hotel': '/images/hotels/hotel-schgaguler.jpg',
  'casa-cook-samos': '/images/hotels/hotel-2.jpg',
  'the-hoxton-paris': '/images/hotels/hotel-3.jpg',
  'forestis': '/images/hotels/hotel-4.jpg',
  'villa-honegg': '/images/hotels/hotel-5.jpg',
  'nomad-london': '/images/hotels/hotel-6.jpg',
  'vigilius-mountain-resort': '/images/hotels/hotel-7.jpg',
  'cheval-blanc-st-tropez': '/images/hotels/hotel-aurora.jpg',
  'michelberger-hotel': '/images/hotels/hotel-giardino.jpg',
  'rock-resort': '/images/hotels/hotel-rockresort.jpg'
};

/**
 * Mapping von Destination-Slugs zu statischen Bildern
 */
export const DESTINATION_IMAGE_MAP: Record<string, string> = {
  'paris': '/images/destinations/city.jpg',
  'south-tyrol': '/images/destinations/south-tyrol.jpg',
  'crans-montana': '/images/destinations/mountain.jpg',
  'ibiza': '/images/destinations/beach.jpg',
  'tuscany': '/images/destinations/countryside.jpg'
};

/**
 * Mapping von Kategorie-Slugs zu statischen Bildern
 */
export const CATEGORY_IMAGE_MAP: Record<string, string> = {
  'beach': '/images/categories/beach.jpg',
  'city': '/images/categories/city.jpg',
  'countryside': '/images/categories/countryside.jpg',
  'mountain': '/images/categories/mountain.jpg',
  'spa': '/images/categories/spa.jpg',
  'culinary': '/images/categories/culinary.jpg',
  'adults-only': '/images/categories/adults-only.jpg'
};

/**
 * Prüft, ob eine URL eine gültige HTTP/HTTPS-URL oder ein absoluter Pfad ist
 * @param url Die zu prüfende URL
 * @returns true wenn es sich um eine gültige URL handelt
 */
export function isValidImageUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  
  // Überprüfen, ob die URL mit http://, https:// oder / beginnt
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
}

/**
 * Erzeugt eine zufällige Fallback-Bild-URL für Hotels
 * @returns URL zu einem zufälligen Hotelbild
 */
export function getRandomHotelImage(): string {
  return `/images/hotels/hotel-${Math.floor(Math.random() * 7) + 1}.jpg`;
}

/**
 * Lädt ein Hotel-Bild mit Fallback-Optionen
 * @param imageUrl Primäre Bild-URL (kann undefined sein)
 * @param slug Slug des Hotels für das Mapping
 * @param fallbackImage Optionales Fallback-Bild
 * @returns Die beste verfügbare Bild-URL
 */
export function getHotelImage(
  imageUrl: string | undefined,
  slug: string | undefined,
  fallbackImage?: string
): string {
  // Wenn wir eine direkte Bild-URL haben, verwenden wir diese
  if (imageUrl && isValidImageUrl(imageUrl)) {
    return imageUrl;
  }
  
  // Fallback auf statische Bilder basierend auf dem Slug
  if (slug && HOTEL_IMAGE_MAP[slug]) {
    return HOTEL_IMAGE_MAP[slug];
  }
  
  // Verwende das angegebene Fallback-Bild oder ein zufälliges Bild
  return fallbackImage || getRandomHotelImage();
}

/**
 * Lädt ein Destinations-Bild mit Fallback-Optionen
 * @param imageUrl Primäre Bild-URL (kann undefined sein)
 * @param slug Slug der Destination für das Mapping
 * @param fallbackImage Optionales Fallback-Bild
 * @returns Die beste verfügbare Bild-URL
 */
export function getDestinationImage(
  imageUrl: string | undefined,
  slug: string | undefined,
  fallbackImage?: string
): string {
  // Wenn wir eine direkte Bild-URL haben, verwenden wir diese
  if (imageUrl && isValidImageUrl(imageUrl)) {
    return imageUrl;
  }
  
  // Fallback auf statische Bilder basierend auf dem Slug
  if (slug && DESTINATION_IMAGE_MAP[slug]) {
    return DESTINATION_IMAGE_MAP[slug];
  }
  
  // Verwende das angegebene Fallback-Bild oder ein Standardbild
  return fallbackImage || '/images/destinations/countryside.jpg';
}

/**
 * Lädt ein Kategorie-Bild mit Fallback-Optionen
 * @param imageUrl Primäre Bild-URL (kann undefined sein)
 * @param slug Slug der Kategorie für das Mapping
 * @param fallbackImage Optionales Fallback-Bild
 * @returns Die beste verfügbare Bild-URL
 */
export function getCategoryImage(
  imageUrl: string | undefined,
  slug: string | undefined,
  fallbackImage?: string
): string {
  // Wenn wir eine direkte Bild-URL haben, verwenden wir diese
  if (imageUrl && isValidImageUrl(imageUrl)) {
    return imageUrl;
  }
  
  // Fallback auf statische Bilder basierend auf dem Slug
  if (slug && CATEGORY_IMAGE_MAP[slug]) {
    return CATEGORY_IMAGE_MAP[slug];
  }
  
  // Verwende das angegebene Fallback-Bild oder ein Standardbild
  return fallbackImage || '/images/categories/city.jpg';
}

/**
 * Generiert einen optimierten Satz von Image-Größen für responsive Bilder
 * @param type Der Typ des Bildes (hotel, destination, category, etc.)
 * @returns Ein sizes-String für das next/image-Komponente
 */
export function getResponsiveImageSizes(type: 'hotel' | 'destination' | 'category' | 'gallery' | 'hero'): string {
  switch (type) {
    case 'hotel':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
    case 'destination':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw';
    case 'category':
      return '(max-width: 640px) 50vw, 33vw';
    case 'gallery':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw';
    case 'hero':
      return '100vw';
    default:
      return '(max-width: 768px) 100vw, 50vw';
  }
}

/**
 * Hilfsfunktion zum Extrahieren von Bildern aus einem Hotel-Objekt
 * @param hotel Das Hotel-Objekt
 * @returns Die beste verfügbare Bild-URL
 */
export function getHotelImageFromObject(hotel: Partial<Hotel>): string {
  return getHotelImage(
    hotel.main_image_url || hotel.image,
    hotel.slug,
    getRandomHotelImage()
  );
}

/**
 * Hilfsfunktion zum Extrahieren von Bildern aus einem Destination-Objekt
 * @param destination Das Destination-Objekt
 * @returns Die beste verfügbare Bild-URL
 */
export function getDestinationImageFromObject(destination: Partial<Destination>): string {
  return getDestinationImage(
    destination.main_image_url || destination.image,
    destination.slug,
    '/images/destinations/countryside.jpg'
  );
}

/**
 * Determines if an image should be loaded with priority
 * 
 * @param index - The index of the image in a sequence
 * @param isPriority - Whether the image is marked as priority
 * @returns Boolean indicating if the image should load with priority
 */
export const shouldLoadWithPriority = (index: number, isPriority?: boolean): boolean => {
  if (isPriority) {
    return true;
  }
  
  // Only the first few images load with priority
  return index < 3;
};

/**
 * Generates srcset for responsive images
 * 
 * @param baseUrl - The base URL of the image
 * @param widths - Array of widths to generate srcset for
 * @param extension - Image file extension
 * @returns The srcset string
 */
export const generateSrcSet = (
  baseUrl: string, 
  widths: number[] = [320, 640, 960, 1280, 1920], 
  extension: string = 'jpg'
): string => {
  // Remove file extension from baseUrl if present
  const baseUrlWithoutExtension = baseUrl.replace(new RegExp(`\\.${extension}$`), '');
  
  return widths
    .map(width => `${baseUrlWithoutExtension}-${width}.${extension} ${width}w`)
    .join(', ');
};

/**
 * Gets the correct object fit value for a given image context
 * 
 * @param context - The context of the image (hero, card, thumbnail, etc.)
 * @returns The appropriate object-fit CSS value
 */
export const getObjectFit = (context: 'hero' | 'card' | 'thumbnail' | 'gallery' = 'card'): 'cover' | 'contain' | 'fill' => {
  switch (context) {
    case 'hero':
      return 'cover';
    case 'thumbnail':
      return 'cover';
    case 'gallery':
      return 'contain';
    case 'card':
    default:
      return 'cover';
  }
};

/**
 * Calculates image dimensions based on aspect ratio
 * 
 * @param width - The width of the image
 * @param aspectRatio - The aspect ratio as a string (e.g., '16:9')
 * @returns The calculated height
 */
export const calculateImageHeight = (width: number, aspectRatio: string = '16:9'): number => {
  const [ratioWidth, ratioHeight] = aspectRatio.split(':').map(Number);
  return Math.round((width * ratioHeight) / ratioWidth);
};

/**
 * Formats file size for display
 * 
 * @param bytes - The file size in bytes
 * @param decimals - Number of decimal places
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};