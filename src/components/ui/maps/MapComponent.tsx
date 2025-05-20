/**
 * MapComponent
 * 
 * A comprehensive map component for CinCin Hotels application
 * that integrates all map-related functionality.
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useMapInteractions } from '../../../hooks/useMapInteractions';
import { HotelMapItem, HotelCoordinates, BaseLayoutProps, BaseAnimationProps } from '../../../types/advanced-ui';
import { useRtl } from '../../../hooks/useRtl';
import LazyImage from '../common/LazyImage';
import LazyMap from './LazyMap';
import MapMarker from './MapMarker';
import MapTooltip from './MapTooltip';

interface MapComponentProps extends BaseLayoutProps, BaseAnimationProps {
  /** Items to display on the map */
  items: HotelMapItem[];
  
  /** Callback when an item is clicked */
  onItemClick?: (item: HotelMapItem) => void;
  
  /** Initial center coordinates */
  initialCenter?: HotelCoordinates;
  
  /** Initial zoom level */
  initialZoom?: number;
  
  /** Background image URL */
  backgroundImage?: string;
  
  /** Enable marker clustering */
  enableClustering?: boolean;
  
  /** Enable map controls */
  enableControls?: boolean;
  
  /** Enable interactive tooltips */
  enableTooltips?: boolean;
  
  /** Custom marker renderer */
  renderMarker?: (item: HotelMapItem, index: number, isHovered: boolean, isSelected: boolean) => React.ReactNode;
  
  /** Custom tooltip renderer */
  renderTooltip?: (item: HotelMapItem) => React.ReactNode;
  
  /** Loading state indicator */
  isLoading?: boolean;
  
  /** Error message if map fails to load */
  errorMessage?: string | null;
  
  /** Minimum height for the map container */
  minHeight?: string;
  
  /** Whether to enable keyboard controls */
  enableKeyboardControls?: boolean;
  
  /** Whether to enable touch controls */
  enableTouchControls?: boolean;
  
  /** Whether to enable mouse wheel zoom */
  enableWheelZoom?: boolean;
  
  /** Custom marker color */
  markerColor?: string;
  
  /** Custom marker variant */
  markerVariant?: 'default' | 'pin' | 'dot';
}

/**
 * MapComponent - A full-featured map implementation
 */
