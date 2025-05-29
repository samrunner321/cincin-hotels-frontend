'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getOptimizedImageUrl, generateSrcSet, getBlurDataUrl } from '@/lib/image-utils';

export default function OptimizedImage({ 
  imageId, 
  alt, 
  width, 
  height,
  priority = false,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 80,
  objectFit = 'cover'
}) {
  const [isLoading, setIsLoading] = useState(true);
  
  if (!imageId) {
    return (
      <div 
        className={`bg-gray-200 ${className}`}
        style={{ width, height }}
      />
    );
  }
  
  const src = getOptimizedImageUrl(imageId, { width, height, quality });
  const blurDataURL = getBlurDataUrl(imageId);
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className={`
          duration-700 ease-in-out
          ${isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'}
        `}
        onLoadingComplete={() => setIsLoading(false)}
        style={{
          objectFit: objectFit,
          width: '100%',
          height: '100%'
        }}
        placeholder="blur"
        blurDataURL={blurDataURL}
      />
    </div>
  );
}