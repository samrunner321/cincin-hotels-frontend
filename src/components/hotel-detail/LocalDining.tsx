// @ts-nocheck
/**
 * LocalDining Component
 * 
 * An interactive component for displaying dining options near hotels
 * in CinCin Hotels application with filtering, animations, and rich UI.
 */

import React, { useState, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRtl } from '../../hooks/useRtl';
import { useAnimation } from '../../hooks/useAnimation';
import { LocalDiningProps, Restaurant } from '../../types/advanced-ui';
import Image from 'next/image';

/**
 * Cuisine type definition
 */
interface CuisineType {
  id: string;
  name: string;
}

/**
 * RestaurantCard component for displaying a single restaurant
 */
const RestaurantCard: React.FC<{
  restaurant: Restaurant;
  index: number;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}> = React.memo(({ restaurant, index, isActive, onHover, onLeave, onClick }) => {
  const { getStaggerProps } = useAnimation();
  
  return (
    <motion.div
      {...getStaggerProps(index)}
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-xl overflow-hidden shadow-sm transform transition-all duration-300 hover:shadow-md`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <div className="relative">
        <div className="aspect-[4/3] relative">
          <Image 
            src={restaurant.image} 
            alt={restaurant.name} 
            fill
            className="object-cover"
          />
          
          {/* Price range */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs px-2 py-1 rounded-full font-brooklyn text-gray-700">
            {restaurant.priceRange}
          </div>
          
          {/* Distance badge */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-xs px-2 py-1 rounded-full font-brooklyn text-gray-700 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {restaurant.distance}
          </div>
        </div>
        
        {/* Info section */}
        <div className="p-5">
          <div className="mb-3">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-brooklyn text-lg text-gray-900">{restaurant.name}</h3>
              <span className="text-xs font-medium px-2 py-0.5 bg-brand-olive-50 text-brand-olive-600 rounded">
                {restaurant.cuisine}
              </span>
            </div>
            <p className="text-sm text-gray-500 line-clamp-2">
              {restaurant.description}
            </p>
          </div>
          
          {/* Signature dish */}
          <div className="py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Signature dish</p>
            <p className="text-sm font-brooklyn text-gray-700">{restaurant.signature}</p>
          </div>
          
          {/* Expand button with animation */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="pt-3 border-t border-gray-100"
              >
                <div className="flex justify-between items-center">
                  <button className="text-sm text-brand-olive-400 hover:text-brand-olive-500 font-brooklyn flex items-center">
                    View on map
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  
                  <button className="text-sm text-brand-olive-400 hover:text-brand-olive-500 font-brooklyn flex items-center">
                    Reserve table
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
});

RestaurantCard.displayName = 'RestaurantCard';

/**
 * Default restaurants data for when none is provided
 */
const defaultRestaurants: Restaurant[] = [
  {
    id: 1,
    name: 'Le Mont Blanc',
    type: 'fine',
    cuisine: 'French-Alpine',
    description: 'Michelin-starred restaurant offering innovative interpretations of Swiss classics with a panoramic Alpine backdrop.',
    image: '/images/hotels/hotel-1.jpg',
    priceRange: '€€€€',
    signature: 'Alpine herb crusted rack of lamb',
    distance: '5 min walk',
    coordinates: { lat: 46.3082, lng: 7.4794 }
  },
  {
    id: 2,
    name: 'Cervin',
    type: 'local',
    cuisine: 'Swiss Traditional',
    description: 'Cozy mountain restaurant specializing in authentic Valais dishes like raclette and fondue in a rustic Alpine setting.',
    image: '/images/hotels/hotel-2.jpg',
    priceRange: '€€',
    signature: 'Traditional cheese fondue with truffle',
    distance: '10 min walk',
    coordinates: { lat: 46.3080, lng: 7.4800 }
  },
  {
    id: 3,
    name: 'Chetzeron',
    type: 'fine',
    cuisine: 'Modern Alpine',
    description: 'Breathtaking dining at 2,112m elevation, featuring seasonal ingredients and stunning terrace views of the Alps.',
    image: '/images/hotels/hotel-3.jpg',
    priceRange: '€€€',
    signature: 'Perch fillets from Lake Geneva',
    distance: '20 min shuttle',
    coordinates: { lat: 46.3085, lng: 7.4780 }
  },
  {
    id: 4,
    name: 'La Desalpe',
    type: 'local',
    cuisine: 'Farm-to-Table',
    description: 'Charming restaurant serving fresh Alpine cuisine sourced directly from local farmers and the restaurant\'s own garden.',
    image: '/images/hotels/hotel-4.jpg',
    priceRange: '€€',
    signature: 'Seasonal vegetable tart',
    distance: '15 min walk',
    coordinates: { lat: 46.3070, lng: 7.4790 }
  },
  {
    id: 5,
    name: 'Giardino Gourmand',
    type: 'fine',
    cuisine: 'Italian',
    description: 'Refined Italian cuisine using premium ingredients, served in an elegant setting with a beautiful garden terrace.',
    image: '/images/hotels/hotel-5.jpg',
    priceRange: '€€€',
    signature: 'Wild mushroom risotto',
    distance: '8 min walk',
    coordinates: { lat: 46.3075, lng: 7.4795 }
  },
  {
    id: 6,
    name: 'Mountain Bistro',
    type: 'casual',
    cuisine: 'International',
    description: 'Relaxed dining spot with a varied menu of international favorites, perfect for a casual meal after a day outdoors.',
    image: '/images/hotels/hotel-6.jpg',
    priceRange: '€€',
    signature: 'Gourmet burgers with Alpine cheese',
    distance: '5 min walk',
    coordinates: { lat: 46.3079, lng: 7.4805 }
  }
];

/**
 * Default cuisine types if none are provided
 */
const defaultCuisineTypes: CuisineType[] = [
  { id: 'all', name: 'All' },
  { id: 'local', name: 'Local Cuisine' },
  { id: 'fine', name: 'Fine Dining' },
  { id: 'casual', name: 'Casual Eats' }
];

/**
 * LocalDining component for displaying restaurants near a hotel
 */
const LocalDining: React.FC<LocalDiningProps> = ({
  diningData,
  diningOptions,
  title = 'Food & Drinks',
  subtitle = 'Discover exceptional dining experiences near the hotel, from authentic local cuisine to fine dining establishments.',
  enableFilters = true,
  cuisineTypes,
  className = '',
  style,
  id,
  visible = true,
  rtlAware = true,
  animationVariant = 'fade',
  animationDelay = 0,
  animationDuration = 500,
  animationsEnabled = true,
  reducedMotion = false,
}) => {
  // State management
  const [activeType, setActiveType] = useState<string>('all');
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  
  // Refs
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  // RTL support
  const { isRtl, direction } = useRtl();
  
  // Get animation props
  const { getEntranceProps } = useAnimation({
    variant: animationVariant,
    animationsEnabled,
    duration: animationDuration / 1000,
    delay: animationDelay / 1000,
    reducedMotion
  });
  
  // Use provided data or defaults
  const restaurants = useMemo(() => diningData || diningOptions || defaultRestaurants, [diningData, diningOptions]);
  const types = useMemo(() => cuisineTypes || defaultCuisineTypes, [cuisineTypes]);
  
  // Filter restaurants based on selected type
  const filteredRestaurants = useMemo(() => 
    activeType === 'all' 
      ? restaurants 
      : restaurants.filter(restaurant => restaurant.type === activeType),
    [restaurants, activeType]
  );
  
  // Handler for type selection
  const handleTypeSelect = useCallback((typeId: string) => {
    setActiveType(typeId);
  }, []);
  
  // Handler for restaurant hover
  const handleRestaurantHover = useCallback((itemId: number | null) => {
    setHoveredItem(itemId);
  }, []);
  
  // Handler for restaurant click
  const handleRestaurantClick = useCallback(() => {
    // Implement restaurant click logic here
  }, []);
  
  // Exit early if not visible
  if (!visible) {
    return null;
  }
  
  return (
    <section 
      ref={sectionRef}
      className={`py-12 bg-gray-50 ${className}`}
      style={style}
      id={id}
      dir={rtlAware ? direction : undefined}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: reducedMotion ? 0 : 0.6 }}
          className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-brooklyn text-gray-900 mb-2">
              {title}
            </h2>
            <p className="text-gray-600 max-w-2xl">
              {subtitle}
            </p>
          </div>
          
          {/* Filter tabs */}
          {enableFilters && (
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              {types.map(type => (
                <button
                  key={type.id}
                  onClick={() => handleTypeSelect(type.id)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    activeType === type.id 
                      ? 'bg-brand-olive-400 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {type.name}
                </button>
              ))}
            </div>
          )}
        </motion.div>
        
        {/* Restaurants grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant, index) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              index={index}
              isActive={hoveredItem === restaurant.id}
              onHover={() => handleRestaurantHover(restaurant.id)}
              onLeave={() => handleRestaurantHover(null)}
              onClick={handleRestaurantClick}
            />
          ))}
        </div>
        
        {/* Concierge assistance */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: reducedMotion ? 0 : 0.6, delay: 0.5 }}
          className="mt-12 bg-brand-olive-50 p-6 rounded-xl"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-brooklyn text-gray-900 mb-2">Need dining recommendations?</h3>
              <p className="text-gray-600 mb-4 md:mb-0">
                Our concierge team can help you discover the perfect dining experience during your stay, from exclusive reservations to private chef services.
              </p>
            </div>
            <Link 
              href="/contact"
              className="whitespace-nowrap bg-brand-olive-400 text-white px-6 py-2.5 rounded-full font-brooklyn hover:bg-brand-olive-500 transition-colors"
            >
              Contact Concierge
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(LocalDining);