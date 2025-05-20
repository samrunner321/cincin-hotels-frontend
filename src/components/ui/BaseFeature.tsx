'use client';

import React, { ReactNode } from 'react';
import { useFeatureInteraction } from '../../hooks/useFeatureInteraction';
import { motion } from 'framer-motion';
import { BaseLayoutProps } from '../../types/advanced-ui';

export interface BaseFeatureProps extends BaseLayoutProps {
  /** Unique identifier for feature */
  featureId: string;
  
  /** Feature title */
  title?: string;
  
  /** Description text */
  description?: string;
  
  /** Layout orientation: 'content-left' puts content on the left, 'content-right' puts content on the right */
  layout?: 'content-left' | 'content-right';
  
  /** Additional styles for the container */
  containerClassName?: string;
  
  /** Visual content (typically image or gallery) */
  visualContent?: ReactNode;
  
  /** Feature content (text, buttons, etc.) */
  featureContent?: ReactNode;
  
  /** Background color */
  backgroundColor?: string;
  
  /** Whether animations are enabled */
  animationsEnabled?: boolean;
  
  /** Callback when interaction occurs */
  onInteraction?: (type: string, featureId: string) => void;
}

/**
 * Base component for feature sections with standardized layout and interactions
 */
export default function BaseFeature({
  featureId,
  title,
  description,
  layout = 'content-left',
  containerClassName = '',
  visualContent,
  featureContent,
  backgroundColor = '',
  className = '',
  style = {},
  visible = true,
  animationsEnabled = true,
  onInteraction,
}: BaseFeatureProps) {
  // Use the feature interaction hook
  const featureInteraction = useFeatureInteraction({
    featureId,
    interactionTypes: ['hover', 'click'],
    highlight: { 
      enabled: true,
      effect: 'glow',
      duration: 1000
    },
    onInteraction,
  });
  
  if (!visible) return null;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  // Determine layout order based on layout prop
  const contentOrder = layout === 'content-left' 
    ? 'order-1 lg:order-1' 
    : 'order-2 lg:order-2';
    
  const visualOrder = layout === 'content-left' 
    ? 'order-2 lg:order-2' 
    : 'order-1 lg:order-1';
  
  return (
    <section 
      className={`py-12 md:py-16 lg:py-20 ${backgroundColor} ${className}`}
      style={style}
    >
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 max-w-[1536px] ${containerClassName}`}>
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center"
          variants={containerVariants}
          initial={animationsEnabled ? "hidden" : false}
          whileInView={animationsEnabled ? "visible" : undefined}
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Content Column */}
          <motion.div 
            className={`lg:w-full ${contentOrder}`}
            variants={itemVariants}
          >
            {title && (
              <h2 className="text-3xl md:text-4xl font-normal text-gray-900 mb-4 font-brooklyn">
                {title}
              </h2>
            )}
            
            {description && (
              <p className="text-gray-700 mb-8 leading-relaxed font-light font-brooklyn">
                {description}
              </p>
            )}
            
            {featureContent}
          </motion.div>
          
          {/* Visual Column */}
          <motion.div 
            className={`lg:w-full ${visualOrder}`}
            variants={itemVariants}
            ref={featureInteraction.featureRef as React.Ref<HTMLDivElement>}
            onMouseEnter={featureInteraction.getFeatureProps().onMouseEnter}
            onMouseLeave={featureInteraction.getFeatureProps().onMouseLeave}
            onClick={featureInteraction.getFeatureProps().onClick}
            onFocus={featureInteraction.getFeatureProps().onFocus}
            onBlur={featureInteraction.getFeatureProps().onBlur}
            aria-expanded={featureInteraction.getFeatureProps()['aria-expanded']}
            data-feature-id={featureInteraction.getFeatureProps()['data-feature-id']}
            data-state={featureInteraction.getFeatureProps()['data-state']}
          >
            {visualContent}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}