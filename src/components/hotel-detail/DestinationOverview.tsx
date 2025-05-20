// @ts-nocheck
'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useFeatureInteraction } from '../../hooks/useFeatureInteraction';
import { DestinationData } from '../../types/advanced-ui';

interface DestinationOverviewProps {
  /** Destination data to display */
  destinationData?: DestinationData;
  /** Initial active tab */
  initialTab?: 'overview' | 'activities' | 'transport';
  /** Enable tab switching */
  enableTabs?: boolean;
}

/**
 * DestinationOverview Component
 * 
 * Displays detailed information about a destination with interactive tabs
 * for Overview, Activities, and Transportation options
 */
export default function DestinationOverview({ 
  destinationData, 
  initialTab = 'overview',
  enableTabs = true 
}: DestinationOverviewProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  // Configure useFeatureInteraction for interactive elements
  const mapInteraction = useFeatureInteraction({
    featureId: 'destination-map',
    tooltip: {
      enabled: true,
      position: 'top',
      text: 'Open interactive map view',
      showArrow: true,
    },
    highlight: {
      enabled: true,
      effect: 'glow',
      duration: 800,
    },
  });
  
  const tabsInteraction = useFeatureInteraction({
    featureId: 'destination-tabs',
    interactionTypes: ['hover', 'click'],
    onInteraction: (type, id) => {
      if (type === 'click') {
        // Handle tab interaction in parent component
      }
    },
  });
  
  // Create interactions for each tab
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'activities', label: 'Activities' },
    { id: 'getting-there', label: 'Getting There' }
  ];

  const tabInteractions = tabs.map(tab => 
    useFeatureInteraction({
      featureId: `tab-${tab.id}`,
      initialState: activeTab === tab.id ? 'active' : 'idle',
      interactionTypes: ['hover', 'click'],
      onInteraction: (type, id) => {
        if (type === 'click' && enableTabs) {
          setActiveTab(tab.id as 'overview' | 'activities' | 'transport');
        }
      },
    })
  );

  // Activity interactions
  const createActivityInteractions = (activityCount: number) => {
    return Array.from({ length: activityCount }).map((_, index) => 
      useFeatureInteraction({
        featureId: `activity-${index}`,
        tooltip: {
          enabled: true,
          position: 'top',
          text: 'View activity details',
          showArrow: true,
          autoHideDelay: 2000,
        },
        highlight: {
          enabled: true,
          effect: 'pulse',
          duration: 600,
        },
      })
    );
  };
  
  // Placeholder data - in a real implementation this would be passed from the page or API
  const destination = destinationData || {
    name: "Crans-Montana",
    slug: "crans-montana",
    region: "Valais",
    country: "Switzerland",
    description: "Perched on a sun-drenched plateau high above the Rhône Valley, Crans-Montana combines Alpine authenticity with cosmopolitan luxury. With breathtaking views of the Swiss Alps including the Matterhorn and Mont Blanc, this dual-village resort offers exceptional skiing in winter and a renowned golf scene in summer.",
    image: "/images/hotels/hotel-3.jpg",
    highlights: [
      "Breathtaking views of the Swiss Alps",
      "140km of pristine ski slopes for all levels",
      "World-class golf courses including the Omega European Masters venue",
      "Exclusive shopping and dining",
      "300+ days of sunshine per year"
    ],
    activities: [
      { name: "Alpine Skiing", season: "Winter", image: "/images/hotels/hotel-5.jpg" },
      { name: "Golf", season: "Summer", image: "/images/hotels/hotel-6.jpg" },
      { name: "Hiking", season: "Summer/Fall", image: "/images/hotels/hotel-7.jpg" },
      { name: "Mountain Biking", season: "Summer", image: "/images/hotels/hotel-1.jpg" }
    ],
    transport: {
      airports: [
        { name: "Geneva Airport", distance: "180 km", transferTime: "2 hours" },
        { name: "Zurich Airport", distance: "300 km", transferTime: "3 hours" }
      ],
      train: "Direct trains to Sierre, then funicular or bus to Crans-Montana",
      car: "Easy access via A9 motorway, then mountain road to resort",
      local: "Free shuttle buses throughout the resort area"
    }
  };
  
  // Create interactions for activities
  const activityInteractions = createActivityInteractions(destination.activities.length);
  
  // Transport method interactions
  const transportInteractions = {
    air: useFeatureInteraction({
      featureId: 'transport-air',
      tooltip: {
        enabled: true,
        position: 'top',
        text: 'Airports near ' + destination.name,
        showArrow: true,
      }
    }),
    train: useFeatureInteraction({
      featureId: 'transport-train',
      tooltip: {
        enabled: true,
        position: 'top',
        text: 'Train connections',
        showArrow: true,
      }
    }),
    car: useFeatureInteraction({
      featureId: 'transport-car',
      tooltip: {
        enabled: true,
        position: 'top',
        text: 'Driving directions',
        showArrow: true,
      }
    }),
    local: useFeatureInteraction({
      featureId: 'transport-local',
      tooltip: {
        enabled: true,
        position: 'top',
        text: 'Local transportation',
        showArrow: true,
      }
    })
  };

  // Helper for transport icon based on type
  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'air':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 23h14a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2M7 12h10M7 12l-4-8h4l3 4h4l3-4h4l-4 8M7 12v7M17 12v7" />
          </svg>
        );
      case 'train':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l-1 1M4 8l-1-1M20 16l1 1M20 8l1-1M12 2v20M2 12h20" />
          </svg>
        );
      case 'car':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 17h14M5 12h14M12 17v4M12 5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
          </svg>
        );
      case 'local':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12M8 12h12M8 17h12M3 7h.01M3 12h.01M3 17h.01" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        );
    }
  };

  return (
    <section ref={sectionRef} className="py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-brooklyn text-gray-900">
                About {destination.name}
              </h2>
              <p className="text-gray-600">
                {destination.region}, {destination.country}
              </p>
            </div>
            <Link 
              href={`/destinations/${destination.slug}`}
              className="inline-flex items-center text-brand-olive-400 hover:text-brand-olive-500 transition-colors font-brooklyn"
            >
              <span>Explore full destination</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
          
          {/* Tabs navigation with interactive features */}
          <div 
            className="flex border-b border-gray-200 mb-6"
            {...tabsInteraction.getFeatureProps()}
          >
            {tabs.map((tab, index) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'activities' | 'transport')}
                className={`py-3 px-4 md:px-6 font-brooklyn text-sm transition-colors relative ${
                  activeTab === tab.id 
                    ? 'text-brand-olive-400' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                {...tabInteractions[index].getFeatureProps()}
                aria-selected={activeTab === tab.id}
                role="tab"
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-olive-400"
                    layoutId="activeTabIndicator"
                  />
                )}
                
                {/* Tooltip for tab */}
                {tabInteractions[index].isTooltipVisible && (
                  <div
                    {...tabInteractions[index].getTooltipProps()}
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded z-10 whitespace-nowrap"
                  >
                    View {tab.label.toLowerCase()} information
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </motion.div>
        
        {/* Tab content with optimized AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
                <div className="md:col-span-3">
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {destination.description}
                  </p>
                  
                  <h3 className="text-lg font-brooklyn text-gray-900 mb-3">Destination Highlights</h3>
                  <ul className="space-y-2 mb-6">
                    {destination.highlights.map((highlight, index) => (
                      <motion.li 
                        key={index}
                        className="flex items-start"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + (index * 0.1) }}
                      >
                        <svg className="w-5 h-5 text-brand-olive-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-gray-700">{highlight}</span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  <Link 
                    href={`/destinations/${destination.slug}`}
                    className="inline-flex items-center text-white bg-brand-olive-400 hover:bg-brand-olive-500 px-5 py-2.5 rounded-md font-brooklyn text-sm transition-colors"
                  >
                    Discover More About {destination.name}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
                
                <div className="md:col-span-2">
                  <div className="rounded-lg overflow-hidden shadow-sm">
                    <Image 
                      src={destination.image} 
                      alt={destination.name} 
                      width={400} 
                      height={300} 
                      className="w-full h-auto"
                    />
                  </div>
                  
                  {/* Interactive location map with interaction hook */}
                  <div 
                    className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-100"
                    {...mapInteraction.getFeatureProps()}
                  >
                    <h4 className="font-brooklyn text-gray-900 text-sm mb-2">View on Map</h4>
                    <div className="relative h-[150px] bg-gray-200 rounded overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Link
                          href={`/destinations/${destination.slug}`}
                          className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-md text-sm font-brooklyn text-gray-900 hover:bg-white transition-colors"
                        >
                          Open interactive map
                        </Link>
                      </div>
                      <Image
                        src="/images/misc/world-map.webp"
                        alt="Location map"
                        fill
                        className="object-cover opacity-50"
                      />
                    </div>
                    
                    {/* Map tooltip */}
                    {mapInteraction.isTooltipVisible && (
                      <div
                        {...mapInteraction.getTooltipProps()}
                        className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded z-10"
                      >
                        {mapInteraction.tooltip?.text}
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'activities' && (
              <div className="space-y-6">
                <p className="text-gray-700">
                  {destination.name} offers a wide range of activities throughout the year, from winter sports to summer adventures.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {destination.activities.map((activity, index) => (
                    <motion.div 
                      key={index}
                      className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 
                                transform transition-all duration-200 hover:shadow-md"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      {...activityInteractions[index].getFeatureProps()}
                    >
                      <div className="relative h-40">
                        <Image 
                          src={activity.image} 
                          alt={activity.name} 
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-xs px-2 py-1 rounded-full font-brooklyn text-gray-700">
                          {activity.season}
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-brooklyn text-gray-900">{activity.name}</h4>
                      </div>
                      
                      {/* Activity tooltip */}
                      {activityInteractions[index].isTooltipVisible && (
                        <div
                          {...activityInteractions[index].getTooltipProps()}
                          className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded z-10 whitespace-nowrap"
                        >
                          {activity.name} in {destination.name}
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <Link 
                    href={`/destinations/${destination.slug}#activities`}
                    className="inline-flex items-center text-brand-olive-400 hover:text-brand-olive-500 font-brooklyn"
                  >
                    See all activities in {destination.name}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
            
            {activeTab === 'getting-there' && (
              <div className="space-y-6">
                <p className="text-gray-700">
                  {destination.name} is easily accessible by plane, train, or car, with excellent connections from major cities.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div 
                    className="bg-gray-50 rounded-lg p-5 border border-gray-100 transition-all duration-200 hover:shadow-md"
                    {...transportInteractions.air.getFeatureProps()}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-brand-olive-400/10 flex items-center justify-center text-brand-olive-400 mr-3">
                        {getTransportIcon('air')}
                      </div>
                      <h4 className="font-brooklyn text-gray-900">By Air</h4>
                    </div>
                    
                    <div className="space-y-3 ml-13">
                      {destination.transport.airports.map((airport, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-700">{airport.name}</span>
                          <span className="text-gray-500">{airport.transferTime} ({airport.distance})</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Transport tooltip */}
                    {transportInteractions.air.isTooltipVisible && (
                      <div
                        {...transportInteractions.air.getTooltipProps()}
                        className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded z-10 whitespace-nowrap"
                      >
                        {transportInteractions.air.tooltip?.text}
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
                      </div>
                    )}
                  </div>
                  
                  <div 
                    className="bg-gray-50 rounded-lg p-5 border border-gray-100 transition-all duration-200 hover:shadow-md"
                    {...transportInteractions.train.getFeatureProps()}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-brand-olive-400/10 flex items-center justify-center text-brand-olive-400 mr-3">
                        {getTransportIcon('train')}
                      </div>
                      <h4 className="font-brooklyn text-gray-900">By Train</h4>
                    </div>
                    
                    <p className="text-sm text-gray-700">{destination.transport.train}</p>
                    
                    {/* Transport tooltip */}
                    {transportInteractions.train.isTooltipVisible && (
                      <div
                        {...transportInteractions.train.getTooltipProps()}
                        className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded z-10 whitespace-nowrap"
                      >
                        {transportInteractions.train.tooltip?.text}
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
                      </div>
                    )}
                  </div>
                  
                  <div 
                    className="bg-gray-50 rounded-lg p-5 border border-gray-100 transition-all duration-200 hover:shadow-md"
                    {...transportInteractions.car.getFeatureProps()}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-brand-olive-400/10 flex items-center justify-center text-brand-olive-400 mr-3">
                        {getTransportIcon('car')}
                      </div>
                      <h4 className="font-brooklyn text-gray-900">By Car</h4>
                    </div>
                    
                    <p className="text-sm text-gray-700">{destination.transport.car}</p>
                    
                    {/* Transport tooltip */}
                    {transportInteractions.car.isTooltipVisible && (
                      <div
                        {...transportInteractions.car.getTooltipProps()}
                        className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded z-10 whitespace-nowrap"
                      >
                        {transportInteractions.car.tooltip?.text}
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
                      </div>
                    )}
                  </div>
                  
                  <div 
                    className="bg-gray-50 rounded-lg p-5 border border-gray-100 transition-all duration-200 hover:shadow-md"
                    {...transportInteractions.local.getFeatureProps()}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-brand-olive-400/10 flex items-center justify-center text-brand-olive-400 mr-3">
                        {getTransportIcon('local')}
                      </div>
                      <h4 className="font-brooklyn text-gray-900">Local Transport</h4>
                    </div>
                    
                    <p className="text-sm text-gray-700">{destination.transport.local}</p>
                    
                    {/* Transport tooltip */}
                    {transportInteractions.local.isTooltipVisible && (
                      <div
                        {...transportInteractions.local.getTooltipProps()}
                        className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded z-10 whitespace-nowrap"
                      >
                        {transportInteractions.local.tooltip?.text}
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                  <p className="text-gray-600 text-sm mb-2">Need help arranging transportation?</p>
                  <Link 
                    href="/contact"
                    className="inline-flex items-center text-brand-olive-400 hover:text-brand-olive-500 font-brooklyn text-sm"
                  >
                    Contact our concierge service
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}