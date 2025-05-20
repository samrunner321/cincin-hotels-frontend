'use client';

import Link from 'next/link';
import Image from 'next/image';

/**
 * Type for a hotel with all required fields
 */
interface FormattedHotel {
  title: string;
  slug: string;
  image: string;
  excerpt: string;
  id?: string;
  destination?: string;
  price?: string;
  rating?: number;
  features?: string[];
}

/**
 * Possible input formats for the hotel prop
 */
export type HotelProp = 
  | FormattedHotel 
  | { slug: string; title?: string; image?: string; excerpt?: string; id?: string; } 
  | string 
  | null 
  | undefined;

/**
 * Interface for component props
 */
interface RelatedHotelCardProps {
  hotel: HotelProp;
  showExcerpt?: boolean;
  placeholderImage?: string;
  className?: string;
  linkPrefix?: string;
}

/**
 * RelatedHotelCard Component
 * 
 * Displays a card with hotel information that can be related to an article or destination.
 * Handles different input formats and provides sensible defaults.
 */
export default function RelatedHotelCard({ 
  hotel,
  showExcerpt = true,
  placeholderImage = '/images/hotels/hotel-placeholder.jpg',
  className = '',
  linkPrefix = '/hotels'
}: RelatedHotelCardProps) {
  if (!hotel) return null;
  
  // Process hotel data to ensure consistent format
  const hotelData = processHotelData(hotel, placeholderImage, linkPrefix);
  if (!hotelData) return null;
  
  const { title, slug, image, excerpt, destination, price, rating, features } = hotelData;
  
  return (
    <div className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <Link href={slug} className="block">
        <div className="relative overflow-hidden">
          <Image 
            src={image} 
            alt={title}
            width={388}
            height={316}
            className="w-full h-64 object-cover transition-transform hover:scale-105 duration-500"
          />
          
          {/* Price tag if available */}
          {price && (
            <div className="absolute top-4 right-4">
              <div className="bg-white text-brand-olive-600 px-3 py-1 rounded-md font-semibold shadow-sm">
                {price}
              </div>
            </div>
          )}
          
          {/* Destination tag if available */}
          {destination && (
            <div className="absolute top-4 left-4">
              <div className="bg-white/80 text-gray-700 px-3 py-1 rounded-md text-sm">
                {destination}
              </div>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={slug}>
          <h3 className="text-xl font-semibold mb-2 hover:text-blue-600 transition-colors">{title}</h3>
        </Link>
        
        {/* Rating display if available */}
        {rating && (
          <div className="flex items-center my-2">
            {Array.from({ length: 5 }, (_, i) => (
              <svg 
                key={i} 
                className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        )}
        
        {/* Features if available */}
        {features && features.length > 0 && (
          <div className="flex flex-wrap gap-2 my-2">
            {features.slice(0, 3).map((feature, index) => (
              <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                {feature}
              </span>
            ))}
            {features.length > 3 && (
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                +{features.length - 3}
              </span>
            )}
          </div>
        )}
        
        {/* Excerpt if showExcerpt is true */}
        {showExcerpt && (
          <p className="text-gray-600 text-sm mt-4 line-clamp-3">{excerpt}</p>
        )}
      </div>
    </div>
  );
}

/**
 * Process different hotel data formats into a consistent structure
 */
function processHotelData(
  hotel: HotelProp, 
  placeholderImage: string,
  linkPrefix: string
): FormattedHotel | null {
  // Case 1: Already formatted object with necessary properties
  if (hotel && typeof hotel === 'object' && 'title' in hotel && hotel.title && 'slug' in hotel && hotel.slug) {
    return {
      title: hotel.title,
      slug: ensureFullPath(hotel.slug, linkPrefix),
      image: hotel.image || placeholderImage,
      excerpt: hotel.excerpt || `Discover the beautiful ${hotel.title} hotel`,
      ...(('destination' in hotel) && { destination: hotel.destination }),
      ...(('price' in hotel) && { price: hotel.price }),
      ...(('rating' in hotel) && { rating: hotel.rating }),
      ...(('features' in hotel) && { features: hotel.features })
    };
  }
  
  // Case 2: String slug (e.g., "forestis" or "schgaguler-hotel")
  if (typeof hotel === 'string') {
    const displayName = formatDisplayName(hotel);
    
    return {
      title: displayName,
      slug: ensureFullPath(hotel, linkPrefix),
      image: getRandomHotelImage(placeholderImage),
      excerpt: `Experience the unique atmosphere of ${displayName}`
    };
  }
  
  // Case 3: Object with just slug property
  if (hotel && typeof hotel === 'object' && 'slug' in hotel && hotel.slug && typeof hotel.slug === 'string') {
    const slug = ensureFullPath(hotel.slug, linkPrefix);
    const baseSlug = getBaseSlug(slug, linkPrefix);
    const displayName = 'title' in hotel && hotel.title ? hotel.title : formatDisplayName(baseSlug);
    
    return {
      title: displayName,
      slug: slug,
      image: 'image' in hotel && hotel.image ? hotel.image : getRandomHotelImage(placeholderImage),
      excerpt: 'excerpt' in hotel && hotel.excerpt ? hotel.excerpt : `Experience the unique atmosphere of ${displayName}`
    };
  }
  
  // Unknown format - return null to skip rendering
  console.warn('Unprocessable hotel data format:', hotel);
  return null;
}

/**
 * Helper function to ensure the slug has the full path
 */
function ensureFullPath(slug: string, prefix: string): string {
  if (slug.startsWith('/')) return slug;
  if (slug.startsWith('http')) return slug;
  return `${prefix}/${slug}`;
}

/**
 * Helper function to get the base slug from a full path
 */
function getBaseSlug(fullPath: string, prefix: string): string {
  return fullPath.replace(`${prefix}/`, '').replace(/^\//, '');
}

/**
 * Helper function to format a slug into a display name
 */
function formatDisplayName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Helper function to get a random hotel image for placeholders
 */
function getRandomHotelImage(fallback: string): string {
  try {
    const imageNum = Math.floor(Math.random() * 7) + 1;
    return `/images/hotels/hotel-${imageNum}.jpg`;
  } catch (error) {
    return fallback;
  }
}