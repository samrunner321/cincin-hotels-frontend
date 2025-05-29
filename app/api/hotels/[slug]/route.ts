import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  
  // Get locale from query parameter or header, with fallback to 'de'
  const { searchParams } = new URL(request.url);
  const queryLocale = searchParams.get('locale');
  const headerLocale = request.headers.get('x-locale');
  const locale = queryLocale || headerLocale || 'de';
  
  // Validate locale against supported languages
  const supportedLocales = ['de', 'en'];
  const validatedLocale = supportedLocales.includes(locale) ? locale : 'de';
  
  try {
    console.log('=== Enhanced Hotel API Route ===');
    console.log('Slug:', slug);
    console.log('Locale:', validatedLocale);
    console.log('Query Locale:', queryLocale);
    console.log('Header Locale:', headerLocale);
    
    // Fetch hotel with all related data
    const response = await fetch(
      `http://localhost:8055/items/hotels?` + new URLSearchParams({
        'filter[slug][_eq]': slug,
        'fields': '*'
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_HOTEL ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_HOTEL) : 300 }
      }
    );

    console.log('Response status:', response.status);

    if (!response.ok) {
      console.error('Fetch failed:', response.statusText);
      return NextResponse.json(
        { error: `Failed to fetch hotel: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Data received:', JSON.stringify(data, null, 2));
    
    if (!data.data || data.data.length === 0) {
      console.log('No hotel found for slug:', slug);
      return NextResponse.json(
        { error: 'Hotel not found' },
        { status: 404 }
      );
    }

    const hotel = data.data[0];
    console.log('Hotel found:', hotel.name);
    
    // Fetch translations separately
    let translations: any[] = [];
    let translation: any = null;
    try {
      const translationsResponse = await fetch(
        `http://localhost:8055/items/hotel_translations?filter[hotel_id][_eq]=${hotel.id}`,
        { headers: { 'Content-Type': 'application/json' }, next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_TRANSLATIONS ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_TRANSLATIONS) : 86400 } }
      );
      if (translationsResponse.ok) {
        const translationsData = await translationsResponse.json();
        translations = translationsData.data || [];
        translation = translations.find((t: any) => t.language_code === validatedLocale) || null;
        console.log('Translations found:', translations.length);
      }
    } catch (e) {
      console.error('Failed to fetch translations:', e);
    }
    
    // Fetch rooms for hotel with images relation
    let rooms: any[] = [];
    let roomTranslations: any[] = [];
    try {
      const roomsResponse = await fetch(
        `http://localhost:8055/items/rooms?filter[hotel_id][_eq]=${hotel.id}&sort=price_from&fields=*,images.directus_files_id`,
        { headers: { 'Content-Type': 'application/json' }, next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_HOTEL ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_HOTEL) : 300 } }
      );
      if (roomsResponse.ok) {
        const roomsData = await roomsResponse.json();
        rooms = roomsData.data || [];
        console.log('Rooms found:', rooms.length);
        
        // Fetch room translations separately
        if (rooms.length > 0) {
          const roomIds = rooms.map((r: any) => r.id);
          const translationsResponse = await fetch(
            `http://localhost:8055/items/room_translations?filter[room_id][_in]=${roomIds.join(',')}&filter[language_code][_eq]=${validatedLocale}`,
            { headers: { 'Content-Type': 'application/json' }, next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_TRANSLATIONS ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_TRANSLATIONS) : 86400 } }
          );
          if (translationsResponse.ok) {
            const translationsData = await translationsResponse.json();
            roomTranslations = translationsData.data || [];
            console.log('Room translations found:', roomTranslations.length, 'for locale:', validatedLocale);
          }
        }
      }
    } catch (e) {
      console.error('Failed to fetch rooms:', e);
    }
    
    // Fetch gallery with multiple images support
    let gallery: any[] = [];
    
    console.log('\n=== GALLERY DEBUG ===');
    console.log('Hotel ID:', hotel.id);
    console.log('Hotel Name:', hotel.name);
    
    // First check if hotel has gallery_images field (workaround)
    if (hotel.gallery_images) {
      console.log('Has gallery_images field:', typeof hotel.gallery_images);
      console.log('Gallery_images content:', hotel.gallery_images);
      try {
        const galleryImages = typeof hotel.gallery_images === 'string' 
          ? JSON.parse(hotel.gallery_images) 
          : hotel.gallery_images;
          
        if (Array.isArray(galleryImages)) {
          gallery = galleryImages.map((img: any, index: number) => ({
            id: img.id || `gallery_${index}`,
            image: img.id,
            image_url: null,
            title: img.title || `Image ${index + 1}`,
            alt_text: img.alt_text,
            is_hero: img.is_hero || false,
            sort_order: img.sort_order || index
          }));
          console.log(`Loaded ${gallery.length} images from gallery_images field`);
        }
      } catch (e) {
        console.error('Failed to parse gallery_images:', e);
      }
    }
    
    // Always try to fetch from hotel_gallery collection as well
    console.log('Fetching from hotel_gallery collection...');
    try {
      const galleryResponse = await fetch(
        `http://localhost:8055/items/hotel_gallery?filter[hotel_id][_eq]=${hotel.id}&sort=sort_order&fields=*,image.id,image.filename_disk,image.title`,
        { headers: { 'Content-Type': 'application/json' }, next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_HOTEL ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_HOTEL) : 300 } }
      );
      
      if (galleryResponse.ok) {
        const galleryData = await galleryResponse.json();
        const galleryItems = galleryData.data || [];
        console.log(`Found ${galleryItems.length} items in hotel_gallery`);
        
        // Process each gallery item
        for (const item of galleryItems) {
          console.log('Gallery item:', JSON.stringify(item, null, 2));
          
          // Check if item has image field (it's a single file object)
          if (item.image) {
            let imageUuid: string | null = null;
            
            // If image is an object with id property
            if (typeof item.image === 'object' && item.image.id) {
              imageUuid = item.image.id;
            } 
            // If image is just an ID string or number
            else if (typeof item.image === 'string' || typeof item.image === 'number') {
              imageUuid = String(item.image);
            }
            
            if (imageUuid) {
              gallery.push({
                id: `gallery_${item.id}`,
                image: imageUuid,
                image_url: null,
                title: item.title || 'Gallery Image',
                alt_text: item.alt_text,
                is_hero: item.is_hero || false,
                sort_order: item.sort_order || 0
              });
            }
          }
        }
        
        const previousGalleryCount = gallery.length - galleryItems.length;
        console.log(`Added ${galleryItems.length} images from hotel_gallery (total: ${gallery.length})`);
      }
    } catch (e) {
      console.error('Failed to fetch gallery:', e);
    }
    
    console.log('Final gallery length:', gallery.length);
    
    // Fetch hotel articles separately
    let articles: any[] = [];
    let articleTranslations: any[] = [];
    try {
      // Direct approach with filter in URL
      const articlesResponse = await fetch(
        `http://localhost:8055/items/hotel_articles`,
        { 
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer B-uCbU2IM69hOdrZWApYrTk5ffFYa6j-'
          }, 
          next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_PAGE ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_PAGE) : 3600 }
        }
      );
      
      if (articlesResponse.ok) {
        const articlesData = await articlesResponse.json();
        const allArticles = articlesData.data || [];
        // Simple filter - compare as numbers to be safe
        articles = allArticles.filter(article => Number(article.hotel_id) === Number(hotel.id));
        console.log(`Found ${articles.length} articles for hotel ${hotel.id}`);
        
        // Fetch article translations if needed
        if (validatedLocale !== 'de' && articles.length > 0) {
          const articleIds = articles.map(a => a.id);
          const transUrl = new URL('http://localhost:8055/items/hotel_article_translations');
          transUrl.searchParams.append('filter[article_id][_in]', articleIds.join(','));
          transUrl.searchParams.append('filter[language_code][_eq]', validatedLocale);
          
          const articleTransResponse = await fetch(
            transUrl.toString(),
            { 
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer B-uCbU2IM69hOdrZWApYrTk5ffFYa6j-'
              }, 
              next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_TRANSLATIONS ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_TRANSLATIONS) : 86400 }
            }
          );
          if (articleTransResponse.ok) {
            const articleTransData = await articleTransResponse.json();
            articleTranslations = articleTransData.data || [];
          }
        }
      }
    } catch (e) {
      console.error('Failed to fetch articles:', e);
    }
    
    // Fetch amenities data
    let amenities = [];
    try {
      const amenitiesResponse = await fetch(
        `http://localhost:8055/items/hotels_amenities?filter[hotels_id][_eq]=${hotel.id}&fields=*,hotel_amenities_id.*`,
        { headers: { 'Content-Type': 'application/json' }, next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_HOTEL ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_HOTEL) : 300 } }
      );
      
      if (amenitiesResponse.ok) {
        const amenitiesData = await amenitiesResponse.json();
        const hotelAmenities = amenitiesData.data || [];
        
        amenities = hotelAmenities.map(ha => {
          const amenity = ha.hotel_amenities_id;
          return {
            id: amenity.id,
            key: amenity.key,
            name: amenity.name,
            icon: amenity.icon,
            svg_icon: amenity.svg_icon,
            category: amenity.category
          };
        });
        
        console.log('Amenities found:', amenities.length);
      }
    } catch (e) {
      console.error('Failed to fetch amenities:', e);
    }

    // Fetch restaurants data
    let restaurants: any[] = [];
    let restaurantTranslations: any[] = [];
    try {
      const restaurantsResponse = await fetch(
        `http://localhost:8055/items/hotel_restaurants?filter[hotel_id][_eq]=${hotel.id}&fields=*,image.*,translations.*&sort=sort_order`,
        { headers: { 'Content-Type': 'application/json' }, next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_PAGE ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_PAGE) : 3600 } }
      );
      
      if (restaurantsResponse.ok) {
        const restaurantsData = await restaurantsResponse.json();
        restaurants = restaurantsData.data || [];
        console.log('Restaurants found:', restaurants.length);
        
        // Fetch restaurant translations separately if needed
        if (restaurants.length > 0) {
          const restaurantIds = restaurants.map(r => r.id);
          const restaurantTransResponse = await fetch(
            `http://localhost:8055/items/restaurant_translations?filter[restaurant_id][_in]=${restaurantIds.join(',')}&filter[language_code][_eq]=${validatedLocale}`,
            { headers: { 'Content-Type': 'application/json' }, next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_TRANSLATIONS ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_TRANSLATIONS) : 86400 } }
          );
          if (restaurantTransResponse.ok) {
            const restaurantTransData = await restaurantTransResponse.json();
            restaurantTranslations = restaurantTransData.data || [];
          }
        }
      }
    } catch (e) {
      console.error('Failed to fetch restaurants:', e);
    }
    
    // Build response with translated content
    const response_data: any = {
      // Basic fields
      id: hotel.id,
      slug: hotel.slug,
      name: translation?.name || hotel.name,
      description: translation?.description || hotel.description,
      short_description: translation?.short_description || '',
      location: hotel.location,
      region: hotel.region,
      stars: hotel.stars,
      price_from: hotel.price_from,
      featured: hotel.featured,
      status: hotel.status,
      
      // New professional fields
      coordinates: {
        latitude: hotel.latitude || null,
        longitude: hotel.longitude || null
      },
      contact: {
        phone: hotel.phone || null,
        email: hotel.email || null,
        website: hotel.website || null
      },
      rating: hotel.rating || null,
      review_count: hotel.review_count || 0,
      check_in_time: hotel.check_in_time || '15:00',
      check_out_time: hotel.check_out_time || '11:00',
      amenities: amenities,
      amenities_text: translation?.amenities_text || '',
      location_description: translation?.location_description || '',
      
      // SEO fields
      seo: {
        meta_title: translation?.meta_title || hotel.meta_title || hotel.name,
        meta_description: translation?.meta_description || hotel.meta_description || ''
      },
      
      // New content fields
      hero_image: hotel.hero_image || hotel.featured_image || null,
      list_image: hotel.list_image || null,
      originals_title: translation?.originals_title || hotel.originals_title || null,
      originals_text: translation?.originals_text || hotel.originals_text || null,
      originals_image: hotel.originals_image || null,
      
      // Translation info
      translation: translation ? {
        language_code: translation.language_code,
        name: translation.name,
        description: translation.description,
        short_description: translation.short_description,
        amenities_text: translation.amenities_text,
        location_description: translation.location_description,
        originals_title: translation.originals_title,
        originals_text: translation.originals_text
      } : null,
      
      // Related data
      rooms: rooms.map(room => {
        // Find translation for this room
        const roomTranslation = roomTranslations.find(t => t.room_id === room.id);
        
        // Extract ALL images from many-to-many relationship
        let roomImages: any[] = [];
        let primaryImage: any = null;
        
        if (room.images && Array.isArray(room.images) && room.images.length > 0) {
          // Get all image UUIDs from the junction table
          roomImages = room.images.map(imgRel => ({
            id: imgRel.directus_files_id,
            url: `http://localhost:8055/assets/${imgRel.directus_files_id}?width=400&height=300&quality=80`
          }));
          
          // Set first image as primary
          primaryImage = room.images[0].directus_files_id;
        }
        
        // If no images, add fallback
        if (roomImages.length === 0) {
          const fallbackImage = "/images/hotels/hotel-" + ((room.id % 6) + 1) + ".jpg";
          roomImages = [{ id: null, url: fallbackImage }];
        }
        
        return {
          id: room.id,
          // Use translated values with fallback to original
          name: roomTranslation?.name || room.name,
          description: roomTranslation?.description || room.description,
          amenities_text: roomTranslation?.amenities_text || room.amenities,
          // Original fields
          size: room.size + "m²",
          persons: room.max_guests,
          price: "€" + room.price_from,
          image: primaryImage,
          image_url: roomImages[0].url,
          images: roomImages, // ALL images for pagination
          // Translation info for debugging
          translation: roomTranslation ? {
            language_code: roomTranslation.language_code,
            translated: true
          } : { translated: false }
        };
      }),
      gallery: gallery.map(item => ({
        id: item.id,
        image_url: item.image_url || null,
        image: item.image || null,
        title: item.title,
        alt_text: item.alt_text,
        is_hero: item.is_hero,
        sort_order: item.sort_order
      })),
      
      // Articles with translations
      articles: articles.map(article => {
        const articleTrans = articleTranslations.find(t => t.article_id === article.id);
        return {
          id: article.id,
          title: articleTrans?.title || article.title,
          subtitle: articleTrans?.subtitle || article.subtitle,
          content: articleTrans?.content || article.content,
          position: article.position || 'left',
          published: article.published === 1 || article.published === true,
          image: (() => {
            // Handle different image formats
            if (article.image && typeof article.image === 'object' && article.image.id) {
              // Image is an object with id
              return `http://localhost:8055/assets/${article.image.id}?width=800&height=600&quality=80`;
            } else if (article.image && article.image.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
              // Image is a UUID string
              return `http://localhost:8055/assets/${article.image}?width=800&height=600&quality=80`;
            } else if (article.image && article.image.startsWith('/')) {
              // Image is a path
              return article.image;
            } else {
              // Default image
              return '/images/hotel-default.jpg';
            }
          })(),
          layout: article.layout || 'text-left',
          sort: article.sort || article.sort_order || 0
        };
      }),
      
      // Restaurants with translations
      restaurants: restaurants.map(restaurant => {
        const restaurantTrans = restaurantTranslations.find(t => t.restaurant_id === restaurant.id);
        
        return {
          id: restaurant.id,
          name: restaurantTrans?.name || restaurant.name,
          description: restaurantTrans?.description || restaurant.description,
          cuisine_type: restaurantTrans?.cuisine_type || restaurant.cuisine_type,
          rating: restaurant.rating || 0,
          price_level: restaurant.price_level || '€€',
          menu_link: restaurant.menu_link,
          opening_hours: restaurant.opening_hours,
          image: restaurant.image?.id 
            ? `http://localhost:8055/assets/${restaurant.image.id}?width=800&height=600&quality=80`
            : "/images/restaurant-default.jpg",
          status: restaurant.status
        };
      }).filter(r => r.status === 'published'), // Only show published restaurants
      
      // Hotel's main destination
      destination: null,
      
      // Nearby destinations
      nearby_destinations: [],
      
      // Owner information
      owners: hotel.owner_name || hotel.owner_description || hotel.owner_image ? {
        name: hotel.owner_name || null,
        description: hotel.owner_description || null,
        image: hotel.owner_image && hotel.owner_image.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
          ? `http://localhost:8055/assets/${hotel.owner_image}?width=800&height=600&quality=80`
          : hotel.owner_image || null
      } : null,
      
      // Meta information
      available_languages: translations.map(t => t.language_code),
      current_locale: validatedLocale
    };
    
    // Add hotel's main destination
    // TODO: Uncomment when destination_id field is added to hotels collection
    /*
    if (hotel.destination_id) {
      let destTranslation = null;
      
      // Fetch destination translation if needed
      if (hotel.destination_id.id) {
        try {
          const destTransResponse = await fetch(
            `http://localhost:8055/items/destination_translations?filter[destination_id][_eq]=${hotel.destination_id.id}&filter[language_code][_eq]=${validatedLocale}`,
            { headers: { 'Content-Type': 'application/json' }, cache: 'no-store' }
          );
          
          if (destTransResponse.ok) {
            const destTransData = await destTransResponse.json();
            if (destTransData.data && destTransData.data.length > 0) {
              destTranslation = destTransData.data[0];
            }
          }
        } catch (e) {
          console.error('Failed to fetch destination translation:', e);
        }
      }
      
      response_data.destination = {
        id: hotel.destination_id.id,
        name: destTranslation?.name || hotel.destination_id.name,
        slug: hotel.destination_id.slug,
        country: hotel.destination_id.country,
        description: destTranslation?.description || hotel.destination_id.description,
        highlights: destTranslation?.highlights || hotel.destination_id.highlights || [],
        best_travel_time: destTranslation?.best_travel_time || hotel.destination_id.best_travel_time,
        climate_info: destTranslation?.climate_info || hotel.destination_id.climate_info,
        must_see_attractions: destTranslation?.must_see_attractions || hotel.destination_id.must_see_attractions || [],
        hero_image: hotel.destination_id.hero_image?.id 
          ? `http://localhost:8055/assets/${hotel.destination_id.hero_image.id}?width=800&height=600&quality=80`
          : null
      };
    }
    */
    
    // Fetch destinations
    let hotelDestinations: any[] = [];
    let destinationTranslations: any[] = [];
    try {
      const destinationsResponse = await fetch(
        `http://localhost:8055/items/hotels_destinations?filter[hotel_id][_eq]=${hotel.id}&fields=*,destination_id.*,destination_id.image.*,destination_id.translations.*`,
        { headers: { 'Content-Type': 'application/json' }, next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_DESTINATION ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_DESTINATION) : 600 } }
      );
      
      if (destinationsResponse.ok) {
        const destinationsData = await destinationsResponse.json();
        hotelDestinations = destinationsData.data || [];
        console.log('Hotel destinations found:', hotelDestinations.length);
        
        // Get destination IDs to fetch translations
        if (hotelDestinations.length > 0) {
          const destinationIds = hotelDestinations.map(hd => hd.destination_id?.id).filter(id => id);
          
          if (destinationIds.length > 0) {
            const destTransResponse = await fetch(
              `http://localhost:8055/items/destination_translations?filter[destination_id][_in]=${destinationIds.join(',')}&filter[language_code][_eq]=${validatedLocale}`,
              { headers: { 'Content-Type': 'application/json' }, next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_TRANSLATIONS ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_TRANSLATIONS) : 86400 } }
            );
            
            if (destTransResponse.ok) {
              const destTransData = await destTransResponse.json();
              destinationTranslations = destTransData.data || [];
            }
          }
        }
      }
    } catch (e) {
      console.error('Failed to fetch destinations:', e);
    }
    
    // Transform destinations data
    response_data.nearby_destinations = hotelDestinations
      .filter(hd => hd.destination_id && hd.destination_id.status === 'published')
      .map(item => {
        const destination = item.destination_id;
        const translation = destinationTranslations.find(t => t.destination_id === destination.id);
        
        return {
          id: destination.id,
          name: translation?.name || destination.name,
          description: translation?.description || destination.description,
          highlights: translation?.highlights || destination.highlights || [],
          region: destination.region,
          country: destination.country,
          distance: item.distance || destination.distance_from_hotel,
          travel_time: item.travel_time,
          coordinates: destination.coordinates,
          image: destination.image?.id 
            ? `http://localhost:8055/assets/${destination.image.id}?width=800&height=600&quality=80`
            : "/images/destination-default.jpg",
          featured: destination.featured,
          sort_order: item.sort_order || 0
        };
      })
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    
    return NextResponse.json(response_data);
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hotel data', details: error.message },
      { status: 500 }
    );
  }
}