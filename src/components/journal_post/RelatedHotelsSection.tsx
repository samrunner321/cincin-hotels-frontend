'use client';
import React from 'react';

import RelatedHotelCard from './RelatedHotelCard';
import { HotelProp } from './RelatedHotelCard';

interface RelatedHotelsSectionProps {
  title?: string;
  hotels?: Array<HotelProp>;
}

export default function RelatedHotelsSection({ 
  title = "Where to Stay", 
  hotels = [] 
}: RelatedHotelsSectionProps) {
  if (!hotels || hotels.length === 0) return null;
  
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-8">{title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel, index) => {
            // Generate a unique key for each hotel
            const hotelKey = typeof hotel === 'string' 
              ? hotel 
              : (hotel && typeof hotel === 'object' && ('id' in hotel || 'slug' in hotel) 
                ? (hotel.id || hotel.slug || `hotel-${index}`) 
                : `hotel-${index}`);
            
            return <RelatedHotelCard key={hotelKey} hotel={hotel} />;
          })}
        </div>
      </div>
    </section>
  );
}