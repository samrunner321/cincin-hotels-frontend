'use client';

import DetailHeroBanner from './DetailHeroBanner';
import ContentTabs from './ContentTabs';
import RoomList from './RoomList';
import OverviewSection from './OverviewSection';
import HotelGallery from '../hotels/HotelGallery';
import OriginalsSection from './OriginalsSection';
import BestFoodDrinks from './BestFoodDrinks';
import HotelDestination from './HotelDestination';
import NearbyDestinations from './NearbyDestinations';
import InsideHotel from './InsideHotel';

export default function HotelDetailPage({ hotel }) {
  if (!hotel) {
    return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>;
  }

  return (
    <div className="bg-white">
      <DetailHeroBanner 
        hotelName={hotel.name}
        location={hotel.location}
        description={hotel.short_description || hotel.description}
        backgroundImage={hotel.hero_image || hotel.image || hotel.images?.[0] || "/images/hotels/hotel-1.jpg"}
        translations={hotel.translations || []}
        slug={hotel.slug}
      />
      
      <ContentTabs />
      
      <main>
        {/* 1. Hotel Overview */}
        <OverviewSection 
          hotelDescription={hotel.description}
          overviewImage={hotel.overviewImage || hotel.images?.[1] || "/images/hotels/hotel-2.jpg"}
          translations={hotel.translations || []}
          features={hotel.features || []}
          amenities={hotel.amenities || []}
        />
        
        {/* 2. Gallery */}
        <HotelGallery gallery={hotel.gallery || []} hotelName={hotel.name} />
        
        {/* 3. Inside [Hotelname] */}
        <InsideHotel 
          articles={hotel.articles || []} 
          hotelName={hotel.name}
        />
        
        {/* 4. Rooms & Suites */}
        <RoomList rooms={hotel.rooms || []} />
        
        {/* 5. The Originals */}
        <OriginalsSection 
          name={hotel.owners?.name || "The Originals"}
          description={hotel.owners?.description || hotel.ownerDescription || "The visionaries behind this unique hotel concept."}
          image={hotel.owners?.image || hotel.ownerImage || "/images/hotels/hotel-7.jpg"}
        />
        
        {/* 6. Food & Drinks */}
        <BestFoodDrinks restaurants={hotel.restaurants || []} />
        
        {/* 7. Discover [Destination] */}
        <HotelDestination 
          destination={hotel.destination}
          locale={hotel.current_locale || 'de'}
        />
        
        {/* 8. Explore Nearby */}
        <NearbyDestinations 
          destinations={hotel.nearby_destinations || []}
        />
      </main>
    </div>
  );
}