'use client';

import React, { useState, useEffect } from 'react';

interface LazyMapProps {
  src: string;
  title: string;
  className?: string;
  height?: string | number;
  width?: string | number;
}

/**
 * LazyMap component - Lazily loads an iframe map only when it's close to viewport
 * This can significantly improve the initial page load performance
 */
export default function LazyMap({ 
  src, 
  title, 
  className = '',
  height = '100%',
  width = '100%'
}: LazyMapProps): React.ReactElement {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const mapRef = React.useRef<HTMLDivElement>(null);

  // Setup intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // Load map when within 200px of viewport
        threshold: 0.1
      }
    );

    if (mapRef.current) {
      observer.observe(mapRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={mapRef} 
      className={`relative ${className}`} 
      style={{ height, width }}
    >
      {/* Placeholder before map loads */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="text-gray-600">
            Loading map...
          </div>
        </div>
      )}

      {/* Only render the actual iframe when visible */}
      {isVisible && (
        <iframe 
          src={src}
          title={title}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
}