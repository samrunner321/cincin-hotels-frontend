'use client';

import { useState } from 'react';
import { ResponsiveDirectusImage, LoadingSpinner } from '../common';
import { AssetManagerProvider } from '../common/AssetManager';

/**
 * DemoAssetGallery
 * A standalone demo component to showcase the asset management system
 * This works without requiring Directus API access
 */
export default function DemoAssetGallery() {
  const [activeTab, setActiveTab] = useState('images');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Example local images (from public folder)
  const localImages = [
    '/images/hotels/hotel-1.jpg',
    '/images/hotels/hotel-2.jpg',
    '/images/hotels/hotel-3.jpg',
    '/images/hotels/hotel-4.jpg',
    '/images/hotels/hotel-5.jpg',
    '/images/hotels/hotel-6.jpg',
  ];
  
  // Example loading spinner states
  const spinnerSizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'];
  const spinnerColors = ['olive', 'gray', 'white', 'primary', 'secondary'];
  
  return (
    <AssetManagerProvider>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Asset Management Demo</h1>
        
        {/* Tab navigation */}
        <div className="flex border-b mb-8">
          <button 
            className={`px-4 py-2 ${activeTab === 'images' ? 'border-b-2 border-brand-olive-600 font-semibold' : ''}`}
            onClick={() => setActiveTab('images')}
          >
            Responsive Images
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'spinners' ? 'border-b-2 border-brand-olive-600 font-semibold' : ''}`}
            onClick={() => setActiveTab('spinners')}
          >
            Loading Spinners
          </button>
        </div>
        
        {/* Images Tab */}
        {activeTab === 'images' && (
          <div className="space-y-12">
            {/* Main gallery view */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-semibold mb-6">Image Gallery</h2>
              
              {/* Main image display */}
              <div className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden mb-6">
                <ResponsiveDirectusImage
                  fileId={localImages[selectedImageIndex]}
                  alt={`Featured Image ${selectedImageIndex + 1}`}
                  priority={true}
                  objectFit="contain"
                  className="w-full h-full"
                />
              </div>
              
              {/* Thumbnails */}
              <div className="grid grid-cols-6 gap-4">
                {localImages.map((img, idx) => (
                  <button
                    key={idx}
                    className={`relative aspect-square rounded-md overflow-hidden hover:opacity-90 ${idx === selectedImageIndex ? 'ring-2 ring-brand-olive-600' : 'opacity-80'}`}
                    onClick={() => setSelectedImageIndex(idx)}
                  >
                    <ResponsiveDirectusImage
                      fileId={img}
                      alt={`Thumbnail ${idx + 1}`}
                      showLoadingSpinner={true}
                      loadingSpinnerSize="xsmall"
                      className="w-full h-full"
                      objectFit="cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Image grid examples */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-semibold mb-6">Image Grid</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {localImages.map((img, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="aspect-[4/3] rounded-lg overflow-hidden">
                      <ResponsiveDirectusImage
                        fileId={img}
                        alt={`Gallery Image ${idx + 1}`}
                        className="w-full h-full"
                        objectFit="cover"
                      />
                    </div>
                    <p className="text-sm text-gray-600">Image {idx + 1} with optimized loading</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Spinners Tab */}
        {activeTab === 'spinners' && (
          <div className="space-y-12">
            {/* Size variations */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-semibold mb-6">Spinner Sizes</h2>
              
              <div className="flex flex-wrap gap-8">
                {spinnerSizes.map(size => (
                  <div key={size} className="flex flex-col items-center space-y-2">
                    <LoadingSpinner size={size} />
                    <span className="text-sm">{size}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Color variations */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-semibold mb-6">Spinner Colors</h2>
              
              <div className="flex flex-wrap gap-8">
                {spinnerColors.map(color => (
                  <div key={color} className="flex flex-col items-center space-y-2">
                    <LoadingSpinner size="medium" color={color} />
                    <span className="text-sm">{color}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* With progress */}
            <div className="bg-white rounded-xl p-6 shadow-md">
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
            </div>
            
            {/* Overlay example */}
            <div className="bg-white rounded-xl p-6 shadow-md">
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
            </div>
          </div>
        )}
      </div>
    </AssetManagerProvider>
  );
}