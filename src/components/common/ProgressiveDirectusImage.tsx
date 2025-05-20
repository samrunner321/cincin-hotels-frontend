// @ts-nocheck
/**
 * ProgressiveDirectusImage Component
 * 
 * An enhanced Directus image component with progressive loading,
 * modern formats, and optimized performance for CinCin Hotels application.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { getAssetUrl } from '../../../lib/api/directus-client';
import { useAnimation } from '../../hooks/useAnimation';
import { ImageFit, BaseLayoutProps, BaseAnimationProps } from '../../types/advanced-ui';
import LoadingSpinner from '../../../components/ui/common/LoadingSpinner';

interface ProgressiveDirectusImageProps extends BaseLayoutProps, BaseAnimationProps {
  /** Asset ID from Directus */
  fileId: string;
  
  /** Alternative text for accessibility */
  alt: string;
  
  /** Image width */
  width?: number;
  
  /** Image height */
  height?: number;
  
  /** Whether the image should fill its container */
  fill?: boolean;
  
  /** Image loading priority */
  priority?: boolean;
  
  /** Image sizes attribute for responsive loading */
  sizes?: string;
  
  /** Image quality (1-100) */
  quality?: number;
  
  /** How the image should fit in Directus transformations */
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  
  /** How the image should fit in its container */
  objectFit?: ImageFit;
  
  /** Position of the image within its container */
  objectPosition?: string;
  
  /** Whether to show a loading indicator */
  showLoadingSpinner?: boolean;
  
  /** Size of the loading spinner */
  loadingSpinnerSize?: 'small' | 'medium' | 'large';
  
  /** Color of the loading spinner */
  loadingSpinnerColor?: string;
  
  /** Callback when image is loaded */
  onLoad?: () => void;
  
  /** Breakpoints for responsive images */
  breakpoints?: number[];
  
  /** Image placeholder type */
  placeholder?: 'blur' | 'empty' | 'skeleton';
  
  /** Low quality image to show while loading */
  lowQualityImage?: string;
  
  /** Modern image formats to generate */
  formats?: Array<'webp' | 'avif' | 'jpeg' | 'png'>;
  
  /** Enable battery-aware optimizations */
  batteryAware?: boolean;
  
  /** Enable responsive loading based on device pixel ratio */
  dprAware?: boolean;
  
  /** Generate different crops for different aspect ratios */
  responsiveCrops?: boolean;
  
  /** Container class name */
  containerClassName?: string;
}

/**
 * ProgressiveDirectusImage component for optimized image loading
 */
