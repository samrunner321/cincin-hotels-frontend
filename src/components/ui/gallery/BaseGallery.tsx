/**
 * BaseGallery Component
 * 
 * A reusable gallery component for CinCin Hotels with support for multiple 
 * display modes, navigation, and rich interaction features.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRtl } from '../../../hooks/useRtl';
import { BaseLayoutProps, BaseAnimationProps, Asset, ImageFit } from '../../../types/advanced-ui';

export interface BaseGalleryProps extends BaseLayoutProps, BaseAnimationProps {
  /** Gallery images/assets to display */
  assets: Asset[];
  
  /** Display mode for the gallery */
  mode?: 'grid' | 'carousel' | 'fullwidth' | 'thumbnail';
  
  /** Number of columns for grid mode */
  columns?: number;
  
  /** Aspect ratio for images */
  aspectRatio?: '1:1' | '4:3' | '16:9' | '3:2';
  
  /** Show navigation controls */
  showControls?: boolean;
  
  /** Show image captions */
  showCaptions?: boolean;
  
  /** Enable auto-rotation */
  autoRotate?: boolean;
  
  /** Auto-rotation interval in ms */
  rotationInterval?: number;
  
  /** Enable lightbox on click */
  enableLightbox?: boolean;
  
  /** Object fit mode for images */
  imageFit?: ImageFit;
  
  /** Enable zoom on hover */
  enableZoom?: boolean;
  
  /** Initially selected asset index */
  initialIndex?: number;
  
  /** Callback when asset is selected */
  onAssetSelect?: (asset: Asset, index: number) => void;
  
  /** Custom render function for image */
  renderImage?: (asset: Asset, index: number, isActive: boolean) => React.ReactNode;
  
  /** Custom render function for thumbnail */
  renderThumbnail?: (asset: Asset, index: number, isActive: boolean) => React.ReactNode;
  
  /** Custom render function for caption */
  renderCaption?: (asset: Asset, index: number) => React.ReactNode;
}

/**
 * Calculate aspect ratio styles
 */
const getAspectRatioStyle = (aspectRatio: string): React.CSSProperties => {
  const [width, height] = aspectRatio.split(':').map(Number);
  return {
    position: 'relative',
    paddingBottom: `${(height / width) * 100}%`,
  };
};

/**
 * BaseGallery component for displaying image galleries
 */
