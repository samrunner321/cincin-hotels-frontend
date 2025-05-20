/**
 * Utility-Funktionen für CinCin Hotels
 * Enthält wiederverwendbare Funktionen für allgemeine Aufgaben
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Kombiniert mehrere Klassennamen mit clsx und optimiert Tailwind-Klassen mit twMerge
 * @param inputs - Beliebige Anzahl von Klassennamen oder Bedingungen
 * @returns Optimierter Klassenname-String
 * 
 * @example
 * cn('px-4 py-2', 'bg-blue-500', isActive && 'bg-blue-700')
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formatiert ein Datum in einer lokalisierten Weise
 * @param date - Datum als String oder Date-Objekt
 * @param options - DateTimeFormatOptions für Formatierungsoptionen
 * @param locale - Gebietsschema für die Formatierung (Standard: 'en-US')
 * @returns Formatierter Datums-String
 * 
 * @example
 * formatDate('2023-05-15', { month: 'short', day: 'numeric' }, 'de-DE')
 */
export function formatDate(
  date: string | Date | number,
  options: Intl.DateTimeFormatOptions = {},
  locale: string = 'en-US'
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return new Date(date).toLocaleDateString(
    locale, 
    { ...defaultOptions, ...options }
  );
}

/**
 * Konvertiert einen String in ein Slug-Format
 * @param str - Zu konvertierender String
 * @returns Slug-formatierter String (lowercase, nur alphanumerische Zeichen und Bindestriche)
 * 
 * @example
 * slugify('Hello World!') // 'hello-world'
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

/**
 * Kürzt einen String auf eine bestimmte Länge und fügt Auslassungspunkte hinzu
 * @param str - Zu kürzender String
 * @param length - Maximale Länge des gekürzten Strings
 * @param ellipsis - Anzuhängender Ellipsen-String (Standard: '...')
 * @returns Gekürzter String mit Ellipse oder ursprünglicher String
 * 
 * @example
 * truncate('This is a very long text', 10) // 'This is a...'
 */
export function truncate(
  str: string, 
  length: number,
  ellipsis: string = '...'
): string {
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length)}${ellipsis}`;
}

/**
 * Holt ein zufälliges Element aus einem Array
 * @param array - Quell-Array
 * @returns Zufälliges Element aus dem Array
 * 
 * @example
 * getRandomItem([1, 2, 3, 4, 5]) // z.B. 3
 */
export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Mischt die Reihenfolge der Elemente in einem Array
 * @param array - Zu mischendes Array
 * @returns Neues Array mit gemischten Elementen
 * 
 * @example
 * shuffleArray([1, 2, 3, 4, 5]) // z.B. [3, 1, 5, 2, 4]
 */
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Teilt einen Array in kleinere Arrays auf
 * @param array - Zu teilendes Array
 * @param chunkSize - Größe jedes Teils
 * @returns Array von Arrays mit der angegebenen Größe
 * 
 * @example
 * chunkArray([1, 2, 3, 4, 5, 6, 7], 3) // [[1, 2, 3], [4, 5, 6], [7]]
 */
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

/**
 * Prüft, ob ein Wert undefiniert oder null ist
 * @param value - Zu prüfender Wert
 * @returns true, wenn der Wert undefiniert oder null ist
 */
export function isNullOrUndefined(value: unknown): boolean {
  return value === undefined || value === null;
}

/**
 * Verzögert die Ausführung einer Funktion um eine bestimmte Zeit
 * @param ms - Verzögerung in Millisekunden
 * @returns Promise, das nach der angegebenen Zeit aufgelöst wird
 * 
 * @example
 * await delay(1000); // Wartet 1 Sekunde
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Formatiert einen Geldbetrag als Währungsstring
 * @param amount - Zu formatierender Betrag
 * @param currency - Währungscode (Standard: 'EUR')
 * @param locale - Gebietsschema für die Formatierung (Standard: 'de-DE')
 * @returns Formatierter Währungsstring
 * 
 * @example
 * formatCurrency(1234.56) // '1.234,56 €'
 */
export function formatCurrency(
  amount: number,
  currency: string = 'EUR',
  locale: string = 'de-DE'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}