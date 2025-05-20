// @ts-nocheck
'use client';

import { Destination, Hotel } from '../../lib/directus';
import DirectusImage from '../../../components/common/DirectusImage';
import HotelList from '../../../components/hotels/HotelList';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ActivitiesSection from './sections/ActivitiesSection';
import DiningSection from './sections/DiningSection';
import TravelInfoSection from './sections/TravelInfoSection';
import WeatherSection from './sections/WeatherSection';
import HighlightsSection from './sections/HighlightsSection';

interface DestinationDetailPageProps {
  destination: Destination & { hotels: Hotel[] };
}

export default function DestinationDetailPage({ destination }: DestinationDetailPageProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <div className="prose prose-lg max-w-none mb-10" dangerouslySetInnerHTML={{ __html: destination.description }} />
            
            {destination.highlights && destination.highlights.length > 0 && (
              <HighlightsSection highlights={destination.highlights} />
            )}
          </div>
        );
      case 'activities':
        return (
          <ActivitiesSection activities={destination.activities || []} />
        );
      case 'dining':
        return (
          <DiningSection 
            dining={destination.dining || []} 
            signature_dishes={destination.signature_dishes || []} 
            chef_spotlight={destination.chef_spotlight || []}
          />
        );
      case 'travel':
        return (
          <div className="grid grid-cols-1 gap-10">
            <TravelInfoSection travel_info={destination.travel_info || []} />
            <WeatherSection weather={destination.weather || []} />
          </div>
        );
      case 'hotels':
        return (
          <div>
            <h3 className="text-2xl font-semibold mb-6">Hotels in {destination.name}</h3>
            {destination.hotels && destination.hotels.length > 0 ? (
              <div className="mt-8">
                <HotelList initialHotels={destination.hotels} categories={[]} />
              </div>
            ) : (
              <p className="text-gray-600">No hotels available in this destination yet.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative h-[60vh] mb-10 rounded-xl overflow-hidden">
        {destination.main_image && (
          <DirectusImage
            fileId={destination.main_image}
            alt={destination.name}
            className="object-cover w-full h-full"
            fill
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{destination.name}</h1>
            <p className="text-xl opacity-90 mb-4">{destination.subtitle}</p>
            <div className="flex items-center text-sm gap-3">
              <span>{destination.country}</span>
              {destination.region && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70"></span>
                  <span>{destination.region.replace('_', ' ')}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-2/3">
          {/* Navigation Tabs */}
          <div className="mb-8 border-b">
            <div className="flex overflow-x-auto hide-scrollbar">
              {['overview', 'activities', 'dining', 'travel', 'hotels'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-center whitespace-nowrap font-medium transition-colors ${
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
          {renderTabContent()}
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3">
          <div className="sticky top-24 bg-gray-50 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-6">About {destination.name}</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                <p className="text-gray-900">{destination.country}</p>
              </div>
              
              {destination.region && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Region</h4>
                  <p className="text-gray-900">{destination.region.replace('_', ' ')}</p>
                </div>
              )}
              
              {destination.hotels && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Hotels</h4>
                  <p className="text-gray-900">{destination.hotels.length} properties</p>
                </div>
              )}
              
              {destination.weather && destination.weather.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Best Time to Visit</h4>
                  <p className="text-gray-900">
                    {destination.weather
                      .sort((a, b) => b.temp_high - a.temp_high)
                      .slice(0, 2)
                      .map(w => w.season.charAt(0).toUpperCase() + w.season.slice(1))
                      .join(', ')}
                  </p>
                </div>
              )}
            </div>
            
            {destination.coordinates && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Location</h4>
                <div className="h-48 bg-gray-200 rounded-lg overflow-hidden">
                  {/* Map placeholder - would integrate with a map service in a real implementation */}
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <p className="text-gray-600 text-sm">Map: {destination.coordinates.lat.toFixed(2)}, {destination.coordinates.lng.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}
            
            {destination.hotels && destination.hotels.length > 0 && (
              <div>
                <Link 
                  href="#hotels" 
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('hotels');
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="block w-full py-3 px-4 bg-primary text-white text-center rounded-lg font-medium hover:bg-primary-dark transition-colors"
                >
                  Browse Hotels
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}