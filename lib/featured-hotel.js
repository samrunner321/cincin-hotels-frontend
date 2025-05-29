const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

export async function fetchFeaturedHotel(locale = 'en') {
  try {
    // First check if there's a specific featured hotel set in site settings
    let hotel = null;
    
    try {
      const settingsResponse = await fetch(
        `${DIRECTUS_URL}/items/site_settings?fields=featured_hotel.*,featured_hotel.translations.*,featured_hotel.gallery.directus_files_id.*`,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_PAGE ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_PAGE) : 3600 }
        }
      );
      
      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json();
        if (settingsData.data && settingsData.data.featured_hotel) {
          hotel = settingsData.data.featured_hotel;
          console.log('Using featured hotel from site settings:', hotel.name);
        }
      }
    } catch (err) {
      console.log('Site settings not available, falling back to featured flag');
    }
    
    // If no hotel in settings, fall back to featured flag
    if (!hotel) {
      const response = await fetch(
        `${DIRECTUS_URL}/items/hotels?` + 
        `filter[featured][_eq]=true&` +
        `limit=1&` +
        `fields=id,name,slug,location,region,list_image,hero_image,featured,` +
        `translations.*,` +
        `gallery.directus_files_id.*`,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_HOTEL ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_HOTEL) : 300 }
        }
      );

      if (!response.ok) {
        console.error('Failed to fetch featured hotel:', response.statusText);
        return null;
      }

      const data = await response.json();
      
      if (!data.data || data.data.length === 0) {
        console.log('No featured hotel found');
        return null;
      }

      hotel = data.data[0];
    }
    
    // Get the correct translation
    const translation = hotel.translations?.find(t => t.languages_code === locale || t.language_code === locale) || 
                       hotel.translations?.find(t => t.languages_code === 'en' || t.language_code === 'en') ||
                       hotel.translations?.[0];
    
    // Format gallery images
    const galleryImages = hotel.gallery?.map(g => {
      if (g.directus_files_id && typeof g.directus_files_id === 'object' && g.directus_files_id.id) {
        return `${DIRECTUS_URL}/assets/${g.directus_files_id.id}`;
      } else if (g.directus_files_id && typeof g.directus_files_id === 'string') {
        return `${DIRECTUS_URL}/assets/${g.directus_files_id}`;
      } else if (g.id) {
        return `${DIRECTUS_URL}/assets/${g.id}`;
      }
      return null;
    }).filter(Boolean).slice(0, 3); // Take first 3 images
    
    // Add main image if no gallery images
    if (galleryImages.length === 0) {
      if (hotel.hero_image) {
        galleryImages.push(`${DIRECTUS_URL}/assets/${hotel.hero_image}`);
      } else if (hotel.list_image) {
        galleryImages.push(`${DIRECTUS_URL}/assets/${hotel.list_image}`);
      }
    }
    
    // Format location - simpler approach without destination lookup
    const location = [hotel.location, hotel.region].filter(Boolean).join(', ');

    return {
      id: hotel.id,
      name: translation?.name || hotel.name,
      slug: translation?.slug || hotel.slug,
      location: location,
      description: translation?.description || '',
      shortDescription: translation?.short_description || '',
      images: galleryImages.length > 0 ? galleryImages : [
        '/images/hotel-1.jpg',
        '/images/hotel-2.jpg',
        '/images/hotel-3.jpg'
      ],
      tag: locale === 'de' ? 'Neu im Club' : 'New to the Club',
      featured: hotel.featured
    };

  } catch (error) {
    console.error('Error fetching featured hotel:', error);
    return null;
  }
}