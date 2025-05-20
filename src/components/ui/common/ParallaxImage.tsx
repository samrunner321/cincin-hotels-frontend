/**
 * ParallaxImage Component - Simplified version
 * 
 * A simplified version of the ParallaxImage component to enable build completion.
 */

import React from 'react';
import Image from 'next/image';
import { BaseLayoutProps, BaseAnimationProps } from '../../../types/advanced-ui';

interface ParallaxImageProps extends BaseLayoutProps, BaseAnimationProps {
  /** Image URL */
  src: string;
  
  /** Alternative text for accessibility */
  alt: string;
  
  /** Fill parent container */
  fill?: boolean;
  
  /** Image width */
  width?: number;
  
  /** Image height */
  height?: number;
  
  /** Whether image should be loaded with priority */
  priority?: boolean;
  
  /** Container class name */
  containerClassName?: string;
}

/**
 * Simplified version of the ParallaxImage component
 */
const ParallaxImage: React.FC<ParallaxImageProps> = ({
  src,
  alt,
  fill = true,
  width,
  height,
  priority = false,
  containerClassName = '',
  className = '',
  style,
  id,
}) => {
  return (
    <div 
      className={`relative overflow-hidden ${containerClassName}`}
      style={style}
      id={id}
    >
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          priority={priority}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          className={className}
          style={{ objectFit: 'cover' }}
        />
      </div>
    </div>
  );
};

export default React.memo(ParallaxImage);