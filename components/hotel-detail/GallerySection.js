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
  ]
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const slideRef = useRef(null);
  
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
      <section id="gallery" className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-[1536px]">
          <div className="mb-12">
            <h2 className="text-3xl font-light text-center mb-2">Gallery</h2>
            <div className="w-16 h-0.5 bg-[#93A27F] mx-auto mb-8"></div>
            
            <div className="flex justify-center mb-8">
              <button 
                onClick={() => openLightbox(activeIndex)}
                className="text-[#93A27F] hover:text-[#7d8a6b] transition flex items-center"
              >
                <span>View all photos</span>
                <svg className="ml-2" width="25" height="9" viewBox="0 0 25 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24.3536 4.85355C24.5488 4.65829 24.5488 4.34171 24.3536 4.14645L21.1716 0.964466C20.9763 0.769204 20.6597 0.769204 20.4645 0.964466C20.2692 1.15973 20.2692 1.47631 20.4645 1.67157L23.2929 4.5L20.4645 7.32843C20.2692 7.52369 20.2692 7.84027 20.4645 8.03553C20.6597 8.2308 20.9763 8.2308 21.1716 8.03553L24.3536 4.85355ZM0 5H24V4H0V5Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Main Gallery Carousel */}
          <div 
            className="relative overflow-hidden rounded-2xl h-[400px] md:h-[550px] mb-4" 
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
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-2 text-white shadow transition"
              aria-label="Previous image"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-2 text-white shadow transition"
              aria-label="Next image"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                      ? 'bg-[#93A27F] w-6' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-4 md:grid-cols-6 gap-3 mt-2">
            {images.slice(0, 6).map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`relative overflow-hidden rounded-xl aspect-[4/3] ${
                  index === activeIndex ? 'ring-2 ring-[#93A27F]' : 'opacity-70 hover:opacity-100'
                } transition-all`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 25vw, 16vw"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
          
          {/* Content Blocks with Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            {/* Block 1 */}
            <div className="flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-4">
                <Image
                  src="/images/hotels/hotel-1.jpg"
                  alt="Hotel facilities"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-normal mb-3">Exceptional Dining</h3>
              <p className="text-gray-700 leading-relaxed">
                Our hotel restaurant offers a culinary journey through the flavors of the region, 
                using only the freshest local ingredients. Enjoy breakfast with mountain views, 
                casual lunches on the terrace, and exquisite dinners in our elegant dining room.
              </p>
            </div>
            
            {/* Block 2 */}
            <div className="flex flex-col">
              <h3 className="text-xl font-normal mb-3">Wellness & Relaxation</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Immerse yourself in our tranquil spa sanctuary, where Alpine-inspired treatments 
                and modern wellness techniques combine to rejuvenate body and mind. Our heated 
                outdoor infinity pool offers breathtaking views of the surrounding landscape.
              </p>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src="/images/hotels/hotel-2.jpg"
                  alt="Spa and wellness"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <button 
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full z-50"
            aria-label="Close lightbox"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button 
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full z-50"
            aria-label="Previous image"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              {activeIndex + 1} / {images.length}
            </div>
          </div>
          
          <button 
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full z-50"
            aria-label="Next image"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </>
  );
}