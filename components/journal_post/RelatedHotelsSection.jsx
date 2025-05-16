'use client';

import RelatedHotelCard from './RelatedHotelCard';

export default function RelatedHotelsSection({ 
  title = "Where to Stay", 
  hotels = [] 
}) {
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
              : (hotel.id || hotel.slug || `hotel-${index}`);
            
            return <RelatedHotelCard key={hotelKey} hotel={hotel} />;
          })}
        </div>
      </div>
    </section>
  );
}