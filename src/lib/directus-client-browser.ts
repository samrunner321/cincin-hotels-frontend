/**
 * Browser-safe version of the Directus client
 * This file doesn't use fs or other Node.js-specific modules
 */

import { createDirectus, rest, staticToken } from '@directus/sdk';

// Simple types for the most commonly used items
interface BaseItem {
  id: string;
  status?: string;
  name?: string;
  slug?: string;
}

interface Schema {
  hotels: BaseItem[];
  destinations: BaseItem[];
  categories: BaseItem[];
}

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

// Safe placeholder for token
const getPublicToken = () => process.env.NEXT_PUBLIC_DIRECTUS_TOKEN || '';

// Create a browser-safe client
export const directusClient = createDirectus<Schema>(DIRECTUS_URL)
  .with(rest())
  .with(staticToken(getPublicToken()));

/**
 * Function to get asset URL from Directus file ID
 */
export function getAssetUrl(fileId: string): string {
  if (!fileId) return '';
  
  // Handle local paths
  if (fileId.startsWith('/')) {
    return fileId;
  }
  
  return `${DIRECTUS_URL}/assets/${fileId}`;
}

/**
 * Generate transformed image URL
 */
export function getTransformedImageUrl(fileId: string, options: {
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill';
  quality?: number;
  format?: string;
}): string {
  if (!fileId) return '';
  
  // Handle local paths
  if (fileId.startsWith('/')) {
    return fileId;
  }
  
  const { width, height, fit, quality, format } = options;
  const baseUrl = `${DIRECTUS_URL}/assets/${fileId}`;
  const params = new URLSearchParams();
  
  if (width) params.append('width', width.toString());
  if (height) params.append('height', height.toString());
  if (fit) params.append('fit', fit);
  if (quality) params.append('quality', quality.toString());
  if (format) params.append('format', format);
  
  return `${baseUrl}?${params.toString()}`;
}