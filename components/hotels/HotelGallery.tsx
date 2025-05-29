'use client';

import Image from 'next/image';
import { useState } from 'react';

interface GalleryImage {
  id: number;
  image?: string;
  image_url?: string;
  title?: string;
  alt_text?: string;
  is_hero?: boolean;
  sort_order?: number;
}

interface HotelGalleryProps {
  gallery: GalleryImage[];
  hotelName: string;
}

export default function HotelGallery({ gallery, hotelName }: HotelGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Directus base URL
  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

  // Sort gallery by sort_order and filter out items without images
  const sortedGallery = gallery
    .filter(item => item.image || item.image_url)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  // If no images, show placeholder
  if (sortedGallery.length === 0) {
    return (
      <section id="gallery" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-light text-center mb-2">Gallery</h2>
          <div className="w-16 h-0.5 bg-[#93A27F] mx-auto mb-8"></div>
          <div className="text-center text-gray-500">
            <p>No images available for this hotel yet.</p>
          </div>
        </div>
      </section>
    );
  }

  // Get image URL - prioritize image UUID over image_url
  const getImageUrl = (item: GalleryImage) => {
    if (item.image) {
      return `${directusUrl}/assets/${item.image}`;
    }
    return item.image_url || '/images/placeholder.jpg';
  };

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev - 1 + sortedGallery.length) % sortedGallery.length);
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % sortedGallery.length);
  };

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const currentImage = sortedGallery[selectedIndex];

  return (
    <>
      <section id="gallery" className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-light text-center mb-2">Gallery</h2>
          <div className="w-16 h-0.5 bg-[#93A27F] mx-auto mb-8"></div>

          {/* Main Image Display */}
          <div className="relative aspect-[16/11] md:aspect-[21/12] overflow-hidden rounded-2xl mb-6 cursor-pointer group"
               onClick={() => openLightbox(selectedIndex)}>
            <Image
              src={getImageUrl(currentImage)}
              alt={currentImage.alt_text || currentImage.title || `${hotelName} - Image ${selectedIndex + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/hotel-1.jpg';
              }}
            />
            
            {/* Overlay for click indication only */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 right-4 text-white">
                <span className="text-sm">Click to enlarge</span>
              </div>
            </div>

            {/* Navigation arrows */}
            {sortedGallery.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Grid */}
          {sortedGallery.length > 1 && (
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {sortedGallery.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedIndex(index)}
                  className={`relative aspect-square overflow-hidden rounded-lg ${
                    index === selectedIndex
                      ? 'ring-2 ring-[#93A27F] ring-offset-2'
                      : 'opacity-70 hover:opacity-100'
                  } transition-all`}
                >
                  <Image
                    src={getImageUrl(item)}
                    alt={item.alt_text || item.title || `Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, (max-width: 1024px) 16vw, 12vw"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/hotel-1.jpg';
                    }}
                  />
                  {item.is_hero && (
                    <div className="absolute top-1 right-1 bg-[#93A27F] text-white text-xs px-2 py-1 rounded">
                      Hero
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
             onClick={closeLightbox}>
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
            aria-label="Close gallery"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative w-full h-full flex items-center justify-center p-4"
               onClick={(e) => e.stopPropagation()}>
            <Image
              src={getImageUrl(currentImage)}
              alt={currentImage.alt_text || currentImage.title || `${hotelName} - Image ${selectedIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/hotel-1.jpg';
              }}
            />

            {/* Lightbox navigation */}
            {sortedGallery.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all"
                  aria-label="Previous image"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all"
                  aria-label="Next image"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Image counter only */}
            <div className="absolute bottom-4 left-4 right-4 text-white text-center">
              <p className="text-sm opacity-80">
                {selectedIndex + 1} of {sortedGallery.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}