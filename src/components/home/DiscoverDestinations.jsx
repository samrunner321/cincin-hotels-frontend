'use client';

import Link from 'next/link';
import DirectusImage from '../../../components/common/DirectusImage';
import { useState, useEffect } from 'react';
import { useDestinations } from '../../hooks/useDirectusData';

export default function DiscoverDestinations() {
  const [activeRegion, setActiveRegion] = useState('mediterranean');
  
  const { destinations, isLoading, isError } = useDestinations({
    limit: 20,
    revalidate: 300 // 5 minutes
  });
  
  const [allDestinations, setAllDestinations] = useState([]);
  
  useEffect(() => {
    if (destinations) {
      setAllDestinations(destinations);
    }
  }, [destinations]);

  if (isLoading || isError || !allDestinations || allDestinations.length === 0) {
    return null;
  }

  const regions = [
    { id: 'mediterranean', name: 'Mediterranean' },
    { id: 'alps', name: 'Alps' },
    { id: 'northern_europe', name: 'Northern Europe' },
    { id: 'central_europe', name: 'Central Europe' },
    { id: 'southern_europe', name: 'Southern Europe' }
  ];

  // Filter destinations by selected region
  const filteredDestinations = allDestinations.filter(
    dest => dest.region === activeRegion
  ).slice(0, 3); // Limit to 3 destinations

  if (filteredDestinations.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-3">Discover by Region</h2>
            <p className="text-gray-600 max-w-lg">
              Explore our handpicked destinations across Europe's most enchanting regions
            </p>
          </div>
          
          <div className="mt-6 md:mt-0">
            <div className="flex flex-wrap gap-2">
              {regions.map(region => (
                <button
                  key={region.id}
                  className={`px-4 py-2 text-sm rounded-full transition-colors whitespace-nowrap ${
                    activeRegion === region.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveRegion(region.id)}
                >
                  {region.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredDestinations.map((destination, index) => (
            <Link 
              href={`/destinations/${destination.slug}`} 
              key={destination.id}
              className={`group relative rounded-lg overflow-hidden aspect-[3/4] ${
                index === 0 ? 'md:col-span-2 md:row-span-2 aspect-square' : ''
              }`}
            >
              {destination.main_image && (
                <DirectusImage
                  fileId={destination.main_image}
                  alt={destination.name}
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                  fill
                />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-2xl font-bold mb-2 group-hover:text-primary-light transition-colors">
                  {destination.name}
                </h3>
                
                <p className="text-white/90 text-sm mb-4">
                  {destination.country}
                </p>
                
                <p className="text-white/80 text-sm mb-6 line-clamp-2">
                  {destination.short_description}
                </p>
                
                <span className="text-white text-sm font-medium border-b border-white pb-1 group-hover:text-primary-light group-hover:border-primary-light transition-colors">
                  Discover {destination.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Link 
            href={`/destinations?region=${activeRegion}`}
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Explore {regions.find(r => r.id === activeRegion)?.name || 'Region'}
          </Link>
        </div>
      </div>
    </section>
  );
}