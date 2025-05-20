// @ts-nocheck
/**
 * HotelMapView Component
 * 
 * An interactive map view displaying hotel locations for CinCin Hotels application.
 * Uses MapComponent with custom markers and tooltips.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MapComponent from '../../../components/ui/maps/MapComponent';
import MapMarker from '../../../components/ui/maps/MapMarker';
import MapTooltip from '../../../components/ui/maps/MapTooltip';
import { useRtl } from '../../hooks/useRtl';
import { HotelMapItem, HotelMapViewProps } from '../../types/advanced-ui';
import { getHotelImage } from '../../utils/image-helpers';

/**
 * HotelMapView displays hotels on an interactive map with tooltips
 */
const HotelMapView: React.FC<HotelMapViewProps> = ({
  hotels = [],
  onHotelClick,
  initialCenter,
  initialZoom = 10,
  enableControls = true,
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
  // Convert hotels to mapItems
  const mapItems: HotelMapItem[] = useMemo(() => {
    return hotels.map(hotel => ({
      id: hotel.id,
      name: hotel.name,
      location: hotel.location,
      slug: hotel.slug,
      image: hotel.image,
      coordinates: hotel.coordinates,
    }));
  }, [hotels]);
  
  // State tracking
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // RTL support
  const { isRtl } = useRtl();
  
  // Handle initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle hotel selection
  const handleHotelClick = useCallback((hotel: HotelMapItem) => {
    if (onHotelClick) {
      onHotelClick(hotel);
    }
  }, [onHotelClick]);
  
  // Custom marker renderer
  const renderCustomMarker = useCallback((
    item: HotelMapItem, 
    index: number, 
    isHovered: boolean, 
    isSelected: boolean
  ) => {
    return (
      <MapMarker
        item={item}
        index={index}
        isHovered={isHovered}
        isSelected={isSelected}
        onClick={() => handleHotelClick(item)}
        onHover={() => {}}
        onLeave={() => {}}
        color="brand-olive"
        size="medium"
        animated={animationsEnabled && !reducedMotion}
        rtlAware={rtlAware && isRtl}
        variant="default"
        ariaLabel={`${item.name} in ${item.location}`}
      />
    );
  }, [handleHotelClick, animationsEnabled, reducedMotion, rtlAware, isRtl]);
  
  // Custom tooltip renderer
  const renderCustomTooltip = useCallback((item: HotelMapItem) => {
    return (
      <MapTooltip
        item={item}
        visible={true}
        onClick={() => handleHotelClick(item)}
        onViewDetails={() => handleHotelClick(item)}
        placement="top"
        autoAdjust={true}
        rtlAware={rtlAware && isRtl}
        animated={animationsEnabled && !reducedMotion}
        showImage={true}
        imageUrl={typeof item.image === 'string' ? item.image : getHotelImage(item.image, item.slug)}
        extraContent={
          <div className="mt-1 flex items-center text-xs text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {item.location}
          </div>
        }
      />
    );
  }, [handleHotelClick, rtlAware, isRtl, animationsEnabled, reducedMotion]);
  
  // Get Switzerland coordinates as default center
  const defaultCenter = { lat: 46.8182, lng: 8.2275 };
  
  return (
    <MapComponent
      items={mapItems}
      onItemClick={handleHotelClick}
      initialCenter={initialCenter || defaultCenter}
      initialZoom={initialZoom}
      backgroundImage="/images/map-background.jpg"
      enableClustering={true}
      enableControls={enableControls}
      enableTooltips={true}
      renderMarker={renderCustomMarker}
      renderTooltip={renderCustomTooltip}
      isLoading={isLoading}
      errorMessage={error}
      minHeight="600px"
      enableKeyboardControls={true}
      enableTouchControls={true}
      enableWheelZoom={true}
      markerColor="brand-olive"
      markerVariant="default"
      className={`rounded-xl shadow-lg overflow-hidden ${className}`}
      style={style}
      id={id}
      visible={visible}
      rtlAware={rtlAware}
      animationVariant={animationVariant}
      animationDelay={animationDelay}
      animationDuration={animationDuration}
      animationsEnabled={animationsEnabled}
      reducedMotion={reducedMotion}
    />
  );
};

export default React.memo(HotelMapView);