/**
 * useMapMarkers Hook
 * 
 * A specialized hook for handling map markers in CinCin Hotels application.
 * Provides efficient marker rendering, clustering, and interaction.
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { HotelMapItem, HotelCoordinates } from '../types/advanced-ui';

export interface MapMarkerOptions {
  /** Initial array of map items */
  initialItems?: HotelMapItem[];
  
  /** Enable marker clustering */
  enableClustering?: boolean;
  
  /** Clustering distance in pixels */
  clusterDistance?: number;
  
  /** Maximum markers to render for performance */
  maxVisibleMarkers?: number;
  
  /** Callback when a marker is selected */
  onSelectMarker?: (item: HotelMapItem) => void;
  
  /** Callback when a marker is hovered */
  onHoverMarker?: (item: HotelMapItem | null) => void;
  
  /** Current map zoom level from useMapControls */
  currentZoom?: number;
  
  /** Current map center from useMapControls */
  currentCenter?: HotelCoordinates;
  
  /** Virtual rendering view size (width, height) */
  viewSize?: { width: number; height: number };
}

interface Cluster {
  id: string;
  center: HotelCoordinates;
  items: HotelMapItem[];
  count: number;
}

export interface MapMarkerResult {
  /** All available markers */
  allMarkers: HotelMapItem[];
  
  /** Currently visible markers (after filtering and clustering) */
  visibleMarkers: HotelMapItem[] | Cluster[];
  
  /** Currently hovered marker */
  hoveredMarker: HotelMapItem | null;
  
  /** Currently selected marker */
  selectedMarker: HotelMapItem | null;
  
  /** Whether markers are clustered */
  isClustered: boolean;
  
  /** Set the hovered marker */
  setHoveredMarker: (marker: HotelMapItem | null) => void;
  
  /** Set the selected marker */
  setSelectedMarker: (marker: HotelMapItem | null) => void;
  
  /** Filter markers using a filter function */
  filterMarkers: (filterFn: (marker: HotelMapItem) => boolean) => void;
  
  /** Reset filters and show all markers */
  resetFilters: () => void;
  
  /** Optimize markers for current view */
  optimizeMarkers: (viewportBounds?: { ne: HotelCoordinates; sw: HotelCoordinates }) => void;
  
  /** Calculate screen position for a marker */
  getMarkerPosition: (item: HotelMapItem, mapWidth: number, mapHeight: number) => { x: number; y: number };
  
  /** Check if a marker should be visible */
  isMarkerVisible: (item: HotelMapItem) => boolean;
  
  /** Handle marker click */
  handleMarkerClick: (item: HotelMapItem) => void;
}

/**
 * Hook for managing map markers with optimizations
 */
