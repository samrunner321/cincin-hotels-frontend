/**
 * LazyMap Component
 * 
 * A lazily loaded map component for CinCin Hotels application
 * with optimized performance and loading states.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimation } from '../../../hooks/useAnimation';
import { BaseLayoutProps, BaseAnimationProps } from '../../../types/advanced-ui';
import LoadingSpinner from '../LoadingSpinner';

interface LazyMapProps extends BaseLayoutProps, BaseAnimationProps {
  /** Map component to render after lazy loading */
  children: React.ReactNode;
  
  /** Loading state override (useful for data-dependent maps) */
  isLoading?: boolean;
  
  /** Loading delay in ms (for smoother UX) */
  loadingDelay?: number;
  
  /** Low-quality placeholder image */
  placeholderImage?: string;
  
  /** Minimum height of the map container */
  minHeight?: string;
  
  /** Callback when map is loaded */
  onLoad?: () => void;
  
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  
  /** Error message to display */
  errorMessage?: string | null;
  
  /** Custom error component */
  errorComponent?: React.ReactNode;
}

/**
 * LazyMap provides optimized loading for map components
 */
const LazyMap: React.FC<LazyMapProps> = ({
  children,
  isLoading: isLoadingProp,
  loadingDelay = 500,
  placeholderImage,
  minHeight = '400px',
  onLoad,
  loadingComponent,
  errorMessage,
  errorComponent,
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
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(!!errorMessage);
  const [internalIsLoading, setInternalIsLoading] = useState<boolean>(true);
  
  // Combine loading state from props and internal state
  const isLoading = isLoadingProp !== undefined ? isLoadingProp : internalIsLoading;
  
  // Intersection observer reference
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Animation utilities
  const { getEntranceProps, getExitProps } = useAnimation({
    variant: animationVariant,
    duration: animationDuration / 1000,
    delay: animationDelay / 1000,
    animationsEnabled,
    overrideReducedMotion: !reducedMotion,
  });
  
  // Setup intersection observer for lazy loading
  useEffect(() => {
    if (!mapRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        // When map enters viewport
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(mapRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  // Simulate loading delay for better UX
  useEffect(() => {
    if (!isVisible) return;
    
    const loadingTimer = setTimeout(() => {
      setInternalIsLoading(false);
      setIsLoaded(true);
      
      if (onLoad) {
        onLoad();
      }
    }, loadingDelay);
    
    return () => {
      clearTimeout(loadingTimer);
    };
  }, [isVisible, loadingDelay, onLoad]);
  
  // Update error state when errorMessage changes
  useEffect(() => {
    setIsError(!!errorMessage);
  }, [errorMessage]);
  
  // If not visible, don't render anything substantial
  if (!visible) {
    return null;
  }
  
  // Error state
  if (isError) {
    return (
      <div
        ref={mapRef}
        className={`w-full relative rounded-lg overflow-hidden ${className}`}
        style={{ minHeight, ...style }}
        id={id}
      >
        {errorComponent || (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Map could not be loaded</h3>
            <p className="text-sm text-gray-600">{errorMessage}</p>
          </div>
        )}
      </div>
    );
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div
        ref={mapRef}
        className={`w-full relative rounded-lg overflow-hidden ${className}`}
        style={{ minHeight, ...style }}
        id={id}
      >
        {placeholderImage && (
          <div className="absolute inset-0 bg-gray-200">
            <img
              src={placeholderImage}
              alt="Map loading placeholder"
              className="w-full h-full object-cover opacity-30"
            />
          </div>
        )}
        
        {loadingComponent || (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 bg-opacity-70">
            <LoadingSpinner size="large" color="olive" />
            <p className="mt-4 text-gray-600">Loading map view...</p>
          </div>
        )}
      </div>
    );
  }
  
  // Loaded state
  return (
    <div
      ref={mapRef}
      className={`w-full relative rounded-lg overflow-hidden ${className}`}
      style={{ minHeight, ...style }}
      id={id}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="w-full h-full"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 }
            }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(LazyMap);