'use client';

import { useState, useEffect } from 'react';
import HotelDetailPage from '../../../components/hotel-detail/HotelDetailPage';
import { AssetManagerProvider } from '../../../components/common/AssetManager';
import { getMockHotelBySlug } from '../../../components/common/directus-client';

export default function MockHotelDetailPage({ params }) {
  const [hotel, setHotel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Get mock hotel data
    const { slug } = params;
    
    // Use our mock data or create some
    const mockHotel = getMockHotelBySlug(slug) || {
      id: '1',
      name: 'Schgaguler Hotel',
      slug: 'schgaguler-hotel',
      location: 'Dolomites, Italy',
      short_description: 'A minimalist mountain retreat in the heart of the Dolomites.',
      description: 'The Schgaguler Hotel is a modern, minimalist retreat in the heart of the Dolomites.',
      main_image: '/images/hotels/hotel-schgaguler.jpg',
      main_image_url: '/images/hotels/hotel-schgaguler.jpg',
      gallery: [
        { image: '/images/hotels/hotel-1.jpg', alt: 'Mountain view suite', url: '/images/hotels/hotel-1.jpg' },
        { image: '/images/hotels/hotel-2.jpg', alt: 'Hotel exterior', url: '/images/hotels/hotel-2.jpg' },
        { image: '/images/hotels/hotel-3.jpg', alt: 'Dining area', url: '/images/hotels/hotel-3.jpg' }
      ],
      rooms: [
        {
          id: '1-1',
          name: 'Mountain View Suite',
          slug: 'mountain-view-suite',
          description: 'Spacious suite with panoramic mountain views',
          size: '45m²',
          max_occupancy: 2,
          main_image: '/images/hotels/hotel-1.jpg',
          main_image_url: '/images/hotels/hotel-1.jpg',
          price_per_night: 450,
          currency: 'EUR'
        },
        {
          id: '1-2',
          name: 'Alpine Deluxe Room',
          slug: 'alpine-deluxe-room',
          description: 'Cozy room with balcony and alpine decor',
          size: '30m²',
          max_occupancy: 2,
          main_image: '/images/hotels/hotel-2.jpg',
          main_image_url: '/images/hotels/hotel-2.jpg',
          price_per_night: 350,
          currency: 'EUR'
        }
      ],
      features: [
        {
          title: 'Mountain Location',
          description: 'Situated at 1,500m elevation with panoramic views of the Dolomites',
          icon: 'mountains'
        },
        {
          title: 'Award-winning Spa',
          description: 'Alpine-inspired wellness center with indoor and outdoor pools',
          icon: 'spa'
        },
        {
          title: 'Fine Dining',
          description: 'Gourmet restaurant featuring seasonal South Tyrolean cuisine',
          icon: 'food'
        }
      ]
    };
    
    // Add image URLs if not present
    if (mockHotel.main_image && !mockHotel.main_image_url) {
      mockHotel.main_image_url = mockHotel.main_image.startsWith('/') 
        ? mockHotel.main_image 
        : `/images/hotels/${mockHotel.main_image}`;
    }
    
    // Process gallery URLs
    if (mockHotel.gallery && Array.isArray(mockHotel.gallery)) {
      mockHotel.gallery = mockHotel.gallery.map(item => {
        if (!item.url && item.image) {
          return {
            ...item,
            url: item.image.startsWith('/') ? item.image : `/images/hotels/${item.image}`
          };
        }
        return item;
      });
    }
    
    // Process rooms
    if (mockHotel.rooms && Array.isArray(mockHotel.rooms)) {
      mockHotel.rooms = mockHotel.rooms.map(room => {
        if (room.main_image && !room.main_image_url) {
          return {
            ...room,
            main_image_url: room.main_image.startsWith('/') 
              ? room.main_image 
              : `/images/hotels/${room.main_image}`
          };
        }
        return room;
      });
    }
    
    setHotel(mockHotel);
    setIsLoading(false);
  }, [params]);

  return (
    <AssetManagerProvider>
      <HotelDetailPage hotel={hotel} />
    </AssetManagerProvider>
  );
}