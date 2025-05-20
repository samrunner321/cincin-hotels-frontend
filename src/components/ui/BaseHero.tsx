'use client';

import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import ResponsiveDirectusImage from '../common/ResponsiveDirectusImage';

/**
 * Type definition for image objects that can be used as background
 */
export interface ImageObject {
  id: string;
  fileId?: string;
  url?: string;
  alt?: string;
}

/**
 * Type definition for CTA buttons
 */
export interface CtaButton {
  text: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  icon?: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  isExternal?: boolean;
  ariaLabel?: string;
}

/**
 * Layout variants for the hero component
 */
export type HeroLayout = 'fullscreen' | 'split' | 'banner' | 'contained';

/**
 * Props for the BaseHero component
 */
export interface BaseHeroProps {
  /** Main title displayed in the hero section */
  title?: string | ReactNode;
  
  /** Optional subtitle or description text */
  subtitle?: string | ReactNode;
  
  /** Background image URL or image object */
  backgroundImage?: string | ImageObject;
  
  /** Color of the overlay on top of the background image */
  overlayColor?: string;
  
  /** Opacity of the overlay (0-1) */
  overlayOpacity?: number;
  
  /** Text color for the hero content */
  textColor?: string;
  
  /** Alignment of text content */
  textAlignment?: 'left' | 'center' | 'right';
  
  /** Height of the hero section (CSS value) */
  height?: string;
  
  /** Children to render inside the hero */
  children?: ReactNode;
  
  /** Call-to-action buttons to display */
  ctaButtons?: CtaButton[];
  
  /** Whether to load the image with priority (for LCP) */
  imagePriority?: boolean;
  
  /** Callback function called when the image loads */
  onImageLoad?: () => void;
  
  /** Layout style of the hero component */
  layout?: HeroLayout;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Whether to show loading state */
  showLoader?: boolean;
  
  /** Whether to use parallax effect on the background */
  parallaxEffect?: boolean;
  
  /** Whether to show a scroll indicator */
  showScrollIndicator?: boolean;
  
  /** Function called when scroll indicator is clicked */
  onScrollClick?: () => void;
  
  /** ID of the element to scroll to when scroll indicator is clicked */
  scrollToId?: string;
  
  /** Whether to animate content on scroll */
  animateOnScroll?: boolean;
  
  /** Whether to use animation effects */
  animationEnabled?: boolean;
  
  /** The parent section ID for accessibility */
  sectionId?: string;
  
  /** Optional image quality (1-100) */
  imageQuality?: number;
}

/**
 * BaseHero Component
 * 
 * A flexible, reusable hero component that can be used as a foundation for
 * various hero sections throughout the application. Supports different layouts,
 * responsive design, animations, and accessibility features.
 */
