// @ts-nocheck
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Hotel } from '../../types/hotel';
import { getHotelImage } from '../../utils/image-helpers';
import { formatCurrency } from '../../../lib/utils';
import Link from 'next/link';

export interface HotelListViewProps {
  /** Liste der Hotels */
  hotels: Hotel[];
  /** Callback für Klick auf ein Hotel */
  onHotelClick: (hotel: Hotel) => void;
  /** Zusätzliche CSS-Klassen */
  className?: string;
}

/**
 * HotelListView Komponente
 * 
 * Zeigt Hotels in einer Listenansicht an
 */
export default function HotelListView({ 
  hotels = [], 
  onHotelClick,
  className = ''
}: HotelListViewProps): JSX.Element | null {
  if (!hotels.length) return null;
  
  return (
    <div className={`space-y-6 ${className}`}>
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
          className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer border border a-100"
          onClick={() => onHotelClick(hotel)}
        >
          {/* Hotel Image */}
          <div className="md:w-1/3 h-48 md:h-auto relative">
            <Image
              src={getHotelImage(hotel.main_image_url || hotel.image, hotel.slug)}
              alt={hotel.name || "Hotel exterior"}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
          
          {/* Hotel Information */}
          <div className="p-5 md:p-6 flex-1 flex flex-col">
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-medium text a-900 mb-1">
                    {hotel.name}
                  </h3>
                  
                  {hotel.location && (
                    <p className="text a-700 text-sm mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text a-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {hotel.location}
                    </p>
                  )}
                </div>
                
                {/* Price display */}
                {hotel.price_from && (
                  <div className="bg-brand-olive-50 text-brand-olive-700 px-3 py-1 rounded-full text-sm font-medium">
                    Ab {formatCurrency(hotel.price_from, hotel.currency || 'EUR')}
                  </div>
                )}
              </div>
              
              {(hotel.short_description || hotel.description) && (
                <p className="text a-600 mt-2 line-clamp-2">
                  {hotel.short_description || hotel.description}
                </p>
              )}
              
              {/* Categories/Features */}
              {hotel.categories && hotel.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {hotel.categories.map((category, idx) => {
                    const categoryName = typeof category === 'string' 
                      ? category 
                      : (category.name || '');
                      
                    if (!categoryName) return null;
                    
                    return (
                      <span 
                        key={`${hotel.id}-cat-${idx}`}
                        className="text-sm text a-600 bg a-100 px-2 py-1 rounded-full"
                      >
                        {categoryName}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border a-100 flex justify-between items-center">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {/* Avatars as decoration */}
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-8 h-8 rounded-full bg a-200 border-2 border-white flex items-center justify-center overflow-hidden"
                    >
                      <Image 
                        src={`https://i.pravatar.cc/32?img=${(parseInt(hotel.id) + i) % 70}`} 
                        alt="Guest avatar" 
                        width={32} 
                        height={32}
                      />
                    </div>
                  ))}
                </div>
                <span className="text-sm text a-500 ml-3">
                  {Math.floor(Math.random() * 20) + 5} kürzliche Buchungen
                </span>
              </div>
              
              <Link 
                href={`/hotels/${hotel.slug || hotel.id}`}
                className="text-brand-olive-600 hover:text-brand-olive-800 font-medium text-sm flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  onHotelClick(hotel);
                }}
              >
                Details ansehen
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}