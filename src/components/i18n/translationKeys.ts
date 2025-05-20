/**
 * Type-safe translation key definitions
 * 
 * This file provides TypeScript interfaces for translation keys
 * to ensure type safety when using translation functions.
 */

/**
 * Common translation keys used across the application
 */
export interface CommonTranslationKeys {
  // General
  'welcome': string;
  'explore': string;
  'book_now': string;
  'view_details': string;
  'loading': string;
  'error': string;
  'success': string;
  'close': string;
  'back': string;
  'next': string;
  'previous': string;
  'more': string;
  'less': string;
  'read_more': string;
  'see_all': string;
  'show_more': string;
  'hide': string;

  // Actions
  'save': string;
  'cancel': string;
  'confirm': string;
  'delete': string;
  'edit': string;
  'create': string;
  'update': string;
  'submit': string;
  'search': string;
  'filter': string;
  'clear': string;
  'reset': string;
  'apply': string;
  'select': string;
  'select_all': string;
  'deselect_all': string;

  // Status
  'loading_data': string;
  'no_results': string;
  'error_occurred': string;
  'try_again': string;
  'successfully_saved': string;
  'successfully_updated': string;
  'successfully_deleted': string;
  'successfully_created': string;
}

/**
 * UI related translation keys for components
 */
export interface UITranslationKeys {
  // Navigation
  'nav.toggle': string;
  'nav.expand': string;
  'nav.collapse': string;
  'nav.skip_to_content': string;

  // Tables
  'table.no_data': string;
  'table.loading': string;
  'table.error': string;
  'table.filter': string;
  'table.filter_placeholder': string;
  'table.column_sort': string;
  'table.items_per_page': string;
  'table.next_page': string;
  'table.previous_page': string;
  'table.first_page': string;
  'table.last_page': string;
  'table.showing_items': string;
  'table.select_row': string;

  // Modals
  'modal.close': string;
  'modal.confirm': string;
  'modal.cancel': string;

  // Tabs
  'tabs.more': string;
  'tabs.scroll_left': string;
  'tabs.scroll_right': string;

  // Pagination
  'pagination.prev': string;
  'pagination.next': string;
  'pagination.first': string;
  'pagination.last': string;
  'pagination.page': string;
  'pagination.of': string;

  // Buttons
  'button.loading': string;
  'button.disabled': string;

  // Filters
  'filter.clear': string;
  'filter.apply': string;
  'filter.reset': string;
  'filter.show': string;
  'filter.hide': string;
  'filter.active_filters': string;
  'filter.select_all': string;
  'filter.search': string;
}

/**
 * Form related translation keys
 */
export interface FormTranslationKeys {
  // Labels
  'field.required': string;
  'field.optional': string;
  'field.email': string;
  'field.password': string;
  'field.name': string;
  'field.first_name': string;
  'field.last_name': string;
  'field.address': string;
  'field.city': string;
  'field.country': string;
  'field.postal_code': string;
  'field.phone': string;
  'field.message': string;
  'field.subject': string;
  'field.date': string;
  'field.time': string;
  'field.search': string;

  // Validation
  'validation.required': string;
  'validation.email': string;
  'validation.min_length': string;
  'validation.max_length': string;
  'validation.password_mismatch': string;
  'validation.invalid_format': string;
  'validation.invalid_date': string;
  'validation.invalid_number': string;
  'validation.min_value': string;
  'validation.max_value': string;

  // Form actions
  'form.submit': string;
  'form.reset': string;
  'form.submitting': string;
  'form.success': string;
  'form.error': string;
}

/**
 * Navigation related translation keys
 */
export interface NavigationTranslationKeys {
  'home': string;
  'hotels': string;
  'destinations': string;
  'about': string;
  'contact': string;
  'login': string;
  'logout': string;
  'register': string;
  'profile': string;
  'settings': string;
  'language': string;
  'dark_mode': string;
  'light_mode': string;
  'menu': string;
}

/**
 * Error related translation keys
 */
export interface ErrorTranslationKeys {
  'general': string;
  'not_found': string;
  'server_error': string;
  'network_error': string;
  'timeout': string;
  'unauthorized': string;
  'forbidden': string;
  'validation_failed': string;
  'form_error': string;
  'api_error': string;
  'reload_page': string;
  'contact_support': string;
}

/**
 * Page related translation keys
 */
export interface PageTranslationKeys {
  // Home page
  'home.hero_title': string;
  'home.hero_subtitle': string;
  'home.featured_hotels': string;
  'home.popular_destinations': string;
  'home.special_offers': string;
  'home.newsletter_title': string;
  'home.newsletter_subtitle': string;

  // Hotels page
  'hotels.title': string;
  'hotels.subtitle': string;
  'hotels.filter_by_category': string;
  'hotels.filter_by_location': string;
  'hotels.sort_by': string;
  'hotels.view_mode': string;

  // Destinations page
  'destinations.title': string;
  'destinations.subtitle': string;
  'destinations.discover': string;
  'destinations.featured': string;

  // About page
  'about.title': string;
  'about.subtitle': string;
  'about.our_story': string;
  'about.our_mission': string;
  'about.our_values': string;
  'about.our_team': string;

  // Contact page
  'contact.title': string;
  'contact.subtitle': string;
  'contact.form_title': string;
  'contact.address': string;
  'contact.phone': string;
  'contact.email': string;
  'contact.submitted': string;
  'contact.error': string;
}

/**
 * Hotel related translation keys
 */
export interface HotelTranslationKeys {
  'name': string;
  'description': string;
  'location': string;
  'amenities': string;
  'rooms': string;
  'price': string;
  'from': string;
  'per_night': string;
  'book_now': string;
  'availability': string;
  'rating': string;
  'reviews': string;
  'address': string;
  'check_in': string;
  'check_out': string;
  'gallery': string;
  'features': string;
  'nearby': string;
  'similar_hotels': string;
}

/**
 * All translation keys combined
 */
export interface TranslationKeys {
  common: CommonTranslationKeys;
  ui: UITranslationKeys;
  form: FormTranslationKeys;
  navigation: NavigationTranslationKeys;
  error: ErrorTranslationKeys;
  page: PageTranslationKeys;
  hotel: HotelTranslationKeys;
}

/**
 * Generate a fully-qualified translation key type that enforces correct namespace prefix
 */
export type FQTranslationKey = 
  | `common.${keyof CommonTranslationKeys}`
  | `ui.${keyof UITranslationKeys}`
  | `form.${keyof FormTranslationKeys}`
  | `navigation.${keyof NavigationTranslationKeys}`
  | `error.${keyof ErrorTranslationKeys}`
  | `page.${keyof PageTranslationKeys}`
  | `hotel.${keyof HotelTranslationKeys}`;

/**
 * Type for selecting a specific namespace for use with typed hooks
 */
export type TranslationNamespace = keyof TranslationKeys;