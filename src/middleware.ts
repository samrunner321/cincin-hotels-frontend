/**
 * Next.js Middleware for CinCin Hotels
 * 
 * Handles:
 * - Language detection and redirection
 * - Security headers
 * - Caching strategies for different content types
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LANGUAGES, DEFAULT_LANGUAGE, type LanguageCode } from './lib/i18n';

// Routes that should be excluded from language processing
const IGNORE_PATHS = [
  '/api/',
  '/_next/',
  '/favicon.ico',
  '/sitemap.xml',
  '/robots.txt',
  '/assets/',
  '/images/',
  '/fonts/',
  '/public/',
];

// Security headers to apply to all responses
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googleapis.com *.gstatic.com; " +
    "style-src 'self' 'unsafe-inline' *.googleapis.com; " +
    "img-src 'self' data: blob: *.unsplash.com; " +
    "font-src 'self' *.gstatic.com; " +
    "connect-src 'self' *.directus.io; " +
    "frame-src 'self' *.youtube.com *.vimeo.com;"
};

// Static asset file extensions for cache optimization
const STATIC_ASSET_PATTERNS = [
  'images/',
  'assets/',
  '.jpg',
  '.jpeg',
  '.png',
  '.svg',
  '.webp',
  '.css',
  '.js',
];

/**
 * Main middleware function - entry point for all requests
 */
export function middleware(request: NextRequest) {
  // First, handle language detection and possible redirection
  const response = processLanguage(request);
  
  // Apply security headers to all responses
  applySecurityHeaders(response);
  
  // Apply appropriate caching strategies based on the request
  applyCachingStrategy(request, response);
  
  return response;
}

/**
 * Process language from URL path and handle redirects
 * 
 * @param request The Next.js request object
 * @returns NextResponse with appropriate language handling
 */
function processLanguage(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  
  // Skip language processing for paths that don't need it
  if (shouldIgnorePath(pathname)) {
    return NextResponse.next();
  }
  
  // Check if URL already has a valid locale
  if (hasValidLocale(pathname)) {
    return NextResponse.next();
  }
  
  // Determine the user's preferred language
  const language = determineUserLanguage(request);
  
  // For default language, don't include the locale in the URL
  if (language === DEFAULT_LANGUAGE) {
    return NextResponse.next();
  }
  
  // For non-default languages, redirect to include the locale in the URL
  // Only if we're on a path without the locale
  if (pathname === '/' || !pathname.startsWith(`/${language}`)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${language}${pathname === '/' ? '' : pathname}`;
    
    return NextResponse.redirect(url);
  }
  
  // Otherwise, let the request through
  return NextResponse.next();
}

/**
 * Check if the path should be ignored for language processing
 */
function shouldIgnorePath(pathname: string): boolean {
  return IGNORE_PATHS.some((path) => pathname.startsWith(path));
}

/**
 * Check if the pathname already has a valid locale
 */
function hasValidLocale(pathname: string): boolean {
  return Object.keys(LANGUAGES).some(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  );
}

/**
 * Determine the user's preferred language from cookies or headers
 */
function determineUserLanguage(request: NextRequest): LanguageCode {
  // Try to get language from cookie
  const preferredLanguage = request.cookies.get('preferred_language')?.value;
  
  if (preferredLanguage && isValidLanguage(preferredLanguage)) {
    return preferredLanguage as LanguageCode;
  }
  
  // Fall back to accept-language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const browserPreference = parseBrowserLanguage(acceptLanguage);
    
    // Map browser language to app language
    if (browserPreference?.startsWith('de')) {
      return 'de-DE';
    } else if (browserPreference?.startsWith('en')) {
      return 'en-US';
    }
  }
  
  // Default fallback
  return DEFAULT_LANGUAGE;
}

/**
 * Check if the provided language code is valid for our application
 */
function isValidLanguage(lang: string): boolean {
  return Object.keys(LANGUAGES).includes(lang);
}

/**
 * Parse the browser's Accept-Language header to get the preferred language
 */
function parseBrowserLanguage(acceptLanguage: string): string {
  return acceptLanguage
    .split(',')
    .map((lang) => {
      const [language, priority = '1.0'] = lang.trim().split(';q=');
      return { language, priority: parseFloat(priority) };
    })
    .sort((a, b) => b.priority - a.priority)
    .map((item) => item.language)[0];
}

/**
 * Apply security headers to the response
 */
function applySecurityHeaders(response: NextResponse): void {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
}

/**
 * Apply appropriate caching strategy based on the request
 */
function applyCachingStrategy(request: NextRequest, response: NextResponse): void {
  const url = request.nextUrl.pathname;
  
  // Long-term caching for static assets
  if (isStaticAsset(url)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  // Short-term caching for API responses
  else if (url.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=60');
  }
}

/**
 * Check if the URL points to a static asset
 */
function isStaticAsset(url: string): boolean {
  return STATIC_ASSET_PATTERNS.some(pattern => {
    return pattern.startsWith('.') ? url.endsWith(pattern) : url.includes(pattern);
  });
}

/**
 * Configure which paths the middleware should run on
 */
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.ico$|api/webhooks/).*)'],
};