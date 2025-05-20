/**
 * Type definitions for page components
 */
import { Metadata } from 'next';
import { Hotel, Destination, Category, Room } from '../lib/directus';
import { ReactNode } from 'react';

/**
 * Base Page Props for all pages
 */
export interface BasePageProps {
  params?: Record<string, string>;
  searchParams?: Record<string, string | string[] | undefined>;
}

/**
 * Metadata Types
 */
export interface PageMetadata extends Metadata {
  openGraph?: {
    title?: string;
    description?: string;
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }>;
    type?: string;
  };
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
    images?: string | string[];
  };
}

/**
 * Home Page Types
 */
export interface HomePageProps extends BasePageProps {}

export interface FeaturedHotelProps {
  tag?: string;
  name: string;
  location: string;
  description: string;
  slug: string;
  images: string[];
}

export interface CategoryItemProps {
  name: string;
  image: string;
  slug: string;
}

/**
 * Hotels List Page Types
 */
export interface HotelsPageProps extends BasePageProps {
  category?: string;
  region?: string;
  priceMin?: string;
  priceMax?: string;
  features?: string;
}

export interface HotelsHeroProps {
  description?: string;
  backgroundImage?: string;
}

/**
 * Hotel Detail Page Types
 */
export interface HotelDetailPageProps {
  hotel: Hotel;
}

export interface DetailHeroBannerProps {
  hotelName: string;
  location?: string;
  description?: string;
  backgroundImage: string;
  slug: string;
  isRoomsPage?: boolean;
}

export interface ContentTabsProps {
  hotelSlug: string;
}

export interface OverviewSectionProps {
  hotelDescription?: string;
  overviewImage?: string;
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface HotelGallerySectionProps {
  images: string[];
}

export interface PageRoomListProps {
  rooms: Room[];
  fullPage?: boolean;
}

export interface PageRoomCardProps {
  room: Room;
}

export interface OriginalsProps {
  name: string;
  description: string;
  image: string;
}

/**
 * Destinations Page Types
 */
export interface DestinationsPageProps extends BasePageProps {}

export interface DestinationsHeroProps {}

export interface FeaturedDestinationProps {
  destination?: {
    name: string;
    country: string;
    description: string;
    image: string;
    url: string;
  };
}

export interface DestinationExplorerProps {
  destinations?: Array<{
    id: string;
    name: string;
    country: string;
    description: string;
    image: string;
    slug: string;
  }>;
}

export interface DestinationInteractiveFeaturesProps {}

export interface PopularHotelsProps {
  hotels?: Array<{
    id: string;
    name: string;
    image: string;
    url: string;
  }>;
}

/**
 * Destination Detail Page Types
 */
export interface DestinationDetailPageProps {
  destination: Destination & { hotels: Hotel[] };
}

export interface DestinationHeroProps {
  title: string;
  description: string;
  backgroundImage: string;
  country?: string;
}

export interface DestinationContentTabsProps {
  destinationSlug: string;
}

export interface DestinationHotelsProps {
  hotels: Hotel[];
}

export interface ActivitiesSectionProps {
  activities: Array<{
    title: string;
    description?: string;
    season: 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
    image?: string;
  }>;
}

export interface DiningSectionProps {
  dining: Array<{
    name: string;
    description?: string;
    cuisine?: string;
    price_range?: '$' | '$$' | '$$$' | '$$$$';
    address?: string;
    image?: string;
  }>;
  signature_dishes?: Array<{
    name: string;
    description?: string;
    restaurant?: string;
    image?: string;
  }>;
  chef_spotlight?: Array<{
    name: string;
    restaurant?: string;
    description?: string;
    image?: string;
  }>;
}

/**
 * Common Page Section Types
 */
export interface HeroSectionProps {
  title?: string;
  description?: string;
  backgroundImage?: string;
  buttons?: Array<{
    text: string;
    href: string;
    primary?: boolean;
  }>;
}

export interface NewsletterSignupProps {
  title?: string;
  description?: string;
}

export interface CallToActionProps {
  title: string;
  description?: string;
  buttons: Array<{
    text: string;
    href: string;
    primary?: boolean;
  }>;
  backgroundColor?: string;
}

/**
 * Client Provider Props
 */
export interface ClientProviderProps {
  children: ReactNode;
  initialLanguage?: string;
}

/**
 * SEO Component Types
 */
export interface PageSEOProps {
  title: string;
  description?: string;
  openGraph?: {
    title?: string;
    description?: string;
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }>;
    type?: string;
  };
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
    images?: string | string[];
  };
  canonicalUrl?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export interface PageJsonLdProps {
  type: 'Hotel' | 'Restaurant' | 'TouristAttraction' | 'Organization' | 'WebSite' | 'BreadcrumbList';
  data: Record<string, any>;
}

/**
 * App Router specific Types
 */
export interface AppLayoutProps {
  children: ReactNode;
}

export interface RouteProps extends BasePageProps {}

export interface GenerateMetadataProps extends BasePageProps {
  parent?: Metadata;
}