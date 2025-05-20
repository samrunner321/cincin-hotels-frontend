'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// RoomCard component for displaying each room type
const RoomCard = ({ 
  room, 
  expanded, 
  onToggleExpand,
  onBook
}) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="md:flex">
        {/* Room image */}
        <div className="relative h-64 md:h-auto md:w-1/3">
          <Image
            src={room.image}
            alt={room.name}
            fill
            className="object-cover"
          />
          {room.featured && (
            <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-xs font-medium rounded-full">
              Featured
            </div>
          )}
        </div>
        
        {/* Room details */}
        <div className="p-6 md:w-2/3">
          <div className="flex flex-col h-full">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-medium">{room.name}</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                    </svg>
                    <span className="text-sm">{room.size}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span className="text-sm">Up to {room.persons} {room.persons === 1 ? 'person' : 'people'}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{room.description}</p>
              
              <button 
                onClick={onToggleExpand}
                className="text-sm text-gray-500 hover:text-black flex items-center"
              >
                {expanded ? 'Hide details' : 'Show details'}
                <svg 
                  className={`ml-1 w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            {/* Expanded details */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-gray-100"
                >
                  <h4 className="text-sm font-medium mb-3">Room Amenities</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {room.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                  
                  {room.cancellationPolicy && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-1">Cancellation Policy</h4>
                      <p className="text-sm text-gray-600">{room.cancellationPolicy}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Price and booking button */}
            <div className="mt-auto pt-4 flex flex-col sm:flex-row justify-between items-end">
              <div>
                <span className="text-sm text-gray-500">From</span>
                <div className="text-2xl font-medium">{room.price}<span className="text-sm font-normal">/night</span></div>
              </div>
              
              <button 
                onClick={() => onBook(room)}
                className="mt-4 sm:mt-0 px-6 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function HotelRooms({ 
  rooms = [
    {
      id: 1,
      name: "Deluxe Mountain View Room",
      size: "30m²",
      persons: 2,
      description: "Elegant room with panoramic mountain views, featuring a plush king-size bed and luxurious bathroom.",
      price: "€350",
      image: "/images/hotels/hotel-3.jpg",
      featured: false,
      amenities: [
        "King-size bed", "Mountain view", "Free Wi-Fi", "Air conditioning", 
        "Smart TV", "Minibar", "Safe", "Rain shower"
      ],
      cancellationPolicy: "Free cancellation up to 48 hours before arrival. One night charge for later cancellations."
    },
    {
      id: 2,
      name: "Junior Suite",
      size: "45m²",
      persons: 3,
      description: "Spacious suite with separate sitting area, king-sized bed, and premium amenities.",
      price: "€480",
      image: "/images/hotels/hotel-4.jpg",
      featured: true,
      amenities: [
        "King-size bed", "Separate sitting area", "Free Wi-Fi", "Air conditioning", 
        "Smart TV", "Minibar", "Safe", "Bathtub and shower", "Nespresso machine"
      ],
      cancellationPolicy: "Free cancellation up to 48 hours before arrival. One night charge for later cancellations."
    },
    {
      id: 3,
      name: "Panorama Suite",
      size: "65m²",
      persons: 4,
      description: "Luxury suite with 180° mountain views, featuring a bedroom, separate living room, and private balcony.",
      price: "€620",
      image: "/images/hotels/hotel-5.jpg",
      featured: false,
      amenities: [
        "King-size bed", "180° mountain views", "Private balcony", "Separate living room",
        "Free Wi-Fi", "Air conditioning", "Smart TV", "Minibar", "Safe", 
        "Bathtub and shower", "Nespresso machine", "Dining area"
      ],
      cancellationPolicy: "Free cancellation up to 7 days before arrival. 50% charge for later cancellations."
    },
    {
      id: 4,
      name: "Executive Suite",
      size: "75m²",
      persons: 2,
      description: "Our most exclusive accommodation with a private terrace overlooking the mountains, featuring a spacious bedroom and separate living area.",
      price: "€750",
      image: "/images/hotels/hotel-6.jpg",
      featured: false,
      amenities: [
        "King-size bed", "Private terrace", "Mountain views", "Separate living area",
        "Free Wi-Fi", "Air conditioning", "Smart TV", "Minibar", "Safe", 
        "Bathtub and shower", "Nespresso machine", "Dining area", "Fireplace"
      ],
      cancellationPolicy: "Free cancellation up to 14 days before arrival. 100% charge for later cancellations."
    }
  ]
}) {
  const [expandedRoom, setExpandedRoom] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingDates, setBookingDates] = useState({
    checkIn: '',
    checkOut: ''
  });
  
  // Get today's date in YYYY-MM-DD format for min date of check-in input
  const today = new Date().toISOString().split('T')[0];
  
  // Get tomorrow's date in YYYY-MM-DD format for default check-in date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  
  // Get the date after tomorrow for default check-out date
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  const dayAfterTomorrowStr = dayAfterTomorrow.toISOString().split('T')[0];
  
  // Toggle expanded room details
  const toggleRoomExpand = (roomId) => {
    setExpandedRoom(expandedRoom === roomId ? null : roomId);
  };
  
  // Open booking modal for a room
  const handleBookRoom = (room) => {
    setSelectedRoom(room);
    setShowBookingModal(true);
    setBookingDates({
      checkIn: tomorrowStr,
      checkOut: dayAfterTomorrowStr
    });
  };
  
  // Close booking modal
  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedRoom(null);
  };
  
  // Update booking dates
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setBookingDates(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Calculate number of nights
  const calculateNights = () => {
    if (!bookingDates.checkIn || !bookingDates.checkOut) return 0;
    
    const checkIn = new Date(bookingDates.checkIn);
    const checkOut = new Date(bookingDates.checkOut);
    const diffTime = checkOut.getTime() - checkIn.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };
  
  // Calculate total price
  const calculateTotalPrice = () => {
    if (!selectedRoom) return 0;
    
    const nights = calculateNights();
    const price = parseInt(selectedRoom.price.replace(/[^0-9]/g, ''));
    return price * nights;
  };
  
  return (
    <section id="rooms" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-light mb-10">Rooms & Suites</h2>
        
        {/* Room filter and date selection */}
        <div className="bg-gray-50 rounded-xl p-4 md:p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-2">Check-in</label>
              <input 
                type="date" 
                min={today}
                defaultValue={tomorrowStr}
                className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-2">Check-out</label>
              <input 
                type="date" 
                min={tomorrowStr}
                defaultValue={dayAfterTomorrowStr}
                className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-2">Guests</label>
              <select className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black appearance-none bg-white">
                <option>1 Adult</option>
                <option>2 Adults</option>
                <option>2 Adults, 1 Child</option>
                <option>2 Adults, 2 Children</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button className="w-full bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-800 transition-colors">
                Check Availability
              </button>
            </div>
          </div>
        </div>
        
        {/* Rooms list */}
        <div className="space-y-6">
          {rooms.map(room => (
            <RoomCard 
              key={room.id}
              room={room}
              expanded={expandedRoom === room.id}
              onToggleExpand={() => toggleRoomExpand(room.id)}
              onBook={handleBookRoom}
            />
          ))}
        </div>
      </div>
      
      {/* Booking modal */}
      <AnimatePresence>
        {showBookingModal && selectedRoom && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-50" 
              onClick={closeBookingModal}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full relative z-10"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-medium">Book Your Stay</h3>
                  <button 
                    onClick={closeBookingModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={selectedRoom.image} 
                      alt={selectedRoom.name} 
                      className="w-20 h-20 rounded-lg object-cover mr-4" 
                    />
                    <div>
                      <h4 className="font-medium">{selectedRoom.name}</h4>
                      <p className="text-sm text-gray-500">
                        {selectedRoom.size} • Up to {selectedRoom.persons} {selectedRoom.persons === 1 ? 'person' : 'people'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                      <input 
                        type="date" 
                        name="checkIn"
                        min={today}
                        value={bookingDates.checkIn}
                        onChange={handleDateChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                      <input 
                        type="date" 
                        name="checkOut"
                        min={bookingDates.checkIn || tomorrowStr}
                        value={bookingDates.checkOut}
                        onChange={handleDateChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Room price</span>
                      <span>{selectedRoom.price} × {calculateNights()} nights</span>
                    </div>
                    
                    <div className="flex justify-between font-medium text-lg mt-4">
                      <span>Total</span>
                      <span>€{calculateTotalPrice()}</span>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-2">
                      *Taxes and fees not included. {selectedRoom.cancellationPolicy}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    onClick={closeBookingModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg mr-3 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                    Complete Booking
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}