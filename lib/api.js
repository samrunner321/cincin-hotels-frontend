/**
 * API functions for fetching data
 * In a real implementation, these would connect to your API/CMS.
 * For now, they import mock data from the data directory.
 */

import { hotels } from '../data/hotels';
import { destinations } from '../data/destinations';
import { categories } from '../data/categories';
import { journalArticles } from '../data/journal';

// Cache constants
const REVALIDATE_TIME = 3600; // 1 hour in seconds

/**
 * Hotel-related API functions
 */
export async function getAllHotels(locale = 'de') {
  console.log('[getAllHotels] Starting fetch with locale:', locale);
  
  try {
    const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
    console.log('[getAllHotels] Directus URL:', DIRECTUS_URL);
    
    const response = await fetch(
      `${DIRECTUS_URL}/items/hotels?fields=*`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_HOTEL ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_HOTEL) : 300 }
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch hotels: ${response.statusText}`);
      // Fallback to mock data if Directus is not available
      return {
        data: hotels,
        meta: {
          total: hotels.length
        }
      };
    }

    const data = await response.json();
    console.log('[getAllHotels] Fetched hotels count:', data.data?.length || 0);
    
    // Fetch amenities for all hotels
    let hotelAmenities = [];
    try {
      const amenitiesUrl = `${DIRECTUS_URL}/items/hotels_amenities?fields=*,hotel_amenities_id.*`;
      console.log('[getAllHotels] Fetching amenities from:', amenitiesUrl);
      
      const amenitiesResponse = await fetch(
        amenitiesUrl,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_HOTEL ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_HOTEL) : 300 }
        }
      );
      
      if (amenitiesResponse.ok) {
        const amenitiesData = await amenitiesResponse.json();
        hotelAmenities = amenitiesData.data || [];
        console.log('[getAllHotels] Fetched hotel amenities count:', hotelAmenities.length);
      }
    } catch (e) {
      console.error('Failed to fetch hotel amenities:', e);
    }

    // Fetch all translations for the given locale
    let translations = [];
    try {
      const translationsUrl = `${DIRECTUS_URL}/items/hotel_translations?filter[language_code][_eq]=${locale}`;
      console.log('[getAllHotels] Fetching translations from:', translationsUrl);
      
      const translationsResponse = await fetch(
        translationsUrl,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_TRANSLATIONS ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_TRANSLATIONS) : 86400 }
        }
      );
      
      console.log('[getAllHotels] Translations response status:', translationsResponse.status);
      
      if (translationsResponse.ok) {
        const translationsData = await translationsResponse.json();
        translations = translationsData.data || [];
        console.log('[getAllHotels] Fetched translations count:', translations.length);
        
        // Log sample translation for debugging
        if (translations.length > 0) {
          console.log('[getAllHotels] Sample translation:', JSON.stringify(translations[0], null, 2));
        }
      } else {
        console.error('[getAllHotels] Translation fetch error:', translationsResponse.statusText);
      }
    } catch (e) {
      console.error('Failed to fetch hotel translations:', e);
    }
    
    // Filter only published hotels and transform Directus data to match the expected format
    const transformedHotels = (data.data || [])
      .filter(hotel => hotel.status === 'published')
      .map(hotel => {
      // Find translation for this hotel
      // Convert both to string for comparison since Directus might store IDs as strings
      const translation = translations.find(t => String(t.hotel_id) === String(hotel.id));
      
      // Debug log for each hotel
      console.log(`[getAllHotels] Processing hotel ${hotel.id} (${hotel.name})`);
      console.log(`[getAllHotels] Found translation:`, translation ? 'Yes' : 'No');
      if (translation) {
        console.log(`[getAllHotels] Translation details:`, {
          name: translation.name,
          description: translation.description?.substring(0, 50) + '...',
          language_code: translation.language_code
        });
      }
      
      // Get amenities for this hotel from the junction table
      const hotelAmenitiesData = hotelAmenities
        .filter(ha => String(ha.hotels_id) === String(hotel.id))
        .map(ha => ha.hotel_amenities_id)
        .filter(amenity => amenity); // Filter out null/undefined amenities
      
      console.log(`[getAllHotels] Hotel ${hotel.id} has ${hotelAmenitiesData.length} amenities`);
      
      // Parse old amenities format as fallback if it's a JSON string
      let fallbackAmenities = [];
      try {
        fallbackAmenities = typeof hotel.amenities === 'string' 
          ? JSON.parse(hotel.amenities) 
          : hotel.amenities || [];
      } catch (e) {
        fallbackAmenities = [];
      }
      
      // Use new amenities if available, otherwise use fallback
      const amenities = hotelAmenitiesData.length > 0 ? hotelAmenitiesData : fallbackAmenities;
      
      const transformedHotel = {
        id: hotel.id,
        name: translation?.name || hotel.name,
        slug: hotel.slug,
        description: translation?.description || hotel.description,
        location: hotel.location,
        region: hotel.region,
        categories: amenities, // Use amenities as categories for now
        price: {
          amount: hotel.price_from,
          currency: '€',
          period: 'per night'
        },
        stars: hotel.stars,
        rating: hotel.rating || 4.5,
        reviews: hotel.review_count || 0,
        featured: hotel.featured,
        image: hotel.list_image ? `${DIRECTUS_URL}/assets/${hotel.list_image}` : '/images/hotels/hotel-1.jpg',
        images: hotel.hero_image ? [`${DIRECTUS_URL}/assets/${hotel.hero_image}`] : ['/images/hotels/hotel-1.jpg'],
        amenities: amenities
      };
      
      // Log the final transformed hotel name to verify translation was applied
      console.log(`[getAllHotels] Final hotel name: ${transformedHotel.name}`);
      
      return transformedHotel;
    });
    
    return {
      data: transformedHotels,
      meta: {
        total: transformedHotels.length
      }
    };
  } catch (error) {
    console.error('Error fetching hotels from Directus:', error);
    // Fallback to mock data if there's an error
    return {
      data: hotels,
      meta: {
        total: hotels.length
      }
    };
  }
}

export async function getHotelBySlug(slug) {
  try {
    const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
    
    // Fetch hotel first with amenities
    const hotelResponse = await fetch(
      `${DIRECTUS_URL}/items/hotels?fields=*,amenities.hotel_amenities_id.*,amenities.hotel_amenities_id.translations.*&filter[slug][_eq]=${slug}&filter[status][_eq]=published`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_HOTEL ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_HOTEL) : 300 }
      }
    );

    if (!hotelResponse.ok) {
      console.error(`Failed to fetch hotel: ${hotelResponse.statusText}`);
      // Fallback to mock data
      const hotel = hotels.find(h => h.slug === slug);
      if (!hotel) return null;
      
      return createEnhancedHotel(hotel, DIRECTUS_URL);
    }

    const hotelData = await hotelResponse.json();
    
    if (!hotelData.data || hotelData.data.length === 0) {
      // Fallback to mock data
      const hotel = hotels.find(h => h.slug === slug);
      if (!hotel) return null;
      
      return createEnhancedHotel(hotel, DIRECTUS_URL);
    }

    const hotel = hotelData.data[0];
    
    // Fetch translations separately
    const translationsResponse = await fetch(
      `${DIRECTUS_URL}/items/hotel_translations?filter[hotel_id][_eq]=${hotel.id}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_TRANSLATIONS ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_TRANSLATIONS) : 86400 }
      }
    );

    let translations = [];
    if (translationsResponse.ok) {
      const translationsData = await translationsResponse.json();
      translations = translationsData.data || [];
    }
    
    
    // Parse amenities if it's a JSON string
    let amenities = [];
    try {
      amenities = typeof hotel.amenities === 'string' 
        ? JSON.parse(hotel.amenities) 
        : hotel.amenities || [];
    } catch (e) {
      amenities = [];
    }

    // Transform Directus hotel data
    const transformedHotel = {
      id: hotel.id,
      name: hotel.name,
      slug: hotel.slug,
      description: hotel.description,
      location: hotel.location,
      region: hotel.region,
      categories: amenities,
      price: {
        amount: hotel.price_from,
        currency: '€',
        period: 'per night'
      },
      stars: hotel.stars,
      rating: hotel.rating || 4.5,
      reviews: hotel.review_count || 0,
      featured: hotel.featured,
      image: hotel.list_image ? `${DIRECTUS_URL}/assets/${hotel.list_image}` : '/images/hotels/hotel-1.jpg',
      images: hotel.hero_image ? [`${DIRECTUS_URL}/assets/${hotel.hero_image}`] : ['/images/hotels/hotel-1.jpg'],
      amenities: amenities,
      translations: translations
    };

    return createEnhancedHotel(transformedHotel, DIRECTUS_URL);
    
  } catch (error) {
    console.error('Error fetching hotel from Directus:', error);
    // Fallback to mock data
    const hotel = hotels.find(h => h.slug === slug);
    if (!hotel) return null;
    
    return createEnhancedHotel(hotel, process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055');
  }
}