const ProgressiveDirectusImage: React.FC<ProgressiveDirectusImageProps> = ({
  fileId,
  alt,
  width,
  height,
  fill = !width || !height,
  priority = false,
  sizes = '100vw',
  quality = 80,
  fit = 'cover',
  objectFit = 'cover',
  objectPosition = 'center',
  showLoadingSpinner = true,
  loadingSpinnerSize = 'medium',
  loadingSpinnerColor = 'olive',
  onLoad,
  breakpoints = [640, 768, 1024, 1280, 1536],
  placeholder = 'blur',
  lowQualityImage,
  formats = ['webp', 'avif'],
  batteryAware = true,
  dprAware = true,
  responsiveCrops = false,
  containerClassName = '',
  className = '',
  style,
  id,
  visible = true,
  rtlAware = true,
  animationVariant = 'fade',
  animationDelay = 0,
  animationDuration = 500,
  animationsEnabled = true,
  reducedMotion = false
}) => {
  // State management
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isBatterySaving, setIsBatterySaving] = useState<boolean>(false);
  const [devicePixelRatio, setDevicePixelRatio] = useState<number>(1);
  
  // Get animation configuration from the animation hook
  const { getEntranceProps } = useAnimation({
    variant: animationVariant,
    animationsEnabled,
    duration: animationDuration / 1000,
    delay: animationDelay / 1000,
    overrideReducedMotion: !reducedMotion
  });
  
  // Check if reduced motion is preferred
  const prefersReducedMotion = useReducedMotion();
  
  // Handle empty fileId
  if (!fileId) return null;
  
  // Check if the fileId is a local path or a Directus asset ID
  const isLocalImage = useMemo(() => (
    typeof fileId === 'string' && (fileId.startsWith('/') || fileId.includes('/'))
  ), [fileId]);
  
  // Determine optimal image quality based on battery status and settings
  const optimizedQuality = useMemo(() => {
    if (!batteryAware || !isBatterySaving) return quality;
    return Math.max(60, quality - 20); // Reduce quality when battery saving
  }, [batteryAware, isBatterySaving, quality]);
  
  // Determine optimal image formats based on device capabilities and battery
  const optimizedFormats = useMemo(() => {
    if (!batteryAware || !isBatterySaving) return formats;
    return ['webp']; // Use more compatible but still efficient format when saving battery
  }, [batteryAware, isBatterySaving, formats]);
  
  // Generate low quality placeholder URL
  const blurDataUrl = useMemo(() => {
    if (lowQualityImage) return lowQualityImage;
    if (isLocalImage) return fileId;
    
    // Generate a tiny thumbnail for blur effect
    return getAssetUrl(fileId, { 
      width: 20, 
      height: height && width ? Math.round(20 * (height / width)) : 20,
      quality: 20,
      fit
    });
  }, [fileId, isLocalImage, lowQualityImage, height, width, fit]);
  
  // Generate responsive widths for srcset based on device pixel ratio
  const responsiveWidths = useMemo(() => {
    if (!dprAware) return breakpoints;
    
    // Adjust breakpoints based on device pixel ratio
    return breakpoints.map(bp => Math.round(bp * devicePixelRatio));
  }, [breakpoints, dprAware, devicePixelRatio]);
  
  // Generate image URL with appropriate transformations
  const imageUrl = useMemo(() => {
    if (isLocalImage) return fileId;
    
    // Generate Directus asset URL with quality and format options
    return getAssetUrl(fileId, { 
      width, 
      height, 
      quality: optimizedQuality, 
      fit,
      format: optimizedFormats[0] as any // Use the first format as default
    });
  }, [fileId, isLocalImage, width, height, optimizedQuality, fit, optimizedFormats]);
  
  // Generate srcset for responsive images
  const srcSet = useMemo(() => {
    if (isLocalImage || !width) return undefined;
    
    // Generate srcset for each breakpoint
    return responsiveWidths.map(bpWidth => {
      const transformedUrl = getAssetUrl(fileId, { 
        width: bpWidth, 
        height: height ? Math.round(height * (bpWidth / width)) : undefined, 
        quality: optimizedQuality,
        fit,
        format: optimizedFormats[0] as any
      });
      return `${transformedUrl} ${bpWidth}w`;
    }).join(', ');
  }, [
    isLocalImage, 
    fileId, 
    width, 
    height, 
    optimizedQuality, 
    fit, 
    responsiveWidths,
    optimizedFormats
  ]);
  
  // Check device capabilities on mount
  useEffect(() => {
    // Check device pixel ratio
    if (typeof window !== 'undefined') {
      setDevicePixelRatio(window.devicePixelRatio || 1);
    }
    
    // Check battery status if available
    if (batteryAware && typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      const checkBattery = async () => {
        try {
          // @ts-ignore - getBattery is not in the standard type definitions
          const battery = await navigator.getBattery();
          setIsBatterySaving(battery.level < 0.2 || battery.charging === false);
          
          // Listen for battery changes
          battery.addEventListener('levelchange', () => {
            setIsBatterySaving(battery.level < 0.2 || battery.charging === false);
          });
          
          battery.addEventListener('chargingchange', () => {
            setIsBatterySaving(battery.level < 0.2 || battery.charging === false);
          });
        } catch (error) {
          console.warn('Battery API not supported or permission denied');
        }
      };
      
      checkBattery();
    }
  }, [batteryAware]);
  
  // Reset states when fileId changes
  useEffect(() => {
    setIsLoaded(false);
    setIsError(false);
  }, [fileId]);
  
  // Handle image load complete
  const handleLoadComplete = useCallback(() => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);
  
  // Handle image error
  const handleError = useCallback(() => {
    setIsError(true);
    if (onLoad) {
      onLoad(); // Still call onLoad to prevent parent components from waiting
    }
  }, [onLoad]);
  
  // Exit early if not visible
  if (!visible) {
    return null;
  }
  
  // Show error state
  if (isError) {
    return (
      <div 
        className={`relative flex items-center justify-center bg-gray-200 ${containerClassName}`}
        style={{ width: fill ? '100%' : width, height: fill ? '100%' : height, ...style }}
        id={id}
        dir={rtlAware ? 'auto' : undefined}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-10 w-10 text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
        <span className="mt-2 text-sm text-gray-500">Image could not be loaded</span>
      </div>
    );
  }
  
  // Render image with optimizations
  return (
    <div 
      className={`relative overflow-hidden ${containerClassName}`}
      style={style}
      id={id}
      dir={rtlAware ? 'auto' : undefined}
    >
      {/* Loading indicator */}
      {showLoadingSpinner && !isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-50 bg-opacity-40">
          <LoadingSpinner size={loadingSpinnerSize} color={loadingSpinnerColor} />
        </div>
      )}
      
      {/* Skeleton placeholder */}
      {placeholder === 'skeleton' && !isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          aria-hidden="true"
        />
      )}
      
      {/* Image with animation */}
      <motion.div
        className="relative w-full h-full"
        {...getEntranceProps()}
      >
        <Image
          src={imageUrl}
          alt={alt || "Image"}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          sizes={sizes}
          priority={priority}
          quality={optimizedQuality}
          className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
          style={{ 
            objectFit: objectFit as any, 
            objectPosition 
          }}
          loading={priority ? 'eager' : 'lazy'}
          placeholder={placeholder === 'blur' ? 'blur' : undefined}
          blurDataURL={placeholder === 'blur' ? blurDataUrl : undefined}
          onLoadingComplete={handleLoadComplete}
          onError={handleError}
          srcSet={srcSet}
        />
      </motion.div>
    </div>
  );
};

export default React.memo(ProgressiveDirectusImage);