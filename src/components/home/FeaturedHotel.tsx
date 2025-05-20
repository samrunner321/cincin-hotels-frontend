// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useFeatureInteraction } from '../../hooks/useFeatureInteraction';
import BaseFeature from '../../../components/ui/BaseFeature';
import { FeaturedHotelData } from '../../types/advanced-ui';
import { cn } from '../../../lib/utils';

interface FeaturedHotelProps {
  /** Tag displayed above the title */
  tag?: string;
  /** Hotel object to feature */
  hotel: FeaturedHotelData;
  /** Enable auto-rotation of images */
  autoRotate?: boolean;
  /** Rotation interval in ms */
  interval?: number;
  /** Show booking CTA */
  showBookingCta?: boolean;
  /** Custom CTA text */
  ctaText?: string;
  /** Custom CTA URL */
  ctaUrl?: string;
}

/**
 * FeaturedHotel Component
 * 
 * Displays a featured hotel with image carousel, description, and link
 */
export default function FeaturedHotel({ 
  tag = "New to the Club",
  hotel,
  autoRotate = true,
  interval = 4000,
  showBookingCta = false,
  ctaText = "Discover Hotel",
  ctaUrl,
}: FeaturedHotelProps) {
  const [activeImage, setActiveImage] = useState(0);
  
  // Use the feature interaction hook
  const imageInteraction = useFeatureInteraction({
    featureId: `featured-hotel-${hotel.slug}`,
    tooltip: {
      enabled: true,
      position: 'bottom',
      text: 'Click to view more images',
      showArrow: true,
      autoHideDelay: 3000,
    },
    highlight: {
      enabled: true,
      effect: 'glow',
      duration: 1000
    },
  });

  // Auto-slideshow
  useEffect(() => {
    if (!autoRotate) return;
    
    const rotationInterval = setInterval(() => {
      setActiveImage((prevIndex) => 
        prevIndex === hotel.images.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);
    
    return () => clearInterval(rotationInterval);
  }, [autoRotate, hotel.images.length, interval]);
  
  // Image animation variants
  const imageVariants = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7 }
    }
  };
  
  // Create the visual content (image carousel)
  const hotelGallery = (
    <div className="relative h-96 md:h-[500px] rounded-xl overflow-hidden">
      {hotel.images.map((image, index) => (
        <motion.div 
          key={index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            activeImage === index ? "opacity-100" : "opacity-0"
          )}
          variants={imageVariants}
        >
          <Image
            src={image}
            alt={`${hotel.name} - ${index + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority={index === 0}
          />
        </motion.div>
      ))}
      
      {/* Image Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {hotel.images.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              activeImage === index ? "bg-white" : "bg-white/50 hover:bg-white/70"
            )}
            onClick={() => setActiveImage(index)}
            aria-label={`View image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
  
  // Create the feature content (hotel info and CTA)
  const hotelContent = (
    <>
      {tag && (
        <div className="uppercase tracking-wider text-sm font-normal mb-4 font-brooklyn text-brand-olive-400">
          {tag}
        </div>
      )}
      
      {hotel.location && (
        <div className="flex items-center text-gray-600 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{hotel.location}</span>
        </div>
      )}
      
      <Link 
        href={ctaUrl || `/hotels/${hotel.slug}`}
        className="inline-flex items-center hover:text-brand-olive-400 transition-colors"
      >
        <span>{ctaText}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 ml-2" 
          viewBox="0 0 25 9" 
          fill="none"
        >
          <path d="M24.3536 4.85355C24.5488 4.65829 24.5488 4.34171 24.3536 4.14645L21.1716 0.964466C20.9763 0.769204 20.6597 0.769204 20.4645 0.964466C20.2692 1.15973 20.2692 1.47631 20.4645 1.67157L23.2929 4.5L20.4645 7.32843C20.2692 7.52369 20.2692 7.84027 20.4645 8.03553C20.6597 8.2308 20.9763 8.2308 21.1716 8.03553L24.3536 4.85355ZM0 5H24V4H0V5Z" 
            fill="currentColor"
          />
        </svg>
      </Link>
      
      {showBookingCta && (
        <div className="mt-6">
          <Link
            href={`/hotels/${hotel.slug}/rooms`}
            className="px-4 py-2 bg-brand-olive-600 text-white rounded hover:bg-brand-olive-700 transition-colors"
          >
            Book Now
          </Link>
        </div>
      )}
    </>
  );
  
  return (
    <BaseFeature
      featureId={`featured-hotel-${hotel.slug}`}
      title={hotel.name}
      description={hotel.description}
      layout="content-left"
      visualContent={hotelGallery}
      featureContent={hotelContent}
      onInteraction={(type, id) => {
        if (type === 'click') {
          // Optionally highlight or perform other actions on click
          imageInteraction.highlight();
        }
      }}
    />
  );
}