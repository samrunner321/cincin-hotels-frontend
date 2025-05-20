'use client';

import React from 'react';
import { useFeatureInteraction } from '../../hooks/useFeatureInteraction';
import { FeatureInteractionProps } from '../../types/advanced-ui';

/**
 * InteractiveFeature component
 * 
 * A wrapper component that adds interaction features to its children,
 * such as tooltips, highlights, and interaction states.
 */
export default function InteractiveFeature({
  featureId,
  tooltipText,
  tooltipPosition = 'bottom',
  tooltipEnabled = false,
  highlightEnabled = true,
  highlightEffect = 'pulse',
  onInteraction,
  className = '',
  style,
  visible = true,
  children,
}: FeatureInteractionProps) {
  const {
    isActive,
    isHighlighted,
    isHovered,
    isTooltipVisible,
    getFeatureProps,
    getTooltipProps,
  } = useFeatureInteraction({
    featureId,
    interactionTypes: ['hover', 'click'],
    position: tooltipPosition,
    tooltip: {
      enabled: tooltipEnabled,
      position: tooltipPosition,
      text: tooltipText,
      showArrow: true,
    },
    highlight: {
      enabled: highlightEnabled,
      effect: highlightEffect,
    },
    onInteraction: onInteraction ? (type) => onInteraction(type) : undefined,
  });

  if (!visible) return null;

  // Extract the ref from props and apply the rest
  const featureProps = getFeatureProps();
  const { ref, ...otherProps } = featureProps;

  return (
    <div className="relative">
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        {...otherProps}
        className={`transition-all ${className} ${
          isActive ? 'ring-2 ring-brand-olive-500 ring-offset-2' : ''
        } ${
          isHighlighted 
            ? highlightEffect === 'pulse' 
              ? 'animate-pulse' 
              : highlightEffect === 'glow' 
                ? 'shadow-lg shadow-brand-olive-100' 
                : highlightEffect === 'outline' 
                  ? 'outline outline-offset-2 outline-2 outline-brand-olive-300' 
                  : ''
            : ''
        } ${
          isHovered && !isActive ? 'shadow-md' : ''
        }`}
        style={style}
      >
        {children}
      </div>

      {isTooltipVisible && tooltipEnabled && tooltipText && (
        <div
          ref={(getTooltipProps().ref as React.RefObject<HTMLDivElement>)}
          aria-hidden={getTooltipProps()['aria-hidden']}
          data-position={getTooltipProps()['data-position']}
          role={getTooltipProps().role}
          className={`absolute z-50 px-3 py-2 text-sm font-brooklyn
            bg-gray-800 text-white rounded shadow-lg max-w-xs
            ${tooltipPosition === 'top' ? 'bottom-full mb-2' :
              tooltipPosition === 'bottom' ? 'top-full mt-2' :
              tooltipPosition === 'left' ? 'right-full mr-2' :
              tooltipPosition === 'right' ? 'left-full ml-2' : ''}
            ${tooltipPosition === 'top' || tooltipPosition === 'bottom' ? 'left-1/2 transform -translate-x-1/2' : ''}
            ${tooltipPosition === 'left' || tooltipPosition === 'right' ? 'top-1/2 transform -translate-y-1/2' : ''}
          `}
        >
          {tooltipText}
          
          {/* Tooltip Arrow */}
          <div
            className={`absolute w-0 h-0 border-solid
              ${tooltipPosition === 'top' ? 
                'border-l-8 border-r-8 border-t-8 border-b-0 border-transparent border-t-gray-800 bottom-0 left-1/2 transform translate-y-full -translate-x-1/2' :
              tooltipPosition === 'bottom' ? 
                'border-l-8 border-r-8 border-b-8 border-t-0 border-transparent border-b-gray-800 top-0 left-1/2 transform -translate-y-full -translate-x-1/2' :
              tooltipPosition === 'left' ? 
                'border-t-8 border-b-8 border-l-8 border-r-0 border-transparent border-l-gray-800 right-0 top-1/2 transform translate-x-full -translate-y-1/2' :
              tooltipPosition === 'right' ? 
                'border-t-8 border-b-8 border-r-8 border-l-0 border-transparent border-r-gray-800 left-0 top-1/2 transform -translate-x-full -translate-y-1/2' :
                ''
              }`}
          />
        </div>
      )}
    </div>
  );
}