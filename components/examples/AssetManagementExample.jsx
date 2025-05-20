'use client';

import { useState } from 'react';
import { AssetManagerProvider } from '../common/AssetManager';
import ResponsiveDirectusImage from '../common/ResponsiveDirectusImage';
import AssetPreloader from '../common/AssetPreloader';
import LoadingSpinner from '../common/LoadingSpinner';
import AssetGalleryExample from './AssetGalleryExample';

/**
 * Asset Management Example Page
 * This component showcases the various features of the asset management system
 */
export default function AssetManagementExample() {
  const [activeTab, setActiveTab] = useState('responsive');
  
  // Example image IDs (replace with actual Directus asset IDs)
  const exampleImages = [
    {
      fileId: 'hotel-1.jpg',
      alt: 'Example Hotel 1',
    },
    {
      fileId: 'hotel-2.jpg',
      alt: 'Example Hotel 2',
    },
    {
      fileId: 'hotel-3.jpg',
      alt: 'Example Hotel 3',
    },
    {
      fileId: 'hotel-4.jpg',
      alt: 'Example Hotel 4',
    },
    {
      fileId: 'hotel-5.jpg',
      alt: 'Example Hotel 5',
    },
    {
      fileId: 'hotel-6.jpg',
      alt: 'Example Hotel 6',
    },
    {
      fileId: 'hotel-7.jpg',
      alt: 'Example Hotel 7',
    }
  ];
  
  // Hero images to preload
  const heroImages = [
    { id: 'hero-bg.jpg', type: 'image', options: { priority: true } },
    { id: 'logo.svg', type: 'image', options: { priority: true } }
  ];
  
  // Example loading states
  const loadingStates = [
    { progress: 25, label: '25% Complete', color: 'primary' },
    { progress: 50, label: '50% Complete', color: 'olive' },
    { progress: 75, label: '75% Complete', color: 'secondary' },
    { progress: 100, label: '100% Complete', color: 'olive' }
  ];
  
  return (
    <AssetManagerProvider>
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Asset Management System</h1>
        
        {/* Preload critical assets */}
        <AssetPreloader assets={heroImages} />
        
        {/* Tab Navigation */}
        <div className="mb-8 border-b">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('responsive')}
              className={`py-2 px-4 ${activeTab === 'responsive' ? 'border-b-2 border-brand-olive-600 font-medium' : 'text-gray-500'}`}
            >
              Responsive Images
            </button>
            <button
              onClick={() => setActiveTab('loading')}
              className={`py-2 px-4 ${activeTab === 'loading' ? 'border-b-2 border-brand-olive-600 font-medium' : 'text-gray-500'}`}
            >
              Loading States
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`py-2 px-4 ${activeTab === 'gallery' ? 'border-b-2 border-brand-olive-600 font-medium' : 'text-gray-500'}`}
            >
              Gallery Example
            </button>
          </nav>
        </div>
        
        {/* Responsive Images Tab */}
        {activeTab === 'responsive' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-4">Responsive Image Loading</h2>
              <p className="mb-6">
                The ResponsiveDirectusImage component automatically handles different screen sizes, 
                loading states, and optimizes image delivery.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Basic usage */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-bold mb-2">Basic Usage</h3>
                  <div className="h-48 bg-gray-100 rounded-md overflow-hidden">
                    <ResponsiveDirectusImage
                      fileId="hotel-1.jpg"
                      alt="Example hotel"
                      objectFit="cover"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Simple responsive image with default settings
                  </p>
                </div>
                
                {/* With custom dimensions */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-bold mb-2">Custom Dimensions</h3>
                  <div className="h-48 bg-gray-100 rounded-md overflow-hidden">
                    <ResponsiveDirectusImage
                      fileId="hotel-2.jpg"
                      alt="Example hotel"
                      width={400}
                      height={300}
                      objectFit="cover"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Image with specific dimensions (400x300)
                  </p>
                </div>
                
                {/* With priority loading */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-bold mb-2">Priority Loading</h3>
                  <div className="h-48 bg-gray-100 rounded-md overflow-hidden">
                    <ResponsiveDirectusImage
                      fileId="hotel-3.jpg"
                      alt="Example hotel"
                      priority={true}
                      objectFit="cover"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Image with priority loading for LCP
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}
        
        {/* Loading States Tab */}
        {activeTab === 'loading' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-4">Loading Spinner Variations</h2>
              <p className="mb-6">
                The LoadingSpinner component can be customized for different use cases.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Size variations */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-bold mb-2">Size Variations</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <LoadingSpinner size="xsmall" />
                      <span>XSmall</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <LoadingSpinner size="small" />
                      <span>Small</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <LoadingSpinner size="medium" />
                      <span>Medium</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <LoadingSpinner size="large" />
                      <span>Large</span>
                    </div>
                  </div>
                </div>
                
                {/* Color variations */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-bold mb-2">Color Variations</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <LoadingSpinner size="small" color="olive" />
                      <span>Olive</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <LoadingSpinner size="small" color="gray" />
                      <span>Gray</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <LoadingSpinner size="small" color="primary" />
                      <span>Primary</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <LoadingSpinner size="small" color="secondary" />
                      <span>Secondary</span>
                    </div>
                  </div>
                </div>
                
                {/* With labels */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-bold mb-2">With Labels</h3>
                  <div className="space-y-6">
                    <LoadingSpinner label="Loading..." />
                    <LoadingSpinner label="Please wait" color="primary" />
                  </div>
                </div>
                
                {/* With progress */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-bold mb-2">Progress Indication</h3>
                  <div className="space-y-8">
                    {loadingStates.map((state, index) => (
                      <LoadingSpinner
                        key={`progress-${index}`}
                        size="small"
                        label={state.label}
                        progress={state.progress}
                        color={state.color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
        
        {/* Gallery Example Tab */}
        {activeTab === 'gallery' && (
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Image Gallery Example</h2>
              <p className="mb-6">
                This example demonstrates how all the components work together in a practical implementation.
              </p>
              
              <AssetGalleryExample 
                galleryItems={exampleImages} 
                title="Hotel Gallery" 
                preloadAll={true}
              />
            </section>
          </div>
        )}
      </div>
    </AssetManagerProvider>
  );
}