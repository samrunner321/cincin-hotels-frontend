import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LANGUAGES, DEFAULT_LANGUAGE } from '@/lib/i18n';

// Liste von Pfaden, die nicht sprachspezifisch sind
const IGNORE_PATHS = [
  '/api/',
  '/_next/',
  '/favicon.ico',
  '/sitemap.xml',
  '/robots.txt',
  '/assets/',
  '/images/',
];

export function middleware(request: NextRequest) {
  const response = processLanguage(request);
  
  // Sicherheits-Header hinzufügen
  addSecurityHeaders(response);
  
  // Cache-Header für statische Assets
  addCacheHeaders(request, response);
  
  return response;
}

/**
 * Spracherkennung und -routing
 */
function processLanguage(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  
  // Prüfen, ob der Pfad ignoriert werden soll
  if (IGNORE_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  
  // Prüfen, ob der Pfad bereits eine unterstützte Sprache enthält
  const pathnameIsMissingLanguage = Object.keys(LANGUAGES).every(
    (lang) => !pathname.startsWith(`/${lang}/`) && pathname !== `/${lang}`
  );
  
  // Sprache aus Accept-Language-Header oder Standardsprache verwenden
  let language = DEFAULT_LANGUAGE;
  const acceptLanguage = request.headers.get('accept-language');
  
  if (acceptLanguage) {
    // Bevorzugte Sprache aus dem Header extrahieren
    const preferredLanguage = acceptLanguage
      .split(',')
      .map((lang) => {
        const [language, priority = '1.0'] = lang.trim().split(';q=');
        return { language, priority: parseFloat(priority) };
      })
      .sort((a, b) => b.priority - a.priority)
      .map((item) => item.language)[0];
    
    // Browser-Sprache auf App-Sprache abbilden
    if (preferredLanguage?.startsWith('de')) {
      language = 'de-DE';
    } else if (preferredLanguage?.startsWith('en')) {
      language = 'en-US';
    }
  }
  
  // Sonderfall für Standardsprache - URL belassen
  if (language === DEFAULT_LANGUAGE && pathnameIsMissingLanguage) {
    return NextResponse.next();
  }
  
  // Umleitung, wenn Sprache in der URL fehlt (außer bei Standardsprache)
  if (pathnameIsMissingLanguage && language !== DEFAULT_LANGUAGE) {
    // Füge Sprachpräfix zur URL hinzu
    return NextResponse.redirect(
      new URL(`/${language}${pathname === '/' ? '' : pathname}`, request.url)
    );
  }
  
  // Standard: Anfrage fortsetzen
  return NextResponse.next();
}

/**
 * Sicherheits-Header hinzufügen
 */
function addSecurityHeaders(response: NextResponse): void {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googleapis.com *.gstatic.com; style-src 'self' 'unsafe-inline' *.googleapis.com; img-src 'self' data: blob: *.directus.io *.unsplash.com; font-src 'self' *.gstatic.com; connect-src 'self' *.directus.io; frame-src 'self' *.youtube.com *.vimeo.com;"
  );
}

/**
 * Cache-Header für statische Assets
 */
function addCacheHeaders(request: NextRequest, response: NextResponse): void {
  const url = request.nextUrl.pathname;
  
  if (
    url.includes('images/') ||
    url.includes('assets/') ||
    url.endsWith('.jpg') ||
    url.endsWith('.png') ||
    url.endsWith('.svg') ||
    url.endsWith('.webp') ||
    url.endsWith('.css') ||
    url.endsWith('.js')
  ) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  // Cache-Control-Header für API-Routen
  if (url.startsWith('/api/')) {
    // API-Antworten für 1 Minute cachen
    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=60');
  }
}

// Pfade für Middleware konfigurieren
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.ico$).*)'],
};