function createEnhancedHotel(hotel, DIRECTUS_URL) {
  // Add additional fields for the detail page
  const enhancedHotel = {
    ...hotel,
    gallery: hotel.images || [],
    rooms: [
      {
        id: 1,
        name: "Deluxe Mountain View Room",
        size: "30m²",
        persons: 2,
        description: "Elegant room with panoramic mountain views, featuring a plush king-size bed and luxurious bathroom.",
        price: "€350",
        image: "/images/hotels/hotel-3.jpg"
      },
      {
        id: 2,
        name: "Junior Suite",
        size: "45m²",
        persons: 3,
        description: "Spacious suite with separate sitting area, king-sized bed, and premium amenities.",
        price: "€480",
        image: "/images/hotels/hotel-4.jpg"
      },
      {
        id: 3,
        name: "Panorama Suite",
        size: "65m²",
        persons: 4,
        description: "Luxury suite with 180° mountain views, featuring a bedroom, separate living room, and private balcony.",
        price: "€620",
        image: "/images/hotels/hotel-5.jpg"
      }
    ],
    features: [
      {
        icon: "mountains",
        title: hotel.categories.includes("Mountains") ? "Mountains" : (hotel.categories.includes("Beach") ? "Beach" : "Location"),
        description: `Located in ${hotel.location}, offering stunning views and exceptional experiences.`
      },
      {
        icon: "spa",
        title: "Wellness",
        description: "Luxurious spa facilities with various treatments and relaxation areas."
      },
      {
        icon: "pool",
        title: "Pool",
        description: hotel.categories.includes("Beach") ? "Infinity pool overlooking the ocean." : "Heated indoor and outdoor pools."
      },
      {
        icon: "beach",
        title: "Dining",
        description: "Fine dining restaurant serving local and international cuisine."
      }
    ],
    owners: {
      name: "The Originals",
      description: `The visionaries behind ${hotel.name}, bringing together exceptional hospitality, design, and local culture.`,
      image: "/images/hotels/hotel-7.jpg"
    }
  };
  
  return {
    data: enhancedHotel,
    meta: {
      updatedAt: "2025-05-21T00:00:00.000Z"
    }
  };
}

