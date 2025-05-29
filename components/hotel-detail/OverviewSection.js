'use client';

import { useState } from 'react';
import FeatureItem from './FeatureItem';
import AmenityIcon from '../common/AmenityIcon';

export default function OverviewSection({ 
  hotelDescription = "Perched at 2,112 meters in Crans-Montana, Chetzeron blends sustainable luxury with alpine charm. This transformed gondola station offers ski-in/ski-out access, a serene spa with an outdoor pool, and gourmet cuisine celebrating local Valais flavors—all framed by breathtaking views of the Matterhorn and Mont-Blanc.",
  translations = [],
  amenities = [],
  features = [
    {
      icon: "mountains",
      title: "Mountains",
      description: "Spectacular alpine views of surrounding mountains."
    },
    {
      icon: "pool",
      title: "Infinity Pool",
      description: "Heated outdoor infinity pool with panoramic views."
    },
    {
      icon: "spa",
      title: "Wellness Spa",
      description: "Luxurious spa with sauna, steam room, and treatments."
    },
    {
      icon: "beach",
      title: "Fine Dining",
      description: "Farm-to-table cuisine featuring local ingredients."
    }
  ]
}) {
  const [selectedDetail, setSelectedDetail] = useState('essentials');
  
  // Use the description directly (API already handles translations)
  const displayDescription = hotelDescription;
  
  // Expanded hotel information
  const hotelDetails = {
    essentials: [
      { label: "Check-in/Check-out", value: "3 PM / 11 AM" },
      { label: "Rooms", value: "150 rooms and suites" },
      { label: "Area", value: "18,000 sq. meters" },
      { label: "Year Built", value: "2015, renovated 2022" },
      { label: "Languages Spoken", value: "German, English, French, Italian" }
    ],
    services: [
      { label: "Room Service", value: "24 hours" },
      { label: "Concierge", value: "24 hours, personalized service" },
      { label: "Housekeeping", value: "Twice daily" },
      { label: "Laundry", value: "Same-day service available" },
      { label: "Airport Transfer", value: "Luxury vehicles, helicopter available" },
      { label: "Childcare", value: "Professional babysitting services" }
    ],
    amenities: [
      { label: "Pools", value: "Indoor pool, outdoor infinity pool, hot tubs" },
      { label: "Spa", value: "Full service spa, thermal baths, treatments" },
      { label: "Fitness", value: "24-hour gym, yoga studio, personal trainers" },
      { label: "Activities", value: "Hiking, skiing, mountain biking, cooking classes" },
      { label: "Business", value: "Meeting rooms, co-working spaces, high-speed wifi" },
      { label: "Restaurants", value: "Fine dining restaurant, casual bistro, bar, terrace" }
    ],
    special: [
      { label: "Sustainability", value: "Solar powered, locally sourced ingredients, waste reduction program" },
      { label: "Accessibility", value: "Fully accessible rooms and facilities, elevator access to all areas" },
      { label: "Pet Policy", value: "Pet-friendly rooms available with special amenities" },
      { label: "Unique Feature", value: "Direct ski-in/ski-out access, private mountain trails" },
      { label: "Awards", value: "World Luxury Hotel Awards 2022, Green Key certification" }
    ]
  };

  return (
    <section id="overview" className="pt-12 pb-16 bg-white">
      <div className="container mx-auto px-4 max-w-[1280px]">
        <div className="mb-12">
          <h2 className="text-3xl font-light text-center mb-2">Hotel Overview</h2>
          <div className="w-16 h-0.5 bg-[#93A27F] mx-auto"></div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-10">
          {/* Left column - Features & Details */}
          <div className="w-full md:w-1/2">
            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-gray-50 rounded-2xl p-6 transition-all duration-300 hover:shadow-md"
                >
                  <FeatureItem 
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                  />
                </div>
              ))}
            </div>
            
            {/* Detail navigation tabs */}
            <div className="bg-white border-b border-gray-200 mb-6">
              <div className="flex flex-wrap -mb-px">
                {Object.keys(hotelDetails).map((key) => (
                  <button
                    key={key}
                    className={`inline-block py-4 px-4 text-sm font-medium capitalize border-b-2 ${
                      selectedDetail === key
                        ? 'text-[#93A27F] border-[#93A27F]'
                        : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedDetail(key)}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Detail content */}
            <div className="bg-gray-50 p-6 rounded-2xl">
              <div className="grid grid-cols-1 gap-4">
                {hotelDetails[selectedDetail].map((item, idx) => (
                  <div key={idx} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-baseline justify-between">
                      <span className="font-medium text-gray-800">{item.label}</span>
                      <span className="text-gray-600 text-right">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right column - Description & Contact */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="flex-grow"></div>
            
            <div className="mt-auto">
              <p className="text-gray-700 leading-relaxed mb-8">
                {displayDescription}
              </p>
              
              <div className="flex items-center gap-4">
                <a href="#" className="group">
                  <div className="w-8 h-8 rounded-full border border-[#93A27F] flex items-center justify-center transform transition duration-300 group-hover:bg-[#93A27F]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                        className="group-hover:text-white text-[#93A27F] transition">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                </a>
                
                <a href="#" className="group">
                  <div className="w-8 h-8 rounded-full border border-[#93A27F] flex items-center justify-center transform transition duration-300 group-hover:bg-[#93A27F]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                        className="group-hover:text-white text-[#93A27F] transition">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                </a>
                
                <a href="#" className="group">
                  <div className="w-8 h-8 rounded-full border border-[#93A27F] flex items-center justify-center transform transition duration-300 group-hover:bg-[#93A27F]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                        className="group-hover:text-white text-[#93A27F] transition">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Hotel Amenities from Directus */}
        {amenities && amenities.length > 0 && (
          <div className="mt-16 border-t border-gray-100 pt-12">
            <div className="flex flex-wrap items-center justify-center gap-12">
              {amenities.map((amenity) => {
                const amenityData = amenity.hotel_amenities_id || amenity;
                const translation = amenityData.translations?.find(t => t.languages_code === 'en') || {};
                const displayName = translation.name || amenityData.name;
                
                return (
                  <div key={amenityData.id} className="flex flex-col items-center">
                    <div className="w-12 h-12 flex items-center justify-center text-[#93A27F]">
                      <AmenityIcon amenity={amenityData} size={28} />
                    </div>
                    <span className="text-xs text-gray-600 mt-1">{displayName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}