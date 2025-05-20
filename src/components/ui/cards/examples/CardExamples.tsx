import React from 'react';
import { BaseCard, HotelCard, DestinationCard } from '../';

export const CardExamples: React.FC = () => {
  // Example hotel data
  const exampleHotel = {
    id: '1',
    name: 'Hotel Schgaguler',
    slug: 'hotel-schgaguler',
    location: {
      city: 'Castelrotto',
      country: 'Italy',
    },
    description: 'A stunning contemporary hotel nestled in the heart of the Dolomites, offering breathtaking mountain views and exceptional alpine hospitality.',
    image: {
      id: 'hotel-schgaguler-image',
      title: 'Hotel Schgaguler',
    },
    rating: 4.8,
    pricePerNight: 320,
    currency: '€',
    categories: [
      { id: 'cat1', name: 'Mountain' },
      { id: 'cat2', name: 'Design' },
      { id: 'cat3', name: 'Spa', color: '#20a4f3' },
    ],
  };

  // Example destination data
  const exampleDestination = {
    id: '1',
    name: 'South Tyrol',
    slug: 'south-tyrol',
    location: {
      country: 'Italy',
      region: 'Alps',
    },
    description: 'Discover the stunning beauty of South Tyrol, where Alpine traditions meet Mediterranean charm. Explore majestic mountains, serene lakes, and charming villages.',
    image: {
      id: 'south-tyrol-image',
      title: 'South Tyrol',
    },
    hotelCount: 12,
    attractionCount: 24,
    categories: [
      { id: 'cat1', name: 'Mountains' },
      { id: 'cat2', name: 'Nature' },
    ],
    featured: true,
  };

  return (
    <div className="card-examples">
      <h1>Card Component Examples</h1>
      
      <h2>Base Card Examples</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Simple Base Card */}
        <BaseCard
          title="Simple Card"
          description="This is a basic card with minimal properties"
          primaryAction={{
            label: 'Learn More',
            href: '#',
          }}
        />
        
        {/* Base Card with image */}
        <BaseCard
          title="Card with Image"
          description="This card includes an image and a secondary action"
          imageUrl="/images/hotel-1.jpg"
          imageAlt="Sample image"
          primaryAction={{
            label: 'View Details',
            href: '#',
          }}
          secondaryAction={{
            label: 'Save',
            onClick: () => console.log('Saved'),
          }}
        />
        
        {/* Base Card with tags and metadata */}
        <BaseCard
          title="Advanced Card"
          description="This card demonstrates tags and metadata"
          imageUrl="/images/hotel-2.jpg"
          imageAlt="Another sample image"
          tags={[
            { id: 't1', name: 'Featured' },
            { id: 't2', name: 'New', color: '#22c55e' },
          ]}
          metadata={[
            <span key="location">📍 Berlin, Germany</span>,
            <span key="price">💰 €250/night</span>,
          ]}
          primaryAction={{
            label: 'Book Now',
            href: '#',
          }}
        />
      </div>
      
      <h2 className="mt-12">Hotel Card Examples</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Default Hotel Card */}
        <HotelCard hotel={exampleHotel} />
        
        {/* Horizontal Layout Hotel Card */}
        <div className="col-span-2">
          <HotelCard 
            hotel={exampleHotel} 
            layout="horizontal"
          />
        </div>
        
        {/* Hotel Card with Limited Info */}
        <HotelCard 
          hotel={exampleHotel} 
          showPrice={false}
          showDescription={false}
        />
      </div>
      
      <h2 className="mt-12">Destination Card Examples</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Default Destination Card */}
        <DestinationCard destination={exampleDestination} />
        
        {/* Overlay Layout Destination Card */}
        <DestinationCard 
          destination={exampleDestination}
          layout="overlay"
          imageSize="full"
        />
        
        {/* Destination Card with Limited Info */}
        <DestinationCard 
          destination={exampleDestination}
          showDescription={false}
          showHotelCount={false}
        />
      </div>
    </div>
  );
};

export default CardExamples;