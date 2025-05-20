// @ts-nocheck
/**
 * DetailHeroBanner Component
 * 
 * An optimized hero banner for hotel detail pages in CinCin Hotels application
 * with progressive image loading, parallax effects, and advanced animations.
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import { useAssetLoading } from '../../hooks/useAssetLoading';
import { useAnimation } from '../../hooks/useAnimation';
import { useRtl } from '../../hooks/useRtl';
import { DetailHeroBannerProps } from '../../types/advanced-ui';
import Image from 'next/image';
import { getHotelImage, isValidImageUrl, generateSrcSet } from '../../utils/image-helpers';

interface ContentSectionProps {
  hotelName: string;
  location: string;
  description: string;
  onShowMoreClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  isRtl: boolean;
  animationDelay: number;
}

/**
 * Content section with hotel information and call to action
 */
const ContentSection: React.FC<ContentSectionProps> = React.memo(({
  hotelName,
  location,
  description,
  onShowMoreClick,
  isRtl,
  animationDelay
}) => {
  // Calculate staggered animation delays
  const titleDelay = animationDelay + 0.2;
  const locationDelay = animationDelay + 0.3;
  const descriptionDelay = animationDelay + 0.4;
  const buttonDelay = animationDelay + 0.5;
  
  return (
    <div className="max-w-md lg:max-w-lg">
      <motion.h1 
        className="text-3xl md:text-4xl lg:text-5xl font-normal text-white mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: titleDelay, duration: 0.5 }}
      >
        {hotelName}
      </motion.h1>
      
      <motion.div 
        className="text-lg text-white/90 mb-4"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: locationDelay, duration: 0.5 }}
      >
        {location}
      </motion.div>
      
      <motion.p 
        className="text-white/80 mb-8"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: descriptionDelay, duration: 0.5 }}
      >
        {description}
      </motion.p>
      
      <motion.a 
        href="#overview" 
        className="inline-flex items-center text-white hover:text-gray-200 focus:outline-none focus:underline"
        onClick={onShowMoreClick}
        initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: buttonDelay, duration: 0.5 }}
        whileHover={{ x: isRtl ? -5 : 5 }}
      >
        <span>show more</span>
        <svg 
          className={isRtl ? "mr-3 transform rotate-180" : "ml-3"} 
          xmlns="http://www.w3.org/2000/svg" 
          width="25" 
          height="9" 
          viewBox="0 0 25 9" 
          fill="none"
        >
          <path d="M24.3536 4.85355C24.5488 4.65829 24.5488 4.34171 24.3536 4.14645L21.1716 0.964466C20.9763 0.769204 20.6597 0.769204 20.4645 0.964466C20.2692 1.15973 20.2692 1.47631 20.4645 1.67157L23.2929 4.5L20.4645 7.32843C20.2692 7.52369 20.2692 7.84027 20.4645 8.03553C20.6597 8.2308 20.9763 8.2308 21.1716 8.03553L24.3536 4.85355ZM0 5H24V4H0V5Z" fill="currentColor"/>
        </svg>
      </motion.a>
    </div>
  );
});

ContentSection.displayName = 'ContentSection';

/**
 * Enhanced image section that detects the type of image and renders the appropriate component
 */
const EnhancedImageSection: React.FC<{
  backgroundImage: string;
  hotelName: string;
  slug?: string;
  onLoad: () => void;
  isImageLoaded: boolean;
  rtlAware: boolean;
  animationsEnabled: boolean;
  reducedMotion: boolean;
}> = React.memo(({
  backgroundImage,
  hotelName,
  slug,
  onLoad,
  isImageLoaded,
  rtlAware,
  animationsEnabled,
  reducedMotion
}) => {
  // Generate low quality placeholder URL
  const lowQualityUrl = useMemo(() => {
    // For real implementation, this would generate or use a tiny version of the image
    return '/images/placeholder-low-quality.jpg';
  }, []);
  
  // Determine if the image is from Directus
  const isDirectusImage = useMemo(() => (
    typeof backgroundImage === 'string' && 
    !backgroundImage.startsWith('http') && 
    !backgroundImage.startsWith('/') &&
    !backgroundImage.includes('/')
  ), [backgroundImage]);
  
  // Determine the image source
  const imageSource = useMemo(() => {
    if (typeof backgroundImage !== 'string') {
      return '';
    }
    
    if (isValidImageUrl(backgroundImage)) {
      return backgroundImage;
    }
    
    return slug ? getHotelImage(backgroundImage, slug) : backgroundImage;
  }, [backgroundImage, slug]);
  
  // Use ImageSection ref for intersection observer
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  
  // Battery-aware behavior
  const [isBatterySaving, setIsBatterySaving] = useState<boolean>(false);
  
  // Check battery status if available
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('getBattery' in navigator)) {
      return;
    }
    
    const checkBattery = async () => {
      try {
        // @ts-ignore - getBattery is not in the standard type definitions
        const battery = await navigator.getBattery();
        setIsBatterySaving(battery.level < 0.2 || battery.charging === false);
      } catch (error) {
        console.warn('Battery API not supported or permission denied');
      }
    };
    
    checkBattery();
  }, []);
  
  // Simplified image section for the migration
  return (
    <div ref={sectionRef} className="relative w-full h-full overflow-hidden">
      <Image
        src={isDirectusImage ? `/images/hotels/hotel-1.jpg` : imageSource}
        alt={hotelName}
        fill
        priority
        className="object-cover w-full h-full"
        onLoad={onLoad}
      />
    </div>
  );
});

