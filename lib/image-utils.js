// Image optimization utilities for Directus
const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

/**
 * Generate optimized image URL with Directus transformations
 * @param {string} imageId - Directus image ID
 * @param {Object} options - Transformation options
 * @returns {string} - Optimized image URL
 */
export function getOptimizedImageUrl(imageId, options = {}) {
  if (!imageId) return '';
  
  const {
    width,
    height,
    quality = 80,
    format = 'webp',
    fit = 'cover'
  } = options;
  
  const params = new URLSearchParams();
  
  if (width) params.append('width', width);
  if (height) params.append('height', height);
  params.append('quality', quality);
  params.append('format', format);
  params.append('fit', fit);
  
  return `${DIRECTUS_URL}/assets/${imageId}?${params.toString()}`;
}

/**
 * Generate srcSet for responsive images
 * @param {string} imageId - Directus image ID
 * @param {Array} widths - Array of widths for srcSet
 * @returns {string} - srcSet string
 */
export function generateSrcSet(imageId, widths = [640, 768, 1024, 1280, 1536]) {
  return widths
    .map(width => `${getOptimizedImageUrl(imageId, { width })} ${width}w`)
    .join(', ');
}

/**
 * Get blur data URL for placeholder
 * @param {string} imageId - Directus image ID
 * @returns {string} - Base64 blur placeholder
 */
export function getBlurDataUrl(imageId) {
  return getOptimizedImageUrl(imageId, {
    width: 10,
    quality: 10,
    format: 'webp'
  });
}

/**
 * Presets for common image sizes
 */
export const IMAGE_PRESETS = {
  thumbnail: { width: 150, height: 150 },
  card: { width: 400, height: 300 },
  hero: { width: 1920, height: 1080 },
  gallery: { width: 800, height: 600 },
  avatar: { width: 100, height: 100 }
};