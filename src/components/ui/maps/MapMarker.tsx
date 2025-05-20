/**
 * MapMarker Component
 * 
 * A reusable, optimized marker component for map displays in CinCin Hotels application.
 */

import React, { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAnimation } from '../../../hooks/useAnimation';
import { useRtl } from '../../../hooks/useRtl';
import { HotelMapItem } from '../../../types/advanced-ui';

interface MapMarkerProps {
  /** The map item this marker represents */
  item: HotelMapItem;
  
  /** Display index for the marker */
  index: number;
  
  /** Whether this marker is currently hovered */
  isHovered: boolean;
  
  /** Whether this marker is currently selected */
  isSelected: boolean;
  
  /** Whether this marker represents a cluster */
  isCluster?: boolean;
  
  /** Number of items in cluster (if isCluster=true) */
  clusterCount?: number;
  
  /** Callback when marker is clicked */
  onClick: () => void;
  
  /** Callback when marker is hovered */
  onHover: () => void;
  
  /** Callback when hover ends */
  onLeave: () => void;
  
  /** Optional custom color */
  color?: string;
  
  /** Optional size override */
  size?: 'small' | 'medium' | 'large';
  
  /** Enable marker animations */
  animated?: boolean;
  
  /** RTL-aware rendering */
  rtlAware?: boolean;
  
  /** Custom variant (for different marker styles) */
  variant?: 'default' | 'pin' | 'dot';
  
  /** Custom CSS class */
  className?: string;
  
  /** ARIA label for accessibility */
  ariaLabel?: string;
}

/**
 * Optimized map marker component with animations
 */
const MapMarker: React.FC<MapMarkerProps> = React.memo(({
  item,
  index,
  isHovered,
  isSelected,
  isCluster = false,
  clusterCount = 0,
  onClick,
  onHover,
  onLeave,
  color = 'brand-olive',
  size = 'medium',
  animated = true,
  rtlAware = true,
  variant = 'default',
  className = '',
  ariaLabel,
}) => {
  // Animation utilities
  const { getEntranceProps } = useAnimation({
    variant: 'scale',
    delay: 0.05 * index,
    animationsEnabled: animated,
  });
  
  // RTL support
  const { isRtl } = useRtl();
  
  // Click handling with debounce for touch interfaces
  const lastClickRef = useRef<number>(0);
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Debounce clicks to prevent double-clicks
    const now = Date.now();
    if (now - lastClickRef.current < 300) return;
    lastClickRef.current = now;
    
    onClick();
  }, [onClick]);
  
  // Determine marker size in pixels
  const sizeInPixels = size === 'small' ? 20 : size === 'large' ? 32 : 24;
  
  // Determine pin height if using pin variant
  const pinHeight = size === 'small' ? 24 : size === 'large' ? 40 : 30;
  
  // Get primary color variants
  const getColorClasses = () => {
    // Default color scheme (brand-olive)
    let bgColor = 'bg-white';
    let textColor = 'text-brand-olive-500';
    let borderColor = 'border-brand-olive-300';
    
    if (isHovered || isSelected) {
      bgColor = 'bg-brand-olive-500';
      textColor = 'text-white';
      borderColor = 'border-transparent';
    }
    
    // Custom color handling
    if (color !== 'brand-olive') {
      if (color === 'primary') {
        textColor = isHovered || isSelected ? 'text-white' : 'text-blue-500';
        borderColor = isHovered || isSelected ? 'border-transparent' : 'border-blue-300';
        if (isHovered || isSelected) bgColor = 'bg-blue-500';
      } else if (color === 'secondary') {
        textColor = isHovered || isSelected ? 'text-white' : 'text-gray-700';
        borderColor = isHovered || isSelected ? 'border-transparent' : 'border-gray-300';
        if (isHovered || isSelected) bgColor = 'bg-gray-700';
      } else if (color.startsWith('#')) {
        // Custom hex color
        textColor = isHovered || isSelected ? 'text-white' : '';
        borderColor = 'border-gray-200';
        if (isHovered || isSelected) {
          // Use inline style for custom color
          return {
            bg: color,
            text: '#FFFFFF',
            border: 'transparent',
            useInlineStyle: true
          };
        }
      }
    }
    
    return {
      bg: bgColor,
      text: textColor,
      border: borderColor,
      useInlineStyle: false
    };
  };
  
  const colors = getColorClasses();
  
  // Generate appropriate ARIA label
  const accessibilityLabel = ariaLabel || 
    (isCluster ? `Cluster of ${clusterCount} hotels near ${item.name || ''}` : `${item.name} in ${item.location || ''}`);
  
  // Marker content (number or icon)
  const content = isCluster ? (
    <span className="text-xs font-medium">{clusterCount}</span>
  ) : (
    <span className="text-xs font-medium">{index + 1}</span>
  );
  
  // Render appropriate marker based on variant
  const renderMarker = () => {
    switch (variant) {
      case 'pin':
        return (
          <div 
            className={`relative ${className}`}
            style={{ height: pinHeight, width: sizeInPixels }}
          >
            <div 
              className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 ${colors.useInlineStyle ? '' : colors.bg} rounded-t-full w-full`}
              style={colors.useInlineStyle ? { backgroundColor: colors.bg } : undefined}
            >
              <div 
                className={`flex items-center justify-center h-${sizeInPixels / 4} w-full ${colors.useInlineStyle ? '' : colors.text}`}
                style={colors.useInlineStyle ? { color: colors.text } : undefined}
              >
                {content}
              </div>
              <div 
                className={`h-0 w-0 border-l-${sizeInPixels / 2} border-r-${sizeInPixels / 2} border-t-${sizeInPixels / 2} border-l-transparent border-r-transparent ${colors.useInlineStyle ? '' : 'border-t-' + colors.bg.replace('bg-', '')}`}
                style={colors.useInlineStyle ? { borderTopColor: colors.bg, borderLeftWidth: sizeInPixels / 2, borderRightWidth: sizeInPixels / 2, borderTopWidth: sizeInPixels / 2 } : undefined}
              ></div>
            </div>
          </div>
        );
        
      case 'dot':
        return (
          <div 
            className={`h-${Math.round(sizeInPixels * 0.75)} w-${Math.round(sizeInPixels * 0.75)} rounded-full ${colors.useInlineStyle ? '' : `${colors.bg} ${colors.border}`} border-2 shadow-md ${className}`}
            style={colors.useInlineStyle ? { backgroundColor: colors.bg, borderColor: colors.border } : undefined}
          ></div>
        );
        
      case 'default':
      default:
        return (
          <div 
            className={`h-${sizeInPixels / 8}rem w-${sizeInPixels / 8}rem rounded-full flex items-center justify-center border ${colors.useInlineStyle ? '' : `${colors.bg} ${colors.text} ${colors.border}`} ${className}`}
            style={colors.useInlineStyle ? { backgroundColor: colors.bg, color: colors.text, borderColor: colors.border, width: sizeInPixels, height: sizeInPixels } : undefined}
          >
            {content}
          </div>
        );
    }
  };
  
  return (
    <motion.div
      {...getEntranceProps()}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="cursor-pointer transform -translate-x-1/2 -translate-y-1/2 select-none z-10"
      aria-label={accessibilityLabel}
      role="button"
      tabIndex={0}
      dir={rtlAware && isRtl ? 'rtl' : 'ltr'}
    >
      {renderMarker()}
    </motion.div>
  );
});

MapMarker.displayName = 'MapMarker';

export default MapMarker;