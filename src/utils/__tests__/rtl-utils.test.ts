import { 
  isRtlLanguage,
  getDirection,
  rtlClass,
  rtlFlip,
  rtlFlipClasses,
  getRtlStyles,
  getLogicalSideProperty
} from '../rtl-utils';

describe('RTL utilities', () => {
  // Test RTL language detection
  test('isRtlLanguage should correctly identify RTL languages', () => {
    expect(isRtlLanguage('ar')).toBe(true);
    expect(isRtlLanguage('he')).toBe(true);
    expect(isRtlLanguage('en-US')).toBe(false);
    expect(isRtlLanguage('de-DE')).toBe(false);
  });

  // Test direction determination
  test('getDirection should return correct text direction based on language', () => {
    expect(getDirection('ar')).toBe('rtl');
    expect(getDirection('he')).toBe('rtl');
    expect(getDirection('en-US')).toBe('ltr');
    expect(getDirection('de-DE')).toBe('ltr');
  });

  // Test RTL class utility
  test('rtlClass should return the correct class based on direction', () => {
    expect(rtlClass('ltr-class', 'rtl-class', true)).toBe('rtl-class');
    expect(rtlClass('ltr-class', 'rtl-class', false)).toBe('ltr-class');
  });

  // Test Tailwind class flipping for RTL
  test('rtlFlip should correctly transform Tailwind classes for RTL', () => {
    // Test margin classes
    expect(rtlFlip('ml-4', true)).toBe('mr-4');
    expect(rtlFlip('mr-4', true)).toBe('ml-4');
    
    // Test padding classes
    expect(rtlFlip('pl-4', true)).toBe('pr-4');
    expect(rtlFlip('pr-4', true)).toBe('pl-4');
    
    // Test border classes
    expect(rtlFlip('border-l-2', true)).toBe('border-r-2');
    expect(rtlFlip('border-r-2', true)).toBe('border-l-2');
    
    // Test position classes
    expect(rtlFlip('left-0', true)).toBe('right-0');
    expect(rtlFlip('right-0', true)).toBe('left-0');
    
    // Test text alignment classes
    expect(rtlFlip('text-left', true)).toBe('text-right');
    expect(rtlFlip('text-right', true)).toBe('text-left');
    
    // Test rounded corner classes
    expect(rtlFlip('rounded-tl-lg', true)).toBe('rounded-tr-lg');
    expect(rtlFlip('rounded-tr-lg', true)).toBe('rounded-tl-lg');
    expect(rtlFlip('rounded-bl-lg', true)).toBe('rounded-br-lg');
    expect(rtlFlip('rounded-br-lg', true)).toBe('rounded-bl-lg');
    
    // Test flex direction classes
    expect(rtlFlip('flex-row', true)).toBe('flex-row-reverse');
    expect(rtlFlip('flex-row-reverse', true)).toBe('flex-row');
    
    // Test justify content classes
    expect(rtlFlip('justify-start', true)).toBe('justify-end');
    expect(rtlFlip('justify-end', true)).toBe('justify-start');
    
    // Test classes that shouldn't be flipped
    expect(rtlFlip('bg-blue-500', true)).toBe('bg-blue-500');
    expect(rtlFlip('p-4', true)).toBe('p-4');
    
    // Test in LTR mode (no changes)
    expect(rtlFlip('ml-4', false)).toBe('ml-4');
    expect(rtlFlip('text-left', false)).toBe('text-left');
  });

  // Test multiple Tailwind classes flipping
  test('rtlFlipClasses should correctly transform multiple Tailwind classes', () => {
    expect(rtlFlipClasses('ml-4 text-left flex-row', true)).toBe('mr-4 text-right flex-row-reverse');
    expect(rtlFlipClasses('mr-2 pl-4 text-right', true)).toBe('ml-2 pr-4 text-left');
    expect(rtlFlipClasses('rounded-tl-lg border-r-2', true)).toBe('rounded-tr-lg border-l-2');
    
    // Test with mixed classes (some that shouldn't change)
    expect(rtlFlipClasses('ml-4 p-2 bg-blue-500', true)).toBe('mr-4 p-2 bg-blue-500');
    
    // No changes in LTR mode
    expect(rtlFlipClasses('ml-4 text-left', false)).toBe('ml-4 text-left');
  });

  // Test React style objects for RTL
  test('getRtlStyles should correctly transform React style objects', () => {
    // Define a test style object
    const styles = {
      marginLeft: '1rem',
      paddingRight: '2rem',
      left: 0,
      textAlign: 'left',
      flexDirection: 'row',
      color: 'blue',
      width: '100%'
    };
    
    // Expected transformed styles for RTL
    const expectedRtlStyles = {
      marginRight: '1rem',
      paddingLeft: '2rem',
      right: 0,
      textAlign: 'right',
      flexDirection: 'row-reverse',
      color: 'blue',
      width: '100%'
    };
    
    // Test RTL transformation
    expect(getRtlStyles(true, styles)).toEqual(expectedRtlStyles);
    
    // Test LTR (no changes)
    expect(getRtlStyles(false, styles)).toEqual(styles);
  });

  // Test logical property conversion
  test('getLogicalSideProperty should return correct physical properties', () => {
    // Test for RTL
    expect(getLogicalSideProperty('margin', 'start', '1rem', true)).toEqual({ marginRight: '1rem' });
    expect(getLogicalSideProperty('margin', 'end', '1rem', true)).toEqual({ marginLeft: '1rem' });
    expect(getLogicalSideProperty('padding', 'start', '1rem', true)).toEqual({ paddingRight: '1rem' });
    expect(getLogicalSideProperty('padding', 'end', '1rem', true)).toEqual({ paddingLeft: '1rem' });
    
    // Test for LTR
    expect(getLogicalSideProperty('margin', 'start', '1rem', false)).toEqual({ marginLeft: '1rem' });
    expect(getLogicalSideProperty('margin', 'end', '1rem', false)).toEqual({ marginRight: '1rem' });
    expect(getLogicalSideProperty('padding', 'start', '1rem', false)).toEqual({ paddingLeft: '1rem' });
    expect(getLogicalSideProperty('padding', 'end', '1rem', false)).toEqual({ paddingRight: '1rem' });
  });
});