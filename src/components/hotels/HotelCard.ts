import { getHotelImage } from '../../utils/image-helpers';

// Re-export the getHotelImage function for backward compatibility
export { getHotelImage };

// Import from the real implementation
import RealHotelCard from './HotelCard.tsx';

// This file just serves as a compatibility layer
export default RealHotelCard;