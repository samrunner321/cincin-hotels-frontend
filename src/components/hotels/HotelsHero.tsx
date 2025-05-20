'use client';

import { motion, Variants } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

/**
 * Interface for HotelsHero component props
 */
interface HotelsHeroProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  height?: string;
  overlayOpacity?: number;
  overlayColor?: string;
  textColor?: string;
  alignment?: 'left' | 'center' | 'right';
  showScrollIndicator?: boolean;
  onScrollClick?: () => void;
  priority?: boolean;
}

/**
 * HotelsHero Component
 * 
 * A full-screen hero section for the hotels page with animated text
 * and a background image.
 */
export default function HotelsHero({
  title = "CINCIN® Exceptional Hotels",
  subtitle = "Discover our curated collection of unique accommodations across the most desirable destinations",
  backgroundImage = "/images/hotels/hotel-1.jpg",
  height = "100vh",
  overlayOpacity = 0.4,
  overlayColor = "black",
  textColor = "white",
  alignment = "left",
  showScrollIndicator = true,
  onScrollClick,
  priority = false
}: HotelsHeroProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        ease: "easeInOut",
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants: Variants = {
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

  const scrollIndicatorVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 0.7,
      transition: { 
        delay: 1.2,
        duration: 0.5
      }
    },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop"
      }
    }
  };

  // Handle parallax effect on scroll
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    if (scrollPosition < window.innerHeight) {
      setParallaxOffset(scrollPosition * 0.5);
    }
  }, []);

  // Set up scroll event listener for parallax effect
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Scroll to the next section
  const scrollToNext = () => {
    if (onScrollClick) {
      onScrollClick();
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  // Handle image load completion
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Text alignment styles
  const alignmentStyles = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto'
  };

  return (
    <section 
      className="relative flex items-center overflow-hidden"
      style={{ height }}
      aria-labelledby="hero-title"
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white z-20 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" aria-label="Loading..."></div>
        </div>
      )}
      
      {/* Background image with parallax effect */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
        aria-hidden="true"
      >
        <div className="relative w-full h-[calc(100%+150px)]">
          <Image 
            src={backgroundImage}
            alt=""
            fill
            sizes="100vw"
            className={`object-cover transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            priority={priority}
            onLoadingComplete={handleImageLoad}
            quality={90}
          />
        </div>
      </div>
      
      {/* Overlay gradient */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: `linear-gradient(to bottom, ${overlayColor}/${Math.round(overlayOpacity * 100)} 0%, ${overlayColor}/${Math.round(overlayOpacity * 75)} 100%)` 
        }}
      ></div>
      
      {/* Content */}
      <motion.div 
        className={`container mx-auto px-4 md:px-8 relative z-10 pt-16 ${textColor === 'white' ? 'text-white' : 'text-gray-800'}`}
        variants={containerVariants}
        initial="hidden"
        animate={isLoading ? "hidden" : "visible"}
      >
        <div className={`max-w-3xl ${alignmentStyles[alignment]}`}>
          <motion.h1 
            id="hero-title"
            className="text-4xl md:text-6xl font-bold mb-6"
            variants={itemVariants}
          >
            {title}
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl leading-relaxed font-light"
            variants={itemVariants}
          >
            {subtitle}
          </motion.p>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <motion.button
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10 mb-8"
          variants={scrollIndicatorVariants}
          initial="hidden"
          animate={isLoading ? "hidden" : ["visible", "pulse"]}
          onClick={scrollToNext}
          aria-label="Scroll down"
        >
          <div className="w-10 h-10 border border-white/50 rounded-full flex items-center justify-center cursor-pointer hover:border-white/80 transition-all">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-white/70 hover:text-white transition-colors"
              aria-hidden="true"
            >
              <path d="M12 5v14"></path>
              <path d="M19 12l-7 7-7-7"></path>
            </svg>
          </div>
        </motion.button>
      )}
    </section>
  );
}