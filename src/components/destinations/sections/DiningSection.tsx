// @ts-nocheck
'use client';

import { useState } from 'react';
import DirectusImage from '../../../components/common/DirectusImage';
import Link from 'next/link';

interface DiningItem {
  name: string;
  description?: string;
  cuisine?: string;
  price_range?: '$' | '$$' | '$$$' | '$$$$';
  address?: string;
  coordinates?: { lat: number; lng: number };
  image?: string;
}

interface SignatureDish {
  name: string;
  description?: string;
  restaurant?: string;
  image?: string;
}

interface ChefSpotlight {
  name: string;
  restaurant?: string;
  description?: string;
  image?: string;
}

interface DiningSectionProps {
  dining: DiningItem[];
  signature_dishes: SignatureDish[];
  chef_spotlight: ChefSpotlight[];
}

export default function DiningSection({ dining, signature_dishes, chef_spotlight }: DiningSectionProps) {
  const [activeTab, setActiveTab] = useState('restaurants');
  
  if ((!dining || dining.length === 0) && 
      (!signature_dishes || signature_dishes.length === 0) && 
      (!chef_spotlight || chef_spotlight.length === 0)) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">No dining information available for this destination.</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'restaurants':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {dining && dining.length > 0 ? (
              dining.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full">
                  {item.image ? (
                    <div className="aspect-[16/9] relative">
                      <DirectusImage
                        fileId={item.image}
                        alt={item.name}
                        className="object-cover"
                        fill
                      />
                      {item.price_range && (
                        <div className="absolute top-4 right-4 bg-white/90 text-gray-900 text-sm px-3 py-1 rounded-full">
                          {item.price_range}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-[16/9] bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                  
                  <div className="p-5 flex-grow">
                    <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                    
                    {item.cuisine && (
                      <p className="text-sm text-gray-500 mb-3">{item.cuisine}</p>
                    )}
                    
                    {item.description && (
                      <p className="text-gray-700 text-sm mb-4">{item.description}</p>
                    )}
                    
                    {item.address && (
                      <div className="text-sm text-gray-600 mt-auto">
                        <p>{item.address}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-8 text-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">No restaurant information available.</p>
              </div>
            )}
          </div>
        );
      
      case 'dishes':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {signature_dishes && signature_dishes.length > 0 ? (
              signature_dishes.map((dish, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {dish.image ? (
                    <div className="aspect-[4/3] relative">
                      <DirectusImage
                        fileId={dish.image}
                        alt={dish.name}
                        className="object-cover"
                        fill
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                  
                  <div className="p-5">
                    <h3 className="text-lg font-semibold mb-1">{dish.name}</h3>
                    
                    {dish.restaurant && (
                      <p className="text-sm text-primary mb-3">{dish.restaurant}</p>
                    )}
                    
                    {dish.description && (
                      <p className="text-gray-600 text-sm">{dish.description}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 py-8 text-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">No signature dishes information available.</p>
              </div>
            )}
          </div>
        );
      
      case 'chefs':
        return (
          <div className="space-y-6">
            {chef_spotlight && chef_spotlight.length > 0 ? (
              chef_spotlight.map((chef, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row">
                  {chef.image ? (
                    <div className="md:w-1/3 aspect-[4/3] md:aspect-auto relative">
                      <DirectusImage
                        fileId={chef.image}
                        alt={chef.name}
                        className="object-cover"
                        fill
                      />
                    </div>
                  ) : (
                    <div className="md:w-1/3 aspect-[4/3] md:aspect-auto bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                  
                  <div className="md:w-2/3 p-6">
                    <h3 className="text-xl font-semibold mb-1">{chef.name}</h3>
                    
                    {chef.restaurant && (
                      <p className="text-primary font-medium mb-3">{chef.restaurant}</p>
                    )}
                    
                    {chef.description && (
                      <div className="prose prose-sm text-gray-700" dangerouslySetInnerHTML={{ __html: chef.description }} />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">No chef spotlight information available.</p>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Dining & Culinary Experiences</h2>
      
      <div className="mb-6 border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`px-5 py-3 font-medium transition-colors ${
              activeTab === 'restaurants'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Restaurants
          </button>
          
          <button
            onClick={() => setActiveTab('dishes')}
            className={`px-5 py-3 font-medium transition-colors ${
              activeTab === 'dishes'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Signature Dishes
          </button>
          
          <button
            onClick={() => setActiveTab('chefs')}
            className={`px-5 py-3 font-medium transition-colors ${
              activeTab === 'chefs'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Chef Spotlight
          </button>
        </div>
      </div>
      
      {renderContent()}
    </div>
  );
}