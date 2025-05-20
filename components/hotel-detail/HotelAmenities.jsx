'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// Reusable AmenityIcon component
const AmenityIcon = ({ type }) => {
  // Define SVG paths for different amenity types
  const icons = {
    wifi: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    ),
    parking: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    breakfast: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    spa: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
      </svg>
    ),
    pool: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
      </svg>
    ),
    fitness: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5v-2a7 7 0 0114 0v2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    restaurant: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    bar: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 3a3 3 0 00-3 3v12a3 3 0 003 3 3 3 0 003-3 3 3 0 00-3-3H6a3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3V6a3 3 0 00-3-3 3 3 0 00-3 3 3 3 0 003 3h12a3 3 0 003-3 3 3 0 00-3-3z" />
      </svg>
    ),
    roomService: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
    airConditioning: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    concierge: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    default: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
      </svg>
    )
  };

  return icons[type] || icons.default;
};

export default function HotelAmenities({ 
  features = [
    {
      icon: 'wifi',
      title: 'High-Speed Wi-Fi',
      description: 'Complimentary high-speed Wi-Fi throughout the hotel premises'
    },
    {
      icon: 'parking',
      title: 'Parking',
      description: 'Private underground parking with valet service available'
    },
    {
      icon: 'breakfast',
      title: 'Breakfast',
      description: 'Gourmet breakfast buffet featuring local and organic products'
    },
    {
      icon: 'spa',
      title: 'Spa & Wellness',
      description: 'Full-service spa with massage, sauna, and treatment rooms'
    },
    {
      icon: 'pool',
      title: 'Indoor/Outdoor Pool',
      description: 'Heated indoor pool with panoramic mountain views'
    },
    {
      icon: 'fitness',
      title: 'Fitness Center',
      description: 'State-of-the-art fitness center with personal training available'
    },
    {
      icon: 'restaurant',
      title: 'Fine Dining',
      description: 'Award-winning restaurant featuring seasonal, locally-sourced cuisine'
    },
    {
      icon: 'bar',
      title: 'Bar & Lounge',
      description: 'Elegant bar offering craft cocktails and an extensive wine list'
    },
    {
      icon: 'roomService',
      title: 'Room Service',
      description: '24-hour room service with an extensive in-room dining menu'
    },
    {
      icon: 'airConditioning',
      title: 'Climate Control',
      description: 'Individually controlled heating and air conditioning in all rooms'
    },
    {
      icon: 'concierge',
      title: 'Concierge',
      description: 'Dedicated concierge service to assist with all your needs'
    }
  ],
  amenities = {
    roomAmenities: [
      'Air conditioning',
      'Free Wi-Fi',
      'Flat-screen TV',
      'Minibar',
      'Safe',
      'Coffee/tea maker',
      'Premium bedding',
      'Designer toiletries',
      'Bathrobes & slippers',
      'Rainfall showerhead',
      'Hair dryer',
      'Desk',
      'Blackout drapes'
    ],
    hotelServices: [
      '24-hour front desk',
      'Concierge service',
      'Room service',
      'Luggage storage',
      'Dry cleaning/laundry',
      'Airport shuttle',
      'Babysitting service',
      'Multilingual staff',
      'Tour/ticket assistance',
      'Daily housekeeping',
      'Laundry facilities',
      'Porter/bellhop',
      'Wedding services'
    ],
    facilities: [
      'Restaurant',
      'Bar/lounge',
      'Spa',
      'Indoor pool',
      'Outdoor pool',
      'Fitness center',
      'Sauna',
      'Steam room',
      'Rooftop terrace',
      'Garden',
      'Conference space',
      'Business center',
      'Meeting rooms'
    ]
  },
  hotelInfo = {
    checkIn: '3:00 PM',
    checkOut: '11:00 AM',
    petsAllowed: 'Small pets allowed (charges may apply)',
    internetAccess: 'Complimentary high-speed Wi-Fi throughout the property',
    languages: ['English', 'German', 'Italian', 'French'],
    creditCards: ['Visa', 'Mastercard', 'American Express', 'Diners Club']
  }
}) {
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0
    }
  };

  return (
    <section id="amenities" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-light mb-10">Amenities & Services</h2>
        
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex space-x-8 overflow-x-auto hide-scrollbar">
            {['overview', 'room', 'hotel', 'facilities', 'info'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 relative whitespace-nowrap transition-colors ${
                  activeTab === tab 
                    ? 'text-black font-medium after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab === 'overview' && 'Overview'}
                {tab === 'room' && 'Room Amenities'}
                {tab === 'hotel' && 'Hotel Services'}
                {tab === 'facilities' && 'Facilities'}
                {tab === 'info' && 'Hotel Info'}
              </button>
            ))}
          </div>
        </div>
        
        {/* Overview Tab - Feature Cards */}
        <div className={activeTab === 'overview' ? 'block' : 'hidden'}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.slice(0, showAllFeatures ? features.length : 6).map((feature, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg text-gray-600 mr-4">
                    <AmenityIcon type={feature.icon} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {features.length > 6 && (
            <div className="text-center mt-8">
              <button 
                onClick={() => setShowAllFeatures(!showAllFeatures)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                {showAllFeatures ? 'Show Less' : 'Show All Amenities'}
                <svg 
                  className={`ml-2 h-5 w-5 transition-transform ${showAllFeatures ? 'rotate-180' : ''}`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
        
        {/* Room Amenities Tab */}
        <div className={activeTab === 'room' ? 'block' : 'hidden'}>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-6">Room Amenities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
              {amenities.roomAmenities.map((amenity, index) => (
                <div key={index} className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Hotel Services Tab */}
        <div className={activeTab === 'hotel' ? 'block' : 'hidden'}>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-6">Hotel Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
              {amenities.hotelServices.map((service, index) => (
                <div key={index} className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Facilities Tab */}
        <div className={activeTab === 'facilities' ? 'block' : 'hidden'}>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-6">Hotel Facilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
              {amenities.facilities.map((facility, index) => (
                <div key={index} className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{facility}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Hotel Info Tab */}
        <div className={activeTab === 'info' ? 'block' : 'hidden'}>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-6">Hotel Information</h3>
            <dl className="divide-y divide-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 py-4">
                <dt className="font-medium text-gray-500 md:col-span-1">Check-in</dt>
                <dd className="mt-1 md:mt-0 md:col-span-2">{hotelInfo.checkIn}</dd>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 py-4">
                <dt className="font-medium text-gray-500 md:col-span-1">Check-out</dt>
                <dd className="mt-1 md:mt-0 md:col-span-2">{hotelInfo.checkOut}</dd>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 py-4">
                <dt className="font-medium text-gray-500 md:col-span-1">Pets</dt>
                <dd className="mt-1 md:mt-0 md:col-span-2">{hotelInfo.petsAllowed}</dd>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 py-4">
                <dt className="font-medium text-gray-500 md:col-span-1">Internet</dt>
                <dd className="mt-1 md:mt-0 md:col-span-2">{hotelInfo.internetAccess}</dd>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 py-4">
                <dt className="font-medium text-gray-500 md:col-span-1">Languages</dt>
                <dd className="mt-1 md:mt-0 md:col-span-2">{hotelInfo.languages.join(', ')}</dd>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 py-4">
                <dt className="font-medium text-gray-500 md:col-span-1">Credit Cards</dt>
                <dd className="mt-1 md:mt-0 md:col-span-2">{hotelInfo.creditCards.join(', ')}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}