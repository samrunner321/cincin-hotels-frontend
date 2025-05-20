import Link from 'next/link';
import Image from 'next/image';
import HotelCard from '../../src/components/hotels/HotelCard';
import { getHotelImage } from '@/utils/image-helpers';

// Re-exportiere die getHotelImage-Funktion für Abwärtskompatibilität
export { getHotelImage };

// Re-exportiere die HotelCard-Komponente
export default HotelCard;