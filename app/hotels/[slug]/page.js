import { notFound } from 'next/navigation';
import { getHotelBySlug } from '../../../lib/api';
import HotelDetailPage from '../../../components/hotel-detail/HotelDetailPage';

export const metadata = {
  title: 'Hotel Detail - CinCin Hotels',
  description: 'Discover our unique hotel in detail',
};

export default async function HotelDetailRoute({ params }) {
  try {
    // Fetch hotel data from API
    const { slug } = params;
    const hotelData = await getHotelBySlug(slug);
    
    // If hotel not found, return 404
    if (!hotelData || !hotelData.data) {
      return notFound();
    }
    
    const hotel = hotelData.data;
    
    // Update metadata dynamically
    metadata.title = `${hotel.name} - CinCin Hotels`;
    metadata.description = hotel.description;
    
    return (
      <HotelDetailPage hotel={hotel} />
    );
  } catch (error) {
    console.error('Error fetching hotel data:', error);
    return notFound();
  }
}

// Generate static paths for all hotels
export async function generateStaticParams() {
  try {
    // In a real implementation, fetch all hotel slugs from API
    // For now, return empty array to allow on-demand generation
    return [];
  } catch (error) {
    console.error('Error generating static paths:', error);
    return [];
  }
}