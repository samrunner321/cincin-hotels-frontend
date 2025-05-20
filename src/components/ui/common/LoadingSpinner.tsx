/**
 * LoadingSpinner Component
 * 
 * A versatile loading spinner for CinCin Hotels application
 * with different sizes, colors, and optional progress tracking.
 */

import React from 'react';
import { motion } from 'framer-motion';

export type SpinnerSize = 'small' | 'medium' | 'large';
export type SpinnerColor = 'primary' | 'secondary' | 'olive' | 'white' | 'gray';

interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: SpinnerSize;
  
  /** Color of the spinner */
  color?: SpinnerColor;
  
  /** Show percentage value inside spinner (for determinate loading) */
  showProgress?: boolean;
  
  /** Current progress value (0-100) */
  progress?: number;
  
  /** Custom class to apply to the spinner */
  className?: string;
  
  /** Aria label for accessibility */
  ariaLabel?: string;
  
  /** Test id for testing */
  testId?: string;
}

/**
 * Get size in pixels based on size token
 */
const getSizeInPixels = (size: SpinnerSize): number => {
  switch (size) {
    case 'small': return 24;
    case 'medium': return 40;
    case 'large': return 64;
    default: return 40;
  }
};

/**
 * Get color based on color token
 */
const getColorClass = (color: SpinnerColor): string => {
  switch (color) {
    case 'primary': return 'text-blue-600';
    case 'secondary': return 'text-purple-600';
    case 'olive': return 'text-brand-olive-500';
    case 'white': return 'text-white';
    case 'gray': return 'text-gray-400';
    default: return 'text-brand-olive-500';
  }
};

/**
 * Adjusts font size based on spinner size for progress text
 */
const getProgressFontSize = (size: SpinnerSize): string => {
  switch (size) {
    case 'small': return 'text-xs';
    case 'medium': return 'text-sm';
    case 'large': return 'text-base';
    default: return 'text-sm';
  }
};

/**
 * LoadingSpinner component for indicating loading states
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'olive',
  showProgress = false,
  progress = 0,
  className = '',
  ariaLabel = 'Loading',
  testId = 'loading-spinner',
}) => {
  // Calculate sizes based on the size prop
  const sizeInPx = getSizeInPixels(size);
  const colorClass = getColorClass(color);
  const progressFontClass = getProgressFontSize(size);
  
  // Normalize progress between 0-100
  const normalizedProgress = Math.max(0, Math.min(100, progress));
  
  // Determine if spinner is determinate (with progress) or indeterminate
  const isDeterminate = showProgress && normalizedProgress > 0;
  
  // Calculate values for SVG
  const strokeWidth = size === 'small' ? 2 : 3;
  const radius = (sizeInPx / 2) - (strokeWidth * 2);
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedProgress / 100) * circumference;
  
  return (
    <div 
      className={`inline-flex items-center justify-center ${className}`}
      data-testid={testId}
      role="status"
      aria-label={ariaLabel}
    >
      <div className="relative" style={{ width: sizeInPx, height: sizeInPx }}>
        {/* Base circle (track) */}
        <svg
          className="absolute inset-0"
          viewBox={`0 0 ${sizeInPx} ${sizeInPx}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx={sizeInPx / 2}
            cy={sizeInPx / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-200"
          />
        </svg>
        
        {/* Progress circle */}
        <svg
          className="absolute inset-0"
          viewBox={`0 0 ${sizeInPx} ${sizeInPx}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isDeterminate ? (
            <circle
              cx={sizeInPx / 2}
              cy={sizeInPx / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={colorClass}
              transform={`rotate(-90 ${sizeInPx / 2} ${sizeInPx / 2})`}
            />
          ) : (
            <motion.circle
              cx={sizeInPx / 2}
              cy={sizeInPx / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference * 0.75}
              strokeDashoffset={0}
              strokeLinecap="round"
              className={colorClass}
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "linear"
              }}
              style={{ transformOrigin: 'center' }}
            />
          )}
        </svg>
        
        {/* Progress text */}
        {isDeterminate && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`font-medium ${progressFontClass} ${colorClass}`}>
              {Math.round(normalizedProgress)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;