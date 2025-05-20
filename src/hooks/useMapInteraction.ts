/**
 * useMapInteraction Hook
 * 
 * A custom hook for handling interactive map functionality in CinCin Hotels application.
 * Provides state management for map markers, tooltips, zooming, and panning.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { HotelMapItem, HotelCoordinates } from '../types/advanced-ui';

interface MapInteractionOptions {
  /** Initial array of map items */
  initialItems?: HotelMapItem[];
  
  /** Initial center coordinates */
  initialCenter?: HotelCoordinates;
  
  /** Initial zoom level (1-20) */
  initialZoom?: number;
  
  /** Callback when an item is selected */
  onItemSelect?: (item: HotelMapItem) => void;
  
  /** Enable auto-centering on hover */
  enableAutoCentering?: boolean;
  
  /** Max items to show at once (for performance) */
  maxVisibleItems?: number;
}

interface MapInteractionResult {
  /** Current map items */
  items: HotelMapItem[];
  
  /** Currently hovered item */
  hoveredItem: HotelMapItem | null;
  
  /** Currently selected item */
  selectedItem: HotelMapItem | null;
  
  /** Current zoom level */
  zoom: number;
  
  /** Current center coordinates */
  center: HotelCoordinates;
  
  /** Whether the map is currently being panned */
  isPanning: boolean;
  
  /** Set the hovered item */
  setHoveredItem: (item: HotelMapItem | null) => void;
  
  /** Set the selected item */
  setSelectedItem: (item: HotelMapItem | null) => void;
  
  /** Zoom in by one level */
  zoomIn: () => void;
  
  /** Zoom out by one level */
  zoomOut: () => void;
  
  /** Set a specific zoom level */
  setZoom: (zoom: number) => void;
  
  /** Set the center coordinates */
  setCenter: (center: HotelCoordinates) => void;
  
  /** Filter items based on a filter function */
  filterItems: (filterFn: (item: HotelMapItem) => boolean) => void;
  
  /** Reset filters and show all items */
  resetFilters: () => void;
  
  /** Fit the map view to include all items */
  fitBounds: () => void;
  
  /** Start panning the map */
  startPanning: () => void;
  
  /** Stop panning the map */
  stopPanning: () => void;
}

/**
 * A hook that provides map interaction functionality
 */
export function useMapInteraction({
  initialItems = [],
  initialCenter = { lat: 46.8182, lng: 8.2275 }, // Default center (Switzerland)
  initialZoom = 8,
  onItemSelect,
  enableAutoCentering = false,
  maxVisibleItems = 500,
}: MapInteractionOptions = {}): MapInteractionResult {
  // Core state
  const [items, setItems] = useState<HotelMapItem[]>(initialItems);
  const [filteredItems, setFilteredItems] = useState<HotelMapItem[]>(initialItems);
  const [hoveredItem, setHoveredItem] = useState<HotelMapItem | null>(null);
  const [selectedItem, setSelectedItemState] = useState<HotelMapItem | null>(null);
  const [zoom, setZoomState] = useState<number>(initialZoom);
  const [center, setCenterState] = useState<HotelCoordinates>(initialCenter);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  
  // Refs for original data
  const originalItemsRef = useRef<HotelMapItem[]>(initialItems);
  
  // Update original items when initialItems change
  useEffect(() => {
    originalItemsRef.current = initialItems;
    setItems(initialItems);
    setFilteredItems(initialItems);
  }, [initialItems]);
  
  // Handle item selection with callback
  const setSelectedItem = useCallback((item: HotelMapItem | null) => {
    setSelectedItemState(item);
    if (item && onItemSelect) {
      onItemSelect(item);
    }
  }, [onItemSelect]);
  
  // Handle zoom levels within range
  const setZoom = useCallback((newZoom: number) => {
    setZoomState(Math.max(1, Math.min(20, newZoom)));
  }, []);
  
  const zoomIn = useCallback(() => {
    setZoomState(prev => Math.min(prev + 1, 20));
  }, []);
  
  const zoomOut = useCallback(() => {
    setZoomState(prev => Math.max(prev - 1, 1));
  }, []);
  
  // Set center with validation
  const setCenter = useCallback((newCenter: HotelCoordinates) => {
    // Validate coordinates
    const validLat = Math.max(-90, Math.min(90, newCenter.lat));
    const validLng = Math.max(-180, Math.min(180, newCenter.lng));
    
    setCenterState({ lat: validLat, lng: validLng });
  }, []);
  
  // Filtering functionality
  const filterItems = useCallback((filterFn: (item: HotelMapItem) => boolean) => {
    const filtered = originalItemsRef.current.filter(filterFn);
    
    // Limit number of items for performance
    const limitedItems = filtered.slice(0, maxVisibleItems);
    
    setFilteredItems(limitedItems);
    setItems(limitedItems);
  }, [maxVisibleItems]);
  
  // Reset filters
  const resetFilters = useCallback(() => {
    const limitedItems = originalItemsRef.current.slice(0, maxVisibleItems);
    setFilteredItems(limitedItems);
    setItems(limitedItems);
  }, [maxVisibleItems]);
  
  // Fit bounds to include all items
  const fitBounds = useCallback(() => {
    if (filteredItems.length === 0) return;
    
    // This is a simplified version - a real implementation would calculate 
    // actual bounds based on projected coordinates
    const latitudes = filteredItems
      .filter(item => item.coordinates?.lat !== undefined)
      .map(item => item.coordinates!.lat);
    
    const longitudes = filteredItems
      .filter(item => item.coordinates?.lng !== undefined)
      .map(item => item.coordinates!.lng);
    
    if (latitudes.length === 0 || longitudes.length === 0) return;
    
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);
    
    const newCenter = {
      lat: (minLat + maxLat) / 2,
      lng: (minLng + maxLng) / 2
    };
    
    setCenterState(newCenter);
    
    // Calculate appropriate zoom level (simplified)
    const latDiff = maxLat - minLat;
    const lngDiff = maxLng - minLng;
    const maxDiff = Math.max(latDiff, lngDiff);
    
    // Simple formula to estimate zoom level based on geographic spread
    if (maxDiff > 0) {
      const newZoom = Math.round(14 - Math.log2(maxDiff * 10));
      setZoom(Math.max(1, Math.min(20, newZoom)));
    }
  }, [filteredItems, setZoom]);
  
  // Auto-center when hoveredItem changes (if enabled)
  useEffect(() => {
    if (enableAutoCentering && hoveredItem?.coordinates) {
      setCenterState(hoveredItem.coordinates);
    }
  }, [hoveredItem, enableAutoCentering]);
  
  // Panning controls
  const startPanning = useCallback(() => {
    setIsPanning(true);
  }, []);
  
  const stopPanning = useCallback(() => {
    setIsPanning(false);
  }, []);
  
  return {
    items: filteredItems,
    hoveredItem,
    selectedItem,
    zoom,
    center,
    isPanning,
    setHoveredItem,
    setSelectedItem,
    zoomIn,
    zoomOut,
    setZoom,
    setCenter,
    filterItems,
    resetFilters,
    fitBounds,
    startPanning,
    stopPanning
  };
}