// @ts-nocheck
import { loadHotels, loadCategories, REVALIDATE } from '../../lib/dataLoaders';
import HotelList from '../../components/hotels/HotelList';
import CategoryBar from '../../../components/hotels/CategoryBar';

// Generate metadata for SEO
export function generateMetadata() {
  return {
    title: 'Unsere Hotels | CinCin Hotels',
    description: 'Entdecken Sie unsere kuratierte Auswahl an einzigartigen Hotels in den schönsten Destinationen Europas.'
  };
}

// Hotels overview page component
export default async function HotelsPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Extract category filter from search params
  const categoryFilter = searchParams.category as string;
  
  // Load hotels and categories in parallel
  const [hotels, categories] = await Promise.all([
    loadHotels({
      categories: categoryFilter ? [categoryFilter] : undefined
    }),
    loadCategories({ type: 'hotel' })
  ]);
  
  return (
    <main>
      <CategoryBar categories={categories as any} activeCategory={categoryFilter as any} />
      <HotelList hotels={hotels} />
    </main>
  );
}

// Set revalidation interval (5 minutes)
export const revalidate = REVALIDATE.HOTELS;