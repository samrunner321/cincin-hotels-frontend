// @ts-nocheck
'use client';

/**
 * AnimatedHotelEntry Komponente
 * 
 * Eine Komponente, die Hotels mit eleganten, viewport-basierten
 * Eingangsanimationen anzeigt.
 */

import { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { useUIState } from '../../../components/UIStateContext';
import { useFeatureInteraction } from '../../hooks/useFeatureInteraction';
import { cn } from '../../../lib/utils';
import type { AnimatedHotelEntryProps } from '../../types/advanced-ui';

/**
 * AnimatedHotelEntry Komponente
 * 
 * @param props Komponenten-Props
 * @returns JSX Element mit Animation
 */
export const AnimatedHotelEntry: React.FC<AnimatedHotelEntryProps> = ({
  hotel,
  delay = 0,
  staggerChildren = 0.1,
  animateOnScroll = true,
  animateOnce = true,
  scrollMargin = '-100px',
  children,
  className = '',
  style,
  id,
  animationVariant = 'fade',
  animationDelay = 0,
  animationDuration = 600,
  animationsEnabled,
  reducedMotion
}) => {
  // UI-State für Animationspräferenzen
  const { state: uiState } = useUIState();
  const shouldAnimate = 
    (animationsEnabled ?? !uiState.theme.reducedMotion) && 
    (reducedMotion ?? uiState.theme.animationsEnabled);

  // Refs und Scroll-Detection
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    once: animateOnce, 
    amount: 0.2, 
    margin: scrollMargin
  });

  // Feature-Interaktion für Hover-Effekte, falls ein Hotel übergeben wurde
  const { getFeatureProps, isHovered } = useFeatureInteraction({
    featureId: `hotel-entry-${hotel?.id || 'generic'}`,
    tooltip: {
      enabled: Boolean(hotel),
      text: hotel ? `${hotel.name} in ${hotel.location}` : '',
      position: 'top'
    },
    highlight: {
      enabled: Boolean(hotel),
      effect: 'subtle',
      duration: 500
    },
    enabled: Boolean(hotel)
  });

  // Animationsvarianten basierend auf dem gewählten Typ
  const getVariants = (): Variants => {
    switch (animationVariant) {
      case 'slide':
        return {
          hidden: { 
            opacity: 0, 
            y: 50 
          },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: {
              duration: animationDuration / 1000,
              delay: (delay + animationDelay) / 1000,
              ease: [0.22, 1, 0.36, 1],
              staggerChildren: staggerChildren,
              delayChildren: staggerChildren
            }
          }
        };
      case 'scale':
        return {
          hidden: { 
            opacity: 0, 
            scale: 0.9
          },
          visible: { 
            opacity: 1, 
            scale: 1,
            transition: {
              duration: animationDuration / 1000,
              delay: (delay + animationDelay) / 1000,
              ease: [0.22, 1, 0.36, 1],
              staggerChildren: staggerChildren,
              delayChildren: staggerChildren
            }
          }
        };
      default: // fade
        return {
          hidden: { 
            opacity: 0,
            y: 20
          },
          visible: { 
            opacity: 1,
            y: 0,
            transition: {
              duration: animationDuration / 1000,
              delay: (delay + animationDelay) / 1000,
              ease: [0.22, 1, 0.36, 1],
              staggerChildren: staggerChildren,
              delayChildren: staggerChildren
            }
          }
        };
    }
  };

  // Varianten für Kinder-Elemente
  const childVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: (animationDuration / 2) / 1000,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      {...(hotel ? getFeatureProps() : {})}
      initial={shouldAnimate && animateOnScroll ? "hidden" : "visible"}
      animate={shouldAnimate && animateOnScroll ? (isInView ? "visible" : "hidden") : "visible"}
      variants={getVariants()}
      className={cn("h-full", className, isHovered && "z-10 relative")}
      style={{
        ...style,
        transition: 'z-index 0s'
      }}
      id={id}
    >
      {/* Kann Kinder direkt einbinden oder als staggered items */}
      {shouldAnimate && staggerChildren > 0 ? (
        <motion.div variants={childVariants}>
          {children}
        </motion.div>
      ) : (
        children
      )}
    </motion.div>
  );
};

export default AnimatedHotelEntry;