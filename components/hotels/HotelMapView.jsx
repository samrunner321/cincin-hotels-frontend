'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { getHotelImage } from './HotelCard';

export default function HotelMapView({ hotels = [], onHotelClick }) {
  const [hoveredHotel, setHoveredHotel] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!mapLoaded) {
    return (
      <div className="w-full h-full min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-brand-olive-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-500">Loading map view...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-full min-h-[600px] rounded-xl overflow-hidden">
      {/* Simple Map Background */}
      <div className="absolute inset-0 bg-[#f2f1eb]">
        <Image
          src="/images/map-background.jpg" 
          alt="Hotel locations map"
          fill
          className="object-cover opacity-50"
        />
      </div>
      
      {/* Hotel Markers */}
      {hotels.map((hotel) => {
        // In a real implementation, we'd use actual lat/lng coordinates
        // For this demo, we'll create pseudo-random positions based on hotel id
        const id = hotel.id || Math.random() * 1000;
        const randomX = ((id * 17) % 80) + 10; // 10-90% of width
        const randomY = ((id * 23) % 80) + 10; // 10-90% of height
        
        return (
          <div
            key={hotel.id}
            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${randomX}%`, top: `${randomY}%` }}
            onMouseEnter={() => setHoveredHotel(hotel)}
            onMouseLeave={() => setHoveredHotel(null)}
            onClick={() => onHotelClick(hotel)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: id % 10 * 0.1 }}
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                hoveredHotel?.id === hotel.id
                  ? 'bg-brand-olive-500 text-white'
                  : 'bg-white border border-brand-olive-300 text-brand-olive-500'
              }`}
            >
              <span className="text-xs font-medium">{hotel.id}</span>
            </motion.div>
            
            {/* Tooltip */}
            <AnimatePresence>
              {hoveredHotel?.id === hotel.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-10 w-60 bg-white rounded-lg shadow-lg overflow-hidden mt-2 -ml-24"
                >
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={getHotelImage(hotel.slug)}
                      alt={hotel.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900">{hotel.name}</h3>
                    <p className="text-sm text-gray-600">{hotel.location}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onHotelClick(hotel);
                      }}
                      className="mt-2 text-sm text-brand-olive-600 hover:text-brand-olive-700 font-medium"
                    >
                      View Details →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
      
      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-2 flex flex-col">
        <button className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <button className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}