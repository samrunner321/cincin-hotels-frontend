'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';

/**
 * Attraction interface
 */
interface Attraction {
  id: number;
  name: string;
  description: string;
  image?: string;
  menuLink?: string;
  address?: string;
  hours?: string;
  tags?: string[];
  rating?: number;
}

/**
 * Component props interface
 */
interface TabbedAttractionsSectionProps {
  title?: string;
  attractions?: Attraction[];
  defaultActiveTab?: number;
  theme?: 'light' | 'dark';
  fallbackImage?: string;
  showMenu?: boolean;
}

/**
 * TabbedAttractionsSection Component
 * 
 * A component that displays a list of attractions with a tabbed interface,
 * showing details of each attraction when selected.
 */
export default function TabbedAttractionsSection({
  title = "CinCin's Picks: Best Food & Drink in Zermatt",
  attractions = [
    {
      id: 1,
      name: "Chez Vrony",
      description: "A traditional alpine restaurant with a modern twist, offering stunning Matterhorn views."
    },
    {
      id: 2,
      name: "Findlerhof",
      description: "Known for its local specialties and cozy atmosphere."
    },
    {
      id: 3,
      name: "CERVO Mountain Resort Bar",
      description: "A chic spot for après-ski drinks and live music."
    },
    {
      id: 4,
      name: "Elsie's Bar",
      description: "A quaint wine bar perfect for relaxing evenings."
    }
  ],
  defaultActiveTab,
  theme = 'light',
  fallbackImage = '/images/journal/journal-3.png',
  showMenu = true
}: TabbedAttractionsSectionProps) {
  // Set active tab state, defaulting to the first item if not specified
  const [activeTab, setActiveTab] = useState<number>(
    defaultActiveTab || (attractions.length > 0 ? attractions[0].id : 1)
  );

  // Find the currently active attraction
  const activeAttraction = attractions.find(item => item.id === activeTab);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent, itemId: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveTab(itemId);
    }
  }, []);

  // Set up background colors based on theme
  const bgColors = {
    light: {
      container: 'bg-gray-100',
      panel: 'bg-white',
      sidebar: 'bg-gray-50',
      activeText: 'text-blue-600',
      inactiveText: 'text-gray-800'
    },
    dark: {
      container: 'bg-gray-800',
      panel: 'bg-gray-700',
      sidebar: 'bg-gray-900',
      activeText: 'text-blue-300',
      inactiveText: 'text-gray-200'
    }
  };
  
  const colors = bgColors[theme];

  return (
    <section className={`py-12 ${colors.container}`}>
      <div className="container mx-auto px-4">
        <div className={`${colors.panel} rounded-lg shadow-md overflow-hidden`}>
          <div className="grid grid-cols-1 md:grid-cols-5">
            <div className={`md:col-span-2 ${colors.sidebar} min-h-[300px] relative`}>
              {attractions.map(item => (
                <div 
                  key={item.id}
                  className={`absolute inset-0 bg-cover bg-center transition-opacity duration-300 p-8 
                    ${activeTab === item.id ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${item.image || fallbackImage})`
                  }}
                  aria-hidden={activeTab !== item.id}
                >
                  <div className="text-xl font-medium text-white">{item.name}</div>
                  
                  {/* Additional details when available */}
                  {item.address && (
                    <div className="text-white/80 mt-2 text-sm">
                      <p>{item.address}</p>
                    </div>
                  )}
                  
                  {item.hours && (
                    <div className="text-white/80 mt-1 text-sm">
                      <p>{item.hours}</p>
                    </div>
                  )}
                  
                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.tags.map((tag, idx) => (
                        <span key={idx} className="inline-block px-2 py-1 bg-white/20 text-white text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Menu button */}
                  {showMenu && item.menuLink && (
                    <div className="absolute bottom-6 right-6">
                      <a 
                        href={item.menuLink}
                        className="px-3 py-1 border border-white text-white rounded hover:bg-white hover:text-gray-800 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Menu
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="md:col-span-3 p-8">
              <h3 className="text-2xl font-semibold mb-8">{title}</h3>
              
              <div className="space-y-6">
                {attractions.map((item, index) => (
                  <div 
                    key={item.id}
                    className={`flex cursor-pointer group transition-colors ${
                      activeTab === item.id ? colors.activeText : colors.inactiveText
                    }`}
                    onMouseEnter={() => setActiveTab(item.id)}
                    onClick={() => setActiveTab(item.id)}
                    onKeyDown={(e) => handleKeyDown(e as unknown as KeyboardEvent, item.id)}
                    tabIndex={0}
                    role="tab"
                    aria-selected={activeTab === item.id}
                    aria-controls={`attraction-panel-${item.id}`}
                    id={`attraction-tab-${item.id}`}
                  >
                    <div className="mr-4 text-3xl font-medium">
                      <span className="inline-block w-6">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-medium">{item.name}</h4>
                      <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} group-hover:${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        {item.description}
                      </p>
                      
                      {/* Display rating if available */}
                      {item.rating && (
                        <div className="mt-1 flex items-center">
                          {Array.from({ length: 5 }, (_, i) => (
                            <svg 
                              key={i} 
                              className={`w-4 h-4 ${i < item.rating! ? 'text-yellow-400' : 'text-gray-300'}`} 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}