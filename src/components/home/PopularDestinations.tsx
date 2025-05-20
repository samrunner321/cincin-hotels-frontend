// @ts-nocheck
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import ResponsiveDirectusImage from '../../../components/common/ResponsiveDirectusImage';
import { BaseHeroProps, CtaButton, ImageObject } from '../../../components/ui/BaseHero';

/**
 * Destination interface with extended properties
 */
export interface Destination {
  id: number | string;
  name: string;
  country: string;
  description: string;
  image: string | ImageObject;
  url: string;
  region?: string;
  hotelCount?: number;
  isDirectusImage?: boolean;
}

/**
 * Hotel interface with extended properties
 */
export interface Hotel {
  id: number | string;
  name: string;
  image: string | ImageObject;
  url: string;
  location?: string;
  isDirectusImage?: boolean;
}

/**
 * Props for the PopularDestinations component
 */
export interface PopularDestinationsProps {
  /** Title of the section */
  title?: string;
  
  /** Subtitle or description text */
  subtitle?: string;
  
  /** List of featured destinations to display */
  featuredDestinations?: Destination[];
  
  /** List of hotels to display in the grid */
  hotels?: Hotel[];
  
  /** Optional CSS class name */
  className?: string;
  
  /** Button text for the view all link */
  viewAllText?: string;
  
  /** Link for the view all button */
  viewAllLink?: string;
  
  /** Function to call when a destination is clicked */
  onDestinationClick?: (destination: Destination) => void;
  
  /** Function to call when a hotel is clicked */
  onHotelClick?: (hotel: Hotel) => void;
  
  /** Number of destinations to display in a row on desktop */
  destinationsPerRow?: 1 | 2 | 3;
  
  /** Number of hotels to display in a row on desktop */
  hotelsPerRow?: 2 | 3 | 4;
  
  /** Whether to prioritize loading of images */
  imagePriority?: boolean;
  
  /** Whether to animate elements on scroll */
  animate?: boolean;
  
  /** ID for the section (for navigation) */
  sectionId?: string;
}

/**
 * PopularDestinations Component
 * 
 * Displays featured destinations and hotels in a visually appealing grid layout
 * with smooth animations and hover effects.
 */
