// @ts-nocheck
'use client';

import { useCallback } from 'react';
import { useEnhancedTranslations } from './EnhancedTranslationsProvider';
import type { TranslationsNamespaces } from './EnhancedTranslationsProvider';

type TranslationParams = Record<string, string | number>;

/**
 * Type for the translation function returned by useTranslation hook
 */
export interface TranslateFunction {
  /**
   * Translate a key with optional parameters
   */
  (key: string, params?: TranslationParams): string;

  /**
   * Translate a raw string with optional parameters (no key lookup)
   */
  raw: (text: string, params?: TranslationParams) => string;
}

/**
 * Hook for accessing translations with a specific namespace
 * 
 * @param namespace Optional default namespace for translations
 * @returns Object with translation functions and utilities
 */
export function useTranslation(namespace?: keyof TranslationsNamespaces | string) {
  const {
    translate: baseTranslate,
    translateWithNamespace,
    language,
    direction,
    isRtl,
    formatNumber,
    formatDate,
    isLoading,
    namespaces,
  } = useEnhancedTranslations();

  /**
   * Translate a key with optional namespace and parameters
   * If namespace is provided as an argument, it will override the default namespace
   */
  const translate = useCallback<TranslateFunction>((key: string, params?: TranslationParams) => {
    // Check if key includes namespace (contains a dot)
    if (key.includes('.')) {
      return baseTranslate(key, params);
    }
    
    // Use default namespace if provided
    if (namespace) {
      return translateWithNamespace(namespace, key, params);
    }
    
    // Fallback to direct key lookup
    return baseTranslate(key, params);
  }, [baseTranslate, namespace, translateWithNamespace]);

  /**
   * Direct string interpolation without key lookup 
   * (for dynamic content that isn't in translation files)
   */
  translate.raw = useCallback((text: string, params?: TranslationParams): string => {
    if (!params) return text;
    
    let result = text;
    Object.entries(params).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    });
    
    return result;
  }, []);

  /**
   * Get all translations for the current namespace
   */
  const getNamespaceTranslations = useCallback(() => {
    if (!namespace) return {};
    return namespaces[namespace] || {};
  }, [namespace, namespaces]);

  return {
    // Core translation function
    t: translate,
    
    // Same as t, but more explicit name
    translate,
    
    // Current language and direction
    language,
    direction,
    isRtl,
    
    // Formatting helpers
    formatNumber,
    formatDate,
    
    // Status
    isLoading,
    
    // Namespace helpers
    getNamespaceTranslations,
    
    // Helper for conditional text based on RTL
    rtlAware: <T>(ltrValue: T, rtlValue: T): T => isRtl ? rtlValue : ltrValue,
    
    // Helper for date formats based on the current locale
    dateFormats: {
      short: { year: 'numeric', month: 'short', day: 'numeric' } as Intl.DateTimeFormatOptions,
      medium: { year: 'numeric', month: 'long', day: 'numeric' } as Intl.DateTimeFormatOptions,
      long: { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      } as Intl.DateTimeFormatOptions
    },
    
    // Number formats for different use cases
    numberFormats: {
      default: {} as Intl.NumberFormatOptions,
      currency: { style: 'currency', currency: 'EUR' } as Intl.NumberFormatOptions,
      percent: { style: 'percent' } as Intl.NumberFormatOptions,
      compact: { notation: 'compact' } as Intl.NumberFormatOptions
    }
  };
}

export default useTranslation;