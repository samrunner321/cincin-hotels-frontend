import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { getHotelBySlug } from '../../../../src/lib/api';
import { Suspense } from 'react';

// Use the placeholder hotel rooms page component
const HotelRoomsPage = dynamic(
  () => import('../../../../src/components/hotel-detail/HotelRoomsPage'),
  { ssr: false, loading: () => <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-12 w-12 border-4 border-gray-200 rounded-full border-t-black"></div></div> }
);

export const revalidate = 3600; // Revalidate every hour

export const generateMetadata = async ({ params }) => {
  try {
    const { slug } = params;
    const result = await getHotelBySlug(slug, 'en-US');
    const hotel = result?.data;
    
    if (!hotel) {
      return {
        title: 'Rooms & Suites - CinCin Hotels',
        description: 'Browse our selection of luxury rooms and suites',
      };
    }
    
    return {
      title: `Rooms & Suites at ${hotel.name} - CinCin Hotels`,
      description: `Browse our selection of luxury rooms and suites at ${hotel.name}.`,
      openGraph: {
        title: `Rooms & Suites at ${hotel.name} - CinCin Hotels`,
        description: `Browse our selection of luxury rooms and suites at ${hotel.name}.`,
        images: [
          {
            url: hotel.main_image_url || '/images/og-hotel-rooms.jpg',
            width: 1200,
            height: 630,
            alt: `Rooms & Suites at ${hotel.name}`,
          },
        ],
      },
    };
  } catch (error) {
    return {
      title: 'Rooms & Suites - CinCin Hotels',
      description: 'Browse our selection of luxury rooms and suites',
    };
  }
};

export default async function HotelRoomsRoute({ params }) {
  try {
    // Fetch hotel data from API
    const { slug } = params;
    
    // Use the server-side function to fetch hotel data
    const result = await getHotelBySlug(slug, 'en-US');
    const hotel = result?.data;
    
    // If no hotel found, return 404
    if (!hotel) {
      return notFound();
    }
    
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-12 w-12 border-4 border-gray-200 rounded-full border-t-black"></div></div>}>
        <HotelRoomsPage hotel={hotel} />
      </Suspense>
    );
  } catch (error) {
    console.error('Error fetching hotel data:', error);
    return notFound();
  }
}