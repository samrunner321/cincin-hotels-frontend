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
export async function getAllHotels() {
  // In a real implementation, this would be a fetch call to your API
  return {
    data: hotels,
    meta: {
      total: hotels.length
    }
  };
}

export async function getHotelBySlug(slug) {
  // Find hotel by slug
  const hotel = hotels.find(h => h.slug === slug);
  
  // If hotel not found, return null
  if (!hotel) {
    return null;
  }
  
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
      updatedAt: new Date().toISOString()
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
export async function getAllDestinations() {
  return {
    data: destinations,
    meta: {
      total: destinations.length
    }
  };
}

export async function getDestinationBySlug(slug) {
  const destination = destinations.find(d => d.slug === slug);
  
  if (!destination) {
    return null;
  }
  
  // Find all hotels in this destination
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
  // Sort articles by date (newest first) and take the specified limit
  const sortedArticles = [...journalArticles].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  ).slice(0, limit);
  
  return {
    data: sortedArticles,
    meta: {
      total: sortedArticles.length
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
            image: hotelData.images?.[0] || hotelData.image || `/images/hotels/hotel-${Math.floor(Math.random() * 7) + 1}.jpg`,
            excerpt: hotelData.description,
            slug: `/hotels/${hotelData.slug}`
          };
        } else {
          // If hotel not found in data, create a minimal object with the slug
          return {
            id: hotelSlug,
            title: hotelSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            image: `/images/hotels/hotel-${Math.floor(Math.random() * 7) + 1}.jpg`,
            excerpt: `Discover this beautiful hotel.`,
            slug: `/hotels/${hotelSlug}`
          };
        }
      })
    : [];
    
  // If no related hotels specified, grab a few random ones
  const relatedHotels = processedRelatedHotels.length > 0
    ? processedRelatedHotels
    : hotels.slice(0, 3).map(hotel => ({
        id: hotel.id,
        title: hotel.name,
        image: hotel.images?.[0] || hotel.image || `/images/hotels/hotel-${Math.floor(Math.random() * 7) + 1}.jpg`,
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