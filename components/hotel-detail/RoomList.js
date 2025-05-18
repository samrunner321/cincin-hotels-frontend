'use client';

import RoomCard from './RoomCard';
import Link from 'next/link';
import { useState } from 'react';

export default function RoomList({ 
  rooms = [
    {
      id: 1,
      name: "Deluxe Mountain View Room",
      size: "30m²",
      persons: 2,
      description: "Elegant room with panoramic mountain views, featuring a plush king-size bed and luxurious bathroom.",
      price: "€350",
      image: "/images/hotels/hotel-3.jpg",
      amenities: [
        "King-size bed", "Mountain view", "Free Wi-Fi", "Air conditioning", 
        "Smart TV", "Minibar", "Safe", "Rain shower"
      ]
    },
    {
      id: 2,
      name: "Junior Suite",
      size: "45m²",
      persons: 3,
      description: "Spacious suite with separate sitting area, king-sized bed, and premium amenities.",
      price: "€480",
      image: "/images/hotels/hotel-4.jpg",
      amenities: [
        "King-size bed", "Separate sitting area", "Free Wi-Fi", "Air conditioning", 
        "Smart TV", "Minibar", "Safe", "Bathtub and shower", "Nespresso machine"
      ]
    },
    {
      id: 3,
      name: "Panorama Suite",
      size: "65m²",
      persons: 4,
      description: "Luxury suite with 180° mountain views, featuring a bedroom, separate living room, and private balcony.",
      price: "€620",
      image: "/images/hotels/hotel-5.jpg",
      amenities: [
        "King-size bed", "180° mountain views", "Private balcony", "Separate living room",
        "Free Wi-Fi", "Air conditioning", "Smart TV", "Minibar", "Safe", 
        "Bathtub and shower", "Nespresso machine", "Dining area"
      ]
    },
    {
      id: 4,
      name: "Executive Suite",
      size: "75m²",
      persons: 2,
      description: "Our most exclusive accommodation with a private terrace overlooking the mountains, featuring a spacious bedroom and separate living area.",
      price: "€750",
      image: "/images/hotels/hotel-6.jpg",
      amenities: [
        "King-size bed", "Private terrace", "Mountain views", "Separate living area",
        "Free Wi-Fi", "Air conditioning", "Smart TV", "Minibar", "Safe", 
        "Bathtub and shower", "Nespresso machine", "Dining area", "Fireplace"
      ]
    }
  ],
  fullPage = false
}) {
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  // If in full page view, show all rooms with more details
  // Otherwise in main page view, show just first 3 rooms
  const displayRooms = fullPage ? rooms : rooms.slice(0, 3);
  
  return (
    <section id="rooms" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1536px]">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-brooklyn">Rooms & Suites</h2>
          {!fullPage && (
            <Link 
              href="rooms" 
              className="text-brand-olive-400 hover:text-brand-olive-600 transition-colors flex items-center gap-2 font-brooklyn"
            >
              View All Rooms
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          )}
        </div>
        
        {/* Filter options - only on full page view */}
        {fullPage && (
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <label className="text-sm text-gray-500 font-brooklyn mb-2">Check-in</label>
                <input 
                  type="date" 
                  className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-olive-400 font-brooklyn"
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm text-gray-500 font-brooklyn mb-2">Check-out</label>
                <input 
                  type="date" 
                  className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-olive-400 font-brooklyn"
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm text-gray-500 font-brooklyn mb-2">Guests</label>
                <select className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-olive-400 font-brooklyn appearance-none bg-white">
                  <option>1 Adult</option>
                  <option>2 Adults</option>
                  <option>2 Adults, 1 Child</option>
                  <option>2 Adults, 2 Children</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button className="w-full bg-brand-olive-400 text-white rounded-lg px-4 py-2 font-brooklyn hover:bg-brand-olive-500 transition-colors">
                  Check Availability
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Rooms Grid or List */}
        <div className={fullPage ? "space-y-8" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
          {displayRooms.map(room => (
            <div key={room.id}>
              {fullPage ? (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3 h-full">
                    <div className="md:col-span-1 relative h-48 md:h-full">
                      <img 
                        src={room.image} 
                        alt={room.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="md:col-span-2 p-6 flex flex-col h-full">
                      <div className="mb-4">
                        <h3 className="text-xl font-brooklyn mb-2">{room.name}</h3>
                        <div className="flex flex-wrap items-center mb-2 gap-x-6">
                          <div className="flex items-center text-gray-600">
                            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect width="18" height="18" x="3" y="3" rx="2" />
                            </svg>
                            <span className="text-sm font-brooklyn">{room.size}</span>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                              <circle cx="9" cy="7" r="4"></circle>
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            <span className="text-sm font-brooklyn">Up to {room.persons} {room.persons === 1 ? 'person' : 'people'}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 font-brooklyn mb-4">{room.description}</p>
                        
                        <div className="text-sm text-gray-600 mb-4">
                          <button 
                            onClick={() => setSelectedRoom(selectedRoom === room.id ? null : room.id)}
                            className="flex items-center gap-1 font-brooklyn text-brand-olive-400 hover:text-brand-olive-600"
                          >
                            {selectedRoom === room.id ? 'Hide details' : 'Show details'}
                            <svg className={`w-4 h-4 transition-transform ${selectedRoom === room.id ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                        
                        {selectedRoom === room.id && (
                          <div className="mb-4 animate-fadeIn">
                            <h4 className="text-sm font-medium font-brooklyn mb-2">Amenities</h4>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                              {room.amenities?.map((amenity, index) => (
                                <div key={index} className="flex items-center text-sm text-gray-600">
                                  <svg className="w-3 h-3 mr-2 text-brand-olive-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  <span className="font-brooklyn">{amenity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-auto flex flex-col md:flex-row justify-between items-end">
                        <div>
                          <span className="text-xs text-gray-500 font-brooklyn">From</span>
                          <div className="text-2xl font-medium font-brooklyn text-gray-900">{room.price}<span className="text-sm font-normal">/night</span></div>
                        </div>
                        
                        <button className="mt-4 md:mt-0 px-6 py-2 bg-brand-olive-400 text-white font-brooklyn rounded-full hover:bg-brand-olive-500 transition-colors">
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <RoomCard 
                  name={room.name}
                  size={room.size}
                  persons={room.persons}
                  description={room.description}
                  price={room.price}
                  image={room.image}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}