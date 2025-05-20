// @ts-nocheck
import { loadHotel, loadHotelSlugs, REVALIDATE } from '../../../lib/dataLoaders';
import HotelDetailPage from '../../../components/hotels/HotelDetailPage';
import { notFound } from 'next/navigation';

// Generate static paths for all hotels
export async function generateStaticParams() {
  const slugs = await loadHotelSlugs();
  return slugs.map(slug => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const hotel = await loadHotel(params.slug);
  
  if (!hotel) {
    return {
      title: 'Hotel nicht gefunden',
      description: 'Das angeforderte Hotel konnte nicht gefunden werden'
    };
  }
  
  return {
    title: hotel.meta_title || `${hotel.name} | CinCin Hotels`,
    description: hotel.meta_description || hotel.short_description
  };
}

// Hotel detail page component
export default async function HotelPage({ params }: { params: { slug: string } }) {
  const hotel = await loadHotel(params.slug);
  
  if (!hotel) {
    notFound();
  }
  
  return <HotelDetailPage hotel={hotel} />;
}

// Set revalidation interval (5 minutes)
export const revalidate = REVALIDATE.HOTEL;