'use client';

import { useTranslation } from './useTranslation';
import type { 
  TranslationNamespace, 
  TranslationKeys, 
  CommonTranslationKeys,
  UITranslationKeys,
  FormTranslationKeys,
  NavigationTranslationKeys,
  ErrorTranslationKeys,
  PageTranslationKeys,
  HotelTranslationKeys,
  FQTranslationKey
} from './translationKeys';

type TranslationParams = Record<string, string | number>;

/**
 * Type-safe translation function for fully qualified keys
 */
export interface TypedTranslateFunction {
  /**
   * Translate a fully qualified key with optional parameters
   */
  (key: FQTranslationKey, params?: TranslationParams): string;
  
  /**
   * Translate a raw string with optional parameters (no key lookup)
   */
  raw: (text: string, params?: TranslationParams) => string;
}

/**
 * Type-safe translation function for namespace-specific keys
 */
export interface NamespacedTranslateFunction<N extends TranslationNamespace> {
  /**
   * Translate a key within the specified namespace with optional parameters
   */
  (key: keyof TranslationKeys[N], params?: TranslationParams): string;
  
  /**
   * Translate a raw string with optional parameters (no key lookup)
   */
  raw: (text: string, params?: TranslationParams) => string;
}

/**
 * Hook for accessing translations with type safety for fully qualified keys
 */
export function useTypedTranslation(): {
  t: TypedTranslateFunction;
  translate: TypedTranslateFunction;
  language: string;
  direction: 'ltr' | 'rtl';
  isRtl: boolean;
  formatNumber: (num: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  isLoading: boolean;
  rtlAware: <T>(ltrValue: T, rtlValue: T) => T;
  dateFormats: {
    short: Intl.DateTimeFormatOptions;
    medium: Intl.DateTimeFormatOptions;
    long: Intl.DateTimeFormatOptions;
  };
  numberFormats: {
    default: Intl.NumberFormatOptions;
    currency: Intl.NumberFormatOptions;
    percent: Intl.NumberFormatOptions;
    compact: Intl.NumberFormatOptions;
  };
} {
  const translation = useTranslation();
  
  return translation;
}

/**
 * Hook for accessing translations with type safety for a specific namespace
 */
export function useNamespacedTranslation<N extends TranslationNamespace>(
  namespace: N
): {
  t: NamespacedTranslateFunction<N>;
  translate: NamespacedTranslateFunction<N>;
  language: string;
  direction: 'ltr' | 'rtl';
  isRtl: boolean;
  formatNumber: (num: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  isLoading: boolean;
  rtlAware: <T>(ltrValue: T, rtlValue: T) => T;
  dateFormats: {
    short: Intl.DateTimeFormatOptions;
    medium: Intl.DateTimeFormatOptions;
    long: Intl.DateTimeFormatOptions;
  };
  numberFormats: {
    default: Intl.NumberFormatOptions;
    currency: Intl.NumberFormatOptions;
    percent: Intl.NumberFormatOptions;
    compact: Intl.NumberFormatOptions;
  };
} {
  const translation = useTranslation(namespace);
  
  return translation as any; // Type assertion needed due to limitations with generics
}

/**
 * Hook for accessing common translations with type safety
 */
export function useCommonTranslation() {
  return useNamespacedTranslation('common');
}

/**
 * Hook for accessing UI translations with type safety
 */
export function useUITranslation() {
  return useNamespacedTranslation('ui');
}

/**
 * Hook for accessing form translations with type safety
 */
export function useFormTranslation() {
  return useNamespacedTranslation('form');
}

/**
 * Hook for accessing navigation translations with type safety
 */
export function useNavigationTranslation() {
  return useNamespacedTranslation('navigation');
}

/**
 * Hook for accessing error translations with type safety
 */
export function useErrorTranslation() {
  return useNamespacedTranslation('error');
}

/**
 * Hook for accessing page translations with type safety
 */
export function usePageTranslation() {
  return useNamespacedTranslation('page');
}

/**
 * Hook for accessing hotel translations with type safety
 */
export function useHotelTranslation() {
  return useNamespacedTranslation('hotel');
}

export default useTypedTranslation;