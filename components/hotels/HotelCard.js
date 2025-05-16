import Link from 'next/link';
import Image from 'next/image';

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
  categories = [],
  slug,
  extraInfo,
  maxDescriptionLength = 120
}) {
  // Slug-Fallback und URL-Erzeugung
  const hotelUrl = `/hotels/${slug || id}`;
  
  // Beschreibung kürzen, wenn zu lang
  const truncatedDescription = description && description.length > maxDescriptionLength
    ? `${description.substring(0, maxDescriptionLength)}...`
    : description;

  return (
    <article className="overflow-hidden rounded-xl">
      <div className="flex flex-col h-full">
        {/* Bild-Container */}
        <div className="relative h-[460px] overflow-hidden rounded-xl">
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
            <p className="text-gray-700 mb-1">{truncatedDescription}</p>
          )}
          
          {extraInfo && (
            <p className="text-gray-700 text-sm italic mb-3">{extraInfo}</p>
          )}
          
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map(category => {
                const categorySlug = typeof category === 'string' 
                  ? category.toLowerCase().replace(/\s+/g, '-')
                  : '';
                
                return (
                  <Link 
                    key={category} 
                    href={`/categories/${categorySlug}`}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-2 py-1 rounded-full"
                    aria-label={`Browse ${category} hotels`}
                  >
                    {category}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}