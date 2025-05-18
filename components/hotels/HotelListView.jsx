'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { getHotelImage } from './HotelCard';

export default function HotelListView({ hotels = [], onHotelClick }) {
  if (!hotels.length) return null;
  
  return (
    <div className="space-y-4">
      {hotels.map((hotel, index) => (
        <motion.div
          key={hotel.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5,
            delay: index * 0.1,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
          onClick={() => onHotelClick(hotel)}
        >
          {/* Hotel Image */}
          <div className="md:w-1/4 h-48 md:h-auto relative">
            <Image
              src={getHotelImage(hotel.slug, hotel.image)}
              alt={hotel.name || "Hotel exterior"}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover"
            />
          </div>
          
          {/* Hotel Information */}
          <div className="p-5 md:p-6 flex-1 flex flex-col">
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-1">
                    {hotel.name}
                  </h3>
                  
                  {hotel.location && (
                    <p className="text-gray-700 text-sm mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {hotel.location}
                    </p>
                  )}
                </div>
                
                {/* Random price display (in a real app this would come from the data) */}
                <div className="bg-brand-olive-50 text-brand-olive-700 px-3 py-1 rounded-full text-sm font-medium">
                  From ${Math.floor(Math.random() * 300) + 150}/night
                </div>
              </div>
              
              {hotel.description && (
                <p className="text-gray-600 mt-2 line-clamp-2">{hotel.description}</p>
              )}
              
              {/* Categories/Features */}
              {hotel.categories && hotel.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {hotel.categories.map(category => (
                    <span 
                      key={category}
                      className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {/* Show fake avatars as if people booked this */}
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center overflow-hidden"
                    >
                      <Image 
                        src={`https://i.pravatar.cc/32?img=${(hotel.id + i) % 70}`} 
                        alt="Guest avatar" 
                        width={32} 
                        height={32}
                      />
                    </div>
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-3">
                  {Math.floor(Math.random() * 20) + 5} recent bookings
                </span>
              </div>
              
              <button 
                className="text-brand-olive-600 hover:text-brand-olive-800 font-medium text-sm flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  onHotelClick(hotel);
                }}
              >
                View Details
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}