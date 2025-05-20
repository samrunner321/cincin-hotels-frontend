/**
 * useFeatureInteraction Hook
 * 
 * A custom hook for managing interactive behaviors and user interactions
 * with feature components in the CinCin Hotels application.
 */

import { useState, useCallback, useRef, useEffect } from 'react';

export type InteractionType = 'hover' | 'click' | 'focus' | 'tour' | 'reveal';
export type FeaturePosition = 'top' | 'right' | 'bottom' | 'left' | 'center';
export type InteractionState = 'idle' | 'active' | 'highlighted' | 'disabled';

interface TooltipOptions {
  /** Enable tooltip */
  enabled?: boolean;
  /** Tooltip position */
  position?: FeaturePosition;
  /** Tooltip text */
  text?: string;
  /** Show tooltip arrow */
  showArrow?: boolean;
  /** Auto-hide delay (ms) */
  autoHideDelay?: number;
}

interface HighlightOptions {
  /** Enable highlight effect */
  enabled?: boolean;
  /** Highlight color */
  color?: string;
  /** Highlight opacity */
  opacity?: number;
  /** Highlight effect (e.g., 'pulse', 'glow', 'outline') */
  effect?: 'pulse' | 'glow' | 'outline' | 'none';
  /** Highlight duration in ms */
  duration?: number;
}

export interface FeatureInteractionOptions {
  /** Feature identifier */
  featureId: string;
  
  /** Enabled interaction types */
  interactionTypes?: InteractionType[];
  
  /** Initial interaction state */
  initialState?: InteractionState;
  
  /** Where the feature is positioned on the screen */
  position?: FeaturePosition;
  
  /** Tooltip configuration */
  tooltip?: TooltipOptions;
  
  /** Highlight effect configuration */
  highlight?: HighlightOptions;
  
  /** Whether feature interactions are enabled */
  enabled?: boolean;
  
  /** Automatically activate after delay (ms) */
  autoActivateDelay?: number;
  
  /** Callback when feature is interacted with */
  onInteraction?: (type: InteractionType, featureId: string) => void;
  
  /** Callback when feature state changes */
  onStateChange?: (state: InteractionState, featureId: string) => void;
}

export interface FeatureInteractionResult {
  /** Current interaction state */
  state: InteractionState;
  
  /** Is the feature currently active */
  isActive: boolean;
  
  /** Is the feature currently highlighted */
  isHighlighted: boolean;
  
  /** Is the feature currently being hovered */
  isHovered: boolean;
  
  /** Is the tooltip currently visible */
  isTooltipVisible: boolean;
  
  /** Element reference for binding interactions */
  featureRef: React.RefObject<HTMLElement>;
  
  /** Element reference for tooltip positioning */
  tooltipRef: React.RefObject<HTMLElement>;
  
  /** Activate the feature */
  activate: () => void;
  
  /** Deactivate the feature */
  deactivate: () => void;
  
  /** Toggle feature active state */
  toggle: () => void;
  
  /** Show highlight effect */
  highlight: (duration?: number) => void;
  
  /** Show tooltip */
  showTooltip: () => void;
  
  /** Hide tooltip */
  hideTooltip: () => void;
  
  /** Reset all interactions to initial state */
  reset: () => void;
  
  /** Props to pass to feature element */
  getFeatureProps: () => {
    ref: React.RefObject<HTMLElement>;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onClick: () => void;
    onFocus: () => void;
    onBlur: () => void;
    'aria-expanded': boolean;
    'data-feature-id': string;
    'data-state': InteractionState;
  };
  
  /** Props to pass to tooltip element */
  getTooltipProps: () => {
    ref: React.RefObject<HTMLElement>;
    'aria-hidden': boolean;
    'data-position': FeaturePosition;
    role: string;
  };
}

/**
 * A hook that provides feature interaction functionality
 */
