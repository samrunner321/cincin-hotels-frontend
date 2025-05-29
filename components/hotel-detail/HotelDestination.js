'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function HotelDestination({ destination, locale = 'en' }) {
  // Default data if no destination provided
  const defaultDestination = {
    name: "Mediterranean Coast",
    slug: "mediterranean-coast",
    country: "Greece",
    description: "Experience the perfect blend of ancient history and modern luxury in this stunning coastal destination. With year-round sunshine, crystal-clear waters, and vibrant local culture, it's the ideal escape for discerning travelers.",
    highlights: ["Ancient Sites", "Beach Life", "Local Cuisine", "Island Hopping", "Nightlife"],
    best_travel_time: "April to October",
    climate_info: "Mediterranean climate with warm, dry summers and mild winters",
    must_see_attractions: [
      { name: "Historic Old Town", description: "Wander through centuries-old streets" },
      { name: "Crystal Beaches", description: "Pristine waters and golden sand" },
      { name: "Local Markets", description: "Authentic local products and crafts" }
    ],
    hero_image: "/images/destinations/santorini.jpg"
  };

  const displayDestination = destination || defaultDestination;

  return (
    <section id="hotel-destination" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-[1500px]">
        <div className="mb-12">
          {/* Title with underline - consistent with other sections */}
          <h2 className="text-3xl font-light text-center mb-2">
            Discover {displayDestination.name}
          </h2>
          <div className="w-16 h-0.5 bg-[#93A27F] mx-auto mb-8"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Image */}
          <div className="relative h-96 rounded-2xl overflow-hidden">
            <Image
              src={displayDestination.hero_image || defaultDestination.hero_image}
              alt={displayDestination.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          
          {/* Right side - Information */}
          <div className="space-y-6">
            {/* Description */}
            <div>
              <p className="text-gray-700 leading-relaxed">
                {displayDestination.description}
              </p>
            </div>
            
            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Best Travel Time */}
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <span className="text-xl">🌞</span> Best Time to Visit
                </h3>
                <p className="text-gray-600 text-sm">{displayDestination.best_travel_time}</p>
              </div>
              
              {/* Climate */}
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <span className="text-xl">🌡️</span> Climate
                </h3>
                <p className="text-gray-600 text-sm">{displayDestination.climate_info}</p>
              </div>
            </div>
            
            {/* Highlights */}
            {displayDestination.highlights && displayDestination.highlights.length > 0 && (
              <div>
                <h3 className="font-medium mb-3">Destination Highlights</h3>
                <div className="flex flex-wrap gap-2">
                  {displayDestination.highlights.map((highlight, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Must-See Attractions */}
            {displayDestination.must_see_attractions && displayDestination.must_see_attractions.length > 0 && (
              <div>
                <h3 className="font-medium mb-3">Must-See Attractions</h3>
                <ul className="space-y-2">
                  {displayDestination.must_see_attractions.slice(0, 3).map((attraction, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-[#93A27F] mt-1">•</span>
                      <div>
                        <span className="font-medium text-sm">{attraction.name}</span>
                        {attraction.description && (
                          <p className="text-gray-600 text-sm">{attraction.description}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Link to destination detail page */}
            <div className="pt-4">
              <Link 
                href={`/${locale}/destinations/${displayDestination.slug}`}
                className="inline-flex items-center gap-2 text-[#93A27F] hover:text-[#7d8a6b] hover:underline transition-colors"
              >
                Explore more about {displayDestination.name}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}