import { NextResponse } from 'next/server';

export function middleware(request) {
  const pathname = request.nextUrl.pathname;
  
  // Check if pathname already has locale
  const pathnameHasLocale = /^\/(?:de|en)(?:\/|$)/.test(pathname);
  
  if (!pathnameHasLocale) {
    // Get preferred locale from Accept-Language header
    const acceptLanguage = request.headers.get('accept-language');
    let locale = 'de'; // Default locale
    
    if (acceptLanguage) {
      // Simple language detection
      if (acceptLanguage.toLowerCase().includes('en')) {
        locale = 'en';
      }
    }
    
    // Redirect to path with locale
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|fonts).*)',
  ],
};