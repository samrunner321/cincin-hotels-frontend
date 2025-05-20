/**
 * useAssetLoading Hook
 * 
 * A custom hook for handling asset loading and management in CinCin Hotels application.
 * Provides state management for loading, preloading, caching, and error handling of images and media assets.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { Asset, LoadingState } from '../types/advanced-ui';

interface AssetLoadingOptions {
  /** Initial array of assets */
  initialAssets?: Asset[];
  
  /** Enable preloading of assets */
  enablePreloading?: boolean;
  
  /** Number of assets to preload ahead */
  preloadCount?: number;
  
  /** Enable caching of loaded assets */
  enableCaching?: boolean;
  
  /** Cache timeout in milliseconds */
  cacheTimeout?: number;
  
  /** Callback when an asset fails to load */
  onAssetError?: (asset: Asset, error: Error) => void;
}

interface AssetLoadingResult {
  /** Current assets */
  assets: Asset[];
  
  /** Currently loading state for each asset */
  loadingStates: Record<string, LoadingState>;
  
  /** Overall loading progress (0-100) */
  loadingProgress: number;
  
  /** Set new assets */
  setAssets: (assets: Asset[]) => void;
  
  /** Preload a specific asset */
  preloadAsset: (assetId: string) => Promise<void>;
  
  /** Preload all assets */
  preloadAllAssets: () => Promise<void>;
  
  /** Check if an asset is loaded */
  isAssetLoaded: (assetId: string) => boolean;
  
  /** Get loading state for an asset */
  getAssetLoadingState: (assetId: string) => LoadingState;
  
  /** Get cached asset URL */
  getCachedAssetUrl: (assetId: string) => string | null;
  
  /** Clear asset cache */
  clearCache: () => void;
}

/**
 * A hook that provides asset loading and management functionality
 */
