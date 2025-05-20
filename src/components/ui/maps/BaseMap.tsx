/**
 * BaseMap Component
 * 
 * A foundation component for map implementations in CinCin Hotels application
 * with support for markers, interaction, and RTL layouts.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRtl } from '../../../hooks/useRtl';
import { HotelCoordinates, HotelMapItem, BaseLayoutProps, BaseAnimationProps } from '../../../types/advanced-ui';

export interface BaseMapProps extends BaseLayoutProps, BaseAnimationProps {
  /** Items to display as markers on the map */
  items: HotelMapItem[];
  
  /** Callback when a map item is clicked */
  onItemClick?: (item: HotelMapItem) => void;
  
  /** Initial map center coordinates */
  initialCenter?: HotelCoordinates;
  
  /** Initial zoom level (1-20) */
  initialZoom?: number;
  
  /** Map background image */
  backgroundImage?: string;
  
  /** Enable map controls */
  enableControls?: boolean;
  
  /** Enable interactive tooltips */
  enableTooltips?: boolean;
  
  /** Custom render function for markers */
  renderMarker?: (item: HotelMapItem, isHovered: boolean, onClick: () => void, onHover: () => void) => React.ReactNode;
  
  /** Custom render function for tooltips */
  renderTooltip?: (item: HotelMapItem) => React.ReactNode;
  
  /** Loading state indicator */
  isLoading?: boolean;
  
  /** Error message if map fails to load */
  errorMessage?: string;
}

/**
 * BaseMap component provides a foundation for map-based displays
 */
const BaseMap: React.FC<BaseMapProps> = ({
  items = [],
  onItemClick,
  initialCenter,
  initialZoom = 10,
  backgroundImage = '/images/map-background.jpg',
  enableControls = true,
  enableTooltips = true,
  renderMarker,
  renderTooltip,
  isLoading = false,
  errorMessage,
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
  const [hoveredItem, setHoveredItem] = useState<HotelMapItem | null>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(initialZoom);
  const mapRef = useRef<HTMLDivElement>(null);
  
  // RTL support
  const { isRtl, direction, getOrderedArray } = useRtl();
  
  // Handle map loading
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setMapLoaded(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);
  
  // Item interaction handlers
  const handleItemClick = useCallback((item: HotelMapItem) => {
    if (onItemClick) {
      onItemClick(item);
    }
  }, [onItemClick]);
  
  const handleItemHover = useCallback((item: HotelMapItem | null) => {
    setHoveredItem(item);
  }, []);
  
  // Map control handlers
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 1, 20));
  }, []);
  
  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 1, 1));
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: reducedMotion ? 0 : animationDuration / 1000,
        delay: reducedMotion ? 0 : animationDelay / 1000,
      }
    }
  };
  
  const markerVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: (custom: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        duration: reducedMotion ? 0 : 0.3,
        delay: reducedMotion ? 0 : (custom * 0.05) + (animationDelay / 1000),
      }
    }),
    hover: {
      scale: 1.1,
      transition: {
        duration: reducedMotion ? 0 : 0.2,
      }
    }
  };
  
  const tooltipVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: reducedMotion ? 0 : 0.2,
      }
    },
    exit: {
      opacity: 0,
      y: 10,
      scale: 0.9,
      transition: {
        duration: reducedMotion ? 0 : 0.1,
      }
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-brand-olive-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-500">Loading map view...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (errorMessage) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center p-6 max-w-md">
          <svg className="h-12 w-12 text-red-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-gray-700 font-medium mb-2">Map could not be loaded</p>
          <p className="text-gray-500 text-sm">{errorMessage}</p>
        </div>
      </div>
    );
  }
  
  if (!visible) {
    return null;
  }
  
  // Order the items array for RTL if needed
  const orderedItems = rtlAware ? getOrderedArray(items) : items;
  
  return (
    <motion.div
      ref={mapRef}
      className={`relative w-full h-full min-h-[400px] rounded-xl overflow-hidden ${className}`}
      style={style}
      id={id}
      dir={rtlAware ? direction : undefined}
      initial={animationsEnabled ? "hidden" : "visible"}
      animate={animationsEnabled ? "visible" : "visible"}
      variants={containerVariants}
    >
      {/* Map Background */}
      <div className="absolute inset-0 bg-[#f2f1eb]">
        <Image
          src={backgroundImage}
          alt="Map background"
          fill
          className="object-cover opacity-60"
          onLoad={() => setMapLoaded(true)}
        />
      </div>
      
      {/* Map Items/Markers */}
      {mapLoaded && orderedItems.map((item, index) => {
        // Calculate position - in a real implementation, this would use actual coordinates
        // For demo, we create pseudo-random positions based on item id
        const id = typeof item.id === 'string' ? parseInt(item.id, 10) || index : item.id || index;
        const randomFactor = index * 17 % 80;
        
        // Use provided coordinates or generate mock ones
        const posX = item.coordinates?.lng !== undefined 
          ? (item.coordinates.lng + 180) / 360 * 100 
          : (randomFactor + 10); // 10-90% of width
        
        const posY = item.coordinates?.lat !== undefined
          ? (90 - item.coordinates.lat) / 180 * 100
          : ((id * 23) % 80) + 10; // 10-90% of height
        
        const isHovered = hoveredItem?.id === item.id;
        
        return (
          <div
            key={item.id}
            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${posX}%`, top: `${posY}%` }}
            onMouseEnter={() => handleItemHover(item)}
            onMouseLeave={() => handleItemHover(null)}
            onClick={() => handleItemClick(item)}
          >
            {/* Custom or default marker */}
            {renderMarker ? (
              renderMarker(
                item, 
                isHovered, 
                () => handleItemClick(item), 
                () => handleItemHover(item)
              )
            ) : (
              <motion.div
                custom={index}
                initial={animationsEnabled ? "hidden" : "visible"}
                animate={animationsEnabled ? (isHovered ? "hover" : "visible") : "visible"}
                variants={markerVariants}
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isHovered
                    ? 'bg-brand-olive-500 text-white'
                    : 'bg-white border border-brand-olive-300 text-brand-olive-500'
                }`}
              >
                <span className="text-xs font-medium">{index + 1}</span>
              </motion.div>
            )}
            
            {/* Tooltip */}
            {enableTooltips && (
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={tooltipVariants}
                    className="absolute z-10 w-60 bg-white rounded-lg shadow-lg overflow-hidden mt-2 -ml-24"
                  >
                    {renderTooltip ? (
                      renderTooltip(item)
                    ) : (
                      <>
                        {item.image && (
                          <div className="aspect-[4/3] relative">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="p-3">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.location}</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleItemClick(item);
                            }}
                            className="mt-2 text-sm text-brand-olive-600 hover:text-brand-olive-700 font-medium"
                          >
                            View Details →
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        );
      })}
      
      {/* Map Controls */}
      {enableControls && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-2 flex flex-col">
          <button 
            className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={handleZoomIn}
            aria-label="Zoom in"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <button 
            className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={handleZoomOut}
            aria-label="Zoom out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default BaseMap;