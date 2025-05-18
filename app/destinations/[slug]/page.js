import { cransMontanaData } from './crans-montana-data';
import DestinationHero from '../../../components/destinations/detail/DestinationHero';
import DestinationContentTabs from '../../../components/destinations/detail/DestinationContentTabs';
import OverviewSection from '../../../components/destinations/detail/OverviewSection';
import HotelsSection from '../../../components/destinations/detail/HotelsSection';
import DiningSection from '../../../components/destinations/detail/DiningSection';
import ActivitiesSection from '../../../components/destinations/detail/ActivitiesSection';
import InfoSection from '../../../components/destinations/detail/InfoSection';
import RecommendedDestinations from '../../../components/destinations/RecommendedDestinations';
import Newsletter from '../../../components/home/NewsletterSignup';

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