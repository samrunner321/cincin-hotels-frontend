'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DirectusImage from '../../../components/common/DirectusImage';
import { useDestinations } from '../../hooks/useDirectusData';

export default function PopularDestinations() {
  const { destinations, isLoading, isError } = useDestinations({
    popular: true,
    limit: 6,
    revalidate: 300 // 5 minutes
  });
  
  const [popularDestinations, setPopularDestinations] = useState([]);
  
  useEffect(() => {
    if (destinations) {
      setPopularDestinations(destinations);
    }
  }, [destinations]);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-[4/3] bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-16 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError || !popularDestinations || popularDestinations.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Popular Destinations</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Discover our most sought-after destinations, featuring extraordinary hotels and unforgettable experiences.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularDestinations.map((destination) => (
            <Link 
              href={`/destinations/${destination.slug}`} 
              key={destination.id}
              className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                {destination.main_image && (
                  <DirectusImage
                    fileId={destination.main_image}
                    alt={destination.name}
                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    widths={[400, 600, 800]}
                    fill
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl font-bold mb-1 group-hover:text-primary-light transition-colors">
                    {destination.name}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {destination.country}
                    {destination.region && ` • ${destination.region.replace('_', ' ')}`}
                  </p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 text-sm mb-4">{destination.short_description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-primary font-semibold group-hover:underline">
                    Explore
                  </span>
                  <span className="text-sm text-gray-500">
                    {destination.hotels?.length || 0} hotels
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            href="/destinations" 
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            View All Destinations
          </Link>
        </div>
      </div>
    </section>
  );
}