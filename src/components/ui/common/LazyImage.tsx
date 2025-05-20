/**
 * LazyImage Component - Simplified version
 * 
 * A simplified version of the LazyImage component to enable build completion.
 */

import React from 'react';
import Image, { ImageProps } from 'next/image';

/**
 * LazyImage component for optimized image loading
 */
const LazyImage: React.FC<ImageProps> = (props) => {
  return (
    <div className="relative">
      <Image
        {...props}
      />
    </div>
  );
};

export default React.memo(LazyImage);