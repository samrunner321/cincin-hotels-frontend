// @ts-nocheck
'use client';

import { useState, useRef, useEffect } from 'react';
import { useFeatureInteraction } from '../../hooks/useFeatureInteraction';
import { Asset, DemoAssetGalleryProps, SpinnerOption } from '../../types/advanced-ui';
import { motion } from 'framer-motion';

// Import needed components
import ResponsiveDirectusImage from '../common/ResponsiveDirectusImage';
import LoadingSpinner from '../ui/LoadingSpinner';
import { AssetManagerProvider } from '../common/AssetPreloader';

/**
 * DemoAssetGallery Component
 * 
 * A standalone gallery component with rich interactions and accessibility features
 */
export default function DemoAssetGallery({
  assets,
  initialTab = 'images',
  defaultSpinnerConfig,
}: DemoAssetGalleryProps) {
  // State
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Default assets if none provided
  const localAssets: Asset[] = assets || [
    {
      id: '1',
      url: '/images/hotels/hotel-1.jpg',
      thumbnail: '/images/hotels/hotel-1.jpg',
      title: 'Hotel Mountain View',
      description: 'Luxury suite with panoramic mountain views',
      type: 'image',
    },
    {
      id: '2',
      url: '/images/hotels/hotel-2.jpg',
      thumbnail: '/images/hotels/hotel-2.jpg',
      title: 'Seaside Resort',
      description: 'Beachfront bungalows with private access',
      type: 'image',
    },
    {
      id: '3',
      url: '/images/hotels/hotel-3.jpg',
      thumbnail: '/images/hotels/hotel-3.jpg',
      title: 'City Skyline Hotel',
      description: 'Downtown location with rooftop bar',
      type: 'image',
    },
    {
      id: '4',
      url: '/images/hotels/hotel-4.jpg',
      thumbnail: '/images/hotels/hotel-4.jpg',
      title: 'Forest Retreat',
      description: 'Secluded cabins in a pristine forest setting',
      type: 'image',
    },
    {
      id: '5',
      url: '/images/hotels/hotel-5.jpg',
      thumbnail: '/images/hotels/hotel-5.jpg',
      title: 'Luxury Poolside',
      description: 'Infinity pool with mountain vista',
      type: 'image',
    },
    {
      id: '6',
      url: '/images/hotels/hotel-6.jpg',
      thumbnail: '/images/hotels/hotel-6.jpg',
      title: 'Alpine Lodge',
      description: 'Traditional alpine architecture with modern amenities',
      type: 'image',
    },
  ];

  // Default spinner configs
  const spinnerSizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'];
  const spinnerColors = ['olive', 'gray', 'white', 'primary', 'secondary'];
  
  // Use feature interaction hooks
  const tabsInteraction = useFeatureInteraction({
    featureId: 'asset-gallery-tabs',
    interactionTypes: ['hover', 'click'],
  });

  const mainImageInteraction = useFeatureInteraction({
    featureId: 'asset-gallery-main-image',
    interactionTypes: ['hover', 'click'],
    tooltip: {
      enabled: true,
      position: 'top',
      text: 'Click for fullscreen view',
      showArrow: true,
    },
    onInteraction: (type) => {
      if (type === 'click') {
        toggleFullscreen();
      }
    },
  });

  // Create an interaction hook for each thumbnail
  const thumbnailInteractions = localAssets.map((asset, index) => 
    useFeatureInteraction({
      featureId: `thumbnail-${asset.id}`,
      interactionTypes: ['hover', 'click', 'focus'],
      initialState: index === selectedImageIndex ? 'active' : 'idle',
      tooltip: {
        enabled: true,
        position: 'top',
        text: asset.title,
        showArrow: true,
      },
      onInteraction: (type) => {
        if (type === 'click') {
          setSelectedImageIndex(index);
        }
      },
    })
  );

  // Toggle fullscreen view
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === 'Escape') {
          setIsFullscreen(false);
        } else if (e.key === 'ArrowLeft') {
          setSelectedImageIndex(prev => 
            prev === 0 ? localAssets.length - 1 : prev - 1
          );
        } else if (e.key === 'ArrowRight') {
          setSelectedImageIndex(prev => 
            prev === localAssets.length - 1 ? 0 : prev + 1
          );
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, localAssets.length]);

  // Swipe gesture handling
  useEffect(() => {
    if (!galleryRef.current || !isFullscreen) return;
    
    let startX = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      
      // Minimum swipe distance threshold
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swipe left - next image
          setSelectedImageIndex(prev => 
            prev === localAssets.length - 1 ? 0 : prev + 1
          );
        } else {
          // Swipe right - previous image
          setSelectedImageIndex(prev => 
            prev === 0 ? localAssets.length - 1 : prev - 1
          );
        }
      }
    };
    
    const gallery = galleryRef.current;
    gallery.addEventListener('touchstart', handleTouchStart);
    gallery.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      gallery.removeEventListener('touchstart', handleTouchStart);
      gallery.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isFullscreen, localAssets.length]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  // Fullscreen image viewer
  const FullscreenViewer = () => (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
      ref={galleryRef}
    >
      <button 
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
        onClick={toggleFullscreen}
        aria-label="Close fullscreen view"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <button 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-50"
        onClick={() => setSelectedImageIndex(prev => prev === 0 ? localAssets.length - 1 : prev - 1)}
        aria-label="Previous image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-50"
        onClick={() => setSelectedImageIndex(prev => prev === localAssets.length - 1 ? 0 : prev + 1)}
        aria-label="Next image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      <div className="relative w-[90vw] h-[80vh]">
        <ResponsiveDirectusImage
          fileId={localAssets[selectedImageIndex].url}
          alt={localAssets[selectedImageIndex].title}
          priority={true}
          objectFit="contain"
          className="w-full h-full"
        />
      </div>
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center max-w-xl">
        <h3 className="text-xl font-brooklyn mb-1">{localAssets[selectedImageIndex].title}</h3>
        <p className="text-sm text-gray-300">{localAssets[selectedImageIndex].description}</p>
      </div>
      
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {localAssets.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${
              idx === selectedImageIndex ? 'bg-white' : 'bg-gray-400'
            }`}
            onClick={() => setSelectedImageIndex(idx)}
            aria-label={`View image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <AssetManagerProvider>
      <div className="container mx-auto px-4 py-12">
        <motion.h1 
          className="text-3xl font-bold mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Asset Management Demo
        </motion.h1>
        
        {/* Tab navigation */}
        <div 
          className="flex border-b mb-8"
          {...tabsInteraction.getFeatureProps()}
        >
          <button 
            className={`px-4 py-2 transition-colors ${activeTab === 'images' ? 'border-b-2 border-brand-olive-600 font-semibold' : 'hover:text-brand-olive-600'}`}
            onClick={() => setActiveTab('images')}
            aria-selected={activeTab === 'images'}
            role="tab"
          >
            Responsive Images
          </button>
          <button 
            className={`px-4 py-2 transition-colors ${activeTab === 'spinners' ? 'border-b-2 border-brand-olive-600 font-semibold' : 'hover:text-brand-olive-600'}`}
            onClick={() => setActiveTab('spinners')}
            aria-selected={activeTab === 'spinners'}
            role="tab"
          >
            Loading Spinners
          </button>
        </div>
        
        {/* Images Tab */}
        {activeTab === 'images' && (
          <motion.div 
            className="space-y-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Main gallery view */}
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-md"
              variants={itemVariants}
            >
              <h2 className="text-2xl font-semibold mb-6">Image Gallery</h2>
              
              {/* Main image display */}
              <div 
                className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden mb-6 cursor-pointer transform transition hover:scale-[1.01]"
                {...mainImageInteraction.getFeatureProps()}
              >
                <ResponsiveDirectusImage
                  fileId={localAssets[selectedImageIndex].url}
                  alt={localAssets[selectedImageIndex].title}
                  priority={true}
                  objectFit="contain"
                  className="w-full h-full"
                />
                
                <div className="absolute bottom-4 left-4 bg-black/70 text-white rounded px-3 py-1.5 text-sm max-w-[80%]">
                  <p className="font-semibold">{localAssets[selectedImageIndex].title}</p>
                  <p className="text-xs text-gray-300">{localAssets[selectedImageIndex].description}</p>
                </div>
                
                {mainImageInteraction.isTooltipVisible && (
                  <div
                    {...mainImageInteraction.getTooltipProps()}
                    className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm py-2 px-3 rounded shadow-lg z-10"
                  >
                    Click for fullscreen view
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-800" />
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {localAssets.map((asset, idx) => (
                  <button
                    key={idx}
                    className={`relative aspect-square rounded-md overflow-hidden transition-all ${
                      idx === selectedImageIndex ? 'ring-2 ring-brand-olive-600 scale-105 z-10' : 'opacity-80 hover:opacity-100'
                    }`}
                    onClick={() => setSelectedImageIndex(idx)}
                    aria-label={`Select ${asset.title}`}
                    aria-current={idx === selectedImageIndex}
                    {...thumbnailInteractions[idx].getFeatureProps()}
                  >
                    <ResponsiveDirectusImage
                      fileId={asset.thumbnail}
                      alt={`Thumbnail: ${asset.title}`}
                      showLoadingSpinner={true}
                      loadingSpinnerSize="xsmall"
                      className="w-full h-full"
                      objectFit="cover"
                    />
                    
                    {thumbnailInteractions[idx].isTooltipVisible && (
                      <div
                        {...thumbnailInteractions[idx].getTooltipProps()}
                        className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap z-20"
                      >
                        {asset.title}
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Controls for keyboard navigation help */}
              <div className="mt-6 flex justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <span className="inline-block border border-gray-300 rounded px-1.5 py-0.5 mr-2">←</span>
                  <span>Previous</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block border border-gray-300 rounded px-1.5 py-0.5 mr-2">→</span>
                  <span>Next</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block border border-gray-300 rounded px-1.5 py-0.5 mr-2">Esc</span>
                  <span>Exit Fullscreen</span>
                </div>
              </div>
            </motion.div>
            
            {/* Image grid with accessibility descriptions */}
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-md"
              variants={itemVariants}
            >
              <h2 className="text-2xl font-semibold mb-6">Accessible Image Grid</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {localAssets.map((asset, idx) => (
                  <motion.div 
                    key={idx} 
                    className="space-y-2"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <div className="aspect-[4/3] rounded-lg overflow-hidden relative group">
                      <ResponsiveDirectusImage
                        fileId={asset.url}
                        alt={asset.title}
                        className="w-full h-full"
                        objectFit="cover"
                      />
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          className="px-4 py-2 bg-white text-gray-900 rounded-md"
                          onClick={() => {
                            setSelectedImageIndex(idx);
                            toggleFullscreen();
                          }}
                        >
                          View Full Size
                        </button>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{asset.title}</h3>
                      <p className="text-sm text-gray-600">{asset.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Spinners Tab */}
        {activeTab === 'spinners' && (
          <motion.div 
            className="space-y-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Size variations */}
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-md"
              variants={itemVariants}
            >
              <h2 className="text-2xl font-semibold mb-6">Spinner Sizes</h2>
              
              <div className="flex flex-wrap gap-8">
                {spinnerSizes.map(size => (
                  <div key={size} className="flex flex-col items-center space-y-2">
                    <LoadingSpinner size={size} />
                    <span className="text-sm">{size}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* Color variations */}
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-md"
              variants={itemVariants}
            >
              <h2 className="text-2xl font-semibold mb-6">Spinner Colors</h2>
              
              <div className="flex flex-wrap gap-8">
                {spinnerColors.map(color => (
                  <div key={color} className="flex flex-col items-center space-y-2">
                    <LoadingSpinner size="medium" color={color} />
                    <span className="text-sm">{color}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* With progress */}
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-md"
              variants={itemVariants}
            >
              <h2 className="text-2xl font-semibold mb-6">Progress Spinners</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <LoadingSpinner 
                  label="Loading 25%" 
                  progress={25} 
                  color="primary" 
                />
                
                <LoadingSpinner 
                  label="Loading 50%" 
                  progress={50} 
                  color="olive" 
                />
                
                <LoadingSpinner 
                  label="Loading 75%" 
                  progress={75} 
                  color="secondary" 
                />
              </div>
            </motion.div>
            
            {/* Overlay example */}
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-md"
              variants={itemVariants}
            >
              <h2 className="text-2xl font-semibold mb-6">Spinner Overlays</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <LoadingSpinner 
                    overlay={true} 
                    label="Loading content..." 
                  />
                </div>
                
                <div className="relative aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                  <LoadingSpinner 
                    overlay={true} 
                    color="white" 
                    label="Processing..." 
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
      
      {/* Fullscreen view (conditionally rendered) */}
      {isFullscreen && <FullscreenViewer />}
    </AssetManagerProvider>
  );
}