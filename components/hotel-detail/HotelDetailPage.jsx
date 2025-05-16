'use client';

import DetailHeroBanner from './DetailHeroBanner';
import ContentTabs from './ContentTabs';
import RoomList from './RoomList';
import OverviewSection from './OverviewSection';
import GallerySection from './GallerySection';
import OriginalsSection from './OriginalsSection';

export default function HotelDetailPage({ hotel }) {
  if (!hotel) {
    return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>;
  }

  return (
    <>
      <DetailHeroBanner 
        hotelName={hotel.name}
        location={hotel.location}
        description={hotel.description}
        backgroundImage={hotel.image || hotel.images?.[0] || "/images/hotels/hotel-1.jpg"}
        slug={hotel.slug}
      />
      
      <ContentTabs />
      
      <RoomList rooms={hotel.rooms || []} />
      
      <div id="content-sections">
        <OverviewSection 
          hotelDescription={hotel.longDescription || hotel.description}
          overviewImage={hotel.overviewImage || hotel.images?.[1] || "/images/hotels/hotel-2.jpg"}
          features={hotel.features || []}
        />
        
        <GallerySection images={hotel.gallery || hotel.images || []} />
        
        <OriginalsSection 
          name={hotel.owners?.name || "The Originals"}
          description={hotel.owners?.description || hotel.ownerDescription || "The visionaries behind this unique hotel concept."}
          image={hotel.owners?.image || hotel.ownerImage || "/images/hotels/hotel-7.jpg"}
        />
      </div>
    </>
  );
}