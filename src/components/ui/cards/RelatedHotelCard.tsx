import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import BaseCard, { BaseCardProps } from './BaseCard';
import styles from './RelatedHotelCard.module.css';

export interface RelatedHotelCardProps {
  hotel: {
    id: string;
    name: string;
    slug: string;
    location?: {
      city?: string;
      country?: string;
    };
    image?: {
      id: string;
      title?: string;
    };
    categories?: Array<{
      id: string;
      name: string;
      color?: string;
    }>;
    // Fields specific to related hotels
    distance?: number;
    distanceUnit?: 'km' | 'mi';
    relationshipType?: 'nearby' | 'similar' | 'recommended' | 'popular';
    relationshipScore?: number; // 0-100 score for relevance
    relationshipReason?: string; // e.g. "Similar amenities", "Near your destination"
  };
  showRelationshipReason?: boolean;
  showDistance?: boolean;
  showLocation?: boolean;
  showCategory?: boolean;
  layout?: 'vertical' | 'horizontal';
  showAnimation?: boolean;
  className?: string;
}

const RelatedHotelCard: React.FC<RelatedHotelCardProps> = ({
  hotel,
  showRelationshipReason = true,
  showDistance = true,
  showLocation = true,
  showCategory = true,
  layout = 'horizontal',
  showAnimation = true,
  className = '',
}) => {
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

  if (showDistance && hotel.distance !== undefined) {
    metadata.push(
      <div key="distance" className={styles.distance}>
        <span>
          {hotel.distance} {hotel.distanceUnit || 'km'}
        </span>
      </div>
    );
  }

  // Create badges
  const badges: JSX.Element[] = [];
  if (hotel.relationshipType) {
    badges.push(
      <div key="relationshipType" className={`${styles.relationshipBadge} ${styles[hotel.relationshipType]}`}>
        {hotel.relationshipType.charAt(0).toUpperCase() + hotel.relationshipType.slice(1)}
      </div>
    );
  }

  // Create subtitle from relationship reason or categories
  let subtitle = '';
  if (showRelationshipReason && hotel.relationshipReason) {
    subtitle = hotel.relationshipReason;
  } else if (showCategory && hotel.categories && hotel.categories.length > 0) {
    subtitle = hotel.categories.map(category => category.name).join(', ');
  }

  // Map to BaseCard props
  const baseCardProps: BaseCardProps = {
    id: `related-hotel-card-${hotel.id}`,
    className: `${styles.relatedHotelCard} ${className}`,
    title: hotel.name,
    subtitle,
    link: `/hotels/${hotel.slug}`,
    directusImage: hotel.image,
    imageAlt: `${hotel.name} - ${hotel.location?.city || ''}`,
    badges,
    metadata,
    layout,
    showAnimation,
    imagePosition: layout === 'horizontal' ? 'left' : 'top',
    primaryAction: {
      label: 'View Hotel',
      href: `/hotels/${hotel.slug}`,
    },
  };

  return <BaseCard {...baseCardProps} />;
};

export default RelatedHotelCard;