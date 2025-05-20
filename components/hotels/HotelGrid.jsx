'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

// Helper function to get hotel image URL
const getHotelImage = (imageUrl, slug) => {
  if (imageUrl) return imageUrl;
  
  // Fallback images
  const fallbackImages = [
    '/images/hotels/hotel-1.jpg',
    '/images/hotels/hotel-2.jpg',
    '/images/hotels/hotel-3.jpg',
    '/images/hotels/hotel-4.jpg',
    '/images/hotels/hotel-5.jpg',
  ];
  
  // Use slug to consistently return the same fallback image for a hotel
  const index = slug ? 
    slug.charCodeAt(0) % fallbackImages.length : 
    Math.floor(Math.random() * fallbackImages.length);
    
  return fallbackImages[index];
};

// Animated hotel entry component
const AnimatedHotelEntry = ({ delay, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
};

// Hotel card component
const HotelCard = ({ 
  id, 
  name, 
  location,
  description,
  imageUrl,
  categories = [],
  slug,
  price_from,
  onClick
}) => {
  const hotelUrl = `/hotels/${slug || id}`;
  const truncatedDescription = description && description.length > 100
    ? `${description.substring(0, 100)}...`
    : description;
  
  return (
    <article className="overflow-hidden rounded-xl hover:shadow-lg transition-shadow duration-300 group">
      <div className="flex flex-col h-full">
        {/* Image container */}
        <div className="relative h-[320px] overflow-hidden rounded-xl">
          <div className="h-full w-full">
            <Image
              src={getHotelImage(imageUrl, slug)}
              alt={name || "Hotel exterior"}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
        
        {/* Content container */}
        <div className="pt-4">
          <h3 className="text-xl font-light">
            {name}
          </h3>
          
          {location && (
            <p className="text-gray-700 text-sm mb-3">
              {location}
            </p>
          )}
          
          {truncatedDescription && (
            <p className="text-gray-700 text-sm mb-3">{truncatedDescription}</p>
          )}
          
          {price_from && (
            <p className="text-gray-700 text-sm font-medium mt-3">From €{price_from}</p>
          )}
          
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.slice(0, 3).map((category, index) => (
                <span 
                  key={index}
                  className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full"
                >
                  {typeof category === 'string' ? category : category.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default function HotelGrid({ 
  hotels = [], 
  isLoading = false,
  error = null,
  title = "Discover Our Hotels",
  viewMode = "grid"
}) {
  const [selectedHotel, setSelectedHotel] = useState(null);
  
  // Handler for card click
  const handleCardClick = (e, hotel) => {
    e.preventDefault();
    setSelectedHotel(hotel);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin h-12 w-12 border-4 border-gray-200 rounded-full border-t-black"></div>
          </div>
        </div>
      </section>
    );
  }
  
  // Error state
  if (error) {
    return (
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-8">
            <h2 className="text-2xl font-normal text-gray-800 mb-4">Unable to load hotels</h2>
            <p className="text-gray-600 mb-6">{error.message || "Please try again later."}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }
  
  // Empty state
  if (hotels.length === 0) {
    return (
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-8 md:py-12 bg-gray-50 rounded-xl">
            <svg 
              className="w-16 h-16 text-gray-400 mx-auto mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              ></path>
            </svg>
            <h3 className="text-lg font-normal text-gray-900 mb-2">No hotels found</h3>
            <p className="text-gray-600">Try adjusting your search filters</p>
          </div>
        </div>
      </section>
    );
  }
  
  // Grid view
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {title && (
          <motion.h2 
            className="text-3xl font-light mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {title}
          </motion.h2>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-10 md:gap-y-16">
          {hotels.map((hotel, index) => {
            const delay = index * 0.1;
            return (
              <AnimatedHotelEntry key={hotel.id || index} delay={delay}>
                <Link href={`/hotels/${hotel.slug || hotel.id}`} passHref>
                  <div onClick={(e) => handleCardClick(e, hotel)}>
                    <HotelCard 
                      id={hotel.id}
                      name={hotel.name}
                      location={hotel.location}
                      description={hotel.short_description || hotel.description}
                      imageUrl={hotel.main_image_url || hotel.image}
                      categories={hotel.categories}
                      slug={hotel.slug}
                      price_from={hotel.price_from}
                    />
                  </div>
                </Link>
              </AnimatedHotelEntry>
            );
          })}
        </div>
      </div>
    </section>
  );
}