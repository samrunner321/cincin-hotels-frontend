'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import BaseHero, { BaseHeroProps, CtaButton, ImageObject } from '../../ui/BaseHero';
import Link from 'next/link';

/**
 * Interface for destination data
 */
export interface Destination {
  id: string | number;
  name: string;
  country: string;
  description?: string;
  shortDescription?: string;
  heroImage?: string | ImageObject;
  image?: string | ImageObject;
  slug?: string;
  region?: string;
  isDirectusImage?: boolean;
}

/**
 * Props for the DestinationHero component
 */
export interface DestinationHeroProps {
  /** Destination data to display */
  destination: Destination;
  
  /** Whether to use split layout (image on left, color on right) */
  useSplitLayout?: boolean;
  
  /** Accent color for the colored section */
  accentColor?: string;
  
  /** Whether to use parallax effect */
  useParallax?: boolean;
  
  /** Custom CTA buttons */
  ctaButtons?: CtaButton[];
  
  /** Additional CSS class */
  className?: string;
  
  /** Whether to show the scroll indicator */
  showScrollIndicator?: boolean;
  
  /** Function called when scroll indicator is clicked */
  onScrollClick?: () => void;
  
  /** Whether to prioritize loading of the hero image */
  imagePriority?: boolean;
  
  /** Pattern to display in the colored section */
  showPattern?: boolean;
}

/**
 * DestinationHero Component
 * 
 * A hero section for destination detail pages featuring a split layout with
 * image and colored sections, parallax effects, and animated content.
 */
export default function DestinationHero({
  destination,
  useSplitLayout = true,
  accentColor = 'bg-brand-olive-400',
  useParallax = true,
  ctaButtons,
  className = '',
  showScrollIndicator = true,
  onScrollClick,
  imagePriority = true,
  showPattern = true
}: DestinationHeroProps): JSX.Element {
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollY } = useScroll();
  
  // Parallax effects
  const imageY = useTransform(scrollY, [0, 500], [0, 100]);
  const contentY = useTransform(scrollY, [0, 500], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  // Default CTA buttons if not provided
  const defaultCtaButtons: CtaButton[] = [
    {
      text: 'Explore Hotels',
      href: '#hotels',
      variant: 'outline',
    },
    {
      text: 'Discover Activities',
      href: '#activities',
      variant: 'secondary',
    }
  ];
  
  const buttons = ctaButtons || defaultCtaButtons;
  
  // If not using split layout, use BaseHero directly
  if (!useSplitLayout) {
    return (
      <BaseHero
        title={
          <>
            {destination.name}
            <span className="block text-brand-olive-200 mt-2">{destination.country}</span>
          </>
        }
        subtitle={destination.description || destination.shortDescription}
        backgroundImage={destination.heroImage || destination.image}
        ctaButtons={buttons}
        height="min-h-[700px] max-h-[900px]"
        showScrollIndicator={showScrollIndicator}
        onScrollClick={onScrollClick}
        imagePriority={imagePriority}
        parallaxEffect={useParallax}
        className={className}
        sectionId="destination-hero"
      />
    );
  }

  // Otherwise, use custom split layout
  return (
    <section className={`relative overflow-hidden h-screen min-h-[700px] max-h-[900px] ${className}`}>
      {/* Split design with image (55%) and colored area (45%) */}
      <div className="flex h-full">
        {/* Image section with parallax effect */}
        <motion.div 
          className="relative w-full md:w-[55%] h-full overflow-hidden bg-gray-900"
          style={{ y: useParallax && isLoaded ? imageY : 0 }}
        >
          {destination.isDirectusImage && typeof destination.heroImage !== 'string' ? (
            // If it's a Directus image, use the BaseHero's handling
            <div className="w-full h-full">
              <BaseHero
                backgroundImage={destination.heroImage || destination.image}
                height="100%"
                imagePriority={imagePriority}
                animationEnabled={false}
                showScrollIndicator={false}
                overlayOpacity={0.2}
              />
            </div>
          ) : (
            // Otherwise use standard Image component
            <>
              <Image
                src={(destination.heroImage || destination.image) as string}
                alt={`${destination.name}, ${destination.country}`}
                fill
                priority={imagePriority}
                quality={90}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20"></div>
            </>
          )}
        </motion.div>
        
        {/* Colored content area */}
        <motion.div 
          className={`hidden md:flex md:w-[45%] ${accentColor} relative overflow-hidden`}
          style={{ y: useParallax && isLoaded ? contentY : 0 }}
        >
          {/* Background pattern */}
          {showPattern && (
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <pattern id="destination-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="1" fill="currentColor" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#destination-pattern)" />
              </svg>
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Overlay content that spans both sections */}
      <motion.div 
        className="absolute inset-0 flex items-center z-10"
        style={{ opacity: useParallax && isLoaded ? opacity : 1 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1536px]">
          <div className="md:max-w-[55%] text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <p className="text-brand-olive-200 text-lg uppercase tracking-wider font-brooklyn mb-2">
                Destination
              </p>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-brooklyn mb-6" id="destination-title">
                {destination.name}
                <span className="block text-brand-olive-200 mt-2">{destination.country}</span>
              </h1>
              
              <p className="text-xl leading-relaxed font-brooklyn mb-8 max-w-2xl text-white/90">
                {destination.description || destination.shortDescription}
              </p>
              
              <div className="flex flex-wrap gap-4 mt-8">
                {buttons.map((button, index) => (
                  <motion.a 
                    key={index}
                    href={button.href}
                    className={button.variant === 'outline' 
                      ? "inline-flex items-center justify-center text-white bg-transparent border border-white hover:bg-brand-olive-500 hover:border-brand-olive-500 transition-colors duration-300 rounded-full px-8 py-3 font-brooklyn"
                      : "inline-flex items-center justify-center text-white bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors duration-300 rounded-full px-8 py-3 font-brooklyn"
                    }
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={button.ariaLabel || button.text}
                    onClick={button.onClick}
                  >
                    {button.text}
                    {button.icon && <span className="ml-2">{button.icon}</span>}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Scroll indicator */}
      {showScrollIndicator && (
        <motion.button 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white"
          animate={{ 
            y: [0, 10, 0],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }}
          onClick={onScrollClick || (() => {
            document.getElementById('hotels')?.scrollIntoView({ behavior: 'smooth' });
          })}
          aria-label="Scroll to explore"
        >
          <p className="font-brooklyn text-sm mb-2">Scroll to Explore</p>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.button>
      )}
    </section>
  );
}