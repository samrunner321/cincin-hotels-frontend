'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export default function GallerySection({ 
  images = [
    '/images/hotels/hotel-1.jpg',
    '/images/hotels/hotel-2.jpg',
    '/images/hotels/hotel-3.jpg',
    '/images/hotels/hotel-4.jpg',
    '/images/hotels/hotel-5.jpg',
    '/images/hotels/hotel-6.jpg',
    '/images/hotels/hotel-7.jpg'
  ]
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const slideRef = useRef(null);

  // Funktionen für Navigation und Touch-Events bleiben unverändert
  
  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };
  
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    setTouchEnd(e.targetTouches[0].clientX);
    
    // Calculate swipe distance
    const distance = touchEnd - touchStart;
    
    // Apply a transform to the slide to follow finger movement
    if (slideRef.current && touchEnd !== 0) {
      const slideContainer = slideRef.current;
      slideContainer.style.transform = `translateX(${distance}px)`;
    }
  };
  
  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Reset transform
    if (slideRef.current) {
      slideRef.current.style.transform = '';
    }
    
    if (touchStart - touchEnd > 100) {
      // Swipe left, go to next image
      nextImage();
    }
    
    if (touchEnd - touchStart > 100) {
      // Swipe right, go to previous image
      prevImage();
    }
    
    // Reset touch positions
    setTouchStart(0);
    setTouchEnd(0);
  };
  
  // Autoplay functionality
  useEffect(() => {
    // Only autoplay if not in lightbox mode
    if (lightboxOpen) return;
    
    const interval = setInterval(() => {
      nextImage();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [lightboxOpen]);
  
  // Lightbox controls
  const openLightbox = (index) => {
    setActiveIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };
  
  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!lightboxOpen) return;
    
    if (e.key === 'ArrowRight') {
      nextImage();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    } else if (e.key === 'Escape') {
      closeLightbox();
    }
  };
  
  // Add/remove event listener for keyboard controls
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);
  
  return (
    <>
      <section id="gallery" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1536px]">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-brooklyn">Gallery</h2>
            <button 
              onClick={() => openLightbox(activeIndex)}
              className="text-brand-olive-400 hover:text-brand-olive-600 transition-colors flex items-center gap-2 font-brooklyn rounded-full px-4 py-2 border border-brand-olive-400 hover:bg-brand-olive-400 hover:text-white"
            >
              View all photos
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Main Gallery Carousel - HÖHE ERHÖHT */}
          <div 
            className="relative overflow-hidden rounded-2xl h-[400px] md:h-[650px] lg:h-[800px] mb-4 shadow-lg" 
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              ref={slideRef}
              className="w-full h-full transition-transform duration-500"
            >
              {images.map((image, index) => (
                <div 
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 1200px"
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
            
            {/* Navigation Arrows */}
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-3 text-white shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-brand-olive-400"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-3 text-white shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-brand-olive-400"
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Pagination Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeIndex 
                      ? 'bg-brand-olive-400 w-6' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Thumbnail Gallery - VOLLSTÄNDIG MIT EINDEUTIGEN BILDERN */}
          <div className="hidden md:grid grid-cols-8 gap-3 mt-2">
            {images.slice(0, 8).map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`relative overflow-hidden rounded-lg aspect-[4/3] max-w-[120px] ${
                  index === activeIndex ? 'ring-2 ring-brand-olive-400' : 'opacity-70 hover:opacity-100'
                } transition-all`}
                aria-label={`View gallery image ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`Hotel view ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 15vw, 8vw"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
          
          {/* Zusätzliche Thumbanils für mobile Geräte */}
          <div className="grid grid-cols-4 md:hidden gap-2 mt-2">
            {images.slice(0, 4).map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`relative overflow-hidden rounded-lg aspect-[1/1] ${
                  index === activeIndex ? 'ring-2 ring-brand-olive-400' : 'opacity-70 hover:opacity-100'
                } transition-all`}
                aria-label={`View gallery image ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`Hotel view ${index + 1}`}
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
          
          {/* Content Blocks with Images - Unverändert */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mt-16">
            {/* Block 1 - Traditional layout (image then text) */}
            <div className="flex flex-col">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6">
                <Image
                  src="/images/hotels/hotel-1.jpg"
                  alt="Elegant hotel restaurant with panoramic views"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-brooklyn mb-3">Exceptional Dining</h3>
              <p className="text-gray-700 font-brooklyn leading-relaxed mb-3">
                Our hotel restaurant offers a culinary journey through the flavors of the region, 
                using only the freshest local ingredients. Enjoy breakfast with mountain views, 
                casual lunches on the terrace, and exquisite dinners in our elegant dining room.
              </p>
              <p className="text-gray-700 font-brooklyn leading-relaxed">
                Our executive chef combines traditional techniques with innovative approaches to 
                create memorable dishes that reflect the essence of the local terroir. The wine 
                list features selections from nearby vineyards as well as international classics, 
                each chosen to perfectly complement the menu.
              </p>
            </div>
            
            {/* Block 2 - Reversed layout (text then image) */}
            <div className="flex flex-col">
              <h3 className="text-xl font-brooklyn mb-3">Wellness & Relaxation</h3>
              <p className="text-gray-700 font-brooklyn leading-relaxed mb-3">
                Immerse yourself in our tranquil spa sanctuary, where Alpine-inspired treatments 
                and modern wellness techniques combine to rejuvenate body and mind. Our heated 
                outdoor infinity pool offers breathtaking views of the surrounding landscape.
              </p>
              <p className="text-gray-700 font-brooklyn leading-relaxed mb-6">
                The wellness philosophy at our hotel is centered around connecting with the natural 
                environment while providing state-of-the-art facilities and expert care. From aromatic 
                massages using locally sourced botanicals to personalized fitness programs adapted to 
                all levels, our wellness offerings are designed to leave you feeling renewed and balanced.
              </p>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/images/hotels/hotel-2.jpg"
                  alt="Luxurious spa and wellness area with mountain views"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Lightbox - Unverändert */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <button 
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-50 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close lightbox"
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          
          <button 
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-50 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Previous image"
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="relative w-full h-full max-w-5xl max-h-[90vh] mx-auto px-12">
            <Image
              src={images[activeIndex]}
              alt={`Gallery image ${activeIndex + 1}`}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
            <div className="absolute bottom-4 left-0 right-0 text-center text-white font-brooklyn">
              {activeIndex + 1} / {images.length}
            </div>
          </div>
          
          <button 
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-50 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Next image"
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}