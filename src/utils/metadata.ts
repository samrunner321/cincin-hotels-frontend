/**
 * Utilities for generating metadata for Next.js App Router pages
 */
import { Metadata } from 'next';
import { ExtendedMetadata } from '../types/seo';

/**
 * Default site metadata
 */
export const DEFAULT_SITE_NAME = 'CinCin Hotels';
export const DEFAULT_DESCRIPTION = 'Discover a curated collection of unique accommodations, renowned for timeless design and warm, personalized hospitality.';
export const DEFAULT_OG_IMAGE = '/images/og-default.jpg';
export const DEFAULT_TWITTER_HANDLE = '@cincinhotels';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cincinhotels.com';

/**
 * Generate base metadata for the site
 */
export function getBaseMetadata(): Metadata {
  return {
    title: {
      template: `%s | ${DEFAULT_SITE_NAME}`,
      default: DEFAULT_SITE_NAME,
    },
    description: DEFAULT_DESCRIPTION,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: 'website',
      siteName: DEFAULT_SITE_NAME,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: DEFAULT_SITE_NAME,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: DEFAULT_TWITTER_HANDLE,
    },
  };
}

/**
 * Generate metadata for a page
 */
export function generateMetadata(metadata: ExtendedMetadata): Metadata {
  const baseMetadata = getBaseMetadata();
  
  // Combine metadata with base metadata
  const combinedMetadata: Metadata = {
    ...baseMetadata,
    ...metadata,
    // For nested properties, merge them instead of overriding
    openGraph: {
      ...baseMetadata.openGraph,
      ...metadata.openGraph,
      // For images, replace only if provided
      images: metadata.openGraph?.images || baseMetadata.openGraph?.images,
    },
    twitter: {
      ...baseMetadata.twitter,
      ...metadata.twitter,
    },
  };
  
  // Handle canonical URL
  if (metadata.canonical) {
    combinedMetadata.alternates = {
      ...combinedMetadata.alternates,
      canonical: metadata.canonical,
    };
  }
  
  // Handle robots meta
  if (metadata.metaRobots) {
    const [index, follow] = metadata.metaRobots.split(', ');
    combinedMetadata.robots = {
      index: index === 'index',
      follow: follow === 'follow',
    };
  }
  
  return combinedMetadata;
}

/**
 * Generate metadata for a hotel page
 */
export function generateHotelMetadata(hotel: {
  name: string;
  description?: string;
  location?: string;
  main_image?: string;
  slug: string;
}): Metadata {
  const title = `${hotel.name} | ${hotel.location || ''}`;
  const description = hotel.description || `Experience the unique charm of ${hotel.name} in ${hotel.location || 'a stunning location'}.`;
  const image = hotel.main_image || DEFAULT_OG_IMAGE;
  const url = `${SITE_URL}/hotels/${hotel.slug}`;
  
  return generateMetadata({
    title,
    description,
    canonical: url,
    openGraph: {
      title,
      description,
      type: 'website',
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: hotel.name,
        },
      ],
    },
    twitter: {
      title,
      description,
    },
  });
}

/**
 * Generate metadata for a destination page
 */
export function generateDestinationMetadata(destination: {
  name: string;
  description?: string;
  country?: string;
  main_image?: string;
  slug: string;
}): Metadata {
  const title = `${destination.name}, ${destination.country || ''}`;
  const description = destination.description || `Discover the beauty of ${destination.name} and its exceptional accommodations.`;
  const image = destination.main_image || DEFAULT_OG_IMAGE;
  const url = `${SITE_URL}/destinations/${destination.slug}`;
  
  return generateMetadata({
    title,
    description,
    canonical: url,
    openGraph: {
      title,
      description,
      type: 'website',
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: destination.name,
        },
      ],
    },
    twitter: {
      title,
      description,
    },
  });
}