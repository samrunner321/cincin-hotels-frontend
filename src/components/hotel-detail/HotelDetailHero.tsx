'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import BaseHero, { BaseHeroProps, CtaButton, ImageObject } from '../ui/BaseHero';
import Link from 'next/link';

/**
 * Type for category tag
 */
export interface CategoryTag {
  id?: string;
  name: string;
  slug?: string;
}

/**
 * Hotel interface
 */
export interface Hotel {
  id?: string | number;
  name: string;
  location?: string;
  description?: string;
  shortDescription?: string;
  heroImage?: string | ImageObject;
  image?: string | ImageObject;
  slug?: string;
  rating?: number;
  ratingCount?: number;
  price?: string | number;
  currency?: string;
  categoryTags?: CategoryTag[] | string[];
  isDirectusImage?: boolean;
}

/**
 * Props for HotelDetailHero component
 */
export interface HotelDetailHeroProps {
  /** Hotel data to display */
  hotel?: Hotel;
  
  /** Hotel name (if not using hotel object) */
  hotelName?: string;
  
  /** Hotel location (if not using hotel object) */
  location?: string;
  
  /** Hotel description (if not using hotel object) */
  description?: string;
  
  /** Background image URL or object (if not using hotel object) */
  backgroundImage?: string | ImageObject;
  
  /** Hotel slug (if not using hotel object) */
  slug?: string;
  
  /** Hotel rating (if not using hotel object) */
  rating?: number;
  
  /** Hotel rating count (if not using hotel object) */
  ratingCount?: number;
  
  /** Hotel price (if not using hotel object) */
  price?: string | number;
  
  /** Category tags (if not using hotel object) */
  categoryTags?: CategoryTag[] | string[];
  
  /** Whether to use split layout (image on left, info on right) */
  useSplitLayout?: boolean;
  
  /** Background color for the info section */
  infoSectionColor?: string;
  
  /** Whether to show the scroll indicator */
  showScrollIndicator?: boolean;
  
  /** ID of the element to scroll to */
  scrollToId?: string;
  
  /** Whether to prioritize loading the hero image */
  imagePriority?: boolean;
  
  /** Book now button text */
  bookButtonText?: string;
  
  /** Book now button URL */
  bookButtonUrl?: string;
  
  /** Additional CSS class */
  className?: string;
  
  /** Callback when book button is clicked */
  onBookClick?: () => void;
}

/**
 * Helper function to get hotel image URL with fallback
 */
export const getHotelImage = (imageUrl?: string | ImageObject, slug?: string): string => {
  if (imageUrl) {
    if (typeof imageUrl === 'string') {
      return imageUrl;
    }
    if (imageUrl.url) {
      return imageUrl.url;
    }
  }
  
  // Fallback images
  const fallbackImages = [
    '/images/hotels/hotel-1.jpg',
    '/images/hotels/hotel-2.jpg',
    '/images/hotels/hotel-3.jpg',
    '/images/hotels/hotel-4.jpg',
    '/images/hotels/hotel-5.jpg',
  ];
  
  // Use slug to consistently return the same fallback image for a hotel
  const index = slug 
    ? slug.charCodeAt(0) % fallbackImages.length 
    : Math.floor(Math.random() * fallbackImages.length);
    
  return fallbackImages[index];
};

/**
 * Format price with currency
 */
export const formatPrice = (price: string | number, currency: string = '€'): string => {
  if (typeof price === 'number') {
    return `${currency}${price}`;
  }
  return price.startsWith(currency) ? price : `${currency}${price}`;
};

/**
 * HotelDetailHero Component
 * 
 * A hero section for hotel detail pages featuring a split layout with
 * image and info sections, or a full-width hero.
 */
