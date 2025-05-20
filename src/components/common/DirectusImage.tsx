'use client';

import Image from 'next/image';
import { getAssetURL } from '../../lib/directus';
import { useState } from 'react';

interface DirectusImageProps {
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
}

export default function DirectusImage({
  fileId,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes = '100vw',
  quality = 80,
  fit = 'cover',
  objectFit = 'cover',
  objectPosition = 'center'
}: DirectusImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  if (!fileId) return null;
  
  // Basisbildpfad ohne Transformationen
  const imageUrl = getAssetURL(fileId);
  
  // Transformations URL für Art Direktion und verschiedene Bildschirmgrößen
  const getTransformedUrl = (fileId: string, width: number) => {
    const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
    return `${baseUrl}/assets/${fileId}?width=${width}&quality=${quality}&fit=${fit}`;
  };
  
  // Image-Loading-Klassen für Fade-In-Effekt
  const imageClasses = `transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className || ''}`;
  
  return (
    <div className="relative overflow-hidden">
      <Image
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        onLoadingComplete={() => setIsLoading(false)}
        className={imageClasses}
        style={{ objectFit, objectPosition }}
        fill={!width || !height}
      />
    </div>
  );
}