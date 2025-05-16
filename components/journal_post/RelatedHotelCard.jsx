'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function RelatedHotelCard({ hotel }) {
  if (!hotel) return null;
  
  // Handle different formats of hotel data
  const hotelData = processHotelData(hotel);
  if (!hotelData) return null;
  
  const { title, slug, image, excerpt } = hotelData;
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link href={slug} className="block">
        <div className="relative overflow-hidden">
          <Image 
            src={image} 
            alt={title}
            width={388}
            height={316}
            className="w-full h-64 object-cover transition-transform hover:scale-105 duration-500"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={slug}>
          <h3 className="text-xl font-semibold mb-2 hover:text-blue-600 transition-colors">{title}</h3>
        </Link>
        
        <p className="text-gray-600 text-sm mt-4 line-clamp-3">{excerpt}</p>
      </div>
    </div>
  );
}

// Helper function to process different hotel data formats
function processHotelData(hotel) {
  // Case 1: Already formatted object with necessary properties
  if (hotel && typeof hotel === 'object' && hotel.title && hotel.slug) {
    return {
      title: hotel.title,
      slug: hotel.slug,
      image: hotel.image || '/images/hotels/hotel-placeholder.jpg',
      excerpt: hotel.excerpt || 'Discover this beautiful hotel'
    };
  }
  
  // Case 2: String slug (e.g., "forestis" or "schgaguler-hotel")
  if (typeof hotel === 'string') {
    const displayName = hotel.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    return {
      title: displayName,
      slug: `/hotels/${hotel}`,
      image: `/images/hotels/hotel-${Math.floor(Math.random() * 7) + 1}.jpg`,
      excerpt: `Experience the unique atmosphere of ${displayName}`
    };
  }
  
  // Case 3: Object with just slug property
  if (hotel && typeof hotel === 'object' && hotel.slug && typeof hotel.slug === 'string') {
    const slug = hotel.slug.startsWith('/hotels/') ? hotel.slug : `/hotels/${hotel.slug}`;
    const baseSlug = slug.replace('/hotels/', '');
    const displayName = baseSlug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    return {
      title: hotel.title || displayName,
      slug: slug,
      image: hotel.image || `/images/hotels/hotel-${Math.floor(Math.random() * 7) + 1}.jpg`,
      excerpt: hotel.excerpt || `Experience the unique atmosphere of ${displayName}`
    };
  }
  
  // Unknown format - return null to skip rendering
  console.warn('Unprocessable hotel data format:', hotel);
  return null;
}