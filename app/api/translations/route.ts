/**
 * API Route for Translations
 * Enhanced version with TypeScript, caching, and improved error handling
 */

import { NextRequest } from 'next/server';
import { getTranslationsWithCache, REVALIDATE_TIMES } from '../../../src/lib/api/cached-directus-client';
import { 
  extractQueryParams, 
  createSuccessResponse, 
  handleApiError 
} from '../../../src/lib/api-utils';
import { ApiQueryParams } from '../../../src/types/api';

// Import mock translations for fallback
import { mockTranslations } from '../../../src/lib/translations';
import { LanguageCode, DEFAULT_LANGUAGE } from '../../../src/lib/i18n';

// Set to dynamic rendering to ensure data is fresh
export const dynamic = 'force-dynamic';

// Supported languages
const SUPPORTED_LANGUAGES = Object.keys(mockTranslations);

/**
 * GET handler for /api/translations
 */
export async function GET(request: NextRequest) {
  try {
    // Extract and parse query parameters
    const params = extractQueryParams<ApiQueryParams>(request, {
      language: DEFAULT_LANGUAGE
    });
    
    // Get language parameter or use default
    let language = params.language || DEFAULT_LANGUAGE;
    
    // Validate language code and use default if not supported
    if (!SUPPORTED_LANGUAGES.includes(language)) {
      language = DEFAULT_LANGUAGE;
    }
    
    // Cache options
    const cacheOptions = {
      enabled: true,
      ttl: REVALIDATE_TIMES.TRANSLATIONS,
      tags: ['translations', `translations:${language}`],
    };
    
    // Try to fetch translations from Directus if not in mock mode
    if (process.env.IS_MOCK_SERVER !== 'true') {
      try {
        const translations = await getTranslationsWithCache(language, {
          bypassCache: params.bypassCache,
        });
        
        // If we got translations from Directus, return them
        if (translations && Object.keys(translations).length > 0) {
          return createSuccessResponse(translations, {
            cache: cacheOptions,
            meta: {
              language,
              count: Object.keys(translations).length,
              source: 'directus'
            }
          });
        }
        
        // If no translations found or empty, fall back to mock translations
        console.warn(`No translations found for ${language}, using mock data`);
      } catch (directusError) {
        console.error(`Error fetching translations from Directus:`, directusError);
        // Continue to fallback
      }
    }
    
    // Return mock translations as fallback
    const translations = mockTranslations[language as LanguageCode] || {};
    return createSuccessResponse(translations, {
      cache: cacheOptions,
      meta: {
        language,
        count: Object.keys(translations).length,
        source: 'mock'
      }
    });
  } catch (error) {
    // Use our centralized error handler
    return handleApiError(error, {
      endpoint: '/api/translations',
      method: 'GET',
      params: Object.fromEntries(request.nextUrl.searchParams)
    });
  }
}