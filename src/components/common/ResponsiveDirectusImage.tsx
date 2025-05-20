// @ts-nocheck
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getAssetUrl } from '../../lib/api/directus-client-browser';

// Define the types for the component props
interface ResponsiveDirectusImageProps {
  fileId: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  showLoadingIndicator?: boolean;
  loadingIndicatorSize?: 'small' | 'medium' | 'large';
  loadingIndicatorColor?: string;
  onLoad?: () => void;
  breakpoints?: number[];
  placeholder?: 'blur' | 'empty';
}

/**
 * ResponsiveDirectusImage Component
 * 
 * Enhanced image component for displaying images from Directus CMS
 * with responsive behavior and loading states.
 */
export function ResponsiveDirectusImage({
  fileId,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '100vw',
  quality = 80,
  fit = 'cover',
  objectFit = 'cover',
  objectPosition = 'center',
  showLoadingIndicator = true,
  loadingIndicatorSize = 'medium',
  loadingIndicatorColor = 'currentColor',
  onLoad,
  breakpoints = [640, 768, 1024, 1280, 1536],
  placeholder = 'blur'
}: ResponsiveDirectusImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
  // Handle empty fileId
  if (!fileId) return null;
  
  // Check if the fileId is a local path or a Directus asset ID
  const isLocalImage = typeof fileId === 'string' && (fileId.startsWith('/') || fileId.includes('/'));
  
  // Generate image URL - simplified for migration
  const imageUrl = isLocalImage ? fileId : `/images/placeholder-image.jpg`;
  
  // Generate srcset for responsive images - simplified for migration
  const srcSet = undefined;
  
  // CSS classes for the image with fade-in effect
  const imageClasses = `transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`;
  
  // Handle image load complete
  const handleLoadComplete = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };
  
  // Handle image load error
  const handleError = () => {
    setIsError(true);
    setIsLoading(false);
  };
  
  // Simple loading indicator component
  const LoadingIndicator = () => {
    const sizeMap = {
      small: 'w-4 h-4',
      medium: 'w-8 h-8',
      large: 'w-12 h-12',
    };
    
    return (
      <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-100 bg-opacity-20">
        <div 
          className={`animate-spin rounded-full border-t-2 border-solid ${sizeMap[loadingIndicatorSize]}`} 
          style={{ borderTopColor: loadingIndicatorColor }}
        />
      </div>
    );
  };
  
  return (
    <div className="relative overflow-hidden">
      {/* Loading indicator */}
      {isLoading && showLoadingIndicator && <LoadingIndicator />}
      
      {/* Image */}
      {!isError ? (
        <Image
          src={imageUrl}
          alt={alt || 'Image'}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          onLoadingComplete={handleLoadComplete}
          onError={handleError}
          className={imageClasses}
          style={{ objectFit, objectPosition }}
          fill={!width || !height}
          loading={priority ? 'eager' : 'lazy'}
          quality={quality}
          srcSet={srcSet}
          placeholder={placeholder}
        />
      ) : (
        // Error fallback
        <div className="flex items-center justify-center bg-gray-200" 
             style={{ width: width || '100%', height: height || '100%', minHeight: '100px' }}>
          <span className="text-sm text-gray-500">Image not available</span>
        </div>
      )}
    </div>
  );
}

/**
 * Create a backward-compatibility function
 */
export function createCompatibilityLayer() {
  return `
'use client';

/**
 * DEPRECATION NOTICE:
 * This file is deprecated and will be removed in the future.
 * Please use the TypeScript version at src/components/common/ResponsiveDirectusImage.tsx instead.
 */

import { ResponsiveDirectusImage } from '../../src/components/common/ResponsiveDirectusImage';
export default ResponsiveDirectusImage;
`;
}

// Default export for backward compatibility
export default ResponsiveDirectusImage;