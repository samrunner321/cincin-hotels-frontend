'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getAssetURL, getTransformedImageUrl } from './directus-client';

/**
 * Asset Manager Context
 * Provides functionality for loading, caching, and optimizing assets
 */
const AssetManagerContext = createContext();

/**
 * Asset Manager Provider
 * Provides asset management functionality to the entire application
 */
export function AssetManagerProvider({ children }) {
  const [assetCache, setAssetCache] = useState({});
  const [preloadQueue, setPreloadQueue] = useState([]);
  const [loading, setLoading] = useState({});

  // Process the preload queue
  useEffect(() => {
    if (preloadQueue.length === 0) return;

    const processQueue = async () => {
      const currentItem = preloadQueue[0];
      
      if (!currentItem || assetCache[currentItem.id]) {
        // Remove from queue if already cached or invalid
        setPreloadQueue((prev) => prev.slice(1));
        return;
      }

      setLoading((prev) => ({ ...prev, [currentItem.id]: true }));

      try {
        // For images, we preload by creating a new Image object
        if (currentItem.type === 'image') {
          const img = new Image();
          img.src = getAssetURL(currentItem.id);
          
          img.onload = () => {
            setAssetCache((prev) => ({ 
              ...prev, 
              [currentItem.id]: { 
                loaded: true, 
                url: img.src,
                type: 'image',
                width: img.width,
                height: img.height
              } 
            }));
            setLoading((prev) => ({ ...prev, [currentItem.id]: false }));
            setPreloadQueue((prev) => prev.slice(1)); // Remove from queue
          };
          
          img.onerror = () => {
            setAssetCache((prev) => ({ 
              ...prev, 
              [currentItem.id]: { 
                loaded: false, 
                error: true 
              } 
            }));
            setLoading((prev) => ({ ...prev, [currentItem.id]: false }));
            setPreloadQueue((prev) => prev.slice(1)); // Remove from queue
          };
        } else {
          // For other asset types (could implement for videos, etc.)
          setAssetCache((prev) => ({ 
            ...prev, 
            [currentItem.id]: { 
              loaded: true, 
              url: getAssetURL(currentItem.id),
              type: currentItem.type
            } 
          }));
          setLoading((prev) => ({ ...prev, [currentItem.id]: false }));
          setPreloadQueue((prev) => prev.slice(1)); // Remove from queue
        }
      } catch (error) {
        console.error('Error preloading asset:', error);
        setAssetCache((prev) => ({ 
          ...prev, 
          [currentItem.id]: { 
            loaded: false, 
            error: true 
          } 
        }));
        setLoading((prev) => ({ ...prev, [currentItem.id]: false }));
        setPreloadQueue((prev) => prev.slice(1)); // Remove from queue
      }
    };

    processQueue();
  }, [preloadQueue, assetCache]);

  /**
   * Preload an asset
   * @param {string} assetId - The Directus asset ID
   * @param {string} type - The asset type ('image', 'video', etc.)
   * @param {Object} options - Additional options for preloading
   */
  const preloadAsset = (assetId, type = 'image', options = {}) => {
    if (!assetId) return;
    
    // Skip if already in cache or queue
    if (assetCache[assetId] || preloadQueue.some(item => item.id === assetId)) {
      return;
    }
    
    setPreloadQueue((prev) => [...prev, { id: assetId, type, options }]);
  };

  /**
   * Get an asset from the cache or load it if not cached
   * @param {string} assetId - The Directus asset ID
   * @param {Object} options - Additional options for loading
   */
  const getAsset = (assetId, options = {}) => {
    if (!assetId) return null;
    
    // Return from cache if available
    if (assetCache[assetId] && assetCache[assetId].loaded) {
      return assetCache[assetId];
    }
    
    // Start loading if not already loading
    if (!loading[assetId]) {
      preloadAsset(assetId, options.type || 'image', options);
    }
    
    // Return loading state
    return { 
      loaded: false, 
      loading: true,
      id: assetId
    };
  };

  /**
   * Get a transformed image URL
   * @param {string} assetId - The Directus asset ID
   * @param {Object} options - Transformation options (width, height, etc.)
   */
  const getTransformedAsset = (assetId, options = {}) => {
    if (!assetId) return null;
    
    return {
      url: getTransformedImageUrl(assetId, options),
      id: assetId,
      type: 'image',
      transformed: true,
      ...options
    };
  };

  /**
   * Check if an asset is currently loading
   * @param {string} assetId - The Directus asset ID
   */
  const isAssetLoading = (assetId) => {
    return loading[assetId] || false;
  };

  /**
   * Clear the asset cache
   * @param {string} assetId - Optional specific asset ID to clear
   */
  const clearAssetCache = (assetId) => {
    if (assetId) {
      setAssetCache((prev) => {
        const newCache = { ...prev };
        delete newCache[assetId];
        return newCache;
      });
    } else {
      setAssetCache({});
    }
  };

  // Context value to provide
  const value = {
    preloadAsset,
    getAsset,
    getTransformedAsset,
    isAssetLoading,
    clearAssetCache,
    assetCache,
  };

  return (
    <AssetManagerContext.Provider value={value}>
      {children}
    </AssetManagerContext.Provider>
  );
}

/**
 * Hook to use the asset manager
 */
export function useAssetManager() {
  const context = useContext(AssetManagerContext);
  
  if (!context) {
    throw new Error('useAssetManager must be used within an AssetManagerProvider');
  }
  
  return context;
}

/**
 * Default export for the provider
 */
export default AssetManagerProvider;