/**
 * useMapInteractions Hook
 * 
 * A comprehensive hook for handling all map interactions in CinCin Hotels application.
 * Integrates marker management, map controls, and user interactions.
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { HotelMapItem, HotelCoordinates } from '../types/advanced-ui';
import { useMapControls } from './useMapControls';
import { useMapMarkers } from './useMapMarkers';

export interface MapInteractionOptions {
  /** Initial array of map items */
  initialItems?: HotelMapItem[];
  
  /** Initial center coordinates */
  initialCenter?: HotelCoordinates;
  
  /** Initial zoom level */
  initialZoom?: number;
  
  /** Enable marker clustering */
  enableClustering?: boolean;
  
  /** Enable keyboard navigation */
  enableKeyboardControls?: boolean;
  
  /** Enable touch controls */
  enableTouchControls?: boolean;
  
  /** Enable wheel zoom */
  enableWheelZoom?: boolean;
  
  /** Callback when an item is selected */
  onItemSelect?: (item: HotelMapItem) => void;
  
  /** Virtual viewport size */
  viewportSize?: { width: number; height: number };
  
  /** Maximum visible markers for performance */
  maxVisibleMarkers?: number;
}

export interface MapInteractionResult {
  /** Map state */
  zoom: number;
  center: HotelCoordinates;
  isDragging: boolean;
  
  /** Marker data */
  items: HotelMapItem[];
  visibleItems: HotelMapItem[] | any[];
  hoveredItem: HotelMapItem | null;
  selectedItem: HotelMapItem | null;
  isClustered: boolean;
  
  /** Map control methods */
  zoomIn: () => void;
  zoomOut: () => void;
  setZoom: (zoom: number) => void;
  setCenter: (center: HotelCoordinates) => void;
  resetView: () => void;
  
  /** Marker interaction methods */
  setHoveredItem: (item: HotelMapItem | null) => void;
  setSelectedItem: (item: HotelMapItem | null) => void;
  filterItems: (filterFn: (item: HotelMapItem) => boolean) => void;
  resetFilters: () => void;
  
  /** Advanced functionality */
  fitBounds: (padding?: number) => void;
  getBounds: () => { ne: HotelCoordinates; sw: HotelCoordinates };
  optimizeForView: () => void;
  
  /** Event handlers */
  handleMouseDown: (e: React.MouseEvent | TouchEvent) => void;
  handleMouseMove: (e: React.MouseEvent | TouchEvent) => void;
  handleMouseUp: () => void;
  handleWheel: (e: React.WheelEvent) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleMarkerClick: (item: HotelMapItem) => void;
  
  /** Utility functions */
  isMarkerVisible: (item: HotelMapItem) => boolean;
  getMarkerPosition: (item: HotelMapItem, mapWidth: number, mapHeight: number) => { x: number; y: number };
}

/**
 * An integrated hook for all map interaction functionality
 */
