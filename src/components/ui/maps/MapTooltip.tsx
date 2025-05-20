/**
 * MapTooltip Component
 * 
 * An interactive tooltip for map markers in CinCin Hotels application,
 * with optimized rendering and accessibility.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimation } from '../../../hooks/useAnimation';
import { useRtl } from '../../../hooks/useRtl';
import { HotelMapItem } from '../../../types/advanced-ui';
import LazyImage from '../common/LazyImage';
import { getHotelImage } from '../../../utils/image-helpers';

interface MapTooltipProps {
  /** The map item this tooltip represents */
  item: HotelMapItem;
  
  /** Whether the tooltip should be visible */
  visible: boolean;
  
  /** Callback when the tooltip is clicked */
  onClick: () => void;
  
  /** Callback when "View Details" is clicked */
  onViewDetails?: () => void;
  
  /** Position offset (relative to marker) */
  offset?: { x: number; y: number };
  
  /** Tooltip placement */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  
  /** Automatically adjust position to stay in viewport */
  autoAdjust?: boolean;
  
  /** Custom CSS class */
  className?: string;
  
  /** RTL-aware rendering */
  rtlAware?: boolean;
  
  /** Enable animations */
  animated?: boolean;
  
  /** Optional extra content to display */
  extraContent?: React.ReactNode;
  
  /** Custom image URL to override default */
  imageUrl?: string;
  
  /** Whether to show the image */
  showImage?: boolean;
}

/**
 * MapTooltip displays information about a map item on hover
 */
const MapTooltip: React.FC<MapTooltipProps> = React.memo(({
  item,
  visible,
  onClick,
  onViewDetails,
  offset = { x: 0, y: 0 },
  placement = 'top',
  autoAdjust = true,
  className = '',
  rtlAware = true,
  animated = true,
  extraContent,
  imageUrl,
  showImage = true,
}) => {
  // State for position adjustment
  const [adjustedPlacement, setAdjustedPlacement] = useState<string>(placement);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  
  // Refs
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  // Animation utilities
  const { getEntranceProps, getExitProps } = useAnimation({
    variant: 'scale',
    animationsEnabled: animated,
  });
  
  // RTL support
  const { isRtl, direction } = useRtl();
  
  // Handle RTL placement adjustment
  useEffect(() => {
    if (rtlAware && isRtl) {
      if (placement === 'left') setAdjustedPlacement('right');
      else if (placement === 'right') setAdjustedPlacement('left');
      else setAdjustedPlacement(placement);
    } else {
      setAdjustedPlacement(placement);
    }
  }, [rtlAware, isRtl, placement]);
  
  // Handle visibility with slight delay for better UX
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [visible]);
  
  // Auto-adjust position to stay in viewport
  useEffect(() => {
    if (!tooltipRef.current || !autoAdjust || !isVisible) return;
    
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Check if tooltip is outside viewport
    const isOutsideRight = tooltipRect.right > viewportWidth - 20;
    const isOutsideLeft = tooltipRect.left < 20;
    const isOutsideTop = tooltipRect.top < 20;
    const isOutsideBottom = tooltipRect.bottom > viewportHeight - 20;
    
    // Adjust placement if needed
    if (adjustedPlacement === 'top' && isOutsideTop) {
      setAdjustedPlacement('bottom');
    } else if (adjustedPlacement === 'bottom' && isOutsideBottom) {
      setAdjustedPlacement('top');
    } else if (adjustedPlacement === 'left' && isOutsideLeft) {
      setAdjustedPlacement('right');
    } else if (adjustedPlacement === 'right' && isOutsideRight) {
      setAdjustedPlacement('left');
    }
  }, [isVisible, autoAdjust, adjustedPlacement]);
  
  // Handle click events
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) onClick();
  };
  
  const handleViewDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewDetails) onViewDetails();
    else if (onClick) onClick();
  };
  
  // Get image URL
  const tooltipImageUrl = imageUrl || 
    (typeof item.image === 'string' ? item.image : getHotelImage(item.image, item.slug));
  
  // Determine placement styles
  const getPlacementStyles = () => {
    switch (adjustedPlacement) {
      case 'bottom':
        return {
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '8px',
        };
      case 'left':
        return {
          top: '50%',
          right: '100%',
          transform: 'translateY(-50%)',
          marginRight: '8px',
        };
      case 'right':
        return {
          top: '50%',
          left: '100%',
          transform: 'translateY(-50%)',
          marginLeft: '8px',
        };
      case 'top':
      default:
        return {
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '8px',
        };
    }
  };
  
  // Add marker for the tooltip (arrow)
  const getTooltipMarker = () => {
    const markerSize = '8px';
    
    switch (adjustedPlacement) {
      case 'bottom':
        return (
          <div 
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full" 
            style={{ borderLeft: `${markerSize} solid transparent`, borderRight: `${markerSize} solid transparent`, borderBottom: `${markerSize} solid white` }}
          ></div>
        );
      case 'left':
        return (
          <div 
            className="absolute top-1/2 right-0 transform translate-x-full -translate-y-1/2" 
            style={{ borderTop: `${markerSize} solid transparent`, borderBottom: `${markerSize} solid transparent`, borderLeft: `${markerSize} solid white` }}
          ></div>
        );
      case 'right':
        return (
          <div 
            className="absolute top-1/2 left-0 transform -translate-x-full -translate-y-1/2" 
            style={{ borderTop: `${markerSize} solid transparent`, borderBottom: `${markerSize} solid transparent`, borderRight: `${markerSize} solid white` }}
          ></div>
        );
      case 'top':
      default:
        return (
          <div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full" 
            style={{ borderLeft: `${markerSize} solid transparent`, borderRight: `${markerSize} solid transparent`, borderTop: `${markerSize} solid white` }}
          ></div>
        );
    }
  };
  
  // Animation variants
  const tooltipVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      scale: 0.9, 
      transition: { duration: 0.2 }
    },
  };
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={tooltipRef}
          className={`absolute z-20 w-60 ${className}`}
          style={{
            ...getPlacementStyles(),
            marginLeft: offset.x,
            marginTop: offset.y,
          }}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={tooltipVariants}
          onClick={handleClick}
          dir={rtlAware ? direction : undefined}
        >
          <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
            {getTooltipMarker()}
            
            {showImage && tooltipImageUrl && (
              <div className="aspect-[4/3] relative">
                <LazyImage
                  src={tooltipImageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                  priority={true}
                />
              </div>
            )}
            
            <div className="p-3">
              <h3 className="font-medium text-gray-900">{item.name}</h3>
              {item.location && (
                <p className="text-sm text-gray-600">{item.location}</p>
              )}
              
              {extraContent}
              
              <button
                onClick={handleViewDetailsClick}
                className="mt-2 text-sm text-brand-olive-600 hover:text-brand-olive-700 font-medium flex items-center"
              >
                View Details
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 ml-1 ${isRtl ? 'transform rotate-180' : ''}`}
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

MapTooltip.displayName = 'MapTooltip';

export default MapTooltip;