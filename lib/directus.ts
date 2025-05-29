// Directus client configuration
const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

export interface DirectusHotel {
  id: number;
  location: string;
  region: string;
  main_image: string;
  price_from: number;
  currency: string;
  status: string;
  is_new: boolean | null;
  is_featured: boolean;
  translations: DirectusTranslation[];
  gallery: any[];
  categories: any[];
  destinations: any[];
  rooms: any[];
}

export interface DirectusTranslation {
  id: number;
  hotels_id: number;
  languages_code: string;
  name: string;
  slug: string | null;
  short_description: string;
  description: string;
  amenities: string[];
  features: any[];
}

export async function fetchHotelBySlug(slug: string): Promise<DirectusHotel | null> {
  try {
    const response = await fetch(
      `${DIRECTUS_URL}/items/hotels?fields=*,translations.*,gallery.directus_files_id.*,categories.*,destinations.*,rooms.*&filter[translations][slug][_eq]=${slug}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_HOTEL ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_HOTEL) : 300 }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch hotel: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      return null;
    }

    return data.data[0];
  } catch (error) {
    console.error('Error fetching hotel from Directus:', error);
    return null;
  }
}

export async function fetchAllHotels(): Promise<DirectusHotel[]> {
  try {
    const response = await fetch(
      `${DIRECTUS_URL}/items/hotels?fields=*,translations.*&filter[status][_eq]=Published`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_HOTEL ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_HOTEL) : 300 }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch hotels: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching hotels from Directus:', error);
    return [];
  }
}

export interface SiteSettings {
  id: number;
  homepage_hero_image: string | null;
}

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  try {
    const response = await fetch(
      `${DIRECTUS_URL}/items/site_settings?fields=*`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_PAGE ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_PAGE) : 3600 }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch site settings: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      return null;
    }

    return data.data[0];
  } catch (error) {
    console.error('Error fetching site settings from Directus:', error);
    return null;
  }
}

export function getImageUrl(imageId: string): string {
  return `${DIRECTUS_URL}/assets/${imageId}`;
}