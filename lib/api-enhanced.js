// Enhanced API functions that use the real Directus API

export async function getHotelBySlugEnhanced(slug, locale = 'de') {
  try {
    // Use the enhanced API with locale support
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/api/hotels/${slug}`, {
      headers: {
        'x-locale': locale
      },
      next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_HOTEL ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_HOTEL) : 300 }
    });
    
    if (!response.ok) {
      console.error('Failed to fetch hotel:', response.status);
      return null;
    }
    
    const hotelData = await response.json();
    
    // Add derived/calculated fields
    const enhancedHotel = {
      ...hotelData,
      priceRange: `€${hotelData.price_from}${hotelData.price_to ? ` - €${hotelData.price_to}` : '+'}`,
      starsArray: Array(hotelData.stars).fill(true),
      amenitiesArray: hotelData.amenities?.map(f => ({
        name: f,
        icon: getFeatureIcon(f)
      })) || [],
      // Ensure gallery is always an array
      gallery: hotelData.gallery || [],
      // Add placeholder rooms if none exist
      rooms: hotelData.rooms?.length > 0 ? hotelData.rooms : getPlaceholderRooms(hotelData.name)
    };
    
    return {
      data: enhancedHotel,
      meta: {
        updatedAt: new Date().toISOString(),
        locale: hotelData.current_locale
      }
    };
  } catch (error) {
    console.error('Error fetching hotel:', error);
    return null;
  }
}

function getFeatureIcon(feature) {
  const iconMap = {
    'WiFi': 'wifi',
    'Spa': 'spa',
    'Pool': 'pool',
    'Restaurant': 'restaurant',
    'Bar': 'wine',
    'Gym': 'fitness',
    'Beach': 'beach',
    'Ski Storage': 'ski',
    'Concierge': 'bell',
    'Beach Club': 'umbrella',
    'Beach Access': 'beach',
    'Yoga': 'meditation',
    'Water Sports': 'surfing'
  };
  
  return iconMap[feature] || 'star';
}

function getPlaceholderRooms(hotelName) {
  return [
    {
      id: 1,
      name: "Deluxe Room",
      size: "30m²",
      persons: 2,
      description: `Elegant room at ${hotelName} with modern amenities and comfortable furnishings.`,
      price: "€250",
      image: "/images/hotels/hotel-3.jpg"
    },
    {
      id: 2,
      name: "Junior Suite",
      size: "45m²",
      persons: 3,
      description: `Spacious suite at ${hotelName} with separate sitting area and premium amenities.`,
      price: "€380",
      image: "/images/hotels/hotel-4.jpg"
    },
    {
      id: 3,
      name: "Premium Suite",
      size: "65m²",
      persons: 4,
      description: `Luxury suite at ${hotelName} featuring a bedroom, living room, and stunning views.`,
      price: "€520",
      image: "/images/hotels/hotel-5.jpg"
    }
  ];
}

export default getHotelBySlugEnhanced;