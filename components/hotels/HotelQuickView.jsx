'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { getHotelImage } from './HotelCard';

export default function HotelQuickView({ hotel }) {
  const [activeTab, setActiveTab] = useState('gallery');
  const [activeImage, setActiveImage] = useState(0);

  if (!hotel) return null;

  // Sample gallery images (in a real app, these would come from the hotel data)
  const galleryImages = [
    { url: getHotelImage(hotel.slug), alt: 'Hotel exterior' },
    { url: '/images/hotels/room-1.jpg', alt: 'Hotel room' },
    { url: '/images/hotels/restaurant-1.jpg', alt: 'Hotel restaurant' },
    { url: '/images/hotels/amenity-1.jpg', alt: 'Hotel amenities' },
  ];

  // Sample amenities (in a real app, these would come from the hotel data)
  const amenities = [
    'Free WiFi',
    'Pool',
    'Spa',
    'Restaurant',
    'Room Service',
    'Fitness Center',
    'Concierge',
    'Business Center',
  ];

  // Sample rooms (in a real app, these would come from the hotel data)
  const rooms = [
    { name: 'Standard Room', price: '$200', occupancy: '2 Adults', size: '30m²' },
    { name: 'Deluxe Room', price: '$300', occupancy: '2 Adults', size: '40m²' },
    { name: 'Junior Suite', price: '$450', occupancy: '3 Adults', size: '55m²' },
    { name: 'Executive Suite', price: '$650', occupancy: '4 Adults', size: '75m²' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'gallery':
        return (
          <div className="mt-6">
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
                    src={galleryImages[activeImage].url}
                    alt={galleryImages[activeImage].alt}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {galleryImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden ${
                    activeImage === index ? 'ring-2 ring-brand-olive-500' : 'opacity-70'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        );

      case 'amenities':
        return (
          <div className="mt-6 grid grid-cols-2 gap-4">
            {amenities.map((amenity) => (
              <div key={amenity} className="flex items-center">
                <svg className="h-5 w-5 text-brand-olive-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        );

      case 'rooms':
        return (
          <div className="mt-6 space-y-4">
            {rooms.map((room) => (
              <div key={room.name} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{room.name}</h4>
                  <span className="text-lg text-brand-olive-600">{room.price}<span className="text-sm text-gray-500">/night</span></span>
                </div>
                <div className="mt-2 text-sm text-gray-600 flex space-x-4">
                  <span>{room.occupancy}</span>
                  <span>•</span>
                  <span>{room.size}</span>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="pt-4">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'gallery' 
              ? 'text-brand-olive-600 border-b-2 border-brand-olive-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Gallery
        </button>
        <button
          onClick={() => setActiveTab('amenities')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'amenities' 
              ? 'text-brand-olive-600 border-b-2 border-brand-olive-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Amenities
        </button>
        <button
          onClick={() => setActiveTab('rooms')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'rooms' 
              ? 'text-brand-olive-600 border-b-2 border-brand-olive-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Rooms
        </button>
      </div>

      {/* Tab content */}
      {renderTabContent()}
    </div>
  );
}