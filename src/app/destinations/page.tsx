import { Metadata } from 'next';
import { loadDestinations, loadCategories, REVALIDATE } from '../../lib/dataLoaders';
import DestinationList from '../../components/destinations/DestinationList';
import Hero from '../../components/destinations/Hero';

export const metadata: Metadata = {
  title: 'Destinations | CinCin Hotels & Resorts',
  description: 'Discover our curated selection of exceptional destinations at CinCin Hotels & Resorts',
};

export const revalidate = REVALIDATE.DESTINATIONS;

interface SearchParams {
  category?: string;
  region?: string;
}

export default async function DestinationsPage({ 
  searchParams 
}: { 
  searchParams: SearchParams 
}) {
  // Extract query parameters
  const categoryId = searchParams?.category;
  const region = searchParams?.region;
  
  // Load data with filters if provided
  const [destinations, categories] = await Promise.all([
    loadDestinations({
      categories: categoryId ? [categoryId] : undefined,
      region
    }),
    loadCategories({ type: 'destination' })
  ]);

  return (
    <main>
      <Hero />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Our Destinations</h1>
        <DestinationList 
          initialDestinations={destinations}
          categories={categories}
        />
      </div>
    </main>
  );
}