'use client';

import React from 'react';
import Link from 'next/link';

interface Room {
  id: string;
  name: string;
  description?: string;
  price_per_night?: number;
  capacity?: number;
  amenities?: string[];
  images?: string[];
}

interface Hotel {
  id: string;
  name: string;
  slug: string;
  rooms?: Room[];
}

interface HotelRoomsPageProps {
  hotel: Hotel;
}

/**
 * This is a placeholder component for the HotelRoomsPage
 * It will be replaced with the fully migrated component in the future
 */
const HotelRoomsPage = ({ hotel }: HotelRoomsPageProps) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href={`/hotels/${hotel.slug}`} className="text-primary hover:underline mb-2 inline-block">
          &larr; Back to {hotel.name}
        </Link>
        <h1 className="text-3xl md:text-4xl font-semibold mb-2">Rooms & Suites</h1>
        <p className="text-gray-600">Discover our luxury accommodations at {hotel.name}</p>
      </div>

      {(!hotel.rooms || hotel.rooms.length === 0) ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-600 mb-4">Room information is currently being migrated.</p>
          <p className="text-sm text-gray-500">Please check back soon for detailed room information.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotel.rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Room Image</span>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{room.name}</h2>
                {room.description && (
                  <p className="text-gray-600 mb-4 line-clamp-3">{room.description}</p>
                )}
                <div className="flex justify-between items-center mt-4">
                  <div>
                    {room.price_per_night && (
                      <p className="text-xl font-bold text-primary">
                        ${room.price_per_night} <span className="text-sm font-normal text-gray-500">/ night</span>
                      </p>
                    )}
                  </div>
                  <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelRoomsPage;