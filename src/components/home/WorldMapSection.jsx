'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDestinations } from '../../hooks/useDirectusData';

export default function WorldMapSection() {
  const { destinations, isLoading, isError } = useDestinations({
    limit: 30,
    revalidate: 300 // 5 minutes
  });
  
  const [mapDestinations, setMapDestinations] = useState([]);
  const [hoveredDestination, setHoveredDestination] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('all');
  
  useEffect(() => {
    if (destinations) {
      setMapDestinations(destinations);
    }
  }, [destinations]);

  if (isLoading || isError || !mapDestinations || mapDestinations.length === 0) {
    return null;
  }

  // Filter destinations by region if selected
  const filteredDestinations = selectedRegion === 'all'
    ? mapDestinations
    : mapDestinations.filter(dest => dest.region === selectedRegion);

  const regions = [
    { id: 'all', name: 'All Regions' },
    { id: 'mediterranean', name: 'Mediterranean' },
    { id: 'alps', name: 'Alps' },
    { id: 'northern_europe', name: 'Northern Europe' },
    { id: 'central_europe', name: 'Central Europe' },
    { id: 'southern_europe', name: 'Southern Europe' }
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Explore Our Destinations</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">
          Discover CinCin Hotels & Resorts across the globe
        </p>

        <div className="mb-6 flex justify-center">
          <div className="flex flex-wrap gap-2 justify-center">
            {regions.map(region => (
              <button
                key={region.id}
                className={`px-4 py-2 text-sm rounded-full transition-colors ${
                  selectedRegion === region.id
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedRegion(region.id)}
              >
                {region.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="relative bg-white rounded-xl shadow-md p-4 overflow-hidden">
          {/* World Map Image */}
          <div className="relative w-full aspect-[2/1]">
            <Image
              src="/images/world-map.png" // This would need to be provided
              alt="World Map"
              fill
              className="object-contain"
            />
            
            {/* Destination Markers */}
            {filteredDestinations.map(destination => {
              if (!destination.coordinates) return null;
              
              const { lat, lng } = destination.coordinates;
              // Convert lat/lng to x/y percentages for positioning on the map
              // This is a simplified approach and would need adjustment based on actual map projection
              const x = ((lng + 180) / 360) * 100; // Convert longitude to x percentage
              const y = ((90 - lat) / 180) * 100;  // Convert latitude to y percentage
              
              return (
                <div
                  key={destination.id}
                  className={`absolute w-3 h-3 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer
                    ${hoveredDestination === destination.id ? 'bg-secondary scale-150 z-20' : 'bg-primary z-10'}
                    transition-all duration-300`}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  onMouseEnter={() => setHoveredDestination(destination.id)}
                  onMouseLeave={() => setHoveredDestination(null)}
                >
                  {hoveredDestination === destination.id && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white shadow-lg rounded-lg p-3 z-30 min-w-[200px]">
                      <h4 className="font-semibold text-gray-900">{destination.name}</h4>
                      <p className="text-xs text-gray-600 mb-2">{destination.country}</p>
                      <Link 
                        href={`/destinations/${destination.slug}`}
                        className="text-xs text-primary font-medium hover:underline"
                      >
                        View Details
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="mt-8 text-center">
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