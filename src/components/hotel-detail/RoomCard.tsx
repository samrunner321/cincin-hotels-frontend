// @ts-nocheck
import React from 'react';
'use client';

import Image from 'next/image';

export default function RoomCard({ 
  name = "Deluxe Mountain View Room",
  size = "30m²",
  persons = 2,
  description = "Elegant room with panoramic mountain views, featuring a plush king-size bed and luxurious bathroom.",
  price = "€350",
  image = "/images/hotels/hotel-3.jpg"
}) {
  return (
    <div className="bg-white overflow-hidden hover:shadow-sm transition-shadow rounded-xl">
      <div className="relative aspect-[4/3] rounded-t-xl overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-normal">{name}</h3>
          <div className="text-sm">
            {size} • {persons} {persons === 1 ? 'Person' : 'Persons'}
          </div>
        </div>
        
        <p className="text-gray-600 mb-6 line-clamp-2">{description}</p>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-normal">{price}</span>
            <span className="text-gray-500 text-sm"> / night</span>
          </div>
          
          <button className="bg-[#93A27F] text-white px-4 py-2 hover:bg-[#7d8a6b] transition-colors rounded-lg">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}