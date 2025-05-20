import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { getHotelBySlug } from '../../../src/lib/api/directus-server';
import { Suspense } from 'react';

// Import the migrated HotelDetailPage component
const HotelDetailPage = dynamic(
  () => import('../../../src/components/hotel-detail/HotelDetailPage'),
  { ssr: false, loading: () => <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-12 w-12 border-4 border-gray-200 rounded-full border-t-black"></div></div> }
);

export const revalidate = 3600; // Revalidate every hour

export const metadata = {
  title: 'Hotel Detail - CinCin Hotels',
  description: 'Explore our handpicked luxury accommodations and book your stay.',
  openGraph: {
    title: 'Hotel Detail - CinCin Hotels',
    description: 'Explore our handpicked luxury accommodations and book your stay.',
    images: [
      {
        url: '/images/og-hotel-detail.jpg',
        width: 1200,
        height: 630,
        alt: 'Hotel Detail - CinCin Hotels',
      },
    ],
  },
};

export default async function HotelDetailRoute({ params }) {
  try {
    // Fetch hotel data from API
    const { slug } = params;
    
    // Use the server-side function to fetch hotel data
    // For now, we'll pass the slug to the client component
    // and let it handle loading UI states
    
    // In production, you might want to fetch basic hotel data on the server
    // and pass it as props to the dynamic component
    const result = await getHotelBySlug(slug, 'en-US');
    const hotel = result?.data;
    
    // If no hotel found, return 404
    if (!hotel) {
      return notFound();
    }
    
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-12 w-12 border-4 border-gray-200 rounded-full border-t-black"></div></div>}>
        <HotelDetailPage hotel={hotel} />
      </Suspense>
    );
  } catch (error) {
    console.error('Error fetching hotel data:', error);
    return notFound();
  }
}