const BaseGallery: React.FC<BaseGalleryProps> = ({
  assets = [],
  mode = 'carousel',
  columns = 3,
  aspectRatio = '4:3',
  showControls = true,
  showCaptions = true,
  autoRotate = false,
  rotationInterval = 5000,
  enableLightbox = false,
  imageFit = 'cover',
  enableZoom = false,
  initialIndex = 0,
  onAssetSelect,
  renderImage,
  renderThumbnail,
  renderCaption,
  className = '',
  style,
  id,
  visible = true,
  rtlAware = true,
  animationVariant = 'fade',
  animationDelay = 0,
  animationDuration = 500,
  animationsEnabled = true,
  reducedMotion = false,
}) => {
  // State management
  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  
  // Auto-rotation timer reference
  const rotationTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // RTL support
  const { isRtl, direction, getOrderedArray } = useRtl();
  
  // Animation variants
  const slideVariants = {
    enterFromRight: {
      x: isRtl ? -100 : 100,
      opacity: 0,
    },
    enterFromLeft: {
      x: isRtl ? 100 : -100,
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: reducedMotion ? 0 : 0.3,
      },
    },
    exitToLeft: {
      x: isRtl ? 100 : -100,
      opacity: 0,
      transition: {
        duration: reducedMotion ? 0 : 0.3,
      },
    },
    exitToRight: {
      x: isRtl ? -100 : 100,
      opacity: 0,
      transition: {
        duration: reducedMotion ? 0 : 0.3,
      },
    },
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: reducedMotion ? 0 : animationDuration / 1000,
        delay: reducedMotion ? 0 : animationDelay / 1000,
      }
    }
  };
  
  const gridItemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (custom: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: reducedMotion ? 0 : 0.3,
        delay: reducedMotion ? 0 : (custom * 0.1) + (animationDelay / 1000),
      }
    }),
  };
  
  // Navigation handlers
  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % assets.length);
  }, [assets.length]);
  
  const goToPrevious = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + assets.length) % assets.length);
  }, [assets.length]);
  
  const goToIndex = useCallback((index: number) => {
    setActiveIndex(index);
    if (onAssetSelect && assets[index]) {
      onAssetSelect(assets[index], index);
    }
  }, [assets, onAssetSelect]);
  
  // Auto-rotation effect
  useEffect(() => {
    if (autoRotate && !isHovered && !isLightboxOpen && assets.length > 1) {
      rotationTimerRef.current = setInterval(goToNext, rotationInterval);
    }
    
    return () => {
      if (rotationTimerRef.current) {
        clearInterval(rotationTimerRef.current);
      }
    };
  }, [autoRotate, isHovered, isLightboxOpen, assets.length, goToNext, rotationInterval]);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen || (galleryRef.current && galleryRef.current.contains(document.activeElement))) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          isRtl ? goToPrevious() : goToNext();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          isRtl ? goToNext() : goToPrevious();
        } else if (e.key === 'Escape' && isLightboxOpen) {
          e.preventDefault();
          setIsLightboxOpen(false);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious, isLightboxOpen, isRtl]);
  
  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartX;
    
    // Check if the swipe was significant enough (> 50px)
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // Swipe right
        isRtl ? goToNext() : goToPrevious();
      } else {
        // Swipe left
        isRtl ? goToPrevious() : goToNext();
      }
    }
    
    setTouchStartX(null);
  };
  
  // Exit early if not visible
  if (!visible) {
    return null;
  }
  
  // Exit early if no assets
  if (assets.length === 0) {
    return (
      <div className={`text-center p-4 ${className}`} style={style} id={id}>
        <div className="bg-gray-100 p-8 rounded-lg">
          <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500">No images available</p>
        </div>
      </div>
    );
  }
  
  // Reorder assets for RTL if needed
  const orderedAssets = rtlAware ? getOrderedArray(assets) : assets;
  const activeAsset = orderedAssets[activeIndex];

  // Render different gallery modes
  switch (mode) {
    case 'grid':
      return (
        <motion.div
          ref={galleryRef}
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${columns} gap-4 ${className}`}
          style={style}
          id={id}
          dir={rtlAware ? direction : undefined}
          initial={animationsEnabled ? "hidden" : "visible"}
          animate={animationsEnabled ? "visible" : "visible"}
          variants={containerVariants}
        >
          {orderedAssets.map((asset, index) => (
            <motion.div
              key={asset.id}
              custom={index}
              variants={gridItemVariants}
              initial={animationsEnabled ? "hidden" : "visible"}
              animate={animationsEnabled ? "visible" : "visible"}
              className="relative overflow-hidden rounded-lg cursor-pointer"
              style={getAspectRatioStyle(aspectRatio)}
              onClick={() => {
                goToIndex(index);
                if (enableLightbox) {
                  setIsLightboxOpen(true);
                }
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {renderImage ? (
                renderImage(asset, index, index === activeIndex)
              ) : (
                <Image
                  src={asset.url}
                  alt={asset.title || `Gallery image ${index + 1}`}
                  fill
                  className={`object-${imageFit} transition-transform duration-300 ${enableZoom && 'hover:scale-110'}`}
                />
              )}
              
              {showCaptions && asset.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-sm">
                  {renderCaption ? renderCaption(asset, index) : asset.title}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      );
      
    case 'thumbnail':
      return (
        <div
          ref={galleryRef}
          className={`space-y-4 ${className}`}
          style={style}
          id={id}
          dir={rtlAware ? direction : undefined}
        >
          {/* Main image */}
          <motion.div
            className="relative overflow-hidden rounded-lg"
            style={getAspectRatioStyle(aspectRatio)}
            initial={animationsEnabled ? "hidden" : "visible"}
            animate={animationsEnabled ? "visible" : "visible"}
            variants={containerVariants}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={animationsEnabled ? "enterFromRight" : "center"}
                animate="center"
                exit={animationsEnabled ? "exitToLeft" : "center"}
                variants={slideVariants}
                className="absolute inset-0"
              >
                {renderImage ? (
                  renderImage(activeAsset, activeIndex, true)
                ) : (
                  <Image
                    src={activeAsset.url}
                    alt={activeAsset.title || `Gallery image ${activeIndex + 1}`}
                    fill
                    className={`object-${imageFit} transition-transform duration-300 ${enableZoom && isHovered && 'scale-110'}`}
                    onClick={() => enableLightbox && setIsLightboxOpen(true)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
            
            {showControls && assets.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md focus:outline-none z-10 transition-opacity duration-300"
                  aria-label="Previous image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md focus:outline-none z-10 transition-opacity duration-300"
                  aria-label="Next image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            {showCaptions && activeAsset.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-3 text-sm">
                {renderCaption ? renderCaption(activeAsset, activeIndex) : activeAsset.title}
              </div>
            )}
          </motion.div>
          
          {/* Thumbnails */}
          {assets.length > 1 && (
            <div className="flex gap-2 overflow-x-auto py-2 sm:justify-center">
              {orderedAssets.map((asset, index) => (
                <button
                  key={asset.id}
                  onClick={() => goToIndex(index)}
                  className={`relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-brand-olive-500 ${
                    index === activeIndex ? 'ring-2 ring-brand-olive-500' : 'ring-1 ring-gray-300'
                  }`}
                  aria-label={`View image ${index + 1}`}
                  aria-current={index === activeIndex ? 'true' : 'false'}
                >
                  {renderThumbnail ? (
                    renderThumbnail(asset, index, index === activeIndex)
                  ) : (
                    <Image
                      src={asset.thumbnail || asset.url}
                      alt={asset.title || `Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      );
      
    case 'fullwidth':
      return (
        <div
          ref={galleryRef}
          className={`relative w-full ${className}`}
          style={{
            ...style,
            height: style?.height || '70vh',
          }}
          id={id}
          dir={rtlAware ? direction : undefined}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={animationsEnabled ? "enterFromRight" : "center"}
              animate="center"
              exit={animationsEnabled ? "exitToLeft" : "center"}
              variants={slideVariants}
              className="absolute inset-0"
            >
              {renderImage ? (
                renderImage(activeAsset, activeIndex, true)
              ) : (
                <Image
                  src={activeAsset.url}
                  alt={activeAsset.title || `Gallery image ${activeIndex + 1}`}
                  fill
                  className={`object-${imageFit} transition-transform duration-300 ${enableZoom && isHovered && 'scale-105'}`}
                  onClick={() => enableLightbox && setIsLightboxOpen(true)}
                />
              )}
            </motion.div>
          </AnimatePresence>
          
          {showControls && assets.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-80 rounded-full p-3 shadow-md focus:outline-none z-10 transition-opacity duration-300"
                aria-label="Previous image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-80 rounded-full p-3 shadow-md focus:outline-none z-10 transition-opacity duration-300"
                aria-label="Next image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          
          {showCaptions && activeAsset.title && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-4">
              {renderCaption ? renderCaption(activeAsset, activeIndex) : (
                <h3 className="text-lg font-medium">{activeAsset.title}</h3>
              )}
              {activeAsset.description && (
                <p className="text-sm text-white text-opacity-80 mt-1">{activeAsset.description}</p>
              )}
            </div>
          )}
          
          {/* Pagination indicators */}
          {assets.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
              {orderedAssets.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToIndex(index)}
                  className={`w-2 h-2 rounded-full focus:outline-none ${
                    index === activeIndex 
                      ? 'bg-white scale-125' 
                      : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                  aria-current={index === activeIndex ? 'true' : 'false'}
                />
              ))}
            </div>
          )}
        </div>
      );
    
    // Default carousel mode
    case 'carousel':
    default:
      return (
        <div
          ref={galleryRef}
          className={`relative overflow-hidden rounded-lg ${className}`}
          style={{
            ...style,
            ...getAspectRatioStyle(aspectRatio),
          }}
          id={id}
          dir={rtlAware ? direction : undefined}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={animationsEnabled ? "enterFromRight" : "center"}
              animate="center"
              exit={animationsEnabled ? "exitToLeft" : "center"}
              variants={slideVariants}
              className="absolute inset-0"
            >
              {renderImage ? (
                renderImage(activeAsset, activeIndex, true)
              ) : (
                <Image
                  src={activeAsset.url}
                  alt={activeAsset.title || `Gallery image ${activeIndex + 1}`}
                  fill
                  className={`object-${imageFit} transition-transform duration-300 ${enableZoom && isHovered && 'scale-110'}`}
                  onClick={() => enableLightbox && setIsLightboxOpen(true)}
                />
              )}
            </motion.div>
          </AnimatePresence>
          
          {showControls && assets.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-2 shadow-md focus:outline-none z-10 transition-opacity duration-300"
                aria-label="Previous image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-2 shadow-md focus:outline-none z-10 transition-opacity duration-300"
                aria-label="Next image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          
          {showCaptions && activeAsset.title && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-3 text-sm">
              {renderCaption ? renderCaption(activeAsset, activeIndex) : activeAsset.title}
            </div>
          )}
          
          {/* Pagination indicators */}
          {assets.length > 1 && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-10">
              {orderedAssets.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToIndex(index)}
                  className={`w-1.5 h-1.5 rounded-full focus:outline-none ${
                    index === activeIndex 
                      ? 'bg-white scale-125' 
                      : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                  aria-current={index === activeIndex ? 'true' : 'false'}
                />
              ))}
            </div>
          )}
        </div>
      );
  }
};

export default BaseGallery;