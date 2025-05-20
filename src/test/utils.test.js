/**
 * Tests für die Utils-Funktionen
 */

// Utils importieren
import {
  cn,
  formatDate,
  slugify,
  truncate,
  getRandomItem,
  shuffleArray,
  chunkArray,
  isNullOrUndefined,
  formatCurrency
} from '../lib/utils';

describe('Utils Funktionen', () => {
  // Test für cn (class names)
  test('cn kombiniert Klassen korrekt', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
    expect(cn('class1', null, 'class2')).toBe('class1 class2');
    expect(cn('class1', false && 'class2', true && 'class3')).toBe('class1 class3');
  });

  // Test für slugify
  test('slugify konvertiert Strings korrekt in Slugs', () => {
    expect(slugify('Hello World')).toBe('hello-world');
    expect(slugify('Test 123!')).toBe('test-123');
    expect(slugify('Über uns')).toBe('ber-uns'); // Umlaute werden entfernt
    expect(slugify('CamelCase Example')).toBe('camelcase-example');
  });

  // Test für truncate
  test('truncate kürzt Strings korrekt', () => {
    expect(truncate('Short text', 15)).toBe('Short text');
    expect(truncate('This is a longer text', 10)).toBe('This is a...');
    expect(truncate('Hello', 5)).toBe('Hello');
    expect(truncate('Hello World', 5, '***')).toBe('Hello***');
  });

  // Test für formatDate
  test('formatDate formatiert Datum korrekt', () => {
    // Da die genaue Formatierung vom Browser abhängt, testen wir nur grundlegende Funktionalität
    const testDate = new Date(2023, 0, 15); // 15. Januar 2023
    expect(formatDate(testDate)).toContain('2023'); // Sollte das Jahr enthalten
    expect(formatDate(testDate)).toContain('January'); // Sollte den Monat enthalten
    
    // Test mit verschiedenen Formaten
    expect(formatDate(testDate, { year: 'numeric' })).toContain('2023');
    expect(formatDate(testDate, { month: 'short' })).toContain('Jan');
  });

  // Test für array utilities
  test('Array-Utilities funktionieren korrekt', () => {
    const testArray = [1, 2, 3, 4, 5];
    
    // getRandomItem gibt ein Element aus dem Array zurück
    expect(testArray).toContain(getRandomItem(testArray));
    
    // shuffleArray gibt ein gemischtes Array zurück
    const shuffled = shuffleArray(testArray);
    expect(shuffled).toHaveLength(testArray.length);
    expect(shuffled).toEqual(expect.arrayContaining(testArray));
    
    // chunkArray teilt Arrays korrekt
    expect(chunkArray(testArray, 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(chunkArray(testArray, 3)).toEqual([[1, 2, 3], [4, 5]]);
  });

  // Test für isNullOrUndefined
  test('isNullOrUndefined prüft Nullwerte korrekt', () => {
    expect(isNullOrUndefined(null)).toBe(true);
    expect(isNullOrUndefined(undefined)).toBe(true);
    expect(isNullOrUndefined('')).toBe(false);
    expect(isNullOrUndefined(0)).toBe(false);
    expect(isNullOrUndefined(false)).toBe(false);
  });

  // Test für formatCurrency
  test('formatCurrency formatiert Beträge korrekt', () => {
    // Da die genaue Formatierung vom Browser abhängt, testen wir allgemein
    expect(formatCurrency(1234.56)).toContain('1');
    expect(formatCurrency(1234.56)).toContain('234');
    expect(formatCurrency(1234.56)).toContain('56');
    expect(formatCurrency(1234.56, 'USD', 'en-US')).toContain('$');
  });
});