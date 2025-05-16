'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function HotelDetail({
  hotel,
  similarHotels = []
}) {
  const [activeImage, setActiveImage] = useState(0);

  if (!hotel) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Hotel not found</h2>
          <p className="text-gray-600 mb-6">The hotel you are looking for does not exist or has been removed.</p>
          <Link 
            href="/hotels" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-blue-600 hover:bg-brand-blue-700"
          >
            Back to Hotels
          </Link>
        </div>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7 }
    }
  };

  return (
    <motion.div 
      className="bg-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] bg-gray-100 overflow-hidden">
        <motion.div 
          className="absolute inset-0"
          variants={imageVariants}
        >
          <Image
            src={hotel.images[activeImage]}
            alt={`${hotel.name} - ${activeImage + 1}`}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        
        {/* Image Navigation */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {hotel.images.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-3 h-3 rounded-full transition-colors",
                activeImage === index ? "bg-white" : "bg-white/50 hover:bg-white/70"
              )}
              onClick={() => setActiveImage(index)}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
              
              <div className="flex items-center mb-6">
                <div className="flex items-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{hotel.location}</span>
                </div>
                
                {hotel.reviewCount > 0 && (
                  <div className="flex items-center ml-6">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={cn("h-5 w-5", i < Math.floor(hotel.rating) ? "text-yellow-400" : "text-gray-300")} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-gray-600">{hotel.rating} ({hotel.reviewCount} reviews)</span>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-10">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {hotel.longDescription}
              </p>
            </motion.div>

            {/* Amenities */}
            <motion.div variants={itemVariants}>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3">
                {hotel.amenities && hotel.amenities.map(amenity => (
                  <div key={amenity} className="flex items-center">
                    <svg className="h-5 w-5 text-brand-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Booking Sidebar */}
          <motion.div 
            variants={itemVariants}
            className="bg-gray-50 p-6 rounded-lg shadow-sm sticky top-24 h-fit"
          >
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Price</h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-brand-blue-600">
                  {hotel.price.currency === 'EUR' ? '€' : 
                   hotel.price.currency === 'USD' ? '$' : 
                   hotel.price.currency === 'GBP' ? '£' : 
                   hotel.price.currency === 'CHF' ? 'CHF ' : ''}
                  {hotel.price.amount}
                </span>
                <span className="text-gray-600 ml-2">/ {hotel.price.unit}</span>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="check-in" className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
              <input 
                type="date" 
                id="check-in"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue-600 focus:ring-brand-blue-600"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="check-out" className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
              <input 
                type="date" 
                id="check-out"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue-600 focus:ring-brand-blue-600"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
              <select
                id="guests"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue-600 focus:ring-brand-blue-600"
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5">5+ Guests</option>
              </select>
            </div>

            <button className="w-full bg-brand-blue-600 text-white py-3 px-4 rounded-md hover:bg-brand-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue-600 focus:ring-offset-2">
              Book Now
            </button>

            <p className="text-sm text-gray-500 mt-4 text-center">No payment required to book</p>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div variants={itemVariants} className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Location</h2>
          <div className="relative h-96 rounded-lg overflow-hidden">
            <Image
              src={`https://api.mapbox.com/styles/v1/mapbox/light-v10/static/pin-l+046bd2(${hotel.coordinates?.lng},${hotel.coordinates?.lat})/${hotel.coordinates?.lng},${hotel.coordinates?.lat},12,0/1200x600@2x?access_token=YOUR_MAPBOX_TOKEN`}
              alt={`Map showing location of ${hotel.name}`}
              fill
              className="object-cover"
            />
          </div>
          <p className="text-gray-600 mt-2">{hotel.location}</p>
        </motion.div>

        {/* Similar Hotels */}
        {similarHotels.length > 0 && (
          <motion.div variants={itemVariants} className="mt-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Similar Hotels You Might Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {similarHotels.map((similarHotel, index) => (
                <div key={similarHotel.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <Link href={`/hotels/${similarHotel.slug}`} className="block">
                    <div className="relative h-48">
                      <Image
                        src={similarHotel.images[0]}
                        alt={similarHotel.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900">{similarHotel.name}</h3>
                      <p className="text-gray-600 text-sm">{similarHotel.location}</p>
                      <div className="mt-2 text-brand-blue-600 font-medium">
                        {similarHotel.price.currency === 'EUR' ? '€' : 
                         similarHotel.price.currency === 'USD' ? '$' : 
                         similarHotel.price.currency === 'GBP' ? '£' : 
                         similarHotel.price.currency === 'CHF' ? 'CHF ' : ''}
                        {similarHotel.price.amount} / {similarHotel.price.unit}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}