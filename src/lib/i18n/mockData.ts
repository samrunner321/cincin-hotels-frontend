/**
 * Mock-Übersetzungsdaten für die Entwicklung
 * 
 * Enthält Beispielübersetzungen für Entwicklungs- und Testzwecke,
 * die verwendet werden, wenn die API nicht verfügbar ist.
 */

import { LanguageCode, TranslationsMap } from './index';

/**
 * Mock-Übersetzungen für verschiedene Sprachen
 */
export const mockTranslations: Record<LanguageCode, TranslationsMap> = {
  'en-US': {
    // Allgemeine Übersetzungen
    'common.welcome': 'Welcome to CinCin Hotels',
    'common.explore': 'Explore our collection',
    'common.book_now': 'Book Now',
    'common.view_details': 'View Details',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.retry': 'Retry',
    'common.close': 'Close',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.apply': 'Apply',
    'common.reset': 'Reset',
    'common.more': 'More',
    'common.less': 'Less',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.back': 'Back',
    'common.continue': 'Continue',

    // Startseite
    'home.hero_title': 'Discover Unique Accommodations',
    'home.hero_subtitle': 'Handpicked luxury hotels with character',
    'home.featured_title': 'Featured Hotels',
    'home.featured_subtitle': 'Our most popular destinations',
    'home.destinations_title': 'Explore Destinations',
    'home.destinations_subtitle': 'Unforgettable places to visit',
    
    // Navigation
    'nav.home': 'Home',
    'nav.hotels': 'Hotels',
    'nav.destinations': 'Destinations',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.account': 'My Account',
    'nav.language': 'Language',
    
    // Hotels
    'hotels.title': 'Our Hotels',
    'hotels.subtitle': 'Find your perfect stay',
    'hotels.filter_title': 'Filter Hotels',
    'hotels.filter_category': 'Category',
    'hotels.filter_destination': 'Destination',
    'hotels.filter_price': 'Price Range',
    'hotels.filter_amenities': 'Amenities',
    'hotels.sort_name': 'Name',
    'hotels.sort_price': 'Price',
    'hotels.sort_rating': 'Rating',
    'hotels.no_results': 'No hotels found matching your criteria',
    
    // Hotel Detail
    'hotel.details': 'Hotel Details',
    'hotel.amenities': 'Amenities',
    'hotel.location': 'Location',
    'hotel.rooms': 'Rooms',
    'hotel.dining': 'Dining',
    'hotel.reviews': 'Reviews',
    'hotel.availability': 'Check Availability',
    'hotel.book': 'Book This Hotel',
    
    // Destinations
    'destinations.title': 'Destinations',
    'destinations.subtitle': 'Explore our curated destinations',
    'destinations.featured': 'Featured Destinations',
    'destinations.popular': 'Popular Destinations',
    'destinations.upcoming': 'Upcoming Destinations',
    
    // Formular-Validierung
    'validation.required': 'This field is required',
    'validation.email': 'Please enter a valid email address',
    'validation.minLength': 'Must be at least {{min}} characters',
    'validation.maxLength': 'Cannot exceed {{max}} characters',
    
    // Kontaktformular
    'contact.title': 'Contact Us',
    'contact.subtitle': 'We\'d love to hear from you',
    'contact.name': 'Your Name',
    'contact.email': 'Email Address',
    'contact.message': 'Message',
    'contact.submit': 'Send Message',
    'contact.success': 'Your message has been sent successfully',
    'contact.error': 'An error occurred while sending your message',
    
    // Fehlermeldungen
    'error.notFound': 'Page not found',
    'error.serverError': 'Server error',
    'error.network': 'Network error',
    'error.unauthorized': 'Unauthorized access',
    'error.loading': 'Error loading data',
    
    // Footer
    'footer.copyright': 'Copyright © {{year}} CinCin Hotels. All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.contact': 'Contact',
    'footer.sitemap': 'Sitemap',
    'footer.newsletter': 'Subscribe to our newsletter',
    'footer.newsletter_button': 'Subscribe',
  },
  
  'de-DE': {
    // Allgemeine Übersetzungen
    'common.welcome': 'Willkommen bei CinCin Hotels',
    'common.explore': 'Entdecken Sie unsere Kollektion',
    'common.book_now': 'Jetzt Buchen',
    'common.view_details': 'Details Anzeigen',
    'common.loading': 'Wird geladen...',
    'common.error': 'Ein Fehler ist aufgetreten',
    'common.retry': 'Wiederholen',
    'common.close': 'Schließen',
    'common.search': 'Suchen',
    'common.filter': 'Filtern',
    'common.sort': 'Sortieren',
    'common.apply': 'Anwenden',
    'common.reset': 'Zurücksetzen',
    'common.more': 'Mehr',
    'common.less': 'Weniger',
    'common.next': 'Weiter',
    'common.previous': 'Zurück',
    'common.back': 'Zurück',
    'common.continue': 'Fortfahren',

    // Startseite
    'home.hero_title': 'Entdecken Sie einzigartige Unterkünfte',
    'home.hero_subtitle': 'Handverlesene Luxushotels mit Charakter',
    'home.featured_title': 'Empfohlene Hotels',
    'home.featured_subtitle': 'Unsere beliebtesten Reiseziele',
    'home.destinations_title': 'Reiseziele Entdecken',
    'home.destinations_subtitle': 'Unvergessliche Orte zum Besuchen',
    
    // Navigation
    'nav.home': 'Startseite',
    'nav.hotels': 'Hotels',
    'nav.destinations': 'Reiseziele',
    'nav.about': 'Über Uns',
    'nav.contact': 'Kontakt',
    'nav.login': 'Anmelden',
    'nav.signup': 'Registrieren',
    'nav.account': 'Mein Konto',
    'nav.language': 'Sprache',
    
    // Hotels
    'hotels.title': 'Unsere Hotels',
    'hotels.subtitle': 'Finden Sie Ihren perfekten Aufenthalt',
    'hotels.filter_title': 'Hotels Filtern',
    'hotels.filter_category': 'Kategorie',
    'hotels.filter_destination': 'Reiseziel',
    'hotels.filter_price': 'Preisklasse',
    'hotels.filter_amenities': 'Ausstattung',
    'hotels.sort_name': 'Name',
    'hotels.sort_price': 'Preis',
    'hotels.sort_rating': 'Bewertung',
    'hotels.no_results': 'Keine Hotels gefunden, die Ihren Kriterien entsprechen',
    
    // Hotel Detail
    'hotel.details': 'Hoteldetails',
    'hotel.amenities': 'Ausstattung',
    'hotel.location': 'Lage',
    'hotel.rooms': 'Zimmer',
    'hotel.dining': 'Gastronomie',
    'hotel.reviews': 'Bewertungen',
    'hotel.availability': 'Verfügbarkeit Prüfen',
    'hotel.book': 'Dieses Hotel Buchen',
    
    // Destinations
    'destinations.title': 'Reiseziele',
    'destinations.subtitle': 'Entdecken Sie unsere kuratierten Reiseziele',
    'destinations.featured': 'Empfohlene Reiseziele',
    'destinations.popular': 'Beliebte Reiseziele',
    'destinations.upcoming': 'Kommende Reiseziele',
    
    // Formular-Validierung
    'validation.required': 'Dieses Feld ist erforderlich',
    'validation.email': 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
    'validation.minLength': 'Muss mindestens {{min}} Zeichen lang sein',
    'validation.maxLength': 'Darf {{max}} Zeichen nicht überschreiten',
    
    // Kontaktformular
    'contact.title': 'Kontaktieren Sie Uns',
    'contact.subtitle': 'Wir freuen uns von Ihnen zu hören',
    'contact.name': 'Ihr Name',
    'contact.email': 'E-Mail-Adresse',
    'contact.message': 'Nachricht',
    'contact.submit': 'Nachricht Senden',
    'contact.success': 'Ihre Nachricht wurde erfolgreich gesendet',
    'contact.error': 'Beim Senden Ihrer Nachricht ist ein Fehler aufgetreten',
    
    // Fehlermeldungen
    'error.notFound': 'Seite nicht gefunden',
    'error.serverError': 'Serverfehler',
    'error.network': 'Netzwerkfehler',
    'error.unauthorized': 'Unbefugter Zugriff',
    'error.loading': 'Fehler beim Laden der Daten',
    
    // Footer
    'footer.copyright': 'Copyright © {{year}} CinCin Hotels. Alle Rechte vorbehalten.',
    'footer.privacy': 'Datenschutzrichtlinie',
    'footer.terms': 'Nutzungsbedingungen',
    'footer.contact': 'Kontakt',
    'footer.sitemap': 'Seitenübersicht',
    'footer.newsletter': 'Abonnieren Sie unseren Newsletter',
    'footer.newsletter_button': 'Abonnieren',
  }
};