export function useMapMarkers({
  initialItems = [],
  enableClustering = true,
  clusterDistance = 40,
  maxVisibleMarkers = 200,
  onSelectMarker,
  onHoverMarker,
  currentZoom = 10,
  currentCenter = { lat: 46.8182, lng: 8.2275 },
  viewSize = { width: 800, height: 600 }
}: MapMarkerOptions = {}): MapMarkerResult {
  // Core state
  const [allMarkers, setAllMarkers] = useState<HotelMapItem[]>(initialItems);
  const [filteredMarkers, setFilteredMarkers] = useState<HotelMapItem[]>(initialItems);
  const [visibleMarkers, setVisibleMarkers] = useState<HotelMapItem[] | Cluster[]>(initialItems);
  const [hoveredMarker, setHoveredMarkerState] = useState<HotelMapItem | null>(null);
  const [selectedMarker, setSelectedMarkerState] = useState<HotelMapItem | null>(null);
  const [isClustered, setIsClustered] = useState<boolean>(false);
  
  // Refs for optimization
  const originalMarkersRef = useRef<HotelMapItem[]>(initialItems);
  const lastOptimizationRef = useRef<number>(0);
  
  // Update original markers when initialItems change
  useEffect(() => {
    originalMarkersRef.current = initialItems;
    setAllMarkers(initialItems);
    setFilteredMarkers(initialItems);
    optimizeMarkers();
  }, [initialItems]);
  
  // Handle marker hover with callback
  const setHoveredMarker = useCallback((marker: HotelMapItem | null) => {
    setHoveredMarkerState(marker);
    if (onHoverMarker) {
      onHoverMarker(marker);
    }
  }, [onHoverMarker]);
  
  // Handle marker selection with callback
  const setSelectedMarker = useCallback((marker: HotelMapItem | null) => {
    setSelectedMarkerState(marker);
    if (marker && onSelectMarker) {
      onSelectMarker(marker);
    }
  }, [onSelectMarker]);
  
  // Calculate screen position for a marker
  const getMarkerPosition = useCallback((item: HotelMapItem, mapWidth: number, mapHeight: number) => {
    // If item has no coordinates, use pseudo-random position
    if (!item.coordinates) {
      const id = typeof item.id === 'string' ? parseInt(item.id, 10) || 0 : item.id || 0;
      const randomX = ((id * 17) % 80) + 10; // 10-90% of width
      const randomY = ((id * 23) % 80) + 10; // 10-90% of height
      
      return {
        x: (randomX / 100) * mapWidth,
        y: (randomY / 100) * mapHeight
      };
    }
    
    // Use mercator projection (simplified)
    const x = ((item.coordinates.lng + 180) / 360) * mapWidth;
    const latRad = (item.coordinates.lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
    const y = (mapHeight / 2) - ((mapHeight * mercN) / (2 * Math.PI));
    
    return { x, y };
  }, []);
  
  // Check if a marker should be visible in the current view
  const isMarkerVisible = useCallback((item: HotelMapItem) => {
    if (!item.coordinates) return true; // Always show items without coordinates
    
    // Calculate approximate view boundaries based on center and zoom
    const zoomFactor = 1 / Math.pow(2, currentZoom - 8);
    const halfWidthDeg = (180 * zoomFactor * viewSize.width) / viewSize.height;
    const halfHeightDeg = 180 * zoomFactor;
    
    const bounds = {
      north: Math.min(90, currentCenter.lat + halfHeightDeg),
      south: Math.max(-90, currentCenter.lat - halfHeightDeg),
      east: Math.min(180, currentCenter.lng + halfWidthDeg),
      west: Math.max(-180, currentCenter.lng - halfWidthDeg)
    };
    
    // Check if marker is within bounds
    return (
      item.coordinates.lat <= bounds.north &&
      item.coordinates.lat >= bounds.south &&
      item.coordinates.lng <= bounds.east &&
      item.coordinates.lng >= bounds.west
    );
  }, [currentCenter, currentZoom, viewSize]);
  
  // Filter markers using a filter function
  const filterMarkers = useCallback((filterFn: (marker: HotelMapItem) => boolean) => {
    const filtered = originalMarkersRef.current.filter(filterFn);
    setFilteredMarkers(filtered);
    
    // Trigger optimization after filtering
    optimizeMarkers();
  }, []);
  
  // Reset filters
  const resetFilters = useCallback(() => {
    setFilteredMarkers(originalMarkersRef.current);
    
    // Trigger optimization after resetting filters
    optimizeMarkers();
  }, []);
  
  // Cluster markers that are close to each other
  const clusterMarkers = useCallback((markers: HotelMapItem[]): Cluster[] => {
    if (!enableClustering || markers.length <= 1) {
      return markers.map(marker => ({
        id: `cluster-${marker.id}`,
        center: marker.coordinates || { lat: 0, lng: 0 },
        items: [marker],
        count: 1
      }));
    }
    
    const clusters: Cluster[] = [];
    const processed = new Set<string | number>();
    
    markers.forEach(marker => {
      // Skip already processed markers
      if (processed.has(marker.id)) return;
      
      // If marker has no coordinates, create singleton cluster
      if (!marker.coordinates) {
        clusters.push({
          id: `cluster-${marker.id}`,
          center: { lat: 0, lng: 0 },
          items: [marker],
          count: 1
        });
        processed.add(marker.id);
        return;
      }
      
      // Cluster with nearby markers
      const clusterItems: HotelMapItem[] = [marker];
      processed.add(marker.id);
      
      // Find nearby markers for clustering
      markers.forEach(other => {
        if (processed.has(other.id) || !other.coordinates) return;
        
        // Calculate distance (simplified for performance)
        const latDiff = marker.coordinates!.lat - other.coordinates.lat;
        const lngDiff = marker.coordinates!.lng - other.coordinates.lng;
        const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
        
        // Adjust distance threshold based on zoom level
        const zoomAdjustedDistance = clusterDistance / Math.pow(2, currentZoom - 5);
        
        if (distance <= zoomAdjustedDistance) {
          clusterItems.push(other);
          processed.add(other.id);
        }
      });
      
      // Calculate cluster center (average coordinates)
      const center = clusterItems.reduce(
        (acc, item) => {
          if (item.coordinates) {
            acc.lat += item.coordinates.lat;
            acc.lng += item.coordinates.lng;
          }
          return acc;
        },
        { lat: 0, lng: 0 }
      );
      
      center.lat /= clusterItems.length;
      center.lng /= clusterItems.length;
      
      // Create cluster
      clusters.push({
        id: `cluster-${marker.id}-group`,
        center,
        items: clusterItems,
        count: clusterItems.length
      });
    });
    
    return clusters;
  }, [enableClustering, clusterDistance, currentZoom]);
  
  // Optimize markers for the current view
  const optimizeMarkers = useCallback((viewportBounds?: { ne: HotelCoordinates; sw: HotelCoordinates }) => {
    // Throttle optimization to avoid excessive processing
    const now = Date.now();
    if (now - lastOptimizationRef.current < 100) return;
    lastOptimizationRef.current = now;
    
    // Filter for viewport if bounds provided
    let markersInView = viewportBounds
      ? filteredMarkers.filter(marker => {
          if (!marker.coordinates) return true;
          return (
            marker.coordinates.lat <= viewportBounds.ne.lat &&
            marker.coordinates.lat >= viewportBounds.sw.lat &&
            marker.coordinates.lng <= viewportBounds.ne.lng &&
            marker.coordinates.lng >= viewportBounds.sw.lng
          );
        })
      : filteredMarkers.filter(isMarkerVisible);
    
    // Limit number of markers for performance
    if (markersInView.length > maxVisibleMarkers) {
      markersInView = markersInView.slice(0, maxVisibleMarkers);
    }
    
    // Apply clustering if enabled and needed
    if (enableClustering && markersInView.length > 30) {
      const clusters = clusterMarkers(markersInView);
      setVisibleMarkers(clusters);
      setIsClustered(clusters.some(cluster => cluster.count > 1));
    } else {
      setVisibleMarkers(markersInView);
      setIsClustered(false);
    }
  }, [filteredMarkers, isMarkerVisible, enableClustering, maxVisibleMarkers, clusterMarkers]);
  
  // Handle marker click
  const handleMarkerClick = useCallback((item: HotelMapItem) => {
    setSelectedMarker(item);
  }, [setSelectedMarker]);
  
  // Optimize markers when zoom or center changes
  useEffect(() => {
    optimizeMarkers();
  }, [currentZoom, currentCenter, optimizeMarkers]);
  
  // The complete marker management API
  return {
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
  };
}