export function useAssetLoading({
  initialAssets = [],
  enablePreloading = true,
  preloadCount = 2,
  enableCaching = true,
  cacheTimeout = 3600000, // 1 hour
  onAssetError,
}: AssetLoadingOptions = {}): AssetLoadingResult {
  // Assets state
  const [assets, setAssetsState] = useState<Asset[]>(initialAssets);
  
  // Loading states for each asset
  const [loadingStates, setLoadingStates] = useState<Record<string, LoadingState>>({});
  
  // Loading progress
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  
  // Cache for loaded assets
  const assetCacheRef = useRef<Record<string, { url: string; timestamp: number }>>({});
  
  // Total number of assets for progress calculation
  const totalAssetsRef = useRef<number>(initialAssets.length);
  const loadedAssetsCountRef = useRef<number>(0);
  
  // Update total assets count when assets change
  useEffect(() => {
    totalAssetsRef.current = assets.length;
    
    // Initialize loading states for new assets
    const newLoadingStates = { ...loadingStates };
    assets.forEach(asset => {
      if (!newLoadingStates[asset.id]) {
        newLoadingStates[asset.id] = 'idle';
      }
    });
    
    setLoadingStates(newLoadingStates);
  }, [assets, loadingStates]);
  
  // Update loading progress
  const updateLoadingProgress = useCallback(() => {
    if (totalAssetsRef.current === 0) {
      setLoadingProgress(100);
      return;
    }
    
    const progress = Math.floor((loadedAssetsCountRef.current / totalAssetsRef.current) * 100);
    setLoadingProgress(progress);
  }, []);
  
  // Set assets with validation
  const setAssets = useCallback((newAssets: Asset[]) => {
    // Reset loading count
    loadedAssetsCountRef.current = 0;
    totalAssetsRef.current = newAssets.length;
    
    // Reset loading states for new assets
    const newLoadingStates: Record<string, LoadingState> = {};
    newAssets.forEach(asset => {
      // Keep existing loading state if available
      if (loadingStates[asset.id]) {
        newLoadingStates[asset.id] = loadingStates[asset.id];
        
        // Count already loaded assets
        if (loadingStates[asset.id] === 'success') {
          loadedAssetsCountRef.current++;
        }
      } else {
        newLoadingStates[asset.id] = 'idle';
      }
    });
    
    setLoadingStates(newLoadingStates);
    setAssetsState(newAssets);
    updateLoadingProgress();
  }, [loadingStates, updateLoadingProgress]);
  
  // Update loading state for an asset
  const updateAssetLoadingState = useCallback((assetId: string, state: LoadingState) => {
    setLoadingStates(prev => ({
      ...prev,
      [assetId]: state,
    }));
    
    // Update loaded count if success
    if (state === 'success') {
      loadedAssetsCountRef.current++;
      updateLoadingProgress();
    }
  }, [updateLoadingProgress]);
  
  // Preload a specific asset
  const preloadAsset = useCallback(async (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;
    
    // Skip if already loaded or loading
    if (loadingStates[assetId] === 'loading' || loadingStates[assetId] === 'success') {
      return;
    }
    
    // Check cache first if enabled
    if (enableCaching && assetCacheRef.current[assetId]) {
      const cachedAsset = assetCacheRef.current[assetId];
      const now = Date.now();
      
      // Use cache if not expired
      if (now - cachedAsset.timestamp < cacheTimeout) {
        updateAssetLoadingState(assetId, 'success');
        return;
      }
    }
    
    // Start loading
    updateAssetLoadingState(assetId, 'loading');
    
    try {
      // Create a promise that resolves when the image is loaded
      const promise = new Promise<void>((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => {
          // Update cache if enabled
          if (enableCaching) {
            assetCacheRef.current[assetId] = {
              url: asset.url,
              timestamp: Date.now(),
            };
          }
          
          updateAssetLoadingState(assetId, 'success');
          resolve();
        };
        
        img.onerror = (error) => {
          updateAssetLoadingState(assetId, 'error');
          
          if (onAssetError) {
            onAssetError(asset, error as unknown as Error);
          }
          
          reject(error);
        };
        
        img.src = asset.url;
      });
      
      await promise;
    } catch (error) {
      // Error is already handled in the image onError callback
    }
  }, [assets, loadingStates, updateAssetLoadingState, enableCaching, cacheTimeout, onAssetError]);
  
  // Preload all assets
  const preloadAllAssets = useCallback(async () => {
    // Create an array of promises for all assets
    const promises = assets.map(asset => preloadAsset(asset.id));
    
    // Wait for all assets to load
    await Promise.all(promises);
  }, [assets, preloadAsset]);
  
  // Check if an asset is loaded
  const isAssetLoaded = useCallback((assetId: string) => {
    return loadingStates[assetId] === 'success';
  }, [loadingStates]);
  
  // Get loading state for an asset
  const getAssetLoadingState = useCallback((assetId: string) => {
    return loadingStates[assetId] || 'idle';
  }, [loadingStates]);
  
  // Get cached asset URL
  const getCachedAssetUrl = useCallback((assetId: string) => {
    if (!enableCaching || !assetCacheRef.current[assetId]) {
      return null;
    }
    
    const cachedAsset = assetCacheRef.current[assetId];
    const now = Date.now();
    
    // Return null if cache is expired
    if (now - cachedAsset.timestamp >= cacheTimeout) {
      return null;
    }
    
    return cachedAsset.url;
  }, [enableCaching, cacheTimeout]);
  
  // Clear asset cache
  const clearCache = useCallback(() => {
    assetCacheRef.current = {};
  }, []);
  
  // Preload assets when they change
  useEffect(() => {
    if (!enablePreloading || assets.length === 0) {
      return;
    }
    
    // Find assets to preload
    const assetsToPreload: Asset[] = [];
    
    // Find first idle asset
    const firstIdleIndex = assets.findIndex(asset => 
      loadingStates[asset.id] === 'idle' || !loadingStates[asset.id]
    );
    
    if (firstIdleIndex !== -1) {
      // Preload this asset and the next few
      for (let i = 0; i < preloadCount && i + firstIdleIndex < assets.length; i++) {
        const asset = assets[i + firstIdleIndex];
        if (loadingStates[asset.id] !== 'success' && loadingStates[asset.id] !== 'loading') {
          assetsToPreload.push(asset);
        }
      }
    }
    
    // Preload the selected assets
    assetsToPreload.forEach(asset => {
      preloadAsset(asset.id);
    });
  }, [assets, loadingStates, enablePreloading, preloadCount, preloadAsset]);
  
  return {
    assets,
    loadingStates,
    loadingProgress,
    setAssets,
    preloadAsset,
    preloadAllAssets,
    isAssetLoaded,
    getAssetLoadingState,
    getCachedAssetUrl,
    clearCache,
  };
}