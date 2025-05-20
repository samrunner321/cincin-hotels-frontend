/**
 * Type definitions for SEO components
 */
import { Metadata } from 'next';

/**
 * OpenGraph metadata types
 */
export interface OpenGraphMetadata {
  title?: string;
  description?: string;
  type?: string;
  url?: string;
  images?: OpenGraphImage[];
  siteName?: string;
  locale?: string;
}

export interface OpenGraphImage {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
}

/**
 * Twitter Card metadata types
 */
export interface TwitterMetadata {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  site?: string;
  creator?: string;
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
}

/**
 * Page metadata with extended properties
 */
export interface ExtendedMetadata extends Metadata {
  openGraph?: OpenGraphMetadata;
  twitter?: TwitterMetadata;
  canonical?: string;
  metaRobots?: string;
  structuredData?: Record<string, any> | Record<string, any>[];
}

/**
 * JSON-LD structured data type for Hotel
 */
export interface HotelJsonLd {
  '@context': 'https://schema.org';
  '@type': 'Hotel';
  name: string;
  description?: string;
  url?: string;
  image?: string | string[];
  priceRange?: string;
  address?: {
    '@type': 'PostalAddress';
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  geo?: {
    '@type': 'GeoCoordinates';
    latitude: number;
    longitude: number;
  };
  telephone?: string;
  starRating?: {
    '@type': 'Rating';
    ratingValue: number;
  };
  amenityFeature?: Array<{
    '@type': 'LocationFeatureSpecification';
    name: string;
    value?: boolean;
  }>;
}

/**
 * JSON-LD structured data type for Destination
 */
export interface DestinationJsonLd {
  '@context': 'https://schema.org';
  '@type': 'TouristAttraction' | 'TouristDestination' | 'Place';
  name: string;
  description?: string;
  url?: string;
  image?: string | string[];
  address?: {
    '@type': 'PostalAddress';
    addressLocality?: string;
    addressRegion?: string;
    addressCountry?: string;
  };
  geo?: {
    '@type': 'GeoCoordinates';
    latitude: number;
    longitude: number;
  };
  touristType?: string[];
}

/**
 * JSON-LD structured data type for Organization
 */
export interface OrganizationJsonLd {
  '@context': 'https://schema.org';
  '@type': 'Organization' | 'Brand' | 'Corporation';
  name: string;
  description?: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
  contactPoint?: Array<{
    '@type': 'ContactPoint';
    telephone: string;
    contactType: string;
    email?: string;
    availableLanguage?: string[];
  }>;
}

/**
 * JSON-LD structured data type for BreadcrumbList
 */
export interface BreadcrumbListJsonLd {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }>;
}

/**
 * Props for SEO component that manages all metadata
 */
export interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
  openGraph?: OpenGraphMetadata;
  twitter?: TwitterMetadata;
  noindex?: boolean;
  nofollow?: boolean;
  structuredData?: HotelJsonLd | DestinationJsonLd | OrganizationJsonLd | BreadcrumbListJsonLd | (HotelJsonLd | DestinationJsonLd | OrganizationJsonLd | BreadcrumbListJsonLd)[];
}

/**
 * Props for JsonLd component that renders structured data
 */
export interface JsonLdProps {
  data: HotelJsonLd | DestinationJsonLd | OrganizationJsonLd | BreadcrumbListJsonLd | (HotelJsonLd | DestinationJsonLd | OrganizationJsonLd | BreadcrumbListJsonLd)[];
}