'use client';

import { useEffect } from 'react';
import { useAssetManager } from './AssetManager';

/**
 * AssetPreloader Component
 * Preloads a list of assets when mounted
 */
export default function AssetPreloader({ 
  assets = [], 
  onComplete = () => {}, 
  autoPreload = true,
  priority = true
}) {
  const { preloadAsset, assetCache } = useAssetManager();
  
  // Check if all assets are loaded
  const allAssetsLoaded = assets.every(
    asset => assetCache[asset.id]?.loaded
  );
  
  useEffect(() => {
    // Trigger the onComplete callback when all assets are loaded
    if (allAssetsLoaded && assets.length > 0) {
      onComplete();
    }
  }, [allAssetsLoaded, assets, onComplete]);
  
  // Preload all assets when component mounts if autoPreload is true
  useEffect(() => {
    if (autoPreload && assets.length > 0) {
      assets.forEach(asset => {
        preloadAsset(
          asset.id, 
          asset.type || 'image', 
          { ...asset.options, priority }
        );
      });
    }
  }, [assets, autoPreload, preloadAsset, priority]);
  
  /**
   * Preload specific assets manually
   * @param {Array} assetList - List of assets to preload
   */
  const preloadAssets = (assetList) => {
    if (!assetList || assetList.length === 0) return;
    
    assetList.forEach(asset => {
      preloadAsset(
        asset.id, 
        asset.type || 'image', 
        { ...asset.options, priority: true }
      );
    });
  };
  
  return null; // This is a utility component, so it doesn't render anything
}