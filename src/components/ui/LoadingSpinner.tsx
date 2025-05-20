/**
 * LoadingSpinner Component
 * 
 * Displays a customizable loading spinner with optional progress indicator
 */
import React from 'react';
import { cn } from '../../lib/utils';
import { DisplaySize } from '../../types/ui';

interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: 'sm' | 'md' | 'lg' | DisplaySize;
  /** Container className */
  className?: string;
  /** Color styles (Tailwind classes) */
  color?: string;
  /** Themed color */
  colorTheme?: 'primary' | 'secondary' | 'olive' | 'gray' | 'white';
  /** Optional label text */
  label?: string;
  /** Show progress percentage (0-100) */
  progress?: number;
  /** Display as overlay with backdrop */
  overlay?: boolean;
}

export default function LoadingSpinner({
  size = 'md',
  className = '',
  color,
  colorTheme = 'olive',
  label,
  progress,
  overlay = false
}: LoadingSpinnerProps) {
  // Size mapping (combining old style with new style)
  const sizeClasses = {
    // Legacy sizes
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    // New sizes
    'xsmall': 'w-4 h-4',
    'small': 'w-6 h-6',
    'medium': 'w-10 h-10',
    'large': 'w-16 h-16',
    'xlarge': 'w-24 h-24',
  };
  
  // Color mapping
  const colorMap = {
    'primary': 'text-blue-600',
    'secondary': 'text-gray-700',
    'olive': 'text-brand-olive-600',
    'gray': 'text-gray-400',
    'white': 'text-white',
  };
  
  // Track color mapping (for progress spinners)
  const trackColorMap = {
    'primary': 'text-blue-200',
    'secondary': 'text-gray-300',
    'olive': 'text-brand-olive-200',
    'gray': 'text-gray-200',
    'white': 'text-white/30',
  };
  
  // Use custom color if provided, otherwise use theme color
  const spinnerColor = color || colorMap[colorTheme];
  
  // Get size class based on the size prop
  const actualSizeClass = sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.md;
  
  // Label font size based on spinner size
  const labelSize = 
    size === 'large' || size === 'lg' ? 'text-base' : 
    size === 'medium' || size === 'md' ? 'text-sm' : 
    'text-xs';
  
  // Spinner content
  const spinnerContent = progress !== undefined ? (
    <div className="relative">
      {/* Background track */}
      <svg 
        className={cn(actualSizeClass, color || trackColorMap[colorTheme])} 
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          fill="none"
          strokeWidth="3"
          stroke="currentColor"
        />
      </svg>
      
      {/* Progress indicator */}
      <svg 
        className={cn(actualSizeClass, spinnerColor, 'absolute inset-0')} 
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-75"
          cx="12"
          cy="12"
          r="10"
          fill="none"
          strokeWidth="3"
          stroke="currentColor"
          strokeDasharray={`${progress * 0.63} 100`}
          strokeLinecap="round"
          transform="rotate(-90 12 12)"
        />
      </svg>
      
      {/* Percentage text in center */}
      {(size === 'lg' || size === 'large' || size === 'md' || size === 'medium') && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(spinnerColor, 'text-xs font-semibold')}>
            {progress}%
          </span>
        </div>
      )}
    </div>
  ) : (
    <svg 
      className={cn('animate-spin', actualSizeClass, spinnerColor)}
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
  
  // Container with label
  const spinnerWithLabel = (
    <div className="flex flex-col items-center">
      {spinnerContent}
      {label && (
        <span className={cn(`mt-2 ${labelSize} font-brooklyn`, spinnerColor)}>
          {label}
        </span>
      )}
    </div>
  );
  
  // Render with overlay if requested
  if (overlay) {
    return (
      <div className={cn("absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg z-10", className)}>
        {spinnerWithLabel}
      </div>
    );
  }
  
  // Standard render
  return (
    <div className={cn('flex items-center justify-center', className)}>
      {label ? spinnerWithLabel : spinnerContent}
    </div>
  );
}