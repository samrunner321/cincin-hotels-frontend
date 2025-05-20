'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

/**
 * Interface for a hotel in a destination
 */
interface Hotel {
  id: number | string;
  name: string;
  location: string;
  description: string;
  image: string;
  url: string;
  price?: string;
  rating?: number;
  categories?: string[];
  features?: string[];
  stars?: number;
}

/**
 * Interface for component props
 */
interface DestinationHotelsProps {
  hotels: Hotel[];
  destinationName: string;
  title?: string;
  description?: string;
  viewAllUrl?: string;
  viewAllText?: string;
  backgroundColor?: string;
  maxHotels?: number;
}

/**
 * DestinationHotels Component
 * 
 * Displays a grid of hotels in a specific destination with hover effects
 * and animations.
 */
export default function DestinationHotels({ 
  hotels,
  destinationName,
  title,
  description,
  viewAllUrl = "/hotels",
  viewAllText = "View All Hotels",
  backgroundColor = "bg-brand-olive-50/30",
  maxHotels = 6
}: DestinationHotelsProps) {
  // Use provided title or generate default
  const displayTitle = title || `Hotels in ${destinationName}`;
  
  // Use provided description or generate default
  const displayDescription = description || 
    `Discover our handpicked selection of the finest hotels in ${destinationName}, each offering unique experiences and exceptional service.`;
  
  // Limit the number of hotels displayed
  const displayedHotels = hotels.slice(0, maxHotels);
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="hotels" className={`py-16 md:py-24 ${backgroundColor}`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-[1536px]">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-normal mb-4 font-brooklyn">
            {displayTitle}
          </h2>
          <p className="text-gray-600 max-w-3xl font-brooklyn">
            {displayDescription}
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {displayedHotels.map(hotel => (
            <motion.div key={hotel.id} variants={item}>
              <Link href={hotel.url} className="group block">
                <div className="relative h-[300px] rounded-xl overflow-hidden mb-4">
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="inline-block px-4 py-2 bg-white/90 text-gray-900 text-sm rounded-md font-brooklyn">
                      View Hotel
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-normal mb-1 font-brooklyn group-hover:text-brand-olive-400 transition-colors">
                      {hotel.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-2 font-brooklyn">{hotel.location}</p>
                  </div>
                  
                  {hotel.price && (
                    <p className="text-right text-brand-olive-500 font-brooklyn">
                      <span className="font-semibold">{hotel.price}</span>
                      <span className="text-sm text-gray-600 block">per night</span>
                    </p>
                  )}
                </div>
                
                <p className="text-gray-700 font-brooklyn">{hotel.description}</p>
                
                {/* Display hotel features if available */}
                {hotel.features && hotel.features.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {hotel.features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {feature}
                      </span>
                    ))}
                    {hotel.features.length > 3 && (
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{hotel.features.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                
                {/* Display star rating if available */}
                {hotel.stars && (
                  <div className="mt-2 flex items-center">
                    {Array.from({ length: 5 }, (_, i) => (
                      <svg 
                        key={i} 
                        className={`w-4 h-4 ${i < hotel.stars! ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Only show View All button if there are hotels displayed */}
        {displayedHotels.length > 0 && (
          <div className="mt-16 text-center">
            <Link 
              href={viewAllUrl} 
              className="inline-flex items-center px-8 py-3 bg-brand-olive-400 text-white hover:bg-brand-olive-500 transition-colors rounded-md font-brooklyn"
              aria-label={`View all hotels in ${destinationName}`}
            >
              <span>{viewAllText}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 ml-2" 
                viewBox="0 0 25 9" 
                fill="none"
                aria-hidden="true"
              >
                <path d="M24.3536 4.85355C24.5488 4.65829 24.5488 4.34171 24.3536 4.14645L21.1716 0.964466C20.9763 0.769204 20.6597 0.769204 20.4645 0.964466C20.2692 1.15973 20.2692 1.47631 20.4645 1.67157L23.2929 4.5L20.4645 7.32843C20.2692 7.52369 20.2692 7.84027 20.4645 8.03553C20.6597 8.2308 20.9763 8.2308 21.1716 8.03553L24.3536 4.85355ZM0 5H24V4H0V5Z" 
                  fill="currentColor"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}