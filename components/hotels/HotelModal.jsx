'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getHotelImage } from './HotelCard';
import HotelQuickView from './HotelQuickView';

export default function HotelModal({ hotel, isOpen, onClose }) {
  const modalRef = useRef(null);
  const [showDates, setShowDates] = useState(false);
  const [dates, setDates] = useState({ checkIn: '', checkOut: '' });
  
  const handleDateChange = (e) => {
    setDates(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Handle escape key and click outside to close
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!hotel) return null;

  const {
    name,
    location,
    description,
    slug,
    categories = [],
    extraInfo,
  } = hotel;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          <motion.div
            ref={modalRef}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto font-brooklyn"
          >
            <div className="relative">
              {/* Hero image */}
              <div className="h-[50vh] relative">
                <Image
                  src={getHotelImage(slug)}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                  aria-label="Close modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                {/* Hotel name and location overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 bg-gradient-to-t from-black to-transparent text-white">
                  <h2 className="text-3xl md:text-4xl font-normal mb-2">{name}</h2>
                  {location && <p className="text-lg opacity-90">{location}</p>}
                </div>
              </div>
              
              {/* Content section */}
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    {/* Description */}
                    {description && (
                      <div className="mb-8">
                        <h3 className="text-xl font-medium mb-4">About</h3>
                        <p className="text-gray-700 leading-relaxed">{description}</p>
                        
                        {extraInfo && (
                          <p className="text-gray-700 italic mt-4">{extraInfo}</p>
                        )}
                      </div>
                    )}
                    
                    {/* Categories */}
                    {categories && categories.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-xl font-medium mb-4">Hotel Features</h3>
                        <div className="flex flex-wrap gap-2">
                          {categories.map(category => {
                            const categorySlug = typeof category === 'string' 
                              ? category.toLowerCase().replace(/\s+/g, '-')
                              : '';
                            
                            return (
                              <span 
                                key={category}
                                className="text-brand-olive-600 bg-brand-olive-50 px-3 py-1.5 rounded-full"
                              >
                                {category}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {/* Date Selection */}
                    <div className="mb-8">
                      <div className="flex items-center mb-4">
                        <h3 className="text-xl font-medium">Check Availability</h3>
                        <button 
                          onClick={() => setShowDates(!showDates)}
                          className="ml-2 text-brand-olive-500 hover:text-brand-olive-600 text-sm underline"
                        >
                          {showDates ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      
                      {showDates && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-gray-50 p-4 rounded-lg"
                        >
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                              <input
                                type="date"
                                id="checkIn"
                                name="checkIn"
                                value={dates.checkIn}
                                onChange={handleDateChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-olive-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                              <input
                                type="date"
                                id="checkOut"
                                name="checkOut"
                                value={dates.checkOut}
                                onChange={handleDateChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-olive-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                          <button className="w-full bg-brand-olive-500 hover:bg-brand-olive-600 text-white py-2 rounded-md transition-colors">
                            Check Rates
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    {/* QuickView Component */}
                    <HotelQuickView hotel={hotel} />
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center sm:justify-between mt-8 pt-6 border-t border-gray-200">
                  <button className="inline-flex items-center px-4 py-2 border border-brand-olive-500 text-brand-olive-600 hover:bg-brand-olive-50 rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>Save for Later</span>
                  </button>
                  
                  <Link
                    href={`/hotels/${slug}`}
                    className="inline-flex items-center px-6 py-3 bg-brand-olive-500 hover:bg-brand-olive-600 text-white rounded-lg transition-colors"
                  >
                    <span>View Details</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}