export async function getHotelsByCategory(categorySlug) {
  // Find hotels by category
  const filteredHotels = hotels.filter(hotel => 
    hotel.categories.some(cat => 
      cat.toLowerCase().replace(/\s+/g, '-') === categorySlug
    )
  );
  
  return {
    data: filteredHotels,
    meta: {
      total: filteredHotels.length,
      category: categorySlug
    }
  };
}

/**
 * Destination-related API functions
 */
export async function getAllDestinations(locale = 'de') {
  console.log('[getAllDestinations] Starting fetch with locale:', locale);
  
  try {
    // Check if we're on the client side
    const isClient = typeof window !== 'undefined';
    
    if (isClient) {
      // Use API route to avoid CORS
      console.log('[getAllDestinations] Using API route (client-side)');
      const response = await fetch(`/api/destinations?locale=${locale}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch from API route');
      }
      
      return await response.json();
    }
    
    // Server-side: Direct Directus access
    const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
    console.log('[getAllDestinations] Directus URL:', DIRECTUS_URL);
    
    // Fetch destinations
    const fetchUrl = `${DIRECTUS_URL}/items/destinations?fields=*&filter[status][_eq]=published`;
    console.log('[getAllDestinations] Fetching from:', fetchUrl);
    
    const response = await fetch(
      fetchUrl,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_DESTINATION ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_DESTINATION) : 600 }
      }
    );

    console.log('[getAllDestinations] Response status:', response.status);

    if (!response.ok) {
      console.error('[getAllDestinations] Failed to fetch destinations from Directus, using fallback data');
      console.error('[getAllDestinations] Response:', response.statusText);
      return {
        data: destinations,
        meta: {
          total: destinations.length
        }
      };
    }

    const destinationsData = await response.json();
    const destinationsList = destinationsData.data || [];
    console.log('[getAllDestinations] Raw destinations count:', destinationsList.length);

    // Fetch translations for all destinations
    const translationsUrl = `${DIRECTUS_URL}/items/destinations_translations?filter[language_code][_eq]=${locale}`;
    console.log('[getAllDestinations] Fetching translations from:', translationsUrl);
    
    const translationsResponse = await fetch(
      translationsUrl,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_TRANSLATIONS ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_TRANSLATIONS) : 86400 }
      }
    );

    console.log('[getAllDestinations] Translations response status:', translationsResponse.status);

    let translations = [];
    if (translationsResponse.ok) {
      const translationsData = await translationsResponse.json();
      translations = translationsData.data || [];
      console.log('[getAllDestinations] Translations count:', translations.length);
      console.log('[getAllDestinations] Translations:', JSON.stringify(translations, null, 2));
    } else {
      console.error('[getAllDestinations] Failed to fetch translations:', translationsResponse.statusText);
    }

    // Merge destinations with their translations
    console.log('[getAllDestinations] Starting to merge destinations with translations...');
    const destinationsWithTranslations = destinationsList.map(destination => {
      console.log(`[getAllDestinations] Processing destination: ${destination.name} (ID: ${destination.id}, slug: ${destination.slug})`);
      const translation = translations.find(t => t.destination_id === destination.id);
      console.log(`[getAllDestinations] Translation found: ${translation ? 'Yes' : 'No'}`);
      
      // Image mapping for correct fallback images
      const imageMapping = {
        'mykonos': 'beach.jpg',
        'crans-montana': 'mountain.jpg',
        'south-tyrol': 'south-tyrol.jpg'
      };
      
      // Handle image field - it might be a file ID or null
      let imageUrl;
      if (destination.image && Array.isArray(destination.image) && destination.image.length > 0) {
        // If image is an array of file relations (many-to-many)
        imageUrl = `${DIRECTUS_URL}/assets/${destination.image[0].directus_files_id}`;
      } else if (destination.image && typeof destination.image === 'string') {
        // If image is a string (file ID)
        imageUrl = `${DIRECTUS_URL}/assets/${destination.image}`;
      } else {
        // Use mapped fallback
        const mappedImage = imageMapping[destination.slug] || `${destination.slug}.jpg`;
        imageUrl = `/images/destinations/${mappedImage}`;
      }
      
      let heroImageUrl;
      if (destination.hero_image) {
        heroImageUrl = `${DIRECTUS_URL}/assets/${destination.hero_image}`;
      } else {
        // Use same as regular image
        heroImageUrl = imageUrl;
      }
      
      const transformedDestination = {
        id: destination.id,
        slug: destination.slug,
        name: destination.name,
        image: imageUrl,
        hero_image: heroImageUrl,
        description: translation?.description || '',
        featured: destination.featured,
        latitude: destination.latitude,
        longitude: destination.longitude,
        status: destination.status
      };
      
      console.log(`[getAllDestinations] Transformed destination:`, JSON.stringify(transformedDestination, null, 2));
      
      return transformedDestination;
    });

    console.log('[getAllDestinations] Final destinations count:', destinationsWithTranslations.length);
    console.log('[getAllDestinations] Final destinations:', destinationsWithTranslations.map(d => ({ id: d.id, name: d.name, slug: d.slug })));

    return {
      data: destinationsWithTranslations,
      meta: {
        total: destinationsWithTranslations.length
      }
    };

  } catch (error) {
    console.error('Error fetching destinations:', error);
    return {
      data: destinations,
      meta: {
        total: destinations.length
      }
    };
  }
}

export async function getDestinationBySlug(slug, locale = 'de') {
  try {
    // Check if we're on the client side
    const isClient = typeof window !== 'undefined';
    
    if (isClient) {
      // Use API route to avoid CORS
      console.log('[getDestinationBySlug] Using API route (client-side)');
      const response = await fetch(`/api/destinations/${slug}?locale=${locale}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch from API route');
      }
      
      return await response.json();
    }
    
    // Server-side: Direct Directus access
    const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
    
    // Fetch destination with images, selected hotels and restaurants expanded
    const response = await fetch(
      `${DIRECTUS_URL}/items/destinations?fields=*,images.directus_files_id.*,selected_hotels.hotels_id.*,selected_restaurants.restaurants_id.*&filter[slug][_eq]=${slug}&filter[status][_eq]=published`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_DESTINATION ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_DESTINATION) : 600 }
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch destination from Directus, using fallback data');
      const destination = destinations.find(d => d.slug === slug);
      if (!destination) return null;
      
      const destinationHotels = hotels.filter(hotel => 
        hotel.region?.toLowerCase().replace(/\s+/g, '-') === slug
      );
      
      return {
        data: {
          ...destination,
          hotels: destinationHotels
        },
        meta: {
          hotelCount: destinationHotels.length
        }
      };
    }

    const destinationData = await response.json();
    const destination = destinationData.data?.[0];
    
    if (!destination) {
      const fallbackDestination = destinations.find(d => d.slug === slug);
      if (!fallbackDestination) return null;
      
      const destinationHotels = hotels.filter(hotel => 
        hotel.region?.toLowerCase().replace(/\s+/g, '-') === slug
      );
      
      return {
        data: {
          ...fallbackDestination,
          hotels: destinationHotels
        },
        meta: {
          hotelCount: destinationHotels.length
        }
      };
    }

    // Fetch translation for this destination
    const translationResponse = await fetch(
      `${DIRECTUS_URL}/items/destinations_translations?filter[destination_id][_eq]=${destination.id}&filter[language_code][_eq]=${locale}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_TRANSLATIONS ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_TRANSLATIONS) : 86400 }
      }
    );

    let translation = null;
    if (translationResponse.ok) {
      const translationData = await translationResponse.json();
      translation = translationData.data?.[0];
    }

    // Process selected hotels from the destination
    let destinationHotels = [];
    if (destination.selected_hotels && Array.isArray(destination.selected_hotels)) {
      destinationHotels = destination.selected_hotels.map(item => item.hotels_id).filter(Boolean);
    }
    
    // Process selected restaurants from the destination
    let destinationRestaurants = [];
    if (destination.selected_restaurants && Array.isArray(destination.selected_restaurants)) {
      destinationRestaurants = destination.selected_restaurants.map(item => {
        const restaurant = item.restaurants_id;
        if (restaurant && restaurant.image) {
          restaurant.image = `${DIRECTUS_URL}/assets/${restaurant.image}`;
        }
        return restaurant;
      }).filter(Boolean);
    }

    return {
      data: {
        id: destination.id,
        slug: destination.slug,
        name: destination.name,
        image: (() => {
          const imageMapping = {
            'mykonos': 'beach.jpg',
            'crans-montana': 'mountain.jpg',
            'south-tyrol': 'south-tyrol.jpg',
            'berchtesgaden': 'mountain.jpg'
          };
          
          if (destination.image && Array.isArray(destination.image) && destination.image.length > 0) {
            return `${DIRECTUS_URL}/assets/${destination.image[0].directus_files_id}`;
          } else if (destination.image && typeof destination.image === 'string') {
            return `${DIRECTUS_URL}/assets/${destination.image}`;
          } else {
            const mappedImage = imageMapping[destination.slug] || `${destination.slug}.jpg`;
            return `/images/destinations/${mappedImage}`;
          }
        })(),
        hero_image: destination.hero_image 
          ? `${DIRECTUS_URL}/assets/${destination.hero_image}`
          : (() => {
            const imageMapping = {
              'mykonos': 'beach.jpg',
              'crans-montana': 'mountain.jpg',
              'south-tyrol': 'south-tyrol.jpg',
              'berchtesgaden': 'mountain.jpg'
            };
            const mappedImage = imageMapping[destination.slug] || `${destination.slug}.jpg`;
            return `/images/destinations/${mappedImage}`;
          })(),
        description: translation?.description || '',
        overview_title: translation?.overview_title || 'Overview',
        overview_content: translation?.overview_content || '',
        hotels_title: translation?.hotels_title || 'Hotels',
        hotels_description: translation?.hotels_description || '',
        dining_title: translation?.dining_title || 'Dining',
        dining_description: translation?.dining_description || '',
        activities_title: translation?.activities_title || 'Activities',
        activities_description: translation?.activities_description || '',
        practical_info_title: translation?.practical_info_title || 'Practical Information',
        practical_info_content: translation?.practical_info_content || '',
        featured: destination.featured,
        latitude: destination.latitude,
        longitude: destination.longitude,
        show_explore_box: destination.show_explore_box || false,
        show_seasonal_box: destination.show_seasonal_box || false,
        explore_box_title: translation?.explore_box_title || '',
        explore_box_content: translation?.explore_box_content || '',
        seasonal_box_title: translation?.seasonal_box_title || '',
        seasonal_box_content: translation?.seasonal_box_content || '',
        images: (() => {
          // Process images array from destinations_files junction
          if (destination.images && Array.isArray(destination.images) && destination.images.length > 0) {
            return destination.images.map(img => {
              const fileId = img.directus_files_id?.id || img.directus_files_id || img.id || img;
              return `${DIRECTUS_URL}/assets/${fileId}`;
            });
          }
          return [];
        })(),
        hotels: destinationHotels,
        restaurants: destinationRestaurants
      },
      meta: {
        hotelCount: destinationHotels.length,
        restaurantCount: destinationRestaurants.length
      }
    };

  } catch (error) {
    console.error('Error fetching destination:', error);
    const destination = destinations.find(d => d.slug === slug);
    if (!destination) return null;
    
    const destinationHotels = hotels.filter(hotel => 
      hotel.region?.toLowerCase().replace(/\s+/g, '-') === slug
    );
    
    return {
      data: {
        ...destination,
        hotels: destinationHotels
      },
      meta: {
        hotelCount: destinationHotels.length
      }
    };
  }
}

/**
 * Category-related API functions
 */
export async function getAllCategories() {
  return {
    data: categories,
    meta: {
      total: categories.length
    }
  };
}

export async function getCategoryBySlug(slug) {
  const category = categories.find(c => c.slug === slug);
  
  if (!category) {
    return null;
  }
  
  // Use a consistent timestamp for server and client rendering
  return {
    data: category,
    meta: {
      updatedAt: "2025-05-21T00:00:00.000Z"
    }
  };
}

/**
 * Journal-related API functions
 */
export async function getAllJournalArticles() {
  return {
    data: journalArticles,
    meta: {
      total: journalArticles.length
    }
  };
}

export async function getRecentJournalArticles(limit = 3) {
  // Anstatt dynamischer Date-Objekte nutzen wir einen Stringvergleich,
  // um server- und clientseitig konsistente Ergebnisse zu erhalten
  const sortedArticles = [...journalArticles].sort((a, b) => 
    (b.date || '').localeCompare(a.date || '')
  ).slice(0, limit);
  
  return {
    data: sortedArticles,
    meta: {
      total: sortedArticles.length,
      // Konstanter Zeitstempel für stabile Hydration
      updatedAt: "2025-05-21T00:00:00.000Z"
    }
  };
}

export async function getJournalArticleBySlug(slug) {
  const article = journalArticles.find(a => a.slug === slug);
  
  if (!article) {
    return null;
  }
  
  // Find related articles by shared categories
  const relatedArticles = journalArticles
    .filter(a => a.slug !== slug && a.categories.some(cat => article.categories.includes(cat)))
    .slice(0, 3);
    
  // Process the article's relatedHotels array
  const processedRelatedHotels = article.relatedHotels && article.relatedHotels.length > 0
    ? article.relatedHotels.map(hotelSlug => {
        // Find the full hotel data if available
        const hotelData = hotels.find(h => h.slug === hotelSlug);
        
        if (hotelData) {
          return {
            id: hotelData.id,
            title: hotelData.name,
            image: hotelData.images?.[0] || hotelData.image || `/images/hotels/hotel-1.jpg`,
            excerpt: hotelData.description,
            slug: `/hotels/${hotelData.slug}`
          };
        } else {
          // If hotel not found in data, create a minimal object with the slug
          // Entfernung von Math.random() für konstante Server-Client-Hydration
          return {
            id: hotelSlug,
            title: hotelSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            image: `/images/hotels/hotel-1.jpg`, // Konstante Bildauswahl statt zufällig
            excerpt: `Discover this beautiful hotel.`,
            slug: `/hotels/${hotelSlug}`
          };
        }
      })
    : [];
    
  // If no related hotels specified, grab the first 3 hotels (konstant statt zufällig)
  const relatedHotels = processedRelatedHotels.length > 0
    ? processedRelatedHotels
    : hotels.slice(0, 3).map(hotel => ({
        id: hotel.id,
        title: hotel.name,
        image: hotel.images?.[0] || hotel.image || `/images/hotels/hotel-1.jpg`, // Konstante Bildauswahl
        excerpt: hotel.description,
        slug: `/hotels/${hotel.slug}`
      }));
  
  // Enhance article with additional data for detail page
  const enhancedArticle = {
    ...article,
    relatedArticles,
    subtitle: "Discover the Magic of " + article.title,
    heroImage: article.images.main,
    mainImage: article.images.main,
    secondaryImage: article.images.gallery?.[0] || article.images.main,
    tertiaryImage: article.images.gallery?.[1] || article.images.main,
    attractions: [
      {
        id: 1,
        name: "Local Restaurant",
        description: "A traditional restaurant with modern twist, offering stunning views."
      },
      {
        id: 2,
        name: "Café and Bakery",
        description: "Known for its local specialties and cozy atmosphere."
      },
      {
        id: 3,
        name: "Mountain Resort Bar",
        description: "A chic spot for drinks and live music."
      },
      {
        id: 4,
        name: "Wine Bar",
        description: "A quaint wine bar perfect for relaxing evenings."
      }
    ],
    mainContent: article.content.split('\n\n')[0] || article.excerpt,
    secondaryContent: article.content.split('\n\n')[1] || article.excerpt
  };
  
  return {
    data: {
      ...enhancedArticle,
      relatedHotels
    }
  };
}

/**
 * Restaurant-related API functions
 */
export async function getFeaturedRestaurants(locale = 'de', limit = 4) {
  console.log('[getFeaturedRestaurants] Fetching featured restaurants with locale:', locale);
  
  try {
    const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
    
    // Fetch featured restaurants
    const response = await fetch(
      `${DIRECTUS_URL}/items/restaurants?fields=*&filter[featured][_eq]=true&filter[status][_eq]=published&limit=${limit}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_PAGE ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_PAGE) : 3600 }
      }
    );

    if (!response.ok) {
      console.error('[getFeaturedRestaurants] Failed to fetch from Directus, using fallback data');
      // Fallback to static data
      return {
        data: [
          {
            id: 1,
            name: "El Olivo",
            description: "A traditional alpine restaurant with a modern twist, offering stunning Matterhorn views.",
            image: "/images/restaurant-1.jpg",
            url: "/restaurants/el-olivo"
          },
          {
            id: 2,
            name: "LA SPONDA",
            description: "A culinary love letter to Naples, Vesuvius & the Amalfi Coast.",
            image: "/images/restaurant-2.jpg",
            url: "/restaurants/la-sponda"
          },
          {
            id: 3,
            name: "LE GRAND VÉFOUR",
            description: "Jewel of the 18th century \"art décoratif\" Le Grand Véfour has been the finest gourmet rendez-vous of the Parisian.",
            image: "/images/restaurant-3.jpg",
            url: "/restaurants/le-grand-vefour"
          },
          {
            id: 4,
            name: "Il Palagio",
            description: "Immerse yourself in an unparalleled dining experience that seamlessly blends culinary mastery, heritage and innovation.",
            image: "/images/restaurant-4.jpg",
            url: "/restaurants/il-palagio"
          }
        ]
      };
    }

    const restaurantsData = await response.json();
    const restaurants = restaurantsData.data || [];
    
    // Fetch translations for all restaurants
    let translations = [];
    if (restaurants.length > 0) {
      const translationsResponse = await fetch(
        `${DIRECTUS_URL}/items/restaurant_translations?filter[language_code][_eq]=${locale}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_TRANSLATIONS ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_TRANSLATIONS) : 86400 }
        }
      );
      
      if (translationsResponse.ok) {
        const translationsData = await translationsResponse.json();
        translations = translationsData.data || [];
      }
    }
    
    // Transform and merge with translations
    const transformedRestaurants = restaurants.map(restaurant => {
      const translation = translations.find(t => t.restaurant_id === restaurant.id);
      
      return {
        id: restaurant.id,
        name: translation?.name || restaurant.name,
        description: translation?.description || restaurant.description,
        cuisine_type: translation?.cuisine_type || restaurant.cuisine_type,
        image: restaurant.image ? `${DIRECTUS_URL}/assets/${restaurant.image}` : '/images/restaurant-1.jpg',
        url: restaurant.website_url || `/restaurants/${restaurant.slug || restaurant.name.toLowerCase().replace(/\s+/g, '-')}`,
        website_url: restaurant.website_url
      };
    });
    
    return {
      data: transformedRestaurants
    };
    
  } catch (error) {
    console.error('[getFeaturedRestaurants] Error:', error);
    // Fallback to static data
    return {
      data: [
        {
          id: 1,
          name: "El Olivo",
          description: "A traditional alpine restaurant with a modern twist, offering stunning Matterhorn views.",
          image: "/images/restaurant-1.jpg",
          url: "/restaurants/el-olivo"
        },
        {
          id: 2,
          name: "LA SPONDA",
          description: "A culinary love letter to Naples, Vesuvius & the Amalfi Coast.",
          image: "/images/restaurant-2.jpg",
          url: "/restaurants/la-sponda"
        },
        {
          id: 3,
          name: "LE GRAND VÉFOUR",
          description: "Jewel of the 18th century \"art décoratif\" Le Grand Véfour has been the finest gourmet rendez-vous of the Parisian.",
          image: "/images/restaurant-3.jpg",
          url: "/restaurants/le-grand-vefour"
        },
        {
          id: 4,
          name: "Il Palagio",
          description: "Immerse yourself in an unparalleled dining experience that seamlessly blends culinary mastery, heritage and innovation.",
          image: "/images/restaurant-4.jpg",
          url: "/restaurants/il-palagio"
        }
      ]
    };
  }
}

/**
 * Get hotels for world map display
 */
export async function getHotelsForMap() {
  try {
    const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
    
    const response = await fetch(
      `${DIRECTUS_URL}/items/hotels?fields=id,name,slug,location,region,latitude,longitude,status,list_image&filter[status][_eq]=published`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_HOTEL ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_HOTEL) : 300 }
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch hotels for map');
      // Return fallback data with regions
      return [
        { id: 1, name: "Europe", count: 18, position: { x: 47, y: 29 } },
        { id: 2, name: "Asia", count: 4, position: { x: 72, y: 40 } },
        { id: 3, name: "Americas", count: 8, position: { x: 19, y: 42 } }
      ];
    }

    const data = await response.json();
    const hotels = data.data || [];
    
    // Group hotels by region
    const regions = {
      'Europe': { count: 0, position: { x: 47, y: 29 }, hotels: [] },
      'Asia': { count: 0, position: { x: 72, y: 40 }, hotels: [] },
      'Americas': { count: 0, position: { x: 19, y: 42 }, hotels: [] },
      'Africa': { count: 0, position: { x: 52, y: 71 }, hotels: [] },
      'Oceania': { count: 0, position: { x: 82, y: 85 }, hotels: [] }
    };
    
    // Map hotels to regions
    hotels.forEach(hotel => {
      // Use coordinates if available, otherwise determine by region/location
      let regionName = 'Europe'; // default
      
      if (hotel.latitude && hotel.longitude) {
        // Determine region by coordinates
        if (hotel.longitude < -30) {
          regionName = 'Americas';
        } else if (hotel.longitude > 60) {
          regionName = 'Asia';
        } else if (hotel.longitude > 100 && hotel.latitude < -10) {
          regionName = 'Oceania';
        } else if (hotel.latitude < 35 && hotel.longitude > -20 && hotel.longitude < 55) {
          regionName = 'Africa';
        }
      } else if (hotel.region) {
        // Use region field if no coordinates
        const regionMap = {
          'south-tyrol': 'Europe',
          'alps': 'Europe',
          'dolomites': 'Europe',
          'mediterranean': 'Europe',
          'asia': 'Asia',
          'americas': 'Americas'
        };
        regionName = regionMap[hotel.region.toLowerCase()] || 'Europe';
      }
      
      if (regions[regionName]) {
        regions[regionName].count++;
        regions[regionName].hotels.push({
          id: hotel.id,
          name: hotel.name,
          slug: hotel.slug,
          location: hotel.location,
          region: hotel.region,
          latitude: hotel.latitude || null,
          longitude: hotel.longitude || null,
          image: hotel.list_image ? `${DIRECTUS_URL}/assets/${hotel.list_image}` : null
        });
      }
    });
    
    // Convert to array format
    const regionsArray = Object.entries(regions)
      .filter(([_, data]) => data.count > 0)
      .map(([name, data], index) => ({
        id: index + 1,
        name,
        count: data.count,
        position: data.position,
        hotels: data.hotels
      }));
    
    return regionsArray;
    
  } catch (error) {
    console.error('Error fetching hotels for map:', error);
    // Return fallback data
    return [
      { id: 1, name: "Europe", count: 18, position: { x: 47, y: 29 } },
      { id: 2, name: "Asia", count: 4, position: { x: 72, y: 40 } },
      { id: 3, name: "Americas", count: 8, position: { x: 19, y: 42 } }
    ];
  }
}

/**
 * Get destinations for world map display
 */
export async function getDestinationsForMap() {
  try {
    const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
    
    const response = await fetch(
      `${DIRECTUS_URL}/items/destinations?fields=id,name,slug,latitude,longitude,status&filter[status][_eq]=published`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_DESTINATION ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_DESTINATION) : 600 }
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch destinations for map');
      // Return fallback data with regions
      return {
        regions: [
          { id: 1, name: "North America", count: 6, position: { x: 19, y: 42 } },
          { id: 2, name: "Europe", count: 18, position: { x: 47, y: 29 } },
          { id: 3, name: "Asia", count: 4, position: { x: 72, y: 40 } },
          { id: 4, name: "Africa", count: 4, position: { x: 52, y: 71 } },
          { id: 5, name: "South America", count: 2, position: { x: 26, y: 71 } }
        ],
        destinations: []
      };
    }

    const data = await response.json();
    const destinations = data.data || [];
    
    // Group destinations by region
    const regions = {
      'Europe': { count: 0, position: { x: 47, y: 29 }, destinations: [] },
      'North America': { count: 0, position: { x: 19, y: 42 }, destinations: [] },
      'Asia': { count: 0, position: { x: 72, y: 40 }, destinations: [] },
      'Africa': { count: 0, position: { x: 52, y: 71 }, destinations: [] },
      'South America': { count: 0, position: { x: 26, y: 71 }, destinations: [] },
      'Oceania': { count: 0, position: { x: 82, y: 85 }, destinations: [] }
    };
    
    // Map destinations to regions based on coordinates
    destinations.forEach(dest => {
      if (dest.latitude && dest.longitude) {
        // Simple region detection based on coordinates
        let region = 'Europe'; // default
        
        // North/South America
        if (dest.longitude < -30) {
          region = dest.latitude > 0 ? 'North America' : 'South America';
        } 
        // Asia
        else if (dest.longitude > 60) {
          region = 'Asia';
        }
        // Oceania
        else if (dest.longitude > 100 && dest.latitude < -10) {
          region = 'Oceania';
        }
        // Africa
        else if (dest.latitude < 35 && dest.longitude > -20 && dest.longitude < 55) {
          region = 'Africa';
        }
        // Default to Europe for everything else
        
        if (regions[region]) {
          regions[region].count++;
          regions[region].destinations.push({
            id: dest.id,
            name: dest.name,
            slug: dest.slug,
            latitude: dest.latitude,
            longitude: dest.longitude
          });
        }
      }
    });
    
    // Convert to array format
    const regionsArray = Object.entries(regions)
      .filter(([_, data]) => data.count > 0)
      .map(([name, data], index) => ({
        id: index + 1,
        name,
        count: data.count,
        position: data.position,
        destinations: data.destinations
      }));
    
    return regionsArray;
    
  } catch (error) {
    console.error('Error fetching destinations for map:', error);
    // Return fallback data
    return [
      { id: 1, name: "North America", count: 6, position: { x: 19, y: 42 } },
      { id: 2, name: "Europe", count: 18, position: { x: 47, y: 29 } },
      { id: 3, name: "Asia", count: 4, position: { x: 72, y: 40 } },
      { id: 4, name: "Africa", count: 4, position: { x: 52, y: 71 } },
      { id: 5, name: "South America", count: 2, position: { x: 26, y: 71 } }
    ];
  }
}