import React from 'react';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import BaseCard, { BaseCardProps } from './BaseCard';
import styles from './HotelCard.module.css';

export interface HotelCardProps {
  hotel: {
    id: string;
    name: string;
    slug: string;
    location?: {
      city?: string;
      country?: string;
    };
    description?: string;
    image?: {
      id: string;
      title?: string;
    };
    rating?: number;
    pricePerNight?: number;
    currency?: string;
    categories?: Array<{
      id: string;
      name: string;
      color?: string;
    }>;
  };
  showAnimation?: boolean;
  layout?: 'vertical' | 'horizontal';
  showPrice?: boolean;
  showRating?: boolean;
  showLocation?: boolean;
  showDescription?: boolean;
  className?: string;
}

const HotelCard: React.FC<HotelCardProps> = ({
  hotel,
  showAnimation = true,
  layout = 'vertical',
  showPrice = true,
  showRating = true,
  showLocation = true,
  showDescription = true,
  className = '',
}) => {
  // Format price if available
  const formattedPrice = hotel.pricePerNight
    ? `${hotel.pricePerNight.toFixed(0)} ${hotel.currency || '€'}`
    : '';

  // Create rating stars
  const renderRatingStars = (): JSX.Element | null => {
    if (!hotel.rating) return null;

    return (
      <div className={styles.ratingContainer}>
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={i < Math.round(hotel.rating || 0) ? styles.activeStar : styles.inactiveStar}
          />
        ))}
        <span className={styles.ratingText}>{hotel.rating.toFixed(1)}</span>
      </div>
    );
  };

  // Build metadata items
  const metadata: JSX.Element[] = [];

  if (showLocation && (hotel.location?.city || hotel.location?.country)) {
    metadata.push(
      <div key="location" className={styles.location}>
        <FaMapMarkerAlt />
        <span>
          {[hotel.location?.city, hotel.location?.country]
            .filter(Boolean)
            .join(', ')}
        </span>
      </div>
    );
  }

  if (showPrice && hotel.pricePerNight) {
    metadata.push(
      <div key="price" className={styles.price}>
        {formattedPrice}
        <span className={styles.perNight}>/night</span>
      </div>
    );
  }

  if (showRating && hotel.rating && renderRatingStars()) {
    const ratingElement = renderRatingStars();
    if (ratingElement) {
      metadata.push(React.cloneElement(ratingElement, { key: "rating" }));
    }
  }

  // Map to BaseCard props
  const baseCardProps: BaseCardProps = {
    id: `hotel-card-${hotel.id}`,
    className: `${styles.hotelCard} ${className}`,
    title: hotel.name,
    description: showDescription ? hotel.description : undefined,
    link: `/hotels/${hotel.slug}`,
    directusImage: hotel.image,
    imageAlt: `${hotel.name} - ${hotel.location?.city || ''}`,
    tags: hotel.categories,
    metadata,
    layout,
    showAnimation,
    truncateDescription: true,
    truncateLength: 120,
    primaryAction: {
      label: 'View Details',
      href: `/hotels/${hotel.slug}`,
    },
  };

  return <BaseCard {...baseCardProps} />;
};

export default HotelCard;