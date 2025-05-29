'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DestinationDetailPage from '../../../components/destinations/DestinationDetailPage';

// Mock data for destinations
const destinations = {
  'mykonos': {
    name: 'Mykonos',
    country: 'Greece',
    description: 'A Cycladic paradise with stunning Aegean views, iconic windmills, and vibrant nightlife.',
    image: '/images/destinations/beach.jpg'
  },
  'crans-montana': {
    name: 'Crans-Montana',
    country: 'Switzerland',
    description: 'A prestigious Alpine resort offering panoramic mountain views, world-class skiing, and championship golf courses.',
    image: '/images/destinations/mountain.jpg'
  },
  'south-tyrol': {
    name: 'South Tyrol',
    country: 'Italy',
    description: 'A unique blend of Alpine and Mediterranean cultures with breathtaking Dolomite landscapes and award-winning cuisine.',
    image: '/images/destinations/south-tyrol.jpg'
  },
  'berlin': {
    name: 'Berlin',
    country: 'Germany',
    description: 'A dynamic city blending rich history with cutting-edge creativity and vibrant cultural scenes.',
    image: '/images/destinations/city.jpg'
  }
};

export default function DestinationPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;
  
  const destination = destinations[slug];
  
  useEffect(() => {
    if (!destination) {
      // If destination is not found, redirect to destinations page
      router.push('/destinations');
    }
  }, [destination, router]);
  
  if (!destination) {
    return (
      <div className="container mx-auto py-24 px-4 text-center">
        <h1 className="text-2xl font-brooklyn">Loading destination...</h1>
      </div>
    );
  }
  
  return <DestinationDetailPage destination={destination} />;
}