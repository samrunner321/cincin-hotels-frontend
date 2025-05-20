import { cransMontanaData } from './crans-montana-data';
import DestinationHero from '../../../src/components/destinations/detail/DestinationHero';
// Create temporary placeholders for missing components
import dynamic from 'next/dynamic';

// Create simple placeholder components for missing components
const DestinationContentTabs = () => <div className="py-6 px-4 bg-gray-50 rounded-lg text-center">Content Tabs Component Loading...</div>;
const OverviewSection = ({ destination }) => (
  <div className="py-12 px-6 bg-gray-50 rounded-lg">
    <h2 className="text-2xl font-semibold mb-4">Overview</h2>
    <p className="mb-4">{destination?.longDescription || 'No description available'}</p>
  </div>
);
const HotelsSection = ({ destination }) => (
  <div className="py-12 px-6 bg-gray-50 rounded-lg">
    <h2 className="text-2xl font-semibold mb-4">Hotels</h2>
    <p className="text-gray-500">{destination?.hotels?.length 
      ? `${destination.hotels.length} hotels available` 
      : 'No hotels available in this area yet'}</p>
  </div>
);
const DiningSection = dynamic(() => 
  import('../../../src/components/destinations/sections/DiningSection').catch(() => () => <div>Dining Loading...</div>)
);
const ActivitiesSection = dynamic(() => 
  import('../../../src/components/destinations/sections/ActivitiesSection').catch(() => () => <div>Activities Loading...</div>)
);
const InfoSection = ({ destination }) => (
  <div className="py-12 px-6 bg-gray-50 rounded-lg">
    <h2 className="text-2xl font-semibold mb-4">Travel Information</h2>
    <p className="text-gray-500">Travel information for {destination.name} will be available soon.</p>
  </div>
);
import RecommendedDestinations from '../../../src/components/destinations/RecommendedDestinations';
import Newsletter from '../../../src/components/home/NewsletterSignup';

// This would typically come from a database or API
const getDestinationData = (slug) => {
  // For now, we only have data for crans-montana
  if (slug === 'crans-montana') {
    return cransMontanaData;
  }
  
  // Placeholder for other destinations
  return {
    name: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    country: 'Unknown',
    description: 'Destination details coming soon...',
    longDescription: 'Full destination details coming soon...',
    image: '/images/hotels/hotel-1.jpg',
    heroImage: '/images/hotels/hotel-1.jpg',
    hotels: [],
    restaurants: [],
    activities: [],
    imageGallery: []
  };
};

export async function generateMetadata({ params }) {
  const { slug } = params;
  const destination = getDestinationData(slug);
  
  return {
    title: `${destination.name}, ${destination.country} | CinCin Hotels`,
    description: destination.description,
  };
}

export default function DestinationPage({ params }) {
  const { slug } = params;
  const destination = getDestinationData(slug);
  
  return (
    <>
      <DestinationHero destination={destination} />
      <DestinationContentTabs />
      
      <div id="content-sections">
        <div id="overview" className="scroll-mt-[var(--total-nav-height,136px)]">
          <OverviewSection destination={destination} />
        </div>
        
        <div id="hotels" className="scroll-mt-[var(--total-nav-height,136px)]">
          <HotelsSection destination={destination} />
        </div>
        
        <div id="dining" className="scroll-mt-[var(--total-nav-height,136px)]">
          <DiningSection destination={destination} />
        </div>
        
        <div id="activities" className="scroll-mt-[var(--total-nav-height,136px)]">
          <ActivitiesSection destination={destination} />
        </div>
        
        <div id="info" className="scroll-mt-[var(--total-nav-height,136px)]">
          <InfoSection destination={destination} />
        </div>
      </div>
      
      <RecommendedDestinations currentSlug={slug} />
      <Newsletter />
    </>
  );
}