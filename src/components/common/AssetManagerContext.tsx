'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AssetCacheItem {
  loaded: boolean;
  error: boolean;
  url: string;
  type: string;
  element?: HTMLImageElement | HTMLVideoElement | HTMLAudioElement;
}

interface AssetCache {
  [key: string]: AssetCacheItem;
}

interface AssetOptions {
  priority?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

interface AssetManagerContextType {
  assetCache: AssetCache;
  preloadAsset: (id: string, type: string, options?: AssetOptions) => void;
  isAssetLoaded: (id: string) => boolean;
  getAssetElement: (id: string) => HTMLElement | null;
  clearCache: () => void;
}

// Create a context
const AssetManagerContext = createContext<AssetManagerContextType | undefined>(undefined);

// Provider component
export function AssetManagerProvider({ children }: { children: ReactNode }) {
  // State to hold the cached assets
  const [assetCache, setAssetCache] = useState<AssetCache>({});

  // Function to preload an asset
  const preloadAsset = (id: string, type = 'image', options: AssetOptions = {}) => {
    // If asset is already in cache and loaded, just call onLoad callback if provided
    if (assetCache[id]?.loaded) {
      options.onLoad?.();
      return;
    }

    // Initialize the asset in cache if not present
    if (!assetCache[id]) {
      setAssetCache(prev => ({
        ...prev,
        [id]: {
          loaded: false,
          error: false,
          url: id,
          type,
        }
      }));
    }

    // Create appropriate element based on asset type
    let element;
    switch (type) {
      case 'image':
        element = new Image();
        element.src = id;
        element.onload = () => {
          setAssetCache(prev => ({
            ...prev,
            [id]: {
              ...prev[id],
              loaded: true,
              element
            }
          }));
          options.onLoad?.();
        };
        element.onerror = (error) => {
          setAssetCache(prev => ({
            ...prev,
            [id]: {
              ...prev[id],
              error: true
            }
          }));
          options.onError?.(error as unknown as Error);
        };
        break;
        
      case 'video':
        element = document.createElement('video');
        element.src = id;
        element.preload = 'auto';
        element.onloadeddata = () => {
          setAssetCache(prev => ({
            ...prev,
            [id]: {
              ...prev[id],
              loaded: true,
              element
            }
          }));
          options.onLoad?.();
        };
        element.onerror = (error) => {
          setAssetCache(prev => ({
            ...prev,
            [id]: {
              ...prev[id],
              error: true
            }
          }));
          options.onError?.(error as unknown as Error);
        };
        break;
        
      case 'audio':
        element = document.createElement('audio');
        element.src = id;
        element.preload = 'auto';
        element.onloadeddata = () => {
          setAssetCache(prev => ({
            ...prev,
            [id]: {
              ...prev[id],
              loaded: true,
              element
            }
          }));
          options.onLoad?.();
        };
        element.onerror = (error) => {
          setAssetCache(prev => ({
            ...prev,
            [id]: {
              ...prev[id],
              error: true
            }
          }));
          options.onError?.(error as unknown as Error);
        };
        break;
        
      default:
        console.warn(`Unsupported asset type: ${type}`);
        return;
    }

    // Store the element in cache
    setAssetCache(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        element
      }
    }));
  };

  // Function to check if an asset is loaded
  const isAssetLoaded = (id: string) => {
    return assetCache[id]?.loaded || false;
  };

  // Function to get the asset element
  const getAssetElement = (id: string) => {
    return assetCache[id]?.element || null;
  };

  // Function to clear the cache
  const clearCache = () => {
    setAssetCache({});
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Cleanup any resources if needed
    };
  }, []);

  // The context value
  const contextValue: AssetManagerContextType = {
    assetCache,
    preloadAsset,
    isAssetLoaded,
    getAssetElement,
    clearCache
  };

  return (
    <AssetManagerContext.Provider value={contextValue}>
      {children}
    </AssetManagerContext.Provider>
  );
}

// Custom hook to use the asset manager
export function useAssetManager() {
  const context = useContext(AssetManagerContext);
  if (context === undefined) {
    throw new Error('useAssetManager must be used within an AssetManagerProvider');
  }
  return context;
}