const MapComponent: React.FC<MapComponentProps> = ({
  items = [],
  onItemClick,
  initialCenter,
  initialZoom = 10,
  backgroundImage = '/images/map-background.jpg',
  enableClustering = true,
  enableControls = true,
  enableTooltips = true,
  renderMarker,
  renderTooltip,
  isLoading: externalLoading,
  errorMessage,
  minHeight = '400px',
  enableKeyboardControls = true,
  enableTouchControls = true,
  enableWheelZoom = true,
  markerColor = 'brand-olive',
  markerVariant = 'default',
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
  // State for internal loading
  const [internalLoading, setInternalLoading] = useState(true);
  
  // Ref for map container element
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Memoize items to prevent unnecessary re-renders
  const memoizedItems = useMemo(() => items, [items]);
  
  // Get viewport dimensions for virtualized rendering
  const getViewportSize = () => {
    if (typeof window === 'undefined') return { width: 800, height: 600 };
    return { 
      width: mapContainerRef.current?.clientWidth || window.innerWidth, 
      height: mapContainerRef.current?.clientHeight || window.innerHeight 
    };
  };
  
  // Use map interactions hook
  const {
    zoom,
    center,
    isDragging,
    visibleItems,
    hoveredItem,
    selectedItem,
    isClustered,
    zoomIn,
    zoomOut,
    setHoveredItem,
    setSelectedItem,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    handleKeyDown,
    handleMarkerClick,
    isMarkerVisible,
    getMarkerPosition,
    fitBounds
  } = useMapInteractions({
    initialItems: memoizedItems,
    initialCenter,
    initialZoom,
    enableClustering,
    enableKeyboardControls,
    enableTouchControls,
    enableWheelZoom,
    onItemSelect: onItemClick,
    viewportSize: getViewportSize(),
  });
  
  // RTL support
  const { isRtl, direction } = useRtl();
  
  // Track if component is mounted
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Simulate delayed loading for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isMounted.current) {
        setInternalLoading(false);
      }
    }, 500);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);
  
  // Fit bounds when items change
  useEffect(() => {
    if (memoizedItems.length > 0 && !internalLoading) {
      fitBounds();
    }
  }, [memoizedItems, internalLoading, fitBounds]);
  
  // Determine if loading should be shown
  const isLoading = externalLoading !== undefined ? externalLoading : internalLoading;
  
  // Update viewport dimensions when resized
  useEffect(() => {
    const handleResize = () => {
      if (mapContainerRef.current) {
        // Trigger a re-optimization for the new viewport size
        fitBounds();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [fitBounds]);
  
  // Default marker renderer
  const defaultRenderMarker = useCallback((item: HotelMapItem, index: number, isHovered: boolean, isSelected: boolean) => {
    return (
      <MapMarker
        item={item}
        index={index}
        isHovered={isHovered}
        isSelected={isSelected}
        isCluster={'count' in item && item.count > 1}
        clusterCount={'count' in item ? item.count : 0}
        onClick={() => handleMarkerClick(item)}
        onHover={() => setHoveredItem(item)}
        onLeave={() => setHoveredItem(null)}
        color={markerColor}
        variant={markerVariant}
        animated={animationsEnabled && !reducedMotion}
        rtlAware={rtlAware}
      />
    );
  }, [handleMarkerClick, setHoveredItem, markerColor, markerVariant, animationsEnabled, reducedMotion, rtlAware]);
  
  // Default tooltip renderer
  const defaultRenderTooltip = useCallback((item: HotelMapItem) => {
    return (
      <MapTooltip
        item={item}
        visible={!!hoveredItem && hoveredItem.id === item.id}
        onClick={() => handleMarkerClick(item)}
        rtlAware={rtlAware}
        animated={animationsEnabled && !reducedMotion}
      />
    );
  }, [hoveredItem, handleMarkerClick, rtlAware, animationsEnabled, reducedMotion]);
  
  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enableTouchControls) return;
    // Extract the touch data we need instead of passing the whole event
    if (e.touches && e.touches[0]) {
      const touch = e.touches[0];
      const mouseEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY,
        preventDefault: () => e.preventDefault()
      } as React.MouseEvent;
      handleMouseDown(mouseEvent);
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!enableTouchControls) return;
    // Extract the touch data we need instead of passing the whole event
    if (e.touches && e.touches[0]) {
      const touch = e.touches[0];
      const mouseEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY,
        preventDefault: () => e.preventDefault()
      } as React.MouseEvent;
      handleMouseMove(mouseEvent);
    }
  };
  
  const handleTouchEnd = () => {
    if (!enableTouchControls) return;
    handleMouseUp();
  };
  
  // Wheel handler for zooming
  const handleWheelEvent = (e: React.WheelEvent) => {
    if (!enableWheelZoom) return;
    e.preventDefault();
    handleWheel(e);
  };
  
  // Keyboard handler for map navigation
  const handleKeyDownEvent = (e: React.KeyboardEvent) => {
    if (!enableKeyboardControls) return;
    handleKeyDown(e);
  };
  
  return (
    <LazyMap
      isLoading={isLoading}
      errorMessage={errorMessage}
      placeholderImage={backgroundImage}
      minHeight={minHeight}
      className={className}
      style={style}
      id={id}
      visible={visible}
      rtlAware={rtlAware}
      animationVariant={animationVariant}
      animationDelay={animationDelay}
      animationDuration={animationDuration}
      animationsEnabled={animationsEnabled}
      reducedMotion={reducedMotion}
    >
      <div
        ref={mapContainerRef}
        className="relative w-full h-full min-h-[400px] rounded-xl overflow-hidden focus:outline-none"
        onMouseDown={(e) => handleMouseDown(e)}
        onMouseMove={(e) => handleMouseMove(e)}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheelEvent}
        onKeyDown={handleKeyDownEvent}
        tabIndex={0}
        role="application"
        aria-label="Interactive map"
        dir={rtlAware ? direction : undefined}
        style={{ cursor: isDragging ? 'grabbing' : 'grab', ...style }}
      >
        {/* Map Background */}
        <div className="absolute inset-0 bg-[#f2f1eb]">
          <LazyImage
            src={backgroundImage}
            alt="Map background"
            fill
            className="object-cover opacity-60"
          />
        </div>
        
        {/* Map Items/Markers */}
        {!isLoading && visibleItems.map((item, index) => {
          // Get marker position
          const { x, y } = getMarkerPosition(
            item,
            mapContainerRef.current?.clientWidth || 800,
            mapContainerRef.current?.clientHeight || 600
          );
          
          const isHovered = hoveredItem?.id === item.id;
          const isSelected = selectedItem?.id === item.id;
          
          return (
            <div
              key={item.id}
              className="absolute"
              style={{ 
                left: `${x}px`, 
                top: `${y}px`,
                zIndex: isHovered || isSelected ? 20 : 10 
              }}
            >
              {/* Custom or default marker */}
              {renderMarker 
                ? renderMarker(item, index, isHovered, isSelected)
                : defaultRenderMarker(item, index, isHovered, isSelected)}
              
              {/* Tooltip */}
              {enableTooltips && (
                renderTooltip 
                  ? renderTooltip(item)
                  : defaultRenderTooltip(item)
              )}
            </div>
          );
        })}
        
        {/* Map Controls */}
        {enableControls && (
          <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-2 flex flex-col">
            <button 
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-olive-500"
              onClick={zoomIn}
              aria-label="Zoom in"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button 
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-olive-500"
              onClick={zoomOut}
              aria-label="Zoom out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <button 
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-olive-500 mt-2"
              onClick={(e) => {
                e.preventDefault();
                fitBounds();
              }}
              aria-label="Fit map to all markers"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Keyboard Instructions - only shown when focused with keyboard */}
        {enableKeyboardControls && (
          <div className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:bottom-16 focus-within:left-4 focus-within:bg-white focus-within:p-3 focus-within:rounded-md focus-within:shadow-md focus-within:text-sm focus-within:text-gray-700">
            <p>Use arrow keys to pan, +/- to zoom, 0 to reset view</p>
          </div>
        )}
      </div>
    </LazyMap>
  );
};

export default React.memo(MapComponent);