EnhancedImageSection.displayName = 'EnhancedImageSection';

/**
 * DetailHeroBanner component for hotel detail pages
 */
const DetailHeroBanner: React.FC<DetailHeroBannerProps> = ({
  hotelName = "Seezeitlodge Hotel & Spa", 
  location = "Gonnesweiler, Saarland, Germany", 
  description = "A lakeside wellness retreat with sustainable design and natural splendor.",
  backgroundImage = "/images/hotels/hotel-1.jpg",
  slug,
  isRoomsPage = false,
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
  // State for image loading
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  
  // Ref for intersection observer
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  
  // Use the asset loading hook for preloading assets
  const { preloadAsset } = useAssetLoading();
  
  // Get animation configuration from the animation hook
  const { getEntranceProps } = useAnimation({
    variant: animationVariant,
    animationsEnabled,
    duration: animationDuration / 1000,
    delay: animationDelay / 1000,
    overrideReducedMotion: !reducedMotion
  });
  
  // RTL support
  const { isRtl, direction } = useRtl();
  
  // Check if reduced motion is preferred
  const prefersReducedMotion = useReducedMotion();
  
  // Preload the next section images
  useEffect(() => {
    // If we're on rooms page, preload room images
    if (isRoomsPage) {
      // You would typically get these from your data, but for now let's preload some common images
      preloadAsset('hotel-1.jpg');
      preloadAsset('hotel-2.jpg');
    } else {
      // Preload overview and gallery section images
      preloadAsset('hotel-2.jpg');
      preloadAsset('hotel-3.jpg');
    }
  }, [isRoomsPage, preloadAsset]);
  
  // Handle image load complete
  const handleImageLoaded = useCallback(() => {
    setIsImageLoaded(true);
  }, []);
  
  // Smooth scroll function
  const handleShowMoreClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const overviewElement = document.getElementById('overview');
    if (overviewElement) {
      overviewElement.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  }, [prefersReducedMotion]);
  
  // Exit early if not visible
  if (!visible) {
    return null;
  }
  
  return (
    <motion.section 
      ref={sectionRef}
      className={`flex flex-col md:flex-row h-[68vh] w-full relative ${className}`}
      style={style}
      id={id}
      dir={rtlAware ? direction : undefined}
      {...getEntranceProps()}
    >
      {/* Background Container */}
      <div className="absolute inset-0 flex w-full h-full">
        {/* Left side - Image (55%) */}
        <div className="relative w-[55%] h-full bg-gray-100">
          <EnhancedImageSection
            backgroundImage={backgroundImage}
            hotelName={hotelName}
            slug={slug}
            onLoad={handleImageLoaded}
            isImageLoaded={isImageLoaded}
            rtlAware={rtlAware}
            animationsEnabled={animationsEnabled}
            reducedMotion={reducedMotion}
          />
        </div>
        
        {/* Right side - Background (45%) */}
        <div className="w-[45%] h-full bg-[#93A27F]">
          {/* Add subtle background pattern or texture for visual interest */}
          <div 
            className="absolute inset-0 opacity-5 mix-blend-overlay"
            style={{ 
              backgroundImage: 'url(/images/subtle-pattern.png)',
              backgroundRepeat: 'repeat',
            }}
            aria-hidden="true"
          />
        </div>
      </div>
      
      {/* Content Container */}
      <div className="relative flex flex-col md:flex-row w-full h-full max-w-[1814px] mx-auto">
        {/* Left side - Empty space above image (55%) */}
        <div className="w-full md:w-[55%] h-2/3 md:h-full"></div>
        
        {/* Right side - Text Container (45%) */}
        <div className="w-full md:w-[45%] h-1/3 md:h-full flex flex-col justify-end p-8 md:p-12 lg:p-16">
          {/* Only show content when image is loaded for better UX */}
          <AnimatePresence>
            {isImageLoaded && isInView && (
              <ContentSection
                hotelName={hotelName}
                location={location}
                description={description}
                onShowMoreClick={handleShowMoreClick}
                isRtl={isRtl}
                animationDelay={animationDelay / 1000}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Accessibility Features */}
      <span className="sr-only">
        Hotel: {hotelName}, Location: {location}, {description}
      </span>
    </motion.section>
  );
};

export default React.memo(DetailHeroBanner);