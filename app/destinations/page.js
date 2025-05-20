import DestinationsHero from '../../src/components/destinations/Hero';
import Newsletter from '../../src/components/home/NewsletterSignup';
// Import placeholder components while the actual components are being migrated
import { 
  DestinationExplorer,
  FeaturedDestination,
  PopularHotels,
  DestinationInteractiveFeatures
} from '../../src/components/destinations/placeholders';

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