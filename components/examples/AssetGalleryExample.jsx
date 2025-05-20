'use client';

import { useState, useEffect } from 'react';
import { useAssetManager } from '../common/AssetManager';
import ResponsiveDirectusImage from '../common/ResponsiveDirectusImage';
import AssetPreloader from '../common/AssetPreloader';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * AssetGalleryExample
 * Example component demonstrating the asset management system
 */
export default function AssetGalleryExample({ 
  galleryItems = [], 
  title = 'Image Gallery', 
  preloadAll = false 
}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [allLoaded, setAllLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { getAsset, preloadAsset, assetCache } = useAssetManager();
  
  // Calculate loading progress
  useEffect(() => {
    if (galleryItems.length === 0) {
      setLoadingProgress(100);
      setAllLoaded(true);
      return;
    }
    
    const loadedCount = galleryItems.filter(
      item => assetCache[item.fileId]?.loaded
    ).length;
    
    const progress = Math.round((loadedCount / galleryItems.length) * 100);
    setLoadingProgress(progress);
    
    if (progress === 100) {
      setAllLoaded(true);
    }
  }, [galleryItems, assetCache]);
  
  // Preload essential images
  useEffect(() => {
    // Always preload the first few images
    galleryItems.slice(0, 3).forEach(item => {
      preloadAsset(item.fileId, 'image', { priority: true });
    });
    
    // Set the first image as selected
    if (galleryItems.length > 0 && !selectedImage) {
      setSelectedImage(galleryItems[0]);
    }
    
    // Preload all images if requested
    if (preloadAll) {
      galleryItems.forEach(item => {
        preloadAsset(item.fileId, 'image');
      });
    }
  }, [galleryItems, preloadAsset, preloadAll, selectedImage]);
  
  // Handler for thumbnail click
  const handleThumbnailClick = (item) => {
    setSelectedImage(item);
  };
  
  // Prepare assets for preloader
  const preloadAssets = galleryItems.map(item => ({
    id: item.fileId,
    type: 'image'
  }));
  
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Preloader component */}
      <AssetPreloader 
        assets={preloadAssets} 
        autoPreload={preloadAll}
        onComplete={() => setAllLoaded(true)}
      />
      
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      
      {/* Main image display */}
      <div className="w-full h-96 relative bg-gray-100 mb-6 rounded-lg overflow-hidden">
        {selectedImage ? (
          <ResponsiveDirectusImage
            fileId={selectedImage.fileId}
            alt={selectedImage.alt || 'Gallery image'}
            objectFit="contain"
            className="w-full h-full"
            showLoadingSpinner={true}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner 
              size="large" 
              label="Select an image" 
              color="gray"
            />
          </div>
        )}
      </div>
      
      {/* Loading progress indicator */}
      {!allLoaded && (
        <div className="mb-6">
          <LoadingSpinner 
            size="small" 
            progress={loadingProgress} 
            label={`Loading gallery: ${loadingProgress}%`}
          />
        </div>
      )}
      
      {/* Thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {galleryItems.map((item, index) => {
          const isSelected = selectedImage && selectedImage.fileId === item.fileId;
          const asset = getAsset(item.fileId);
          
          return (
            <div 
              key={`gallery-item-${index}`} 
              className={`
                relative cursor-pointer h-24 bg-gray-100 rounded-md overflow-hidden 
                transition-all duration-300
                ${isSelected ? 'ring-2 ring-brand-olive-600' : 'hover:opacity-90'}
              `}
              onClick={() => handleThumbnailClick(item)}
            >
              <ResponsiveDirectusImage
                fileId={item.fileId}
                alt={item.alt || `Thumbnail ${index + 1}`}
                width={150}
                height={100}
                showLoadingSpinner={true}
                loadingSpinnerSize="xsmall"
                loadingSpinnerColor={isSelected ? 'olive' : 'gray'}
              />
              
              {/* Loading indicator */}
              {!asset?.loaded && (
                <div className="absolute bottom-1 right-1 z-10">
                  <div className="bg-white bg-opacity-70 text-xs px-1 rounded-sm">
                    Loading...
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}