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
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="relative aspect-[4/3]">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium">{name}</h3>
          <div className="bg-gray-100 px-2 py-1 rounded text-sm">
            {size} • {persons} {persons === 1 ? 'Person' : 'Persons'}
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-medium">{price}</span>
            <span className="text-gray-500 text-sm"> / night</span>
          </div>
          
          <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition-colors">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}