export function useMapInteractions({
  initialItems = [],
  initialCenter = { lat: 46.8182, lng: 8.2275 },
  initialZoom = 10,
  enableClustering = true,
  enableKeyboardControls = true,
  enableTouchControls = true,
  enableWheelZoom = true,
  onItemSelect,
  viewportSize = { width: 800, height: 600 },
  maxVisibleMarkers = 200
}: MapInteractionOptions = {}): MapInteractionResult {
  // Use the map controls hook
  const {
    zoom,
    center,
    isDragging,
    zoomIn,
    zoomOut,
    setZoom,
    setCenter,
    resetView,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    handleWheel,
    handleKeyDown,
    pan
  } = useMapControls({
    initialZoom,
    initialCenter,
    enableKeyboardControls,
    enableTouchControls,
    enableWheelZoom
  });
  
  // Use the map markers hook
  const {
    allMarkers,
    visibleMarkers,
    hoveredMarker,
    selectedMarker,
    isClustered,
    setHoveredMarker,
    setSelectedMarker,
    filterMarkers,
    resetFilters,
    optimizeMarkers,
    getMarkerPosition,
    isMarkerVisible,
    handleMarkerClick
  } = useMapMarkers({
    initialItems,
    enableClustering,
    maxVisibleMarkers,
    onSelectMarker: onItemSelect,
    currentZoom: zoom,
    currentCenter: center,
    viewSize: viewportSize
  });
  
  // Ref for tracking mouse/touch position
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  
  // Handle mouse/touch down for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent | TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    pointerRef.current = { x: clientX, y: clientY };
    handleDragStart(clientX, clientY);
  }, [handleDragStart]);
  
  // Handle mouse/touch move for dragging
  const handleMouseMove = useCallback((e: React.MouseEvent | TouchEvent) => {
    if (!isDragging || !pointerRef.current) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    handleDrag(clientX, clientY);
  }, [isDragging, handleDrag]);
  
  // Handle mouse/touch up for ending drag
  const handleMouseUp = useCallback(() => {
    pointerRef.current = null;
    handleDragEnd();
  }, [handleDragEnd]);
  
  // Handle wheel events for zooming
  const handleWheelEvent = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    handleWheel(e.deltaY);
  }, [handleWheel]);
  
  // Handle keyboard events for navigation
  const handleKeyDownEvent = useCallback((e: React.KeyboardEvent) => {
    handleKeyDown(e.key);
  }, [handleKeyDown]);
  
  // Calculate current view bounds
  const getBounds = useCallback(() => {
    // Calculate approximate view boundaries based on center and zoom
    const zoomFactor = 1 / Math.pow(2, zoom - 8);
    const halfWidthDeg = (180 * zoomFactor * viewportSize.width) / viewportSize.height;
    const halfHeightDeg = 180 * zoomFactor;
    
    return {
      ne: {
        lat: Math.min(90, center.lat + halfHeightDeg),
        lng: Math.min(180, center.lng + halfWidthDeg)
      },
      sw: {
        lat: Math.max(-90, center.lat - halfHeightDeg),
        lng: Math.max(-180, center.lng - halfWidthDeg)
      }
    };
  }, [center, zoom, viewportSize]);
  
  // Fit view to include all visible markers
  const fitBounds = useCallback((padding = 0.1) => {
    const markers = allMarkers.filter(marker => marker.coordinates);
    
    if (markers.length === 0) return;
    
    // Find min/max coordinates
    const bounds = markers.reduce(
      (acc, marker) => {
        if (marker.coordinates) {
          acc.north = Math.max(acc.north, marker.coordinates.lat);
          acc.south = Math.min(acc.south, marker.coordinates.lat);
          acc.east = Math.max(acc.east, marker.coordinates.lng);
          acc.west = Math.min(acc.west, marker.coordinates.lng);
        }
        return acc;
      },
      { north: -90, south: 90, east: -180, west: 180 }
    );
    
    // Add padding
    const latPadding = (bounds.north - bounds.south) * padding;
    const lngPadding = (bounds.east - bounds.west) * padding;
    
    bounds.north = Math.min(90, bounds.north + latPadding);
    bounds.south = Math.max(-90, bounds.south - latPadding);
    bounds.east = Math.min(180, bounds.east + lngPadding);
    bounds.west = Math.max(-180, bounds.west - lngPadding);
    
    // Set new center
    const newCenter = {
      lat: (bounds.north + bounds.south) / 2,
      lng: (bounds.east + bounds.west) / 2
    };
    
    setCenter(newCenter);
    
    // Calculate appropriate zoom level
    const latSpan = bounds.north - bounds.south;
    const lngSpan = bounds.east - bounds.west;
    const maxSpan = Math.max(latSpan, lngSpan);
    
    // Simple formula to estimate zoom level based on geographic spread
    if (maxSpan > 0) {
      const newZoom = Math.round(14 - Math.log2(maxSpan * 10));
      setZoom(Math.max(1, Math.min(20, newZoom)));
    }
  }, [allMarkers, setCenter, setZoom]);
  
  // Optimize markers for current view
  const optimizeForView = useCallback(() => {
    const bounds = getBounds();
    optimizeMarkers(bounds);
  }, [getBounds, optimizeMarkers]);
  
  // Reoptimize markers when zoom or center changes
  useEffect(() => {
    optimizeForView();
  }, [zoom, center, optimizeForView]);
  
  // Perform initial fit bounds when items change
  useEffect(() => {
    if (allMarkers.length > 0) {
      fitBounds();
    }
  }, [allMarkers, fitBounds]);
  
  return {
    // Map state
    zoom,
    center,
    isDragging,
    
    // Marker data
    items: allMarkers,
    visibleItems: visibleMarkers,
    hoveredItem: hoveredMarker,
    selectedItem: selectedMarker,
    isClustered,
    
    // Map control methods
    zoomIn,
    zoomOut,
    setZoom,
    setCenter,
    resetView,
    
    // Marker interaction methods
    setHoveredItem: setHoveredMarker,
    setSelectedItem: setSelectedMarker,
    filterItems: filterMarkers,
    resetFilters,
    
    // Advanced functionality
    fitBounds,
    getBounds,
    optimizeForView,
    
    // Event handlers
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel: handleWheelEvent,
    handleKeyDown: handleKeyDownEvent,
    handleMarkerClick,
    
    // Utility functions
    isMarkerVisible,
    getMarkerPosition
  };
}