/**
 * RTL-Hilfsfunktionen für CSS und Tailwind
 */

import { RTL_LANGUAGES, LanguageCode } from '../lib/i18n';

/**
 * Überprüft, ob eine Sprache RTL (Right-to-Left) ist
 */
export function isRtlLanguage(language: LanguageCode | string): boolean {
  return RTL_LANGUAGES.includes(language as LanguageCode);
}

/**
 * Bestimmt die Textrichtung basierend auf der Sprache
 */
export function getDirection(language: LanguageCode | string): 'ltr' | 'rtl' {
  return isRtlLanguage(language) ? 'rtl' : 'ltr';
}

/**
 * Erstellt eine CSS-Klasse, die auf der Textrichtung basiert
 */
export function rtlClass(ltrClassName: string, rtlClassName: string, isRtl: boolean): string {
  return isRtl ? rtlClassName : ltrClassName;
}

/**
 * Konvertiert Tailwind-Klassen für RTL-Unterstützung
 * 
 * Beispiel:
 * ```
 * // Wird zu "ml-4" in LTR und "mr-4" in RTL:
 * const marginClass = rtlFlip("ml-4");
 * 
 * // Wird zu "text-left" in LTR und "text-right" in RTL:
 * const textAlignClass = rtlFlip("text-left");
 * ```
 */
export function rtlFlip(className: string, isRtl: boolean): string {
  if (!isRtl) return className;

  // Tailwind-Klassen für Margins (ml-*, mr-*)
  if (className.startsWith('ml-')) {
    return `mr-${className.substring(3)}`;
  }
  if (className.startsWith('mr-')) {
    return `ml-${className.substring(3)}`;
  }

  // Tailwind-Klassen für Paddings (pl-*, pr-*)
  if (className.startsWith('pl-')) {
    return `pr-${className.substring(3)}`;
  }
  if (className.startsWith('pr-')) {
    return `pl-${className.substring(3)}`;
  }

  // Tailwind-Klassen für Border (border-l-*, border-r-*)
  if (className.startsWith('border-l-')) {
    return `border-r-${className.substring(9)}`;
  }
  if (className.startsWith('border-r-')) {
    return `border-l-${className.substring(9)}`;
  }

  // Tailwind-Klassen für Positionen (left-*, right-*)
  if (className.startsWith('left-')) {
    return `right-${className.substring(5)}`;
  }
  if (className.startsWith('right-')) {
    return `left-${className.substring(6)}`;
  }

  // Tailwind-Klassen für Text-Ausrichtung (text-left, text-right)
  if (className === 'text-left') {
    return 'text-right';
  }
  if (className === 'text-right') {
    return 'text-left';
  }

  // Tailwind-Klassen für Rounded Corners (rounded-tl-*, rounded-tr-*, rounded-bl-*, rounded-br-*)
  if (className.startsWith('rounded-tl-')) {
    return `rounded-tr-${className.substring(11)}`;
  }
  if (className.startsWith('rounded-tr-')) {
    return `rounded-tl-${className.substring(11)}`;
  }
  if (className.startsWith('rounded-bl-')) {
    return `rounded-br-${className.substring(11)}`;
  }
  if (className.startsWith('rounded-br-')) {
    return `rounded-bl-${className.substring(11)}`;
  }

  // Flex Direction (flex-row, flex-row-reverse)
  if (className === 'flex-row') {
    return 'flex-row-reverse';
  }
  if (className === 'flex-row-reverse') {
    return 'flex-row';
  }

  // Justify Content (justify-start, justify-end)
  if (className === 'justify-start') {
    return 'justify-end';
  }
  if (className === 'justify-end') {
    return 'justify-start';
  }

  // Wenn keine Übereinstimmung gefunden wurde, originale Klasse zurückgeben
  return className;
}

/**
 * Konvertiert mehrere Tailwind-Klassen für RTL-Unterstützung
 */
export function rtlFlipClasses(classNames: string, isRtl: boolean): string {
  if (!isRtl) return classNames;
  
  return classNames.split(' ')
    .map(className => rtlFlip(className, isRtl))
    .join(' ');
}

/**
 * Erstellt React-Style-Objekte mit RTL-Unterstützung für CSS-Eigenschaften
 */
export function getRtlStyles(isRtl: boolean, styles: Record<string, any>): Record<string, any> {
  if (!isRtl) return styles;

  const rtlStyles = { ...styles };

  // CSS-Eigenschaften für Margins
  if ('marginLeft' in rtlStyles) {
    rtlStyles.marginRight = rtlStyles.marginLeft;
    delete rtlStyles.marginLeft;
  }
  if ('marginRight' in rtlStyles) {
    rtlStyles.marginLeft = rtlStyles.marginRight;
    delete rtlStyles.marginRight;
  }

  // CSS-Eigenschaften für Paddings
  if ('paddingLeft' in rtlStyles) {
    rtlStyles.paddingRight = rtlStyles.paddingLeft;
    delete rtlStyles.paddingLeft;
  }
  if ('paddingRight' in rtlStyles) {
    rtlStyles.paddingLeft = rtlStyles.paddingRight;
    delete rtlStyles.paddingRight;
  }

  // CSS-Eigenschaften für Positionen
  if ('left' in rtlStyles) {
    rtlStyles.right = rtlStyles.left;
    delete rtlStyles.left;
  }
  if ('right' in rtlStyles) {
    rtlStyles.left = rtlStyles.right;
    delete rtlStyles.right;
  }

  // CSS-Eigenschaft für Text-Ausrichtung
  if ('textAlign' in rtlStyles) {
    if (rtlStyles.textAlign === 'left') {
      rtlStyles.textAlign = 'right';
    } else if (rtlStyles.textAlign === 'right') {
      rtlStyles.textAlign = 'left';
    }
  }

  // CSS-Eigenschaft für Flex-Direction
  if ('flexDirection' in rtlStyles) {
    if (rtlStyles.flexDirection === 'row') {
      rtlStyles.flexDirection = 'row-reverse';
    } else if (rtlStyles.flexDirection === 'row-reverse') {
      rtlStyles.flexDirection = 'row';
    }
  }

  return rtlStyles;
}

/**
 * Konvertiert CSS logische Eigenschaften für RTL
 * Beispiel: margin-inline-start -> marginLeft (LTR) oder marginRight (RTL)
 */
export function getLogicalSideProperty(
  property: 'margin' | 'padding', 
  side: 'start' | 'end', 
  value: string | number,
  isRtl: boolean
): Record<string, string | number> {
  const physicalSide = side === 'start' 
    ? (isRtl ? 'Right' : 'Left')
    : (isRtl ? 'Left' : 'Right');
    
  return { [`${property}${physicalSide}`]: value };
}