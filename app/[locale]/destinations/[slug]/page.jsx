import { notFound } from 'next/navigation';
import DestinationDetailPage from '@/components/destinations/DestinationDetailPage';

// Mock destinations data for fallback
const mockDestinations = [
  {
    id: 1,
    name: 'Mykonos',
    slug: 'mykonos',
    country: 'Greece',
    continent: 'Europe',
    type: ['beach', 'island'],
    climate: 'Mediterranean',
    region: 'Mediterranean',
    description: 'A Cycladic paradise with stunning Aegean views, iconic windmills, and vibrant nightlife.',
    longDescription: `Mykonos, the jewel of the Cyclades, beckons with its pristine beaches, iconic windmills, and cosmopolitan atmosphere. This Greek island paradise seamlessly blends traditional charm with modern luxury, offering visitors an unforgettable Mediterranean experience.

    From the maze-like streets of Mykonos Town to the crystal-clear waters of Paradise Beach, every corner of this island tells a story. The famous windmills stand sentinel over Little Venice, where waterfront restaurants serve fresh seafood as waves lap at their foundations.

    By day, explore hidden coves and archaeological sites, or simply bask in the Aegean sun. As night falls, the island transforms into one of Europe's most vibrant party destinations, with world-class DJs and beach clubs that dance until dawn.`,
    image: 'https://images.unsplash.com/photo-1601581875039-e899893d520c?w=800&q=80',
    images: {
      hero: 'https://images.unsplash.com/photo-1601581875039-e899893d520c?w=1600&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1633321702518-38372ff3e92e?w=800&q=80',
        'https://images.unsplash.com/photo-1605367531399-2ecebabebab2?w=800&q=80',
        'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80'
      ]
    },
    highlights: [
      'Iconic windmills and Little Venice',
      'Paradise and Super Paradise beaches',
      'Vibrant nightlife and beach clubs',
      'Traditional Cycladic architecture',
      'Crystal-clear Aegean waters'
    ],
    bestTime: 'May - September',
    temperature: '25-30°C',
    currency: 'Euro (€)',
    language: 'Greek, English widely spoken',
    timezone: 'Eastern European Time (EET)',
    activities: [
      'Beach hopping',
      'Water sports',
      'Nightlife',
      'Photography',
      'Sailing',
      'Cultural tours'
    ]
  },
  {
    id: 2,
    name: 'Crans-Montana',
    slug: 'crans-montana',
    country: 'Switzerland',
    continent: 'Europe',
    type: ['mountain', 'ski'],
    climate: 'Alpine',
    region: 'Alps',
    description: 'A prestigious Alpine resort offering panoramic mountain views, world-class skiing, and championship golf courses.',
    longDescription: `Perched high on a sunny plateau in the heart of the Swiss Alps, Crans-Montana offers a perfect blend of alpine tradition and modern sophistication. This prestigious resort town provides breathtaking views of the Matterhorn and Mont Blanc, creating an unforgettable backdrop for both winter and summer adventures.

    In winter, 140 kilometers of pristine ski slopes cater to all levels, from gentle beginner runs to challenging black diamonds. The resort's high altitude ensures excellent snow conditions throughout the season, while its south-facing position provides abundant sunshine.

    Summer transforms Crans-Montana into a paradise for hikers, golfers, and mountain bikers. The Severiano Ballesteros golf course hosts the European Masters, while countless trails wind through alpine meadows and past crystal-clear mountain lakes.`,
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
    images: {
      hero: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1600&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1565694550235-9a9c2d66e382?w=800&q=80',
        'https://images.unsplash.com/photo-1548593663-8bb858a73929?w=800&q=80',
        'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800&q=80'
      ]
    },
    highlights: [
      '140km of ski slopes',
      'Championship golf courses',
      'Panoramic mountain views',
      'Year-round sunshine',
      'Luxury spa resorts'
    ],
    bestTime: 'December - March (skiing), June - September (hiking/golf)',
    temperature: '-5 to 10°C (winter), 15-25°C (summer)',
    currency: 'Swiss Franc (CHF)',
    language: 'French, German',
    timezone: 'Central European Time (CET)',
    activities: [
      'Skiing and snowboarding',
      'Golf',
      'Hiking',
      'Mountain biking',
      'Spa and wellness',
      'Wine tasting'
    ]
  },
  {
    id: 3,
    name: 'South Tyrol',
    slug: 'south-tyrol',
    country: 'Italy',
    continent: 'Europe',
    type: ['mountain', 'countryside'],
    climate: 'Alpine-Mediterranean',
    region: 'Alps',
    description: 'A unique blend of Alpine and Mediterranean cultures with breathtaking Dolomite landscapes and award-winning cuisine.',
    longDescription: `South Tyrol, where Italian passion meets Austrian precision, offers a unique cultural fusion set against the dramatic backdrop of the Dolomites. This autonomous region combines the best of both worlds: Mediterranean warmth and Alpine tradition, creating an unparalleled destination for discerning travelers.

    The UNESCO World Heritage Dolomites provide a spectacular playground for outdoor enthusiasts year-round. In winter, ski the legendary Sella Ronda circuit, while summer reveals endless hiking trails through flower-filled meadows and past turquoise alpine lakes.

    South Tyrol's culinary scene is equally impressive, blending hearty Tyrolean traditions with refined Italian cuisine. The region boasts the highest concentration of Michelin stars in Italy, complemented by excellent local wines from historic vineyards.`,
    image: 'https://images.unsplash.com/photo-1523478354461-4cd1a7b97677?w=800&q=80',
    images: {
      hero: 'https://images.unsplash.com/photo-1523478354461-4cd1a7b97677?w=1600&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=800&q=80',
        'https://images.unsplash.com/photo-1583521214690-73421a1829a9?w=800&q=80',
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80'
      ]
    },
    highlights: [
      'UNESCO Dolomites',
      'Michelin-starred restaurants',
      'Wine routes and vineyards',
      'Alpine-Mediterranean climate',
      'Cultural diversity'
    ],
    bestTime: 'June - October, December - March',
    temperature: '15-25°C (summer), -5 to 10°C (winter)',
    currency: 'Euro (€)',
    language: 'German, Italian, Ladin',
    timezone: 'Central European Time (CET)',
    activities: [
      'Hiking and climbing',
      'Skiing',
      'Wine tasting',
      'Cycling',
      'Spa and wellness',
      'Cultural tours'
    ]
  },
  {
    id: 4,
    name: 'Berlin',
    slug: 'berlin',
    country: 'Germany',
    continent: 'Europe',
    type: ['city'],
    climate: 'Continental',
    region: 'Central Europe',
    description: 'A dynamic city blending rich history with cutting-edge creativity and vibrant cultural scenes.',
    longDescription: `Berlin, Germany's vibrant capital, stands as a testament to resilience and reinvention. This dynamic metropolis seamlessly weaves together centuries of history with cutting-edge innovation, creating a unique urban landscape that captivates visitors from around the world.

    From the iconic Brandenburg Gate to the East Side Gallery's colorful murals, Berlin's streets tell stories of triumph and transformation. World-class museums on Museum Island showcase treasures spanning millennia, while contemporary galleries in Mitte and Kreuzberg push artistic boundaries.

    Berlin's legendary nightlife needs no introduction – from underground techno temples to rooftop bars with panoramic views. The city's diverse culinary scene ranges from traditional beer gardens to Michelin-starred restaurants, reflecting its multicultural character.`,
    image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&q=80',
    images: {
      hero: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1600&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?w=800&q=80',
        'https://images.unsplash.com/photo-1566404791232-af9fe0ae8f8b?w=800&q=80',
        'https://images.unsplash.com/photo-1587330979470-3595ac045ab0?w=800&q=80'
      ]
    },
    highlights: [
      'Brandenburg Gate and Berlin Wall',
      'Museum Island UNESCO site',
      'Vibrant nightlife scene',
      'Diverse neighborhoods',
      'Tech and startup hub'
    ],
    bestTime: 'May - September',
    temperature: '15-25°C (summer), -2 to 5°C (winter)',
    currency: 'Euro (€)',
    language: 'German, English widely spoken',
    timezone: 'Central European Time (CET)',
    activities: [
      'Museum visits',
      'Historical tours',
      'Nightlife',
      'Street art tours',
      'Shopping',
      'Beer gardens'
    ]
  },
  {
    id: 5,
    name: 'Santorini',
    slug: 'santorini',
    country: 'Greece',
    continent: 'Europe',
    type: ['beach', 'island'],
    climate: 'Mediterranean',
    region: 'Mediterranean',
    description: 'Iconic white-washed buildings, breathtaking sunsets, and volcanic beaches.',
    longDescription: `Santorini, the crown jewel of the Aegean, captivates with its dramatic caldera views, pristine white architecture, and legendary sunsets. This volcanic island offers a perfect blend of natural beauty, ancient history, and contemporary luxury.

    The island's unique geography, shaped by one of history's largest volcanic eruptions, creates an otherworldly landscape. White-washed cave houses cling to cliffsides in Oia and Fira, their blue-domed churches creating the postcard-perfect scenes Santorini is famous for.

    Beyond the iconic views, Santorini surprises with its diverse beaches – from the black sands of Kamari to the red beach near Akrotiri. The island's volcanic soil produces exceptional wines, particularly the crisp Assyrtiko, best enjoyed while watching the sun dip below the horizon.`,
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
    images: {
      hero: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1600&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
        'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80',
        'https://images.unsplash.com/photo-1560703650-ef3e0f254ae0?w=800&q=80'
      ]
    },
    highlights: [
      'Caldera views and sunsets',
      'White-washed architecture',
      'Volcanic beaches',
      'Local wine production',
      'Archaeological sites'
    ],
    bestTime: 'April - October',
    temperature: '20-28°C',
    currency: 'Euro (€)',
    language: 'Greek, English widely spoken',
    timezone: 'Eastern European Time (EET)',
    activities: [
      'Sunset watching',
      'Wine tasting',
      'Boat tours',
      'Beach relaxation',
      'Photography',
      'Archaeological visits'
    ]
  },
  {
    id: 6,
    name: 'Tuscany',
    slug: 'tuscany',
    country: 'Italy',
    continent: 'Europe',
    type: ['countryside'],
    climate: 'Mediterranean',
    region: 'Mediterranean',
    description: 'Rolling hills, historic villages, world-class wines, and Renaissance art.',
    longDescription: `Tuscany embodies the essence of la dolce vita with its rolling hills, medieval hilltop towns, and Renaissance treasures. This enchanting region offers a perfect blend of cultural richness, culinary excellence, and natural beauty that has inspired artists and travelers for centuries.

    From Florence's magnificent art galleries to Siena's medieval charm, Tuscany's cities overflow with history and culture. The countryside reveals a different magic – cypress-lined roads winding through vineyards, olive groves stretching to the horizon, and ancient villages where time seems to stand still.

    Tuscany's culinary heritage is legendary. Savor Chianti wines in centuries-old cellars, indulge in perfectly simple dishes made with the finest local ingredients, and discover why Tuscan cuisine has conquered hearts worldwide.`,
    image: 'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=800&q=80',
    images: {
      hero: 'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=1600&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1541370976299-4d24ebbc9077?w=800&q=80',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        'https://images.unsplash.com/photo-1534445867742-43195f401b6c?w=800&q=80'
      ]
    },
    highlights: [
      'Renaissance art and architecture',
      'World-famous wine regions',
      'Medieval hilltop towns',
      'Tuscan cuisine',
      'Rolling countryside'
    ],
    bestTime: 'April - October',
    temperature: '15-28°C',
    currency: 'Euro (€)',
    language: 'Italian',
    timezone: 'Central European Time (CET)',
    activities: [
      'Wine tours',
      'Art and museums',
      'Cooking classes',
      'Cycling',
      'Hot air ballooning',
      'Villa stays'
    ]
  }
];

