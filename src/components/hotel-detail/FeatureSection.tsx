import React from 'react';
import BaseSection from '../ui/BaseSection';
import styles from './FeatureSection.module.css';

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon?: string;
  image?: {
    id: string;
    title?: string;
  };
}

export interface FeatureSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  features: Feature[];
  layout?: 'grid' | 'list' | 'alternating';
  columnsPerRow?: 2 | 3 | 4;
  showIcons?: boolean;
  showImages?: boolean;
  backgroundColor?: string;
  className?: string;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({
  title = 'Features & Amenities',
  subtitle,
  description,
  features,
  layout = 'grid',
  columnsPerRow = 3,
  showIcons = true,
  showImages = false,
  backgroundColor,
  className = '',
}) => {
  // Class for feature grid based on columns per row
  const gridClass = `grid-cols-1 md:grid-cols-2 lg:grid-cols-${columnsPerRow}`;
  
  // Render feature item
  const renderFeatureItem = (feature: Feature, index: number) => {
    return (
      <div 
        key={feature.id} 
        className={`${styles.featureItem} ${layout === 'alternating' && index % 2 !== 0 ? styles.featureReversed : ''}`}
      >
        {showIcons && feature.icon && (
          <div className={styles.featureIcon}>
            <i className={feature.icon}></i>
          </div>
        )}
        
        {showImages && feature.image && (
          <div className={styles.featureImage}>
            <img 
              src={`/api/assets/${feature.image.id}`} 
              alt={feature.image.title || feature.title} 
            />
          </div>
        )}
        
        <div className={styles.featureContent}>
          <h3 className={styles.featureTitle}>{feature.title}</h3>
          <p className={styles.featureDescription}>{feature.description}</p>
        </div>
      </div>
    );
  };

  // Render features based on layout
  const renderFeatures = () => {
    if (layout === 'grid') {
      return (
        <div className={`grid ${gridClass} gap-8`}>
          {features.map((feature) => renderFeatureItem(feature, 0))}
        </div>
      );
    }
    
    if (layout === 'list') {
      return (
        <div className={styles.featureList}>
          {features.map((feature) => renderFeatureItem(feature, 0))}
        </div>
      );
    }
    
    if (layout === 'alternating') {
      return (
        <div className={styles.alternatingFeatures}>
          {features.map((feature, index) => renderFeatureItem(feature, index))}
        </div>
      );
    }
    
    return null;
  };

  return (
    <BaseSection
      title={title}
      subtitle={subtitle}
      description={description}
      backgroundColor={backgroundColor}
      padding="large"
      spacing="medium"
      width="container"
      className={`${styles.featureSection} ${className}`}
    >
      {renderFeatures()}
    </BaseSection>
  );
};

export default FeatureSection;