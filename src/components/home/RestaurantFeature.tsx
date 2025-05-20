// @ts-nocheck
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useFeatureInteraction } from '../../hooks/useFeatureInteraction';
import BaseFeature from '../../../components/ui/BaseFeature';
import { RestaurantFeatureItem } from '../../types/advanced-ui';

interface RestaurantFeatureProps {
  /** Section title */
  title?: string;
  /** Section subtitle */
  subtitle?: string;
  /** Restaurants to display */
  restaurants: RestaurantFeatureItem[];
  /** Allow locking selection */
  enableLock?: boolean;
  /** Initial selected restaurant ID */
  initialSelectedId?: number;
}

/**
 * RestaurantFeature Component
 * 
 * Displays a list of restaurant options that change the main image on interaction
 */
export default function RestaurantFeature({
  title = "CinCin's Picks of the Week: Best Food & Drinks",
  subtitle,
  restaurants = [],
  enableLock = true,
  initialSelectedId,
}: RestaurantFeatureProps) {
  // Find initial active restaurant index
  const initialIndex = initialSelectedId 
    ? restaurants.findIndex(r => r.id === initialSelectedId) 
    : 0;
    
  const [activeRestaurant, setActiveRestaurant] = useState(initialIndex >= 0 ? initialIndex : 0);
  const [locked, setLocked] = useState(false);
  
  // Create interaction hooks for each restaurant
  const restaurantInteractions = restaurants.map((restaurant, index) => 
    useFeatureInteraction({
      featureId: `restaurant-feature-${restaurant.id}`,
      initialState: index === activeRestaurant ? 'active' : 'idle',
      tooltip: {
        enabled: true,
        position: 'right',
        text: enableLock ? 'Click to lock selection' : 'Hover to view details',
        showArrow: true,
        autoHideDelay: 2000,
      },
      onInteraction: (type, id) => {
        if (type === 'hover' && !locked) {
          setActiveRestaurant(index);
        } else if (type === 'click' && enableLock) {
          setActiveRestaurant(index);
          setLocked(true);
        }
      },
    })
  );
  
  // Use a separate hook for the main image
  const imageInteraction = useFeatureInteraction({
    featureId: 'restaurant-feature-image',
    highlight: {
      enabled: true,
      effect: 'none',
      duration: 800,
    },
    onInteraction: (type) => {
      if (type === 'click' && locked) {
        // Unlock selection when clicking the image while locked
        setLocked(false);
      }
    },
  });
  
  // Handler for mouse enter
  const handleMouseEnter = (index: number) => {
    if (!locked) {
      setActiveRestaurant(index);
      restaurantInteractions[index].highlight();
    }
  };

  // Handler for click
  const handleClick = (index: number) => {
    setActiveRestaurant(index);
    if (enableLock) {
      setLocked(true);
      restaurantInteractions[index].activate();
    }
  };
  
  // Create the visual content (current restaurant image)
  const restaurantImage = (
    <div 
      className="relative h-auto md:h-full rounded-xl overflow-hidden"
      style={{ minHeight: '300px', height: '100%' }}
      {...imageInteraction.getFeatureProps()}
    >
      {restaurants.map((restaurant, index) => (
        <div 
          key={restaurant.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === activeRestaurant ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ 
            minHeight: '300px', 
            height: '100%',
            pointerEvents: index === activeRestaurant ? 'auto' : 'none' 
          }}
        >
          <Image
            src={restaurant.image}
            alt={restaurant.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 58%, 50vw"
            className="object-cover"
          />
          {restaurant.menu && (
            <div className="absolute bottom-6 right-6">
              <Link
                href={restaurant.menu}
                className="px-6 py-2 bg-white text-black rounded-md hover:bg-white/90 transition-colors text-sm font-brooklyn"
              >
                Menu
              </Link>
            </div>
          )}
        </div>
      ))}
      
      {locked && (
        <div className="absolute top-4 right-4 bg-white/90 rounded-full p-1.5 shadow-md cursor-pointer"
          onClick={() => {
            setLocked(false);
            restaurantInteractions[activeRestaurant].deactivate();
          }}
          title="Unlock selection"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      )}
    </div>
  );
  
  // Create the feature content (restaurant list)
  const restaurantList = (
    <>
      {subtitle && (
        <p className="text-gray-600 mb-6 font-brooklyn">{subtitle}</p>
      )}
      
      <div className="space-y-5">
        {restaurants.map((restaurant, index) => (
          <div 
            key={restaurant.id} 
            className="cursor-pointer"
            onMouseEnter={() => handleMouseEnter(index)}
            onClick={() => handleClick(index)}
            {...restaurantInteractions[index].getFeatureProps()}
          >
            <div className={`transition-all duration-200 rounded-md p-2 ${
              index === activeRestaurant 
                ? (locked ? 'bg-brand-olive-600' : 'bg-brand-olive-400') 
                : 'hover:bg-brand-olive-50'
            } ${
              index === activeRestaurant ? 'text-white' : 'text-gray-800'
            }`}>
              <h3 className="text-lg font-normal mb-0.5 font-brooklyn">
                {restaurant.name}
                {index === activeRestaurant && locked && (
                  <span className="ml-2 inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                  </span>
                )}
              </h3>
              <p className={`text-sm leading-tight font-brooklyn ${
                index === activeRestaurant ? 'text-gray-100' : 'text-gray-600'
              }`}>
                {restaurant.description}
              </p>
            </div>
            
            {restaurantInteractions[index].isTooltipVisible && (
              <div
                {...restaurantInteractions[index].getTooltipProps()}
                className="absolute z-10 px-3 py-2 bg-gray-800 text-white text-sm rounded shadow-lg whitespace-nowrap ml-2"
              >
                {restaurantInteractions[index].tooltip?.text}
                <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 border-t-8 border-b-8 border-r-8 border-transparent border-r-gray-800" />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {locked && (
        <div className="mt-5 text-sm text-gray-500 font-brooklyn">
          <button 
            onClick={() => {
              setLocked(false);
              restaurantInteractions[activeRestaurant].deactivate();
            }}
            className="text-brand-olive-600 hover:text-brand-olive-800 underline"
          >
            Click here to unlock selection
          </button>
        </div>
      )}
    </>
  );
  
  return (
    <BaseFeature
      featureId="restaurant-feature"
      title={title}
      layout="content-right"
      visualContent={restaurantImage}
      featureContent={restaurantList}
      backgroundColor="#f1f3ee"
    />
  );
}