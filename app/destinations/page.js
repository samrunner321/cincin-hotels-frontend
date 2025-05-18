import DestinationsHero from '../../components/destinations/Hero';
import DestinationExplorer from '../../components/destinations/DestinationExplorer';
import FeaturedDestination from '../../components/destinations/FeaturedDestination';
import PopularHotels from '../../components/destinations/PopularHotels';
import Newsletter from '../../components/home/NewsletterSignup';
import dynamic from 'next/dynamic';

// Dynamisches Importieren für die interaktive Features Komponente
const DestinationInteractiveFeatures = dynamic(() => import('../../components/destinations/DestinationInteractiveFeatures'), { ssr: false });

export const metadata = {
  title: 'Destinations | CinCin Hotels',
  description: 'Discover unique destinations across the globe, each with its own charm, culture, and carefully selected accommodations.',
};

export default function DestinationsPage() {
  return (
    <>
      <DestinationsHero />
      <FeaturedDestination />
      <DestinationExplorer />
      <DestinationInteractiveFeatures />
      <PopularHotels />
      <Newsletter />
    </>
  );
}