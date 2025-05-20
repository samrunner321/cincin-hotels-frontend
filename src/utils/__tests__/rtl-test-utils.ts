/**
 * Utility functions for RTL testing
 */
import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import { EnhancedTranslationsProvider } from '../../../components/i18n/EnhancedTranslationsProvider';
import { getDirection, isRtlLanguage } from '../rtl-utils';

// Define allowed language codes
type SupportedLanguage = 'ar-AE' | 'en-US' | 'de-DE' | 'he-IL';

// Mock RTL languages for tests
export const TEST_RTL_LANGUAGE: SupportedLanguage = 'ar-AE';
export const TEST_LTR_LANGUAGE: SupportedLanguage = 'en-US';

/**
 * Render a component with RTL context
 * @param ui - Component to render
 * @param language - Language code to use (will determine RTL/LTR direction)
 * @returns RenderResult with the rendered component
 */
export function renderWithRtlSupport(
  ui: React.ReactElement,
  language: SupportedLanguage = TEST_LTR_LANGUAGE
): RenderResult {
  // Additional context information if needed
  const isRtl = isRtlLanguage(language);
  const direction = getDirection(language);
  
  return render(
    <EnhancedTranslationsProvider initialLanguage={language}>
      {ui}
    </EnhancedTranslationsProvider>
  );
}

/**
 * Render a component with RTL direction
 * @param ui - Component to render
 * @returns RenderResult with the rendered component in RTL direction
 */
export function renderWithRtl(ui: React.ReactElement): RenderResult {
  return renderWithRtlSupport(ui, TEST_RTL_LANGUAGE);
}

/**
 * Render a component with LTR direction
 * @param ui - Component to render
 * @returns RenderResult with the rendered component in LTR direction
 */
export function renderWithLtr(ui: React.ReactElement): RenderResult {
  return renderWithRtlSupport(ui, TEST_LTR_LANGUAGE);
}

/**
 * Check if an element has RTL direction
 * @param element - DOM element to check
 * @returns Boolean indicating if the element has RTL direction
 */
export function hasRtlDirection(element: HTMLElement): boolean {
  return element.getAttribute('dir') === 'rtl';
}

/**
 * Check if a computed style property matches the expected value for RTL
 * @param element - DOM element to check
 * @param property - CSS property to check
 * @param value - Expected value for RTL direction
 * @returns Boolean indicating if the style property matches
 */
export function hasRtlStyle(
  element: HTMLElement,
  property: string,
  value: string
): boolean {
  const style = window.getComputedStyle(element);
  // Use type-safe indexing for CSS properties
  const propertyValue = property in style ? 
    (style as Record<string, string>)[property] : undefined;
  return propertyValue === value;
}

/**
 * Get the effective text direction of an element
 * @param element - DOM element to check
 * @returns 'rtl' or 'ltr' based on the element's direction
 */
export function getElementDirection(element: HTMLElement): 'rtl' | 'ltr' {
  const dir = element.getAttribute('dir');
  return (dir === 'rtl' || dir === 'ltr') ? dir : 'ltr';
}