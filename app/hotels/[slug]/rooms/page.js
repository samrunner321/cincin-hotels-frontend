import { notFound } from 'next/navigation';
import { getHotelBySlug } from '../../../../lib/api';
import HotelDetailPage from '../../../../components/hotel-detail/HotelDetailPage';

export const metadata = {
  title: 'Rooms & Suites - CinCin Hotels',
  description: 'Browse our selection of luxury rooms and suites',
};

export default async function HotelRoomsPage({ params }) {
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
    metadata.title = `Rooms & Suites at ${hotel.name} - CinCin Hotels`;
    metadata.description = `Browse our selection of luxury rooms and suites at ${hotel.name}.`;
    
    return (
      <HotelDetailPage hotel={hotel} />
    );
  } catch (error) {
    console.error('Error fetching hotel data:', error);
    return notFound();
  }
}