export default function BaseHero({
  title,
  subtitle,
  backgroundImage,
  overlayColor = 'black',
  overlayOpacity = 0.4,
  textColor = 'white',
  textAlignment = 'left',
  height = '80vh',
  children,
  ctaButtons = [],
  imagePriority = false,
  onImageLoad,
  layout = 'fullscreen',
  className = '',
  showLoader = true,
  parallaxEffect = false,
  showScrollIndicator = true,
  onScrollClick,
  scrollToId,
  animateOnScroll = true,
  animationEnabled = true,
  sectionId = 'hero',
  imageQuality = 90
}: BaseHeroProps) {
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  // Determine if a DirectusImage fileId is provided
  const isDirectusImage = 
    backgroundImage && 
    typeof backgroundImage !== 'string' && 
    (backgroundImage.fileId || backgroundImage.id);

  // Get the appropriate image source
  const getImageSource = () => {
    if (!backgroundImage) return null;

    if (typeof backgroundImage === 'string') {
      return backgroundImage;
    }
    
    return backgroundImage.url || '';
  };
  
  // Handle parallax effect on scroll
  const handleScroll = useCallback(() => {
    if (!parallaxEffect) return;
    
    const scrollPosition = window.scrollY;
    if (scrollPosition < window.innerHeight) {
      setParallaxOffset(scrollPosition * 0.5);
    }
  }, [parallaxEffect]);

  // Set up scroll event listener for parallax effect
  useEffect(() => {
    if (parallaxEffect) {
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll, parallaxEffect]);

  // Handle scroll indicator click
  const handleScrollClick = () => {
    if (onScrollClick) {
      onScrollClick();
    } else if (scrollToId) {
      document.getElementById(scrollToId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  // Handle image load complete
  const handleImageLoad = () => {
    setIsLoading(false);
    if (onImageLoad) onImageLoad();
  };

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

  // Text alignment styles
  const alignmentStyles = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto'
  };

  // Layout styles
  const layoutStyles = {
    fullscreen: 'min-h-screen w-full',
    split: 'min-h-[70vh] md:grid md:grid-cols-2',
    banner: 'min-h-[40vh]',
    contained: 'min-h-[50vh] max-w-screen-xl mx-auto rounded-xl overflow-hidden'
  };

  // CTA button styles
  const buttonVariants = {
    primary: 'bg-brand-olive-400 text-white hover:bg-brand-olive-500',
    secondary: 'bg-white text-gray-900 hover:bg-gray-100',
    outline: 'border border-white text-white hover:bg-white/20',
    text: 'text-white hover:underline'
  };

  return (
    <section
      id={sectionId}
      className={`relative flex items-center overflow-hidden ${layoutStyles[layout]} ${className}`}
      style={{ height }}
      aria-labelledby={`${sectionId}-title`}
    >
      {/* Loading overlay */}
      {isLoading && showLoader && (
        <div className="absolute inset-0 bg-white z-20 flex items-center justify-center">
          <div 
            className="w-8 h-8 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" 
            aria-label="Loading..."
          ></div>
        </div>
      )}

      {/* Background image with parallax effect */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{ transform: parallaxEffect ? `translateY(${parallaxOffset}px)` : 'none' }}
        aria-hidden="true"
      >
        {isDirectusImage ? (
          <ResponsiveDirectusImage
            fileId={typeof backgroundImage !== 'string' ? (backgroundImage.fileId || backgroundImage.id) : ''}
            alt=""
            priority={imagePriority}
            onLoad={handleImageLoad}
            quality={imageQuality}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="relative w-full h-[calc(100%+150px)]">
            {getImageSource() && (
              <Image
                src={getImageSource() || ''}
                alt=""
                fill
                sizes="100vw"
                className={`object-cover transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                priority={imagePriority}
                onLoadingComplete={handleImageLoad}
                quality={imageQuality}
              />
            )}
          </div>
        )}
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
        className={`container mx-auto px-4 md:px-8 relative z-10 pt-16 ${
          textColor === 'white' ? 'text-white' : 'text-gray-800'
        }`}
        variants={containerVariants}
        initial={animationEnabled ? "hidden" : "visible"}
        animate={isLoading ? "hidden" : "visible"}
      >
        <div className={`max-w-3xl ${alignmentStyles[textAlignment]}`}>
          {title && (
            <motion.h1
              id={`${sectionId}-title`}
              className="text-4xl md:text-6xl font-bold mb-6"
              variants={itemVariants}
            >
              {title}
            </motion.h1>
          )}

          {subtitle && (
            <motion.p
              className="text-xl md:text-2xl leading-relaxed font-light"
              variants={itemVariants}
            >
              {subtitle}
            </motion.p>
          )}

          {/* CTA Buttons */}
          {ctaButtons.length > 0 && (
            <motion.div
              className="mt-8 flex flex-wrap gap-4"
              variants={itemVariants}
            >
              {ctaButtons.map((button, index) => (
                <Link
                  key={index}
                  href={button.href}
                  aria-label={button.ariaLabel || button.text}
                  onClick={button.onClick}
                  target={button.isExternal ? '_blank' : undefined}
                  rel={button.isExternal ? 'noopener noreferrer' : undefined}
                  className={`inline-flex items-center px-6 py-3 rounded-lg transition-colors ${
                    buttonVariants[button.variant || 'primary']
                  }`}
                >
                  {button.text}
                  {button.icon && <span className="ml-2">{button.icon}</span>}
                </Link>
              ))}
            </motion.div>
          )}

          {/* Optional children */}
          {children && (
            <motion.div variants={itemVariants} className="mt-8">
              {children}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <motion.button
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10 mb-8"
          variants={scrollIndicatorVariants}
          initial={animationEnabled ? "hidden" : "visible"}
          animate={isLoading ? "hidden" : ["visible", "pulse"]}
          onClick={handleScrollClick}
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