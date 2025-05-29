'use client';

import { useEffect } from 'react';
import DestinationHero from './detail/DestinationHero';
import DestinationContentTabs from './detail/DestinationContentTabs';
import OverviewSection from './detail/OverviewSection';
import HotelsSection from './detail/HotelsSection';
import DiningSection from './detail/DiningSection';
import ActivitiesSection from './detail/ActivitiesSection';

export default function DestinationDetailPage({ 
  destination = {
    name: "Mykonos",
    country: "Greece",
    description: "A Cycladic paradise with stunning Aegean views, iconic windmills, and vibrant nightlife.",
    image: "/images/destinations/beach.jpg"
  }
}) {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    console.log('DestinationDetailPage received:', {
      name: destination.name,
      hotelsCount: destination.hotels?.length || 0,
      restaurantsCount: destination.restaurants?.length || 0,
      hotels: destination.hotels,
      restaurants: destination.restaurants
    });
  }, []);

  return (
    <main>
      <DestinationHero 
        destinationName={destination.name}
        country={destination.country}
        description={destination.description}
        backgroundImage={destination.hero_image || destination.image}
        exploreButtonText={destination.hero_explore_button}
      />
      
      <DestinationContentTabs destination={destination} />
      
      <OverviewSection destination={destination.name} destinationData={destination} overviewData={destination} />
      
      <HotelsSection 
        destination={destination.name} 
        hotels={destination.hotels}
        viewDetailsText={destination.common_view_details}
        showMoreText={destination.common_show_more}
        showLessText={destination.common_show_less}
      />
      
      <DiningSection 
        destination={destination.name} 
        restaurants={destination.restaurants}
        diningData={destination}
      />
      
      <ActivitiesSection 
        destination={destination.name}
        activitiesData={destination} 
      />
    </main>
  );
}