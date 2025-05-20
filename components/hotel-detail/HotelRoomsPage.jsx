'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import HotelRooms from './HotelRooms';

export default function HotelRoomsPage({ hotel }) {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="animate-spin h-12 w-12 border-4 border-gray-200 rounded-full border-t-black"></div>
      </div>
    );
  }
  
  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Hotel not found</h2>
          <p className="mt-2">The hotel you're looking for doesn't exist or has been removed.</p>
          <Link 
            href="/hotels" 
            className="mt-4 inline-block px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Browse Hotels
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] bg-black">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{ 
            backgroundImage: `url(${hotel.main_image_url || '/images/hotels/hotel-1.jpg'})` 
          }}
        />
        
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link href={`/hotels/${hotel.slug}`} className="inline-flex items-center text-white hover:text-gray-200 mb-4">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to Hotel
                </Link>
                <h1 className="text-4xl md:text-5xl font-light text-white mb-4">
                  Rooms & Suites
                </h1>
                <p className="text-xl text-white/90">
                  {hotel.name} | {hotel.location}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Rooms Section */}
      <HotelRooms 
        rooms={hotel.rooms || []}
        fullPage={true}
      />
      
      {/* Additional Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-light mb-6">Booking Information</h2>
            <div className="bg-gray-50 p-6 rounded-xl">
              <dl className="divide-y divide-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 py-4">
                  <dt className="font-medium text-gray-500 md:col-span-1">Check-in</dt>
                  <dd className="mt-1 md:mt-0 md:col-span-2">3:00 PM - 10:00 PM</dd>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 py-4">
                  <dt className="font-medium text-gray-500 md:col-span-1">Check-out</dt>
                  <dd className="mt-1 md:mt-0 md:col-span-2">7:00 AM - 11:00 AM</dd>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 py-4">
                  <dt className="font-medium text-gray-500 md:col-span-1">Cancellation Policy</dt>
                  <dd className="mt-1 md:mt-0 md:col-span-2">Free cancellation up to 48 hours before arrival. One night charge for later cancellations.</dd>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 py-4">
                  <dt className="font-medium text-gray-500 md:col-span-1">Pets</dt>
                  <dd className="mt-1 md:mt-0 md:col-span-2">Small pets allowed (charges may apply)</dd>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 py-4">
                  <dt className="font-medium text-gray-500 md:col-span-1">Children</dt>
                  <dd className="mt-1 md:mt-0 md:col-span-2">Children of all ages are welcome. Children aged 12 years and above are considered adults at this property.</dd>
                </div>
              </dl>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-light mt-12 mb-6">Special Requests</h2>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-gray-700 mb-4">
                Special requests are subject to availability and may incur additional charges. Please let us know in advance if you have any specific requirements:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Room preferences (high floor, quiet location)</li>
                <li>Bed configuration</li>
                <li>Early check-in or late check-out</li>
                <li>Accessibility needs</li>
                <li>Dietary requirements</li>
                <li>Airport transfers</li>
              </ul>
              <div className="mt-6">
                <p className="text-gray-700">
                  For special requests, please contact us directly:
                </p>
                <div className="mt-2">
                  <a 
                    href={`mailto:${hotel.email || 'reservations@cincinhotels.com'}`}
                    className="text-blue-600 hover:underline"
                  >
                    {hotel.email || 'reservations@cincinhotels.com'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Floating book now button on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
        <button className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
          Check Availability
        </button>
      </div>
    </main>
  );
}