'use client';

import DetailHeroBanner from './DetailHeroBanner';
import ContentTabs from './ContentTabs';
import RoomList from './RoomList';
import OverviewSection from './OverviewSection';
import GallerySection from './GallerySection';
import OriginalsSection from './OriginalsSection';
import { usePathname } from 'next/navigation';

export default function HotelDetailPage({ hotel }) {
  const pathname = usePathname();
  const isRoomsPage = pathname.includes('/rooms');
  
  if (!hotel) {
    return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>;
  }

  // If we're on the rooms specific page, only show relevant content
  if (isRoomsPage) {
    return (
      <>
        <DetailHeroBanner 
          hotelName={hotel.name}
          location={hotel.location}
          description="Browse our selection of rooms and suites"
          backgroundImage={hotel.image || hotel.images?.[0] || "/images/hotels/hotel-1.jpg"}
          slug={hotel.slug}
          isRoomsPage={true}
        />
        
        <ContentTabs />
        
        {/* Kein zusätzlicher Abstand nötig, da ContentTabs im relativen Modus anfängt */}
        <div>
          <RoomList 
            rooms={hotel.rooms || []} 
            fullPage={true}
          />
        </div>
      </>
    );
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
      
      {/* Der Abstand wird jetzt dynamisch vom Spacer in ContentTabs gehandhabt */}
      <div id="content-sections" className="relative z-0">
        <div id="overview" className="scroll-mt-[var(--total-nav-height,136px)]">
          <OverviewSection 
            hotelDescription={hotel.longDescription || hotel.description}
            overviewImage={hotel.overviewImage || hotel.images?.[1] || "/images/hotels/hotel-2.jpg"}
            features={hotel.features || []}
          />
        </div>
        
        <div id="gallery" className="scroll-mt-[var(--total-nav-height,136px)]">
          <GallerySection images={hotel.gallery || hotel.images || []} />
        </div>
        
        <div id="rooms" className="scroll-mt-[var(--total-nav-height,136px)]">
          <RoomList rooms={hotel.rooms || []} />
        </div>
        
        <div id="originals" className="scroll-mt-[var(--total-nav-height,136px)]">
          <OriginalsSection 
            name={hotel.owners?.name || "The Originals"}
            description={hotel.owners?.description || hotel.ownerDescription || "The visionaries behind this unique hotel concept."}
            image={hotel.owners?.image || hotel.ownerImage || "/images/hotels/hotel-7.jpg"}
          />
        </div>
      </div>
    </>
  );
}