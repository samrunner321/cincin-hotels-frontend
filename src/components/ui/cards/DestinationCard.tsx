import React from 'react';
import { FaMapMarkerAlt, FaHotel } from 'react-icons/fa';
import BaseCard, { BaseCardProps } from './BaseCard';
import styles from './DestinationCard.module.css';

export interface DestinationCardProps {
  destination: {
    id: string;
    name: string;
    slug: string;
    location?: {
      country?: string;
      region?: string;
    };
    description?: string;
    image?: {
      id: string;
      title?: string;
    };
    hotelCount?: number;
    attractionCount?: number;
    categories?: Array<{
      id: string;
      name: string;
      color?: string;
    }>;
    featured?: boolean;
  };
  showAnimation?: boolean;
  layout?: 'vertical' | 'horizontal' | 'overlay';
  showHotelCount?: boolean;
  showAttractionCount?: boolean;
  showLocation?: boolean;
  showDescription?: boolean;
  imageSize?: 'small' | 'medium' | 'large' | 'full';
  className?: string;
}

const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  showAnimation = true,
  layout = 'vertical',
  showHotelCount = true,
  showAttractionCount = false,
  showLocation = true,
  showDescription = true,
  imageSize = 'medium',
  className = '',
}) => {
  // Build metadata items
  const metadata: JSX.Element[] = [];

  if (showLocation && (destination.location?.country || destination.location?.region)) {
    metadata.push(
      <div key="location" className={styles.location}>
        <FaMapMarkerAlt />
        <span>
          {[destination.location?.region, destination.location?.country]
            .filter(Boolean)
            .join(', ')}
        </span>
      </div>
    );
  }

  if (showHotelCount && destination.hotelCount !== undefined) {
    metadata.push(
      <div key="hotelCount" className={styles.hotelCount}>
        <FaHotel />
        <span>
          {destination.hotelCount} {destination.hotelCount === 1 ? 'Hotel' : 'Hotels'}
        </span>
      </div>
    );
  }

  // Add featured badge if the destination is featured
  const badges: JSX.Element[] = [];
  if (destination.featured) {
    badges.push(
      <div className={styles.featuredBadge} key="featured">Featured</div>
    );
  }

  // Map to BaseCard props
  const baseCardProps: BaseCardProps = {
    id: `destination-card-${destination.id}`,
    className: `${styles.destinationCard} ${className}`,
    title: destination.name,
    description: showDescription ? destination.description : undefined,
    link: `/destinations/${destination.slug}`,
    directusImage: destination.image,
    imageAlt: `${destination.name} - ${destination.location?.country || ''}`,
    imageSize,
    tags: destination.categories,
    badges,
    metadata,
    layout,
    showAnimation,
    truncateDescription: true,
    truncateLength: 120,
    primaryAction: {
      label: 'Explore',
      href: `/destinations/${destination.slug}`,
    },
  };

  // If layout is overlay, add additional props
  if (layout === 'overlay') {
    baseCardProps.contentAlignment = 'left';
    baseCardProps.imageSize = 'full';
  }

  return <BaseCard {...baseCardProps} />;
};

export default DestinationCard;