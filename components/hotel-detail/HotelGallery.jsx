'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function HotelGallery({ 
  images = [
    '/images/hotels/hotel-1.jpg',
    '/images/hotels/hotel-2.jpg',
    '/images/hotels/hotel-3.jpg',
    '/images/hotels/hotel-4.jpg',
    '/images/hotels/hotel-5.jpg',
    '/images/hotels/hotel-6.jpg'
  ]
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const slideRef = useRef(null);
  
  // Autoplay functionality
  useEffect(() => {
    // Only autoplay if not in lightbox mode
    if (lightboxOpen) return;
    
    const interval = setInterval(() => {
      nextImage();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [lightboxOpen]);
  
  // Functions for navigation and touch events
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
  
  // Track image load status
  const handleImageLoaded = (index) => {
    setImagesLoaded(prev => ({
      ...prev,
      [index]: true
    }));
  };
  
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
    <section id="gallery" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-light">Gallery</h2>
          <button 
            onClick={() => openLightbox(activeIndex)}
            className="text-gray-800 hover:text-black transition-colors flex items-center gap-2 border border-gray-300 hover:border-black rounded-full px-4 py-2"
          >
            View all photos
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Main Gallery Carousel */}
        <div 
          className="relative overflow-hidden rounded-xl h-[400px] md:h-[600px] mb-4 bg-gray-100 shadow-md" 
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
                {!imagesLoaded[index] && (
                  <div className="absolute inset-0 flex items-center justify-center z-20 bg-gray-100">
                    <div className="animate-spin h-12 w-12 border-4 border-gray-300 rounded-full border-t-black"></div>
                  </div>
                )}
                <img
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onLoad={() => handleImageLoaded(index)}
                  loading={index === activeIndex ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>
          
          {/* Navigation Arrows */}
          <button 
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/30 hover:bg-white/60 backdrop-blur-sm rounded-full p-3 text-black shadow-lg transition-all focus:outline-none"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/30 hover:bg-white/60 backdrop-blur-sm rounded-full p-3 text-black shadow-lg transition-all focus:outline-none"
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
                    ? 'bg-white w-6' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Thumbnail Gallery */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-4">
          {images.slice(0, 6).map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative overflow-hidden rounded-lg aspect-[4/3] ${
                index === activeIndex ? 'ring-2 ring-black' : 'opacity-70 hover:opacity-100'
              } transition-all bg-gray-100`}
              aria-label={`View gallery image ${index + 1}`}
            >
              <img
                src={image}
                alt={`Gallery thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
      
      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          >
            <button 
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-50"
              aria-label="Close lightbox"
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-50"
              aria-label="Previous image"
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full max-w-5xl max-h-[90vh] mx-auto px-12"
            >
              <img
                src={images[activeIndex]}
                alt={`Gallery image ${activeIndex + 1}`}
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                {activeIndex + 1} / {images.length}
              </div>
            </motion.div>
            
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-50"
              aria-label="Next image"
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}