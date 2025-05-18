import { NextRequest, NextResponse } from 'next/server';
import { createDirectus, rest, staticToken } from '@directus/sdk';
import { mockTranslations } from '@/lib/translations';

export const dynamic = 'force-dynamic';

// Configure Directus client
const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || '';
const IS_MOCK_SERVER = process.env.IS_MOCK_SERVER === 'true';

// Supported languages
const SUPPORTED_LANGUAGES = ['en-US', 'de-DE'];
const DEFAULT_LANGUAGE = 'en-US';

// Directus REST client
const client = createDirectus(DIRECTUS_URL)
  .with(rest())
  .with(staticToken(DIRECTUS_TOKEN));

// API route handler
export async function GET(request: NextRequest) {
  try {
    // Get language parameter or use default
    const searchParams = request.nextUrl.searchParams;
    let language = searchParams.get('language') || DEFAULT_LANGUAGE;
    
    // Validate language code
    if (!SUPPORTED_LANGUAGES.includes(language)) {
      language = DEFAULT_LANGUAGE;
    }
    
    // Return mock translations if using mock server
    if (IS_MOCK_SERVER) {
      return NextResponse.json(mockTranslations[language as keyof typeof mockTranslations], {
        status: 200,
      });
    }
    
    // Get translations from Directus
    const translations = await client.request(
      rest.readItems('translations', {
        filter: {
          language: { _eq: language }
        },
        fields: ['key', 'value']
      })
    );
    
    // Convert to key-value object
    const translationMap: Record<string, string> = {};
    translations.forEach((item: any) => {
      translationMap[item.key] = item.value;
    });
    
    return NextResponse.json(translationMap, { status: 200 });
  } catch (error) {
    console.error(`Error fetching translations:`, error);
    
    // Return mock translations as fallback
    const language = request.nextUrl.searchParams.get('language') || DEFAULT_LANGUAGE;
    const validLanguage = SUPPORTED_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE;
    
    return NextResponse.json(mockTranslations[validLanguage as keyof typeof mockTranslations], {
      status: 200,
    });
  }
}