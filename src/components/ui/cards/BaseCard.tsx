import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import DirectusImage from '../../common/DirectusImage';
import styles from './BaseCard.module.css';

export interface BaseCardProps {
  // Core props
  id?: string;
  className?: string;
  title: string;
  subtitle?: string;
  description?: string;
  link?: string;
  onClick?: () => void;
  
  // Image props
  imageUrl?: string;
  imageAlt?: string;
  directusImage?: {
    id: string;
    title?: string;
  };
  imageSize?: 'small' | 'medium' | 'large' | 'full';
  aspectRatio?: 'portrait' | 'landscape' | 'square';
  
  // Feature flags
  showAnimation?: boolean;
  truncateDescription?: boolean;
  truncateLength?: number;
  
  // Content options
  tags?: Array<{ id: string; name: string; color?: string }>;
  badges?: JSX.Element[];
  metadata?: JSX.Element[];
  
  // Layout options
  layout?: 'vertical' | 'horizontal' | 'overlay';
  imagePosition?: 'left' | 'right' | 'top' | 'bottom';
  contentAlignment?: 'left' | 'center' | 'right';
  
  // Action elements
  primaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  
  // Children for custom content
  children?: React.ReactNode;
}

const BaseCard: React.FC<BaseCardProps> = ({
  id,
  className = '',
  title,
  subtitle,
  description,
  link,
  onClick,
  imageUrl,
  imageAlt,
  directusImage,
  imageSize = 'medium',
  aspectRatio = 'landscape',
  showAnimation = false,
  truncateDescription = false,
  truncateLength = 150,
  tags = [],
  badges = [],
  metadata = [],
  layout = 'vertical',
  imagePosition = 'top',
  contentAlignment = 'left',
  primaryAction,
  secondaryAction,
  children,
}) => {
  // Handle image sizing
  const imageStyles: Record<string, Record<string, string>> = {
    small: {
      width: '100%',
      height: aspectRatio === 'portrait' ? '240px' : aspectRatio === 'square' ? '180px' : '120px',
    },
    medium: {
      width: '100%',
      height: aspectRatio === 'portrait' ? '320px' : aspectRatio === 'square' ? '240px' : '180px',
    },
    large: {
      width: '100%',
      height: aspectRatio === 'portrait' ? '420px' : aspectRatio === 'square' ? '320px' : '240px',
    },
    full: {
      width: '100%',
      height: aspectRatio === 'portrait' ? '520px' : aspectRatio === 'square' ? '400px' : '300px',
    },
  };

  // Layout classes based on options
  const containerClasses = `${styles.baseCard} ${styles[`${layout}Layout`]} ${styles[`content${contentAlignment.charAt(0).toUpperCase() + contentAlignment.slice(1)}`]} ${className}`;
  
  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { y: -8, transition: { duration: 0.3 } },
  };
  
  // Truncate description if needed
  const displayDescription = truncateDescription && description && description.length > truncateLength
    ? `${description.substring(0, truncateLength)}...`
    : description;

  // Wrap with Link if provided
  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (link) {
      return (
        <Link href={link} className={styles.cardLink} onClick={onClick}>
          {children}
        </Link>
      );
    }
    return (
      <div onClick={onClick}>
        {children}
      </div>
    );
  };

  // Render image based on source (local or directus)
  const renderImage = () => {
    if (directusImage) {
      return (
        <DirectusImage
          fileId={directusImage.id}
          alt={imageAlt || directusImage.title || title}
          className={styles.cardImage}
          objectFit="cover"
        />
      );
    } else if (imageUrl) {
      return (
        <Image
          src={imageUrl}
          alt={imageAlt || title}
          fill
          className={`${styles.cardImage} object-cover`}
        />
      );
    }
    return null;
  };

  // Render tag list
  const renderTags = () => {
    if (tags.length === 0) return null;
    
    return (
      <div className={styles.cardTags}>
        {tags.map((tag) => (
          <span 
            key={tag.id} 
            className={styles.cardTag}
            style={tag.color ? { backgroundColor: tag.color } : undefined}
          >
            {tag.name}
          </span>
        ))}
      </div>
    );
  };

  // Render badge elements
  const renderBadges = () => {
    if (badges.length === 0) return null;
    
    return (
      <div className={styles.cardBadges}>
        {badges.map((badge, index) => (
          <div key={index} className={styles.cardBadge}>
            {badge}
          </div>
        ))}
      </div>
    );
  };

  // Render metadata elements
  const renderMetadata = () => {
    if (metadata.length === 0) return null;
    
    return (
      <div className={styles.cardMetadata}>
        {metadata.map((item, index) => (
          <div key={index} className={styles.metadataItem}>
            {item}
          </div>
        ))}
      </div>
    );
  };

  // Render action buttons
  const renderActions = () => {
    if (!primaryAction && !secondaryAction) return null;
    
    return (
      <div className={styles.cardActions}>
        {primaryAction && (
          primaryAction.href ? (
            <Link href={primaryAction.href} className={styles.primaryAction}>
              {primaryAction.label}
            </Link>
          ) : (
            <button onClick={primaryAction.onClick} className={styles.primaryAction}>
              {primaryAction.label}
            </button>
          )
        )}
        
        {secondaryAction && (
          secondaryAction.href ? (
            <Link href={secondaryAction.href} className={styles.secondaryAction}>
              {secondaryAction.label}
            </Link>
          ) : (
            <button onClick={secondaryAction.onClick} className={styles.secondaryAction}>
              {secondaryAction.label}
            </button>
          )
        )}
      </div>
    );
  };

  // Main render
  const cardContent = (
    <>
      {/* Image section */}
      {(imageUrl || directusImage) && (
        <div className={styles.cardImageContainer} style={imageStyles[imageSize]}>
          {renderImage()}
          {renderBadges()}
        </div>
      )}
      
      {/* Content section */}
      <div className={styles.cardContent}>
        {renderTags()}
        
        <h3 className={styles.cardTitle}>{title}</h3>
        
        {subtitle && <h4 className={styles.cardSubtitle}>{subtitle}</h4>}
        
        {displayDescription && (
          <p className={styles.cardDescription}>{displayDescription}</p>
        )}
        
        {renderMetadata()}
        {renderActions()}
        
        {/* Custom content */}
        {children}
      </div>
    </>
  );

  // Apply animations if enabled
  if (showAnimation) {
    return (
      <CardWrapper>
        <motion.div
          id={id}
          className={containerClasses}
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
        >
          {cardContent}
        </motion.div>
      </CardWrapper>
    );
  }

  // No animation version
  return (
    <CardWrapper>
      <div id={id} className={containerClasses}>
        {cardContent}
      </div>
    </CardWrapper>
  );
};

export default BaseCard;