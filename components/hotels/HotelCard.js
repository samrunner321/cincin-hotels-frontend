import Link from 'next/link';
import Image from 'next/image';
import AmenityIcon from '../common/AmenityIcon';

// Function to get the correct hotel image path based on slug
export function getHotelImage(slug, fallbackImage) {
  // Map hotel slugs to available images
  const imageMap = {
    'the-comodo': '/images/hotels/hotel-1.jpg',
    'schgaguler-hotel': '/images/hotels/hotel-schgaguler.jpg',
    'casa-cook-samos': '/images/hotels/hotel-2.jpg',
    'the-hoxton-paris': '/images/hotels/hotel-3.jpg',
    'forestis': '/images/hotels/hotel-4.jpg',
    'villa-honegg': '/images/hotels/hotel-5.jpg',
    'nomad-london': '/images/hotels/hotel-6.jpg',
    'vigilius-mountain-resort': '/images/hotels/hotel-7.jpg',
    'cheval-blanc-st-tropez': '/images/hotels/hotel-aurora.jpg',
    'michelberger-hotel': '/images/hotels/hotel-giardino.jpg',
    'rock-resort': '/images/hotels/hotel-rockresort.jpg'
  };

  // Try to get image from map, otherwise use fallback
  return imageMap[slug] || fallbackImage || '/images/hotels/hotel-4.jpg';
}

export default function HotelCard({ 
  id, 
  name, 
  location, 
  description, 
  image, 
  slug,
  extraInfo,
  amenities = []
}) {
  // Slug-Fallback und URL-Erzeugung
  const hotelUrl = `/hotels/${slug || id}`;
  
  // Beschreibung auf maximal 5 Zeilen begrenzen
  const truncatedDescription = description;

  return (
    <article className="overflow-hidden rounded-xl">
      <div className="flex flex-col h-full">
        {/* Bild-Container */}
        <div className="relative h-[460px] overflow-hidden rounded-xl group">
          <Link href={hotelUrl} aria-label={`View details for ${name}`}>
            <Image
              src={getHotelImage(slug, image)}
              alt={name || "Hotel exterior"}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 hover:scale-105"
              priority={false}
            />
          </Link>
          
          {/* Bookmark Icon */}
          <button 
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Bookmark this hotel"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Add bookmark functionality here
              console.log('Bookmark clicked for:', name);
            }}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-gray-700"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        </div>
        
        {/* Content-Container */}
        <div className="pt-4">
          <h3 className="text-xl font-normal">
            {name}
          </h3>
          
          {location && (
            <p className="text-gray-700 text-sm mb-3">
              {location}
            </p>
          )}
          
          {truncatedDescription && (
            <p className="text-gray-700 mb-1 line-clamp-3">{truncatedDescription}</p>
          )}
          
          {extraInfo && (
            <p className="text-gray-700 text-sm italic mb-3">{extraInfo}</p>
          )}
          
          {/* Hotel Amenities */}
          {amenities && amenities.length > 0 && (
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-gray-100">
              {amenities.slice(0, 4).map((amenity, index) => (
                <div key={amenity.id || index} className="flex items-center gap-1">
                  <div className="w-4 h-4 text-gray-500">
                    <AmenityIcon amenity={amenity} size={16} />
                  </div>
                  <span className="text-xs text-gray-600">{amenity.name}</span>
                </div>
              ))}
              {amenities.length > 4 && (
                <span className="text-xs text-gray-500">+{amenities.length - 4} more</span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}