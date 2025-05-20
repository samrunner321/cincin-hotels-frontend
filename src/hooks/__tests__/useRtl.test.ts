import { renderHook } from '@testing-library/react';
import { EnhancedTranslationsProvider } from '../../../components/i18n/EnhancedTranslationsProvider';
import { useRtl } from '../useRtl';
import React from 'react';

// Valid language codes that match the Translation interface
type SupportedLanguage = 'ar-AE' | 'en-US' | 'de-DE' | 'he-IL';

// Mock RTL languages
const RTL_LANGUAGE: SupportedLanguage = 'ar-AE'; // Arabic
const LTR_LANGUAGE: SupportedLanguage = 'en-US'; // English

// Wrapper component with language prop for testing
const wrapper = ({ children, language }: { children: React.ReactNode, language: SupportedLanguage }) => (
  <EnhancedTranslationsProvider initialLanguage={language}>
    {children}
  </EnhancedTranslationsProvider>
);

describe('useRtl hook', () => {
  test('should provide correct RTL values for RTL languages', () => {
    const { result } = renderHook(() => useRtl(), {
      wrapper: ({ children }) => wrapper({ children, language: RTL_LANGUAGE }),
    });

    // Check basic RTL values
    expect(result.current.isRtl).toBe(true);
    expect(result.current.direction).toBe('rtl');
    
    // Check flex direction transformation
    expect(result.current.getFlexDirection('row')).toBe('row-reverse');
    expect(result.current.getFlexDirection('column')).toBe('column'); // Column stays the same
    
    // Check text alignment transformation
    expect(result.current.getTextAlign('left')).toBe('right');
    expect(result.current.getTextAlign('right')).toBe('left');
    expect(result.current.getTextAlign('center')).toBe('center'); // Center stays the same
    
    // Check side property transformation (margin & padding)
    expect(result.current.getSideProperty('margin', 'start', '1rem')).toEqual({ marginRight: '1rem' });
    expect(result.current.getSideProperty('margin', 'end', '1rem')).toEqual({ marginLeft: '1rem' });
    expect(result.current.getSideProperty('padding', 'start', '1rem')).toEqual({ paddingRight: '1rem' });
    expect(result.current.getSideProperty('padding', 'end', '1rem')).toEqual({ paddingLeft: '1rem' });
    
    // Check array order reversal
    const testArray = [1, 2, 3, 4];
    expect(result.current.getOrderedArray(testArray)).toEqual([4, 3, 2, 1]);
    
    // Check value flipping
    expect(result.current.flip('left')).toBe('right');
    expect(result.current.flip('right')).toBe('left');
    
    // Check icon rotation
    expect(result.current.getIconRotation(90)).toBe(270);
    expect(result.current.getIconRotation(180)).toBe(180); // 180° stays the same
    expect(result.current.getIconRotation(270)).toBe(90);
  });

  test('should provide correct LTR values for LTR languages', () => {
    const { result } = renderHook(() => useRtl(), {
      wrapper: ({ children }) => wrapper({ children, language: LTR_LANGUAGE }),
    });

    // Check basic LTR values
    expect(result.current.isRtl).toBe(false);
    expect(result.current.direction).toBe('ltr');
    
    // Check that transformations don't happen in LTR
    expect(result.current.getFlexDirection('row')).toBe('row');
    expect(result.current.getFlexDirection('column')).toBe('column');
    
    expect(result.current.getTextAlign('left')).toBe('left');
    expect(result.current.getTextAlign('right')).toBe('right');
    expect(result.current.getTextAlign('center')).toBe('center');
    
    expect(result.current.getSideProperty('margin', 'start', '1rem')).toEqual({ marginLeft: '1rem' });
    expect(result.current.getSideProperty('margin', 'end', '1rem')).toEqual({ marginRight: '1rem' });
    
    const testArray = [1, 2, 3, 4];
    expect(result.current.getOrderedArray(testArray)).toEqual(testArray);
    
    expect(result.current.flip('left')).toBe('left');
    expect(result.current.flip('right')).toBe('right');
    
    expect(result.current.getIconRotation(90)).toBe(90);
    expect(result.current.getIconRotation(180)).toBe(180);
  });
});