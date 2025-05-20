'use client';

import { AssetManagerProvider } from '../../src/components/common/AssetPreloader';
import AssetManagementExample from '../../src/components/examples/DemoAssetGallery';

export default function AssetTestPage() {
  return (
    <AssetManagerProvider>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Asset Management Test</h1>
        <AssetManagementExample />
      </div>
    </AssetManagerProvider>
  );
}