export function useFeatureInteraction({
  featureId,
  interactionTypes = ['hover', 'click'],
  initialState = 'idle',
  position = 'bottom',
  tooltip = { enabled: false },
  highlight = { enabled: true, effect: 'pulse', duration: 1000 },
  enabled = true,
  autoActivateDelay,
  onInteraction,
  onStateChange,
}: FeatureInteractionOptions): FeatureInteractionResult {
  // Main state
  const [state, setState] = useState<InteractionState>(initialState);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);
  
  // Element refs
  const featureRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLElement>(null);
  
  // Timer refs
  const highlightTimerRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoActivateTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Derived state
  const isActive = state === 'active';
  const isHighlighted = state === 'highlighted';
  const isDisabled = state === 'disabled' || !enabled;
  
  // Handle state changes with callback
  const changeState = useCallback((newState: InteractionState) => {
    setState(newState);
    if (onStateChange) {
      onStateChange(newState, featureId);
    }
  }, [featureId, onStateChange]);
  
  // Handle interaction with callback
  const handleInteraction = useCallback((type: InteractionType) => {
    if (isDisabled) return;
    
    if (onInteraction) {
      onInteraction(type, featureId);
    }
  }, [featureId, isDisabled, onInteraction]);
  
  // Feature activation
  const activate = useCallback(() => {
    if (isDisabled) return;
    
    changeState('active');
    handleInteraction('click');
  }, [changeState, handleInteraction, isDisabled]);
  
  // Feature deactivation
  const deactivate = useCallback(() => {
    if (isDisabled) return;
    
    changeState('idle');
  }, [changeState, isDisabled]);
  
  // Toggle active state
  const toggle = useCallback(() => {
    if (isActive) {
      deactivate();
    } else {
      activate();
    }
  }, [activate, deactivate, isActive]);
  
  // Apply highlight effect
  const highlightFeature = useCallback((duration?: number) => {
    if (isDisabled) return;
    
    // Clear any existing highlight timer
    if (highlightTimerRef.current) {
      clearTimeout(highlightTimerRef.current);
      highlightTimerRef.current = null;
    }
    
    changeState('highlighted');
    
    // Set timer to return to previous state
    const highlightDuration = duration || highlight.duration || 1000;
    highlightTimerRef.current = setTimeout(() => {
      if (isActive) {
        changeState('active');
      } else {
        changeState('idle');
      }
      highlightTimerRef.current = null;
    }, highlightDuration);
  }, [changeState, highlight.duration, isActive, isDisabled]);
  
  // Show tooltip
  const showTooltip = useCallback(() => {
    if (isDisabled || !tooltip.enabled) return;
    
    // Clear any existing tooltip hide timer
    if (tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current);
      tooltipTimerRef.current = null;
    }
    
    setIsTooltipVisible(true);
    
    // Auto-hide tooltip if specified
    if (tooltip.autoHideDelay) {
      tooltipTimerRef.current = setTimeout(() => {
        setIsTooltipVisible(false);
        tooltipTimerRef.current = null;
      }, tooltip.autoHideDelay);
    }
  }, [isDisabled, tooltip.autoHideDelay, tooltip.enabled]);
  
  // Hide tooltip
  const hideTooltip = useCallback(() => {
    setIsTooltipVisible(false);
    
    // Clear any existing tooltip timer
    if (tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current);
      tooltipTimerRef.current = null;
    }
  }, []);
  
  // Reset to initial state
  const reset = useCallback(() => {
    changeState(initialState);
    setIsHovered(false);
    setIsTooltipVisible(false);
    
    // Clear all timers
    if (highlightTimerRef.current) {
      clearTimeout(highlightTimerRef.current);
      highlightTimerRef.current = null;
    }
    
    if (tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current);
      tooltipTimerRef.current = null;
    }
    
    if (autoActivateTimerRef.current) {
      clearTimeout(autoActivateTimerRef.current);
      autoActivateTimerRef.current = null;
    }
  }, [changeState, initialState]);
  
  // Event handlers for bound element
  const handleMouseEnter = useCallback(() => {
    if (isDisabled) return;
    
    setIsHovered(true);
    
    if (interactionTypes.includes('hover')) {
      handleInteraction('hover');
      
      // Show tooltip on hover if enabled
      if (tooltip.enabled) {
        showTooltip();
      }
    }
  }, [handleInteraction, interactionTypes, isDisabled, showTooltip, tooltip.enabled]);
  
  const handleMouseLeave = useCallback(() => {
    if (isDisabled) return;
    
    setIsHovered(false);
    
    // Hide tooltip on mouse leave
    if (tooltip.enabled) {
      hideTooltip();
    }
  }, [hideTooltip, isDisabled, tooltip.enabled]);
  
  const handleClick = useCallback(() => {
    if (isDisabled) return;
    
    if (interactionTypes.includes('click')) {
      handleInteraction('click');
      toggle();
    }
  }, [handleInteraction, interactionTypes, isDisabled, toggle]);
  
  const handleFocus = useCallback(() => {
    if (isDisabled) return;
    
    if (interactionTypes.includes('focus')) {
      handleInteraction('focus');
      // Show tooltip on focus if enabled
      if (tooltip.enabled) {
        showTooltip();
      }
    }
  }, [handleInteraction, interactionTypes, isDisabled, showTooltip, tooltip.enabled]);
  
  const handleBlur = useCallback(() => {
    if (isDisabled) return;
    
    // Hide tooltip on blur
    if (tooltip.enabled) {
      hideTooltip();
    }
  }, [hideTooltip, isDisabled, tooltip.enabled]);
  
  // Props for the feature element
  const getFeatureProps = useCallback(() => {
    return {
      ref: featureRef,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onClick: handleClick,
      onFocus: handleFocus,
      onBlur: handleBlur,
      'aria-expanded': isActive,
      'data-feature-id': featureId,
      'data-state': state,
    };
  }, [
    featureId,
    handleBlur,
    handleClick,
    handleFocus,
    handleMouseEnter,
    handleMouseLeave,
    isActive,
    state,
  ]);
  
  // Props for the tooltip element
  const getTooltipProps = useCallback(() => {
    return {
      ref: tooltipRef,
      'aria-hidden': !isTooltipVisible,
      'data-position': tooltip.position || position,
      role: 'tooltip',
    };
  }, [isTooltipVisible, position, tooltip.position]);
  
  // Auto-activate feature if delay is specified
  useEffect(() => {
    if (isDisabled || !autoActivateDelay) return;
    
    autoActivateTimerRef.current = setTimeout(() => {
      activate();
      autoActivateTimerRef.current = null;
    }, autoActivateDelay);
    
    return () => {
      if (autoActivateTimerRef.current) {
        clearTimeout(autoActivateTimerRef.current);
        autoActivateTimerRef.current = null;
      }
    };
  }, [activate, autoActivateDelay, isDisabled]);
  
  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) {
        clearTimeout(highlightTimerRef.current);
        highlightTimerRef.current = null;
      }
      
      if (tooltipTimerRef.current) {
        clearTimeout(tooltipTimerRef.current);
        tooltipTimerRef.current = null;
      }
      
      if (autoActivateTimerRef.current) {
        clearTimeout(autoActivateTimerRef.current);
        autoActivateTimerRef.current = null;
      }
    };
  }, []);
  
  return {
    state,
    isActive,
    isHighlighted,
    isHovered,
    isTooltipVisible,
    featureRef,
    tooltipRef,
    activate,
    deactivate,
    toggle,
    highlight: highlightFeature,
    showTooltip,
    hideTooltip,
    reset,
    getFeatureProps,
    getTooltipProps,
  };
}