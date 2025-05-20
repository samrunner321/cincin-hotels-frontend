/**
 * useAnimation Hook
 * 
 * A custom hook for managing animations in CinCin Hotels components
 * with built-in support for RTL, reduced motion preferences, and various animation patterns.
 */

import { useCallback } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useRtl } from '../hooks/useRtl';
import { 
  AnimationVariant, 
  FadeAnimationVariants,
  SlideAnimationVariants,
  ScaleAnimationVariants 
} from '../types/advanced-ui';

interface AnimationOptions {
  /** Type of animation */
  variant?: AnimationVariant;
  
  /** Whether animations are enabled globally */
  animationsEnabled?: boolean;
  
  /** Base animation duration in seconds */
  duration?: number;
  
  /** Animation delay in seconds */
  delay?: number;
  
  /** Override reduced motion preference */
  overrideReducedMotion?: boolean;
  
  /** RTL-aware animations */
  rtlAware?: boolean;
}

interface AnimationResult {
  /** Base animation variants */
  variants: {
    fade: FadeAnimationVariants;
    slide: SlideAnimationVariants;
    scale: ScaleAnimationVariants;
  };
  
  /** Whether animations should be active */
  shouldAnimate: boolean;
  
  /** Whether to use RTL-specific animations */
  useRtlAnimations: boolean;
  
  /** Current animation settings */
  settings: {
    duration: number;
    delay: number;
    reducedMotion: boolean;
  };
  
  /** Get final transition properties */
  getTransition: (customDuration?: number, customDelay?: number) => {
    duration: number;
    delay: number;
    ease: [number, number, number, number];
  };
  
  /** Get entrance animation properties */
  getEntranceProps: () => {
    initial: string | object | boolean;
    animate: string | object;
    variants: FadeAnimationVariants | SlideAnimationVariants | ScaleAnimationVariants;
    transition?: object;
  };
  
  /** Get exit animation properties */
  getExitProps: () => {
    exit: string | object;
    variants: FadeAnimationVariants | SlideAnimationVariants | ScaleAnimationVariants;
    transition?: object;
  };
  
  /** Get item stagger properties */
  getStaggerProps: (index: number, staggerDelay?: number) => {
    custom: number;
    variants: object;
  };
}

/**
 * A hook that provides animation configurations and utilities
 */
export function useAnimation({
  variant = 'fade',
  animationsEnabled = true,
  duration = 0.3,
  delay = 0,
  overrideReducedMotion = false,
  rtlAware = true,
}: AnimationOptions = {}): AnimationResult {
  // Get RTL context
  const { isRtl } = useRtl();
  
  // Get reduced motion preference
  const prefersReducedMotion = useReducedMotion();
  
  // Determine if we should reduce motion
  const shouldReduceMotion = !overrideReducedMotion && (prefersReducedMotion || false);
  
  // Determine if we should animate at all
  const shouldAnimate = animationsEnabled && !shouldReduceMotion;
  
  // Whether to use RTL-specific animations
  const useRtlAnimations = rtlAware && isRtl;
  
  // Base fade animation variants
  const fadeVariants: FadeAnimationVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  
  // Base slide animation variants with RTL support
  const slideVariants: SlideAnimationVariants = {
    hidden: { 
      x: useRtlAnimations ? 50 : -50, 
      opacity: 0 
    },
    visible: { 
      x: 0, 
      opacity: 1 
    },
  };
  
  // Base scale animation variants
  const scaleVariants: ScaleAnimationVariants = {
    hidden: { 
      scale: 0.95, 
      opacity: 0 
    },
    visible: { 
      scale: 1, 
      opacity: 1 
    },
  };
  
  // Generate transition properties
  const getTransition = useCallback((customDuration?: number, customDelay?: number) => {
    return {
      duration: shouldReduceMotion ? 0 : (customDuration ?? duration),
      delay: shouldReduceMotion ? 0 : (customDelay ?? delay),
      ease: [0.25, 0.1, 0.25, 1.0] as [number, number, number, number], // cubic-bezier easing
    };
  }, [duration, delay, shouldReduceMotion]);
  
  // Get entrance animation props
  const getEntranceProps = useCallback(() => {
    const baseProps = {
      initial: shouldAnimate ? "hidden" : false,
      animate: "visible",
      variants: variant === 'scale' 
        ? scaleVariants 
        : variant === 'slide' 
          ? slideVariants 
          : fadeVariants,
    };
    
    if (shouldAnimate) {
      return {
        ...baseProps,
        transition: getTransition(),
      };
    }
    
    return baseProps;
  }, [shouldAnimate, variant, fadeVariants, slideVariants, scaleVariants, getTransition]);
  
  // Get exit animation props
  const getExitProps = useCallback(() => {
    const baseProps = {
      exit: "hidden",
      variants: variant === 'scale' 
        ? scaleVariants 
        : variant === 'slide' 
          ? slideVariants 
          : fadeVariants,
    };
    
    if (shouldAnimate) {
      return {
        ...baseProps,
        transition: getTransition(duration * 0.75), // Exit slightly faster
      };
    }
    
    return baseProps;
  }, [shouldAnimate, variant, duration, fadeVariants, slideVariants, scaleVariants, getTransition]);
  
  // Get staggered animation props for lists
  const getStaggerProps = useCallback((index: number, staggerDelay = 0.05) => {
    return {
      custom: index,
      variants: {
        hidden: { opacity: 0, y: 20 },
        visible: (custom: number) => ({
          opacity: 1,
          y: 0,
          transition: {
            duration: shouldReduceMotion ? 0 : duration,
            delay: shouldReduceMotion ? 0 : delay + (custom * staggerDelay),
          }
        }),
      },
    };
  }, [shouldReduceMotion, duration, delay]);
  
  return {
    variants: {
      fade: fadeVariants,
      slide: slideVariants,
      scale: scaleVariants,
    },
    shouldAnimate,
    useRtlAnimations,
    settings: {
      duration,
      delay,
      reducedMotion: shouldReduceMotion,
    },
    getTransition,
    getEntranceProps,
    getExitProps,
    getStaggerProps,
  };
}