/**
 * Hook für RTL-Unterstützung in Komponenten
 */
import { useEnhancedTranslations } from '../components/i18n/EnhancedTranslationsProvider';

export interface RtlUtilities {
  isRtl: boolean;
  direction: 'ltr' | 'rtl';
  getFlexDirection: (defaultDirection: 'row' | 'column') => 'row' | 'row-reverse' | 'column' | 'column-reverse';
  getTextAlign: (defaultAlign: 'left' | 'right' | 'center') => 'left' | 'right' | 'center';
  getSideProperty: (property: 'margin' | 'padding', side: 'start' | 'end', value: string | number) => Record<string, string | number>;
  getOrderedArray: <T>(array: T[]) => T[];
  flip: (value: 'left' | 'right') => 'left' | 'right';
  getIconRotation: (angle: number) => number;
}

/**
 * Hook für RTL-Hilfsfunktionen
 * Bietet hilfreiche Utilities für die Entwicklung von RTL-kompatiblen Komponenten
 */
export function useRtl(): RtlUtilities {
  const { isRtl, direction } = useEnhancedTranslations();

  /**
   * Konvertiert eine Flex-Richtung basierend auf der aktuellen Textrichtung
   */
  const getFlexDirection = (defaultDirection: 'row' | 'column'): 'row' | 'row-reverse' | 'column' | 'column-reverse' => {
    if (!isRtl) return defaultDirection;
    
    if (defaultDirection === 'row') return 'row-reverse';
    return defaultDirection; // Column bleibt in RTL unverändert
  };

  /**
   * Konvertiert eine Textausrichtung basierend auf der aktuellen Textrichtung
   */
  const getTextAlign = (defaultAlign: 'left' | 'right' | 'center'): 'left' | 'right' | 'center' => {
    if (!isRtl || defaultAlign === 'center') return defaultAlign;
    
    return defaultAlign === 'left' ? 'right' : 'left';
  };

  /**
   * Konvertiert CSS-Eigenschaften für logische Eigenschaften (start/end statt left/right)
   */
  const getSideProperty = (
    property: 'margin' | 'padding',
    side: 'start' | 'end',
    value: string | number
  ): Record<string, string | number> => {
    const physicalSide = side === 'start' 
      ? (isRtl ? 'right' : 'left')
      : (isRtl ? 'left' : 'right');
      
    return { [`${property}${physicalSide.charAt(0).toUpperCase()}${physicalSide.slice(1)}`]: value };
  };

  /**
   * Array-Reihenfolge bei RTL umkehren
   */
  const getOrderedArray = <T>(array: T[]): T[] => {
    if (!isRtl) return array;
    return [...array].reverse();
  };

  /**
   * Konvertiert 'left' zu 'right' und umgekehrt, abhängig von RTL
   */
  const flip = (value: 'left' | 'right'): 'left' | 'right' => {
    if (!isRtl) return value;
    return value === 'left' ? 'right' : 'left';
  };

  /**
   * Passt Rotationswinkel für Icons in RTL an
   */
  const getIconRotation = (angle: number): number => {
    if (!isRtl) return angle;
    // Wenn RTL, drehe in die entgegengesetzte Richtung
    // z.B.: 90° wird zu 270°, 180° bleibt 180°
    return (360 - angle) % 360;
  };

  return {
    isRtl,
    direction,
    getFlexDirection,
    getTextAlign,
    getSideProperty,
    getOrderedArray,
    flip,
    getIconRotation
  };
}

export default useRtl;