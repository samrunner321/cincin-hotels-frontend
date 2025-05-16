'use client';

import RoomCard from './RoomCard';

export default function RoomList({ 
  rooms = [
    {
      id: 1,
      name: "Deluxe Mountain View Room",
      size: "30m²",
      persons: 2,
      description: "Elegant room with panoramic mountain views, featuring a plush king-size bed and luxurious bathroom.",
      price: "€350",
      image: "/images/hotels/hotel-3.jpg"
    },
    {
      id: 2,
      name: "Junior Suite",
      size: "45m²",
      persons: 3,
      description: "Spacious suite with separate sitting area, king-sized bed, and premium amenities.",
      price: "€480",
      image: "/images/hotels/hotel-4.jpg"
    },
    {
      id: 3,
      name: "Panorama Suite",
      size: "65m²",
      persons: 4,
      description: "Luxury suite with 180° mountain views, featuring a bedroom, separate living room, and private balcony.",
      price: "€620",
      image: "/images/hotels/hotel-5.jpg"
    }
  ]
}) {
  return (
    <section id="rooms" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Rooms & Suites</h2>
          <a href="#" className="text-blue-600 hover:text-blue-800 transition flex items-center">
            <span>View All Rooms</span>
            <svg className="ml-2" width="25" height="9" viewBox="0 0 25 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24.3536 4.85355C24.5488 4.65829 24.5488 4.34171 24.3536 4.14645L21.1716 0.964466C20.9763 0.769204 20.6597 0.769204 20.4645 0.964466C20.2692 1.15973 20.2692 1.47631 20.4645 1.67157L23.2929 4.5L20.4645 7.32843C20.2692 7.52369 20.2692 7.84027 20.4645 8.03553C20.6597 8.2308 20.9763 8.2308 21.1716 8.03553L24.3536 4.85355ZM0 5H24V4H0V5Z" fill="currentColor"/>
            </svg>
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => (
            <RoomCard 
              key={room.id}
              name={room.name}
              size={room.size}
              persons={room.persons}
              description={room.description}
              price={room.price}
              image={room.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}