export default function PopularDestinations({ 
  title = "Popular Destinations",
  subtitle,
  featuredDestinations = [
    {
      id: 1,
      name: "South Tyrol",
      country: "Italy",
      description: "Alpine beauty with Dolomite peaks, charming villages, and exceptional cuisine.",
      image: "/images/south-tyrol.jpg",
      url: "/destinations/south-tyrol"
    },
    {
      id: 2,
      name: "Bretagne",
      country: "France",
      description: "Rugged coastlines, medieval towns, and a rich maritime heritage.",
      image: "/images/bretagne.jpg",
      url: "/destinations/bretagne"
    }
  ],
  hotels = [
    {
      id: 1,
      name: "Schgaguler Hotel",
      image: "/images/hotel-schgaguler.jpg",
      url: "/hotels/schgaguler-hotel"
    },
    {
      id: 2,
      name: "Rockresort",
      image: "/images/hotel-rockresort.jpg",
      url: "/hotels/rockresort"
    },
    {
      id: 3,
      name: "Giardino Mountain",
      image: "/images/hotel-giardino.jpg",
      url: "/hotels/giardino-mountain"
    },
    {
      id: 4,
      name: "Aurora Spa Villas",
      image: "/images/hotel-aurora.jpg",
      url: "/hotels/aurora-spa-villas"
    }
  ],
  className = "",
  viewAllText = "View All Destinations",
  viewAllLink = "/destinations",
  onDestinationClick,
  onHotelClick,
  destinationsPerRow = 2,
  hotelsPerRow = 4,
  imagePriority = false,
  animate = true,
  sectionId = "popular-destinations"
}: PopularDestinationsProps): JSX.Element {
  // Animation variants
  const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.2
      }
    }
  };

  const itemFadeIn: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6 } 
    }
  };

  // Helper function to handle destination click
  const handleDestinationClick = (destination: Destination) => {
    if (onDestinationClick) {
      onDestinationClick(destination);
    }
  };

  // Helper function to handle hotel click
  const handleHotelClick = (hotel: Hotel) => {
    if (onHotelClick) {
      onHotelClick(hotel);
    }
  };

  // Determine grid columns for destinations
  const destinationGridCols = {
    1: "grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3"
  };

  // Determine grid columns for hotels
  const hotelGridCols = {
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4"
  };

  return (
    <section id={sectionId} className={`py-16 md:py-24 ${className}`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-[1536px]">
        {/* Section Title */}
        <motion.div
          initial={animate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-normal font-brooklyn text-gray-900">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 text-lg text-gray-600 max-w-3xl">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Featured Destinations - Two Columns */}
        <motion.div
          variants={staggerContainer}
          initial={animate ? "hidden" : "visible"}
          whileInView="visible"
          viewport={{ once: true }}
          className={`grid grid-cols-1 ${destinationGridCols[destinationsPerRow]} gap-6 mb-10`}
        >
          {featuredDestinations.map((destination) => (
            <motion.div 
              key={destination.id} 
              variants={itemFadeIn}
              onClick={() => handleDestinationClick(destination)}
            >
              <Link
                href={destination.url}
                className="group block overflow-hidden rounded-xl"
                aria-label={`Explore ${destination.name}, ${destination.country}`}
              >
                <div className="relative h-60 md:h-80 w-full overflow-hidden">
                  {typeof destination.image === 'string' ? (
                    <Image
                      src={destination.image}
                      alt={destination.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority={imagePriority}
                    />
                  ) : destination.isDirectusImage && destination.image ? (
                    <ResponsiveDirectusImage
                      fileId={typeof destination.image !== 'string' ? (destination.image.fileId || destination.image.id) : ''}
                      alt={destination.name}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={imagePriority}
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                    <p className="text-brand-olive-200 text-sm uppercase tracking-wider font-brooklyn mb-1">
                      {destination.country}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-normal font-brooklyn mb-2">
                      {destination.name}
                    </h3>
                    <p className="text-white/80 text-sm md:text-base font-brooklyn mb-3 max-w-md">
                      {destination.description}
                    </p>
                    <span className="inline-flex items-center text-sm font-brooklyn">
                      Explore
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
                        viewBox="0 0 25 9" 
                        fill="none"
                        aria-hidden="true"
                      >
                        <path d="M24.3536 4.85355C24.5488 4.65829 24.5488 4.34171 24.3536 4.14645L21.1716 0.964466C20.9763 0.769204 20.6597 0.769204 20.4645 0.964466C20.2692 1.15973 20.2692 1.47631 20.4645 1.67157L23.2929 4.5L20.4645 7.32843C20.2692 7.52369 20.2692 7.84027 20.4645 8.03553C20.6597 8.2308 20.9763 8.2308 21.1716 8.03553L24.3536 4.85355ZM0 5H24V4H0V5Z" 
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Hotels Grid */}
        <motion.div
          variants={staggerContainer}
          initial={animate ? "hidden" : "visible"}
          whileInView="visible"
          viewport={{ once: true }}
          className={`grid grid-cols-1 sm:grid-cols-2 ${hotelGridCols[hotelsPerRow]} gap-4 md:gap-6`}
        >
          {hotels.map((hotel) => (
            <motion.div 
              key={hotel.id} 
              variants={itemFadeIn}
              onClick={() => handleHotelClick(hotel)}
            >
              <Link 
                href={hotel.url}
                className="group relative block h-48 rounded-xl overflow-hidden"
                aria-label={`View details of ${hotel.name}`}
              >
                <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
                  {typeof hotel.image === 'string' ? (
                    <Image
                      src={hotel.image}
                      alt={hotel.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                      priority={imagePriority}
                    />
                  ) : hotel.isDirectusImage && hotel.image ? (
                    <ResponsiveDirectusImage
                      fileId={typeof hotel.image !== 'string' ? (hotel.image.fileId || hotel.image.id) : ''}
                      alt={hotel.name}
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      priority={imagePriority}
                    />
                  ) : null}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 text-white">
                  <h4 className="text-xl font-normal font-brooklyn">{hotel.name}</h4>
                  {hotel.location && (
                    <p className="text-white/80 text-sm mt-1">{hotel.location}</p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Link */}
        <div className="mt-10 text-center">
          <Link 
            href={viewAllLink} 
            className="inline-flex items-center px-6 py-3 border border-brand-olive-400 text-brand-olive-400 hover:bg-brand-olive-400 hover:text-white transition-colors rounded-md font-brooklyn"
            aria-label={viewAllText}
          >
            {viewAllText}
          </Link>
        </div>
      </div>
    </section>
  );
}