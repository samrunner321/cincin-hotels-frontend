/**
 * useMapControls Hook
 * 
 * A specialized hook for handling map control interactions in CinCin Hotels application.
 * Provides functionality for zooming, panning, and other map controls.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { HotelCoordinates } from '../types/advanced-ui';

interface MapControlOptions {
  /** Initial zoom level (1-20) */
  initialZoom?: number;
  
  /** Initial center coordinates */
  initialCenter?: HotelCoordinates;
  
  /** Minimum allowed zoom level */
  minZoom?: number;
  
  /** Maximum allowed zoom level */
  maxZoom?: number;
  
  /** Enable keyboard controls */
  enableKeyboardControls?: boolean;
  
  /** Enable touch controls */
  enableTouchControls?: boolean;
  
  /** Enable mouse wheel zoom */
  enableWheelZoom?: boolean;
  
  /** Callback on zoom change */
  onZoomChange?: (zoom: number) => void;
  
  /** Callback on center change */
  onCenterChange?: (center: HotelCoordinates) => void;
}

interface MapControlResult {
  /** Current zoom level */
  zoom: number;
  
  /** Current center coordinates */
  center: HotelCoordinates;
  
  /** Whether user is currently dragging the map */
  isDragging: boolean;
  
  /** Increase zoom level */
  zoomIn: () => void;
  
  /** Decrease zoom level */
  zoomOut: () => void;
  
  /** Set specific zoom level */
  setZoom: (newZoom: number) => void;
  
  /** Set center coordinates */
  setCenter: (newCenter: HotelCoordinates) => void;
  
  /** Move the map by a delta */
  pan: (deltaX: number, deltaY: number) => void;
  
  /** Reset to initial values */
  resetView: () => void;
  
  /** Handle mouse/touch down for drag start */
  handleDragStart: (clientX: number, clientY: number) => void;
  
  /** Handle mouse/touch move for dragging */
  handleDrag: (clientX: number, clientY: number) => void;
  
  /** Handle mouse/touch up for drag end */
  handleDragEnd: () => void;
  
  /** Handle mouse wheel event */
  handleWheel: (deltaY: number) => void;
  
  /** Handle keyboard event */
  handleKeyDown: (key: string) => void;
}

/**
 * Hook for managing map view controls like zoom, pan, and interactions
 */
export function useMapControls({
  initialZoom = 10,
  initialCenter = { lat: 46.8182, lng: 8.2275 }, // Default center (Switzerland)
  minZoom = 1,
  maxZoom = 20,
  enableKeyboardControls = true,
  enableTouchControls = true,
  enableWheelZoom = true,
  onZoomChange,
  onCenterChange,
}: MapControlOptions = {}): MapControlResult {
  // Core state
  const [zoom, setZoomState] = useState<number>(initialZoom);
  const [center, setCenterState] = useState<HotelCoordinates>(initialCenter);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  // Refs for drag handling
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastCenterRef = useRef<HotelCoordinates>(initialCenter);
  
  // Update refs when center changes
  useEffect(() => {
    lastCenterRef.current = center;
  }, [center]);
  
  // Zoom functions with constraints
  const setZoom = useCallback((newZoom: number) => {
    const constrainedZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
    setZoomState(constrainedZoom);
    
    if (onZoomChange) {
      onZoomChange(constrainedZoom);
    }
  }, [minZoom, maxZoom, onZoomChange]);
  
  const zoomIn = useCallback(() => {
    setZoomState(prev => {
      const newZoom = Math.min(maxZoom, prev + 1);
      if (onZoomChange) {
        onZoomChange(newZoom);
      }
      return newZoom;
    });
  }, [maxZoom, onZoomChange]);
  
  const zoomOut = useCallback(() => {
    setZoomState(prev => {
      const newZoom = Math.max(minZoom, prev - 1);
      if (onZoomChange) {
        onZoomChange(newZoom);
      }
      return newZoom;
    });
  }, [minZoom, onZoomChange]);
  
  // Center functions with validation
  const setCenter = useCallback((newCenter: HotelCoordinates) => {
    // Validate coordinates
    const validLat = Math.max(-90, Math.min(90, newCenter.lat));
    const validLng = Math.max(-180, Math.min(180, newCenter.lng));
    
    const validCenter = { lat: validLat, lng: validLng };
    setCenterState(validCenter);
    
    if (onCenterChange) {
      onCenterChange(validCenter);
    }
  }, [onCenterChange]);
  
  // Reset to initial values
  const resetView = useCallback(() => {
    setZoomState(initialZoom);
    setCenterState(initialCenter);
    
    if (onZoomChange) {
      onZoomChange(initialZoom);
    }
    
    if (onCenterChange) {
      onCenterChange(initialCenter);
    }
  }, [initialZoom, initialCenter, onZoomChange, onCenterChange]);
  
  // Pan the map by delta
  const pan = useCallback((deltaX: number, deltaY: number) => {
    // Convert pixel delta to coordinate delta based on zoom level
    // This is a simplified version - real maps would use mercator projection
    const factor = 1 / Math.pow(2, zoom - 1);
    const dLng = deltaX * factor;
    const dLat = -deltaY * factor;
    
    setCenterState(prev => {
      const newCenter = {
        lat: Math.max(-90, Math.min(90, prev.lat + dLat)),
        lng: Math.max(-180, Math.min(180, prev.lng + dLng)),
      };
      
      if (onCenterChange) {
        onCenterChange(newCenter);
      }
      
      return newCenter;
    });
  }, [zoom, onCenterChange]);
  
  // Handle drag start (mouse down or touch start)
  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    dragStartRef.current = { x: clientX, y: clientY };
    setIsDragging(true);
  }, []);
  
  // Handle dragging (mouse move or touch move)
  const handleDrag = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || !dragStartRef.current) return;
    
    const deltaX = dragStartRef.current.x - clientX;
    const deltaY = dragStartRef.current.y - clientY;
    
    // Update drag start position
    dragStartRef.current = { x: clientX, y: clientY };
    
    // Pan the map
    pan(deltaX, deltaY);
  }, [isDragging, pan]);
  
  // Handle drag end (mouse up or touch end)
  const handleDragEnd = useCallback(() => {
    dragStartRef.current = null;
    setIsDragging(false);
  }, []);
  
  // Handle mouse wheel for zooming
  const handleWheel = useCallback((deltaY: number) => {
    if (!enableWheelZoom) return;
    
    if (deltaY > 0) {
      zoomOut();
    } else {
      zoomIn();
    }
  }, [enableWheelZoom, zoomIn, zoomOut]);
  
  // Handle keyboard navigation
  const handleKeyDown = useCallback((key: string) => {
    if (!enableKeyboardControls) return;
    
    switch (key) {
      case 'ArrowUp':
        pan(0, -20);
        break;
      case 'ArrowDown':
        pan(0, 20);
        break;
      case 'ArrowLeft':
        pan(-20, 0);
        break;
      case 'ArrowRight':
        pan(20, 0);
        break;
      case '+':
      case '=':
        zoomIn();
        break;
      case '-':
      case '_':
        zoomOut();
        break;
      case '0':
        resetView();
        break;
      default:
        break;
    }
  }, [enableKeyboardControls, pan, zoomIn, zoomOut, resetView]);
  
  return {
    zoom,
    center,
    isDragging,
    zoomIn,
    zoomOut,
    setZoom,
    setCenter,
    pan,
    resetView,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    handleWheel,
    handleKeyDown
  };
}