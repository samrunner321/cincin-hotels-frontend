// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { useFeatureInteraction } from '../../hooks/useFeatureInteraction';

/**
 * Example component showing how to use the useFeatureInteraction hook
 */
export default function FeatureInteractionExample() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  
  // Using the hook for a button feature
  const button = useFeatureInteraction({
    featureId: 'demo-button',
    interactionTypes: ['hover', 'click'],
    tooltip: {
      enabled: true,
      position: 'top',
      text: 'Click me to activate',
      showArrow: true,
      autoHideDelay: 3000,
    },
    highlight: {
      enabled: true,
      effect: 'pulse',
      duration: 1000,
    },
    onInteraction: (type, id) => {
      console.log(`Interaction: ${type} on ${id}`);
    },
    onStateChange: (state, id) => {
      console.log(`State changed to: ${state} for ${id}`);
      if (state === 'active') {
        setActiveFeature(id);
      } else if (activeFeature === id) {
        setActiveFeature(null);
      }
    },
  });

  // Using the hook for a card feature
  const card = useFeatureInteraction({
    featureId: 'demo-card',
    interactionTypes: ['hover', 'click'],
    tooltip: {
      enabled: true,
      position: 'right',
      text: 'This card highlights on hover',
      showArrow: true,
    },
    highlight: {
      enabled: true,
      effect: 'glow',
      duration: 1500,
    },
  });

  // Using the hook for an info icon
  const infoIcon = useFeatureInteraction({
    featureId: 'info-icon',
    interactionTypes: ['hover', 'focus'],
    tooltip: {
      enabled: true,
      position: 'bottom',
      text: 'This shows additional information',
      showArrow: true,
    },
  });

  // Handler for tour button
  const startTour = () => {
    // Sequence of highlights
    setTimeout(() => button.highlight(1500), 500);
    setTimeout(() => card.highlight(1500), 2500);
    setTimeout(() => infoIcon.highlight(1500), 4500);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h2 className="text-3xl font-brooklyn mb-6">Feature Interaction Example</h2>
      <p className="mb-8 text-gray-600">
        This example demonstrates how to use the <code>useFeatureInteraction</code> hook to create interactive UI elements with tooltips and highlights.
      </p>

      <div className="flex flex-col md:flex-row gap-8 mb-10">
        <div className="md:w-1/2">
          <h3 className="text-xl font-brooklyn mb-4">Interactive Features</h3>
          
          {/* Button example */}
          <div className="mb-6">
            <button
              {...button.getFeatureProps()}
              className={`px-4 py-2 rounded font-brooklyn transition-all ${
                button.isActive
                  ? 'bg-brand-olive-600 text-white'
                  : 'bg-brand-olive-100 text-brand-olive-800 hover:bg-brand-olive-200'
              } ${
                button.isHighlighted
                  ? 'animate-pulse shadow-lg'
                  : ''
              }`}
            >
              Interactive Button
            </button>
            
            {button.isTooltipVisible && (
              <div
                {...button.getTooltipProps()}
                className="absolute mt-2 bg-gray-800 text-white text-sm p-2 rounded shadow-lg z-10"
              >
                {button.tooltip?.text}
                {button.tooltip?.showArrow && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-gray-800" />
                )}
              </div>
            )}
          </div>
          
          {/* Info icon example */}
          <div className="flex items-center mb-8">
            <span className="mr-2">Need help?</span>
            <span
              {...infoIcon.getFeatureProps()}
              className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-olive-100 text-brand-olive-600 cursor-help ${
                infoIcon.isHighlighted ? 'ring-2 ring-brand-olive-400 ring-offset-2' : ''
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            
            {infoIcon.isTooltipVisible && (
              <div
                {...infoIcon.getTooltipProps()}
                className="absolute ml-8 bg-gray-800 text-white text-sm p-2 rounded shadow-lg max-w-xs z-10"
              >
                {infoIcon.tooltip?.text}
                {infoIcon.tooltip?.showArrow && (
                  <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-gray-800" />
                )}
              </div>
            )}
          </div>
          
          {/* Tour button */}
          <button
            onClick={startTour}
            className="px-4 py-2 bg-brand-olive-500 text-white rounded hover:bg-brand-olive-600 transition"
          >
            Start Feature Tour
          </button>
        </div>
        
        {/* Card example */}
        <div className="md:w-1/2">
          <div
            {...card.getFeatureProps()}
            className={`bg-white rounded-xl shadow-md overflow-hidden transition-all ${
              card.isActive ? 'ring-2 ring-brand-olive-400' : ''
            } ${
              card.isHighlighted ? 'shadow-xl bg-brand-olive-50' : ''
            } ${
              card.isHovered ? 'shadow-lg' : ''
            }`}
          >
            <div className="p-6">
              <h3 className="text-xl font-brooklyn mb-2">Interactive Card</h3>
              <p className="text-gray-600 mb-4">
                This card uses the useFeatureInteraction hook to handle hover and click states. Try hovering and clicking to see the different states in action.
              </p>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${card.isActive ? 'text-brand-olive-600' : 'text-gray-500'}`}>
                  {card.isActive ? 'Currently active' : 'Inactive state'}
                </span>
                <button 
                  className="text-sm text-brand-olive-600 hover:text-brand-olive-800"
                  onClick={(e) => {
                    // Prevent triggering the card's onClick
                    e.stopPropagation();
                    card.highlight();
                  }}
                >
                  Highlight
                </button>
              </div>
            </div>
            
            {card.isTooltipVisible && (
              <div
                {...card.getTooltipProps()}
                className="absolute ml-2 bg-gray-800 text-white text-sm p-2 rounded shadow-lg max-w-xs z-10"
              >
                {card.tooltip?.text}
                {card.tooltip?.showArrow && (
                  <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-gray-800" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Status display */}
      <div className="mt-10 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-brooklyn mb-2">Interactive Status</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <strong>Button:</strong>
            <p>State: {button.state}</p>
            <p>Hovered: {button.isHovered ? 'Yes' : 'No'}</p>
            <p>Active: {button.isActive ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <strong>Card:</strong>
            <p>State: {card.state}</p>
            <p>Hovered: {card.isHovered ? 'Yes' : 'No'}</p>
            <p>Active: {card.isActive ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <strong>Info Icon:</strong>
            <p>State: {infoIcon.state}</p>
            <p>Hovered: {infoIcon.isHovered ? 'Yes' : 'No'}</p>
            <p>Tooltip: {infoIcon.isTooltipVisible ? 'Visible' : 'Hidden'}</p>
          </div>
        </div>
        <p className="mt-4">
          <strong>Currently Active Feature:</strong> {activeFeature || 'None'}
        </p>
      </div>
    </div>
  );
}