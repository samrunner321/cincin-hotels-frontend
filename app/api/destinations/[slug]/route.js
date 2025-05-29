import { NextResponse } from 'next/server';
import { getAllHotels } from '@/lib/api';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'de';
    
    // Fetch destination with images, selected hotels and restaurants expanded
    const response = await fetch(
      `${DIRECTUS_URL}/items/destinations?fields=*,images.directus_files_id.*,gallery.directus_files_id.*,selected_hotels.hotels_id.*,selected_restaurants.hotel_restaurants_id.*&filter[slug][_eq]=${slug}&filter[status][_eq]=published`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_DESTINATION ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_DESTINATION) : 600 }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch destination');
    }

    const destinationData = await response.json();
    const destination = destinationData.data?.[0];
    
    if (!destination) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 }
      );
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
        const restaurant = item.hotel_restaurants_id;
        if (restaurant && restaurant.image) {
          restaurant.image = `${DIRECTUS_URL}/assets/${restaurant.image}`;
        }
        return restaurant;
      }).filter(Boolean);
      
      // Fetch translations for restaurants if any exist
      if (destinationRestaurants.length > 0) {
        const restaurantIds = destinationRestaurants.map(r => r.id).join(',');
        try {
          const restTransResponse = await fetch(
            `${DIRECTUS_URL}/items/restaurant_translations?filter[restaurant_id][_in]=${restaurantIds}&filter[language_code][_eq]=${locale}`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
              next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_TRANSLATIONS ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_TRANSLATIONS) : 86400 }
            }
          );
          
          if (restTransResponse.ok) {
            const restTransData = await restTransResponse.json();
            const translationsMap = {};
            restTransData.data.forEach(trans => {
              translationsMap[trans.restaurant_id] = trans;
            });
            
            // Merge translations
            destinationRestaurants = destinationRestaurants.map(restaurant => ({
              ...restaurant,
              description: translationsMap[restaurant.id]?.description || restaurant.description,
              must_try: translationsMap[restaurant.id]?.must_try || restaurant.must_try
            }));
          }
        } catch (error) {
          console.log('Could not fetch restaurant translations');
        }
      }
    }

    // Image mapping
    const imageMapping = {
      'mykonos': 'beach.jpg',
      'crans-montana': 'mountain.jpg',
      'south-tyrol': 'south-tyrol.jpg',
      'berchtesgaden': 'mountain.jpg'
    };

    // Process images from the new 'images' field
    let imageUrl;
    let imageArray = [];
    
    if (destination.images && Array.isArray(destination.images) && destination.images.length > 0) {
      // Process array of images for the gallery
      imageArray = destination.images.map(img => {
        // Handle the junction table structure from destinations_files
        const fileId = img.directus_files_id?.id || img.directus_files_id || img.id || img;
        return `${DIRECTUS_URL}/assets/${fileId}`;
      });
      imageUrl = imageArray[0]; // Use first image as main image
    } else if (destination.images && typeof destination.images === 'string') {
      imageUrl = `${DIRECTUS_URL}/assets/${destination.images}`;
      imageArray = [imageUrl];
    } else {
      const mappedImage = imageMapping[destination.slug] || `${destination.slug}.jpg`;
      imageUrl = `/images/destinations/${mappedImage}`;
    }
    
    let heroImageUrl;
    if (destination.hero_image) {
      heroImageUrl = `${DIRECTUS_URL}/assets/${destination.hero_image}`;
    } else {
      heroImageUrl = imageUrl;
    }
    
    // Process gallery images
    let galleryImages = [];
    if (destination.gallery && Array.isArray(destination.gallery)) {
      galleryImages = destination.gallery.map(item => {
        const fileId = item.directus_files_id?.id || item.directus_files_id;
        return `${DIRECTUS_URL}/assets/${fileId}`;
      });
    }

    return NextResponse.json({
      data: {
        id: destination.id,
        slug: destination.slug,
        name: destination.name,
        images: imageArray.length > 0 ? imageArray : [imageUrl], // Array of images from the images field
        hero_image: heroImageUrl,
        gallery: galleryImages,
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
        selectedHotels: destinationHotels,
        selectedRestaurants: destinationRestaurants,
        // New translation fields
        hero_explore_button: translation?.hero_explore_button || 'Explore Destination',
        tab_overview: translation?.tab_overview || 'Overview',
        tab_hotels: translation?.tab_hotels || 'Hotels',
        tab_dining: translation?.tab_dining || 'Dining',
        tab_activities: translation?.tab_activities || 'Activities',
        tab_plan_trip: translation?.tab_plan_trip || 'Plan Your Trip',
        overview_highlights_title: translation?.overview_highlights_title || 'Highlights',
        overview_gallery_title: translation?.overview_gallery_title || 'Capturing the Essence',
        overview_map_instruction: translation?.overview_map_instruction || 'Click on markers to discover different areas',
        overview_seasonal_subtitle: translation?.overview_seasonal_subtitle || `Watch how ${destination.name} transforms throughout the year`,
        activities_subtitle: translation?.activities_subtitle || `Make the most of your stay in ${destination.name} with our curated selection of activities throughout the day.`,
        activities_morning: translation?.activities_morning || 'Morning',
        activities_afternoon: translation?.activities_afternoon || 'Afternoon',
        activities_evening: translation?.activities_evening || 'Evening',
        activities_things_to: translation?.activities_things_to || 'Things to',
        activities_do: translation?.activities_do || 'Do',
        dining_subtitle: translation?.dining_subtitle || `Discover the finest dining experiences in ${destination.name}, from Michelin-starred restaurants to hidden local gems.`,
        dining_culinary: translation?.dining_culinary || 'Culinary',
        dining_map: translation?.dining_map || 'Map',
        dining_must_try: translation?.dining_must_try || 'Must Try:',
        dining_view_menu: translation?.dining_view_menu || 'View Menu →',
        common_loading_map: translation?.common_loading_map || 'Loading map...',
        common_view_details: translation?.common_view_details || 'View Details',
        common_show_more: translation?.common_show_more || 'Show More',
        common_show_less: translation?.common_show_less || 'Show Less',
        common_book_now: translation?.common_book_now || 'Book Now',
        common_duration: translation?.common_duration || 'Duration:',
        season_winter: translation?.season_winter || 'Winter',
        season_spring: translation?.season_spring || 'Spring',
        season_summer: translation?.season_summer || 'Summer',
        season_autumn: translation?.season_autumn || 'Autumn',
        season_winter_period: translation?.season_winter_period || 'December - March',
        season_spring_period: translation?.season_spring_period || 'April - May',
        season_summer_period: translation?.season_summer_period || 'June - August',
        season_autumn_period: translation?.season_autumn_period || 'September - November',
        // Additional translation fields for components
        activities_duration: translation?.activities_duration || 'Duration',
        activities_book_now: translation?.activities_book_now || 'Book Now',
        overview_destination: translation?.overview_destination || 'Destination',
        overview_overview: translation?.overview_overview || 'Overview',
        overview_click_markers: translation?.overview_click_markers || 'Click on markers to discover different areas',
        overview_watch_transforms: translation?.overview_watch_transforms || `Watch how ${destination.name} transforms throughout the year`,
        overview_capturing: translation?.overview_capturing || 'Capturing',
        overview_essence: translation?.overview_essence || 'the Essence',
        overview_season_winter: translation?.overview_season_winter || 'winter',
        overview_season_spring: translation?.overview_season_spring || 'spring',
        overview_season_summer: translation?.overview_season_summer || 'summer',
        overview_season_autumn: translation?.overview_season_autumn || 'autumn',
        overview_highlights: translation?.overview_highlights || 'Highlights',
        practical_travel: translation?.practical_travel || 'Travel',
        practical_information: translation?.practical_information || 'Information',
        practical_subtitle: translation?.practical_subtitle || `Everything you need to know for a smooth and enjoyable trip to ${destination.name}.`,
        practical_insider_tips: translation?.practical_insider_tips || `Insider Tips for ${destination.name}`
      },
      meta: {
        hotelCount: destinationHotels.length,
        restaurantCount: destinationRestaurants.length
      }
    });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch destination' },
      { status: 500 }
    );
  }
}