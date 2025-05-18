import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LANGUAGES, DEFAULT_LANGUAGE } from '@/lib/i18n';

// List of routes that don't need language handling
const IGNORE_PATHS = [
  '/api/',
  '/_next/',
  '/favicon.ico',
  '/sitemap.xml',
  '/robots.txt',
  '/assets/',
  '/images/',
];

// Add security headers to all responses
export function middleware(request: NextRequest) {
  const response = processLanguage(request);

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googleapis.com *.gstatic.com; style-src 'self' 'unsafe-inline' *.googleapis.com; img-src 'self' data: blob: *.unsplash.com; font-src 'self' *.gstatic.com; connect-src 'self' *.directus.io; frame-src 'self' *.youtube.com *.vimeo.com;"
  );

  // Add cache headers for static assets
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

  // Add cache control headers for API routes
  if (url.startsWith('/api/')) {
    // Cache API responses for 1 minute
    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=60');
  }

  return response;
}

/**
 * Process language from URL path and handle redirects
 */
function processLanguage(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Check if the path should be ignored
  if (IGNORE_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check if the pathname starts with a supported language
  const pathnameIsMissingLanguage = Object.keys(LANGUAGES).every(
    (lang) => !pathname.startsWith(`/${lang}/`) && pathname !== `/${lang}`
  );

  // Get language from accept-language header or use default
  let language = DEFAULT_LANGUAGE;
  const acceptLanguage = request.headers.get('accept-language');

  if (acceptLanguage) {
    // Extract the preferred language from the header
    const preferredLanguage = acceptLanguage
      .split(',')
      .map((lang) => {
        const [language, priority = '1.0'] = lang.trim().split(';q=');
        return { language, priority: parseFloat(priority) };
      })
      .sort((a, b) => b.priority - a.priority)
      .map((item) => item.language)[0];
      
    // Map browser language to app language
    if (preferredLanguage?.startsWith('de')) {
      language = 'de-DE';
    } else if (preferredLanguage?.startsWith('en')) {
      language = 'en-US';
    }
  }

  // Special case for default language - keep URL as is
  if (language === DEFAULT_LANGUAGE && pathnameIsMissingLanguage) {
    return NextResponse.next();
  }

  // Redirect if language is missing from URL (except for default language)
  if (pathnameIsMissingLanguage && language !== DEFAULT_LANGUAGE) {
    // Redirect to add language prefix to URL
    return NextResponse.redirect(
      new URL(`/${language}${pathname === '/' ? '' : pathname}`, request.url)
    );
  }

  // Default: proceed with the request
  return NextResponse.next();
}

// Configure paths to run middleware on
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.ico$).*)'],
};