// Fetch destination data from API
async function fetchDestination(slug, locale) {
  try {
    // In server components, we can use internal API calls directly
    const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
    
    // Use public token for API access
    const DIRECTUS_TOKEN = process.env.DIRECTUS_PUBLIC_TOKEN || process.env.DIRECTUS_TOKEN;
    
    // First fetch the destination ID
    const idResponse = await fetch(
      `${DIRECTUS_URL}/items/destinations?fields=id&filter[slug][_eq]=${slug}&filter[status][_eq]=published`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': DIRECTUS_TOKEN ? `Bearer ${DIRECTUS_TOKEN}` : undefined
        },
        next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_DESTINATION ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_DESTINATION) : 600 }
      }
    );
    
    const idData = await idResponse.json();
    const destinationId = idData.data?.[0]?.id;
    
    if (!destinationId) {
      return null;
    }
    
    // Then fetch the full destination with relations
    const response = await fetch(
      `${DIRECTUS_URL}/items/destinations/${destinationId}?fields=*,images.directus_files_id.*,gallery.directus_files_id.*,selected_hotels.hotels_id.*,selected_restaurants.hotel_restaurants_id.*`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': DIRECTUS_TOKEN ? `Bearer ${DIRECTUS_TOKEN}` : undefined
        },
        next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_DESTINATION ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_DESTINATION) : 600 }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch destination');
    }

    const destinationData = await response.json();
    const destination = destinationData.data;
    
    console.log('Raw destination from Directus:', {
      id: destination?.id,
      name: destination?.name,
      selected_hotels_count: destination?.selected_hotels?.length || 0,
      selected_restaurants_count: destination?.selected_restaurants?.length || 0
    });
    
    if (!destination) {
      return null;
    }

    // Process selected hotels
    let destinationHotels = [];
    if (destination.selected_hotels && Array.isArray(destination.selected_hotels)) {
      destinationHotels = destination.selected_hotels.map(item => {
        const hotel = item.hotels_id;
        if (!hotel) return null;
        
        // Map to the structure expected by HotelsSection
        return {
          id: hotel.id,
          name: hotel.name,
          slug: hotel.slug,
          description: hotel.meta_description || '',
          image: hotel.featured_image ? `${DIRECTUS_URL}/assets/${hotel.featured_image}` : hotel.hero_image ? `${DIRECTUS_URL}/assets/${hotel.hero_image}` : null,
          price: hotel.price_from ? `From €${hotel.price_from}/night` : '',
          rating: hotel.rating || 0,
          amenities: hotel.amenities ? JSON.parse(hotel.amenities) : [],
          location: hotel.location,
          region: hotel.region,
          stars: hotel.stars
        };
      }).filter(Boolean);
      
      // Fetch translations for hotels
      if (destinationHotels.length > 0) {
        const hotelIds = destinationHotels.map(h => h.id).join(',');
        try {
          const hotelTransResponse = await fetch(
            `${DIRECTUS_URL}/items/hotel_translations?filter[hotel_id][_in]=${hotelIds}&filter[language_code][_eq]=${locale}`,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': DIRECTUS_TOKEN ? `Bearer ${DIRECTUS_TOKEN}` : undefined
              },
              next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_TRANSLATIONS ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_TRANSLATIONS) : 86400 }
            }
          );
          
          if (hotelTransResponse.ok) {
            const hotelTransData = await hotelTransResponse.json();
            const translationsMap = {};
            hotelTransData.data.forEach(trans => {
              translationsMap[trans.hotel_id] = trans;
            });
            
            // Merge translations
            destinationHotels = destinationHotels.map(hotel => ({
              ...hotel,
              description: translationsMap[hotel.id]?.short_description || translationsMap[hotel.id]?.description || hotel.description,
              amenities_text: translationsMap[hotel.id]?.amenities_text || hotel.amenities_text
            }));
          }
        } catch (error) {
          console.log('Could not fetch hotel translations');
        }
      }
    }
    
    // Process selected restaurants
    let destinationRestaurants = [];
    if (destination.selected_restaurants && Array.isArray(destination.selected_restaurants)) {
      destinationRestaurants = destination.selected_restaurants.map(item => {
        const restaurant = item.hotel_restaurants_id;
        if (!restaurant) return null;
        
        // Process restaurant images
        let restaurantImage = null;
        if (restaurant.images && Array.isArray(restaurant.images) && restaurant.images.length > 0) {
          const imageId = restaurant.images[0].directus_files_id || restaurant.images[0];
          restaurantImage = `${DIRECTUS_URL}/assets/${imageId}`;
        }
        
        return {
          id: restaurant.id,
          name: restaurant.name,
          cuisine_type: restaurant.cuisine_type || 'International',
          description: restaurant.description || '',
          image: restaurantImage,
          rating: restaurant.rating || 0,
          price_level: restaurant.price_level || '€€',
          opening_hours: restaurant.opening_hours,
          menu_link: restaurant.menu_link,
          // Add coordinates if needed for the map
          latitude: destination.latitude,
          longitude: destination.longitude
        };
      }).filter(Boolean);
      
      // Fetch translations for restaurants
      if (destinationRestaurants.length > 0) {
        const restaurantIds = destinationRestaurants.map(r => r.id).join(',');
        try {
          const restTransResponse = await fetch(
            `${DIRECTUS_URL}/items/restaurant_translations?filter[restaurant_id][_in]=${restaurantIds}&filter[language_code][_eq]=${locale}`,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': DIRECTUS_TOKEN ? `Bearer ${DIRECTUS_TOKEN}` : undefined
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
              cuisine_type: translationsMap[restaurant.id]?.cuisine_type || restaurant.cuisine_type,
              must_try: translationsMap[restaurant.id]?.must_try || restaurant.must_try
            }));
          }
        } catch (error) {
          console.log('Could not fetch restaurant translations');
        }
      }
    }

    // Process images
    let imageArray = [];
    if (destination.images && Array.isArray(destination.images) && destination.images.length > 0) {
      imageArray = destination.images.map(img => {
        const fileId = img.directus_files_id?.id || img.directus_files_id || img.id || img;
        return `${DIRECTUS_URL}/assets/${fileId}`;
      });
    }
    
    let heroImageUrl;
    if (destination.hero_image) {
      heroImageUrl = `${DIRECTUS_URL}/assets/${destination.hero_image}`;
    } else {
      heroImageUrl = imageArray[0];
    }
    
    // Process gallery images
    let galleryImages = [];
    if (destination.gallery && Array.isArray(destination.gallery)) {
      galleryImages = destination.gallery.map(item => {
        const fileId = item.directus_files_id?.id || item.directus_files_id;
        return `${DIRECTUS_URL}/assets/${fileId}`;
      });
    }

    // Fetch translation for this destination
    const translationResponse = await fetch(
      `${DIRECTUS_URL}/items/destinations_translations?filter[destination_id][_eq]=${destination.id}&filter[language_code][_eq]=${locale}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': DIRECTUS_TOKEN ? `Bearer ${DIRECTUS_TOKEN}` : undefined
        },
        next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_TRANSLATIONS ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_TRANSLATIONS) : 86400 }
      }
    );

    let translation = null;
    if (translationResponse.ok) {
      const translationData = await translationResponse.json();
      translation = translationData.data?.[0];
      console.log('Translation data fetched:', {
        locale: locale,
        translationId: translation?.id,
        tab_overview: translation?.tab_overview,
        tab_hotels: translation?.tab_hotels,
        hero_explore_button: translation?.hero_explore_button
      });
    }

    const result = {
      id: destination.id,
      slug: destination.slug,
      name: destination.name,
      images: imageArray.length > 0 ? imageArray : [],
      hero_image: heroImageUrl,
      gallery: galleryImages,
      description: translation?.description || '',
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
      selectedHotels: destinationHotels, // Now includes translations
      selectedRestaurants: destinationRestaurants, // Now includes translations
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
    };
    
    console.log('fetchDestination returning:', {
      locale: locale,
      name: result.name,
      selectedHotelsCount: result.selectedHotels.length,
      selectedRestaurantsCount: result.selectedRestaurants.length,
      firstHotel: result.selectedHotels[0],
      firstHotelDescription: result.selectedHotels[0]?.description
    });
    
    return result;
  } catch (error) {
    console.error('Error fetching destination:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  try {
    const destination = await fetchDestination(params.slug, params.locale);
    
    if (!destination) {
      return {
        title: 'Destination Not Found - CinCin Hotels',
        description: 'The requested destination could not be found.'
      };
    }

    const metadata = {
      de: {
        title: `${destination.name} - Reiseziel | CinCin Hotels`,
        description: `Entdecken Sie ${destination.name}: ${destination.description || ''}`,
      },
      en: {
        title: `${destination.name} - Destination | CinCin Hotels`,
        description: `Discover ${destination.name}: ${destination.description || ''}`,
      }
    };

    return {
      ...metadata[params.locale] || metadata.en,
      openGraph: {
        ...metadata[params.locale] || metadata.en,
        images: [
          {
            url: destination.hero_image || destination.images?.[0],
            width: 1200,
            height: 630,
            alt: destination.name,
          },
        ],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Destination - CinCin Hotels',
      description: 'Discover amazing destinations with CinCin Hotels.'
    };
  }
}

export default async function DestinationPage({ params }) {
  const { slug, locale } = params;
  
  try {
    // Fetch destination from API
    const destination = await fetchDestination(slug, locale);
    
    if (!destination) {
      notFound();
    }

    console.log('Fetched destination data:', {
      locale: locale,
      name: destination.name,
      hotelsCount: destination.selectedHotels?.length || 0,
      restaurantsCount: destination.selectedRestaurants?.length || 0,
      tab_overview: destination.tab_overview,
      tab_hotels: destination.tab_hotels,
      hero_explore_button: destination.hero_explore_button,
      overview_destination: destination.overview_destination
    });

    // Transform data to match component expectations
    const destinationData = {
      ...destination,
      language_code: locale, // Add locale for components
      longDescription: destination.overview_content || '',
      images: destination.images || [], // Direct images array for "Capturing the Essence"
      gallery: destination.gallery || [], // Separate gallery if needed
      highlights: [], // Can be parsed from content or added as field
      activities: [], // Can be parsed from activities_description
      hotels: destination.selectedHotels || [], // Map selectedHotels to hotels
      restaurants: destination.selectedRestaurants || [] // Map selectedRestaurants to restaurants
    };

    console.log('Passing to component:', {
      hotelsCount: destinationData.hotels.length,
      firstHotel: destinationData.hotels[0]?.name
    });

    return <DestinationDetailPage destination={destinationData} />;
  } catch (error) {
    console.error('Error fetching destination:', error);
    
    // Fallback to mock data
    const destination = mockDestinations.find(d => d.slug === slug);
    if (!destination) {
      notFound();
    }
    
    // Transform data for the component
    const destinationData = {
      ...destination,
      image: destination.images?.hero || destination.image,
    };

    return <DestinationDetailPage destination={destinationData} />;
  }
}