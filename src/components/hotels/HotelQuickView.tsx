// @ts-nocheck
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useFeatureInteraction } from '../../hooks/useFeatureInteraction';
import { HotelQuickViewData, HotelQuickViewProps } from '../../types/advanced-ui';
import { cn } from '../../../lib/utils';

/**
 * HotelQuickView Component
 * 
 * A modal/popup component for displaying quick information about a hotel
 * including gallery, amenities, and room options
 */
export default function HotelQuickView({ 
  hotel,
  onClose,
  initialTab = 'gallery',
  isModal = true,
}: HotelQuickViewProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeImage, setActiveImage] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Set up feature interactions for each tab
  const tabInteractions = {
    gallery: useFeatureInteraction({
      featureId: 'quickview-tab-gallery',
      initialState: activeTab === 'gallery' ? 'active' : 'idle',
      tooltip: {
        enabled: true,
        position: 'top',
        text: 'View hotel images',
        showArrow: true,
      },
      onInteraction: (type) => {
        if (type === 'click') {
          setActiveTab('gallery');
        }
      }
    }),
    amenities: useFeatureInteraction({
      featureId: 'quickview-tab-amenities',
      initialState: activeTab === 'amenities' ? 'active' : 'idle',
      tooltip: {
        enabled: true,
        position: 'top',
        text: 'View hotel amenities',
        showArrow: true,
      },
      onInteraction: (type) => {
        if (type === 'click') {
          setActiveTab('amenities');
        }
      }
    }),
    rooms: useFeatureInteraction({
      featureId: 'quickview-tab-rooms',
      initialState: activeTab === 'rooms' ? 'active' : 'idle',
      tooltip: {
        enabled: true,
        position: 'top',
        text: 'View available rooms',
        showArrow: true,
      },
      onInteraction: (type) => {
        if (type === 'click') {
          setActiveTab('rooms');
        }
      }
    })
  };
  
  // Close button interaction
  const closeInteraction = useFeatureInteraction({
    featureId: 'quickview-close',
    tooltip: {
      enabled: true,
      position: 'left',
      text: 'Close quick view',
      showArrow: true,
    },
    onInteraction: (type) => {
      if (type === 'click') {
        handleClose();
      }
    }
  });
  
  // Set up the gallery image interactions
  const createImageInteractions = useCallback((imageCount: number) => {
    return Array.from({ length: imageCount }).map((_, index) => 
      useFeatureInteraction({
        featureId: `gallery-image-${index}`,
        initialState: activeImage === index ? 'active' : 'idle',
        onInteraction: (type) => {
          if (type === 'click') {
            setActiveImage(index);
          }
        },
      })
    );
  }, [activeImage]);

  // Fallback hotel data
  const defaultHotel: HotelQuickViewData = {
    name: 'Example Hotel',
    location: 'Example Location',
    description: 'This is a placeholder description for the hotel.',
    images: [
      '/images/hotels/hotel-1.jpg',
      '/images/hotels/hotel-2.jpg',
      '/images/hotels/hotel-3.jpg',
      '/images/hotels/hotel-4.jpg',
    ],
    amenities: [
      'Free WiFi',
      'Pool',
      'Spa',
      'Restaurant',
      'Room Service',
      'Fitness Center',
      'Concierge',
      'Business Center',
    ],
    rooms: [
      {
        type: 'Standard Room',
        description: 'Comfortable room with all essentials',
        price: '$200',
        capacity: 2,
        features: ['King bed', 'City view', 'Work desk'],
        image: '/images/hotels/hotel-2.jpg',
      },
      {
        type: 'Deluxe Room',
        description: 'Spacious room with premium amenities',
        price: '$300',
        capacity: 2,
        features: ['King bed', 'Mountain view', 'Seating area'],
        image: '/images/hotels/hotel-3.jpg',
      },
      {
        type: 'Junior Suite',
        description: 'Elegant suite with separate living area',
        price: '$450',
        capacity: 3,
        features: ['King bed', 'Panoramic view', 'Lounge area'],
        image: '/images/hotels/hotel-4.jpg',
      },
      {
        type: 'Executive Suite',
        description: 'Luxurious suite with premium services',
        price: '$650',
        capacity: 4,
        features: ['King bed', 'Valley view', 'Dining area', 'Jacuzzi'],
        image: '/images/hotels/hotel-5.jpg',
      },
    ],
  };
  
  // Use provided hotel or fallback
  const hotelData = hotel || defaultHotel;
  
  // Create image interactions based on hotel images
  const imageInteractions = createImageInteractions(hotelData.images.length);
  
  // Create room interactions
  const roomInteractions = hotelData.rooms.map((_, index) => 
    useFeatureInteraction({
      featureId: `room-${index}`,
      tooltip: {
        enabled: true,
        position: 'right',
        text: 'Click to view details',
        showArrow: true,
      },
      highlight: {
        enabled: true,
        effect: 'glow',
        duration: 600,
      },
    })
  );
  
  // Handle escape key for modal close
  useEffect(() => {
    if (!isModal) return;
    
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    window.addEventListener('keydown', handleEscapeKey);
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isModal]);
  
  // Trap focus within the modal for accessibility
  useEffect(() => {
    if (!isModal || !containerRef.current) return;
    
    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    // Set initial focus
    firstElement.focus();
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [isModal, activeTab]);
  
  // Close animation handling
  const handleClose = () => {
    if (!onClose) return;
    
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Duration of close animation
  };
  
  // Lazy loading optimization for tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'gallery':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={hotelData.images[activeImage]}
                    alt={`${hotelData.name} - Image ${activeImage + 1}`}
                    fill
                    className="object-cover"
                    priority={activeImage === 0}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {hotelData.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={cn(
                    "relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden transition-all",
                    activeImage === index 
                      ? "ring-2 ring-brand-olive-500 scale-105" 
                      : "opacity-70 hover:opacity-100"
                  )}
                  {...imageInteractions[index].getFeatureProps()}
                  aria-label={`View image ${index + 1}`}
                >
                  <Image
                    src={image}
                    alt={`${hotelData.name} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 'amenities':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 grid grid-cols-2 gap-4"
          >
            {hotelData.amenities.map((amenity, index) => (
              <motion.div 
                key={amenity} 
                className="flex items-center"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <svg className="h-5 w-5 text-brand-olive-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{amenity}</span>
              </motion.div>
            ))}
          </motion.div>
        );

      case 'rooms':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 space-y-4"
          >
            {hotelData.rooms.map((room, index) => (
              <motion.div 
                key={room.type} 
                className={cn(
                  "border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all",
                  roomInteractions[index].isHighlighted && "bg-brand-olive-50 border-brand-olive-200"
                )}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                {...roomInteractions[index].getFeatureProps()}
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{room.type}</h4>
                  <span className="text-lg text-brand-olive-600">{room.price}<span className="text-sm text-gray-500">/night</span></span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p>{room.description}</p>
                  <div className="flex space-x-4 mt-1">
                    <span>Up to {room.capacity} {room.capacity === 1 ? 'person' : 'people'}</span>
                    {room.features && (
                      <span className="line-clamp-1">
                        {room.features.slice(0, 2).join(', ')}
                        {room.features.length > 2 ? '...' : ''}
                      </span>
                    )}
                  </div>
                </div>
                
                {roomInteractions[index].isTooltipVisible && (
                  <div
                    {...roomInteractions[index].getTooltipProps()}
                    className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded z-10"
                  >
                    {roomInteractions[index].tooltip?.text}
                    <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (!hotel && !defaultHotel) return null;

  // Wrap in modal if isModal is true
  if (isModal) {
    return (
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        ref={containerRef}
      >
        <motion.div 
          ref={contentRef}
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isClosing ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Close button */}
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10"
            onClick={handleClose}
            {...closeInteraction.getFeatureProps()}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            
            {closeInteraction.isTooltipVisible && (
              <div
                {...closeInteraction.getTooltipProps()}
                className="absolute top-1/2 right-full transform -translate-y-1/2 mr-2 bg-gray-800 text-white text-xs py-1 px-2 rounded"
              >
                {closeInteraction.tooltip?.text}
                <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800" />
              </div>
            )}
          </button>
          
          {/* Hotel header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">{hotelData.name}</h2>
            {hotelData.location && (
              <p className="text-gray-600">{hotelData.location}</p>
            )}
          </div>
          
          {/* Quick view content */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 150px)' }}>
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                className={cn(
                  "px-4 py-2 text-sm font-medium relative",
                  activeTab === 'gallery' 
                    ? "text-brand-olive-600 border-b-2 border-brand-olive-500"
                    : "text-gray-500 hover:text-gray-700"
                )}
                {...tabInteractions.gallery.getFeatureProps()}
              >
                Gallery
                
                {tabInteractions.gallery.isTooltipVisible && (
                  <div
                    {...tabInteractions.gallery.getTooltipProps()}
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded z-10 whitespace-nowrap"
                  >
                    {tabInteractions.gallery.tooltip?.text}
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
                  </div>
                )}
              </button>
              
              <button
                className={cn(
                  "px-4 py-2 text-sm font-medium relative",
                  activeTab === 'amenities' 
                    ? "text-brand-olive-600 border-b-2 border-brand-olive-500"
                    : "text-gray-500 hover:text-gray-700"
                )}
                {...tabInteractions.amenities.getFeatureProps()}
              >
                Amenities
                
                {tabInteractions.amenities.isTooltipVisible && (
                  <div
                    {...tabInteractions.amenities.getTooltipProps()}
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded z-10 whitespace-nowrap"
                  >
                    {tabInteractions.amenities.tooltip?.text}
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
                  </div>
                )}
              </button>
              
              <button
                className={cn(
                  "px-4 py-2 text-sm font-medium relative",
                  activeTab === 'rooms' 
                    ? "text-brand-olive-600 border-b-2 border-brand-olive-500"
                    : "text-gray-500 hover:text-gray-700"
                )}
                {...tabInteractions.rooms.getFeatureProps()}
              >
                Rooms
                
                {tabInteractions.rooms.isTooltipVisible && (
                  <div
                    {...tabInteractions.rooms.getTooltipProps()}
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded z-10 whitespace-nowrap"
                  >
                    {tabInteractions.rooms.tooltip?.text}
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
                  </div>
                )}
              </button>
            </div>

            {/* Tab content with AnimatePresence for smooth transitions */}
            <AnimatePresence mode="wait">
              {renderTabContent()}
            </AnimatePresence>
          </div>
          
          {/* Action footer */}
          <div className="p-4 border-t border-gray-200 flex justify-between items-center">
            <Link
              href={`/hotels/${hotelData.name?.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-brand-olive-600 hover:text-brand-olive-800 text-sm"
            >
              View Full Details
            </Link>
            
            <button
              className="bg-brand-olive-500 hover:bg-brand-olive-600 text-white px-5 py-2 rounded-md text-sm font-medium transition"
            >
              Book Now
            </button>
          </div>
        </motion.div>
      </div>
    );
  }
  
  // Non-modal version (embedded in page)
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      {/* Hotel header */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold">{hotelData.name}</h3>
        {hotelData.location && (
          <p className="text-gray-600">{hotelData.location}</p>
        )}
      </div>
      
      {/* Tabs */}
      <div className="px-6 pt-4">
        <div className="flex border-b border-gray-200">
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium",
              activeTab === 'gallery' 
                ? "text-brand-olive-600 border-b-2 border-brand-olive-500"
                : "text-gray-500 hover:text-gray-700"
            )}
            onClick={() => setActiveTab('gallery')}
            aria-selected={activeTab === 'gallery'}
          >
            Gallery
          </button>
          
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium",
              activeTab === 'amenities' 
                ? "text-brand-olive-600 border-b-2 border-brand-olive-500"
                : "text-gray-500 hover:text-gray-700"
            )}
            onClick={() => setActiveTab('amenities')}
            aria-selected={activeTab === 'amenities'}
          >
            Amenities
          </button>
          
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium",
              activeTab === 'rooms' 
                ? "text-brand-olive-600 border-b-2 border-brand-olive-500"
                : "text-gray-500 hover:text-gray-700"
            )}
            onClick={() => setActiveTab('rooms')}
            aria-selected={activeTab === 'rooms'}
          >
            Rooms
          </button>
        </div>
        
        {/* Tab content */}
        <div className="p-4">
          <AnimatePresence mode="wait">
            {renderTabContent()}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Action footer */}
      <div className="p-4 border-t border-gray-200 flex justify-between items-center">
        <Link
          href={`/hotels/${hotelData.name?.toLowerCase().replace(/\s+/g, '-')}`}
          className="text-brand-olive-600 hover:text-brand-olive-800 text-sm"
        >
          View Full Details
        </Link>
        
        <button
          className="bg-brand-olive-500 hover:bg-brand-olive-600 text-white px-5 py-2 rounded-md text-sm font-medium transition"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}