export default function HotelDetailHero({
  hotel,
  hotelName = hotel?.name || "Hotel Schgaguler",
  location = hotel?.location || "Castelrotto, South Tyrol",
  description = hotel?.description || hotel?.shortDescription || "A sleek, modernist hotel nestled in the heart of the Dolomites, combining alpine tradition with contemporary design.",
  backgroundImage = hotel?.heroImage || hotel?.image || "/images/hotels/hotel-schgaguler.jpg",
  slug = hotel?.slug,
  rating = hotel?.rating || 4.8,
  ratingCount = hotel?.ratingCount || 48,
  price = hotel?.price || "€320",
  categoryTags = hotel?.categoryTags || ["Mountains", "Design"],
  useSplitLayout = true,
  infoSectionColor = "bg-[#f5f5f0]",
  showScrollIndicator = true,
  scrollToId = "hotel-content",
  imagePriority = true,
  bookButtonText = "Book Now",
  bookButtonUrl = "#booking",
  className = "",
  onBookClick
}: HotelDetailHeroProps): JSX.Element {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const imageSource = getHotelImage(backgroundImage, slug);
  
  // Handle image load complete
  const handleImageLoaded = () => {
    setIsImageLoaded(true);
  };

  // Handle book button click
  const handleBookClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onBookClick) {
      e.preventDefault();
      onBookClick();
    }
  };

  // Format category tags to ensure they are strings
  const formattedCategoryTags = categoryTags.map(tag => 
    typeof tag === 'string' ? tag : tag.name
  );
  
  // Animation variants
  const fadeInUpVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // If not using split layout, use BaseHero
  if (!useSplitLayout) {
    const ctaButtons: CtaButton[] = [
      {
        text: bookButtonText,
        href: bookButtonUrl,
        variant: 'primary',
        onClick: onBookClick
      }
    ];

    return (
      <BaseHero
        title={hotelName}
        subtitle={
          <div className="space-y-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              {location}
            </div>
            <p>{description}</p>
          </div>
        }
        backgroundImage={backgroundImage}
        ctaButtons={ctaButtons}
        height="h-[80vh]"
        showScrollIndicator={showScrollIndicator}
        scrollToId={scrollToId}
        imagePriority={imagePriority}
        className={className}
        sectionId="hotel-hero"
      />
    );
  }

  // Otherwise, use custom split layout
  return (
    <section className={`relative ${className}`}>
      {/* Split layout container */}
      <div className="flex flex-col md:flex-row w-full h-[70vh] md:h-[80vh]">
        {/* Left side - Image (55%) */}
        <div className="relative w-full md:w-[55%] h-3/5 md:h-full">
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-spin h-12 w-12 border-4 border-gray-300 rounded-full border-t-black" aria-label="Loading"></div>
            </div>
          )}
          {hotel?.isDirectusImage && typeof backgroundImage !== 'string' ? (
            <div className="w-full h-full">
              <BaseHero
                backgroundImage={backgroundImage}
                height="100%"
                imagePriority={imagePriority}
                animationEnabled={false}
                showScrollIndicator={false}
                overlayOpacity={0}
              />
            </div>
          ) : (
            <Image
              src={imageSource}
              alt={hotelName}
              fill
              priority={imagePriority}
              quality={90}
              className={`object-cover transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoadingComplete={handleImageLoaded}
            />
          )}
        </div>
        
        {/* Right side - Info (45%) */}
        <div className={`w-full md:w-[45%] h-2/5 md:h-full ${infoSectionColor} flex flex-col justify-center p-8 md:p-12 lg:p-16`}>
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="max-w-xl"
          >
            {/* Category tags */}
            <motion.div 
              variants={fadeInUpVariants} 
              className="flex flex-wrap gap-2 mb-4"
            >
              {formattedCategoryTags.map((tag, index) => (
                <span 
                  key={index} 
                  className="inline-block px-3 py-1 bg-white text-gray-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
            
            {/* Hotel name */}
            <motion.h1 
              variants={fadeInUpVariants}
              className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-2"
              id="hotel-title"
            >
              {hotelName}
            </motion.h1>
            
            {/* Location */}
            <motion.div 
              variants={fadeInUpVariants}
              className="text-lg text-gray-700 mb-4 flex items-center"
            >
              <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              {location}
            </motion.div>
            
            {/* Rating */}
            <motion.div 
              variants={fadeInUpVariants}
              className="flex items-center mb-6"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1 text-gray-700 font-medium">{rating}</span>
                <span className="mx-1.5 text-gray-500">•</span>
                <span className="text-gray-500">{ratingCount} reviews</span>
              </div>
            </motion.div>
            
            {/* Description */}
            <motion.p 
              variants={fadeInUpVariants}
              className="text-gray-600 mb-8"
            >
              {description}
            </motion.p>
            
            {/* Price and CTA */}
            <motion.div 
              variants={fadeInUpVariants}
              className="flex items-center justify-between"
            >
              <div>
                <span className="block text-sm text-gray-500">Starting from</span>
                <span className="text-2xl font-medium">{formatPrice(price, hotel?.currency)}</span>
                <span className="text-gray-500 text-sm"> / night</span>
              </div>
              
              <Link href={bookButtonUrl}>
                <button 
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                  onClick={handleBookClick}
                  aria-label={bookButtonText}
                >
                  {bookButtonText}
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      {showScrollIndicator && (
        <motion.a
          href={`#${scrollToId}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(scrollToId)?.scrollIntoView({ behavior: 'smooth' });
          }}
          aria-label="Scroll to discover more"
        >
          <span className="text-sm mb-2 text-gray-800">Discover More</span>
          <svg 
            className="w-6 h-6 animate-bounce text-gray-800" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            aria-hidden="true"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </motion.a>
      )}
    </section>
  );
}