'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function NearbyDestinations({ destinations = [] }) {
  const [showAllDestinations, setShowAllDestinations] = useState(false);
  
  // Default destinations if none provided
  const defaultDestinations = [
    {
      id: 1,
      name: "Old Town Harbor",
      region: "Historic Quarter",
      description: "Explore the charming cobblestone streets and centuries-old architecture of the historic harbor district. Discover hidden cafes, artisan shops, and breathtaking viewpoints.",
      highlights: ["Historic Architecture", "Local Markets", "Harbor Views", "Art Galleries"],
      distance: "5 min walk",
      image: "/images/destinations/city.jpg"
    },
    {
      id: 2,
      name: "Paradise Beach",
      region: "Coastal Area",
      description: "Crystal-clear waters and pristine white sand make this secluded beach a perfect escape. Enjoy water sports, beach clubs, and spectacular sunsets.",
      highlights: ["Swimming", "Water Sports", "Beach Clubs", "Sunset Views"],
      distance: "15 min drive",
      image: "/images/destinations/beach.jpg"
    },
    {
      id: 3,
      name: "Mountain Village",
      region: "Alpine Region",
      description: "Traditional mountain village offering authentic local experiences, hiking trails, and panoramic views of the surrounding peaks and valleys.",
      highlights: ["Hiking Trails", "Local Cuisine", "Mountain Views", "Traditional Crafts"],
      distance: "30 min drive",
      image: "/images/destinations/mountain.jpg"
    }
  ];

  const displayDestinations = destinations.length > 0 ? destinations : defaultDestinations;
  const visibleDestinations = showAllDestinations ? displayDestinations : displayDestinations.slice(0, 3);
  const showToggleButton = displayDestinations.length > 3;

  return (
    <section id="destinations" className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-[1500px]">
        <div className="mb-12">
          {/* Same title styling as other sections */}
          <h2 className="text-3xl font-light text-center mb-2">Explore Nearby</h2>
          <div className="w-16 h-0.5 bg-[#93A27F] mx-auto mb-8"></div>
        </div>
        
        {/* Destinations Grid - same layout as rooms/restaurants */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6">
          {visibleDestinations.map((destination, index) => (
            <div
              key={destination.id || index}
              className="transform scale-[0.94] origin-center"
            >
              <div className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Image container - same aspect ratio as rooms */}
                <div className="relative aspect-[4/3] group">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Distance badge */}
                  <div className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-md text-sm font-medium">
                    📍 {destination.distance || destination.distance_from_hotel}
                  </div>
                </div>
                
                {/* Content - same padding as rooms */}
                <div className="p-5">
                  <h3 className="text-base font-medium leading-tight mb-1">{destination.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{destination.region}</p>
                  
                  {/* Description with line clamp */}
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 mb-4">
                    {destination.description}
                  </p>
                  
                  {/* Highlights */}
                  {destination.highlights && destination.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {destination.highlights.slice(0, 3).map((highlight, idx) => (
                        <span 
                          key={idx} 
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {highlight}
                        </span>
                      ))}
                      {destination.highlights.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{destination.highlights.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Action - consistent with other components */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {destination.travel_time || destination.distance}
                    </span>
                    <button className="text-[#93A27F] hover:text-[#7d8a6b] text-sm font-medium hover:underline transition-colors">
                      Explore more →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Toggle button - same as rooms */}
        {showToggleButton && (
          <div className="flex justify-center mt-8">
            <button 
              onClick={() => setShowAllDestinations(!showAllDestinations)}
              className="text-[#93A27F] hover:text-[#7d8a6b] transition-colors flex items-center group"
            >
              <span>{showAllDestinations ? 'View less' : 'View all destinations'}</span>
              <svg 
                className={`ml-2 transition-transform ${showAllDestinations ? 'rotate-180' : ''}`} 
                width="25" 
                height="9" 
                viewBox="0 0 25 9" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M24.3536 4.85355C24.5488 4.65829 24.5488 4.34171 24.3536 4.14645L21.1716 0.964466C20.9763 0.769204 20.6597 0.769204 20.4645 0.964466C20.2692 1.15973 20.2692 1.47631 20.4645 1.67157L23.2929 4.5L20.4645 7.32843C20.2692 7.52369 20.2692 7.84027 20.4645 8.03553C20.6597 8.2308 20.9763 8.2308 21.1716 8.03553L24.3536 4.85355ZM0 5H24V4H0V5Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}