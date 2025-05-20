'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import DetailHeroBanner from './DetailHeroBanner';
import DestinationOverview from './DestinationOverview';
import LocalDining from './LocalDining';

export interface HotelDetailPageProps {
  hotel: any;
}

/**
 * Implementation of HotelDetailPage component
 * Migrated from the original implementation
 */
const HotelDetailPage: React.FC<HotelDetailPageProps> = ({ hotel }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Hotel Information Unavailable</h2>
          <p className="text-gray-600">We couldn't find the hotel you're looking for.</p>
        </div>
      </div>
    );
  }

  // Extract hotel data
  const {
    name,
    slug,
    location,
    description,
    amenities = [],
    images = {},
    rooms = [],
    features = [],
    destination,
    dining_options = []
  } = hotel;

  // Prepare tab content mapping
  const tabContent = {
    overview: (
      <div className="py-8">
        <h2 className="text-2xl font-semibold mb-6">Overview</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700">{description}</p>
        </div>
        
        {amenities.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {amenities.map((amenity: string, index: number) => (
                <div key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    ),
    rooms: (
      <div className="py-8">
        <h2 className="text-2xl font-semibold mb-6">Rooms & Suites</h2>
        
        {rooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {rooms.map((room: any, index: number) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {room.image ? (
                  <div className="aspect-w-16 aspect-h-9 relative">
                    <Image
                      src={room.image}
                      alt={room.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Room image</span>
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <span className="mr-4">
                      <span className="font-semibold">{room.size || 'n/a'}</span> m²
                    </span>
                    <span>
                      <span className="font-semibold">{room.occupancy || 2}</span> guests
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{room.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-primary font-semibold">
                      {room.price ? `From €${room.price}/night` : 'Contact for price'}
                    </div>
                    
                    <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Room information will be available soon.</p>
          </div>
        )}
      </div>
    ),
    features: (
      <div className="py-8">
        <h2 className="text-2xl font-semibold mb-6">Features & Facilities</h2>
        
        {features.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature: any, index: number) => (
              <div key={index} className="flex bg-white rounded-lg shadow-sm overflow-hidden">
                {feature.image ? (
                  <div className="w-1/3 relative">
                    <Image
                      src={feature.image}
                      alt={feature.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-1/3 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                
                <div className="w-2/3 p-5">
                  <h3 className="text-lg font-semibold mb-2">{feature.name}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Feature information will be available soon.</p>
          </div>
        )}
      </div>
    ),
    location: (
      <div className="py-8">
        <h2 className="text-2xl font-semibold mb-6">Location</h2>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Address</h3>
          <p className="text-gray-700">{location?.full_address || 'Address information not available'}</p>
          
          {location?.description && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Location Details</h4>
              <p className="text-gray-700">{location.description}</p>
            </div>
          )}
        </div>
        
        {destination && <DestinationOverview destinationData={destination} />}
      </div>
    ),
    dining: (
      <LocalDining diningOptions={dining_options} />
    )
  };

  return (
    <div className="bg-white min-h-screen">
      <DetailHeroBanner 
        hotelName={name}
        location={location ? `${location.city}, ${location.country}` : ""}
        description={description || ""}
        backgroundImage={images?.[0] || ""}
        slug={slug}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="border-b mb-8 overflow-x-auto hide-scrollbar">
          <div className="flex min-w-max">
            {['overview', 'rooms', 'features', 'location', 'dining'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Tab Content */}
        {tabContent[activeTab as keyof typeof tabContent]}
      </div>
    </div>
  );
};

export default HotelDetailPage;